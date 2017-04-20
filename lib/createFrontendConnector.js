const notImplemented = methodName => () => {
  throw new Error(`The ${methodName} method is not implemented.`);
};

const defaultConnector = {
  create: notImplemented('create'),
  read: notImplemented('read'),
  update: notImplemented('update'),
  delete: notImplemented('delete'),
};

function parametrize(connector, params) {
  const addParams = (req) => {
    if (!req.params) {
      req.params = [];
    }
    req.params.push(...params);
    return req;
  };

  return {
    create: req => connector.create(addParams(req)),
    read: req => connector.read(addParams(req)),
    update: req => connector.update(addParams(req)),
    delete: req => connector.delete(addParams(req)),
  };
}

module.exports = function createFrontendConnector(connector) {
  // Complete the connector
  const c = Object.assign({}, defaultConnector, connector);

  // Frontend connector is a function that returns a parametrized connector
  const fc = (...params) => createFrontendConnector(parametrize(c, params));

  // The crud methods of a frontend connector return data instead of responses
  fc.create = (...args) => c.create(...args).then(res => res.data);
  fc.read = (...args) => c.read(...args).then(res => res.data);
  fc.update = (...args) => c.update(...args).then(res => res.data);
  fc.delete = (...args) => c.delete(...args).then(res => res.data);

  // With the use() method a user can apply middleware to this connector.
  // A middleware is a function that takes the next connector and returns a new connector.
  // The new connector is allowed to implement only a subset of the crud methods. The
  // not implemented once will be automatically passed to the next connector
  fc.use = mw => createFrontendConnector(Object.assign({}, fc, mw(c)));

  return fc;
};
