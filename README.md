## Structure

A connector is an object that provides the crud methods (create, read, update, and delete) that accept requests and return promises, which in turn either resolve to responses or reject with an error. Because the crud methods return promises, they can be chained.

The simplest configuration of a connector is a backend-frontend pair. The backend connector translates the invoked methods and the passed requests into ajax calls. Using the frontend connector's `use` method, this basic pair can be extended with middleware.

Connectors can be parametrized.

## Usage Examples

Using just the basic frontend-backend pair you can swiftly create a functioning connector:

```js
const { createFrontendConnector, createBackendConnector } = require('crudl-connectors-base');

let c = createFrontendConnector(createBackendConnector({ baseURL: 'localhost:3000/api/v1/' }));
c.create({ url: '/users/', httpMethod: 'post', data: { firstName: 'Jane' }});
```

By using middleware, you can customize your connectors and make them less verbose. For example the `crudToHttp` middleware maps the crud functions to the http methods, so that 'create' will result to 'post', 'read' to 'get', etc.

```js
const mapping = { create: 'post', read: 'get', update: 'patch', delete: 'delete' };
c = c.use(crudToHttp(mapping));
c.update({ url: '/users/1', data: { lastName: 'Doe' } });
c.read({ url: '/users/1/' }) // { id: 1, firstName: 'Jane', lastName: 'Doe' }
}
```

You can bind connectors to specific endpoints using the `patternedURL` middleware. This middleware resolves the url pattern against the parameters passed to the connector.

```js
let user = c.use(patternedURL('/users/:id'));
let blogEntry = c.use(patternedURL('/blogs/:blogId'));

user(1).read() // { id: 1, firstName: 'Jane', lastName: 'Doe' }
blogEntry(12).read() // { id: 12, userId: 1, title: 'How to write middleware' }
```

## Requests and Responses

The connectors achieve their task by transferring requests and responses between each other and amending them. The format of the request and response object is insofar open as connectors require only the `data` attribute to be present. Backend connectors may require more than that, and it's up to the application and the applied middleware to provide that.

## Middleware

The functionality of a connector can be extended using middleware:

```js
const c = createRESTConnector()
.use(transformErrors)
.use(transformData)
.use(pagination)
```

Middleware is a function that takes the next connector as its argument and returns a new connector. Consider the following middleware for consolidating resource IDs to be called 'id':

```js
// idName is the backend specific name of the id field
function consolidateIDs(idName) {
    return (next) => {
        // Returns a request or response with a renamed key in the data
        const rename: (reqOrRes, from, to) => { ... }

        return {
            create: req => next
                .create(rename(req, 'id', idName))
                .then(res => rename(res, idName, 'id')),

            update: req => next
                .update(rename(req, 'id', idName))
                .then(res => rename(res, idName, 'id')),

            // Read requires renaming only of the response
            read: req => next
                .read(req)
                .then(res => rename(res, idName, 'id')),

            // delete does not require any renaming
        }
    }
}

// And it can be used like this:
const c = createRESTConnector().use(consolidateIDs('_id'))
```
