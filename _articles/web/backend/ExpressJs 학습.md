---
title: ExpressJs 학습
date: 2022-03-16 17:21:08 +0900
tags: expressjs js BE
layout: obsidian
is_Finished: false
last_Reviewed: 2022-10-30 17:21:08 +0900
use_Mathjax: false
---
```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

![image-20220113230512386](image-20220113230512386.png)

# Express.js

---

> Fast, unopinionated, minimalist web framework for [Node.js](https://nodejs.org/en/)

[Node.js](https://nodejs.org/en/) 기반의 심플한 웹 프레임워크, 주로 벡엔드 서버를 만드는데 사용한다.

정말 기본적인 서버이고, [MIT 라이센스](https://opensource.org/licenses/MIT)이므로, 좋게 말하면 가볍고 여러 기능을 제약없이 구현하기 쉬우며, 나쁘게 말하면 많은 부분을 직접 구현해야 한다.

더욱 자세한 사항은 [Express.js 공식 문서](https://expressjs.com/) 참조 바람.

## 개발 환경 및 기본 구동 설정 (Configure Dev settings.)

---

### 설치(Install)

---

기본적으로 최신 버전의 Node.js가 설치가 끝난 상태여야 한다.

```bash
$ mkdir myapp # 프로젝트 폴더 생성
$ cd myapp # 프로젝트 폴더 이동
$ npm init # 기본적인 프로젝트 설정, package.json 생성
$ npm install express --save # node_modules에 express 설치 및 dependency 설정
```

```ad-note
이 글에서는 `package.json` 생성 설정의 기본값을 전제로 한다. 추가적인 설정에 따라 일부 용어가 바뀔 수 있다. 예를 들면,
- `main` 항목을 `index.js` 대신 `app.js`로 사용할 경우, `app.js`로 생성해야 한다.
- Javascript 대신 Typescript를 사용할 수도 있다.
- 자세한 사항은 [Node.js](https://nodejs.org/en/)참조
```

### 기본 세팅(Default setting)

이후, `index.js` 파일을 형성하여 아래와 같이 

```javascript
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
```

이후 `node index.js` 를 콘솔에 입력하면 아래와 같은 메시지가 표시된다.

```bash
$ node index.js
Example app listening at http://localhost:3000
```

`http://localhost:3000` 주소를 입력하여 들어가보면 아래와 같은 창이 표기된다.

![Figure 1. 예시 뷰](image-20220115082101591.png)

추가적으로 Nodemon이나 Typescript 설정을 해주는 것도 나쁘지 않다.

## 기능

### 라우팅(routing) 설정

---

#### 라우팅 기본(Basic Routing)

Express.js는 다음과 같은 구조로 라우팅한다.

```javascript
app.METHOD(PATH, HANDLER)
```

- `app`은 express의 인스턴스이다.

- `METHOD`는 get, post 등의 원하는 HTTP 요청 메소드이다.

- `PATH`는 라우팅할 경로이다.

- `HANDLER`는 해당 주소로 라우팅됬을 때 실행되는 함수이다. 

이러한 라우팅 설정을 `app.listen(path, [callback])` 함수가 실행되기 전에 끝마치면 된다.

```javascript
app.post('/', function (req, res) {
  res.send('Got a POST request')
}) // post 요청
app.listen(port, () => { // backend 실행
  console.log(`Example app listening at http://localhost:${port}`)
})
```

#### 라우팅 인자 (Route parameters)

다음과 같이 `:`를 이용해 url 인자를 얻어낼 수 있다.

```javascript
app.get('/users/:userId/books/:bookId', function (req, res) { // ex) http://localhst:3000//users/42/books/21
  res.send(req.params) //":userId"(="42") 부분과 ":bookId"(="21") 부분에 존재하는 값들이 string 타입으로 표시.
})
```


```ad-note
이때 인자의 이름으로 숫자와 영어 대소문자만 가능하다. 

즉, 특수문자가 들어가면 특수문자 이전까지만 인자의 이름으로 인정된다.

