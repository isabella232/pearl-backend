#! /usr/bin/env python

import time
import sys
import jwt
import json
import os
import argparse
import asyncio
import websockets
import logging
from lib.api import API
from lib.ModelSrv import ModelSrv
from lib.Router import Router
from web_tool.ModelSessionPyTorchExample import TorchFineTuning
from web_tool.Utils import setup_logging

LOGGER = logging.getLogger("server")

def main():
    parser = argparse.ArgumentParser(description="AI for Earth Land Cover Worker")

    parser.add_argument("-v", "--verbose", action="store_true", help="Enable verbose debugging", default=False)
    parser.add_argument("--gpu_id", action="store", dest="gpu_id", type=int, help="GPU to use", required=False)
    parser.add_argument("--instance_id", action="store", dest="instance_id", type=int, help="Model to initiate", required=False)

    parser.add_argument("--socket", action="store", type=str, help="websocket router url to connect to", default=None)
    parser.add_argument("--api", action="store", type=str, help="api url to connect to", default=None)

    args = parser.parse_args(sys.argv[1:])

    # Setup logging
    log_path = os.path.join(os.getcwd(), "/tmp/gpu-logs/")
    setup_logging(log_path, "worker")

    os.environ["CUDA_DEVICE_ORDER"] = "PCI_BUS_ID"
    os.environ["CUDA_VISIBLE_DEVICES"] = arg([args.gpu_id], "")
    os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

    # Fallback to INSTANCE_ID 1 if not set - assume local test env
    os.environ['INSTANCE_ID'] = arg([os.environ.get('INSTANCE_ID'), args.instance_id, '1'])
    os.environ["API"] = arg([os.environ.get("API"), args.api], 'http://localhost:2000')

    os.environ["SOCKET"] = arg([os.environ.get("SOCKET"), args.socket], 'ws://localhost:1999')
    os.environ["SigningSecret"] = arg([os.environ.get("SigningSecret")], 'dev-secret')

    api = API(os.environ["API"], 'api.' + token, os.environ['INSTANCE_ID'])

    token = jwt.encode({
        "t": "admin",
        "p": api.project_id,
        "i": api.instance_id
    }, os.environ["SigningSecret"], algorithm="HS256")

    model = load(args.gpu_id, api)

    asyncio.get_event_loop().run_until_complete(
        connection('{}?token={}'.format(os.environ["SOCKET"], token), model)
    )

async def connection(uri, model):
    router = Router(uri)

    router.on_act("model#prediction", model.prediction)
    router.on_act("model#retrain", model.retrain)

    await router.open()


def load(gpu_id, api):
    model_type = api.model["model_type"]

    if model_type == "pytorch_example":
        model = TorchFineTuning(gpu_id, api)
    else:
        raise NotImplementedError("The given model type is not implemented yet.")

    return ModelSrv(model, api)

def arg(iterable, default=False, pred=None):
    """Returns the first true value in the iterable.
       If no true value is found, returns *default*
       If *pred* is not None, returns the first item
       for which pred(item) is true.
    """
    return next(filter(pred, iterable), default)


if __name__ == "__main__":
    main()
