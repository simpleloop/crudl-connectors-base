'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _crudToHttp = require('./crudToHttp');

var _crudToHttp2 = _interopRequireDefault(_crudToHttp);

var _url = require('./url');

var _url2 = _interopRequireDefault(_url);

var _transformData = require('./transformData');

var _transformData2 = _interopRequireDefault(_transformData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    crudToHttp: _crudToHttp2.default,
    url: _url2.default,
    transformData: _transformData2.default
};