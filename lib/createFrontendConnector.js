'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = createFrontendConnector;
/* eslint-disable no-console */

function notImplemented(methodName) {
    return function () {
        return Promise.reject('The ' + methodName + ' method is not implemented.');
    };
}

function loggedMethod(c, mwName, methodName) {
    if (typeof c[methodName] === 'undefined') {
        return undefined;
    }

    return function (req) {
        console.log('Calling ' + mwName + '.' + methodName + ' with \n', JSON.stringify(req, null, 2));
        return c[methodName](req).then(function (res) {
            console.log('Returning from ' + mwName + '.' + methodName + ' with \n', JSON.stringify(res, null, 2));
            return res;
        }).catch(function (error) {
            console.log('Error in ' + mwName + '.' + methodName + ': \n', JSON.stringify(error, null, 2));
            throw error;
        });
    };
}

var defaultConnector = {
    create: notImplemented('create'),
    read: notImplemented('read'),
    update: notImplemented('update'),
    delete: notImplemented('delete')
};

function addLogs(mw) {
    var mwName = mw.name;

    return function (next) {
        var c = mw(next);
        return {
            create: loggedMethod(c, mwName, 'create'),
            read: loggedMethod(c, mwName, 'read'),
            update: loggedMethod(c, mwName, 'update'),
            delete: loggedMethod(c, mwName, 'delete')
        };
    };
}

function parametrize(connector) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    var addParams = function addParams(req) {
        if (!req.params) {
            req.params = [];
        }
        req.params = params.concat(req.params);
        return req;
    };

    return {
        create: function create(req) {
            return connector.create(addParams(req));
        },
        read: function read(req) {
            return connector.read(addParams(req));
        },
        update: function update(req) {
            return connector.update(addParams(req));
        },
        delete: function _delete(req) {
            return connector.delete(addParams(req));
        }
    };
}

// Completes the (potentially) partial connector such that
// any missing crud methods will be taken from the full connector
function completeConnector() {
    var partial = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var full = arguments[1];

    var checkAndAssign = function checkAndAssign(methodName) {
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

function createFrontendConnector() {
    var connector = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var debug = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (typeof connector.use !== 'undefined') {
        throw new Error('The provided connector ' + connector + ' is already a frontend connector. Only one frontend connector is allowed.');
    }
    var c = completeConnector(connector, defaultConnector);

    // Frontend connector is a function that returns a parametrized connector
    var fc = function fc() {
        for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
            params[_key] = arguments[_key];
        }

        return createFrontendConnector(parametrize(c, params), debug);
    };

    // The crud methods of a frontend connector return data instead of responses
    fc.create = function () {
        var req = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return c.create(req).then(function (res) {
            return res.data;
        });
    };
    fc.read = function () {
        var req = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return c.read(req).then(function (res) {
            return res.data;
        });
    };
    fc.update = function () {
        var req = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return c.update(req).then(function (res) {
            return res.data;
        });
    };
    fc.delete = function () {
        var req = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        return c.delete(req).then(function (res) {
            return res.data;
        });
    };

    // With the use() method a user can apply middleware to this connector.
    // A middleware is a function that takes the next connector and returns a new connector.
    // The new connector is allowed to implement only a subset of the crud methods. The
    // not implemented once will be automatically passed to the next connector
    if (debug) {
        fc.use = function (mw) {
            return createFrontendConnector(completeConnector(addLogs(mw)(c), c), debug);
        };
    } else {
        fc.use = function (mw) {
            return createFrontendConnector(completeConnector(mw(c), c), debug);
        };
    }

    return fc;
}