'use strict';

const debug = require('debug')('methuss');
const DEBUG = !!debug.enabled;

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

const hashUrl = require('./src/hash').hashUrl;
const loadMeta = require('./src/cache').loadMeta;
const saveMeta = require('./src/cache').saveMeta;
const fetchUrl = require('./src/fetch').fetchUrl;
const parseMeta = require('./src/parse').parseMeta;

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.use(function (req, res, next) {
    var url = req.query.url || req.body.url;
    if (!url) {
        return next();
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
        meta.url = url;
        meta.key = key;
        res.locals.meta = meta;
        next();
    }).catch(next);
});

app.all('/metas.:format?', function (req, res) {
    var meta = res.locals.meta || {};
    // content negotiation by format and accept header.
    var format = req.params.format || req.accepts(['json', 'html', 'xml']);
    DEBUG && debug('format:', format);
    res.status(200);
    switch(format) {
        case 'json':
            res.json(meta);
            break;
        case 'html':
        case 'xml':
            var title = meta['og:title'] || meta['twitter:title'];
            res.type(format).render(format, {title: title, meta: meta});
            break;
        case 'png':
        case 'image/png':
            var image = meta['og:image'] || meta['twitter:image'];
            if (!image) {
                // TODO: capture screenshot using phantomjs or else...
            }
            DEBUG && debug('redirect to:', format);
            res.redirect(image);
            break;
        default: 
            res.type('text').send(JSON.stringify(meta));
            break;
    }
});

app.get('/', function (req, res) {
    return res.render('index', {port: app.get('port')});
});

app.listen(app.get('port'), function () {
    DEBUG && debug('methuss is listening on ', app.get('port'));
});
