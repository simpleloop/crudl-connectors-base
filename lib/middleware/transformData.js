
function createTransformData(methodRegExp, transformation = data => data) {
  const re = new RegExp(methodRegExp || '.*');
  return function transformData(next) {
    function checkAndTransform(methodName) {
      return req => next[methodName](req).then(res => (
        re.test(methodName) ? Object.assign(res, { data: transformation(res.data) }) : res
      ));
    }

    return {
      create: checkAndTransform('create'),
      read: checkAndTransform('read'),
      update: checkAndTransform('update'),
      delete: checkAndTransform('delete'),
    };
  };
}

module.exports = createTransformData;
