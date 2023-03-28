---
title: Spring5-구성 속성
date: 2023-01-29 14:59:06 +0900
tags: HIDE CRUDE 
layout: obsidian
is_Finished: false
last_Reviewed: 2023-01-29 14:59:06 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# 구성 속성
```ad-quote
title: 출처

_[초보 웹 개발자를 위한 스프링 5 프로그래밍 입문](https://www.kame.co.kr/nkm/detail.php?tcode=306&tbook_jong=3)_와 [스프링 인 액션](https://jpub.tistory.com/1040)의 내용을 바탕으로 정리한 내용입니다.
```

## 속성

스프링에는 두 가지 구성이 필요하다.
- 빈을 생성하고 컴포넌트 등에 상호 주입되는 방법을 선언하는 **빈 연결(Bean wiring)**
- 스프링 애플리케이션 컨텍스트 내부의 빈의 속성값을 정하는 **속성 주입(Property injection)**
스프링 부트를 이용한다면 이 둘을 상당량 대신 해주지만, 기본 설정을 바꾸고 싶다면 구성 속성을 사용하는 방법을 알아야 한다.

- **스프링 환경 추상화(environment abstraction)**
속성의 근원은 운영체제 환경 변수, 애플리케이션 내의 속성 구성 파일, 명령행 인자, JVM 시스템 속성 등 다양하지만, 이를 스프링이 한대 모아 빈들이 사용할 수 있게 한다.

예를 들어 포트를 지정하는 방법은 다음과 같은 근원들로 가능하다.
- `src/main/resources/application.properties`에서 `server.port=9090`
- `application.yml`에서 지정
- `java -jar tacocloud-0.0.5-SNAPSHOT.jar --server.port=9090`
- `export SERVER_PORT=9090` 운영체제 환경변수

## 프로퍼티 파일
### 프로퍼티 파일 생성 및 위치
스프링은  간단한 설정으로 외부의 프로퍼티 파일을 이용해서 스프링 빈을 설정할 수 있다.
```ad-example
title: `db.properties` 파일
`${}`를 이용하면 다른 프로퍼티의 값을 가져올 수 있다.
~~~properties
db.driver=com.mysql.jdbc.Driver
db.url=jdbc:mysql://localhost/spring5fs?characterEncoding=utf8
db.user=spring5
db.password=${db.user}
~~~
```
다음은 위 같은 프로퍼티 파일을 이용하게 하는 방법을 설명한다.

```ad-note
title: 스프링 부트의 경우, 자동 구성을 사용하므로 위 파일을 `src/main/resources` 폴더에 위치시키면 끝이다.
```

1. **`PropertySourcesPlaceholderConfigurer` 정적 빈 클래스 등록**
```ad-warning
title: `PropertySourcesPlaceholderConfigurer` 빈은 무조건 `static` 클래스여야 한다.
```
```ad-example
title: `src/main/java/config/PropertyConfig.java`
~~~java
package config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.io.ClassPathResource;

@Configuration
public class PropertyConfig {

    @Bean
    public static PropertySourcesPlaceholderConfigurer properties() {
        PropertySourcesPlaceholderConfigurer configurer = new PropertySourcesPlaceholderConfigurer();
        configurer.setLocations(// 프로퍼티 파일 목록 전달
                new ClassPathResource("db.properties"),// 클래스 패스에 위치한 프로퍼티 파일 
                new FileSytstemResources("../info.properties") // 파일 시스템 특정 패스에 위치한 프로퍼티 파일
                );
        return configurer;
    }
}
~~~
```

### 프로퍼티 값 전달
#### `@Value`를 이용한 프로퍼티 값 전달
이후 구성 클래스에서 `@Value("${프로퍼티파일명.값}")`으로 값을 지정해준다.
```ad-example
title: `@Value`를 이용한 프로퍼티 값 전달
~~~java
package config;
import org.apache.tomcat.jdbc.pool.DataSource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration; 

@Configuration
public class DsConfigWithProp {
    @Value("${db.driver}")
    private String driver;

    @Value("${db.url}")
    private String jdbcUrl;

    @Value("${db.user}")
    private String user;

    @Value("${db.password}")
    private String password;

    @Bean(destroyMethod = "close")
    public DataSource dataSource() {
        DataSource ds = new DataSource();
        ds.setDriverClassName(driver);
        ds.setUrl(jdbcUrl);
        ds.setUsername(user);
        ds.setPassword(password);
        return ds;
    }
}
~~~
```

