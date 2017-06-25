'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = consumeParams;
function consumeParams(req, nParams) {
  if (nParams === 0) {
    return [];
  }

  if (_typeof(req.params) !== 'object' || typeof req.params.length !== 'number') {
    throw new Error('Request params must be an array. Obtained ' + _typeof(req.params));
  }

  if (req.params.length < nParams) {
    throw new Error('Not enough params to consume. The request contains ' + req.params.lenght + ' params, ' + nParams + ' were requested.');
  }

  return req.params.splice(req.params.length - nParams);
}