---
title: CS 질문 정리 - PL
date: 2022-12-28 10:45:34 +0900
tags: HIDE CS 
layout: obsidian
is_Finished: false
last_Reviewed: 2022-12-28 10:45:34 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# CS 질문 정리
## 객체 지향형 프로그래밍



[[JAVA 기본-클래스 구조]]

## 선언형 프로그래밍
### 함수형 프로그래밍

## Java

### Java 상속과 인터페이스 


## Javascript

비동기

이벤트 루프

프로미스

## C-family

### 메모리의 동적 할당
C 언어의 경우, 런타임 중에 사용할 메모리 공간을 [[OS 정리-Chap 3-프로세스와 스레드#프로세스 메모리 구조|힙]]에 할당하기 위해 `malloc` 함수를 이용할 수 있다.

다른 프로그래밍 언어는 자동으로 동적 할당이 가능하지만 C언어는 메모리에 대한 완전한 제어를 가지는 대신 관리 책임 또한 지어야 한다.


```ad-note
title: `malloc` 함수
~~~c
void* malloc(size_t size);
~~~
`size` : 동적으로 할당할 메모리의 크기
`return` : 할당된 메모리의 주소, 할당 실패시 NULL
```
- 리턴이 void 형이므로 주소를 얻어오기 위해 `int*`처럼 캐스팅하여 값을 받아와야 한다.

이후 사용이 끝난 메모리는 `free` 함수를 이용해 해제해 줘야 한다.
```ad-note
title: `free` 함수
~~~c
void free(void *ptr);
~~~
`ptr`: 해제하고자 하는 메모리의 포인터
```
- 해제해주지 않을 경우 해당 메모리 공간을 계속 차지하는 메모리 누수 현상이 일어난다.
- 다른 프로그래밍 언어는 가비지콜렉션을 통해 자동으로 해제해준다.

```ad-example
title: 동적 할당 예시

~~~c
#include <stdio.h>
#include <stdlib.h> // or <malloc.h>

void main()
{
	int* arr;
	arr = (int*)malloc(sizeof(int) * 3); // 3 길이의 int 배열 크기 만큼 동적 할당 

	arr[0] = 1;
	arr[1] = 2;
	arr[3] = 3;

	for (int i = 0; i < 3; i++){
		printf("%d", arr[i]);
	}
	free(arr); // 사용한 메모리 해제
}
~~~
```


```ad-seealso
title: 만약 해제한(free) 메모리 또 해제하면? => DFB

~~~c
char * myString = malloc(sizeof(char)*STRING_BUFFER_SIZE);
free(myString); 
free(myString); // all realloc
~~~

이를 double free bug(DFB)라고 하며, 보통 crash나 메모리 오염의 위험이 있다. 

이를 막기위해  다음과 같이 해제한 뒤 `NULL`을 지정해주면 좋다.
~~~c
free(myString);
myString = NULL;
~~~
```

```ad-seealso
title: 왜 DFB가 나타나는 가?

간단히 말하자면, 두 번 해제된 메모리 공간은 덮어씌어질 위험이 생긴다.
[블로그 글](https://showx123.tistory.com/59) 참조
```

```ad-seealso
title: 메모리 누수란?

ㅣ
```


## Python