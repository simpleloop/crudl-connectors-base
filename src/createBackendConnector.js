import axios from 'axios'

/**
* This is a general backend connector that uses axios to execute API calls.
* It requires a request object with the following attributes:
*
* url:        a string value: required
* httpMethod: a string value. The http method to use (https://github.com/mzabriskie/axios); required
* data:       an object or an array; optional
* headers:    an object of the form { <HeaderName>: <Value> }; optional
*/
export default function createBackendConnector(axiosConfig = {}) {
    function axiosCall(req) {
        // URL is required
        if (typeof req.url !== 'string') {
            throw new Error(`The request URL must be a string. Found ${typeof req.url}`)
        }
        // http method is required
        if (typeof req.httpMethod !== 'string') {
            throw new Error(`The request httpMethod must be a string. Found ${typeof req.httpMethod}`)
        }

        let requestHeaders = req.headers
        if (axiosConfig.headers) {
            requestHeaders = Object.assign({}, req.headers, axiosConfig.headers)
        }

        return axios(Object.assign(axiosConfig, {
            url: req.url,
            method: req.httpMethod,
            headers: requestHeaders,
            data: req.data,
        }))
        .catch((error) => {
            throw error.response
        })
    }

    return {
        create: axiosCall,
        read: axiosCall,
        update: axiosCall,
        delete: axiosCall,
    }
}
