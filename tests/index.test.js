/* globals require, jest, expect, describe, it */
import { createFrontendConnector, createBackendConnector, consumeParams } from '../src/index'

it('Module exports correctly', () => {
    expect(createFrontendConnector).toBeDefined()
    expect(createBackendConnector).toBeDefined()
    expect(consumeParams).toBeDefined()
});
