/* globals require, jest, expect, describe, it */
import crudToHttp from '../../src/middleware/crudToHttp'

function requestTesterConnector(test) {
  return {
    create: req => test(req),
    read: req => test(req),
    update: req => test(req),
    delete: req => test(req),
  };
}

it('uses correct default http methods', () => {
  const mw = crudToHttp();

  function tester(methodName) {
    return requestTesterConnector(req => expect(req.httpMethod).toBe(methodName));
  }

  mw(tester('post')).create({});
  mw(tester('get')).read({});
  mw(tester('patch')).update({});
  mw(tester('delete')).delete({});
});

it('uses custom mapping correctly', () => {
  const mw = crudToHttp({
    create: 'post',
    read: 'post',
    update: 'post',
    delete: 'post',
  });

  function tester(methodName) {
    return requestTesterConnector(req => expect(req.httpMethod).toBe(methodName));
  }

  mw(tester('post')).create({});
  mw(tester('post')).read({});
  mw(tester('post')).update({});
  mw(tester('post')).delete({});
});
