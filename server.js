'use strict';

const debug = require('debug')('methuss');
const DEBUG = !!debug.enabled;

const fs = require('fs');
const path = require('path');

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
const screenshotUrl = require('./src/screenshot').screenshotUrl;

const express = require('express');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const app = express();

app.set('port', process.env.PORT || 3000);
app.set('view engine', 'jade');
app.use(morgan('combined'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.all('/metas.:format?', function (req, res, next) {
    let url = req.query.url || req.body.url;

    if (!/^https?:\/\//.test(url)) {
        return next(new TypeError('invalid url'));
    }

    let key = hashUrl(url);
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
                // add methuss custom meta...
                meta.url = url;
                meta.key = key;
                meta.title = meta.title || meta['og:title'] || meta['twitter:title'];
                meta.image = meta.image || meta['og:image'] || meta['twitter:image'];
                meta.description = meta.description || meta['og:description'] || meta['twitter:description'];
                return saveMeta(key, meta);
            });
    }).then(function (meta) {
        // content negotiation by format and accept header.
        let format = req.params.format || req.accepts(['json', 'html', 'xml']);
        DEBUG && debug('format:', format);
        res.status(200);
        switch (format) {
        case 'json':
            res.json(meta);
            break;
        case 'html':
        case 'xml':
            let embed = req.query.embed || req.body.embed;
            let view = embed ? 'embed' : format;
            res.type(format).render(view, {meta: meta});
            break;
        case 'png':
        case 'image/png':
            let screenshot = req.query.screenshot || req.body.screenshot;
            if (screenshot || !meta.image) {
                let width = req.query.width || req.body.height || 0;
                let height = req.query.height || req.body.height || 0;
                let file = '/tmp/methuss/screenshot-' + key + '-' + width + 'x' + height + '.png';
                fs.exists(file, function (exists) {
                    if (exists && screenshot !== 'always') {
                        DEBUG && debug('send existing screenshot:', file);
                        return res.sendfile(file);
                    }
                    screenshotUrl(url, {width: width, height: height}).then(function (outputFile) {
                        fs.unlink(file, function (err) {
                            if (err) {
                                DEBUG && debug('failed to delete existing screenshot:', file);
                                //throw err;
                            }
                            fs.rename(outputFile, file, function (err) {
                                if (err) {
                                    throw err;
                                }
                                DEBUG && debug('send new screenshot:', file);
                                return res.sendfile(file);
                            });
                        });
                    }).catch(function (err) {
                        throw err;
                    });
                });
            } else {
                DEBUG && debug('redirect to:', format);
                res.redirect(meta.image);
            }
            break;
        default:
            res.type('text').send(JSON.stringify(meta));
            break;
        }
    }).catch(next);
});

app.get('/', function (req, res) {
        console.log(req.headers);
    return res.render('index', {baseUrl:req.protocol + '://' + req.get('host')});
});

app.listen(app.get('port'), function () {
    DEBUG && debug('methuss is listening on ', app.get('port'));
});
