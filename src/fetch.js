'use strict';
const debug = require('debug')('methuss:fetch');
const DEBUG = !!debug.enabled;

const fetch = require('node-fetch');

function fetchUrl(url) {
    DEBUG && debug('fetchUrl...', url);
    if (!/^https?:\/\//.test(url)) {
        return Promise.reject(new TypeError('invalid url'));
    }
    return fetch(url).then(function (res) {
        DEBUG && debug('fetch', res.status, res.statusText);
        if (res.status >= 200 && res.status < 300) {
            return res.text();
        }
        const e = new Error('fetchUrl error');
        e.cause = res;
        throw e;
    });
}

module.exports = {
    fetchUrl: fetchUrl
};
