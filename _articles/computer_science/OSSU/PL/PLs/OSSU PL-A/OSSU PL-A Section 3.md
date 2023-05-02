---
title: OSSU PL-A Section 3
date: 2023-03-22 15:17:49 +0900
tags: CS PL SML OSSU 
layout: obsidian
is_Finished: false
last_Reviewed: 2023-03-22 15:17:49 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

```ad-quote
출처 강의 [Programming Languages, Part A, 워싱턴 대학교](https://www.coursera.org/learn/programming-languages/home/welcome)
```
# OSSU PL-A Section 3

## 용어 설명

아래 셋은 많은 사람들이 서로 혼동하는 용어들이다.

### 일급 함수(first-class function)
값(value) 처럼 계산되거나, 전달되거나 리턴되거나 저장 등이 가능한 함수.

### 함수 클로저(function closures)
- 함수 내에서 외부에서 정의된 변수를 사용하는 함수. 
- 함수가 정의되는 순간에 외부의 전역 변수 값을 고정하여 사용하는 경우를 렉시컬 스코프(Lexical Scope) 혹은 정적 범위(static scope)라고 한다.
	- 이를 통해, 입력에 대한 일정한 출력이 보장되고, 변수의 타입 변경 등에 의한 오류가 없다.
	- 렉시컬 스코프의 반대는 동적 스코프(dynamic scope) 라고 한다.
- 함수 선언 + 렉시컬 스코프 = 클로저 라고 한다.

클로저 덕분에 Currying, 함수 조합 등이 가능하다.

### 고차 함수(higher-order function)
다른 함수를 인수로 받거나 반환하는 함수

이들을 이용해 가독성과 재사용성 좋은 코드를 만들 수 있다. 예시 : `map`, `filter`

## 함수형 프로그래밍(functional programming)의 특징
- 변경가능한(mutable) 데이터를 거의 혹은 전혀 사용하지 않음
- 함수를 값처럼 다룰 수 있음(위 용어 설명)
- 재귀와 재귀 구조 데이터를 자주 사용함
- 전통적인 수학적인  문법과 스타일로 함수를 이용함
- laziness 같이 기존의 프로그래밍에서 사용하지 않는 idiom(관용구)을 사용

