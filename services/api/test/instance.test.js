const test = require('tape');
const request = require('request');
const Flight = require('./flight');

const flight = new Flight();

flight.init(test);
flight.takeoff(test);
flight.user(test, 'ingalls', true)

test('POST /api/model', async (t) => {
    try {
        await flight.request({
            method: 'POST',
            json: true,
            url: 'http://localhost:2000/api/model',
            body: {
                name: 'NAIP Supervised',
                active: true,
                model_type: 'pytorch_example',
                model_inputshape: [240,240,4],
                model_zoom: 17,
                classes: [
                    { name: 'Water', color: '#0000FF' },
                    { name: 'Tree Canopy', color: '#008000' },
                    { name: 'Field', color: '#80FF80' },
                    { name: 'Built', color: '#806060' }
                ],
                meta: {}
            },
            headers: {
                Authorization: `Bearer ${flight.token.ingalls}`
            }
        }, t);
    } catch (err) {
        t.error(err, 'no error');
    }

    t.end();
});

test('POST /api/project', async (t) => {
    try {
        await flight.request({
            json: true,
            url: 'http://localhost:2000/api/project',
            method: 'POST',
            headers: {
                Authorization: `Bearer ${flight.token.ingalls}`
            },
            body: {
                name: 'Test Project',
                model_id: 1,
                mosaic: 'naip.latest'
            }
        }, t);
    } catch (err) {
        t.error(err, 'no error');
    }

    t.end();
});

test('GET /api/project/1/instance (empty)', async (t) => {
    try {
        const res = await flight.request({
            json: true,
            url: 'http://localhost:2000/api/project/1/instance',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${flight.token.ingalls}`
            }
        });

        t.deepEquals(res.body, {
            total: 0,
            instances: []
        });
    } catch (err) {
        t.error(err, 'no error');
    }

    t.end();
});

test('POST /api/project/1/instance', async (t) => {
    try {
        const res = await flight.request({
            json: true,
            url: 'http://localhost:2000/api/project/1/instance',
            method: 'POST',
            headers: {
                Authorization: `Bearer ${flight.token.ingalls}`
            }
        }, t);

        t.ok(res.body.created, '.created: <date>');
        t.ok(res.body.last_update, '.last_update: <date>');
        t.ok(res.body.token, '.token: <str>');
        delete res.body.created;
        delete res.body.last_update;
        delete res.body.token;

        t.deepEquals(res.body, {
            id: 1,
            project_id: 1,
            batch: null,
            aoi_id: null,
            checkpoint_id: null,
            active: false,
            pod: {},
            type: 'gpu'
        });
    } catch (err) {
        t.error(err, 'no error');
    }

    t.end();
});

test('GET /api/project/1/instance', async (t) => {
    try {
        const res = await flight.request({
            json: true,
            url: 'http://localhost:2000/api/project/1/instance',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${flight.token.ingalls}`
            }
        });

        t.ok(res.body.instances[0].created, '.instances[0].created: <date>');
        delete res.body.instances[0].created;

        t.deepEquals(res.body, {
            total: 1,
            instances: [{
                id: 1,
                active: false,
                batch: null,
                type: 'gpu'
            }]
        });
    } catch (err) {
        t.error(err, 'no error');
    }

    t.end();
});

test('PATCH /api/project/1/instance/1', async (t) => {
    try {
        const res = await flight.request({
            json: true,
            url: 'http://localhost:2000/api/project/1/instance/1',
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${flight.token.ingalls}`
            },
            body: {
                active: true
            }
        }, t);

        t.ok(res.body.created, '.created: <date>');
        t.ok(res.body.last_update, '.last_update: <date>');
        delete res.body.created;
        delete res.body.last_update;

        t.deepEquals(res.body, {
            id: 1,
            project_id: 1,
            batch: null,
            aoi_id: null,
            checkpoint_id: null,
            active: true,
            type: 'gpu'
        });

    } catch (err) {
        t.error(err, 'no error');
    }

    t.end();
});

test('GET /api/project/1/instance?status=active', async (t) => {
    try {
        const res = await flight.request({
            json: true,
            url: 'http://localhost:2000/api/project/1/instance?status=active',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${flight.token.ingalls}`
            }
        });

        t.ok(res.body.instances[0].created, '.instances[0].created: <date>');
        delete res.body.instances[0].created;

        t.deepEquals(res.body, {
            total: 1,
            instances: [{
                id: 1,
                batch: null,
                active: true,
                type: 'gpu'
            }]
        });
    } catch (err) {
        t.error(err, 'no error');
    }

    t.end();
});

test('GET /api/project/1/instance', async (t) => {
    try {
        const res = await flight.request({
            json: true,
            url: 'http://localhost:2000/api/project/1/instance',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${flight.token.ingalls}`
            }
        });

        t.ok(res.body.instances[0].created, '.instances[0].created: <date>');
        delete res.body.instances[0].created;

        t.deepEquals(res.body, {
            total: 1,
            instances: [{
                id: 1,
                active: true,
                batch: null,
                type: 'gpu'
            }]
        });
    } catch (err) {
        t.error(err, 'no error');
    }

    t.end();
});

test('GET /api/project/1/instance/1', async (t) => {
    try {
        const res = await flight.request({
            json: true,
            url: 'http://localhost:2000/api/project/1/instance/1',
            method: 'GET',
            headers: {
                Authorization: `Bearer ${flight.token.ingalls}`
            }
        }, t);

        t.ok(res.body.created, '.created: <date>');
        t.ok(res.body.last_update, '.last_update: <date>');
        t.ok(res.body.token, '.token: <str>');
        delete res.body.created;
        delete res.body.last_update;
        delete res.body.token;

        t.deepEquals(res.body, {
            id: 1,
            type: 'gpu',
            project_id: 1,
            batch: null,
            aoi_id: null,
            checkpoint_id: null,
            active: true,
            status: {}
        });

    } catch (err) {
        t.error(err, 'no error');
    }

    t.end();
});

test('POST /api/project/1/checkpoint', async (t) => {
    try {
        await flight.request({
            json: true,
            url: 'http://localhost:2000/api/project/1/checkpoint',
            method: 'POST',
            headers: {
                Authorization: `Bearer ${flight.token.ingalls}`
            },
            body: {
                name: 'Test Checkpoint',
                classes: [
                    { name: 'Water', color: '#0000FF' },
                    { name: 'Tree Canopy', color: '#008000' },
                    { name: 'Field', color: '#80FF80' },
                    { name: 'Built', color: '#806060' }
                ],
            }
        });
    } catch (err) {
        t.error(err, 'no error');
    }

    t.end();
});

test('PATCH /api/project/1/instance/1', async (t) => {
    try {
        const res = await flight.request({
            json: true,
            url: 'http://localhost:2000/api/project/1/instance/1',
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${flight.token.ingalls}`
            },
            body: {
                checkpoint_id: 1
            }
        });

        t.ok(res.body.created, '.created: <date>');
        t.ok(res.body.last_update, '.last_update: <date>');
        delete res.body.created;
        delete res.body.last_update;

        t.deepEquals(res.body, {
            id: 1,
            project_id: 1,
            batch: null,
            aoi_id: null,
            checkpoint_id: 1,
            active: true,
            type: 'gpu'
        }, t);

    } catch (err) {
        t.error(err, 'no error');
    }

    t.end();
});


flight.landing(test);
