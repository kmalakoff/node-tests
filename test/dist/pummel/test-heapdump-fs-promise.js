// Flags: --expose-internals
'use strict';

require('../common');

var _require = require('../common/heap'),
    validateSnapshotNodes = _require.validateSnapshotNodes;

var fs = require('fs').promises;

validateSnapshotNodes('Node / FSReqPromise', []);
fs.stat(__filename);
validateSnapshotNodes('Node / FSReqPromise', [{
  children: [{
    node_name: 'FSReqPromise',
    edge_name: 'wrapped'
  }, {
    node_name: 'Float64Array',
    edge_name: 'stats_field_array'
  }]
}]);