define({ "api": [
  {
    "type": "post",
    "url": "/api/project/:projectid/aoi",
    "title": "Create AOI",
    "version": "1.0.0",
    "name": "CreateAOI",
    "group": "AOI",
    "permission": [
      {
        "name": "admin",
        "title": "Admin",
        "description": "<p>The user must be an admin to use this endpoint</p>"
      }
    ],
    "description": "<p>Create a new AOI during an instance Note: this is an internal API that is called by the websocket GPU</p>",
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The human readable name of the AOI</p>"
          },
          {
            "group": "Body",
            "type": "Integer",
            "optional": false,
            "field": "checkpoint_id",
            "description": "<p>The checkpoint ID that created this AOI</p>"
          },
          {
            "group": "Body",
            "type": "Object",
            "optional": false,
            "field": "bounds",
            "description": "<p>GeoJSON Polygon</p>"
          },
          {
            "group": "Body",
            "type": "String",
            "allowedValues": [
              "\"Polygon\""
            ],
            "optional": false,
            "field": "bounds.type",
            "description": "<p>undefined</p>"
          },
          {
            "group": "Body",
            "type": "Unknown",
            "optional": false,
            "field": "bounds.coordinates",
            "description": "<p>undefined</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"id\": 1432,\n    \"project_id\": 1,\n    \"name\": \"I'm an AOI\",\n    \"checkpoint_id\": 1,\n    \"storage\": true,\n    \"bookmarked\": false,\n    \"created\": \"<date>\",\n    \"bounds\": { \"GeoJSON\" }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "AOI"
  },
  {
    "type": "delete",
    "url": "/api/project/:projectid/aoi/:aoiid",
    "title": "Delete AOI",
    "version": "1.0.0",
    "name": "DeleteAOI",
    "group": "AOI",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Delete an existing AOI</p>",
    "filename": "./index.js",
    "groupTitle": "AOI"
  },
  {
    "type": "get",
    "url": "/api/project/:projectid/aoi/:aoiid/download/color",
    "title": "Download Color AOI",
    "version": "1.0.0",
    "name": "DownloadColorAOI",
    "group": "AOI",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Return the colourized aoi fabric geotiff - but doesn't save it to share page</p>",
    "filename": "./index.js",
    "groupTitle": "AOI"
  },
  {
    "type": "get",
    "url": "/api/project/:projectid/aoi/:aoiid/download/raw",
    "title": "Download Raw AOI",
    "version": "1.0.0",
    "name": "DownloadRawAOI",
    "group": "AOI",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Return the aoi fabric geotiff</p>",
    "filename": "./index.js",
    "groupTitle": "AOI"
  },
  {
    "type": "get",
    "url": "/api/project/:project/aoi/:aoiid",
    "title": "Get AOI",
    "version": "1.0.0",
    "name": "GetAOI",
    "group": "AOI",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Return all information about a given AOI</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"id\": 1432,\n    \"name\": \"I'm an AOI\",\n    \"checkpoint_id\": 1,\n    \"storage\": true,\n    \"bookmarked\": false\n    \"created\": \"<date>\",\n    \"bounds\": { \"GeoJSON \"}\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "AOI"
  },
  {
    "type": "post",
    "url": "/api/project/:projectid/aoi/:aoiid/patch/:patchid/upload",
    "title": "Upload Patch",
    "version": "1.0.0",
    "name": "UploadPatch",
    "group": "AOIGroup",
    "permission": [
      {
        "name": "admin",
        "title": "Admin",
        "description": "<p>The user must be an admin to use this endpoint</p>"
      }
    ],
    "description": "<p>Upload a new AOI Patch asset to the API</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n {\n     \"id\": 1432,\n     \"storage\": true,\n     \"created\": \"<date>\"\n     \"project_id\": 1,\n     \"aoi\": 1\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "AOIGroup"
  },
  {
    "type": "get",
    "url": "/api/project/:projectid/aoi",
    "title": "List AOIs",
    "version": "1.0.0",
    "name": "ListAOIs",
    "group": "AOI",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Return all aois for a given instance</p>",
    "parameter": {
      "fields": {
        "Query": [
          {
            "group": "Query",
            "type": "Integer",
            "optional": true,
            "field": "limit",
            "defaultValue": "100",
            "description": "<p>Limit number of returned aois</p>"
          },
          {
            "group": "Query",
            "type": "Integer",
            "optional": true,
            "field": "page",
            "defaultValue": "0",
            "description": "<p>The offset based on limit to return</p>"
          },
          {
            "group": "Query",
            "type": "Integer",
            "optional": true,
            "field": "checkpointid",
            "defaultValue": "0",
            "description": "<p>Only return AOIs for a specific checkpoint</p>"
          },
          {
            "group": "Query",
            "type": "String",
            "optional": true,
            "field": "bookmarked",
            "defaultValue": "",
            "description": "<p>Filter AOIs based on bookmarked. Allowed 'true' or 'false'. By default returns all.</p>"
          },
          {
            "group": "Query",
            "type": "String",
            "optional": true,
            "field": "sort",
            "defaultValue": "desc",
            "description": "<p>Sorting order for listing AOIs based on created timestamp. Allowed 'desc' and 'asc'</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"total\": 1,\n    \"project_id\": 123,\n    \"aois\": [{\n        \"id\": 1432,\n        \"storage\": true,\n        \"bookmarked\": false,\n        \"created\": \"<date>\",\n        \"bounds\": { \"GeoJSON \"}\n    }]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "AOI"
  },
  {
    "type": "patch",
    "url": "/api/project/:projectid/aoi/:aoiid",
    "title": "Patch AOI",
    "version": "1.0.0",
    "name": "PatchAOI",
    "group": "AOI",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Update an AOI</p>",
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>The human readable name of the AOI</p>"
          },
          {
            "group": "Body",
            "type": "Boolean",
            "optional": true,
            "field": "bookmarked",
            "description": "<p>Has the checkpoint been bookmarked in the frontend</p>"
          },
          {
            "group": "Body",
            "type": "Integer[]",
            "optional": true,
            "field": "patches",
            "description": "<p>List of patch ids to apply on export undefined</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"id\": 1432,\n    \"project_id\": 1,\n    \"name\": \"I'm an AOI\",\n    \"checkpoint_id\": 1,\n    \"bookmarked\": false,\n    \"storage\": true,\n    \"created\": \"<date>\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "AOI"
  },
  {
    "type": "post",
    "url": "/api/project/:project/aoi/:aoiid/patch",
    "title": "Create Patch",
    "version": "1.0.0",
    "name": "CreatePatch",
    "group": "AOIPatch",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Create a new Patch</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"id\": 1432,\n    \"storage\": true,\n    \"created\": \"<date>\"\n    \"project_id\": 1,\n    \"aoi_id\": 1\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "AOIPatch"
  },
  {
    "type": "delete",
    "url": "/api/project/:project/aoi/:aoiid/patch/:patchid",
    "title": "Delete Patch",
    "version": "1.0.0",
    "name": "DeletePatch",
    "group": "AOIPatch",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Delete a given patch</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\ntrue",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "AOIPatch"
  },
  {
    "type": "get",
    "url": "/api/project/:project/aoi/:aoiid/patch/:patchid/download",
    "title": "Download Patch",
    "version": "1.0.0",
    "name": "DownloadPatch",
    "group": "AOIPatch",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Download a Tiff Patch</p>",
    "filename": "./index.js",
    "groupTitle": "AOIPatch"
  },
  {
    "type": "get",
    "url": "/api/project/:project/aoi/:aoiid/patch/:patchid",
    "title": "Get Patch",
    "version": "1.0.0",
    "name": "GetPatch",
    "group": "AOIPatch",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Get a specific patch</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": " HTTP/1.1 200 OK\n {\n     \"id\": 1432,\n     \"storage\": true,\n     \"created\": \"<date>\"\n     \"project_id\": 1,\n     \"aoi\": 1\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "AOIPatch"
  },
  {
    "type": "get",
    "url": "/api/project/:project/aoi/:aoiid/patch",
    "title": "List Patches",
    "version": "1.0.0",
    "name": "ListPatch",
    "group": "AOIPatch",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Return all patches for a given API</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"total\": 1,\n    \"project_id\": 123,\n    \"aoi_id\": 123\n    \"patches\": [{\n        \"id\": 1432,\n        \"storage\": true,\n        \"created\": \"<date>\"\n    }]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "AOIPatch"
  },
  {
    "type": "get",
    "url": "/api/project/:project/aoi/:aoiid/patch/:patchid/tiles",
    "title": "TileJSON Patch",
    "version": "1.0.0",
    "name": "TileJSONPatch",
    "group": "AOIPatch",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Get the TileJSON for a given AOI Patch</p>",
    "filename": "./index.js",
    "groupTitle": "AOIPatch"
  },
  {
    "type": "get",
    "url": "/api/project/:project/aoi/:aoiid/patch/:patchid/tiles/:z/:x/:y",
    "title": "Tile Patch",
    "version": "1.0.0",
    "name": "TilePatch",
    "group": "AOIPatch",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Return a Tile for a given AOI Patch</p>",
    "filename": "./index.js",
    "groupTitle": "AOIPatch"
  },
  {
    "type": "post",
    "url": "/api/project/:projectid/aoi/:aoiid/share",
    "title": "Create Share",
    "version": "1.0.0",
    "name": "ShareAOI",
    "group": "AOI",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Export an AOI &amp; it's patches to share</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"aoi_id\": 1432,\n    \"project_id\": 1,\n    \"storage\": false,\n    \"created\": \"<date>\",\n    \"patches\": []\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "AOI"
  },
  {
    "type": "get",
    "url": "/api/project/:project/aoi/:aoiid/tiles/:z/:x/:y",
    "title": "Tile AOI",
    "version": "1.0.0",
    "name": "TileAOI",
    "group": "AOI",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Return a Tile for a given AOI</p>",
    "filename": "./index.js",
    "groupTitle": "AOI"
  },
  {
    "type": "get",
    "url": "/api/project/:project/aoi/:aoiid/tiles",
    "title": "TileJSON AOI",
    "version": "1.0.0",
    "name": "TileJSONAOI",
    "group": "AOI",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Return tilejson for a given AOI</p>",
    "filename": "./index.js",
    "groupTitle": "AOI"
  },
  {
    "type": "get",
    "url": "/api/aoi/:aoiuuid/tiles",
    "title": "TileJSON AOI",
    "version": "1.0.0",
    "name": "TileJSONAOI",
    "group": "AOI",
    "permission": [
      {
        "name": "public",
        "title": "Public",
        "description": "<p>This API endpoint does not require authentication</p>"
      }
    ],
    "description": "<p>Return tilejson for a given AOI using uuid</p>",
    "filename": "./index.js",
    "groupTitle": "AOI"
  },
  {
    "type": "post",
    "url": "/api/project/:projectid/aoi/:aoiid/upload",
    "title": "Upload AOI",
    "version": "1.0.0",
    "name": "UploadAOI",
    "group": "AOI",
    "permission": [
      {
        "name": "admin",
        "title": "Admin",
        "description": "<p>The user must be an admin to use this endpoint</p>"
      }
    ],
    "description": "<p>Upload a new GeoTiff to the API</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"id\": 1432,\n    \"storage\": true,\n    \"created\": \"<date>\",\n    \"bounds\": { \"GeoJSON \"}\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "AOI"
  },
  {
    "type": "post",
    "url": "/api/model/:modelid/upload",
    "title": "UploadModel",
    "version": "1.0.0",
    "name": "UploadModel",
    "group": "AOI",
    "permission": [
      {
        "name": "admin",
        "title": "Admin",
        "description": "<p>The user must be an admin to use this endpoint</p>"
      }
    ],
    "description": "<p>Upload a new model asset to the API</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"id\": 1,\n    \"created\": \"<date>\",\n    \"active\": true,\n    \"uid\": 1,\n    \"name\": \"HCMC Sentinel 2019 Unsupervised\",\n    \"model_type\": \"keras_example\",\n    \"model_inputshape\": [100,100,4],\n    \"model_zoom\": 17,\n    \"model_numparams\": 563498,\n    \"storage\": true,\n    \"classes\": [\n        {\"name\": \"Water\", \"color\": \"#0000FF\"},\n    ],\n    \"meta\": {}\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "AOI"
  },
  {
    "type": "post",
    "url": "/api/project/:projectid/checkpoint",
    "title": "Create Checkpoint",
    "version": "1.0.0",
    "name": "CreateCheckpoint",
    "group": "Checkpoints",
    "permission": [
      {
        "name": "admin",
        "title": "Admin",
        "description": "<p>The user must be an admin to use this endpoint</p>"
      }
    ],
    "description": "<p>Create a new Checkpoint during an instance Note: this is an internal API that is called by the websocket GPU</p>",
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>The human readable name of the checkpoint</p>"
          },
          {
            "group": "Body",
            "type": "Integer",
            "optional": true,
            "field": "parent",
            "description": "<p>The ID of the parent checkpoint that was retrained off of</p>"
          },
          {
            "group": "Body",
            "type": "Object[]",
            "optional": true,
            "field": "analytics",
            "description": "<p>undefined undefined</p>"
          },
          {
            "group": "Body",
            "type": "Number",
            "optional": false,
            "field": "analytics.counts",
            "description": "<p>undefined</p>"
          },
          {
            "group": "Body",
            "type": "Number",
            "optional": false,
            "field": "analytics.percent",
            "description": "<p>undefined</p>"
          },
          {
            "group": "Body",
            "type": "Number",
            "optional": false,
            "field": "analytics.f1score",
            "description": "<p>undefined</p>"
          },
          {
            "group": "Body",
            "type": "Object[]",
            "optional": false,
            "field": "classes",
            "description": "<p>Named output classes &amp; their associated colours undefined</p>"
          },
          {
            "group": "Body",
            "type": "String",
            "optional": false,
            "field": "classes.name",
            "description": "<p>undefined</p>"
          },
          {
            "group": "Body",
            "type": "String",
            "optional": false,
            "field": "classes.color",
            "description": "<p>undefined</p>"
          },
          {
            "group": "Body",
            "type": "Null/Object[]",
            "optional": true,
            "field": "retrain_geoms",
            "description": "<p>Array of GeoJSON Multipoint geometries that were used for retraining. Length of geomms array must equals classes undefined</p>"
          },
          {
            "group": "Body",
            "type": "Null/Object[]",
            "optional": true,
            "field": "input_geoms",
            "description": "<p>Array of GeoJSON GeometryCollections that were input by the user. Length of geomms array must equals classes undefined</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"id\": 1432,\n    \"parent\": 123,\n    \"instance_id\": 124,\n    \"storage\": true,\n    \"classes\": [ ... ],\n    \"name\": \"Named Checkpoint\",\n    \"bookmarked\": false,\n    \"created\": \"<date>\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "Checkpoints"
  },
  {
    "type": "delete",
    "url": "/api/project/:projectid/checkpoint/:checkpointid",
    "title": "Delete Checkpoint",
    "version": "1.0.0",
    "name": "DeleteCheckpoint",
    "group": "Checkpoints",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Delete an existing Checkpoint NOTE: This will also delete AOIs that depend on the given checkpoint</p>",
    "filename": "./index.js",
    "groupTitle": "Checkpoints"
  },
  {
    "type": "get",
    "url": "/api/project/:projectid/checkpoint/:checkpointid/download",
    "title": "Download Checkpoint",
    "version": "1.0.0",
    "name": "DownloadCheckpoint",
    "group": "Checkpoints",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Download a checkpoint asset from the API</p>",
    "filename": "./index.js",
    "groupTitle": "Checkpoints"
  },
  {
    "type": "get",
    "url": "/api/project/:projectid/checkpoint/:checkpointid",
    "title": "Get Checkpoint",
    "version": "1.0.0",
    "name": "GetCheckpoint",
    "group": "Checkpoints",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Return a given checkpoint for a given instance</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"id\": 1432,\n    \"name\": \"Checkpoint Name\",\n    \"parent\": 123,\n    \"classes\": [ ... ],\n    \"storage\": true,\n    \"created\": \"<date>\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "Checkpoints"
  },
  {
    "type": "get",
    "url": "/api/project/:projectid/checkpoint",
    "title": "List Checkpoints",
    "version": "1.0.0",
    "name": "ListCheckpoints",
    "group": "Checkpoints",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Return all checkpoints for a given instance</p>",
    "parameter": {
      "fields": {
        "Query": [
          {
            "group": "Query",
            "type": "Integer",
            "optional": true,
            "field": "limit",
            "defaultValue": "100",
            "description": "<p>Limit number of returned checkpoints</p>"
          },
          {
            "group": "Query",
            "type": "Integer",
            "optional": true,
            "field": "page",
            "defaultValue": "0",
            "description": "<p>The offset based on limit to return</p>"
          },
          {
            "group": "Query",
            "type": "String",
            "optional": true,
            "field": "bookmarked",
            "defaultValue": "",
            "description": "<p>Only return bookmarked checkpoints. true or false.</p>"
          },
          {
            "group": "Query",
            "type": "String",
            "optional": true,
            "field": "sort",
            "defaultValue": "desc",
            "description": "<p>Sorting order for listing checkpoints based on created timestamp. Allowed 'desc' and 'asc'</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"total\": 1,\n    \"instance_id\": 123,\n    \"checkpoints\": [{\n        \"id\": 1432,\n        \"parent\": 123,\n        \"name\": \"Checkpoint Name\",\n        \"storage\": true,\n        \"created\": \"<date>\",\n        \"bookmarked\": false\n    }]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "Checkpoints"
  },
  {
    "type": "patch",
    "url": "/api/project/:projectid/checkpoint/:checkpointid",
    "title": "Patch Checkpoint",
    "version": "1.0.0",
    "name": "PatchCheckpoint",
    "group": "Checkpoints",
    "permission": [
      {
        "name": "admin",
        "title": "Admin",
        "description": "<p>The user must be an admin to use this endpoint</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>Human readable name of the Checkpoint</p>"
          },
          {
            "group": "Body",
            "type": "Boolean",
            "optional": true,
            "field": "bookmarked",
            "description": "<p>Has the checkpoint been bookmarked in the frontend</p>"
          },
          {
            "group": "Body",
            "type": "Object[]",
            "optional": true,
            "field": "classes",
            "description": "<p>Named output classes &amp; their associated colours. NOTE: Patching cannot change the number of classes undefined</p>"
          },
          {
            "group": "Body",
            "type": "String",
            "optional": false,
            "field": "classes.name",
            "description": "<p>undefined</p>"
          },
          {
            "group": "Body",
            "type": "String",
            "optional": false,
            "field": "classes.color",
            "description": "<p>undefined</p>"
          }
        ]
      }
    },
    "description": "<p>Update a checkpoint</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"id\": 1432,\n    \"instance_id\": 124,\n    \"parent\": 123,\n    \"storage\": true,\n    \"classes\": [ ... ],\n    \"name\": \"Named Checkpoint\",\n    \"bookmarked\": false,\n    \"created\": \"<date>\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "Checkpoints"
  },
  {
    "type": "get",
    "url": "/api/project/:project/checkpoint/:checkpointid/tiles/:z/:x/:y.mvt",
    "title": "Tile Checkpoint",
    "version": "1.0.0",
    "name": "TileCheckpoint",
    "group": "Checkpoints",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Return a Tile for a given AOI</p>",
    "filename": "./index.js",
    "groupTitle": "Checkpoints"
  },
  {
    "type": "get",
    "url": "/api/project/:project/checkpoint/:checkpointid/tiles",
    "title": "TileJSON Checkpoint",
    "version": "1.0.0",
    "name": "TileJSONCheckpoint",
    "group": "Checkpoints",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Return tilejson for a given Checkpoint</p>",
    "filename": "./index.js",
    "groupTitle": "Checkpoints"
  },
  {
    "type": "post",
    "url": "/api/project/:projectid/checkpoint/:checkpointid/upload",
    "title": "Upload Checkpoint",
    "version": "1.0.0",
    "name": "UploadCheckpoint",
    "group": "Checkpoints",
    "permission": [
      {
        "name": "admin",
        "title": "Admin",
        "description": "<p>The user must be an admin to use this endpoint</p>"
      }
    ],
    "description": "<p>Upload a new checkpoint asset to the API</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"id\": 1432,\n    \"name\": \"Checkpoint Name\",\n    \"classes\": [ ... ],\n    \"storage\": true,\n    \"created\": \"<date>\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "Checkpoints"
  },
  {
    "type": "get",
    "url": "/api/project/:project/instance",
    "title": "Create Instance",
    "version": "1.0.0",
    "name": "CreateInstance",
    "group": "Instance",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Instruct the GPU pool to start a new model instance and return a time limited session token for accessing the websockets GPU API</p>",
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "Integer",
            "optional": true,
            "field": "aoi_id",
            "description": "<p>The current AOI loaded on the instance</p>"
          },
          {
            "group": "Body",
            "type": "Integer",
            "optional": true,
            "field": "checkpoint_id",
            "description": "<p>The current checkpoint loaded on the instance</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"id\": 1,\n    \"created\": \"<date\",\n    \"project_id\": 2,\n    \"url\": \"ws://<websocket-connection-url>\",\n    \"token\": \"websocket auth token\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "Instance"
  },
  {
    "type": "delete",
    "url": "/api/instance",
    "title": "Deactivate Instances",
    "version": "1.0.0",
    "name": "DeactivateInstance",
    "group": "Instance",
    "permission": [
      {
        "name": "admin",
        "title": "Admin",
        "description": "<p>The user must be an admin to use this endpoint</p>"
      }
    ],
    "description": "<p>Set all instances to active: false - used by the socket server upon initial api connection</p>",
    "filename": "./index.js",
    "groupTitle": "Instance"
  },
  {
    "type": "get",
    "url": "/api/project/:projectid/instance/:instanceid",
    "title": "Get Instance",
    "version": "1.0.0",
    "name": "GetInstance",
    "group": "Instance",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Return all information about a given instance</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"id\": 1,\n    \"uid\": 123,\n    \"active\": true,\n    \"created\": \"<date>\",\n    \"token\": \"<instance token>\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "Instance"
  },
  {
    "type": "get",
    "url": "/api/project/:projectid/instance",
    "title": "List Instances",
    "version": "1.0.0",
    "name": "ListInstances",
    "group": "Instance",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Query": [
          {
            "group": "Query",
            "type": "Integer",
            "optional": true,
            "field": "limit",
            "defaultValue": "100",
            "description": "<p>Limit number of returned runs</p>"
          },
          {
            "group": "Query",
            "type": "Integer",
            "optional": true,
            "field": "page",
            "defaultValue": "0",
            "description": "<p>The offset based on limit to return</p>"
          },
          {
            "group": "Query",
            "type": "String",
            "allowedValues": [
              "\"active\"",
              "\"inactive\"",
              "\"all\""
            ],
            "optional": true,
            "field": "status",
            "defaultValue": "active",
            "description": "<p>Filter instances by active status</p>"
          }
        ]
      }
    },
    "description": "<p>Return a list of instances. Note that users can only get their own instances and use of the <code>uid</code> field will be pinned to their own uid. Admins can filter by any uid or none.</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"total\": 1,\n    \"instances\": [{\n        \"id\": 1,\n        \"uid\": 123,\n        \"active\": true,\n        \"created\": \"<date>\"\n    }]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "Instance"
  },
  {
    "type": "patch",
    "url": "/api/project/:projectid/instance/:instance",
    "title": "Patch Instance",
    "version": "1.0.0",
    "name": "PatchInstance",
    "group": "Instance",
    "permission": [
      {
        "name": "admin",
        "title": "Admin",
        "description": "<p>The user must be an admin to use this endpoint</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "Boolean",
            "optional": true,
            "field": "active",
            "description": "<p>Is the instance currently running</p>"
          },
          {
            "group": "Body",
            "type": "Integer",
            "optional": true,
            "field": "aoi_id",
            "description": "<p>The current AOI loaded on the instance</p>"
          },
          {
            "group": "Body",
            "type": "Integer",
            "optional": true,
            "field": "checkpoint_id",
            "description": "<p>The current checkpoint loaded on the instance</p>"
          }
        ]
      }
    },
    "filename": "./index.js",
    "groupTitle": "Instance"
  },
  {
    "type": "get",
    "url": "/api/instance/:instanceid",
    "title": "Self Instance",
    "version": "1.0.0",
    "name": "SelfInstance",
    "group": "Instance",
    "permission": [
      {
        "name": "admin",
        "title": "Admin",
        "description": "<p>The user must be an admin to use this endpoint</p>"
      }
    ],
    "description": "<p>A newly instantiated GPU Instance does not know what it's project id is. This API allows ONLY AN ADMIN TOKEN to fetch any instance, regardless of project</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"id\": 1,\n    \"uid\": 123,\n    \"active\": true,\n    \"created\": \"<date>\"\n    \"pod\": { ... }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "Instance"
  },
  {
    "type": "post",
    "url": "/api/model",
    "title": "Create Model",
    "version": "1.0.0",
    "name": "CreateModel",
    "group": "Model",
    "permission": [
      {
        "name": "admin",
        "title": "Admin",
        "description": "<p>The user must be an admin to use this endpoint</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Human-readable name of the Model</p>"
          },
          {
            "group": "Body",
            "type": "Boolean",
            "optional": false,
            "field": "active",
            "description": "<p>Can the model be used for gpu instances</p>"
          },
          {
            "group": "Body",
            "type": "String",
            "allowedValues": [
              "\"random_forest\"",
              "\"pytorch_example\"",
              "\"pytorch_solar\""
            ],
            "optional": false,
            "field": "model_type",
            "description": "<p>Underlying model type</p>"
          },
          {
            "group": "Body",
            "type": "Integer",
            "optional": false,
            "field": "model_zoom",
            "description": "<p>The tile zoom level to run inferences on</p>"
          },
          {
            "group": "Body",
            "type": "Integer[]",
            "optional": false,
            "field": "model_inputshape",
            "description": "<p>undefined undefined</p>"
          },
          {
            "group": "Body",
            "type": "Object[]",
            "optional": false,
            "field": "classes",
            "description": "<p>Named output classes &amp; their associated colours undefined</p>"
          },
          {
            "group": "Body",
            "type": "String",
            "optional": false,
            "field": "classes.name",
            "description": "<p>undefined</p>"
          },
          {
            "group": "Body",
            "type": "String",
            "optional": false,
            "field": "classes.color",
            "description": "<p>undefined</p>"
          },
          {
            "group": "Body",
            "type": "Number[]/Null",
            "optional": true,
            "field": "bounds",
            "description": "<p>Recommended geographic area on which this model can be used</p>"
          },
          {
            "group": "Body",
            "type": "Object",
            "optional": false,
            "field": "meta",
            "description": "<p>Generic key/value store for additional model metadata</p>"
          }
        ]
      }
    },
    "description": "<p>Create a new model in the system</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"id\": 1,\n    \"created\": \"<date>\",\n    \"active\": true,\n    \"uid\": 1,\n    \"name\": \"HCMC Sentinel 2019 Unsupervised\",\n    \"model_type\": \"keras_example\",\n    \"model_inputshape\": [100,100,4],\n    \"model_zoom\" 17,\n    \"storage\": true,\n    \"classes\": [\n        {\"name\": \"Water\", \"color\": \"#0000FF\"},\n    ],\n    \"meta\": {}\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "Model"
  },
  {
    "type": "delete",
    "url": "/api/model/:modelid",
    "title": "Delete Model",
    "version": "1.0.0",
    "name": "DeleteModel",
    "group": "Model",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Mark a model as inactive, and disallow subsequent instances of this model Note: this will not affect currently running instances of the model</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"status\": 200,\n    \"message\": \"Model deleted\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "Model"
  },
  {
    "type": "get",
    "url": "/api/model/:modelid/download",
    "title": "Download Model",
    "version": "1.0.0",
    "name": "DownloadModel",
    "group": "Model",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Return the model itself</p>",
    "filename": "./index.js",
    "groupTitle": "Model"
  },
  {
    "type": "get",
    "url": "/api/model/:modelid",
    "title": "Get Model",
    "version": "1.0.0",
    "name": "GetModel",
    "group": "Model",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Return a all information for a single model</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"id\": 1,\n    \"created\": \"<date>\",\n    \"active\": true,\n    \"uid\": 1,\n    \"name\": \"HCMC Sentinel 2019 Unsupervised\",\n    \"model_type\": \"keras_example\",\n    \"model_inputshape\": [100,100,4],\n    \"model_zoom\": 17,\n    \"storage\": true,\n    \"classes\": [\n        {\"name\": \"Water\", \"color\": \"#0000FF\"},\n    ],\n    \"meta\": {}\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "Model"
  },
  {
    "type": "get",
    "url": "/api/model",
    "title": "List Models",
    "version": "1.0.0",
    "name": "ListModel",
    "group": "Model",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>List information about a set of models</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"models\": [{\n        \"id\": 1,\n        \"created\": \"<date>\",\n        \"active\": true,\n        \"name\": \"NA Model\"\n    }]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "Model"
  },
  {
    "type": "patch",
    "url": "/api/model/:modelid",
    "title": "Update Model",
    "version": "1.0.0",
    "name": "PatchModel",
    "group": "Model",
    "permission": [
      {
        "name": "admin",
        "title": "Admin",
        "description": "<p>The user must be an admin to use this endpoint</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "Boolean",
            "optional": true,
            "field": "storage",
            "description": "<p>undefined</p>"
          },
          {
            "group": "Body",
            "type": "Number[]/Null",
            "optional": true,
            "field": "bounds",
            "description": "<p>Recommended geographic area on which this model can be used</p>"
          }
        ]
      }
    },
    "description": "<p>Update a model</p>",
    "filename": "./index.js",
    "groupTitle": "Model"
  },
  {
    "type": "get",
    "url": "/api/mosaic/:layer",
    "title": "Get TileJson",
    "version": "1.0.0",
    "name": "GetJson",
    "group": "Mosaic",
    "permission": [
      {
        "name": "public",
        "title": "Public",
        "description": "<p>This API endpoint does not require authentication</p>"
      }
    ],
    "description": "<p>Return a TileJSON object for a given mosaic layer</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"tilejson\": \"2.2.0\",\n    \"name\": \"naip.latest\",\n    \"version\": \"1.0.0\",\n    \"scheme\": \"xyz\",\n    \"tiles\": [ \"http://localhost:8000/mosaic/naip.latest/tiles/{z}/{x}/{y}@1x?\" ],\n    \"minzoom\": 12,\n    \"maxzoom\": 18,\n    \"bounds\": [\n        -124.81903735821528,\n        24.49673997373884,\n        -66.93084562551495,\n        49.44192498524237\n    ],\n    \"center\": [ -95.87494149186512, 36.9693324794906, 12 ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "Mosaic"
  },
  {
    "type": "get",
    "url": "/mosaic/:layer/tiles/:z/:x/:y.:format",
    "title": "Get Tile",
    "version": "1.0.0",
    "name": "GetTile",
    "group": "Mosaic",
    "permission": [
      {
        "name": "public",
        "title": "Public",
        "description": "<p>This API endpoint does not require authentication</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Query": [
          {
            "group": "Query",
            "type": "Integer",
            "optional": true,
            "field": "scale",
            "defaultValue": "1",
            "description": "<p>Tile size scale. 1=256x256, 2=512x512...</p>"
          },
          {
            "group": "Query",
            "type": "String",
            "allowedValues": [
              "\"first\"",
              "\"highest\"",
              "\"lowest\"",
              "\"mean\"",
              "\"median\"",
              "\"stdev\""
            ],
            "optional": true,
            "field": "pixel_selection",
            "defaultValue": "first",
            "description": "<p>The offset based on limit to return</p>"
          },
          {
            "group": "Query",
            "type": "String",
            "optional": true,
            "field": "bidx",
            "description": "<p>comma (',') delimited band indexes</p>"
          },
          {
            "group": "Query",
            "type": "String",
            "optional": true,
            "field": "expression",
            "description": "<p>rio-tiler's band math expression (e.g B1/B2)</p>"
          },
          {
            "group": "Query",
            "type": "String",
            "optional": true,
            "field": "nodata",
            "description": "<p>Overwrite internal Nodata value</p>"
          },
          {
            "group": "Query",
            "type": "Boolean",
            "optional": true,
            "field": "unscale",
            "description": "<p>Apply internal Scale/Offset</p>"
          },
          {
            "group": "Query",
            "type": "String",
            "allowedValues": [
              "\"nearest\"",
              "\"bilinear\"",
              "\"cubic\"",
              "\"cubic_spline\"",
              "\"lanczos\"",
              "\"average\"",
              "\"mode\"",
              "\"gauss\"",
              "\"max\"",
              "\"min\"",
              "\"med\"",
              "\"q1\"",
              "\"q3\"",
              "\"rms\""
            ],
            "optional": true,
            "field": "resampling_method",
            "defaultValue": "nearest",
            "description": "<p>Resampling method.</p>"
          },
          {
            "group": "Query",
            "type": "String",
            "optional": true,
            "field": "rescale",
            "description": "<p>comma (',') delimited Min,Max bounds</p>"
          },
          {
            "group": "Query",
            "type": "String",
            "optional": true,
            "field": "color_formula",
            "description": "<p>rio-color formula (info: https://github.com/mapbox/rio-color)</p>"
          },
          {
            "group": "Query",
            "type": "String",
            "allowedValues": [
              "\"above\"",
              "\"accent\"",
              "\"accent_r\"",
              "\"afmhot\"",
              "\"afmhot_r\"",
              "\"autumn\"",
              "\"autumn_r\"",
              "\"binary\"",
              "\"binary_r\"",
              "\"blues\"",
              "\"blues_r\"",
              "\"bone\"",
              "\"bone_r\"",
              "\"brbg\"",
              "\"brbg_r\"",
              "\"brg\"",
              "\"brg_r\"",
              "\"bugn\"",
              "\"bugn_r\"",
              "\"bupu\"",
              "\"bupu_r\"",
              "\"bwr\"",
              "\"bwr_r\"",
              "\"cfastie\"",
              "\"cividis\"",
              "\"cividis_r\"",
              "\"cmrmap\"",
              "\"cmrmap_r\"",
              "\"cool\"",
              "\"cool_r\"",
              "\"coolwarm\"",
              "\"coolwarm_r\"",
              "\"copper\"",
              "\"copper_r\"",
              "\"cubehelix\"",
              "\"cubehelix_r\"",
              "\"dark2\"",
              "\"dark2_r\"",
              "\"flag\"",
              "\"flag_r\"",
              "\"gist_earth\"",
              "\"gist_earth_r\"",
              "\"gist_gray\"",
              "\"gist_gray_r\"",
              "\"gist_heat\"",
              "\"gist_heat_r\"",
              "\"gist_ncar\"",
              "\"gist_ncar_r\"",
              "\"gist_rainbow\"",
              "\"gist_rainbow_r\"",
              "\"gist_stern\"",
              "\"gist_stern_r\"",
              "\"gist_yarg\"",
              "\"gist_yarg_r\"",
              "\"gnbu\"",
              "\"gnbu_r\"",
              "\"gnuplot\"",
              "\"gnuplot2\"",
              "\"gnuplot2_r\"",
              "\"gnuplot_r\"",
              "\"gray\"",
              "\"gray_r\"",
              "\"greens\"",
              "\"greens_r\"",
              "\"greys\"",
              "\"greys_r\"",
              "\"hot\"",
              "\"hot_r\"",
              "\"hsv\"",
              "\"hsv_r\"",
              "\"inferno\"",
              "\"inferno_r\"",
              "\"jet\"",
              "\"jet_r\"",
              "\"magma\"",
              "\"magma_r\"",
              "\"nipy_spectral\"",
              "\"nipy_spectral_r\"",
              "\"ocean\"",
              "\"ocean_r\"",
              "\"oranges\"",
              "\"oranges_r\"",
              "\"orrd\"",
              "\"orrd_r\"",
              "\"paired\"",
              "\"paired_r\"",
              "\"pastel1\"",
              "\"pastel1_r\"",
              "\"pastel2\"",
              "\"pastel2_r\"",
              "\"pink\"",
              "\"pink_r\"",
              "\"piyg\"",
              "\"piyg_r\"",
              "\"plasma\"",
              "\"plasma_r\"",
              "\"prgn\"",
              "\"prgn_r\"",
              "\"prism\"",
              "\"prism_r\"",
              "\"pubu\"",
              "\"pubu_r\"",
              "\"pubugn\"",
              "\"pubugn_r\"",
              "\"puor\"",
              "\"puor_r\"",
              "\"purd\"",
              "\"purd_r\"",
              "\"purples\"",
              "\"purples_r\"",
              "\"rainbow\"",
              "\"rainbow_r\"",
              "\"rdbu\"",
              "\"rdbu_r\"",
              "\"rdgy\"",
              "\"rdgy_r\"",
              "\"rdpu\"",
              "\"rdpu_r\"",
              "\"rdylbu\"",
              "\"rdylbu_r\"",
              "\"rdylgn\"",
              "\"rdylgn_r\"",
              "\"reds\"",
              "\"reds_r\"",
              "\"rplumbo\"",
              "\"schwarzwald\"",
              "\"seismic\"",
              "\"seismic_r\"",
              "\"set1\"",
              "\"set1_r\"",
              "\"set2\"",
              "\"set2_r\"",
              "\"set3\"",
              "\"set3_r\"",
              "\"spectral\"",
              "\"spectral_r\"",
              "\"spring\"",
              "\"spring_r\"",
              "\"summer\"",
              "\"summer_r\"",
              "\"tab10\"",
              "\"tab10_r\"",
              "\"tab20\"",
              "\"tab20_r\"",
              "\"tab20b\"",
              "\"tab20b_r\"",
              "\"tab20c\"",
              "\"tab20c_r\"",
              "\"terrain\"",
              "\"terrain_r\"",
              "\"twilight\"",
              "\"twilight_r\"",
              "\"twilight_shifted\"",
              "\"twilight_shifted_r\"",
              "\"viridis\"",
              "\"viridis_r\"",
              "\"winter\"",
              "\"winter_r\"",
              "\"wistia\"",
              "\"wistia_r\"",
              "\"ylgn\"",
              "\"ylgn_r\"",
              "\"ylgnbu\"",
              "\"ylgnbu_r\"",
              "\"ylorbr\"",
              "\"ylorbr_r\"",
              "\"ylorrd\"",
              "\"ylorrd_r\""
            ],
            "optional": true,
            "field": "color_map",
            "description": "<p>rio-tiler's colormap name</p>"
          },
          {
            "group": "Query",
            "type": "Boolean",
            "optional": true,
            "field": "return_mask",
            "defaultValue": "true",
            "description": "<p>Add mask to the output data.</p>"
          }
        ],
        "Parameter": [
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "z",
            "description": "<p>Mercator Z coordinate</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "x",
            "description": "<p>Mercator X coordinate</p>"
          },
          {
            "group": "Parameter",
            "type": "Integer",
            "optional": false,
            "field": "y",
            "description": "<p>Mercator Y coordinate</p>"
          },
          {
            "group": "Parameter",
            "type": "String",
            "optional": false,
            "field": "format",
            "description": "<p>Available values : png, npy, tif, jpg, jp2, webp, pngraw</p>"
          }
        ]
      }
    },
    "description": "<p>Return an aerial imagery tile for a given set of mercator coordinates</p>",
    "filename": "./index.js",
    "groupTitle": "Mosaic"
  },
  {
    "type": "get",
    "url": "/api/mosaic",
    "title": "List Mosaics",
    "version": "1.0.0",
    "name": "ListMosaic",
    "group": "Mosaic",
    "permission": [
      {
        "name": "public",
        "title": "Public",
        "description": "<p>This API endpoint does not require authentication</p>"
      }
    ],
    "description": "<p>Return a list of currently supported mosaic layers</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"mosaics\": [\n        \"naip.latest\"\n    ]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "Mosaic"
  },
  {
    "type": "delete",
    "url": "/api/project/:projectid",
    "title": "Delete Project",
    "version": "1.0.0",
    "name": "DeleteProject",
    "group": "Project",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Delete a project</p>",
    "filename": "./index.js",
    "groupTitle": "Project"
  },
  {
    "type": "post",
    "url": "/api/project",
    "title": "Create Project",
    "version": "1.0.0",
    "name": "CreateProject",
    "group": "Projects",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Create a new project</p>",
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>Name of the Project</p>"
          },
          {
            "group": "Body",
            "type": "Integer",
            "optional": false,
            "field": "model_id",
            "description": "<p>Starter Model to use for project</p>"
          },
          {
            "group": "Body",
            "type": "String",
            "optional": false,
            "field": "mosaic",
            "description": "<p>Imagery to use with model</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"id\": 1432,\n    \"name\": \"Test Project\",\n    \"created\": \"<date>\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "Projects"
  },
  {
    "type": "get",
    "url": "/api/project/:projectid",
    "title": "Get Project",
    "version": "1.0.0",
    "name": "GetProject",
    "group": "Projects",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Return all information about a given project</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"id\": 1,\n    \"name\": \"Test Project\",\n    \"created\": \"<date>\"\n    \"model_id\": 1,\n    \"mosaic\": \"naip.latest\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "Projects"
  },
  {
    "type": "post",
    "url": "/api/project",
    "title": "List Projects",
    "version": "1.0.0",
    "name": "ListProjects",
    "group": "Projects",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Query": [
          {
            "group": "Query",
            "type": "Integer",
            "optional": true,
            "field": "limit",
            "defaultValue": "100",
            "description": "<p>Limit number of returned runs</p>"
          },
          {
            "group": "Query",
            "type": "Integer",
            "optional": true,
            "field": "page",
            "defaultValue": "0",
            "description": "<p>The offset based on limit to return</p>"
          },
          {
            "group": "Query",
            "type": "String",
            "optional": true,
            "field": "sort",
            "defaultValue": "desc",
            "description": "<p>Sorting order for listing projects based on created timestamp. Allowed 'desc' and 'asc'. Default desc.</p>"
          },
          {
            "group": "Query",
            "type": "String",
            "optional": true,
            "field": "name",
            "defaultValue": "",
            "description": "<p>Filter projects that matches the name.</p>"
          }
        ]
      }
    },
    "description": "<p>Return a list of projects</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"total\": 1,\n    \"projects\": [{\n        \"id\": 1,\n        \"name\": 123,\n        \"created\": \"<date>\",\n        \"aois\": [{\n           \"id\": 1,\n           \"name\": \"aoi name\",\n           \"created\": \"<date>\",\n           \"storage\": false\n         }],\n         \"checkpoints\": []\n    }]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "Projects"
  },
  {
    "type": "patch",
    "url": "/api/project/:projectid",
    "title": "Patch Project",
    "version": "1.0.0",
    "name": "PatchProject",
    "group": "Projects",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Update an existing Project</p>",
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "String",
            "optional": true,
            "field": "name",
            "description": "<p>Name of the Project</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"id\": 1432,\n    \"name\": \"Test Project\",\n    \"created\": \"<date>\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "Projects"
  },
  {
    "type": "get",
    "url": "/api/schema",
    "title": "List Schemas",
    "version": "1.0.0",
    "name": "ListSchemas",
    "group": "Schemas",
    "permission": [
      {
        "name": "public",
        "title": "Public",
        "description": "<p>This API endpoint does not require authentication</p>"
      }
    ],
    "description": "<p>List all JSON Schemas in use With no parameters this API will return a list of all the endpoints that have a form of schema validation If the url/method params are used, the schemas themselves are returned</p> <pre><code>Note: If url or method params are used, they must be used together</code></pre>",
    "parameter": {
      "fields": {
        "Query": [
          {
            "group": "Query",
            "type": "String",
            "allowedValues": [
              "\"GET\"",
              "\"HEAD\"",
              "\"POST\"",
              "\"PUT\"",
              "\"DELETE\"",
              "\"CONNECT\"",
              "\"OPTIONS\"",
              "\"TRACE\"",
              "\"PATCH\""
            ],
            "optional": true,
            "field": "method",
            "description": "<p>HTTP Verb</p>"
          },
          {
            "group": "Query",
            "type": "String",
            "optional": true,
            "field": "url",
            "description": "<p>URLEncoded URL that you want to fetch</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "Success 200": [
          {
            "group": "Success 200",
            "type": "Unknown",
            "optional": true,
            "field": "schemas",
            "description": "<p>undefined</p>"
          }
        ]
      }
    },
    "filename": "./index.js",
    "groupTitle": "Schemas"
  },
  {
    "type": "get",
    "url": "/health",
    "title": "Server Healthcheck",
    "version": "1.0.0",
    "name": "Health",
    "group": "Server",
    "permission": [
      {
        "name": "public",
        "title": "Public",
        "description": "<p>This API endpoint does not require authentication</p>"
      }
    ],
    "description": "<p>AWS ELB Healthcheck for the server</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"healthy\": true,\n    \"message\": \"Good to go\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "Server"
  },
  {
    "type": "get",
    "url": "/api",
    "title": "Get Metadata",
    "version": "1.0.0",
    "name": "Meta",
    "group": "Server",
    "permission": [
      {
        "name": "public",
        "title": "Public",
        "description": "<p>This API endpoint does not require authentication</p>"
      }
    ],
    "description": "<p>Return basic metadata about server configuration</p> <pre><code>limits.live_inference: The area in metres that can be live inferenced limits.max_inference: The max area in metres that can be inferenced limits.instance_window: The number of seconds a GPU Instance can be idle before termination</code></pre>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"version\": \"1.0.0\"\n    \"limits\": {\n        \"live_inference\": 100000000 (m^2)\n        \"max_inference\": 100000000 (m^2)\n        \"instance_window\": 600 (m secs)\n    }\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "Server"
  },
  {
    "type": "delete",
    "url": "/api/project/:projectid/aoi/:aoiid/share/:shareuuid",
    "title": "Delete Share",
    "version": "1.0.0",
    "name": "DeleteShare",
    "group": "Share",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Delete a Shared AOI</p>",
    "filename": "./index.js",
    "groupTitle": "Share"
  },
  {
    "type": "get",
    "url": "/api/share/:shareuuid",
    "title": "Get AOI",
    "version": "1.0.0",
    "name": "GetAOI",
    "group": "Share",
    "permission": [
      {
        "name": "public",
        "title": "Public",
        "description": "<p>This API endpoint does not require authentication</p>"
      }
    ],
    "description": "<p>Return all information about a given AOI Export using the UUID</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"id\": 1432,\n    \"name\": \"I'm an AOI\",\n    \"checkpoint_id\": 1,\n    \"storage\": true,\n    \"bookmarked\": false\n    \"created\": \"<date>\",\n    \"bounds\": { \"GeoJSON \"},\n    \"classes\": []\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "Share"
  },
  {
    "type": "get",
    "url": "/api/project/:projectid/share",
    "title": "List Shares",
    "version": "1.0.0",
    "name": "ListShares",
    "group": "Share",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Return all shares for a given project</p>",
    "parameter": {
      "fields": {
        "Query": [
          {
            "group": "Query",
            "type": "Integer",
            "optional": true,
            "field": "limit",
            "defaultValue": "100",
            "description": "<p>Limit number of returned aois</p>"
          },
          {
            "group": "Query",
            "type": "Integer",
            "optional": true,
            "field": "page",
            "defaultValue": "0",
            "description": "<p>The offset based on limit to return</p>"
          },
          {
            "group": "Query",
            "type": "Integer",
            "optional": true,
            "field": "checkpointid",
            "defaultValue": "0",
            "description": "<p>Only return AOIs for a specific checkpoint</p>"
          },
          {
            "group": "Query",
            "type": "String",
            "optional": true,
            "field": "bookmarked",
            "defaultValue": "",
            "description": "<p>Filter AOIs based on bookmarked. Allowed 'true' or 'false'. By default returns all.</p>"
          },
          {
            "group": "Query",
            "type": "String",
            "optional": true,
            "field": "sort",
            "defaultValue": "desc",
            "description": "<p>Sorting order for listing AOIs based on created timestamp. Allowed 'desc' and 'asc'</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"total\": 1,\n    \"project_id\": 123,\n    \"shares\": [{\n        \"uuid\": \"<uuid>\",\n        \"aoi_id\": 1432,\n        \"storage\": true,\n        \"created\": \"<date>\"\n    }]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "Share"
  },
  {
    "type": "get",
    "url": "/api/share/:shareuuid/tiles/:z/:x/:y",
    "title": "Tile AOI",
    "version": "1.0.0",
    "name": "TileAOI",
    "group": "Share",
    "permission": [
      {
        "name": "public",
        "title": "Public",
        "description": "<p>This API endpoint does not require authentication</p>"
      }
    ],
    "description": "<p>Return a Tile for a given AOI using uuid</p>",
    "filename": "./index.js",
    "groupTitle": "Share"
  },
  {
    "type": "post",
    "url": "/api/token",
    "title": "Create Token",
    "version": "1.0.0",
    "name": "CreateToken",
    "group": "Token",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Create a new API token to perform API requests with</p>",
    "parameter": {
      "fields": {
        "Body": [
          {
            "group": "Body",
            "type": "String",
            "optional": false,
            "field": "name",
            "description": "<p>name of the created token</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"username\": \"example\"\n    \"email\": \"example@example.com\",\n    \"access\": \"admin\",\n    \"flags\": {}\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "Token"
  },
  {
    "type": "delete",
    "url": "/api/token/:id",
    "title": "Delete Token",
    "version": "1.0.0",
    "name": "DeleteToken",
    "group": "Token",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Delete an existing token</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"status\": 200,\n    \"message\": \"Token Deleted\"\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "Token"
  },
  {
    "type": "get",
    "url": "/api/token",
    "title": "List Tokens",
    "version": "1.0.0",
    "name": "ListTokens",
    "group": "Token",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n[{\n    \"id\": 1,\n    \"created\": \"<date>\",\n    \"name\": \"Token Name\"\n}]",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "Token"
  },
  {
    "type": "get",
    "url": "/api/user",
    "title": "List Users",
    "version": "1.0.0",
    "name": "ListUsers",
    "group": "User",
    "permission": [
      {
        "name": "admin",
        "title": "Admin",
        "description": "<p>The user must be an admin to use this endpoint</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Query": [
          {
            "group": "Query",
            "type": "Integer",
            "optional": true,
            "field": "limit",
            "defaultValue": "100",
            "description": "<p>Limit number of returned runs</p>"
          },
          {
            "group": "Query",
            "type": "Integer",
            "optional": true,
            "field": "page",
            "defaultValue": "0",
            "description": "<p>The offset based on limit to return</p>"
          },
          {
            "group": "Query",
            "type": "String",
            "optional": true,
            "field": "filter",
            "defaultValue": "",
            "description": "<p>Filter a complete or partial username/email</p>"
          }
        ]
      }
    },
    "description": "<p>Return a list of users that have registered with the service</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"total\": 1,\n    \"users\": [{\n        \"id\": 1,\n        \"username\": \"example\",\n        \"email\": \"example@example.com\",\n        \"access\": \"user\",\n        \"flags\": { \"test_flag\": true }\n    }]\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "User"
  },
  {
    "type": "get",
    "url": "/api/user/me",
    "title": "Get User Session Metadata",
    "version": "1.0.0",
    "name": "self",
    "group": "User",
    "permission": [
      {
        "name": "user",
        "title": "User",
        "description": "<p>A user must be logged in to use this endpoint</p>"
      }
    ],
    "description": "<p>Return basic user information about the currently authenticated user</p>",
    "success": {
      "examples": [
        {
          "title": "Success-Response:",
          "content": "HTTP/1.1 200 OK\n{\n    \"username\": \"example\"\n    \"email\": \"example@example.com\",\n    \"access\": \"admin\",\n    \"flags\": {}\n}",
          "type": "json"
        }
      ]
    },
    "filename": "./index.js",
    "groupTitle": "User"
  }
] });
