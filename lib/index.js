'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.consumeParams = exports.createBackendConnector = exports.createFrontendConnector = undefined;

var _createFrontendConnector = require('./createFrontendConnector');

var _createFrontendConnector2 = _interopRequireDefault(_createFrontendConnector);

var _createBackendConnector = require('./createBackendConnector');

var _createBackendConnector2 = _interopRequireDefault(_createBackendConnector);

var _consumeParams = require('./consumeParams');

var _consumeParams2 = _interopRequireDefault(_consumeParams);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.createFrontendConnector = _createFrontendConnector2.default;
exports.createBackendConnector = _createBackendConnector2.default;
exports.consumeParams = _consumeParams2.default;