~~~javascript
app.get('/flights/:to-:from', function (req, res) { // ex) http://localhst:3000/flights/LAX-SFO
res.send(req.params) //":to-:from" 전체를 변수명으로 인식하는 것이 아닌 :to"(="LAX") 부분과 ":from"(="SFO") 부분에 존재하는 값들이 string 타입으로 표시.
}) 
~~~
```

#### 라우팅 Extras (Routing extras)

##### 라우팅 정규 표현식(Routing Regular Expression)

라우팅에 [정규 표현식](https://regexr.com/)이나 문자열 패턴을 이용할 수 있다.

문자열 `?`,`+`,`*`, `()`,`$`은 문자열 패턴으로 이용되며, 특히 `$`을 이용하고 싶으면 `[\$]`로 대신 입력해야한다.

`?`은 바로 앞 문자 하나를 optional하게 만든다.

```javascript
app.get('/ab?cd', function (req, res) {// acd, abcd로 연결
  res.send('ab?cd')  
})
```

`+`는 바로 앞 문자 하나를 반복 가능하게 만든다.

```javascript
app.get('/ab+cd', function (req, res) {// abcd, abbcd, abb..bcd 로 연결
  res.send('ab+cd')
})
```

`*`은 모든 길이의 모든 문자열이 들어갈 수 있음을 의미한다.

```javascript
app.get('/ab*cd', function (req, res) {// ab와 cd 사이에 무슨 문자가 들어가든 연결(ex) ab/이것도연결가능/cd)
  res.send('ab*cd')
})
```

`()`은 앞의 문자열 패턴들과 함께 사용되며, 대상을 문자 하나 대신, `()` 사이에 존재하는 문자열을 대상으로 한다.

```javascript
app.get('/ab(cd)?e', function (req, res) {//abcde, abe로 연결
  res.send('ab(cd)?e')
})
```

평범한 정규 표현식 또한 사용 가능하다.

```javascript
app.get(/.*fly$/, function (req, res) {//fly로 끝나는 주소로 연결
  res.send('/.*fly$/')
})
```

##### route 함수(route function)

만약에 동일한 주소로 여러 메소드에 따라 동작을 달리하면서, 함수 체이닝을 통해 코드의 중복을 줄이고 싶다면, `route(path)` 함수나 `all(path, callback, [,callback ...])`을 이용하면 된다.

```javascript
app.route('/book')
  .get(function (req, res) { // get 요청 시의 동작
    res.send('Get a random book')
  })
  .post(function (req, res) { // post 요청 시의 동작
    res.send('Add a book')
  })
  .put(function (req, res) { // put 요청 시의 동작
    res.send('Update the book')
  })

app.all('/user', function(req, res, next){
    res.send('Accessing the user section')
    next()
})
```

##### Router 클래스(Router Class)

 `express.Router` 클래스는 라우팅에 활용할 수 있는 미들웨어이다. 추가적인 미들웨어 함수를 적용하여 사용하거나, 라우터를 모듈화, 파일 구조 라우팅 등을 하는데 사용한다.

🔵 파일 구조 라우팅(File-system Routing) : Next.js의 기능처럼 폴더와 파일경로를 url 주소로 이용하여 라우팅 하는 방법.

```javascript
var express = require('express')
var router = express.Router()

// 라우터가 사용할 미들웨어 함수 정의, 현재 이 라우터 인스턴스로 전달되는 요청마다 실행됨
router.use(function timeLog (req, res, next) {
  console.log('Time: ', Date.now()) // 현재 시간 출력
  next() //next 함수 : 다음 미들웨어 기능(=여기선 라우팅)을 불러옮.
})
// 홈페이지 경로 설정
router.get('/', function (req, res) {
  res.send('Birds home page')
})
// /about 경로 설정
router.get('/about', function (req, res) {
  res.send('About birds')
})

module.exports = router
```

이후, 해당 라우팅 클래스를 미들웨어로 부른 뒤, 경로를 설정해주면, 함수가 적용된 파일 구조 라우팅이 가능하다.

```javascript
var birds = require('./birds')

