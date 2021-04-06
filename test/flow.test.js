'use strict';

const { Term } = require('./term');
const WebSocket = require('ws');
const test = require('tape');
const API = process.env.API || 'http://localhost:2000';
const SOCKET = process.env.SOCKET || 'http://localhost:1999';
const path = require('path');
const fs = require('fs');
const LULC = require('./lib');

const drop = require('../services/api/test/drop');
const {connect, reconnect} = require('./init');

const argv = require('minimist')(process.argv, {
    string: ['postgres'],
    boolean: ['interactive', 'debug', 'reconnect'],
    alias: {
        interactive: 'i'
    },
    default: {
        postgres: process.env.Postgres || 'postgres://docker:docker@localhost:5433/gis'
    }
});

process.env.Postgres = argv.postgres;

let state;
if (argv.reconnect) {
    state = reconnect(test, API);
} else {
    state = connect(test, API);
}

if (argv.interactive) {
    test('gpu connection', async (t) => {
        await gpu();
        t.end();
    });
}

async function gpu() {
    return new Promise((resolve, reject) => {
        state.connected = false;

        const ws = new WebSocket(SOCKET + `?token=${state.instance.token}`);
        const term = new Term();
        const lulc = new LULC({
            token: state.token
        });

        term.prompt.screen(['websockets', 'api']);
        term.on('promp#selection', async (sel) => {
            if (sel.value === 'websockets') {
                term.prompt.screen([
                    'model#status',
                    'model#prediction',
                    'model#retrain',
                    'model#checkpoint',
                    'model#abort',
                    'instance#terminate'
                ]);

                return;
            } else if (sel.value === 'model#prediction') {
                ws.send(JSON.stringify(require('./fixtures/seneca_rocks-pred.json')));
                term.log('SENT: model#prediction - Seneca Rocks');
            } else if (sel.value === 'model#retrain') {
                ws.send(JSON.stringify(require('./fixtures/seneca_rocks-retrain.json')));
                term.log('SENT: model#retrain - Seneca Rocks');
            } else if (sel.value === 'model#checkpoint') {

            } else if (sel.value === 'model#abort') {
                ws.send(JSON.stringify({ action: 'model#abort' }));
                term.log('SENT: model#abort');
            } else if (sel.value === 'model#status') {
                ws.send(JSON.stringify({ action: 'model#status' }));
                term.log('SENT: model#status');
            } else if (sel.value === 'instance#terminate') {
                ws.send(JSON.stringify({ action: 'instance#terminate' }));
                term.log('SENT: instance#terminate');
            } else if (sel.value === 'api') {
                term.prompt.screen(Object.keys(lulc.schema.cli).map((k) => {
                    return { name: k, value: `api#${k}` };
                }));
                return;
            } else if (sel.value.split('#')[0] === 'api' && sel.value.split('#').length === 2) {
                term.prompt.screen(Object.keys(lulc.schema.cli[sel.value.split('#')[1]]).map((k) => {
                    return { name: k, value: `api#${sel.value.split('#')[1]}#${k}` };
                }));
                return;
            } else if (sel.value.split('#')[0] === 'api' && sel.value.split('#').length === 3) {
                try {
                    const inp = {
                        ':projectid': 1,
                        ':aoiid': 1
                    };

                    const outp = path.resolve('/tmp/', `aoi-${inp[':aoiid']}.tiff`);
                    const out = fs.createWriteStream(outp).on('close', () => {
                        term.log(`Downloaded: ${outp}`);
                    });

                    lulc.cmd(
                        sel.value.split('#')[1],
                        sel.value.split('#')[2],
                        inp,
                        out
                    );

                    term.log(`API: ${sel.value.split('#')[1]} ${sel.value.split('#')[2]}`);
                } catch (err) {
                    term.log('ERROR: ' + err.message);
                }
            }

            term.prompt.screen(['websockets', 'api']);
        }).on('promp#escape', () => {
            term.prompt.screen(['websockets', 'api']);
        });

        ws.on('open', () => {
            term.log('connection opened');
        });

        ws.on('close', () => {
            term.log('CONNECTION TERMINATED');
        });

        if (argv.interactive) {
            ws.on('message', async (msg) => {
                msg = JSON.parse(msg);
                if (argv.debug) term.log(JSON.stringify(msg, null, 4));

                if (msg.message === 'info#connected') {
                    term.log('ok - GPU Connected');
                    state.connected = true;
                } else if (msg.message === 'info#disconnected') {
                    term.log('ok - GPU Disconnected');
                    state.connected = false;
                } else if (msg.message === 'model#checkpoint#progress') {
                    term.log(`ok - model#checkpoint#progress - ${msg.data.checkpoint}`);
                    term.prog.update('model#checkpoint', 0);
                } else if (msg.message === 'model#checkpoint#complete') {
                    term.log(`ok - model#checkpoint#complete - ${msg.data.checkpoint}`);
                    term.prog.update();
                } else if (msg.message === 'model#aoi') {
                    term.log(`ok - model#aoi - ${msg.data.name}`);
                    state.aois.push(msg.data);
                    term.prog.update('model#prediction', 0);
                } else if (msg.message === 'model#checkpoint') {
                    term.log(`ok - model#checkpoint - ${msg.data.name}`);
                    state.checkpoints.push(msg.data);
                } else if (msg.message === 'model#prediction') {
                    term.prog.update('model#prediction', msg.data.processed / msg.data.total);
                } else if (msg.message === 'model#prediction#complete') {
                    term.log(`ok - model#prediction#complete - ${msg.data.aoi}`);
                    term.prog.update();
                } else if (msg.message === 'model#aborted') {
                    term.log(`ok - model#aborted`);
                    term.prog.update();
                } else if (msg.message === 'model#status') {
                    term.log(JSON.stringify(msg.data, null, 4));
                } else {
                    term.log(JSON.stringify(msg, null, 4));
                }
            });
        }
    });
}
