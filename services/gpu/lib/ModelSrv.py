import os
import base64
import json
import numpy as np
from .utils import pred2png, geom2px, pxs2geojson, generate_random_points
from .AOI import AOI
from .MemRaster import MemRaster
from .utils import serialize, deserialize
import logging
import rasterio

LOGGER = logging.getLogger("server")


class ModelSrv():
    def __init__(self, model, api):

        self.is_aborting = False
        self.aoi = None
        self.chk = None
        self.processing = False
        self.api = api
        self.model = model

    def abort(self, body, websocket):
        self.is_aborting = True

    def status(self, body, websocket):
        try:
            payload = {
                'is_aborting': self.is_aborting,
                'processing': self.processing,
                'aoi': False,
                'checkpoint': False
            }

            if self.aoi is not None:
                payload['aoi'] = self.aoi.id,

            if self.chk is not None:
                payload['checkpoint'] = self.chk['id']

            websocket.send(json.dumps({
                'message': 'model#status',
                'data': payload
            }))

        except Exception as e:
            websocket.error('Model Status Error', e)
            raise None

    def load_checkpoint(self, body, websocket):
        try:
            if self.processing is True:
                return is_processing(websocket)

            self.processing = True

            websocket.send(json.dumps({
                'message': 'model#checkpoint#progress',
                'data': {
                    'checkpoint': body['id'],
                    'processed': 0,
                    'total': 1
                }
            }))
            self.chk = self.api.get_checkpoint(body['id'])
            chk_fs = self.api.download_checkpoint(self.chk['id'])
            self.model.load_state_from(self.chk, chk_fs)

            websocket.send(json.dumps({
                'message': 'model#checkpoint#complete',
                'data': {
                    'checkpoint': body['id']
                }
            }))

            done_processing(self)

        except Exception as e:
            done_processing(self)
            websocket.error('Checkpoint Load Error', e)
            raise None

    def prediction(self, body, websocket):
        try:
            if self.processing is True:
                return is_processing(websocket)

            LOGGER.info("ok - starting prediction");

            self.processing = True

            if self.chk is None:
                self.checkpoint({
                    'name': body['name'],
                    'geoms': [None] * len(self.model.classes),
                    'analytics': [{
                        'counts': cls.get('counts', 0),
                        'percent': cls.get('percent', 0),
                        'f1score': cls.get('retraining_f1score', 0)
                    } for cls in self.model.classes]
                }, websocket)

            self.aoi = AOI(self.api, body, self.chk['id'])
            websocket.send(json.dumps({
                'message': 'model#aoi',
                'data': {
                    'id': self.aoi.id,
                    'name': self.aoi.name,
                    'checkpoint_id': self.chk['id'],
                    'bounds': self.aoi.bounds,
                    'total': self.aoi.total
                }
            }))


            color_list = [item["color"] for item in self.model.classes]

            while len(self.aoi.tiles) > 0 and self.is_aborting is False:
                zxy = self.aoi.tiles.pop()
                in_memraster = self.api.get_tile(zxy.z, zxy.x, zxy.y)

                output, output_features = self.model.run(in_memraster.data, False)

                # remove 32 pixel buffer on each side
                output = output[32:288, 32:288]
                output_features = output_features[32:288, 32:288, :]

                #TO-DO assert statement for output_features dimensions, and output?

                LOGGER.info("ok - generated inference");

                if self.aoi.live:
                    # Create color versions of predictions
                    png = pred2png(output, color_list) # investigate this

                    LOGGER.info("ok - returning inference");
                    websocket.send(json.dumps({
                        'message': 'model#prediction',
                        'data': {
                            'aoi': self.aoi.id,
                            'bounds': in_memraster.bounds,
                            'x': in_memraster.x, 'y': in_memraster.y, 'z': in_memraster.z,
                            'image': png,
                            'total': self.aoi.total,
                            'processed': self.aoi.total - len(self.aoi.tiles)
                        }
                    }))
                else:
                    websocket.send(json.dumps({
                        'message': 'model#prediction',
                        'data': {
                            'aoi': self.aoi.id,
                            'total': self.aoi.total,
                            'processed': len(self.aoi.tiles)
                        }
                    }))

                # Push tile into geotiff fabric
                output = np.expand_dims(output, axis=-1)
                output = MemRaster(output, in_memraster.crs, in_memraster.tile, in_memraster.buffered)
                print(output.bounds)
                self.aoi.add_to_fabric(output)


            if self.is_aborting is True:
                websocket.send(json.dumps({
                    'message': 'model#aborted',
                }))
            else:
                print('upload fabric bounds')
                print(self.aoi.bounds)
                print('polygon bounds')
                print(self.aoi.poly)

                # clip fabric to polygon bounds and upload
                poly_bounds = self.aoi.poly
                poly_bounds.pop('bbox', None)
                print(poly_bounds)
                print(type(poly_bounds))

                print(type(self.aoi.fabric))
                print(type(self.aoi.raw_fabric))

                clipped_fabric, clipped_transform = rasterio.mask.mask(self.aoi.fabric, [poly_bounds])
                print(type(clipped_fabric))
                self.aoi.fabric = clipped_fabric #FIX this needs to be some sort of `memraster`

                #TODO figure out how to update self.aoi.raw_fabric in addition to self.aoi.fabric

                # TODO update fabric bounds
                #self.aoi.bounds

                self.aoi.upload_fabric()

                LOGGER.info("ok - done prediction");

                websocket.send(json.dumps({
                    'message': 'model#prediction#complete',
                    'data': {
                        'aoi': self.aoi.id,
                    }
                }))

            done_processing(self)
        except Exception as e:
            done_processing(self)
            websocket.error('Processing Error', e)

            raise e

    def retrain(self, body, websocket):
        try:
            if self.processing is True:
                return is_processing(websocket)
            self.processing = True

            LOGGER.info("ok - starting retrain");

            for cls in body['classes']:
                for feature in cls['geometry']['geometries']:
                    cls['retrain_geometry'] = []
                    if feature['type'] == 'Polygon':
                        points = generate_random_points(100, feature, self)
                        cls['retrain_geometry'] = cls['retrain_geometry'] + points

                    if feature['type'] == 'MultiPoint':
                        cls['retrain_geometry'] = cls['retrain_geometry'] + geom2px(feature, self)

            self.model.retrain(body['classes'])

            LOGGER.info("ok - done retrain");

            websocket.send(json.dumps({
                'message': 'model#retrain#complete'
            }))

            self.checkpoint({
                'name': body['name'],
                'parent': self.chk['id'],
                'input_geoms': [cls["geometry"] for cls in body['classes']],
                'retrain_geoms': pxs2geojson([cls["retrain_geometry"] for cls in body['classes']]),
                'analytics': [{
                    'counts': cls.get('counts', 0),
                    'percent': cls.get('percent', 0),
                    'f1score': cls.get('retraining_f1score', 0)
                } for cls in self.model.classes]
            }, websocket)

            done_processing(self)
            if self.aoi is not None:
                self.prediction({
                    'name': body['name'],
                    'polygon': self.aoi.poly
                }, websocket)

        except Exception as e:
            done_processing(self)
            websocket.error('Retrain Error', e)
            raise None

    def checkpoint(self, body, websocket):
        classes = []
        for cls in self.model.classes:
            classes.append({
                'name': cls['name'],
                'color': cls['color']
            });

        checkpoint = self.api.create_checkpoint(
            body['name'],
            body.get('parent'),
            classes,
            body.get('retrain_geoms'),
            body.get('input_geoms'),
            body.get('analytics')
        )
        self.model.save_state_to(self.api.tmp_checkpoints + '/' + str(checkpoint['id']))
        self.api.upload_checkpoint(checkpoint['id'])
        self.api.instance_patch(checkpoint_id = checkpoint['id'])

        websocket.send(json.dumps({
            'message': 'model#checkpoint',
            'data': {
                'name': checkpoint['name'],
                'id': checkpoint['id']
            }
        }))

        self.chk = checkpoint
        return checkpoint

    def load(self, directory):
        return self.model.load_state_from(directory)

def done_processing(modelsrv):
    modelsrv.processing = False
    modelsrv.is_aborting = False

def is_processing(websocket):
    LOGGER.info("not ok  - Can't process message - busy");
    websocket.error('GPU is Busy', 'The API is only capable of handling a single processing command at a time. Wait until the retraining/prediction is complete and resubmit')