뿐만 아니라 다른 빈 클래스에도 빈 생성시 값을 지정해줄 수 있다.
```ad-example
title: `@Value` 어노테이션 빈 클래스 사용례
~~~java
package spring;

import org.springframework.beans.factory.annotation.Value;

public class Info {
    @Value("${info.version}")
    private String version; // 빈 클래스의 version이 자동으로 info.version 값으로 생성
    private String author;

    public void printInfo() {
        System.out.println("version = " + version);
    } 

    public void setVersion(String version) {
        this.version = version;
    }
    
    @Value("${info.author}")
	public void setAuthor(String author) { // setter 메서드에도 붙여서 사용 가능
		this.author = author;
	}
}
~~~
```

#### `@ConfigurationProperties`를 이용한 프로퍼티 값 전달
스프링 부트를 이용할 경우 `@ConfigurationProperties`를 이용할 수 있다.

이 어노테이션은 해당 빈의 속성을 프로퍼티에서 가져오게 한다.

프로퍼티 파일에 `taco.orders.pageSize: 10`이거나 운영체제 `export TACO_ORDERS_PAGESIZE=10`으로 값을 설정했다고 가정하자.

다음과 같이 컨트롤러를 작성하면 된다.
```ad-example
title: 페이지 사이즈 만큼 넘기기

~~~java
//...
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.data.domain.Pageable;
//...
@Controller// 컨트롤러 빈 설정
@RequestMapping("/orders")
@SessionAttributes("order")
// 해당 빈의 속성을 프로퍼티에서 가져오게 하는 어노테이션
@ConfigurationProperties(prefix="taco.orders") // taco.orders의 값들 가져오기
public class OrderController {
	private int pageSize = 20; // taco.orders.pageSize=10으로 오버라이딩 됨

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	//...

	@GetMapping
	public String ordersForUser(
	@AuthenticationPrincipal User user, Model mode) {
		Pageable pageable = PageRequest.of(0, pageSize);
		model.addAttributes("orders",
			orederRepo.findByUserOrderByPlacedAtDesc(user, pageable));
		return "orderList";
	}
}
~~~
```

위의 경우 보다는 주로 구성 데이터 홀더를 의미하는 `Props`를 붙인 새로운 컴포넌트 빈으로 생성하여 해당 값을 이용하는 방식으로 사용된다.

```ad-example
title: 구성 속성 홀더 정의
속성의 검증이 가능하고, 관심사를 분리한 `OrderProps` 속성 홀더
~~~java
package tacos.web;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import org.springframework.validation.annotation.Validated;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import lombok.Data; 

@Component
@ConfigurationProperties(prefix="taco.orders")
@Data
@Validated
public class OrderProps {
    @Min(value=5, message="must be between 5 and 25")
    @Max(value=25, message="must be between 5 and 25")
    private int pageSize = 20;
}
~~~
```
이를 아래와 같이 사용할 수 있다.

```ad-example
title: `OrderController` 코드 변경
~~~java
//...
@Slf4j
@Controller
@RequestMapping("/orders")
@SessionAttributes("order")
public class OrderController {
    private OrderProps props;
    private OrderRepository orderRepo;  

    public OrderController(OrderRepository orderRepo, OrderProps props) {
        this.orderRepo = orderRepo;
        this.props = props;
    }
    //...
    @GetMapping
    public String ordersForUser(
            @AuthenticationPrincipal User user, Model model) {
        Pageable pageable = PageRequest.of(0, props.getPageSize());
        model.addAttribute("orders",
                orderRepo.findByUserOrderByPlacedAtDesc(user, pageable));
        return "orderList";
    }
}
~~~
```



### 프로퍼티 구성 예시