app.use('/birds', birds)
// "birds/" 경로와 "birds/about/"경로가 이용 가능해짐. 
```

`router.all(path, callback, [,callback ...])` 함수와 콜백 함수들을 이용하면 전역 인증 등을 구현 가능하다, 모듈화가 가능하다는 점을 제외하곤, `app.all(path, callback, [,callback ...])`과 다른점 없어보인다.

```javascript
router.all('*', requireAuthentication, loadUser) // '*'를 이용한 라우터를 모든 라우터보다 먼저 정의하면 모든 url에 적용되게 할 수 있다.
// requireAuthentication : 인증에 관련된 함수
// loadUser : 유저 정보를 가져오는 함수
```

`router.all(path, callback, [,callback ...])`을 포함해 `router.METHOD(path, [callback, ...] callback)` 함수들은 첫번째 인자로 url, 두번째부터는 차례대로 `next()`를 부를 때마다 실행되는 콜백 함수를 인자로 받는다.

```javascript
// 위의 예시 코드와 동일한 동작을 하는 코드
router.all('*', requireAuthentication)
router.all('*', loadUser)
```

##### 응답 방법(Response methods)

클라이언트에게 응답을 보낼 때 사용할 수 있는 함수, 이 함수를 부름으로써, 클라이언트는 대기 상태를 끝내고 요청-응답 사이클이 종료된다.

- `res.send([body])` : HTTP 응답을 보냄. 주로 비스트림 응답에 사용됨

```javascript
app.get('/', (req, res) => {
  res.send('Hello World!') // Hello World! 라는 응답을 되돌림
})
app.get('/json', (req, res) => {
  res.send({messange: "ok"})// Json 형식으로 응답을 되돌림
})
app.get('/octet', (req, res)=>{
    res.set('Content-Type', 'text/html')// Content-Type을 text 형태로 강제
    res.status(500).send('unavailable') // 500 코드와 함께 응답
})
```

만약, 응답이 `JSON` 형식에 맞지 않아 굳이 `res.set(field[, value])`형식을 바꿔줘야 한다면, 차라리 `res.json()`를 이용하여 코드의 길이를 줄이자.

```javascript
app.get('/', (req, res) => {
  res.json('Hello World!') // string임에도 Content-Type은 application/json;
})
```

---

- `res.append(field[, value])`: HTTP 응답 헤더의 필드와 값을 추가, `res.set(field[, value])==res.header(field[, value])`을 이용하면 `obeject`를 주어 여러 값을 동시에 변경이 가능하다.

```javascript
res.append('Link', ['<http://localhost/>', '<http://localhost:3000/>'])
res.append('Set-Cookie', 'foo=bar; Path=/; HttpOnly')
```

`res.attachment([filename])`을 통하여 `Content-Disposition` 헤더를 설정해줄 수 있다.

```javascript
res.attachment('path/to/logo.png')
// Content-Disposition: attachment; filename="logo.png"
// Content-Type: image/png
```

좀 더 쿠키를 세분화하여 정해주려면 `res.cookie(name, value [, options])` 함수를 사용할 수 있고, `res.clearCookie(name, value [, options])`함수로 지워줄 수 있다.

```javascript
res
  .status(201)
  .cookie('access_token', 'Bearer ' + token, {
    expires: new Date(Date.now() + 8 * 3600000) // cookie will be removed after 8 hours
  })
  .cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true })
  .redirect(301, '/admin')
```

---

- `res.redirect([status,] path)` : 다른 URL로 리다이렉트 해준다. 기본 status 코드는 `302 Found`이다.

```javascript
res.redirect(301, 'http://example.com')
res.redirect('../login')
res.redirect('back')//이전 referer로 돌림
```

---

- `res.render(view [, locals] [, callback])` : HTML view를 보낸다. 
  - `view`: html 파일이 존재하는 파일 경로
  - `locals`: view에서 이용할 로컬 변수들의 `object` 형태 
  - `callback`:  에러와 html 파일의 문자열을 인자로 가지고 있는 콜백 함수

```javascript
// view에게 로컬 변수 전달하기
res.render('html/user', { name: 'Tobi' }, function (err, html) {  
    if (err) {
        res.status(400).send('error!')
    } else {
          res.send(html)            
    }
})
```

---

- `res.download(path [, filename] [, options] [, fn])` : `path`에 존재하는 파일을 `attachment`로 보내며, 브라우저가 다운로드를 진행한다. `filename` 인자는 다운로드 될 파일 명으로, 주어지지 않았다면, `Content-Disposition` 필드의 `filename=` 인자가 기본값이다.

```javascript
res.download('/report-12345.pdf', 'report.pdf', function (err) {
  if (err) {
      // 에러 핸들링
  } else {

  }
})
```

이외의 추가적인 메소드들은 [여기](https://expressjs.com/en/4x/api.html#res) 참조

### 정적 파일(static file) 설정

---

`Express.js`는 [serve-static](http://expressjs.com/en/resources/middleware/serve-static.html) 모듈을 기반으로 만든 빌트인 미들웨어(built-in middleware) 함수인 `express.static`이 존재한다.

이를 이용해  이미지, CSS 파일, JS 파일 등의 정적 파일을 이용할 수 있다. 

```javascript
express.static(root, [options])
```

- `root` 인자는 정적 에셋들이 위치한 경로를 설정한다.

- `[options]` 인자는 `static` 함수가 가질 수 있는 옵션이다. 예를 들면
  
  - `dotfiles` : `.`으로 시작하는 파일과 폴더는 어떻게 다룰 것인가? ex) `"ignore"` : 없는 걸로 취급. (default : `"allow"`, 특별한 조치 취하지 않음)
  - `etag`: HTTP 응답 헤더에 `ETag` 헤더를 추가한다. (default: `"true"`, weak ETag)
  - `lastModified`:  HTTP 응답 헤더에 `Last-Modified` 헤더를 추가한다. (default: `"true"`)
  
  등이 존재한다.

```javascript
app.use(express.static('public'))
```

위와 같은 코드일 경우, 아래와 같은 경로의 `public` 폴더의 파일들을 url을 통해 접근 할 수 있다.

```bash
 |-public/
 | |-hello.html
 | |-css/
 | | |-main.css
 | |-images/
 | | |-dog.png
 | |-js/
 | | |-SPA.js
