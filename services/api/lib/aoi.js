'use strict';

const Err = require('./error');
const moment = require('moment');
const {
    BlobSASPermissions,
    BlobServiceClient
} = require('@azure/storage-blob');

class AOI {
    constructor(config) {
        this.pool = config.pool;
        this.config = config;

        // don't access these services unless AzureStorage is truthy
        if (this.config.AzureStorage) {
            this.blob_client = BlobServiceClient.fromConnectionString(this.config.AzureStorage);
            this.container_client = this.blob_client.getContainerClient('aois');
        }
    }

    /**
     * Ensure a user can only access their own project assets (or is an admin and can access anything)
     *
     * @param {Project} project Instantiated Project class
     * @param {Object} auth req.auth object
     * @param {Number} projectid Project the user is attempting to access
     * @param {Number} aoiid AOI the user is attemping to access
     */
    async has_auth(project, auth, projectid, aoiid) {
        const proj = await project.has_auth(auth, projectid);
        const aoi = await this.get(aoiid);

        if (aoi.project_id !== proj.id) {
            throw new Err(400, null, `AOI #${aoiid} is not associated with project #${projectid}`);
        }

        return aoi;
    }

    /**
     * Return a sharing URL that can be used to titiler
     *
     * @param {Number} aoiid AOI ID to get a share URL for
     */
    async url(aoiid) {
        if (!this.config.AzureStorage) throw new Err(424, null, 'AOI storage not configured');

        const url = new URL(await this.container_client.generateSasUrl({
            permissions: BlobSASPermissions.parse('r').toString(),
            expiresOn: moment().add(365, 'days')
        }));

        url.pathname = `/aois/aoi-${aoiid}.tiff`;

        return url;
    }

    /**
     * Return a Row as a JSON Object
     *
     * @param {Object} row Postgres Database Row
     *
     * @returns {Object}
     */
    static json(row) {
        const def = {
            id: parseInt(row.id),
            name: row.name,
            created: row.created,
            storage: row.storage,
            bookmarked: row.bookmarked,
            project_id: parseInt(row.project_id),
            checkpoint_id: parseInt(row.checkpoint_id),
            patches: row.patches.map((patch) => { return parseInt(patch); }),
            px_stats: row.px_stats
        };

        if (row.hasOwnProperty('classes')) {
            def['classes'] = row.classes;
        }

        if (typeof row.bounds === 'object') {
            def.bounds = row.bounds;
        } else {
            try {
                def.bounds = JSON.parse(row.bounds);
            } catch (err) {
                // Ignore Errors
            }
        }

        return def;
    }

    /**
     * Upload an AOI geotiff and mark the AOI storage property as true
     *
     * @param {Number} aoiid AOI ID to upload to
     * @param {Object} file File Stream to upload
     */
    async upload(aoiid, file) {
        if (!this.config.AzureStorage) throw new Err(424, null, 'AOI storage not configured');

        const blockBlobClient = this.container_client.getBlockBlobClient(`aoi-${aoiid}.tiff`);

        try {
            await blockBlobClient.uploadStream(file, 1024 * 1024 * 4, 1024 * 1024 * 20, {
                blobHTTPHeaders: { blobContentType: 'image/tiff' }
            });
        } catch (err) {
            throw new Err(500, err, 'Failed to upload AOI');
        }

        return await this.patch(aoiid, {
            storage: true
        });
    }

    /**
     * Download an AOI geotiff fabric
     *
     * @param {Number} aoiid AOI ID to check for existance
     */
    async exists(aoiid) {
        if (!this.config.AzureStorage) throw new Err(424, null, 'AOI storage not configured');

        const aoi = await this.get(aoiid);
        if (!aoi.storage) throw new Err(404, null, 'AOI has not been uploaded');

        const blob_client = this.container_client.getBlockBlobClient(`aoi-${aoiid}.tiff`);
        return await blob_client.exists();
    }

    /**
     * Download an AOI geotiff fabric
     *
     * @param {Number} aoiid AOI ID to download
     * @param {Stream} res Stream to pipe geotiff to (usually express response object)
     */
    async download(aoiid, res) {
        if (!this.config.AzureStorage) throw new Err(424, null, 'AOI storage not configured');

        const aoi = await this.get(aoiid);
        if (!aoi.storage) throw new Err(404, null, 'AOI has not been uploaded');

        const blob_client = this.container_client.getBlockBlobClient(`aoi-${aoiid}.tiff`);
        const dwn = await blob_client.download(0);

        dwn.readableStreamBody.pipe(res);
    }

    /**
     * Delete an AOI
     *
     * @param {Number} aoiid - Specific AOI id
     */
    async delete(aoiid) {
        let pgres;
        try {
            pgres = await this.pool.query(`
                UPDATE aois
                    SET
                        archived = true
                    WHERE
                        id = $1
                    RETURNING *
            `, [
                aoiid
            ]);
        } catch (err) {
            throw new Err(500, new Error(err), 'Failed to delete AOI');
        }

        if (!pgres.rows.length) throw new Err(404, null, 'AOI not found');

        return true;
    }

