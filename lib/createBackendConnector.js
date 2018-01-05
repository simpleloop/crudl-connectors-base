'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = createBackendConnector;

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
* This is a general backend connector that uses axios to execute API calls.
* It requires a request object with the following attributes:
*
* url:        a string value: required
* httpMethod: a string value. The http method to use (https://github.com/mzabriskie/axios); required
* data:       an object or an array; optional
* headers:    an object of the form { <HeaderName>: <Value> }; optional
*/
function createBackendConnector() {
    var axiosConfig = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    function axiosCall(req) {
        // URL is required
        if (typeof req.url !== 'string') {
            throw new Error('The request URL must be a string. Found ' + _typeof(req.url));
        }
        // http method is required
        if (typeof req.httpMethod !== 'string') {
            throw new Error('The request httpMethod must be a string. Found ' + _typeof(req.httpMethod));
        }

        var requestHeaders = req.headers;
        if (axiosConfig.headers) {
            requestHeaders = Object.assign({}, axiosConfig.headers, req.headers);
        }

        return (0, _axios2.default)(Object.assign(axiosConfig, {
            url: req.url,
            method: req.httpMethod,
            headers: requestHeaders,
            data: req.data
        })).catch(function (error) {
            throw error.response;
        });
    }

    return {
        create: axiosCall,
        read: axiosCall,
        update: axiosCall,
        delete: axiosCall
    };
}