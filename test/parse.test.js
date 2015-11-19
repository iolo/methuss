'use strict';
var assert = require('assert');
var parse = require('../src/parse');
describe('parse', function () {
    it('parseMeta should fail for undefined', function (done) {
        parse.parseMeta().then(assert.fail).catch(assert.ok).then(done);
    });
    it('loadMeta should return meta for html', function (done) {
        parse.parseMeta('<meta property="hello" content="world">').then(function (meta) {
            assert.equal('world', meta.hello);
        }).catch(assert.fail).then(done);
    })
});