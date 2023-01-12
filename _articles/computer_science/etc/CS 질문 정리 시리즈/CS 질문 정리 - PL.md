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



### 제어자(Modifier)
클래스나 변수, 메서드 선언 시 앞에 함께 선언되어 부가적인 의미를 부여한다.

- **접근 제한자(Access Modifier)**
객체 지향형 프로그래밍 언어들에서 **클래스 내부 또는 외부에서 메소드와 필드의 접근을 제어하여 캡슐화를 구현하기 위한 수단**이다.

주로 Java로 설명하므로 자세한 건, [[#Java]]을 참조

- **접근 제한자 이외**
	자바의 경우 주로 static, final, abstract를 이용한다.
	- **static** : 클래스가 인스턴스화하지 않고도 접근 가능하며, 모든 인스턴스가 값을 공유한다.
		클래스가 메모리에 로딩될 시 생성되며, 메모리의 위치가 고정되게 된다.
		**static** 메서드의 경우, 각 인스턴스의 인스턴스 멤버를 사용할 수 없게 된다.
		
	- **final**: 클래스의 경우 확장(상속) 불가능, 메소드와 변수의 경우 최초 선언 이후로, 재정의, 변경 불가능하게 제한한다.
		보통 **static final**로 같이 사용하여 다른 언어에서의 **Const**처럼 상수로 사용한다.
		
	- **abstract**:  클래스와 메서드에만 사용, 메서드의 선언부만 작성하고 실제 수행 내용은 오버라이딩 해서 사용한다.
		이를 추상 메서드라 하며, 추상 메서드가 있는 클래스의 앞에 같이 선언하여 추상 클래스로 만들어지면, 해당 클래스는 인스턴스화될 수 없고 상속만 받을 수 있다.
		
	그 외에는 **native**(자바가 아닌 언어로 구현 뒤, 자바에서 사용 시), **transient**(직렬화 시, 직렬화 대상 제외), **snchronized**(스레드 동기화용), **volatile**(메인 메모리에 변수 저장), **strictfp**(부동 소수점 계산 제한) 등이 존재하며, 자바 이외의 언어는 추가로 **extern**, **inline**, ***const** 등이 존재한다.
	

## 선언형 프로그래밍
### 함수형 프로그래밍

## Java
### Java의 접근 제한자
클래스와 지역 변수를 제외하고 모든 메서드, 필드, 생성자는 폐쇄성 오름차순으로 **Public, Protected, Default, Private**이 존재한다.

- **Public**: 언제 어디서나 접근 가능
- **Protected**: 같은 패키지 소속이거나 자식 객체만 접근 가능
- **Default**: 같은 패키지에 소속된 객체만 접근 가능, 아무 선언 안할 시 기본값
- **Private**: 클래스 내부에서만 접근 가능, 
	- 접근 불가능한 private 생성자를 이용해 인스턴스 생성 또한 클래스 내부의 다른 퍼블릭 메소드로 진행하도록 강제하여 싱글톤 패턴을 만드는데 사용할 수 있다.

```ad-seealso
title: Class 접근 제한자는 **Public과 Default**만 있으며, **Public**의 경우, 다른 패지키에서 해당 클래스를 사용 가능하다. 지역변수는 언제나 **Default** 상태이다.
```

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