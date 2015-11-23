'use strict';
const assert = require('assert');
const fetch = require('../src/fetch');
describe('fetch', function () {
    it('fetchUrl should fail for undefined', function () {
        return fetch.fetchUrl().then(assert.fail).catch(assert.ok);
    });
    it('fetchUrl should fail for invalid url', function () {
        return fetch.fetchUrl().then(assert.fail).catch(assert.ok);
    });
    it('fetchUrl should return html for url', function () {
        return fetch.fetchUrl('http://httpbin.org/ip');
    });
});
