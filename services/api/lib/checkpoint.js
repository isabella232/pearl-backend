'use strict';

const Err = require('./error');
const { BlobServiceClient } = require('@azure/storage-blob');

class CheckPoint {
    constructor(config) {
        this.pool = config.pool;
        this.config = config;

        // don't access these services unless AzureStorage is truthy
        if (this.config.AzureStorage) {
            this.blob_client = BlobServiceClient.fromConnectionString(this.config.AzureStorage);
            this.container_client = this.blob_client.getContainerClient('checkpoints');
        }
    }

    /**
     * Ensure a user can only access their own project assets (or is an admin and can access anything)
     *
     * @param {Project} project Instantiated Project class
     * @param {Object} auth req.auth object
     * @param {Number} projectid Project the user is attempting to access
     * @param {Number} checkpointid Checkpoint the user is attemping to access
     */
    async has_auth(project, auth, projectid, checkpointid) {
        const proj = await project.has_auth(auth, projectid);
        const checkpoint = await this.get(checkpointid);

        if (checkpoint.project_id !== proj.id) {
            throw new Err(400, null, `Checkpoint #${checkpointid} is not associated with project #${projectid}`);
        }

        return checkpoint;
    }

    /**
     * Return a Row as a JSON Object
     *
     * @param {Object} row Postgres Database Row
     *
     * @returns {Object}
     */
    static json(row) {
        const chpt = {
            id: parseInt(row.id),
            project_id: parseInt(row.project_id),
            name: row.name,
            bookmarked: row.bookmarked,
            classes: row.classes,
            created: row.created,
            storage: row.storage,
            analytics: row.analytics
        };

        if (row.geoms) {
            chpt.geoms = row.geoms;

            const counts = row.geoms.filter((geom) => {
                if (!geom) return false;
                if (!geom.coordinates.length) return false;
                return true;
            }).length;

            if (counts && row.bounds) {
                chpt.bounds = row.bounds.replace(/(BOX|\(|\))/g, '').split(',').join(' ').split(' ').map((cd) => {
                    return Number(cd);
                });
            }

            if (counts && row.center) {
                chpt.center = row.center.replace(/(POINT|\(|\))/g, '').split(' ').map((cd) => {
                    return Number(cd);
                });
            }
        }

        return chpt;
    }

    /**
     * Return a list of checkpoints for a given instance
     *
     * @param {Number} projectid Project ID to list checkpoints for
     *
     * @param {Object} query - Query Object
     * @param {Number} [query.limit=100] - Max number of checkpoints to return
     * @param {Number} [query.page=0] - Page to return
     */
    async list(projectid, query) {
        if (!query) query = {};
        if (!query.limit) query.limit = 100;
        if (!query.page) query.page = 0;

        let pgres;
        try {
            pgres = await this.pool.query(`
               SELECT
                    count(*) OVER() AS count,
                    id,
                    name,
                    created,
                    storage,
                    bookmarked
                FROM
                    checkpoints
                WHERE
                    project_id = $3
                LIMIT
                    $1
                OFFSET
                    $2
            `, [
                query.limit,
                query.page,
                projectid
            ]);
        } catch (err) {
            throw new Err(500, new Error(err), 'Failed to list checkpoints');
        }

        return {
            total: pgres.rows.length ? parseInt(pgres.rows[0].count) : 0,
            project_id: projectid,
            checkpoints: pgres.rows.map((row) => {
                return {
                    id: parseInt(row.id),
                    name: row.name,
                    created: row.created,
                    storage: row.storage,
                    bookmarked: row.bookmarked
                };
            })
        };
    }

    /**
     * Upload a Checkpoint and mark the Checkpoint storage property as true
     *
     * @param {Number} checkpointid Checkpoint ID to upload to
     * @param {Object} file File stream to upload
     */
    async upload(checkpointid, file) {
        if (!this.config.AzureStorage) throw new Err(424, null, 'Checkpoint storage not configured');

        const blockBlobClient = this.container_client.getBlockBlobClient(`checkpoint-${checkpointid}`);

        try {
            await blockBlobClient.uploadStream(file, 1024 * 1024 * 4, 1024 * 1024 * 20, {
                blobHTTPHeaders: { blobContentType: 'application/octet-stream' }
            });
        } catch (err) {
            throw new Err(500, err, 'Failed to uploda Checkpoint');
        }

        return await this.patch(checkpointid, {
            storage: true
        });
    }

    /**
     * Download a Checkpoint Asset
     *
     * @param {Number} checkpointid Checkpoint ID to download
     * @param {Stream} res Stream to pipe model to (usually express response object)
     */
    async download(checkpointid, res) {
        if (!this.config.AzureStorage) throw new Err(424, null, 'Model storage not configured');

        const checkpoint = await this.get(checkpointid);
        if (!checkpoint.storage) throw new Err(404, null, 'Checkpoint has not been uploaded');

        const blob_client = this.container_client.getBlockBlobClient(`checkpoint-${checkpointid}`);
        const dwn = await blob_client.download(0);

        dwn.readableStreamBody.pipe(res);
    }

