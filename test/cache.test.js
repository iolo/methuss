'use strict';
const assert = require('assert');
const cache = require('../src/cache');
describe('cache', function () {
    it('loadMeta should return undefined for undefined', function () {
        return cache.loadMeta().then(function (meta) {
            assert(typeof meta === 'undefined');
        });
    });
    it('loadMeta should return undefined for foo', function () {
        return cache.loadMeta('foo').then(function (meta) {
            assert(typeof meta === 'undefined');
        });
    });
    it('loadMeta should return baz for bar', function () {
        return cache.saveMeta('bar', 'baz').then(function () {
            return cache.loadMeta('bar').then(function (meta) {
                assert(meta === 'baz');
            });
        });
    })
});
