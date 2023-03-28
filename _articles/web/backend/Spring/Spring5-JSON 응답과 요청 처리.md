---
title: Spring5-JSON 응답과 요청 처리
date: 2023-01-29 14:57:33 +0900
tags: WEB SPRING BE SUMMARY HIDE
layout: obsidian
is_Finished: false
last_Reviewed: 2023-01-29 14:57:33 +0900
use_Mathjax: true
---
```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```
# JSON 응답과 요청 처리
```ad-quote
title: 출처

_[초보 웹 개발자를 위한 스프링 5 프로그래밍 입문](https://www.kame.co.kr/nkm/detail.php?tcode=306&tbook_jong=3)_와 [스프링 인 액션](https://jpub.tistory.com/1040)의 내용을 바탕으로 정리한 내용입니다.
```

Ajax를 이용해 서버 API를 호출하여 JSON이나 XML 데이터를 이용해 뷰나 프론트엔드를 구축하는 구조가 흔하므로, 이러한 방식을 알아보자.
## Jackson 의존 설정
`Jackson`은 **자바 객체와 JSON 형식 문자열 간 변환을 처리하는 라이브러리**이다. 
다음과 같이 두 의존을 추가하면 사용할 수 있다.
```ad-example
title: `pom.xml`
~~~xml
<!-- Jackson core와 Jackson Annotation 의존 추가-->
<dependency>
	<groupId>com.fasterxml.jackson.core</groupId>
	<artifactId>jackson-databind</artifactId>
	<version>2.9.4</version>
</dependency>
<!-- java8 data/time 지원 위한 Jackson 모듈-->
<dependency>
	<groupId>com.fasterxml.jackson.core</groupId>
	<artifactId>jackson-databind</artifactId>
	<version>2.9.4</version>
</dependency>
~~~
```

자바 객체의 프로퍼티의 이름과 값이 JSON의 이름, 값 쌍으로 변한다.
```ad-example
title: Jackson 객체와 JSON간 변환 예시
~~~
public class Person {
	private String name;
	private int age;
	//...get/set 메서드
}
<=>
{"name": "이름", "age": 10}
~~~
```

## `@RestController`로 JSON 형식 응답
`@Controller` 대신 `@RestController`로 변경 후, 메소드의 리턴을 객체로 바꿔주면 JSON 형식으로 응답해줄 수 있다.
- 스프링 MVC 측에서 적절한 형태로 응답하는데, 이때 Jackson 의존 모듈이 있다면 JSON 형식으로 반환한다.
```ad-example
title:`@RestController`을 이용한 JSON 형식 응답
`@CrossOrgigin`: `CORS` 헤더 포함을 위한 어노테이션
~~~java
import java.util.List;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import spring.Member;
import spring.MemberDao;
//...
@RestController // @Controller에서 변경
@CrossOrigin(origins="*") // 서로 다른 도메인간의 요청 허용
public class RestMemberController {
	private MemberDao memberDao;
	private MemberRegisterService registerService;

	@GetMapping("/api/members")
	public List<Member> members() { // 뷰 이름에서 객체의 리스트로 리턴 변경
		return memberDao.selectAll();
	}

	@GetMapping("/api/members/{id}") // 뷰 이름에서 객체 하나로 리턴 변경
	public Member member(@PathVariable Long id, HttpServletResponse response) throws IOException {
		Member member = memberDao.selectById(id);
		if (member == null) {
			response.sendError(HttpServletResponse.SC_NOT_FOUND);
			return null;
		}
		return member;
	}
	//...
}
~~~
```
이후 해당 컨트롤러를 구성 클래스에 추가해주고 해당 URL에 요청하면 JSON으로 응답을 반환한다.
```ad-example
title: `ControllerConfig.java`에 추가
~~~java
@Configuration
public class ControllerConfig {
	//... 생략

	@Bean
	public RestMemberController restApi() {
		RestMemberController cont = new RestMemberController();
		cont.setMebmerDao(memberDao);
		cont.setRegisterService(memberRegSvc);
		return cont;
	}
}
~~~
```
이제 응답 메시지 바디에는 HTML 페이지에서, JSON 데이터로 변하며, 응답 헤더의 `Content-type`은 `text/plain`에서 `application/json`으로 바뀐다.
- 만약 응답 형식을 바꾸고 싶다면, `produces="text/html"` (=`xml` 출력)같이 속성을 주면 된다.(`@***Mapping` 시리즈도 속성 포함)
```ad-seealso
title: `@ResponseBody` 방법
`@RestController` 이전에는 `@ResponseBody`를 이용해서 다음과 같이 컨트롤러를 구현했다.
~~~java
@Controller
public class RestMemberController{
	private MemberDao memberDao;
	private MemberRegisterService registerService;

	@RequestMapping(path="/api/members", method=RequestMethod.GET)
	@ResponseBody
	public List<Member> members() {
		return memberDao.selectAll();
	}
}
~~~
```
## 어노테이션 이용한 JSON 응답 변경
### `@JsonIgnore`
`@JsonIgnore`를 이용하면 응답시 JSON 필드에서 뺄 수 있다.
```ad-example
title: `@JsonIgnore`를 이용한 비밀번호 마스킹
~~~java
import com.fasterxml.jackson.annotation.JsonIgnore;

public class Member {
	private Long id;
	private String email;
	@JsonIgnore
	private String password;
	private String name;
	private LocalDateTime registerDateTIme;
}
~~~
이에 따른 JSON 결과물은 다음과 같다.
~~~
{
	"id": 1, 
	"email": "asdf@asdf.net"
	"name": "asdf"
	"registerDateTime": [2018,3,1,11,7,49]
}
~~~
```