```

```url
http://localhost:3000/hello.html
http://localhost:3000/css/main.css
http://localhost:3000/images/dog.jpg
http://localhost:3000/js/SPA.js
```

추가로, 경로 접두어를 이용하고 싶다면 다음과 같은 코드를 이용하면 된다.

```javascript
app.use('/static', express.static('public'))
```

```
http://localhost:3000/static/hello.html
http://localhost:3000/static/css/main.css
http://localhost:3000/static/images/dog.jpg
http://localhost:3000/static/js/SPA.js
```

### DB 연결(DB Connection)

---

DB 연결 방법은 [공식 문서](https://expressjs.com/en/guide/database-integration.html)에 DB 별로 상세히 설명되어 있다.

각기 DB에서 지원하는 모듈을 이용하는 방식으로 진행되며, 여기서는 MySQL과 MongoDB의 예시를 알아보겠다.

#### MySQL

```bash
npm install mysql
```

mysql에서 지원하는 npm 모듈을 설치한다. [mysqljs github](https://github.com/mysqljs/mysql)에서 좀더 자세한 사항을 알 수 있다.

```javascript
var mysql = require('mysql')
var connection = mysql.createConnection({
  // 실제로는 env 설정할것!
  host: 'localhost',
  port: '3306',
  user: 'dbuser',
  password: 's3kreee7',
  database: 'my_db',
  debug: ENV.PRODUCTION, // true 시, 콘솔 창에 SQL 쿼리 진행이 출력됨
  supportBigNumbers: true, // db의 BIGINT나 DECIMAL 타입은 데이터 크기상 자바스크립트에서 지원하지 않으므로, 문자열 형식으로 바꿔주는 옵션
  ssl: {
      // ssl 연결 설정을 위한 옵션
  }
})

connection.connect() // 연결 시작

connection.query('SELECT 1 + 1 AS solution', function (err, rows, fields) { // SQL Mapping, 실제로는 ORM으로 진행하는 것을 추천
  if (err) throw err

  console.log('The solution is: ', rows[0].solution)
})

connection.end() // 연결 종료
```

#### MongoDB

```bash
npm install mongodb
```

마찬가지로, MongoDB NodeJS를 위한 드라이버를 이용하면 된다.

```javascript
var MongoClient = require('mongodb').MongoClient

MongoClient.connect('mongodb://localhost:27017/animals', function (err, client) {
  if (err) throw err

  var db = client.db('animals')

  db.collection('mammals').find().toArray(function (err, result) {
    if (err) throw err

    console.log(result)
  })
})
```

Node.js와 MongoDB를 함께 쓸때는, Mongoose와 함께 쓰는 것도 고려해볼만 하다.

Mongoose를 이용하면 관계형 데이터베이스와 달리 자유로운 형식을 가지는 콜렉션(Collection)들의 형식을 정의하고, 제약(Constraint)을 설정해줄 수 있다.

```bash
npm install mongoose validator
```

Mongoose가 대신 MongoDB와 연결을 하므로, MongoDB 연결은 필요없다.

```javascript
let mongoose = require('mongoose');

const server = '127.0.0.1:27017'; // DB 서버 주소
const database = 'fcc-Mail';      // DB 명

