---
title: Nodemon 학습
date: 2020-02-16 17:21:08 +0900
tags: JS node tool
layout: obsidian
is_Finished: true
last_Reviewed: 2022-10-30 17:21:08 +0900
use_Mathjax: false
---

# Nodemon

![Nodemon Logo](https://user-images.githubusercontent.com/13700/35731649-652807e8-080e-11e8-88fd-1b2f6d553b2d.png)

**node.js 기반 응용프로그램의 코드가 변경시 자동으로 서버를 재시작해주는 도구**.

주로 개발 단계에서 일일이 서버를 재시작 하는 수고를 덜어주어 디버깅과 개발을 용이하게 해준다.


 ```bash
 npm install --save-dev nodemon # or using yarn: yarn add nodemon -D
 ```

위와 같이 설치 후, 아래와 같이 기존의 서버 실행 스크립트에 씌워주는 형식이다.

```bash
nodemon node index.js localhost 8080
```

보통은 `package.json`의 `scripts` 항목에 추가하여 간단하게 사용한다.

```json
// package.json의 일부 예시
...
"scripts": {
    "gen-env": "gen-env-types .env -o src/env.d.ts -e .",
    "build": "tsc",
    "watch": "tsc -w",
    "dev": "nodemon dist/index.js",
    "dev2": "nodemon --exec ts-node src/index.ts",
    "start": "nodemon dist/index.js",
    "start2": "ts-node src/index.ts",
    "test": "echo \"Error: no test specified\" && exit 1",
    "create:migration": "mikro-orm migration:create"
  },
...
```

만약 수동적으로 재시작하고 싶다면, 콘솔에 `rs`를 입력하면 nodemon이 재시작 된다.

추가적인 Nodemon 설정 (재시작 지연시간, 변경 무시 파일) 등은 `nodemon.json`이라는 따로 설정 파일을 놓을 수 있으나, 한꺼번에 node.js 설정을 관리하고 싶으면, 아래와 같이, `package.json`에 `nodemonConfig` 항목을 추가하여 설정해줄 수 있다.

```json
{
  "name": "nodemon",
  "homepage": "http://nodemon.io",
  "...": "... other standard package.json values",
  "nodemonConfig": {
    "ignore": ["test/*", "docs/*"],
    "delay": 2500
  }
}
```

`--watch` 플래그를 통해 여러 경로의 파일의 변화를 감시할 수 있다.

```bash
nodemon --watch app --watch libs app/server.js
```

다음과 같은 형태로 node.js 기반이 아니어도 실행이 가능하다.

```bash
nodemon --exec "python -v" ./app.py
```



