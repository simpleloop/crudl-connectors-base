/* globals require, jest, expect, describe, it */
import url from '../../src/middleware/url'

function requestTesterConnector(test) {
  return {
    create: req => test(req),
    read: req => test(req),
    update: req => test(req),
    delete: req => test(req),
  };
}

describe('Correct path resolving', () => {
  it('resolves a non-patterned path `/simple/path`', () => {
    const mw = url('/simple/path');

    const tester = requestTesterConnector((req) => {
      expect(req.url).toBe('/simple/path');
    });

    mw(tester).create({});
    mw(tester).read({});
    mw(tester).update({});
    mw(tester).delete({});
  });

  it('resolves a patterned path `/:foo/:bar`', () => {
    const mw = url('/:foo/:bar');

    const tester = requestTesterConnector((req) => {
      expect(req.url).toBe('/hello/dolly');
    });

    // Test all crud methods
    mw(tester).create({ params: ['hello', 'dolly'] });
    mw(tester).read({ params: ['hello', 'dolly'] });
    mw(tester).update({ params: ['hello', 'dolly'] });
    mw(tester).delete({ params: ['hello', 'dolly'] });
  });

  it('preseves the query `/:foo/:bar?user=1`', () => {
    const mw = url('/:foo/:bar?user=1');

    const tester = requestTesterConnector((req) => {
      expect(req.url).toBe('/hello/dolly?user=1');
    });

    // Test all crud methods
    mw(tester).create({ params: ['hello', 'dolly'] });
    mw(tester).read({ params: ['hello', 'dolly'] });
    mw(tester).update({ params: ['hello', 'dolly'] });
    mw(tester).delete({ params: ['hello', 'dolly'] });
  });

  it('can handle a complete URI `http://localhost:3000/:foo/:bar?user=1`', () => {
    const mw = url('http://localhost:3000/:foo/:bar?user=1');

    const tester = requestTesterConnector((req) => {
      expect(req.url).toBe('http://localhost:3000/hello/dolly?user=1');
    });

    // Test all crud methods
    mw(tester).create({ params: ['hello', 'dolly'] });
    mw(tester).read({ params: ['hello', 'dolly'] });
    mw(tester).update({ params: ['hello', 'dolly'] });
    mw(tester).delete({ params: ['hello', 'dolly'] });
  });
});
