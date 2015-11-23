'use strict';
const debug = require('debug')('methuss:hash');
const DEBUG = !!debug.enabled;

const crypto = require('crypto');

// no need to secure! just a short unique key!
function hashUrl(url) {
    const hash = crypto.createHash('md5');
    return hash.update(url, 'utf8')
        .digest('base64')
        .replace(/\+/g, '-') // + --> -
        .replace(/\//g, '_') // / --> _
        .replace(/=+$/, '');
}

module.exports = {
    hashUrl: hashUrl
};
