/*!
 * Copyright (C) Microsoft Corporation. All rights reserved.
 * This file is auto-generated. Do not modify it manually.
 * Changes to this file may be overwritten.
 */

export const dataSourcesInfo = {
  "enprueba_proyectosvinculacion": {
    "tableId": "En Prueba: ProyectosVinculacion",
    "version": "",
    "primaryKey": "ID",
    "dataSourceType": "Connector",
    "apis": {
      "GetAuthor": {
        "path": "/{connectionId}/datasets/{dataset}/tables/127dc5142945420b8050dc3e24a205f5/entities/Author",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "search",
            "in": "query",
            "required": false,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "array"
          }
        }
      },
      "GetEditor": {
        "path": "/{connectionId}/datasets/{dataset}/tables/127dc5142945420b8050dc3e24a205f5/entities/Editor",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "search",
            "in": "query",
            "required": false,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "array"
          }
        }
      },
      "Get4651e8f238c94ad08def41f743f76f30": {
        "path": "/{connectionId}/datasets/{dataset}/tables/127dc5142945420b8050dc3e24a205f5/entities/4651e8f238c94ad08def41f743f76f30",
        "method": "GET",
        "parameters": [
          {
            "name": "connectionId",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "dataset",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "table",
            "in": "path",
            "required": true,
            "type": "string"
          },
          {
            "name": "search",
            "in": "query",
            "required": false,
            "type": "string"
          }
        ],
        "responseInfo": {
          "200": {
            "type": "array"
          }
        }
      }
    }
  }
};
