A connector layer to access any API uniformly using CRUD methods.

## Structure

A connector is an object that provides crud methods (create, read, update, and delete). These methods accept requests and return promises, which in turn either resolve to responses or reject with an error. Because the crud methods return promises, they can be chained.

The simplest configuration of a connector is a backend-frontend pair. The backend connector translates the invoked methods and the passed requests into ajax calls. Using the frontend connector's `use` method, this basic pair can be extended with middleware.

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
```

You can bind connectors to specific endpoints using the `url` middleware. This middleware resolves the url pattern against the parameters passed to the connector.

```js
let user = c.use(url('/users/:id'));
let blogEntry = c.use(url('/blogs/:blogId'));

user(1).read() // { id: 1, firstName: 'Jane', lastName: 'Doe' }
blogEntry(12).read() // { id: 12, userId: 1, title: 'How to write middleware' }
```

Partial parametrization is also possible:

```js
let detail = c.use(url('/:collection/:id'));
let user = detail('users') // The :collection is fixed to 'users' but :id is still open
let blogEntry = detail('blogs') // The :collection is fixed to 'blogs' but :id is still open

user(1).read()
blogEntry(12).delete()
```

## Requests and Responses

The connectors achieve their task by transferring requests and responses between each other and amending them. The format of the request and response object is insofar open as connectors require only the `data` attribute to be present. Backend connectors may require more than that, and it's up to the application and the applied middleware to provide that.

The frontend connector's crud methods do not resolve to 'responses', instead they resolve to the response **data**. This is an important feature that makes the usage of connectors especially easy and intuitive. It keeps the response format transparent to the layers above connectors.


## Middleware

You can extend the functionality of a connector with middleware:

```js
const published = createFrontendConnector(createBackendConnector())
  .use(url('localhost:3000/api/articles/'))
  .use(transformData('read', data => data.filter(item => item.published)))

published.read().then((publishedArticles) => {
  // ...
});
```

Middleware is a function that takes the next connector as its argument and returns a new connector. Consider the following middleware for transforming the response data:

```js
function transformData(methodRegExp, transform = data => data) {
  const re = new RegExp(methodRegExp || '.*');

  // The middleware function
  return function transformDataMiddleware(next) {
    // Checks if the call should be transformed. If yes, it applies the transform function
    function checkAndTransform(method) {
      return re.test(method)
        ? req => next[method](req).then(res => Object.assign(res, { data: transform(res.data) }))
        : req => next[method](req);
    }

    // The middleware connector:
    return {
      create: checkAndTransform('create'),
      read: checkAndTransform('read'),
      update: checkAndTransform('update'),
      delete: checkAndTransform('delete'),
    };
  };
}
```

Note that the middleware connectors do not need to implement all crud methods. If a middleware connector does not provide one of the crud methods, all pertinent requests will be automatically passed to the next connector in the chain.

The order of middleware matters. The last registered middleware is invoked first when making a request and last when processing a response. For example `c.use(mw1).use(mw2)` will result in the following chain/stack:
```
request   data     errors
  ↓         ↑         ↑
+-----------------------+
|  FRONTEND CONNECTOR   |
+-----------------------+
  ↓         ↑         ↑         
request  response  errors
  ↓         ↑         ↑
+-----------------------+
|          MW2          |
+-----------------------+
  ↓         ↑         ↑         
request  response  errors
  ↓         ↑         ↑
+-----------------------+
|          MW1          |
+-----------------------+
  ↓         ↑         ↑         
request  response  errors
  ↓         ↑         ↑
+-----------------------+
|   BACKEND CONNECTOR   |
+-----------------------+
            ↕                  
         ~~~~~~~           
           API              
         ~~~~~~~             
```
