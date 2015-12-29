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
                    DEBUG && debug('parse early stop');
                    return parser.parseComplete();
                }
                if (name === 'meta' || name === 'META') {
                    // facebook opengraph uses "property" attr
                    // but twitter card and others use "name" attr
                    var propertyName = attrs.property || attrs.name;
                    var propertyValue = attrs.content;
                    if (propertyName && propertyValue) {
                        DEBUG && debug('parse meta', attrs);
                        meta[propertyName.toLowerCase()] = propertyValue;
                    }
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