    /**
     * Update Checkpoint Properties
     *
     * @param {Number} checkpointid - Checkpoint ID
     * @param {Object} checkpoint - Checkpoint Object
     * @param {Boolean} checkpoint.storage Has the storage been uploaded
     * @param {String} checkpoint.name The name of the checkpoint
     * @param {Array} checkpoint.classes Class list to update (only name & color changes - cannot change length)
     */
    async patch(checkpointid, checkpoint) {
        let pgres;

        if (checkpoint.classes) {
            const current = await this.get(checkpointid);
            if (current.classes.length !== checkpoint.classes.length) {
                throw new Err(400, null, 'Cannot change the number of classes once a checkpoint is created');
            }
        }

        try {
            pgres = await this.pool.query(`
                UPDATE checkpoints
                    SET
                        storage = COALESCE($2, storage),
                        name = COALESCE($3, name),
                        bookmarked = COALESCE($4, bookmarked),
                        classes = COALESCE($5::JSONB, classes)
                    WHERE
                        id = $1
                    RETURNING *
            `, [
                checkpointid,
                checkpoint.storage,
                checkpoint.name,
                checkpoint.bookmarked,
                JSON.stringify(checkpoint.classes)
            ]);
        } catch (err) {
            throw new Err(500, new Error(err), 'Failed to update Checkpoint');
        }

        if (!pgres.rows.length) throw new Err(404, null, 'Checkpoint not found');

        return CheckPoint.json(pgres.rows[0]);
    }

    /**
     * Return a single checkpoint
     *
     * @param {Number} checkpointid Checkpoint ID to get
     */
    async get(checkpointid) {
        let pgres;
        try {
            pgres = await this.pool.query(`
                SELECT
                    checkpoints.id,
                    checkpoints.name,
                    checkpoints.classes,
                    checkpoints.created,
                    checkpoints.storage,
                    checkpoints.bookmarked,
                    checkpoints.project_id,
                    checkpoints.analytics,
                    checkpoints.geoms,
                    ST_AsText(ST_Centroid(ST_Envelope(ST_Collect(geom)))) AS center,
                    ST_Extent(geom) AS bounds
                FROM
                    (SELECT id, ST_GeomFromGeoJSON(Unnest(geoms)) as geom FROM checkpoints WHERE id = $1) g,
                    checkpoints
                WHERE
                    checkpoints.id = $1
                GROUP BY
                    g.id,
                    checkpoints.id,
                    checkpoints.name,
                    checkpoints.classes,
                    checkpoints.created,
                    checkpoints.storage,
                    checkpoints.bookmarked,
                    checkpoints.project_id,
                    checkpoints.geoms
            `, [
                checkpointid
            ]);

        } catch (err) {
            throw new Err(500, new Error(err), 'Failed to get checkpoint');
        }

        if (!pgres.rows.length) throw new Err(404, null, 'Checkpoint not found');

        return CheckPoint.json(pgres.rows[0]);
    }

    /**
     * Create a new Checkpoint
     *
     * @param {Number} projectid - Project ID the checkpoint is a part of
     * @param {Object} checkpoint - Checkpoint Object
     * @param {String} checkpoint.name - Human readable name
     * @param {Object[]} checkpoint.classes - Checkpoint Class names
     * @param {Object[]} checkpoint.geoms - GeoJSON MultiPoint Geometries
     * @param {Object} checkpoint.analytics - Checkpoint Analytics
     */
    async create(projectid, checkpoint) {
        try {
            const pgres = await this.pool.query(`
                INSERT INTO checkpoints (
                    project_id,
                    name,
                    classes,
                    geoms,
                    analytics
                ) VALUES (
                    $1,
                    $2,
                    $3::JSONB,
                    $4::JSONB[],
                    $5::JSONB
                ) RETURNING *
            `, [
                projectid,
                checkpoint.name,
                JSON.stringify(checkpoint.classes),
                checkpoint.geoms.map((e) => {
                    return JSON.stringify(e);
                }),
                JSON.stringify(checkpoint.analytics)
            ]);

            return CheckPoint.json(pgres.rows[0]);
        } catch (err) {
            throw new Err(500, err, 'Failed to create checkpoint');
        }
    }

    /**
     * Return a Mapbox Vector Tile of the checkpoint Geom
     *
     * @param {Number} checkpointid - Checkpoint ID
     * @param {Number} z - Z Tile Coordinate
     * @param {Number} x - X Tile Coordinate
     * @param {Number} y - Y Tile Coordinate
     */
    async mvt(checkpointid, z, x, y) {
        let pgres;
        try {
            pgres = await this.pool.query(`
                SELECT
                    ST_AsMVT(q, 'data', 4096, 'geom') AS mvt
                FROM (
                    SELECT
                        ST_AsMVTGeom(
                            geom,
                            ST_TileEnvelope($2, $3, $4),
                            4096,
                            256,
                            false
                        ) AS geom
                    FROM (
                        SELECT
                            id,
                            r.geom
                        FROM (
                            SELECT
                                id,
                                ST_Transform(ST_GeomFromgeoJSON(Unnest(checkpoints.geoms)), 3857) AS geom
                            FROM
                                checkpoints
                            WHERE
                                checkpoints.id = $1
                        ) r
                        WHERE
                            ST_Intersects(
                                geom,
                                ST_TileEnvelope($2, $3, $4)
                            )
                    ) n
                    GROUP BY
                        id,
                        geom
                ) q

            `, [
                checkpointid,
                z, x, y
            ]);
        } catch (err) {
            throw new Err(500, err, 'Failed to create checkpoint MVT');
        }

        return pgres.rows[0].mvt;
    }
}

module.exports = {
    CheckPoint
};
