'use strict';
const assert = require('assert');
const parse = require('../src/parse');
describe('parse', function () {
    it('parseMeta should fail for undefined', function () {
        return parse.parseMeta().then(assert.fail).catch(assert.ok);
    });
    it('loadMeta should return meta for html', function () {
        return parse.parseMeta('<meta property="hello" content="world">').then(function (meta) {
            assert.equal('world', meta.hello);
        });
    })
});
