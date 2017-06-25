/* globals require, jest, expect, describe, it */
import { crudToHttp, transformData, url } from '../../src/middleware/index'

it('Module exports correctly', () => {
    expect(crudToHttp).toBeDefined()
    expect(transformData).toBeDefined()
    expect(url).toBeDefined()
});
