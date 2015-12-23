Methuss
=======

html meta tags(opengraph/twittercard) fetch/parse/cache server.

## Developer Install

##### Install Prerequisites

as you wish ;)

##### Install Methuss and its Dependencies

```
$ git clone git@github.com:iolo/methuss.git
$ cd methuss
$ npm install
```

##### Launch Methuss

run with npm:
```
$ npm start
```
or run with your favorite process manager such as nodemon or pm2 or forever or else:
```
$ nodemon index.js
```

##### Debug

To see verbose debug log:
```
$ export DEBUG='*'
```
before run.

## Production Install(Not Yet Recommended)

##### Install Methuss with Its Dependencies

```
$ npm install -g methuss
```

##### Launch Methuss

```
$ methuss-server
```

## Usage

get meta tags as json/html/xml and image with `Accept` header:
```
$ curl 'localhost:3000/metas?url=http://ppss.kr' -H 'Accept:application/json'
```
or format in url
```
$ curl 'localhost:3000/metas.json?url=http://ppss.kr'
```
or else...

---

may the *source* be with you...
