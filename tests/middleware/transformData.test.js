/* globals require, jest, expect, describe, it */
import transformData from '../../src/middleware/transformData'

const response = {
    status: 200,
    data: [1, 2, 3],
};

const testConnector = {
    create: () => Promise.resolve(Object.assign({}, response)),
    read: () => Promise.resolve(Object.assign({}, response)),
    update: () => Promise.resolve(Object.assign({}, response)),
    delete: () => Promise.resolve(Object.assign({}, response)),
};

it('transforms create only', () => {
    // Reverse the order of data
    const mw = transformData('create', data => data.slice().reverse());
    // Test the methods
    const p1 = mw(testConnector).create().then((res) => {
        expect(res.data).toEqual([3, 2, 1]);
    });
    const p2 = mw(testConnector).read().then((res) => {
        expect(res.data).toEqual([1, 2, 3]);
    });
    const p3 = mw(testConnector).update().then((res) => {
        expect(res.data).toEqual([1, 2, 3]);
    });
    const p4 = mw(testConnector).delete().then((res) => {
        expect(res.data).toEqual([1, 2, 3]);
    });
    return Promise.all([p1, p2, p3, p4]);
});

it('transforms create and read', () => {
    // Reverse the order of data
    const mw = transformData('create|read', data => data.slice().reverse());
    // Test the methods
    const p1 = mw(testConnector).create().then((res) => {
        expect(res.data).toEqual([3, 2, 1]);
    });
    const p2 = mw(testConnector).read().then((res) => {
        expect(res.data).toEqual([3, 2, 1]);
    });
    const p3 = mw(testConnector).update().then((res) => {
        expect(res.data).toEqual([1, 2, 3]);
    });
    const p4 = mw(testConnector).delete().then((res) => {
        expect(res.data).toEqual([1, 2, 3]);
    });
    return Promise.all([p1, p2, p3, p4]);
});

it('transforms create, read, and update', () => {
    // Reverse the order of data
    const mw = transformData('create|read|update', data => data.slice().reverse());
    // Test the methods
    const p1 = mw(testConnector).create().then((res) => {
        expect(res.data).toEqual([3, 2, 1]);
    });
    const p2 = mw(testConnector).read().then((res) => {
        expect(res.data).toEqual([3, 2, 1]);
    });
    const p3 = mw(testConnector).update().then((res) => {
        expect(res.data).toEqual([3, 2, 1]);
    });
    const p4 = mw(testConnector).delete().then((res) => {
        expect(res.data).toEqual([1, 2, 3]);
    });
    return Promise.all([p1, p2, p3, p4]);
});

it('transforms all', () => {
    // Reverse the order of data
    const mw = transformData(null, data => data.slice().reverse());
    // Test the methods
    const p1 = mw(testConnector).create().then((res) => {
        expect(res.data).toEqual([3, 2, 1]);
    });
    const p2 = mw(testConnector).read().then((res) => {
        expect(res.data).toEqual([3, 2, 1]);
    });
    const p3 = mw(testConnector).update().then((res) => {
        expect(res.data).toEqual([3, 2, 1]);
    });
    const p4 = mw(testConnector).delete().then((res) => {
        expect(res.data).toEqual([3, 2, 1]);
    });
    return Promise.all([p1, p2, p3, p4]);
});