    /**
     * Update AOI properties
     *
     * @param {Number} aoiid - Specific AOI id
     * @param {Object} aoi AOI Object
     * @param {Boolean} aoi.storage Has the storage been uploaded
     * @param {String} aoi.name - Human Readable Name
     * @param {Boolean} aoi.bookmarked Has the aoi been bookmarked by the user
     * @param {Number[]} aoi.patches List of patches in order of application on export
     */
    async patch(aoiid, aoi) {
        let pgres;
        try {
            pgres = await this.pool.query(`
                UPDATE aois
                    SET
                        storage = COALESCE($2, storage),
                        name = COALESCE($3, name),
                        bookmarked = COALESCE($4, bookmarked),
                        patches = COALESCE($5, patches),
                        px_stats = COALESCE($6::JSONB, px_stats)
                    WHERE
                        id = $1
                    RETURNING *
            `, [
                aoiid,
                aoi.storage,
                aoi.name,
                aoi.bookmarked,
                aoi.patches,
                JSON.stringify(aoi.px_stats)
            ]);
        } catch (err) {
            throw new Err(500, new Error(err), 'Failed to update AOI');
        }

        if (!pgres.rows.length) throw new Err(404, null, 'AOI not found');

        return AOI.json(pgres.rows[0]);
    }

    /**
     * Return a single aoi
     *
     * @param {Number} aoiid - Specific AOI id
     */
    async get(aoiid) {
        let pgres;
        try {
            pgres = await this.pool.query(`
               SELECT
                    a.id AS id,
                    a.name AS name,
                    ST_AsGeoJSON(a.bounds)::JSON AS bounds,
                    a.project_id AS project_id,
                    a.bookmarked AS bookmarked,
                    a.checkpoint_id AS checkpoint_id,
                    a.created AS created,
                    a.storage AS storage,
                    a.patches AS patches,
                    a.px_stats AS px_stats,
                    c.classes as classes
                FROM
                    aois a,
                    checkpoints c
                WHERE
                    a.id = $1
                AND
                    a.checkpoint_id = c.id
                AND
                    a.archived = false
            `, [
                aoiid
            ]);
        } catch (err) {
            throw new Err(500, new Error(err), 'Failed to get AOI');
        }

        if (!pgres.rows.length) throw new Err(404, null, 'AOI not found');

        return AOI.json(pgres.rows[0]);
    }

    /**
     * Return a list of aois
     *
     * @param {Number} projectid - AOIS related to a specific project
     * @param {Object} query - Query Object
     * @param {Number} [query.limit=100] - Max number of results to return
     * @param {Number} [query.page=0] - Page to return
     * @param {Number} [query.checkpointid] - Only return AOIs related to a given Checkpoint
     * @param {String} [query.bookmarked] - Only return AOIs of this bookmarked state. Allowed true or false. By default returns all.
     * @param {String} [query.sort] - Sort AOI list by ascending or descending order of the created timestamp. Allowed asc or desc. Default desc.
     */
    async list(projectid, query) {
        if (!query) query = {};
        if (!query.limit) query.limit = 100;
        if (!query.page) query.page = 0;
        if (!query.sort) query.sort = 'desc';

        if (query.sort !== 'desc' && query.sort !== 'asc') {
            throw new Err(400, null, 'Invalid Sort');
        }

        const where = [];
        where.push(`a.project_id = ${projectid}`);

        if (query.checkpointid && !isNaN(parseInt(query.checkpointid))) {
            where.push('checkpoint_id = ' + query.checkpointid);
        }

        if (query.bookmarked) {
            where.push('a.bookmarked = ' + query.bookmarked);
        }

        let pgres;
        try {
            pgres = await this.pool.query(`
               SELECT
                    count(*) OVER() AS count,
                    a.id AS id,
                    a.name AS name,
                    a.px_stats AS px_stats,
                    a.bookmarked AS bookmarked,
                    ST_AsGeoJSON(a.bounds)::JSON AS bounds,
                    a.created AS created,
                    a.storage AS storage,
                    a.checkpoint_id AS checkpoint_id,
                    c.name AS checkpoint_name,
                    c.classes AS classes
                FROM
                    aois a,
                    checkpoints c
                WHERE
                    a.checkpoint_id = c.id
                    AND a.archived = false
                    AND ${where.join(' AND ')}
                ORDER BY
                    a.created ${query.sort}
                LIMIT
                    $1
                OFFSET
                    $2
            `, [
                query.limit,
                query.page
            ]);
        } catch (err) {
            throw new Err(500, new Error(err), 'Failed to list aois');
        }

        return {
            total: pgres.rows.length ? parseInt(pgres.rows[0].count) : 0,
            project_id: projectid,
            aois: pgres.rows.map((row) => {
                return {
                    id: parseInt(row.id),
                    name: row.name,
                    bookmarked: row.bookmarked,
                    bounds: row.bounds,
                    px_stats: row.px_stats,
                    created: row.created,
                    storage: row.storage,
                    checkpoint_id: row.checkpoint_id,
                    checkpoint_name: row.checkpoint_name,
                    classes: row.classes
                };
            })
        };
    }

    /**
     * Create a new AOI
     *
     * @param {Number} projectid - AOIS related to a specific project
     * @param {Object} aoi - AOI Object
     * @param {Object} aoi.bounds - Bounds GeoJSON
     * @param {Number} aoi.checkpoint_id - Checkpoint ID
     * @param {String} aoi.name - Human Readable Name
     */
    async create(projectid, aoi) {
        let pgres;
        try {
            pgres = await this.pool.query(`
                INSERT INTO aois (
                    project_id,
                    name,
                    checkpoint_id,
                    bounds
                ) VALUES (
                    $1,
                    $2,
                    $3,
                    ST_SetSRID(ST_GeomFromGeoJSON($4), 4326)
                ) RETURNING *
            `, [
                projectid,
                aoi.name,
                aoi.checkpoint_id,
                aoi.bounds
            ]);

        } catch (err) {
            throw new Err(500, err, 'Failed to create aoi');
        }

        pgres.rows[0].bounds = aoi.bounds;
        return AOI.json(pgres.rows[0]);
    }
}

module.exports = {
    AOI
};
