/**
* Creates a transformData middleware
* @methodRegExp Which methods should be transformed e.g. 'create|update'
* @transform The transform function
*/
export default function transformData(methodRegExp, transform = data => data) {
    const re = new RegExp(methodRegExp || '.*')

    // The middleware function
    return function transformDataMiddleware(next) {
        // Checks if the call should be transformed. If yes, it applies the transform function
        function checkAndTransform(method) {
            return re.test(method)
            ? req => next[method](req).then(res => Object.assign(res, { data: transform(res.data) }))
            : req => next[method](req)
        }

        // The middleware connector:
        return {
            create: checkAndTransform('create'),
            read: checkAndTransform('read'),
            update: checkAndTransform('update'),
            delete: checkAndTransform('delete'),
        }
    }
}
