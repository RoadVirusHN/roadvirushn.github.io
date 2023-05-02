---
title: OSSU PL-A Section 2
date: 2023-03-19 12:06:39 +0900
tags: CS PL SML OSSU 
layout: obsidian
is_Finished: false
last_Reviewed: 2023-03-19 12:06:39 +0900
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
```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```
# OSSU PL-A Section 2

## 새 타입 만들기
`int`, `string`, `list` 같은 기본 제공 타입 이외에도 이 타입들을 조합해 새로운 타입을 만들 수 있다.

또한, 아래 타입들은 서로, 혹은 자기 자신 타입과 중첩될 수 있으며, 이를 재귀형 타입이라고 한다.

### Record (product-type)
n개의 타입을 각각 포함하고 있는 복합 데이터. each-of 타입이라고도 불린다.

튜플이나, 클래스 내부의 필드 등이 해당됨.

```sml
type x0 = {f1 = e1, ..., fn = en}
{foo : int, bar: int*bool, baz: bool*int}
```

내부 순서는 관계없으며, 튜플은 일종의 순서를 키로 하는 레코드이다.

```sml
#f1 x0 = e1
```
위와 같이 `#` 키워드를 통해 값에 접근 가능하다.

### date type (sum-type)
n개의 타입 중 하나인 복합 데이터. one-of 타입이라고도 불린다.

`enum`, 리스트, `option` 등이 해당됨.

```sml
datatype x0 = c0 of t0 | c1 |...| cn of tn

datatype mytype = TwoInts of int * int
| Str of string
| Pizza
```
`c0, cn` 은 생성자로, `t0` 타입을 `x0` 타입으로 바꿔 준다. `TwoInts(3,4)`는 `mytype`으로 바뀐다.

```sml
fun f (x: mytype) =
	case x of
		Pizza => 3
		| TwoInts(i1, i2) => i1 + i2
		| Str s => String.size s
```
위와 같이 `case`를 통해 접근 가능하다.
`option` 또한 위와 같이 접근 가능하며, 기존의 `null`, `valOf` 보다 권장한다.

### 재귀형 타입 예시

```sml
datatype exp = Constant of int
	| Negate of exp
	| Add of exp * exp
	| Multiply of exp * exp
	
fun eval e = 
	case e of Constant i => 
		i 
		| Negate e2 => ~ (eval e2) 
		| Add(e1,e2) => (eval e1) + (eval e2) 
		| Multiply(e1,e2) => (eval e1) * (eval e2)
```

### 다형 타입(Polymorphic type) 혹은 일반 타입(Generic)

다음과 같이 다양한 결과값의 자료형이 나올 수 있는  경우에는 다형 타입,(일반형 타입)이 이용된다.

이들을 통해 재사용성 높은 함수를 만들 수 있다.

```sml
fun justfun x =
	if true then x else x
```
`x`는 어떠한 값이 들어갈 수 있고 어떠한 값이 나올 수 있다.
이를 `sml`에서는 `a'->a'`로 표현한다.

같은 다형 타입인데 서로 자료형이 같거나 달라도 되는 경우, 예를 경우 다음의 경우는 `(a'*b'*b') -> b'`로 표기된다.
```sml
fun justfun2 (x, y, z) =
	if x then y else z
```
말그대로 `a'`, `b'`는 `int`, `string`, `list` 등 여러 값이 들어 갈 수 있으며, 사용자 정의 자료형도 가능하다.


