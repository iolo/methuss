'use strict';
var assert = require('assert');
var cache = require('../src/cache');
describe('cache', function () {
    it('loadMeta should return undefined for undefined', function (done) {
        cache.loadMeta().then(function (meta) {
            assert(typeof meta === 'undefined');
        }).catch(assert.fail).then(done);
    });
    it('loadMeta should return undefined for foo', function (done) {
        cache.loadMeta('foo').then(function (meta) {
            assert(typeof meta === 'undefined');
        }).catch(assert.fail).then(done);
    });
    it('loadMeta should return baz for bar', function (done) {
        cache.saveMeta('bar', 'baz');
        setTimeout(function () {
            cache.loadMeta('bar').then(function (meta) {
                assert(meta === 'baz');
            }).catch(assert.fail).then(done);
        }, 10);
    })
});