class Database {
  constructor() {
    this._connect()
  }

_connect() {
     mongoose.connect(`mongodb://${server}/${database}`)
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error('Database connection error')
       })
  }
}

module.exports = new Database()
```

### 프록시 설정(Proxy setting)

---

Express.js에서는 리버스 프록시(Reverse Proxy)를 이용할 경우, [`proxy-addr`](https://www.npmjs.com/package/proxy-addr) 패키지 기반인 `trust proxy` 설정을 해주어야 정상 작동한다.

이를 설정해주지 않는다면, 클라이언트의 IP 주소 대신, 리버스 프록시의 IP 주소를 클라이언트로 착각한다는 듯하다.

```
X-Forwarded-For: <client>, <proxy1>, <proxy2>
X-Forwarded-For: 203.0.113.195, 70.41.3.18, 150.172.238.178
//X-Forwarded-For 헤더의 예시
```

이때, HTTP 헤더 중 `X-Forwarded-for` 헤더를 이용해 클라이언트 주소를 판명하며, 보통 최좌측이 클라이언트 IP 주소이다.

```javascript
app.set('trust proxy', true)
```

`true` : HTTP 메시지의 `X-Forwarded-For` 헤더의 최좌측의 IP 주소를 클라이언트 IP 주소로 설정

🔵 HTTP 메시지의 `X-Forwarded-For`, `X-Forwarded-Host`, `X-Forwarded-Proto` 헤더를 리버스 프록시가 덮어쓰게 설정 하지 않으면, 클라이언트가 이를 이용해 다른 클라이언트인 척 행세할 수 있다.

`false`: 리버스 프록시가 존재하지 않으며, `req.socket.remoteAddress`에 존재하는 IP 주소를 클라이언트로 간주, 기본값

```javascript
app.set('trust proxy', ['loopback', 'linklocal', 'uniquelocal', '123.123.123.123'])
```

리버스 프록시의 IP 주소를 명시해줄 수도 있다. 아래는 미리 정의된 서브넷 문자열 들이다.

- `loopback` - `127.0.0.1/8`, `::1/128`
- `linklocal` - `169.254.0.0/16`, `fe80::/10`
- `uniquelocal` - `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `fc00::/7`

이때 명시된 IP 주소나 서브넷은 클라이언트 IP 주소가 아닌 것으로 판단하며, `req.socket.remoteAddress`의 주소가 명시되어 있다면(trusted), 해당 메시지의  `X-Forwarded-For` 헤더에 명신된 주소에서 최우측부터 좌측 순으로 확인하면서 가장 첫번째로 명시되어 있지 않은(untrusted) 주소를 클라이언트 주소로 결정한다.

```javascript
app.set('trust proxy', 2)
```

숫자를 명시해줄 경우, 몇 홉의 리버스 프록시 이후에 클라이언트 주소가 나오는지로 결정한다는 의미이다.

예를 들어, `0`을 명시하면, 리버스 프록시가 존재하지않으며, `req.socket,remoteAddress`가 클라이언트 주소로 판명되며, `1`을 명시하면, `X-Forwarded-For` 헤더의 최우측에서 두번째를 클라이언트 IP 주소로, 나머지만 리버스 프록시 주소로 결정한다.

```javascript
app.set('trust proxy', function (ip) {
  if (ip === '127.0.0.1' || ip === '123.123.123.123') return true // trusted IPs
  else return false
})
```

또는, 함수를 정의해주어, 리버스 프록시를 판명할 수 있다. `true`일 경우 리버스 프록시 주소이며, `X-Forwarded-For` 헤더의 다음 주소를 함수에 넣어보게 되고, `false`일 경우 해당 IP 주소가 클라이언트의 주소이다.

`trust proxy` 설정 이후, `req.hostname`의 값은 `X-Forwarded-Host` 헤더에서 가져오게 되며, `X-Forwarded-Proto` 헤더가 리버스 프록시에 의해 변경되어 프로토콜 등을 확인할 수 있게 되며, `req.ip`, `req.ips` 값이 설정되게 된다.

## 미들웨어(Middleware)

---

### 미들웨어 함수란?(About middleware function)

---

미들웨어 함수는 응용프로그램의 요청-응답 사이클의 요청 객체(request object)와 응답 객체(response object), 그리고 `next()` 함수를 이용하는 함수이다.

