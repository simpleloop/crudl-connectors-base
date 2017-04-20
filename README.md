## Usage Example

```js
const { createDRFConnector, ValidationError } = require('crudl-connectors-drf');

const connector = createDRFConnector(`/api/:collection(/:id)`)
.use(transformErrors)

connector('blogs').read().then(result => console.log(result)); // [ { id: 1, ... }, { id: 2, ... }, ...]

connector('blogs', 1).read().then( entry => console.log(entry); ) // { id: 1, title: "How to write middleware", ... }

// Suppose handleSubmit is a redux-form onSubmit handler:
function handleSubmit(data) {
    return connector('blogs').create({ data })
    .catch(error => {
        if (error instanceof ValidationError) {
            throw new SubmissionError(error)
        }
    })
}
```

## Structure

A connector is an object that provides the crud methods (create, read, update, and delete) that accept requests and return promises, which in turn either resolve to responses or reject with an error. Because the crud methods return promises, they can be chained.

The simplest configuration of a connector is a backend-frontend pair. The backend connector translates the invoked methods and the passed requests into ajax calls. Using the frontend connector's `use` method, this basic pair can be extended with middleware.

Connectors can be parametrized.

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
