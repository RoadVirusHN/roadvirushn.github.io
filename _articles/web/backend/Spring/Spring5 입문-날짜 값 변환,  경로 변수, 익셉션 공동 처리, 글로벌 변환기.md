---
title: Spring5 입문-날짜 값 변환, 경로 변수, 익셉션 공동 처리, 글로벌 변환기
date: 2023-01-26 21:33:31 +0900
tags: WEB SPRING BE SUMMARY HIDE
layout: obsidian
is_Finished: false
last_Reviewed: 2023-01-26 21:33:31 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# 날짜 값 변환, 경로 변수, 익셉션 공동 처리, 글로벌 변환기
```ad-quote
title: 출처

_[초보 웹 개발자를 위한 스프링 5 프로그래밍 입문](https://www.kame.co.kr/nkm/detail.php?tcode=306&tbook_jong=3)_와 [스프링 인 액션](https://jpub.tistory.com/1040)의 내용을 바탕으로 정리한 내용입니다.
```

## 날짜 값 변환

### 날짜 기간 검색 기능

다음과 같이 `MemberDao`에 사용자를 가입 날짜를 제한해 검색하는 기능이 있다고 가정하자.

```ad-example
title: `selectByRegdate` 함수
~~~java
public List<Member> selectByRegdate(LocalDateTime from, LocalDateTime to) {
	List<Member> results = jdbcTemplate.query(
	    "select * from MEMBER where REGDATE between ? and ? " +
                        "order by REGDATE desc",
        new RowMapper<Member>() {
			@Override
            public Member mapRow(ResultSet rs, int rowNum) throws SQLException {
	            Member member = new Member(rs.getString("EMAIL"), 
	            s.getString("PASSWORD"),
	            rs.getString("NAME"),
	            rs.getTimestamp("REGDATE").toLocalDateTime());
                member.setId(rs.getLong("ID"));
                return member;}
		};, from, to);
	return results;
}
~~~
```

입력으로 "2018030115"가 입력된다면, 2018-03-01-3PM 값의 `LocalDateTime`으로 변환되어야 한다.

이를 위해 다음과 같이 커맨드 객체 위에 `@DateTimeFormat(pattern="")`을 이용할 수 있다.
```ad-example
title: `src/main/java/controller/ListCommand.java`
~~~java
package controller;
import java.time.LocalDateTime;
import org.springframework.format.annotation.DateTimeFormat;

public class ListCommand {
	//...
	@DateTimeFormat(pattern="yyyyMMddHH") // y,m,d,h 등의 문자열로 형식 표현
	private LocalDateTime from;

	@DateTimeFormat(pattern="yyyyMMddHH")
	private LocalDateTime to;
	//...
}
~~~
```
이후 아래와 같이 커맨드 객체를 사용하는 컨트롤러를 추가하자.

```ad-example
title: `src/main/java/controller/MemberListController.java` 
~~~java
//...
	@RequestMapping("/members")
	public String list(
		@ModelAttribute("cmd") ListCommand listCommand,
			Errors errors, Model model) {
		if (errors.hasErrors()) { // 형식에 맞지않으면 Validate가 없어도 에러 추가됨
			return "member/memberList";
		}
		if (listCommand.getFrom() != null && listCommand.getTo() != null) {
			List<Member> members = memberDao.selectByRegdate(
				listCommand.getFrom(), listCommand.getTo());
			model.addAttribute("members", members);
	}
	return "member/memberList";
}
//...
~~~
```
별다른 설정 없이 `@DateTimeFormat(pattern="yyyyMMddHH")`를 구현한 객체 커맨드를 사용해 주면 된다.

```ad-example
title: 빈 설정 추가
~~~java
//...
import controller.MemberListController;
import spring.MemberDao;

@Configuration
public class ControllerConfig {
	//...
	@Autowired
	private MemberDao memberDao;
	//...
	@Bean
	public MemberListController memberListController(){
		MemberListController controller = new MemberListController();
		controller.setMemberDao(memberDao);
		return controller;
	}
}
~~~
```

이제 뷰에서 "2018030115"가 입력된다면, 2018-03-01-3PM 값의 `LocalDateTime`으로 자동 변환된다.

```ad-seealso
title: 지원하는 타입
이외에도 `java.time.LocalDateTime`, `java.time.LocalDate`, `java.util.Date`, `java.util.Calendar` 타입을 지원한다.
```

또한, Validator를 추가하지 않아도, [[Spring5 입문-객체 검증]]에서 처럼 `Errors` 타입 파라미터를 추가해 에러를 처리하는 것이 가능하다.

### 변환의 원리

