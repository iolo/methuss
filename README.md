Methuss
=======

> ogcache server before

html meta tags(opengraph/twittercard) fetch/parse/cache server.

### DEBUG

```
DEBUG=* node index.js
```

or

```
DEBUG=* nodemon index.js
```

### USE

GET

> curl 'localhost:3000/?url=http://ppss.kr'

POST (x-www-form-urlencoded)

> curl 'localhost:3000' -d 'url=http://ppss.kr'

FOR JEDI
--------

may the *source* be with you...
