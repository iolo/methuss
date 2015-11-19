'use strict';

var debug = require('debug')('methuss');
var DEBUG = !!debug.enabled;

// opengraph
// see https://developers.facebook.com/docs/sharing/webmasters#markup
// og:url
// og:title
// og:description
// og:site_name
// og:image
// fb:app_id

// twittercard
// see https://dev.twitter.com/cards/markup
// twitter:card
// twitter:site
// twitter:site:id
// twitter:creator
// twitter:description
// twitter:title
// twitter:image
// twitter:player
// twitter:player:width
// twitter:player:height
// twitter:player:stream
// twitter:app:name:iphone
// twitter:app:id:iphone
// twitter:app:url:iphone
// twitter:app:name:ipad
// twitter:app:id:ipad
// twitter:app:url:ipad
// twitter:app:name:googleplay
// twitter:app:id:googleplay
// twitter:app:url:googleplay

var hashUrl = require('./src/hash').hashUrl;
var loadMeta = require('./src/cache').loadMeta;
var saveMeta = require('./src/cache').saveMeta;
var fetchUrl = require('./src/fetch').fetchUrl;
var parseMeta = require('./src/parse').parseMeta;

var express = require('express');
var app = express();

app.get('/', function (req, res, next) {
    var url = req.query.url;
    if (!url) {
        return res.status(400);
    }

    var key = hashUrl(url);
    DEBUG && debug(url, '-->', key);

    loadMeta(key).then(function (meta) {
        if (meta) {
            DEBUG && debug('*** cache hit! ***');
            return meta;
        }
        DEBUG && debug('*** cache miss! ***');
        return fetchUrl(url)
            .then(parseMeta)
            .then(function (meta) {
                return saveMeta(key, meta);
            });
    }).then(function (meta) {
        res.status(200).json(meta).end();
    }).catch(function (err) {
        res.status(500).json({error: err}).end();
    });
});

app.listen(3000);