- 요청 객체(request object) : 클라이언트가 요청한 HTTP 요청의 요소(쿼리 문자열, 인자, 바디, 헤더 등)를 포함하고 있는 객체
- 응답 객체(response object) : 클라이언트에게 돌려줄 HTTP 응답을 위한 객체, 함수를 통해 응답 메시지를 조성하고 응답할 수 있다.
- `next()` 함수 : 실행시 다음 순서의 미들웨어를 불러오는 함수, 해당 미들웨어에서 통신을 종료하지 않고 다음 미들웨어로 넘기려면 이용해야 한다.

미들웨어 함수를 통해, 추가적인 로직을 실행하거나, 요청과 응답에 변형을 가하거나, 통신을 종료하거나 다음 미들웨어 함수를 불러올 수 있다.

예를 들어, 인증, 인가 시스템을 구현하거나, 필터링, 캐쉬 구현 등이 가능하다.

```javascript
var express = require('express')
var app = express()
var router1 = express.Router() // router-레벨 미들웨어 생성을 위한 라우터 선언
var router2 = express.Router()

app.use(function(req,res, next){ // 응용프로그램 레벨 미들웨어 생성
    console.log('middleware 1')
    next()
})

router1.use(function (req, res, next) {
    console.log('middleware 2')
    next()
})

router1.use(function (req, res, next) {
    console.log('middleware 3')
    next()
})

router2.use(function (req, res, next) {
    console.log('middleware 4')
    next('router')  // 현재 라우터 레벨의 모든 미들웨어를 skip
})

router2.use(function (req, res, next) {
    console.log('middleware 5') // 상위 미들웨어에서 라우터 레벨 미들웨어들을 skip했기 때문에 실행되지 않는다.
    next()
})

app.use(function(req,res, next){
    console.log('middleware 6')
    next()
})

app.use('/', router1) // 라우터 미들웨어 선언은 빨랐지만, app에 적용이 느리므로 middleware 6번보다 뒤에 실행된다.
app.use('/', router2)
```

위 코드의 실행결과는 아래와 같다.

```bash
middleware 1
middleware 6
middleware 2
middleware 3
middleware 4
```

### 유용한 미들웨어 (Additional Middleware)

---

#### static

[[#정적 파일(static file) 설정|앞서]] 설명했던 Express.js 빌트인 모듈, 정적 파일을 이용하는데 사용한다.

```javascript
express.static(root, [options])
```

#### cors

```bash
npm install cors
```

CORS는 Express 팀에서 만든 서드 파티 미들웨어이다.

[CORS(Cross-Origin Resource Sharing, 교차 출처 리소스 공유)](https://developer.mozilla.org/ko/docs/Web/HTTP/CORS) 설정을 통해 접근 권한을 설정할 수 있게 한다.

```javascript
var express = require('express')
var cors = require('cors')
var app = express()

var corsOptions = {
  origin: ['http://example.com', 'http://example2.com'], // '*'을 이용하면 모든 요청 CORS 화이트리스트.
  optionsSuccessStatus: 200, // 오래된 브라우저는 코드 204를 쓰므로 200으로 강제
  credentials: true
  //'Access-Control-Allow-Credentials' CORS 헤더 설정 여부
}

//일부 route에만 cors 적용 예시
app.get('/products/:id', cors(corsOptions), function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for only example.com.'})
})

// 모든 route에 cors 적용 예시
app.use(cors())

app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
})
```

#### express-session

```bash
npm install express-session
```

Session 미들웨어를 형성할 수 있게 해주는 Express 팀에서 만든 서드 파티 미들웨어.

Session을 이용하여, 유저의 쿠키를 저장하고, 요청을 유저별로 구분하여, 보안과 유저 특화 서비스 등을 구현할 수 있다.

```javascript
var app = express()
var sess = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))
```

#### helmet

```bash
npm install helmet
```

HTTP 헤더 설정을 통해 어플레이케이션 보안 향상을 도와주는 서드 파티 미들웨어.

```javascript
const express = require("express");
const helmet = require("helmet");

const app = express();
const helmet_setting = {
    referrerPolicy: { policy: "no-referrer" }, // 세부 보안 설정
   contentSecurityPolicy: false // 사용 안함 설정
}
app.use(helmet(helmet_setting));
```

[helmet](https://helmetjs.github.io/)은 15개의 보안 미들웨어를 포함하고 있으며, 각자 설정 및 사용 여부를 조정할 수 있다.

