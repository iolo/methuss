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
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var hello = '<h1 id="methuss">Methuss</h1>' +
    '<blockquote>' +
    '<p>ogcache server before</p>' +
    '</blockquote>' +
    '<p>html meta tags(opengraph/twittercard) fetch/parse/cache server.</p>' +
    '<h3 id="debug">DEBUG</h3>' +
    '<pre class="editor-colors lang-text"><div class="line"><span class="text plain"><span class="meta paragraph text"><span>DEBUG=*&nbsp;node&nbsp;index.js</span></span></span></div></pre><p>or</p>' +
    '<pre class="editor-colors lang-text"><div class="line"><span class="text plain"><span class="meta paragraph text"><span>DEBUG=*&nbsp;nodemon&nbsp;index.js</span></span></span></div></pre><h3 id="use">USE</h3>' +
    '<p>GET</p>' +
    '<blockquote>' +
    '<p>curl &#39;localhost:3000/?url=http://ppss.kr&#39;</p>' +
    '</blockquote>' +
    '<p>POST (x-www-form-urlencoded)</p>' +
    '<blockquote>' +
    '<p>curl &#39;localhost:3000&#39; -d &#39url=http://ppss.kr&#39;</p>' +
    '</blockquote>' +
    '<h2 id="for-jedi">FOR JEDI</h2>' +
    '<p>may the <em>source</em> be with you...</p>';


app.all('*', function (req, res, next) {
    var url = req.query.url || req.body.url;

    if (!url) {
        return res.status(400).send(hello);
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
