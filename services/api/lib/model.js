'use strict';

const Err = require('./error');
const { BlobServiceClient } = require('@azure/storage-blob');

class Model {
    constructor(pool, config) {
        this.pool = pool;

        // don't access these services unless AzureStorage is truthy
        if (this.config.AzureStorage) {
            this.blob_client = BlobServiceClient.fromConnectionString(this.config.AzureStorage);
            this.container_client = this.blob_client.getContainerClient('models');
        }
    }

    /**
     * Create a new model
     */
    async create(model, auth) {
        let pgres;

        try {
            pgres = await this.pool.query(`
                INSERT INTO models (
                    created,
                    active,
                    uid,
                    name,
                    model_type,
                    model_finetunelayer,
                    model_numparams,
                    model_inputshape,
                    storage,
                    classes,
                    meta
                ) VALUES (
                    NOW(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
                ) RETURNING *
            `, [
                model.active,
                auth.uid,
                model.name,
                model.model_type,
                model.model_finetunelayer,
                model.numparams,
                model.model_inputshape,
                model.storage,
                JSON.stringify(model.classes),
                model.meta
            ]);
        } catch (err) {
            throw new Err(500, err, 'Internal Model Error');
        }

        return {
            id: parseInt(pgres.rows[0].id),
            created: pgres.rows[0].created
        };
    }

    async upload(model_id) {
        if (!this.config.AzureStorage) return new Err(424, null, 'Model storage not configured');

    }

    async download(model_id, res) {
        if (!this.config.AzureStorage) return new Err(424, null, 'Model storage not configured');

        this.blob = this.container_client.getBlockBlobClient(`${model_id}.h5`);
    }

    async list() {
        let pgres;

        try {
            pgres = await this.pool.query(`
                SELECT
                    id,
                    created,
                    active,
                    uid,
                    name
                FROM
                    models
                WHERE
                    active = true
            `, []);
        } catch (err) {
            throw new Err(500, err, 'Internal Model Error');
        }

        if (!pgres.rows.length) throw new Err(404, null, 'No model found');

        return {
            id: parseInt(pgres.rows[0].id),
            created: pgres.rows[0].created,
            active: pgres.rows[0].active,
            name: pgres.rows[0].name
        };
    }

    /**
     * Retrieve information about a model
     */
    async get(id) {
        let pgres;

        try {
            pgres = await this.pool.query(`
                SELECT
                    id,
                    created,
                    active,
                    uid,
                    name,
                    model_type,
                    model_finetunelayer,
                    model_numparams,
                    model_inputshape,
                    storage,
                    classes,
                    meta
                FROM
                    models
                WHERE
                    id = $1
            `, [id]);
        } catch (err) {
            throw new Err(500, err, 'Internal Model Error');
        }

        if (!pgres.rows.length) throw new Err(404, null, 'No model found');

        return {
            id: parseInt(pgres.rows[0].id),
            created: pgres.rows[0].created,
            active: pgres.rows[0].active,
            uid: pgres.rows[0].uid,
            name: pgres.rows[0].name,
            model_type: pgres.rows[0].model_type,
            model_finetunelayer: pgres.rows[0].model_findtunelayer,
            model_numparams: pgres.rows[0].numparams,
            model_inputshape: pgres.rows[0].model_inputshape,
            storage: pgres.rows[0].storage,
            classes: pgres.rows[0].classes,
            meta: pgres.rows[0].meta
        };
    }

    /**
     * Set a model as inactive and unusable
     */
    async delete(id) {
        try {
            await this.pool.query(`
                UPDATE
                    model
                SET
                    active = false
                WHERE
                    id = $1
                RETURNING *
            `, [id]);
        } catch (err) {
            throw new Err(500, err, 'Internal Model Error');
        }

        if (!pgres.rows.length) throw new Err(404, null, 'No model found');

        return {
            id: parseInt(pgres.rows[0].id),
            created: pgres.rows[0].created,
            active: pgres.rows[0].active
        };
    }
}

module.exports = {
    Model
};
