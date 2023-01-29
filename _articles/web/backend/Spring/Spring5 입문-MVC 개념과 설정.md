---
title: Spring5 입문-MVC 개념과 설정
date: 2023-01-20 09:15:29 +0900
tags: HIDE CRUDE 
layout: obsidian
is_Finished: false
last_Reviewed: 2023-01-20 09:15:29 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# MVC 개념과 설정

```ad-quote
title: 출처

_[초보 웹 개발자를 위한 스프링 5 프로그래밍 입문(최범균 저, 가메 출판사)](https://www.kame.co.kr/nkm/detail.php?tcode=306&tbook_jong=3)_의 내용을 바탕으로 정리한 내용입니다.
```

## MVC 프로젝트 생성

스프링 MVC 프레임워크를 이용하기 위해서는 기존 프로젝트 생성에서 다음과 같은 점이 다르다.
- **파일 구조** : `/webapp/` 폴더 내부에 HTML, CSS, JS, JSP 등 웹 앱을 위한 코드가 위치하게 된다.
	- `src/main/webapp/WEB-INF` 폴더 생성 :  원래 서블릿에서 필요한 라이브러리와 모듈이 위치하지만 의존 관리 툴을 이용한다면 자동으로 빌드시 처리해준다.
	- `src/main/webapp/WEB-INF/view` 폴더 : 내부에 페이지 뷰 부분을 생성할 `.jsp` 파일들이 위치하게 된다.
	- `src/main/webapp/WEB-INF/web.xml` 파일 : 웹 요청 처리를 위한 서블릿 설정 아래 참조
```ad-example
title: `web.xml` 예시
collapse: close
사용할 서블릿 클랫, 설정 클래스 위치, 인코딩 설정 및 초기값 설정 등에 사용됨.
~~~xml
<?xml version="1.0" encoding="UTF-8"?>
<!-- 웹 요청 처리를 하는 servelet 등록 -->
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
             http://xmlns.jcp.org/xml/ns/javaee/web-app_3_1.xsd"
    version="3.1">
  
    <servlet>
        <servlet-name>dispatcher</servlet-name> <!--dispatcher명 등록-->
        <servlet-class><!--DispatcherServlet 등록-->
            org.springframework.web.servlet.DispatcherServlet
        </servlet-class>
        <init-param>
            <param-name>contextClass</param-name>
            <param-value>
                org.springframework.web.context.support.AnnotationConfigWebApplicationContext
            </param-value><!--설정을 자바 클래스를 통해 함을 의미-->
        </init-param>
        <init-param>
            <param-name>contextConfigLocation</param-name>
            <param-value><!--스프링 컨테이너 초기화에 이용할 설정 파일 정해주기-->
                config.MvcConfig
                config.ControllerConfig
            </param-value>
        </init-param>
        <load-on-startup>1</load-on-startup> <!--톰켓 컨테이너 구동 시 이 서블릿 함께 시작 true-->
    </servlet>
    <servlet-mapping><!--모든 요청을 기본적으로 이 서블릿이 처리하도록 매핑("/")-->
        <servlet-name>dispatcher</servlet-name>
        <url-pattern>/</url-pattern>
    </servlet-mapping>
      <filter><!--인코딩 설정-->
        <filter-name>encodingFilter</filter-name>
        <filter-class>
            org.springframework.web.filter.CharacterEncodingFilter
        </filter-class>
        <init-param>
            <param-name>encoding</param-name>
            <param-value>UTF-8</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>encodingFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
</web-app>
~~~
```
- **의존 관리 툴 설정 및 의존 모듈**(`pom.xml || build.gradle`)
	- `war` 패키지 사용 설정 : 서블릿/JSP를 이용한 웹 어플리케이션 개발 시 필요한 패키징 형식
	- `javax.servlet-api` 혹은 `jakarta.servlet-api` : 서블릿을 이용하기 위한 모듈, 톰캣 버전에 따라 택일
		- 서블릿? : 웹 서버 내부에 요청을 받고 동적으로 응답해주는 자바 컴포넌트
	- `javax.servlet.jsp-api` :  jsp를 사용하기 위한 모듈
		- JSP? : HTML 코드 내부에 자바 코드를 이용해 동적 웹 페이지를 생성하는 웹 앱 도구
	- `jstl` : JSP 내부의 탬플릿 언어를 더 읽기 쉬운 JSTL로 바꿈
	- `spring-webmvc` : MVC 프레임워크 웹 개발을 위한 모듈
