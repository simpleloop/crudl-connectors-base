/* globals require, jest, expect, describe, it */
const createFrontendConnector = require('../lib/createFrontendConnector');

// A simple jest connector
const jestConnector = {
  create: jest.fn(() => Promise.resolve({ data: 'create OK' })),
  read: jest.fn(() => Promise.resolve({ data: 'read OK' })),
  update: jest.fn(() => Promise.resolve({ data: 'update OK' })),
  delete: jest.fn(() => Promise.resolve({ data: 'delete OK' })),
};

// This function create a middleware function
const createMiddleware = (id => jest.fn(
  next => ({
    create: jest.fn(req => next.create(req).then(
      res => Promise.resolve({ data: `mw${id}(${res.data})` }),
    )),
    read: jest.fn(req => next.read(req).then(
      res => Promise.resolve({ data: `mw${id}(${res.data})` }),
    )),
    update: jest.fn(req => next.update(req).then(
      res => Promise.resolve({ data: `mw${id}(${res.data})` }),
    )),
    delete: jest.fn(req => next.delete(req).then(
      res => Promise.resolve({ data: `mw${id}(${res.data})` }),
    )),
  }),
));

describe('Interface', () => {
  it('creates correct interface', () => {
    const c = createFrontendConnector();
    expect(c).toHaveProperty('create');
    expect(c).toHaveProperty('read');
    expect(c).toHaveProperty('update');
    expect(c).toHaveProperty('delete');
    expect(c).toHaveProperty('use');

    expect(c.create).toBeInstanceOf(Function);
    expect(c.read).toBeInstanceOf(Function);
    expect(c.update).toBeInstanceOf(Function);
    expect(c.delete).toBeInstanceOf(Function);
    expect(c.use).toBeInstanceOf(Function);
  });

  it('creates non-implemented crud methods', () => {
    const c = createFrontendConnector();
    expect(c.create).toThrow(/not implemented/);
    expect(c.read).toThrow(/not implemented/);
    expect(c.update).toThrow(/not implemented/);
    expect(c.delete).toThrow(/not implemented/);
  });
});

describe('Chaining', () => {
  it('passes request correctly', () => {
    const c = createFrontendConnector(jestConnector);
    const resolve = jest.fn();
    const req = {};

    const p1 = c.create(req).then(resolve).then(() => {
      expect(jestConnector.create).toHaveBeenCalledWith(req);
    });

    const p2 = c.read(req).then(resolve).then(() => {
      expect(jestConnector.read).toHaveBeenCalledWith(req);
    });

    const p3 = c.update(req).then(resolve).then(() => {
      expect(jestConnector.update).toHaveBeenCalledWith(req);
    });

    const p4 = c.delete(req).then(resolve).then(() => {
      expect(jestConnector.delete).toHaveBeenCalledWith(req);
    });

    return Promise.all([p1, p2, p3, p4]);
  });

  it('returns reponse data', () => {
    const c = createFrontendConnector(jestConnector);
    const resolve = jest.fn();

    const p1 = c.create().then(resolve).then(() => {
      expect(resolve).toHaveBeenCalledWith('create OK');
    });

    const p2 = c.read().then(resolve).then(() => {
      expect(resolve).toHaveBeenCalledWith('read OK');
    });

    const p3 = c.update().then(resolve).then(() => {
      expect(resolve).toHaveBeenCalledWith('update OK');
    });

    const p4 = c.delete().then(resolve).then(() => {
      expect(resolve).toHaveBeenCalledWith('delete OK');
    });

    return Promise.all([p1, p2, p3, p4]);
  });
});

describe('Middleware', () => {
  it('includes middleware correctly', () => {
    const c = createFrontendConnector(jestConnector).use(createMiddleware('1'));
    const resolve = jest.fn();

    const p1 = c.create().then(resolve).then(() => {
      expect(resolve).toHaveBeenCalledWith('mw1(create OK)');
    });

    const p2 = c.read().then(resolve).then(() => {
      expect(resolve).toHaveBeenCalledWith('mw1(read OK)');
    });

    const p3 = c.update().then(resolve).then(() => {
      expect(resolve).toHaveBeenCalledWith('mw1(update OK)');
    });

    const p4 = c.delete().then(resolve).then(() => {
      expect(resolve).toHaveBeenCalledWith('mw1(delete OK)');
    });

    return Promise.all([p1, p2, p3, p4]);
  });

  it('orders middleware correctly', () => {
    const c = createFrontendConnector(jestConnector)
    .use(createMiddleware('1'))
    .use(createMiddleware('2'));

    const resolve = jest.fn();

    const p1 = c.create().then(resolve).then(() => {
      expect(resolve).toHaveBeenCalledWith('mw2(mw1(create OK))');
    });

    const p2 = c.read().then(resolve).then(() => {
      expect(resolve).toHaveBeenCalledWith('mw2(mw1(read OK))');
    });

    const p3 = c.update().then(resolve).then(() => {
      expect(resolve).toHaveBeenCalledWith('mw2(mw1(update OK))');
    });

    const p4 = c.delete().then(resolve).then(() => {
      expect(resolve).toHaveBeenCalledWith('mw2(mw1(delete OK))');
    });

    return Promise.all([p1, p2, p3, p4]);
  });
});

describe('Parameters', () => {
  it('parametrizes request correctly', () => {
    // Create a connector that checks the request parameters
    const c = createFrontendConnector({
      create: (req) => {
        expect(req.params).toEqual([1, 2, 3]);
        return Promise.resolve({});
      },
      read: (req) => {
        expect(req.params).toEqual([1, 2, 3]);
        return Promise.resolve({});
      },
      update: (req) => {
        expect(req.params).toEqual([1, 2, 3]);
        return Promise.resolve({});
      },
      delete: (req) => {
        expect(req.params).toEqual([1, 2, 3]);
        return Promise.resolve({});
      },
    });

    const p1 = c(1, 2, 3).create({});
    const p2 = c(1, 2, 3).read({});
    const p3 = c(1, 2, 3).update({});
    const p4 = c(1, 2, 3).delete({});

    return Promise.all([p1, p2, p3, p4]);
  });
});
