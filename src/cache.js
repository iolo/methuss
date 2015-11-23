'use strict';
const debug = require('debug')('methuss:cache');
const DEBUG = !!debug.enabled;

const metaCache = require('lru-cache')({max: 100, maxAge: 1000 * 60 * 60});

function loadMeta(key) {
    DEBUG && debug('loadMeta...', key);
    return new Promise(function (resolve, reject) {
        return resolve(metaCache.get(key));
    });
}

function saveMeta(key, meta) {
    DEBUG && debug('saveMeta...', key);
    metaCache.set(key, meta);
    return Promise.resolve(meta);
}

module.exports = {
    loadMeta: loadMeta,
    saveMeta: saveMeta
};
