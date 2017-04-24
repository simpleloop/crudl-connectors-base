/* globals require, jest, expect, describe, it */
const consumeParams = require('../lib/consumeParams');

it('consumes params correctly', () => {
  const req = {
    params: [1, 2, 3, 4, 5],
  };

  expect(consumeParams(req, 2)).toEqual([4, 5]);
  expect(req.params).toEqual([1, 2, 3]);
});

it('consumes 0 params robustly', () => {
  const req = { params: [1, 2, 3] };
  expect(consumeParams({}, 0)).toEqual([]);
  expect(consumeParams(req, 0)).toEqual([]);
  expect(req.params).toEqual([1, 2, 3]);
});

it('throws errors correctly', () => {
  const req = {
    params: [1, 2, 3, 4, 5],
  };

  // Test undefined params
  expect(() => consumeParams({}, 2)).toThrow(/must be an arra/);
  // Test wrong type
  expect(() => consumeParams({ params: 'Not the right type' }, 2)).toThrow(/must be an array/);
  // Test not-enough params
  expect(() => consumeParams(req, 6)).toThrow(/Not enough params/);
});
