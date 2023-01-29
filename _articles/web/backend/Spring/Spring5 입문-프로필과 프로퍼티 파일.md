---
title: Spring5 입문-프로필과 프로퍼티 파일
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

# 프로필과 프로퍼티 파일

```ad-quote
title: 출처

_[초보 웹 개발자를 위한 스프링 5 프로그래밍 입문(최범균 저, 가메 출판사)](https://www.kame.co.kr/nkm/detail.php?tcode=306&tbook_jong=3)_의 내용을 바탕으로 정리한 내용입니다.
```
## 프로필
개발과 실제 서비스 간에 DB, 로그, 오류 처리 등의 개발 환경이 달라지게 되며, 이 **각기 다른 개발 환경 설정을 프로필(Profile)**이라고 부른다.

스프링에서는 이러한 다양한 **프로필 별로 태그를 지정하고, 지정한 태그에 따라 프로필 설정을 이용해 스프링 컨테이너를 초기화**할 수 있게 해준다.

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
		
		// 이후 사용할 설정 클래스를 등록해 줘야함. 순서 중요!
		context.register(MemberConfig.class, DsDevConfig.class, DsRealConfig.class);

        //context.register(MemberConfigWithProfile.class);
        context.refresh();
		//...
        context.close();
    }
}
~~~
```
위처럼 `Main` 메서드로 프로필 선택하는것 이외에 추가로 두 가지 방법이 존재한다.
- `spring.profiles.active` 시스템 프로퍼티에 사용할 프로필 값 지정
	- 다수의 경우 콤마로 구분 , 우선순위 중간
	- ex)  `System.setPropery("spring.profiles.active", "dev")`, `java -D spring.profiles.active=dev, real main.Main`
- OS 환경 변수 `spring.profiles.active`에 직접 값 설정
	- 우선순위 가장 낮음
	- ex) `spring.profiles.active = dev, real`

### 다수 프로필 설정 및 프로필 집합 클래스

여러 프로필 클래스를 한 중첩 클래스에 모아둘수 있는데, 이때 프로필 클래스는 무조건 `static` 클래스여야 한다.

또한 아래 예시처럼 하나의 설정에 두 개 이상의 프로필을 주거나 `!`를 이용할 수 있다.
```ad-example
title: 중첩 클래스를 이용한 프로필 설정 클래스
~~~java
//...
@Configuration
@EnableTransactionManagement
public class MemberConfigWithProfile {
	//...
	@Configuration
    @Profile("dev,test") // dev 혹은 test 사용할 때 활성화
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

### 어플리케이션에서 `web.xml`을 이용한 프로필 선택

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
위와 같이 `web.xml`의 `spring.profiles.active` 초기화 파라미터로 프로필을 선택할 수 있다.
## 프로퍼티 파일

스프링은  간단한 설정으로 외부의 프로퍼티 파일을 이용해서 스프링 빈을 설정할 수 있다.
```ad-example
title: `db.properties` 파일
~~~
db.driver=com.mysql.jdbc.Driver
db.url=jdbc:mysql://localhost/spring5fs?characterEncoding=utf8
db.user=spring5
db.password=spring5
~~~
```
다음은 위 같은 프로퍼티 파일을 이용하게 하는 방법을 설명한다.

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

2. `@Value`를 이용한 프로퍼티 값 전달
이후 설정 클래스에서 `@Value("${프로퍼티파일명.값}")`으로 값을 지정해준다.
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

