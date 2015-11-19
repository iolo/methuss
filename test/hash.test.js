'use strict';
var assert = require('assert');
var hash = require('../src/hash');
describe('hash', function () {
    it('hashUrl should fail for undefined', function () {
        assert.throws(hash.hashUrl);
    });
    it('hashUrl should return url-safe-base62 for "show me the code"', function () {
        assert.equal('9Pevp04ekjRn6L1Y9D6rMA', hash.hashUrl('show me the code'));
    });
});