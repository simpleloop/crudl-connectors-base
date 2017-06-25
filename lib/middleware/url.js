'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = url;

var _url = require('url');

var _pathToRegexp = require('path-to-regexp');

var _pathToRegexp2 = _interopRequireDefault(_pathToRegexp);

var _consumeParams = require('../consumeParams');

var _consumeParams2 = _interopRequireDefault(_consumeParams);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function resolveParams(path, req) {
    var resolved = {};
    var keys = [];
    (0, _pathToRegexp2.default)(path, keys);

    var params = (0, _consumeParams2.default)(req, keys.length);

    // Take the keys and associate them with the request params
    keys.forEach(function (key, index) {
        resolved[key.name] = params[index];
    });

    return resolved;
}

function resolvePath(path, req) {
    try {
        var parsed = (0, _url.parse)(path, true);
        var params = resolveParams(parsed.pathname, req);

        parsed.pathname = _pathToRegexp2.default.compile(parsed.pathname)(params);

        return (0, _url.format)(parsed);
    } catch (e) {
        throw new Error('Could not resolve the url path \'' + path + '\'. (' + e + ').');
    }
}

function url(path) {
    return function urlMiddleware(next) {
        return {
            create: function create(req) {
                req.url = resolvePath(path, req);return next.create(req);
            },
            read: function read(req) {
                req.url = resolvePath(path, req);return next.read(req);
            },
            update: function update(req) {
                req.url = resolvePath(path, req);return next.update(req);
            },
            delete: function _delete(req) {
                req.url = resolvePath(path, req);return next.delete(req);
            }
        };
    };
}