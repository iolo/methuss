'use strict';
var assert = require('assert');
var fetch = require('../src/fetch');
describe('fetch', function () {
    it('fetchUrl should fail for undefined', function (done) {
        fetch.fetchUrl().then(assert.fail).catch(assert.ok).then(done);
    });
    it('fetchUrl should fail for invalid url', function (done) {
        fetch.fetchUrl().then(assert.fail).catch(assert.ok).then(done);
    });
    it('fetchUrl should return html for url', function (done) {
        fetch.fetchUrl('http://httpbin.org/ip').then(assert.ok).catch(assert.fail).then(done);
    });
});