### `@JsonFormat`
`@JsonFormat`을 이용해 날짜를 특정한 형식으로 바꿀 수 있다.
```ad-example
title: `@JsonFormat` 이용 예시
~~~java
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonFormat.Shape;

public class Member {
	private Long id;
	private String email;
	private String name;
	@JsonFormat(shape=Shape.STRING) // ISO-8601 형식
	private LocalDateTime registerDateTime; // JSON 응답에서 "2018-03-01T11:07:49" 형식
	@JsonFormat(pattern="yyyyMMddHHmmss")
	private LocalDateTime updateDateTime; // JSON 응답에서 "20180301020749" 형식
}
~~~
```
- pattern 속성에 주어질 패턴은 `java.text.SimpleDateFormat` 클래스의 [API 문서](https://docs.oracle.com/javase/7/docs/api/java/text/SimpleDateFormat.html) 참조

### 포맷 기본 설정 바꾸기

일일이 `@JsonFormat`을 붙여 변환하는 것은 귀찮은 일이므로, 다음과 같은 방법으로 변환 규칙을 기본 설정으로 바꿔줄 수 있다.
1. `WebMvcConfigurer` 인터페이스의 `extendMessageConverters` 메서드는 `HttpMessageConverter`를 추가로 설정할 때 사용
2. 스프링의 기본 제공 날짜 포맷 기능을 비활성화한다.
3. `Jackson2ObjectMapperBuilder`를 이용해 새로운 포맷 매퍼를 만든다.
4. `converters.add(순서, 컨버터)` 메서드를 이용해 새 변환 매퍼를 최우선으로 적용하게 한다.
```ad-example
title: `MappingJackson2HttpMessageConvert`를 이용한 `MvcConfig` 클래스
~~~java
//...
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
//...

@Configuration
@EnableWebMvc
public class MvcConfig implements WebMvcConfigurer { 

    @Override 
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        ObjectMapper objectMapper = Jackson2ObjectMapperBuilder
                .json()
                .featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
                .build();
        converters.add(0, new MappingJackson2HttpMessageConverter(objectMapper));
    }
}
~~~
```
위 코드는 이제 모든 시간 형식을 `ISO-8601` 형식으로 변환한다.
`java.util.Date` 타입의 변경 코드는 아래와 같다.
```ad-example
title: `java.util.Date` 타입 값 변경
~~~java
@Override 
public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
	ObjectMapper objectMapper = Jackson2ObjectMapperBuilder
		.json()
		.simpleDateFormat("yyyyMMddHHmmss") // Date를 위한 변환 패턴
		.build();
	converters.add(0, new MappingJackson2HttpMessageConverter(objectMapper));
}
~~~
```
내가 원하는 커스텀 형식을 지정하고 싶다면 아래와 같이 할 수 있다.
```ad-example
title: 모든 `LocalDateTime`형식을 원하는 패턴으로 변경 
~~~java
import java.time.format.DateTimeFormatter;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;

//...
@Override 
public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
	DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
	ObjectMapper objectMapper = Jackson2ObjectMapperBuilder
		.json()
		.serializerByType(LocalDateTime.class, new LocalDateTimeSerializer(formatter))
		.build();
	converters.add(0, new MappingJackson2HttpMessageConverter(objectMapper));
}
~~~
```
이렇게 지정한 기본설정은 앞서 사용했던 `@JsonFormat` 방식보다 적용 우선순위가 떨어진다.
## `@RequestBody`로 JSON 요청 처리
반대로 JSON 형식으로 받은 데이터를 자바 객체로 바꾸는 기능을 알아보자.
```ad-example
title: JSON 형식 요청의 예시
- POST, PUT 메서드의 쿼리 문자열 형식 데이터 대신 JSON으로 요청을 전송할 수 있다.
- 이때, 쿼리 문자열 `name=이름&age=17`은 `{"name": "이름", "age": 17}` 같은 형식으로 바뀐다.
- 요청 메시지의 `Content-type` 헤더 값은 `application/x-www-form-urlencoded` 에서 `application/json`으로 바뀐다.
```
커맨드 객체에 `@RequestBody` 어노테이션을 붙이면 자동으로 커맨드 객체로 변환된다.
```ad-example
title: `/src/main/java/controller/RestMemberController.java`
~~~java
//...
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
//...

@RestController
public class RestMemberController {
	private MemberDao memberDado;
	private MemberRegisterService registerService;

	@PostMapping("/api/members")
	public void newMember(
		@RequestBody @Valid RegisterRequest regReq,
		HttpServletResponse response) throws IOException {
		try{
			Long newMemberId = registerService.regist(regReq);
			response.setHeader("Location", "/api/members/" + newMemberId); // Location 헤더 추가
			response.setStatus(HttpServletResponse.SC_CREATED); // 201(CREATED) 응답
		} catch (DuplicateMemberException dupEX) {
			response.sendError(HttpServletResponse.SC_CONFLICT); // 409(Conflict)
		}		
	}
}
~~~
```
포스트맨, Advanced REST Client 같은 프로그램으로 시험해보면 보낸 JSON 데이터에 맞춰 객체가 생성된다. (ex) name 필드가 "이름"이고 age 필드가 17인 getter, setter 메서드가 존재하는 객체)