```ad-example
title: `pom.xml` 예시
collapse: close
~~~xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
        http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>sp5</groupId>
    <artifactId>sp5-chap09</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <packaging>war</packaging>
    <dependencies>
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>3.1.0</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>javax.servlet.jsp</groupId>
            <artifactId>javax.servlet.jsp-api</artifactId>
            <version>2.3.2-b02</version>
            <scope>provided</scope>
        </dependency>
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>jstl</artifactId>
            <version>1.2</version>
        </dependency>
        <dependency>
            <groupId>org.springframework</groupId>
            <artifactId>spring-webmvc</artifactId>
            <version>5.0.2.RELEASE</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.7.0</version>
                <configuration>
                    <source>1.8</source>
                    <target>1.8</target>
                    <encoding>utf-8</encoding>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
~~~
```
```ad-example
title: `build.gradle` 예시
collapse: close
~~~gradle
apply plugin: 'java'
apply plugin: 'war'
sourceCompatibility = 17.0 // 현재 프로젝트 자바 버전
targetCompatibility = 17.0 // 디플로이 시 자바 버전
compileJava.options.encoding = "UTF-8"
repositories {
	mavenCentral()
}
dependencies {
	providedCompile 'jakarta.servlet:jakarta.servlet-api:6.0.0'
	// providedCompile 'javax.servlet:javax.servlet-api:3.1.0'
	providedRuntime 'javax.servlet.jsp:javax.servlet.jsp-api:2.3.3'
	implementation 'javax.servlet:jstl:1.2'
	implementation 'org.springframework:spring-webmvc:6.0.4'
}
wrapper {
	gradleVersion = '7.6'
}
~~~
```