1. 스프링 MVC는 요청 매핑 어노테이션 적용 메서드와 [[Spring5-MVC 개념과 설정#요청 과정 예시|DispatcherServlet]] 사이를 연결하기 위해 `RequestMappingHandlerAdapter` 객체를 사용한다.
2. 이때 `RequestMappingHandlerAdapter` 객체는 변환 요청 시, 로컬 Validator에서 사용했던 [[Spring5 입문-객체 검증#컨트롤러 범위 Validator 설정 : `@InitBinder` 어노테이션|WebDataBinder]]를 사용한다.
```ad-example
title: `WebDataBinder`의 타입 변환 그림
![[image-20230127132840993.png]]
```
3. `WebDataBinder`는 커맨드 객체를 생성하고 `ConversionService`에 변환처리하는데, `@EnableWebMvc`의 기본 설정은 `DefaultFormattingConversionService` 객체이다.
	- `DefaultFormattingConversionService`는 `int`, `long`, `@DateTimeFormat` 어노테이션 등의 시간 관련 타입 변환 기능을 제공한다.
	- `WebDataBinder`는 모델을 이용해 JSP 뷰의 spring 태그들을 HTML 태그로 전환 시에도 사용

## `Converter`
`ConversionService`이외에 아래 처럼 직접 `Converter`를 구현해서 직접 등록할 수 있다.
```ad-example
title: `Converter`의 사용례

`Converter<원타입, 변형타입>`으로 `Converter`의 `convert(원타입)`메소드를 구현해주면 된다.
~~~java
//...
import org.springframework.core.convert.converter.Converter;

import tacos.Ingredient;
import tacos.data.IngredientRepository;

@Component
public class IngredientByIdConverter implements Converter<String, Ingredient> {

	private IngredientRepository ingredientRepo;

    @Autowired
    public IngredientByIdConverter(IngredientRepository ingredientRepo) {
        this.ingredientRepo = ingredientRepo;
    }

	@Override
    public Ingredient convert(String id) {
        return ingredientRepo.findById(id);
    }
}
~~~
```

나중에 Converter와 ConversionService 좀더 공부하기.

## `@PathVariable`을 이용한 경로 변수 처리

`@PathVariable`을 이용하면 `http://localhost:8080/sp5-chap14/members/10`의 10처럼 경로 일부가 고정되지 않고 변수 처럼 사용하게 할 수 있다.
```ad-example
title: `@PathVariable` 이용한 경로 변수 처리
`/members/10`이면 `memId` 변수 값이 10이 된다.

~~~java
import org.springframework.web.bind.annotation.PathVariable;

@GetMapping("/members/{id}")
public String detail(@PathVariable("id") Long memId, Model model) {
    Member member = memberDao.selectById(memId);
    if (member == null) {
        throw new MemberNotFoundException();
    }
    model.addAttribute("member", member);
    return "member/memberDetail";
}
~~~
```
- `Long` 등, 주어진 타입으로 변환 불가능하거나, `null` 값 등이면 에러를 일으키며 이에 대한 것은 [[#컨트롤러 익셉션 처리]] 참조
## 컨트롤러 익셉션 처리

내부에 `try~catch` 구문을 통해 익셉션을 처리할 수 있지만, 같은 컨트롤러 내부에 공통적인 방법으로 익셉션을 처리한다면 코드가 중복될 것이다.

이를 `@ExceptionHandler`나 `@ControllerAdvice`를 통해 공통으로 처리할 수 있다.

### `@ExceptionHandler`

```ad-example
title: `@ExceptionHandler`가 추가된 컨트롤러
~~~java
//...
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.beans.TypeMismatchException; // 경로 변수값의 타입이 올바르지 않을 때 발생
import spring.MemberNotFoundException;
//...
    @ExceptionHandler(TypeMismatchException.class) 
    public String handleTypeMismatchException() {
        return "member/invalidId";
    }  

    @ExceptionHandler(MemberNotFoundException.class)
    public String handleNotFoundException(MemberNotFoundException ex) {
	    // ex 객체를 통해 로그 남기기 등의 작업 가능
        return "member/noMember";
    }
//...
~~~
```
- `@ExceptionHandler` 내부에 주어진 오류가 발생하면 에러 응답을 보내는 대신 해당 메소드를 실행시킴
- 아래의 `ControllerAdvice` 보다 우선순위가 높음
`@ExceptionHandler`가 붙은 메서드는 다른 매핑 메서드처럼 다양한 파라미터와 리턴값을 가짐
- 파라미터
	- 익셉션
	- `Model`
	- `HttpServletRequest, HttpServletResponse, HttpSession`
- 리턴
	- `ModelAndView`
	- 뷰이름 `String`
	- 임의 객체(`@ResponseBody` 이용 시)
	- `ResponseEntity`
### `@ControllerAdvice`

만약 다수의 컨트롤러에서 동일 타입 익셉션을 처리하고 싶다면 `@ControllerAdvice`을 이용할 수 있다.

```ad-example
title: `@ControllerAdvice`을 사용한 `CommonExceptionHandler.java`
~~~java
package common; 

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice("spring")
public class CommonExceptionHandler {

	@ExceptionHandler(RuntimeException.class)
    public String handleRuntimeException() {
        return "error/commonException";
    }
}
~~~
```

`@ControllderAdvice` 내부에 적용되는 패키지(와 하위 패키지)를 기입하면, 해당 패키지 내의 빈 객체에 공통 익셉션 처리가 적용된다.
- 위 `CommonExceptionHandler` 클래스는 빈 등록을 안해도 됨.
이외에도 다음과 같은 속성을 가지고 있다.
- `value, basePackages` : `String[]`
	공통 설정을 적용할 컨트롤러가 속하는 기준 패키지
- `annotations` : `Class<? extends Annotation>[]`
	특정 애노테이션이 적용된 컨트롤러 대상
- `assignableTypes`: `Class<?>[]`
	특정 타입 또는 그 하위 타입인 컨트롤러 대상
