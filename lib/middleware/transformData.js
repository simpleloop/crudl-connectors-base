'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformData;
/**
* Creates a transformData middleware
* @methodRegExp Which methods should be transformed e.g. 'create|update'
* @transform The transform function
*/
function transformData(methodRegExp) {
  var transform = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (data) {
    return data;
  };

  var re = new RegExp(methodRegExp || '.*');

  // The middleware function
  return function transformDataMiddleware(next) {
    // Checks if the call should be transformed. If yes, it applies the transform function
    function checkAndTransform(method) {
      return re.test(method) ? function (req) {
        return next[method](req).then(function (res) {
          return Object.assign(res, { data: transform(res.data) });
        });
      } : function (req) {
        return next[method](req);
      };
    }

    // The middleware connector:
    return {
      create: checkAndTransform('create'),
      read: checkAndTransform('read'),
      update: checkAndTransform('update'),
      delete: checkAndTransform('delete')
    };
  };
}