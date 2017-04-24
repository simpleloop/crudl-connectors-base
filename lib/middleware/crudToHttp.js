
const defaultMapping = {
  create: 'post',
  read: 'get',
  update: 'patch',
  delete: 'delete',
};

function crudToHttp(httpMethodMapping) {
  const crud2http = Object.assign({}, defaultMapping, httpMethodMapping);

  return function crudToHttpMiddleware(next) {
    return {
      create: (req) => { req.httpMethod = crud2http.create; return next.create(req); },
      read: (req) => { req.httpMethod = crud2http.read; return next.read(req); },
      update: (req) => { req.httpMethod = crud2http.update; return next.update(req); },
      delete: (req) => { req.httpMethod = crud2http.delete; return next.delete(req); },
    };
  };
}

module.exports = crudToHttp;
