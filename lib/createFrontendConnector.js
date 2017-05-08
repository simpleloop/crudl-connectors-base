function notImplemented(methodName) {
  return () => Promise.reject(`The ${methodName} method is not implemented.`);
}

const defaultConnector = {
  create: notImplemented('create'),
  read: notImplemented('read'),
  update: notImplemented('update'),
  delete: notImplemented('delete'),
};

function parametrize(connector, params = []) {
  const addParams = (req) => {
    if (!req.params) {
      req.params = [];
    }
    req.params = params.concat(req.params);
    return req;
  };

  return {
    create: req => connector.create(addParams(req)),
    read: req => connector.read(addParams(req)),
    update: req => connector.update(addParams(req)),
    delete: req => connector.delete(addParams(req)),
  };
}

// Completes the (potentially) partial connector such that
// any missing crud methods will be taken from the full connector
function completeConnector(partial = {}, full) {
  const checkAndAssign = (methodName) => {
    if (typeof partial[methodName] === 'undefined') {
      partial[methodName] = full[methodName]; // eslint-disable-line no-param-reassign
    }
  };

  checkAndAssign('create');
  checkAndAssign('read');
  checkAndAssign('update');
  checkAndAssign('delete');

  return partial;
}

module.exports = function createFrontendConnector(connector) {
  const c = completeConnector(connector, defaultConnector);

  // Frontend connector is a function that returns a parametrized connector
  const fc = (...params) => createFrontendConnector(parametrize(c, params));

  // The crud methods of a frontend connector return data instead of responses
  fc.create = (req = {}) => c.create(req).then(res => res.data);
  fc.read = (req = {}) => c.read(req).then(res => res.data);
  fc.update = (req = {}) => c.update(req).then(res => res.data);
  fc.delete = (req = {}) => c.delete(req).then(res => res.data);

  // With the use() method a user can apply middleware to this connector.
  // A middleware is a function that takes the next connector and returns a new connector.
  // The new connector is allowed to implement only a subset of the crud methods. The
  // not implemented once will be automatically passed to the next connector
  fc.use = mw => createFrontendConnector(completeConnector(mw(c), fc));

  return fc;
};
