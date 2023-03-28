---
title: Spring5 입문-빈(Bean)과 컨테이너
date: 2023-01-09 13:57:33 +0900
tags: WEB SPRING BE SUMMARY HIDE
layout: obsidian
is_Finished: false
last_Reviewed: 2023-01-09 13:57:33 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```
# 빈(Bean)과 컨테이너
```ad-quote
title: 출처

_[초보 웹 개발자를 위한 스프링 5 프로그래밍 입문](https://www.kame.co.kr/nkm/detail.php?tcode=306&tbook_jong=3)_와 [스프링 인 액션](https://jpub.tistory.com/1040)의 내용을 바탕으로 정리한 내용입니다.
```

## 컨테이너

**컨테이너** : 스프링에서 빈(Bean) 객체의 생성, 초기화, 보관, 제거 등을 관리하는 `ApplicationContext` 인터페이스를 구현한 객체.

```ad-info
title: `ApplicationContext` 인터페이스 클래스 그래프
![[image-20230109162755749.png|600]]
- `BeanFactory`는 최상위 인터페이스로 객체 생성과 검색에 대한 기능 정의
- `ApplicationContext` 인터페이스는 메시지, 프로필/환경 변수 등을 처리
- `AbstractApplicationContext` 클래스는 `close()`  메서드를 정의해 컨테이너 종료 가능
- `AnnotationConfigApplicationContext`는 자바 어노테이션을 이용해 클래스로 부터 객체 설정 정보 가져옴
- 나머지는 xml, groovy 문법으로 가져온다.
```

```ad-example
title: 스프링 컨테이너 선언
~~~java
// ...
import org.springframework.context.annotation.AnnotationConfigApplicationContext;

private static ApplicationContext ctx = new AnnotationConfigApplicationContext(AppCtx.class); // 스프링 컨테이너 초기화
// AppCtx = 컨테이너 인스턴스, 구성 클래스가 여러개일 경우 (AppCtx.class, AppCtx2.class) 처럼 여러개 지정 가능 
MemberRegisterService regSvc = ctx.getBean("memberRegSvc", MemberRegisterService.class); // 컨테이너의 객체 생성 혹은 검색

ctx.close();// 컨테이너 종료
~~~
```
스프링 컨테이너는 초기화와 종료에 의해 다음과 같이 빈 객체의 라이프 사이클을 관리한다.
- 컨테이너 초기화 -> 빈 객체 생성, 의존 주입, 초기화
- 컨테이너 종료 -> 빈 객체 소멸

## 빈(Bean)
- **빈(Bean) 객체** : 스프링이 생성, 관리, 검색 가능한 객체, 빈 객체를 생성하는 메소드명으로 구분하며 검색하여 단 하나의 인스턴스만 생성한다.
### 빈 등록 방법
빈 객체를 등록하는 방법은 직접 구성 클래스 내부 선언을 통한 수동 등록과 컴포넌트 검색 두가지가 있다.
```ad-example
title: 구성 클래스 내부에서 빈 객체를 생성하는 메서드 선언
~~~java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import spring.MemberDao;
public class AppCtx{
	@Autowired 
	private MemberPrinter printer; // @Autowired 어노테이션을 통한 자동 주입 // 아래 memberDao 처럼 메서드를 정의해줄 필요 없다. 
	@Bean // 스프링 빈 생성을 위한 메서드임을 표시 
	public MemberDao memberDao(){
		return new MemberDao();
	}
}
~~~
```
- [[Spring5 입문-컴포넌트 검색(Component Scan)]]
### 빈 생성 및 검색 방법
이후 알아볼 [[Spring5 입문-빈(Bean)과 컨테이너#컨테이너|컨테이너 인스턴스]]를 통해 빈 객체를 생성 혹은 검색할 수 있다.
- 빈 객체 자동 주입은 가장 자주 사용하는 `@Autowired` 말고도 `@Resource, @Inject`등이 존재한다.
- 자세한 내용은 [[Spring5 입문-의존 자동 주입]] 참조

```ad-example
title: `.getBean()` 메서드
~~~java
private static ApplicationContext ctx = new AnnotationConfigApplicationContext(AppCtx.class);

VersionPrinter versionPrinter = ctx.getBean("versionPrinter", VersionPrinter.class);
~~~
```
`.getBean()` : 빈 객체를 생성하는 메소드명과 클래스를 인자로 빈 객체를 생성하거나, 이전에 생성했던 빈 객체를 가져온다.
- 만약 메서드 리턴과 클래스가 일치하지 않거나 오타가 있다면 오류가 난다.
- 만약 해당 클래스의 빈 객체 종류가 단 하나만 존재한다면, 클래스만 넣어도 된다. 

### 빈 객체의 라이프 사이클

빈 객체는 스프링 컨테이너에 의해 관리되며 크게 **생성, 의존 주입, 초기화, 소멸**로 나뉜다.

- **생성** : 컨테이너 생성 직후 실행
	- 빈 객체 싱글톤, 혹은 설정에 따라 프로토타입 패턴으로 생성
```ad-example
title: 빈 객체의 Scope 설정
아래와 같이 `@Scope`를 통해 `prototype` 범위의 빈을 지정해 빈 객체를 구할 때마다 새로운 객체를 생성하게 할 수 있다.

- 단, prototype 빈은 **컨테이너 종료 시에도 소멸 메서드를 실행하지 않고, 직접 소멸하고 소멸 관련 메서드를 구현**해야 한다.

~~~java
import org.springframework.context.annotation.Scope;

@Bean
@Scope("prototype") // 명시하지 않거나 @Scope("singleton") 일 경우 오직 하나만 생성
public Client client() {
    Client client = new Client();
    client.setHost("host");
    return client;
}
~~~
```
---
- **의존 주입**
	- 의존 자동 주입을 통한 의존 설정
---
- **초기화**
	- 구현한 초기화 메서드 실행
```ad-example
title: 초기화 메서드 구현 예제
`InitializingBean` 인터페이스의 `afterPropertieSet` 메서드를 구현하면 실행되며, 주로 DB 커넥션 풀 연결 생성, 채팅 클라이언트 시작 등에 사용

**수동으로 구성 클래스 빈 생성 메서드 내에서 부를 수 있으나, 그 경우 2번 실행되게 된다.**
~~~java
import org.springframework.beans.factory.InitializingBean;
public class Client implements InitializingBean {
    @Override
    public void afterPropertiesSet() throws Exception {
        System.out.println("Client.afterPropertiesSet() 실행");
    }

	public void connect() {
		System.out.println("Client.connect() 실행");
	}
}
~~~
```
만약, 변경 불가능한 외부 모듈 클래스, 아니면 모종의 이유로 인터페이스를 사용하고 싶지 않으면 다음과 같이 `@Bean` 어노테이션의 속성을 사용하면 된다.
```ad-example
title: `@Bean` 속성을 이용한 초기화 메서드 구현
`Client` 클래스 내의 `connect`라는 메서드를 초기화 시 실행시키게 된다.
`Client` 클래스 내 `connect` 함수 구현 필요, 단, 파라미터가 존재할 경우 에러 발생
~~~java
@Bean(initMethod = "connect")
public Client client() {
	//...
}
~~~
```
---
- **소멸** : 컨테이너 `close()` 메서드 실행 이후 실행
	- 특정 메서드 실행
```ad-example
title: 소멸 메서드 구현 예제
`DisposableBean` 인터페이스의 `destroy` 메서드를 구현하면 실행되며, 주로 DB 커넥션 풀 연결 종료, 채팅 클라이언트 종료 등에 사용
~~~java
import org.springframework.beans.factory.DisposableBean;
public class Client implements DisposableBean {
    @Override
    public void destroy() throws Exception {
        System.out.println("Client.destroy() 실행");
    }
	
	public void close() {
		System.out.println("Client.close() 실행");
	}
}
~~~
```
마찬가지로, 변경 불가능한 외부 모듈 클래스, 모종의 이유로 인터페이스를 사용하고 싶지 않으면 다음과 같이 `@Bean` 어노테이션의 속성을 사용하면 된다.
```ad-example
title: `@Bean` 속성을 이용한 소멸 메서드 구현
`Client` 클래스 내의 `close`라는 메서드를 소멸 시 실행시키게 된다.
`Client` 클래스 내 `close` 함수 구현 필요. 단, 파라미터가 존재할 경우 에러 발생
~~~java
@Bean(destroyMethod = "close")
public Client client() {
	//...
}
~~~
```