### 요청 데이터의 형식 변경 및 검증
**요청 데이터 형식 변경**
JSON 데이터를 객체로 변환시 특정 문자열을 `LocalDateTime`, `Date` 같은 형식으로 바꾸려면 앞서 설명한 [[#`@JsonFormat`]]을 이용하면 된다.
```ad-example
title: `@JsonFormat` 예시
~~~java
@JsonFormat(pattern= "yyyyMMddHHmmss")
private LocalDateTime birthDateTime;

@JsonFormat(pattern= "yyyyMMdd HHmmss")
private Date birthDate;
~~~
```
이 또한 다음처럼 `extendMessageConverters`를 통해 기본 설정으로 바꿀 수 있다.
```ad-example
title: `MvcConfig` 설정 예시
~~~java
@Configuration
@EnableWebMvc
public class MvcConfig implements WebMvcConfigurer{
    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        ObjectMapper objectMapper = Jackson2ObjectMapperBuilder
                .json()
                .featuresToDisable(SerializationFeature.INDENT_OUTPUT)
                .deserializerByType(LocalDateTime.class, new LocalDateTimeSerializer(formatter))
                .simpleDateFormat("yyyyMMdd HHmmss")
                .build();

        converters.add(0, new MappingJackson2HttpMessageConverter(objectMapper));
    }
}
~~~
```
- `deserializerByType()`는 JSON 데이터를 `LocalDAteTime` 타입으로 변환 시 사용할 패턴을 지정
- `simpleDateFormat()`은 JSON 데이터를 `Date` 타입으로 변환 시, 혹은 그 반대에 사용할 패턴을 지정
**요청 객체 검증**
이전과 동일하게 `@Valid` 를 통해 해결할 수 있다. 이 경우, 잘못된 경우 자동으로 400 상태 코드로 응답한다. (단, 에러 메시지를 JSON 형식으로 보내고 싶은 경우 [[#`@Valid` 에러 메시지에 `ResponseEntity` 활용하기]] 참조)

다만, Validator를 직접 구현할 경우 아래와 같이 직접 상태 코드를 해결해야 한다.
```ad-example
title: Validator 구현 시 객체 검증 에러 처리
~~~java
@PostMapping("/api/members")
public ResponseEntity<Object> newMember(
		@RequestBody RegisterRequest regReq, Errors errors, HttpServletResponse response ) throws IOException {
	try {
		new RegisterRequestValidator().validate(regReq, errors);
		if (errors.hasErrors()) {
			response.sendError(HttpServletResponse.SC_BAD_REQUEST);
			return;
		}
		//... 다른 에러들 처리
	} catch (DuplicateMemberException dupEx) {
		response.sendError(HttpServletResponse.SC_CONFLICT);
	}
}
~~~
```
## `ResponseEntity`로 객체 리턴하고 응답 코드 지정하기
기본적인 `HttpServletResponse`를 이용한 [[#`@RequestBody`로 JSON 요청 처리|에러 처리]]를 이용하면 톰캣 서버가 제공하는 기본 에러 HTML 페이지를 응답 메시지로 제공하게 된다.

### `ResponseEntitiy`를 이용한 응답 메시지 작성
이를 위해 `ResponseEntity` 이용한 JSON 데이터를 보내는 방법을 알아보자.

**1. 응답으로 보낼 에러 객체 만들기**
```ad-example
title: `ErrorResponse` 클래스
~~~java
package controller;

public class ErrorResponse {
	private String message;

	public ErrorResponse(String message) {
		this.message = message;
	}

	public String getMessage() {
		return message;
	}
}
~~~
```

2. **`ResponseEntitiy`를 통해서 응답 메시지 만들기**
```ad-example
title: `ResponseEntity`를 이용한 응답 데이터 처리
~~~java
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@RestController
public class RestMemberController {
	private MemberDao memberDao;
	//...
    @GetMapping("/api/members/{id}")
    public ResponseEntity<Object> member(@PathVariable Long id) {
        Member member = memberDao.selectById(id);
        if (member == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse("no member"));
            // return ResponseEntity.notFound().build();
        }
        // return ResponseEntity.status(HttpStatus.OK).body(member);
        return ResponseEntity.ok(member);
    }
}
~~~
```
아래와 같이 `ResponseEntity`로 응답 메시지를 만들어 리턴하면 된다.
```java
return ResponseEntity.status(
// 응답 상태 코드 지정, HttpSatus 객체 활용
).body(
// JSON으로 변환할 객체 지정
)
```
이때 `ResponseEntity.ok` 메서드나 `ResponseEntity.notFound()` 같은 관련 메시지를 이용할 수 있으며, body에 넣을 값이 없으면 `build()` 메서드를 끝에 붙여 완성할 수 있다.
- 이외에도 `noContent()(204), badRequest()(400), notFound()(404)` 등이 존재
다음 코드를 `created()` 메서드로 대체할 수 있다.
```ad-example
title: `/src/main/java/controller/RestMemberController.java`
~~~java
//...
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
//...

@RestController
public class RestMemberController {
	private MemberDao memberDado;
	private MemberRegisterService registerService;

	@PostMapping("/api/members")
	public void newMember(
		@RequestBody @Valid RegisterRequest regReq,
		HttpServletResponse response) throws IOException {
		try{
			Long newMemberId = registerService.regist(regReq);
			// response.setHeader("Location", "/api/members/" + newMemberId); // Location 헤더 추가
			// response.setStatus(HttpServletResponse.SC_CREATED); // 201(CREATED) 응답
			// 위 주석과 동일한 코드
			URI uri = URI.create("/api/members/" + newMemberId);
			return ResponseEntity.created(uri).build();
		} catch (DuplicateMemberException dupEX) {
			response.sendError(HttpServletResponse.SC_CONFLICT); // 409(Conflict)
		}		
	}
}
~~~
```

### `@ExceptionHandler`, `@RestControllerAdvice`와 `ResponseEntity` 활용하기

[[Spring5 입문-날짜 값 변환,  경로 변수, 익셉션 공동 처리, 글로벌 변환기#`@ExceptionHandler`|앞서]] `@ExceptionHandler`를 이용하면 에러 처리 관련 중복 코드를 제거할 수 있었다.

이를 활용해 다음과 같이 중복 코드를 없앨 수 있다.

```ad-example
title: `@ExceptionHandler`를 이용한 JSON 에러 응답
~~~java
@GetMapping("/api/members3/{id}")
public Member member3(@PathVariable Long id) {
    Member member = memberDao.selectById(id);
    if (member == null) {
		throw new MemberNotFoundException();
    }
    return member;
}

@ExceptionHandler(MemberNotFoundException.class)
public ResponseEntity<ErrorResponse> handleNoData() {
	return ResponseEntity
		.status(HttpStatus.NOT_FOUND)
		.body(new ErrorResponse("no member"));
}
~~~
```

응답을 JSON이나 XML로 해야하는 경우 `@ControllerAdvice` 대신 `@RestControllerAdvice`를 이용해야 한다.

```ad-example
title: `@RestControllerAdvice`를 이용한 에러 공동 처리 코드 공유
~~~java
package controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;  

import spring.MemberNotFoundException;  

@RestControllerAdvice("controller")
public class ApiExceptionAdvice { 

    @ExceptionHandler(MemberNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoData() {
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(new ErrorResponse("no member"));
    }
}
~~~
```

### `@Valid` 에러 메시지에 `ResponseEntity` 활용하기

아래 처럼 `Errors` 객체를 추가해 직접 에러 메시지를 작성하거나 공통 처리하면 된다.
```ad-example
title: `@Valid` 검증 에러 응답 메시지 생성
~~~java
@PostMapping("/api/members")
public ResponseEntity<Object> newMember(@RequestBody @Valid RegisterRequest regReq , Errors errors ) {
		if (errors.hasErrors()) {
			String errorCodes = errors.getAllErrors()
				.stream()
				.map(error -> error.getCodes()[0])
				.collect(Collectors.joining(","));
			return ResponseEntity
					.status(HttpStatus.BAD_REQUEST)
					.body(new ErrorResponse("errorCodes = " + errorCodes));
		}
		try {
			Long newMemberId = registerService.regist(regReq);
			URI uri = URI.create("/api/members/" + newMemberId);
			return ResponseEntity.created(uri).build();
		} catch (DuplicateMemberException dupEx) {
			return ResponseEntity.status(HttpStatus.CONFLICT).build();
		}
}
~~~
```

```ad-example
title: `@Valid` 검증 에러 공통 처리
~~~java
import org.springframework.web.bind.MethodArgumentNotValidException;

@RestControllerAdvice("controller")
public class ApiExceptionAdvice {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleBindException(MethodArgumentNotValidException ex) {
        String errorCodes = ex.getBindingResult().getAllErrors()
                .stream()
                .map(error -> error.getCodes()[0])
                .collect(Collectors.joining(","));
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("errorCodes = " + errorCodes));
    }
}
~~~
```

## REST API 자동 생성

### 구성

```ad-important
나중에 직접 실습하고 다시 쓰기
```

스프링 부트를 이용한다면 스프링 데이터 REST를 이용해 자동으로 리퍼지터리 클래스를 통해 REST API를 만들 수 있다.
- **org.springframework.boot.spring-boot-starter-data-rest** 의존성 추가

이렇게 의존 모듈을 추가하고 **org.springframework.data.repository**의 클래스를 상속해 만든 리포지터리 클래스들만 존재하면, 기본적인 구성이 된다.

```ad-warning
title: 단! 이제 경로명이 충돌하는 `@RestController`는 더 이상 사용할 수 없으며 이미 사용된 코드 또한 해당 어노테이션을 지워줘야 한다.
```

예를 들어 인터페이스 `IngredientRepository extends CrudRepository<Ingredient, String>`를 구현했다면 `/ingredients`로 GET 요청을 하면 다음과 같은 응답이 온다.
```ad-example
title: `/ingredients` 응답 JSON
HATEOAS 적용되어 있으며, GET, POST, PUT, DELETE 메서드로 CRUD가 가능하다.
~~~java
{
	"_embedded": {
		"ingredients": [
			{
				"name": "Flour Tortilla",
				"type": "WRAP",
				"_links": {
					"self": {
						"href": "http://localhost:8080/ingredients/FLTO"
					},
					"ingredient": {
						"href": "http://localhost:8080/ingredients/FLTO"
					}
				}
			},
			//...
		]
	},
	"_links": {
		"self": {
			"href": "http://localhost:8080/ingredients"
		},
		"profile": {
			"href": "http://localhost:8080/profile/ingredients"
		}
	}
}
~~~
```

만약, 자동 생성한 API를 다른 경로로 설정하고 싶다면 다음같이 가능하다.
```yaml
spring:
	data:
		rest:
			base-path: /api 
```
이제 자동생성된 api는 앞에 `/api`를 붙여야 한다.

### 리소스 경로명과 관계명 변경
이때 경로명을 자동으로 정해주는 것을 바꾸고 싶다면 다음과 같이 `@Entity`가 붙은 도메인 클래스에 `@RestResource` 어노테이션을 붙여바꾼다.

```ad-example
title: 리소스 경로명과 이름 바꾸기
~~~java
@Data
@Entity
@RestResource(rel="tacos", path="tacos")
public class Taco {
	//...
}
~~~
```
- 자동 생성 리소스 경로명이  `/api/tacoes`였던 것이 `path` 속성에 의해 `/api/tacos`로 바뀐다.
- HAL Json 내의 속성명이 `rel` 속성에 의해 `tacos`바뀐다.

### 페이징과 정렬

`/api/tacos` 같은 컬렉션 리소스를 요청하면 기본적으로 한 페이지당 20개의 항목을 반환한다.

페이지 번호와 페이지 크기는 경로 변수를 통하여 바꿀 수 있다.
기본적으로 3개의 경로변수가 자동 구현 된다.
```ad-note
title: 경로변수 예시
`/api/tacos{?page,size,sort}`
- `size`: 한 페이지의 크기 ex) `/api/tacos?size=5`
- `page`: 인덱스가 0부터 시작하는 페이지 ex) `/api/tacos?size=5&page=1`
- `sort`: 해당 값들의 기준속성과 정렬방법 ex) `/api/tacos?sort=createdAt,desc`
```

그리고, 처음, 마지막, 다음, 이전 페이지의 링크 요청도 자동 생성되어 있다.

```json
"_links": {
	"first": {
		"href": "http://localhost:8080/api/tacos?page=0&szie=5"
	},
	"self": {
		"href": "http://localhost:8080/api/tacos"
	},
	"next": {
		"href": "http://localhost:8080/api/tacos?page=1&szie=5"
	},
	"last": {
		"href": "http://localhost:8080/api/tacos?page=2&szie=5"
	},
	"profile": {
		"href": "http://localhost:8080/api/profile/tacos"
	},
	"recents": {
		"href": "http://localhost:8080/api/tacos/recent"
	},
}
```

### 커스텀 엔드포인트 추가

커스텀 엔드 포인트를 추가하려면 다음 두 방법이 있다.
- 기존의 `@RestController`를 경로명이 부딪히지 않게 사용
	- 늘어나는 API + 일일이 충돌 확인 + 기본 경로명 하드코딩으로 인해 추천하지 않음.
- `@RepositoryRestController` 사용

`@RepositoryRestController`를 사용하면, 앞서 설정했던 기본 경로명 `spring.data.rest.base-path`가 자동으로 앞에 붙게 된다.

또한 겹치게된 경로명은 자동으로 오버라이딩된다.

```ad-example
title: `@RepositoryRestController`를 이용한 컨트롤러
단, 기존의 `@RestController`과 조금 기능이 다르다.

특히, 요청 응답의 몸체에 자동으로 반환값을 추가하지 않는다.

따라서 `@ResponseBody`나 `ResponseEntity`를 이용해 응답을 직접 생성해야 한다.

~~~java
//...
import org.springframework.data.domain.Sort;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.hateoas.Resources;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
//...  

@RepositoryRestController
public class RecentTacosController {
	
	private TacoRepository tacoRepo; 
	
	public RecentTacosController(TacoRepository tacoRepo) {
		this.tacoRepo = tacoRepo;
	}
	
	@GetMapping(path="/tacos/recent", produces="application/hal+json")
	public ResponseEntity<Resources<TacoResource>> recentTacos() {
		PageRequest page = PageRequest.of(0, 12, Sort.by("createdAt").descending());
		
		List<Taco> tacos = tacoRepo.findAll(page).getContent();

		List<TacoResource> tacoResources = new TacoResourceAssembler().toResources(tacos);

		Resources<TacoResource> recentResources = new Resources<TacoResource>(tacoResources);
		 recentResources.add(
			 linkTo(methodOn(RecentTacosController.class).recentTacos())
			 .withRel("recents"));
		return new ResponseEntity<>(recentResources, HttpStatus.OK);
	}
}
~~~
```

### 커스텀 엔드포인트를 스프링 데이터에 등록

하지만, 이렇게 생성한 커스텀 엔드포인트는 HAL json 내에서 소개되지 않는다. 
이를 추가하기 위해 `ResourceProcessor` 인터페이스를 이용할 수 있다.
-  **`ResourceProcessor` 인터페이스** : API를 통해 리소스가 반환되기 전에 리소스를 조작하는 인터페이스

```ad-example
title: 커스텀 리소스 프로세서
오버라이딩한 뒤 빈으로 등록하면 빈으로 등록된 모든 리소스 프로세서를 적용한다.
~~~java
package tacos.web.api;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.hateoas.EntityLinks;
import org.springframework.hateoas.PagedResources;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.ResourceProcessor;

import tacos.Taco;

@Configuration
public class SpringDataRestConfiguration {

	@Bean
	public ResourceProcessor<PagedResources<Resource<Taco>>> tacoProcessor(EntityLinks links) {
		return new ResourceProcessor<PagedResources<Resource<Taco>>>() {
			@Override
			public PagedResources<Resource<Taco>> process(PagedResources<Resource<Taco>> resource) {
				resource.add(links.linkFor(Taco.class)
					.slash("recent")
					.withRel("recents")); //recent 엔드포인트 추가
				return resource;
			}
		};
	}
}
~~~
```