- **이클립스 톰캣 설정**
	- [tomcat](https://tomcat.apache.org/) 웹서버 설치 및 이클립스 적용
		- 책에서는 8.0~9.0 버전을 추천하고 8.5 버전을 이용했지만, 난 10.0 버전을 사용함
		- `Window->Preferences->Server->Runtime Environment` 에서 `Add` 버튼으로 `Apache tomcat`의 설치 폴더를 지정해주면 된다.

## MVC 패턴
MVC(Model-View-Controller) 패턴은 **요청에 따라 컨트롤러가 사용자가 보는 뷰와 데이터가 담긴 모델을 조작하여 웹 서비스를 구성하는 방법**이다.

스프링의 MVC 패턴은 아래 그림과 구성 요소로 이루어진다.
```ad-note
title: 스프링의 MVC 패턴
검정색은 필수적으로 개발자가 구현해야 하는 컴포넌트, 나머지는 선택적으로 구현할 수 있는 컴포넌트이다.
`<<spring bean>>`은 빈 객체로 생성되는 컴포넌트이다.
![[image-20230120153554064.png|500]]
```
`DispatcherServlet` 을 중심으로 `HandlerMapping, HandlerAdapter, 컨트롤러, ViewResolver, View, JSP`가 각자 역할을 수행해서 클라이언트 요청을 처리하는 구조이다.
### 요청 과정 예시

**1. 요청 전송 과정**
클라이언트 브라우저 측에서 서버 측에 `/프로젝트명/hello?name=rv` URL로 `Get` 요청을 보내는 것을 가정하겠다.
이를 앞선 `web.xml` 설정에 따라 생성된 `DispatcherServlet`가 받아들인다.
```ad-note
title: `DispatcherServlet`
- 위 그림의 중앙에 위치한 `DispatcherServlet`은 MVC 구성요소의 핵심 요소로, **다른 컴포넌트 간의 요청을 받아 넘겨주는 중앙 창구 역할**을 한다.
- 추가로, `DispatcherServlet`은 **스프링 컨테이너를 생성**하고, 해당 스프링 컨테이너는 `web.xml` 설정에 따른 `HandlerMapping`, `HandlerAdapter`, 컨트롤러 빈, `ViewResolver` 빈 객체를 생성한다. 

앞으로도 자주 나올 것이다.
```

**2. 요청 URL과 매칭되는 컨트롤러 검색**
`DispatcherServlet`는 해당 요청을 처리하는 컨트롤러를 직접 구하지 않고, `HandlerMapping` 이라는 빈 객체에게 컨트롤러를 알아오도록 시킨다.

`HandlerMapping`은 `/hello` 경로로 등록된 컨트롤러 빈을 알아와 `DispatcherServlet`에게 리턴한다.
- 등록되지 않은 경로의 처리는 [[#기본 핸들러와 HandlerMapping 우선 순위]] 참조
```ad-example
title: 컨트롤러 구현 예시(`main/java/chap09/HelloController.java`)
~~~java
package chap09;
// 클라리언트 요청 처리용 컨트롤러 파일
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller // 스프링 MVC 컨트롤러 클래스로 설정
public class HelloController {
	@GetMapping("/hello") // 메서드가 처리할 요청 경로 지정, Get 요청 한정
	public String hello(Model model, // 처리 결과를 뷰에 전달시 사용
			@RequestParam(value = "name", required = false) String name) { // HTTP 요청 파라미터 값 변환
		model.addAttribute("greeting", "안녕하세요, " + name);//모델의 greeting 속성값을 설정
		return "hello"; //처리 결과 뷰를 설정
	}
}
~~~
```
- `@GetMapping`에 적힌 내용에 따라 `HandlerMapping`이 검색 가능하다.
- 위 컨트롤러는 결과값으로 처리에 필요한 뷰 이름을 문자열로 돌려주고, 입력받은 `Model` 객체에 `greeting` 속성 값을 저장한다.
- 위 컨트롤러를 `ModelAndView`로 변환하는 것은 `HandlerAdapter`가 처리해야 한다.

```ad-example
title: 컨트롤러 등록(`main/java/config/ControllerConfig.java`)
~~~java
package config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import chap09.HelloController;
@Configuration
public class ControllerConfig {
	@Bean // 컨트롤러 등록
	public HelloController helloController() {
		return new HelloController();
	}
}
~~~
```


**3. 처리 요청 ~ 6. 컨트롤러 실행 결과 `ModelAndView`로 변환 리턴**
`DispatcherServlet`는 받은 컨트롤러를 직접 실행하지 않고, `HandlerAdapter` 이라는 빈 객체에게 요청 처리를 위임한다.
`HandlerAdapter`는 컨트롤러에 맞는 메서드를 요청에 처리하고, `ModelAndView` 객체로 변환해 돌려준다.

```ad-seealso
title: `DispatcherServlet`가 직접 컨트롤러를 검색하고, 직접 컨트롤러를 실행하지 않는 이유

`DispatcherServlet`은 컨트롤러의 요청 처리 결과로 `ModelAndView` 타입만 받는다.
하지만 **컨트롤러는 구현에 따라 여러 클래스로 존재**하므로, 실행한 결과가 모두 `ModelAndView`가 아니다.
따라서 이를 하나의 `ModelAndView`로 변환해줄 각기 다른 종류의`HandlerAdapter`가 필요하다.

- 마찬가지로 각기 다른 컨트롤러 종류를 검색하기 위해 각기 다른 종류의 `HandleMapping`이 필요하다.

따라서, 만약 여러 클래스의 컨트롤러가 존재한다면 해당 타입 컨트롤러를 처리해줄 `HandlerAdapter`와 `HandleMapping`을 직접 스프링 빈으로 등록해야 한다.
```

```ad-seealso
title: 각기 다른 클래스 컨트롤러의 예시
collapse: closed
다양한 컨트롤러의 예시로 `@Controller` 어노테이션 사용, 이전 버전에 사용하던 `Controller` 인터페이스, `HttpRequestHandler` 인터페이스 구현, 직접 구현한 커스텀 컨트롤러 등이 있다.

```

**7.  컨트롤러의 실행 결과를 보여줄 View 검색**
`DispatcherServlet`는 해당 `ModelAndView`를 응답으로 생성할 `View` 객체를 직접 구하지 않고, `ViewResolver` 이라는 빈 객체에게 `View`를 알아오도록 시킨다.

`ModelAndView` 내에는 처리에 필요한 `View` 객체 이름이 담겨져 있고, 이를 이용해 `ViewResolver`는 해당 `View` 객체를 찾거나 생성한 뒤 `DispatcherServlet`에게 돌려준다. (JSP의 경우는 언제나 새로운 `View` 객체를 생성 !빈 객체 아님)

```ad-example
title: ViewResolver 설정 예시 (`main/java/config/MvcConfig.java`)
~~~java
package config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ViewResolverRegistry;

@Configuration
@EnableWebMvc // 스프링 MVC 설정 클래스로 활성화
public class MvcConfig implements WebMvcConfigurer {
	// ...
	// JSP를 이용해 컨트롤러의 실행 결과 보여주는 설정
	@Override
	public void configureViewResolvers(ViewResolverRegistry registry) {
		registry.jsp("/WEB-INF/view/", ".jsp");
	}
}
~~~
```
- `configureViewResolvers` 메소드에서 `registry.jsp` 함수를 이용해 경로에 존재하는 모든 `.jsp` 파일을 뷰로 등록한다.

**8. `View` 객체에게 응답 생성 요청**
`DispatcherServlet`가 `View` 객체에게 응답 결과 생성을 요청하면 `View`가 JSP를 실행하여 응답 결과를 생성한다.

```ad-example
title: view.jsp 예시 (`main/webapp/WEB-INF/view/hello.jsp`)

~~~jsp
<%@ page contentType="text/html; charset=utf-8" %>
<!DOCTYPE html>
<html>
	<head>
		<title>Hello</title>
	</head>
	<body>
		인사말: ${greeting} <!--controller에서 지정한 greeting 출력-->
	</body>
</html>
~~~
```
- 사용된 `${greeting}`은 앞서 컨트롤러가 모델에 주입한다.
- 위 JSP 결과물 페이지가 응답 메시지에 담긴다.

## 기본 핸들러와 HandlerMapping 우선 순위

앞서 컨트롤러의 `@***Mapping`설정에 따라 컨트롤러와 뷰가 검색되도록 하였다. 그렇다면 view를 사용하지 않는 정적 파일 url 같은 경우 어떻게 처리해야 할까?

이를 처리하기 위해 view를 사용하지 않는 **컨트롤러를 직접 구현하거나 아래 예시처럼 기본값 핸들러를 지정**해줄 수 있다.
- 이를 지정해주지 않으면 404 에러 페이지가 뜬다.
```ad-example
title: ViewResolver 설정 예시 (`main/java/config/MvcConfig.java`)
~~~java
package config;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ViewResolverRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc // 스프링 MVC 설정 클래스로 활성화
public class MvcConfig implements WebMvcConfigurer {
	@Override // WebMvcConfigurer 인터페이스의 이 메소드를 재정의하면 기본값 핸들러 사용 가능
	public void configureDefaultServletHandling( // "/" 매핑 설정, ViewResolver 설정 안된 주소에 대한 기본 설정
		DefaultServletHandlerConfigurer configurer) {
		configurer.enable(); 
	}
	// JSP를 이용해 컨트롤러의 실행 결과 보여주는 설정
	@Override // WebMvcConfigurer 인터페이스의 이 메소드를 재정의하면 뷰 관련 설정 가능
	public void configureViewResolvers(ViewResolverRegistry registry) {
		registry.jsp("/WEB-INF/view/", ".jsp");
	}
}
~~~
```
- `DefaultServletHandlerConfigurer.enable();`를 통해 `DefaultServletHttpRequestHandler`와 `SimpleUrlHandlerMapping` 빈이 추가된다.
- `DefaultServletHttpRequestHandler`: 클라이언트의 요청을 WAS가 제공하는 디폴트 서블릿에 전달
- `SimpleUrlHandlerMapping`:  설정된 경로를 특정 서블릿에게 처리하게 가능

 `DefaultServletHandlerConfigurer.enable();`로 적용된 `SimpleUrlHandlerMapping`은 **우선순위가 아주 낮아**,  설정 경로가 겹치는 경우, 우리가 커스텀으로 설정한 (보통 `RequestMappingHandlerMapping`) 핸들러가 먼저 처리하게 된다.

하지만 아무런 경로가 겹치지 않는다면 `DefaultServletHttpRequestHandler`가 실행될 것이다.
- ex) "`/index.html`" 경로의 경우 컨트롤러가 등록되어 있지 않으므로 WAS 서버에서 처리


## MVC 설정 클래스
MVC 패턴을 위한 설정 클래스는 `WebMvcConfigurer` 인터페이스를 상속받아야 한다.
```ad-seealso
title: 참고로 스프링 4.x 버전 이하는 자바가 인터페이스의 디폴트 메서드 기능이 없었으므로, 대신 `WebMvcConfigurerAdpater` 클래스를 상속해서 필요한 메서드만 재정의했다. 
```

해당 인터페이스는 `configureDefaultServletHandling`, `configureViewResolvers`를 포함해, `configurePathMatch`, `addFormatters` 등의 MVC 패턴 설정 관련 주요 메서드를 정의하고 있다.
추가로 `@EnableWebMvc`를 잉요하면 자동으로 MVC 설정에 필요한 빈을 생성해 준다.


`@EnableWebMvc`를 사용하지않고 모두 직접 설정한다면 아래와 같이 구현할 수 있다.

```ad-example
title: `@EnableWebMvc`를 사용하지 않은 config 클래스
~~~java
package config;

import java.util.HashMap;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.HttpRequestHandler;
import org.springframework.web.servlet.HandlerAdapter;
import org.springframework.web.servlet.HandlerMapping;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.ViewResolverRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.handler.SimpleUrlHandlerMapping;
import org.springframework.web.servlet.mvc.HttpRequestHandlerAdapter;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;
import org.springframework.web.servlet.resource.DefaultServletHttpRequestHandler;
import org.springframework.web.servlet.view.InternalResourceViewResolver;  

@Configuration
public class MvcConfig2 implements WebMvcConfigurer {

    @Bean // @Controller 객체 처리용 handlerMapping
    public HandlerMapping handlerMapping() {
        RequestMappingHandlerMapping hm = new RequestMappingHandlerMapping();
        hm.setOrder(0);
        return hm;
    }
  
    @Bean // @Controller 객체 처리용 handlerAdapter
    public HandlerAdapter handlerAdapter(){
        RequestMappingHandlerAdapter ha = new RequestMappingHandlerAdapter();
        return ha;
    }

    @Bean // 기본값 핸들러 경로 설정(모두)
    public HandlerMapping simpleHandlerMapping() {
        SimpleUrlHandlerMapping hm = new SimpleUrlHandlerMapping();
        Map<String, Object> pathMap = new HashMap<>();
        pathMap.put("/**", defaultServletHandler());
        hm.setUrlMap(pathMap);
        return hm;
    }

    @Bean // 기본값 핸들러
    public HttpRequestHandler defaultServletHandler(){
        DefaultServletHttpRequestHandler handler = new DefaultServletHttpRequestHandler();
        return handler;
    }
    
    @Bean
    public HandlerAdapter requestHandlerAdapter() {
        HttpRequestHandlerAdapter ha = new HttpRequestHandlerAdapter();
        return ha;
    }

    @Bean
    public ViewResolver ViewResolver() {
        InternalResourceViewResolver vr = new InternalResourceViewResolver();
        vr.setPrefix("/WEB-INF/view/");
        vr.setSuffix(".jsp");
        return vr;
    }
    // InternalResourceViewResolver : prefix + 뷰이름 + suffix를 조합하는 경로의 jsp 파일을 사용하는 view 객체 리턴
}
~~~
```
더욱 불편하고 잘안쓰이는 방식이지만, 기본 설정을 알아볼 수 있으므로 눈여겨 보는게 좋다.



