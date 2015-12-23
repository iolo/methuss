'use strict';
const debug = require('debug')('methuss:capture');
const DEBUG = !!debug.enabled;

const webshot = require('webshot');
const DEF_WEBSHOT_OPTS = {
    screenSize: {
        width: 320,
        height: 480
    }, shotSize: {
        width: 320,
        height: 'all'
    },
    userAgent: 'Mozilla/5.0 (iPhone; U; CPU iPhone OS 3_2 like Mac OS X; en-us) AppleWebKit/531.21.20 (KHTML, like Gecko) Mobile/7B298g'
};

function screenshotUrl(url, opts) {
    DEBUG && debug('screenshotUrl...', url);
    let webshotOpts = Object.assign({}, DEF_WEBSHOT_OPTS, {shotSize: opts});
    let outputFile = '/tmp/methuss/screenshot-' + Math.abs(Date.now()).toString(36) + Math.abs(Math.random()).toString(36) + '.png';
    return new Promise(function (resolve, reject) {
        webshot(url, outputFile, webshotOpts, function (err) {
            if (err) {
                return reject(err);
            }
            return resolve(outputFile);
        });
    });
}

module.exports = {
    screenshotUrl: screenshotUrl
};
