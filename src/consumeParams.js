
export default function consumeParams(req, nParams) {
  if (nParams === 0) {
    return [];
  }

  if (typeof req.params !== 'object' || typeof req.params.length !== 'number') {
    throw new Error(`Request params must be an array. Obtained ${typeof req.params}`);
  }

  if (req.params.length < nParams) {
    throw new Error(`Not enough params to consume. The request contains ${req.params.lenght} params, ${nParams} were requested.`);
  }

  return req.params.splice(req.params.length - nParams);
}