#### 데이터 소스 프로퍼티 파일
데이터소스를 직접 코드하여 구성하는 것보다 스프링 부트를 이용하면 아래 처럼 프로퍼티 파일을 구성할 수 있다.
```ad-example
title: `application.yml` 파일 예시
~~~yaml
spring:
	datasource:
		url: jdbc:mysql://localhost/tacocloud
		usernmae: tacodb
		password: tacopassword
		driver-class-name: com.mysql.jdbcDriver # 스프링 부트 이외에 자동 JDBC 클래스 지정이 안될 경우 추가
		
		schema: # schema.sql, data.sql 이외의 추가 sql 실행시킬 시 이용
			- order-schema.sql 
			- ingredient-schemal.sql
		data:
			- ingredients.sql
		jndi-name: java:/comp/env/jdbc/tacoCloudDS # jndi를 이용한 구성, 이용할 경우 앞에 값들이 전부 무시됨
~~~
```
커넥션 풀의 경우도 HikariCP, Commons DBCP 2 같은 기본 값이 싫으면 프로퍼티 파일에 지정해줄 수도 있다.
JNDI는 [공식 문서](https://docs.oracle.com/javase/tutorial/jndi/overview/index.html) 참조
#### 내장 서버

서버의 HTTPS 요청 처리를 위한 컨테이너 관련 설정을 예시로 보자.
```bash
keytool -keystore mykeys.jks -genkey -alias tomcat -keyalg RSA
```
1. 먼저 키 관리를 위해 JDK의 `keytool` 유틸리티로 키스토어를 생성하자.
- 이때 암호, 저장 위치 등을 입력해야 한다.
2. 다음과 같이 서블릿 컨테이너 설정을 해주자.
```yml
server:
	port: 0 # 보통, 8443, 포트를 0으로 하면 사용 가능한 포트를 무작위로 가져옴
	ssl:
		key-store: file:///path/to/mykeys.jks # JAR 파일의 경우 classpath:로 URL 참조
		key-store-password: 이전에_지정했던_암호
		key-password: 이전에_지정했던_암호
```

#### 로깅
기본적으로 스프링 부트에서 제공되는 Logback 로깅 구성을 위해 `logback.xml` 파일을 이용할 수 있지만, 다음과 같이 프로퍼티 파일로도 구성할 수 있다.

```yml
logging:
	path: /var/logs/
	file: TacoCloud.log # 로그를 저장하고 싶다면 이처럼 경로와 파일명을 지정
	level: # 로깅 수준을 설정하기 위한 로거 별로 다른 수준으로 설정하게 해줌
		root: WARN # root는 WARN
		org.springframework: # .을 이용해 한줄로 표현도 가능
				security: DEBUG # Spring Security 로거는 DEBUG
```
기본적인 로그 파일 크기는 10MB이며, 넘으면 새로운 로그 파일을 생성한다.

### 구성 속성 메타데이터 선언
구성 속성을 이용하면 IDE에서는 이를 인식하지 못하여 오류가 나거나 값을 바로 확인할 수 없는 경우가 있으므로, 이를 해결하기 위해 메타데이터를 만들어보자.

1. 스프링 부트의 의존 모듈에 `org.springframework.boot.spring-boot-configuration-processor`를 추가

2. `src/main/resources/META-INF/additional-spring-configuration-metadata.json` 파일 생성

3. 아래와 같이 파일 내용 추가
```ad-example
title: `additional-spring-configuration-metadata.json` 파일
대문자와 `-` + 소문자는 속성 명칭에서 같은 취급한다.
ex) `pageSize` == `page-size`
~~~json
{
	"properties": [
		{
			"name": "taco.orders.page-size",
			"type": "int",
			"description": "Sets the maximum number of orders to display in a list."
		}
	]
}
~~~
```

이제 내 커스텀 속성 명칭만큼 메타데이터를 추가하면 IDE에서 정상적으로 보인다.


## 프로필
개발과 실제 서비스 간에 DB, 로그, 오류 처리 등의 개발 환경이 달라지게 되며, 이 **각기 다른 개발 환경 설정을 프로필(Profile)**이라고 부른다.

스프링에서는 이러한 다양한 **프로필 별로 태그를 지정하고, 지정한 태그에 따라 프로필 설정을 이용해 스프링 컨테이너를 초기화**할 수 있게 해준다.

일부 배포용 클라우드 에서는 특정 프로파일명을 강제하는 경우가 있다.
- 클라우드 파운드리에서는 `cloud`라는 이름의 배포용 프로필을 만들어야 한다.

### 프로필에 따른 구성 클래스 생성

#### `@Profile` 어노테이션 사용

```ad-example
title: 프로필의 생성 `src/main/java/confi/DsDevConfig.java`
~~~java
package config;

import org.apache.tomcat.jdbc.pool.DataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile; 

@Configuration
@Profile("dev")
public class DsDevConfig {  

    @Bean(destroyMethod = "close")
    public DataSource dataSource() {
        DataSource ds = new DataSource();
        ds.setDriverClassName("com.mysql.jdbc.Driver");
        ds.setUrl("jdbc:mysql://localhost/spring5fs?characterEncoding=utf8");
        ds.setUsername("spring5");
        ds.setPassword("spring5");
		// ...
        return ds;
    }
}
~~~
```

#### 프로필 별 프로퍼티 파일 생성
`application-{프로필명}.yml` 혹은 `application-{프로필명}.properties`라는 명칭을 통해 특정 상황에만 사용 가능한 프로퍼티 파일을 만들 수 있다.

또는 아래와 같이 프론트매터(`---`)로 나누어 공통 속성을 지정하고, `spring.profiles` 값을 통해 프로필명을 나눌 수 있다.
```ad-example
title: `application.yml` 파일
~~~yml
logging:
	level:
		tacos: DEBUG # 공통된 모든 프로필의 기본 값
--- # 새로운 프로필 시작
spring:
	profiles: prod # 프로필명 지정
	datasource:
		url: jdbc:mysql://localhost/tacocloud
		username: tacouser
		password: tacopassword

logging:
	level:
		tacos: WARN # 기본값 덮어쓰기
---
spring:
	profiles: dev # 새로운 프로필 시작
	datasource:
		url: jdbc:mysql://localhost/tacocloud
		username: tacouser
		password: tacopassword
~~~
```


### 프로필 선택

#### 내부 코드 방법
```ad-example
title: 설정한 프로필의 사용 `src/main/java/main/MainProfile.java`
~~~java
package main; 
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
//...
public class MainProfile {
    public static void main(String[] args) {
        AnnotationConfigApplicationContext context = new AnnotationConfigApplicationContext();
		// getEnvironment: 프로필 탐색
		// setActiveProfiles: 프로필 선택
		context.getEnvironment().setActiveProfiles("dev"); //("dev", "real"); 여러개의 프로필 선택 가능
		
		// 이후 사용할 구성 클래스를 등록해 줘야함. 순서 중요!
		context.register(MemberConfig.class, DsDevConfig.class, DsRealConfig.class);

        //context.register(MemberConfigWithProfile.class);
        context.refresh();
		//...
        context.close();
    }
}
~~~
```
위처럼 `Main` 메서드로 프로필 선택하는것 이외에 추가로 세 가지 방법이 존재한다.
- `spring.profiles.active` 시스템 프로퍼티에 사용할 프로필 값 지정
	- 다수의 경우 콤마로 구분 , 우선순위 중간
	- ex)  `System.setPropery("spring.profiles.active", "dev")`,  `java -D spring.profiles.active=dev, real main.Main`
