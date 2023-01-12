---
title: Subbrain 개발기 - Typescript
date: 2023-01-11 16:29:58 +0900
tags: HIDE CRUDE 
layout: obsidian
is_Finished: false
last_Reviewed: 2023-01-11 16:29:58 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# Subbrain 개발기 - Typescript

## 개요

**[타입스크립트](https://www.typescriptlang.org/)**는 정적 타입 체크 등의 기능이 추가된 자바스크립트의 슈퍼셋 언어이다. 이를 통해 타입 불일치 등에 의한 버그를 줄이고 타입 정의를 통해 데이터 정의를 확실히 할 수 있다.

주로 드로워와 카테고리 구조 여닫기, 검색 결과 페이지 생성, 검색 창에 태그 생성, 드로워 애니메이션 적용 등의 동적인 기능들을 개발하는데 사용했다. 

타입스크립트를 이용해 "그나마" 체계적이고 버그가 적은 코드를 만들 수 있었다.

검색과 관련된 기능은 이곳이 아닌 브라우저 기반 검색 페이지에서 설명한다.

## 개발 기능
### Typescript config
```ad-note
title: tsconfig.json
~~~json
{
  "compilerOptions": {
    "target": "es2021",
    "moduleResolution": "node",
    "noImplicitAny": true,
    "removeComments": true,
    "preserveConstEnums": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "sourceMap": true,
    "strict": true,
    "rootDir": "scripts",
    "outDir": "assets/scripts",
    "typeRoots": ["node_modules/@types", "scripts/types"]
  },
  "include": ["scripts/**/*"],
  "exclude": ["node_modules", "**/*.spec.ts"]
}
~~~
```
- 기본값에서 크게 달라진 점은 없으며, `JSON` 처리와 결과물 설정을 `Jekyll` 폴더 구조의 `assets` 폴더로 옮기도록 하여 런타임에 불러올 수 있도록 하였다.

### 프로젝트 파일 구조
```ad-example
title: Typescript 파일 구조

![[image-20230112104027956.png|200]]


```
- 사용 용도별로 폴더를 나누어 엔트리 포인트 역할을 할 `index.ts`를 가지고 있으며, `components` 폴더에서 기능을 구현한다.
예외적으로 
- `types` 폴더는 데이터 타입들에 대한 정의
- `utils` 폴더는 공통으로 사용하는 함수 코드를 가지고 있다.

## 회고

생성된 JS 코드와 TS 코드를 연결해주는 `Sourcemap` 파일들이 보기 싫었지만, 덕분에 초기에 이를 통하여 브라우저에서 디버깅을 쉽게할 수 있었다. 
- 하지만 Webpack이 번들링하면서 디버깅이 어렵게 되어, 나중에 Webpack을 개발 환경과 빌드 환경으로 나눌 필요가 있을 것 같다.

파일 구조는 도대체 어떻게 정해야 하는가?

평소에 React하고만 쓰다보니 코드가 엉망이다.

정적 사이트에 동적인 기능을 많이 많들다 보니 비대해져 성능이 조금 나빠진 것 같다.

