---
title: Spring5 입문-스프링 부트
date: 2023-01-29 15:00:22 +0900
tags: HIDE CRUDE 
layout: obsidian
is_Finished: false
last_Reviewed: 2023-01-29 15:00:22 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# 스프링 부트

```ad-quote
title: 출처

_[초보 웹 개발자를 위한 스프링 5 프로그래밍 입문](https://www.kame.co.kr/nkm/detail.php?tcode=306&tbook_jong=3)_와 [스프링 인 액션](https://jpub.tistory.com/1040)의 내용을 바탕으로 정리한 내용입니다.
```

스프링 부트는 스프링 MVC 웹 어플리케이션을 만들때 드는 복잡한 설정을 자동으로 세팅하여 수고를 덜어준다.

더욱 자세한 내용은 스프링 부트 책이나 스프링 부트 레퍼런스를 확인해 보자.

## 부트 프로젝트 생성
https://start.spring.io 사이트에서 기본 프로젝트를 설정 후, 다운로드 받을 수 있다.
- 혹은 `spring tool suite` 같은 프로그램에서 지원하거나 회사 커스텀 `Initializer`를 쓸 수 있다.
이곳에서 프로젝트명, 의존 관리 툴, 언어, 버전, 프로젝트명, 시작시 포함할 의존 등을 추가할 수 있다.
생성을 누르면, zip 파일이 다운로드되며 내부에는 다음과 같은 파일들이 존재한다.
- `pom.xml`
- `src/main/java: sp5/sp5chapb/Sp5ChapbApplication.java`
- `src/main/resources: application.properties`
- `src/test/java`: `Sp5ChapbApplicationTests.java`

### 스프링 부트 파일 살펴보기
#### `pom.xml`
`pom.xml`을 살펴보면 다음과 같은 의존 모듈이 존재함을 알 수 있다.
- `spring-boot-starter-parent` : 필요 의존 모듈의 기본 버전 값, 필수 모듈 지정
- `spring-boot-starter-web` : `spring-webmvc`, `jackson` 등 관련 모듈 등록, 기본 구성 설정
- `spring-boot-maven-plugin`: 메이븐 플러그인 추가, 어플리케이션 생성 및 실행
	- 의존성에 지정된 라이브러리가 실행 가능 JAR 파일에 존재하는지 확인
- `spring-boot-devtools` : 코드 변경시 서버, 브라우저 자동 재시작, 템플릿 캐시 자동 비활성, `H2` 콘솔 활성화, 배포 시 자동 제외
```ad-note
title: 자동 재시작 의 원리
JVM 내부에 두개의 클래스로더로 어플을 실행시킴
- 하나는 자주 변경되는 코드, 속성 파일,(`src/main` 내부 파일)을 로드
- 나머지 하나는 무겁지만 자주 변경되지 않는 의존성 라이브러리 로드

변경이 감지되면 첫번째 클래스 로더만 다시 로드하여 어플 컨텍스트 재시작하여 시간을 단축시킴

대신, 의존성 모듈이 바뀌는 것은 재시작 되지않으므로 직접 느리게 재시작해야한다.
```

이후 스프링 부트 내장 톰캣을 사용해 `mvnw spring-boot:run`으로 시작할 수 있다.
#### 부트스트랩 클래스
`프로젝트명Application.java` 파일을 살펴보면 다음과 같다.
```ad-example
title: 스프링 부트 메인 파일
부트스트랩 클래스라고도 하며, JAR 파일이 실행되면 `@SpringBootApplication`을 붙인 클래스의  `SpringApplication.run()` 메서드를 실행하게 된다.
~~~java
package sp5.sp5chapcboot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Sp5ChapcBootApplication {  

    public static void main(String[] args) {
        SpringApplication.run(Sp5ChapcBootApplication.class, args);
    }
}
~~~
```
`@SpringBootApplication`은 다음 세개의 어노테이션을 합친 것이다.
- `@SpringBootConfiguration` : 부트스트랩 클래스를 구성 클래스로 지정
- `@EnableAutoConfiguration` : 스프링 부트 자동 구성 기능 할당
- `@ComponentScan`:  `@Component`, `@Service`, `@Controller` 등을 컴포넌트 검색으로 자동 빈 등록한다.
	- 즉 구성 클래스를 만들어 추가하지 않아도 된다.
#### 설정 프로퍼티
`application.properties` 파일에 설정 정보를 담는다.
DB의 연동 정보나 일부 모듈의 설정 등에 사용된다.
```ad-example
title: `thymeleaf` 템플릿 캐싱 비활성화
아래와 같이 설정하면 파싱 결과를 캐싱하는 템플릿 엔진의 속성을 꺼 개발시 수정 결과를 바로볼 수 있게 해준다.
~~~
spring.thymeleaf.cache=false
// 배포시에는 true로 바꿀 것!
~~~
```

#### 테스트 파일
자세한 것은 [[Spring5-테스트]] 참조
## DB 연동 설정

DB 연동을 쉽게 하고 싶다면 의존 모듈로 다음 두가지를 추가하면 된다. 
- `spring-boot-starter-jdbc` : JDBC 연결에 필요한 datasource, jdbcTemplate, 트랜잭션 관리자 등을 자동 설정
- `mysql-connector-java` : mysql 이용을 위한 드라이버
이후, DB 연결에 필요한 프로퍼티를 다음과 같이 설정하면 된다.
```ad-example
title: `src/main/resources/application.properties`
~~~
spring.datasource.url=jdbc:mysql://localhost/spring5fs?characterEncoding=utf8
spring.datasource.username=spring5
spring.datasource.password=spring5
~~~
```
자동으로 `jdbcTemplate` 클래스를 빈으로 등록해주므로, 직접 `@Autowired`를 이용해 빈 객체를 받아 사용하면 된다.

## 실행 가능한 패키지 생성

실행 가능한 패키지도 다음과 같은 커맨드로 쉽게 만들 수 있다.
```
mvnw package
```

이후 `target` 폴더에 `프로젝트명-0.0.1-SNAPSHOT.jar` 파일이 자동 생성되며, 다음과 같은 커맨드로 실행할 수 있다.
```
java -jar target/프로젝트명-0.0.1-SNAPSHOT.jar
```
이제 내장 톰켓을 이용해 웹 어플리케이션이 구동된다.

## 스프링 부트 CLI