- OS 환경 변수 `spring.profiles.active`에 직접 값 설정
	- 우선순위 가장 낮음
	- ex) `spring.profiles.active = dev, real`
-  `application.yml` 파일 내에 `spring.profiles.active=prod` 같이 값 지정
	- 보통 사용하지 않음

#### `web.xml` 이용
혹은 아래와 같이 `web.xml`의 `spring.profiles.active` 초기화 파라미터로 프로필을 선택할 수 있다.
```xml
<!--...-->
<servlet>
        <servlet-name>dispatcher</servlet-name>
        <servlet-class>
            org.springframework.web.servlet.DispatcherServlet
        </servlet-class>
        <init-param>
            <param-name>spring.profiles.active</param-name>
            <param-value>dev</param-value>
        </init-param>
        <init-param>
            <param-name>contextClass</param-name>
            <param-value>
org.springframework.web.context.support.AnnotationConfigWebApplicationContext
            </param-value>
        </init-param>
<!--...-->
```


### 다수 프로필 설정 및 프로필 집합 클래스

여러 프로필 클래스를 한 중첩 클래스에 모아둘수 있는데, 이때 프로필 클래스는 무조건 `static` 클래스여야 한다.

또한 아래 예시처럼 하나의 설정에 두 개 이상의 프로필을 주거나 `!`를 이용할 수 있다.
```ad-example
title: 중첩 클래스를 이용한 프로필 구성 클래스
~~~java
//...
@Configuration
@EnableTransactionManagement
public class MemberConfigWithProfile {
	//...
	@Configuration
    @Profile("dev, test") // dev && test 사용 시 활성화
    // {"dev", "test"} : dev || test 사용시 활성화
    public static class DsDevConfig {
		@Bean(destroyMethod = "close")
        public DataSource dataSource() {
            DataSource ds = new DataSource();
            ds.setDriverClassName("com.mysql.jdbc.Driver");
            ds.setUrl("jdbc:mysql://localhost/spring5fs?characterEncoding=utf8");
            return ds;
        }
    }
  
    @Configuration
    @Profile("!real") // real을 사용하지 않을때 활성화
    public static class DsRealConfig {
        @Bean(destroyMethod = "close")
        public DataSource dataSource() {
            DataSource ds = new DataSource();
            ds.setDriverClassName("com.mysql.jdbc.Driver");
            ds.setUrl("jdbc:mysql://realdb/spring5fs?characterEncoding=utf8");
            ds.setUsername("spring5");
            ds.setPassword("spring5");
            return ds;
        }
    }
}
~~~
```
