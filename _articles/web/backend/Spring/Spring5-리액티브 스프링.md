---
title: Spring5-리액티브 스프링
date: 2023-02-25 17:01:00 +0900
tags: HIDE CRUDE 
layout: obsidian
is_Finished: false
last_Reviewed: 2023-02-25 17:01:00 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# Spring5-리액티브 스프링
```ad-quote
title: 출처

_[초보 웹 개발자를 위한 스프링 5 프로그래밍 입문](https://www.kame.co.kr/nkm/detail.php?tcode=306&tbook_jong=3)_와 [스프링 인 액션](https://jpub.tistory.com/1040)의 내용을 바탕으로 정리한 내용입니다.
```
```ad-warning
title: 스프링 부트를 사용한다는 가정 하에 진행됩니다.
```
## 리액티브 스프링이란?

작업들을 병렬로 실행시키고 작업을 부분집합으로 처리할 수 있게해주는 패러다임이다.

동시성 프로그래밍은 복잡하고 안정성이 낫지만, 리액티브 프로그래밍은 함수적, 선언적으로 파이프라인과 스트림을 이용해 쉽게 사용할 수 있다.

기존의 자바 스트림과 비교해 
- 데이터셋의 크기와 관계없고 
- 비동기 처리를 지원하며
- 데이터 소비자가 전달 데이터를 제한 가능하다(백 프레셔)
등의 장점이 있다.

### 대표 인터페이스 4개

리액티브 스트림은 `Publisher(발행자)`, `Subscriber(구독자)`, `Subscription(구독)`, `Processor(프로세서)`으로 구성된다.

주로 Publisher의 데이터를 0 이상의 Processor를 통해 처리한 뒤 최종 Subscriber에게 전달한다.
#### Publisher(발행자)
하나의 Subscription 당 하나의 Subscriber에 전송할 데이터를 생성함
```java
public interface Publisher<T> {
	// subscriber가 publisher에게 구독 신청하게 하는 메서드
	void subscribe(Subscriber<? super T> subscriber);
}
```


#### Subscriber(구독자)
구독 신청이 완료되면 Publisher로 부터 이벤트를 수신받을 수 있으며, 이는 아래의 메서드들을 통해 전송된다.
```java
public interface Subscriber<T> {
	void onSubscribe(Subscription sub); // 첫번째 이벤트 보낼때 호출
	void onNext(T item); // 데이터 스트림 중 다음 데이터 호출 
	void onError(Throwable ex); // 에러 발생 시 호출
	void onComplete(); // 더이상 줄 데이터가 없을때 호출
}
```
Publisher는 Subscriber의 메소드들을 이용해 이벤트를 관리한다.

#### Subscription(구독)
Subscriber가 Publisher로 부터 받아 구독을 직접 관리한다.
```java
public interface Subscription {
	void request(long n); // 다음 전송하는 데이터를 n양 만큼 요구
	void cancel();  // 더이상 구독하지 않고 구독 취소
}
```
Subscriber가 원하는 만큼 정보를 주도록하여 백프레셔를 구현한다.

#### Processor(프로세서)
Subscriber + Publisher 두 인터페이스를 결합한 역할
Subscriber 역할로 데이터를 수신, 처리하고 Publisher 역할로 처리 결과를 자신의 Subscriber에게 전달.
```java
public interface Processor<T, R> extends Subscriber<T>, Publisher<R> {}
```
즉, Publisher와 Subscriber의 중간 처리 역할을 한다.

## 리액터
스프링 5의 리액티브 프로그래밍 모델의 기반, 데이터의 전달 파이프라인을 구성하는데 사용된다.

다음과 같은 의존성을 추가해야 한다.
- **io.projectreactor.reactor-core** : 리액터 사용
- **io.projectreactor.reactor-test** : 리액터 테스트 지원
	- `StepVerifier`를 통해 `expectNext`나 `verifyComplete` 같은 검사 메서드를 쓸 수 있게 해준다.
스프링 부트가 아닌 경우에는 버전과 스코프 등을 정확히 명시해줘야 한다.


### 리액터 개념

리액터의 두 가지 핵심 타입은 다음 둘이 있다.
- `Mono`: 오직 하나의 데이터 항목을 갖는 파이프라인, `RxJava`의 `Observable`
- `Flux` : 0~최대 무한대의 데이터를 갖는 파이프라인, `RxJava`의 `Single`

예를 들어 다음 자바 코드는
```java
String name = "Craig";
String capitalName = name.toUpperCase();
String greeting = "Hello, " + capitalName + "!";
System.out.println(greeting);
```
리액터로 비슷하게 표현하자면 다음과 같다.
```java
Mono.just("Craig") // 데이터로 첫번째 데이터 생성
	.map(n -> n.toUpperCase()) // 각 데이터를 대문자로 변경
	.map(cn -> "Hello, " + cn + "!") // 각 데이터를 문자열 연결
	.subscribe(System.out::println); // 데이터 수신 및 출력 구독
```
파이프 라인은 각 오퍼레이션을 통해 데이터가 단계별로 변경되며, 같은 스레드 혹은 다른 스레드로 실행될 수 있다.

### 리액터 오퍼레이션

리액터는 500 개 이상의 오퍼레이션을 지원하며 크게 다음과 같이 분류된다.
- **생성(creation) 오퍼레이션**
	- `just(데이터)` : `Flux`나 `Mono`를 만드는데 사용하는 오퍼레이션
		- `Mono`는 무조건 하나의 데이터, `Flux`는 데이터 콜렉션이 들어갈 수 있다.
	- `range(시작,끝)`: 시작부터 끝까지 숫자가 포함된 카운터 `Flux` 생성(`Flux` 전용)
	- `interval(Duration.ofSeconds(수))`: `Duration`을 이용해 일정 시간 마다 무한하게 데이터 방출
- **조합(combination) 오퍼레이션**
	- `Flux.mergeWith(다른 Flux)`: 두 Flux를 합친 새로운 Flux 생성, 시간에 따라 항목 순서가 다름
	- `zip`: 위와 다르게 두 플럭스의 데이터항목이 번갈아가며 생성
- **변환(transformation) 오퍼레이션**
	- `skip(n)`: n개 만큼의 데이터 항목의 앞 부분을 생략하고 돌려줌
	- `take(n)`: 반대로 앞의 n개 만큼의 데이터 항목을 받음
	- `filter(람다 혹은 함수)`: 주어진 조건에 맞는 항목만 돌려줌
	- `map(람다 혹은 함수)`: 주어진 변환을 각 항목에 적용하여 결과 반환
	- `flatMap(파이프라인이 포함된 함수)`: 비동기 처리 방식의 map을 생성 가능
	- `buffer(n)`: n개의 데이터를 묶어서 하나의 콜렉션으로 돌려줌
- **로직(logic) 오퍼레이션**
	- `all(조건)`: 조건에 모두 맞으면 해당 데이터 항목 콜렉션 돌려줌
	- `any(조건)`: 조건에 하나라도 맞으면 해당 데이터 항목 콜렉션 돌려줌
이외에도 `delaySubscription`, `delayElements` 등이 있다.

자세한 것은 [공식 문서]() 참조