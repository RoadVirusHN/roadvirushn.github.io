---
title: OSSU PL-B Section 1
date: 2023-04-10 09:54:50 +0900
tags: CS PL SML OSSU 
layout: obsidian
is_Finished: false
last_Reviewed: 2023-04-10 09:54:50 +0900
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
# OSSU PL-B Section 1

## 간단한 Racket 설명
이미 앞서 Racekt을 이용해봤기 때문에 간단히 설명한다.
- 동적 타이핑을 지원
	- 따라서 `cond`와 `number?` 등을 이용해 분기 처리 가능
- 과거 이름은 `Scheme`이였으며, 빈 리스트, `cons`,  mutable 등의 변화가 이뤄진 뒤 Racket으로 바뀌었다.
- `#lang racket`으로 시작할 것
|Primitive|Description|Example|
|---|---|---|
|`null`|빈 리스트|`null`|
|`car`|리스트 첫번째 원소|`(car some-list)`|
|`cdr`|리스트 나머지 원소들|`(cdr some-list)`|
|`null?`|`#t`=빈 리스트, `#f`=나머지|`(null? some-value)`|

## `let`, `let*`, `letrec` etc.
`(let ([local-var local-val] ..) e)` : 지역 스코프 설정, 이전 바인딩 사용 불가능
`(let* ([local-var local-val] ..) e)` : 이전 지역 스코프 바인딩 사용 가능
`(letrec ([local-var local-val] ..) e)` : 순서와 상관 없는 지역 스코프(상호 재귀 가능)
`set!` : 이미 바인딩된 변수를 변경함
`mcons`: 변경 가능한 pair 생성
- `mcar`, `mcdr`, `mpair?`등을 이용 해야함
- `set-mcdr!`, `set-mcar!` 등을 이용해 변경
## 표현 지연과 Thunk
모든 표현 `e`는 곧바로 표현될 필요가 없다. 예를 들어 `(if e1 e2 e3)`에서 `e1`이 `#t`이면 `e3` 값은 사용되지 않으므로 표현되지 않는다.
- 단순히 성능 뿐만 아니라, 무한 루프 등을 막기 위해 필요하다.

하지만 이는 함수의 인자 전달 등에는 적용되지 않는다. 따라서 의미없는 표현을 막기 위해 함수의 바디는 함수가 사용되기 전까지 표현되지 않는 특성을 이용하는 것을 Thunk라고 한다.

`e`를 그대로 전달하지 않고, `(define a (lambda () e))` 형식으로 전달한 뒤, 사용할 때 `(a)`를 이용해 `e`를 표현하게 한다.

이렇게 표현된 `e`는 언제나 즉시 표현되기보다는, 표현된 후, 결과를 저장하여 사용하는 편이 효율적이며, 이를 Delay와 Force라고 하며, 다음과 같은 함수로 구현 가능하다.

```racket
; f는 (lambda () e) 형식으로 전해주면 됨
(define (my-delay f) (mcons #f f))

(define (my-force th) 
	(if (mcar th) 
		(mcdr th) 
		(begin (set-mcar! th #t) (set-mcdr! th ((mcdr th)))
		(mcdr th))))
```
## Stream
무한히 전해지는 데이터를 표현(ex) Unix pipe)할 때 사용하며, 이를 앞서 배운 Delay와 Force, Thunk를 이용해 쉽게 표현할 수 있다.
```racket
; (cons cur-val next-val-thunk) 형식으로 생성
(define (stream-maker fn arg) 
	(letrec 
		([f (lambda (x) 
			(cons x (lambda () (f (fn x arg)))))])
		(lambda () (f arg))))
(define ones 
	(stream-maker (lambda (x y) 1) 1)) 
(define nats (stream-maker + 1))
(define powers-of-two (stream-maker * 2))
```

## Memoization
값의 저장을 통해 효율적인 연산을 시행하는 법
```racket
(define fibonacci 
	(letrec([memo null] 
			[f (lambda (x) 
				(let ([ans (assoc x memo)]) # assoc : 값 x를 리스트 memo에서 찾아냄
					(if ans 
						(cdr ans) 
						(let ([new-ans (if (or (= x 1) (= x 2)) 
								1
								(+ (f (- x 1)) (f (- x 2))))])
						(begin (set! memo (cons (cons x new-ans) memo)) new-ans)))))])
f))
```

## Macros
Racket의 Macro는 `C/C++`에 비해 사용하기 쉽다.
- lexical scope와 자동 유일 지역 변수 적용
- 재귀 Macro 사용 가능
- 함수 내 로컬 스코프 등으로 Macro를 shadowing 가능

```racket
(define-syntax 
	my-if (syntax-rules (then else) 
		[(my-if e1 then e2 else e3) (if e1 e2 e3)]))
```
매크로를 이용해 for-loop 등을 생성할 수 있다.(while은 불가능하다고 함?)


하지만 다음과 같은 이유로 사용에 주의해야 한다.
- 매크로 내 표현 `e`의 표현 순서 ()
- 표현의 의미없는 반복 연산
- Tokenization : 정확히 공백으로 나누어진 단어를 중심으로 변경 시킴, ex) (token 1) 매크로는 tokenization을 1ization으로 바꾸지 않는다. 다만 this is token을 this is 1 으로 바꾼다.