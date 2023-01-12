---
title: Subbrain 개발기 - webpack, eslint, etc
date: 2023-01-11 15:23:25 +0900
tags: HIDE CRUDE 
layout: obsidian
is_Finished: false
last_Reviewed: 2023-01-11 15:23:25 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# Subbrain 개발기 - Webpack, Eslint, etc

## 개요

**Webpack**은 자바스크립트 환경의 정적 모듈 번들러로, 자바스크립트, CSS, JSON, 이미지 파일 등을 하나의 번들 스크립트로 묶어준다.
이를 통해 필요 데이터 압축, 요청 메시지 수 감소, 코드 난독화, 고립된 코드 확인 등의 장점을 가진다.

**Eslint**는 자바스크립트 정적 코드 분석기로, 설정을 통해 코드의 일관성을 지키고 버그를 줄이는데 사용할 수 있다.

**Rubocop**은 루비 정적 코드 분석기 + 코드 포멧터이다.

**Prettier**는 다양한 포맷팅을 지원하는 코드 포멧터로, 설정한 코드 스타일에 맞춰 자동으로 코드를 변경한다.

**Husky**는 `Git`에 커밋하기 전에 커밋 메시지 린팅, 테스트 실행, 코드 실행 등을 진행해주는 패키지이다.

개발 편의성과 기술 스택 습득을 위해 사용해 보았다. 소규모의 개인 프로젝트에서는 조금 의미가 퇴색되지만, 나중에 커다란 팀 프로젝트에서 큰 힘을 발휘할 수 있을 것 같다.

## 개발 기능
```ad-warning
title: 🛠️ 변경 예정

아무리 생각해도 잘 못쓰고 있는것 같아... 다시 정리해야할 것 같아...
```

## 회고

아무래도 webpack을 제외한 기능들은 VScode에서 편리하게 지원하므로 제대로 된 구현을 하지 않은 느낌이다.

학습을 위해서라도 체계적으로 정리하고 수정할 필요성을 느꼈다.