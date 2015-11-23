'use strict';
const debug = require('debug')('methuss:parse');
const DEBUG = !!debug.enabled;

const htmlparser = require('htmlparser2');

function parseMeta(html) {
    DEBUG && debug('parseMeta...');
    if (!html) {
        return Promise.reject(new Error('invalid html'));
    }
    return new Promise(function (resolve, reject) {
        const meta = {};
        const parser = new htmlparser.Parser({
            onopentag: function (name, attrs) {
                if (name === 'body' || name === 'BODY') {
                    debug('parse early stop');
                    return parser.parseComplete();
                }
                if ((name === 'meta' || name === 'META') && attrs.property && attrs.content) {
                    debug('parse meta', attrs);
                    meta[attrs.property.toLowerCase()] = attrs.content;
                }
            },
            onend: function () {
                resolve(meta);
            },
            onerror: function (err) {
                const e = new Error('parseMeta error');
                e.cause = err;
                reject(e);
            }
        }, {decodeEntities: false, lowerCaseTags: false, lowerCaseAttributeNames: false});
        parser.end(html);
    });
}

module.exports = {
    parseMeta: parseMeta
};
