'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createFrontendConnector = require('./createFrontendConnector');

var _createFrontendConnector2 = _interopRequireDefault(_createFrontendConnector);

var _createBackendConnector = require('./createBackendConnector');

var _createBackendConnector2 = _interopRequireDefault(_createBackendConnector);

var _consumeParams = require('./consumeParams');

var _consumeParams2 = _interopRequireDefault(_consumeParams);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  createFrontendConnector: _createFrontendConnector2.default,
  createBackendConnector: _createBackendConnector2.default,
  consumeParams: _consumeParams2.default
};