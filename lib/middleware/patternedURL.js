const url = require('url');
const pathToRegexp = require('path-to-regexp');
const consumeParams = require('../consumeParams');

function resolveParams(path, req) {
  const resolved = {};
  const keys = [];
  pathToRegexp(path, keys);

  const params = consumeParams(req, keys.length);

  // Take the keys and associate them with the request params
  keys.forEach((key, index) => {
    resolved[key.name] = params[index];
  });

  return resolved;
}

function resolvePath(path, req) {
  try {
    const parsed = url.parse(path, true);
    const params = resolveParams(parsed.pathname, req);

    parsed.pathname = pathToRegexp.compile(parsed.pathname)(params);

    return url.format(parsed);
  } catch (e) {
    throw new Error(`Could not resolve the url path '${path}'. (${e}).`);
  }
}


function patternedURL(path) {
  return function RESTMiddleware(next) {
    return {
      create: (req) => { req.url = resolvePath(path, req); return next.create(req); },
      read: (req) => { req.url = resolvePath(path, req); return next.read(req); },
      update: (req) => { req.url = resolvePath(path, req); return next.update(req); },
      delete: (req) => { req.url = resolvePath(path, req); return next.delete(req); },
    };
  };
}

module.exports = patternedURL;
