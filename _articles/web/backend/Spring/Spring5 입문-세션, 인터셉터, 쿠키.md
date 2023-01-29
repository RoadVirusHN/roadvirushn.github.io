---
title: Spring5 입문-세션, 인터셉터, 쿠키
date: 2023-01-26 13:54:00 +0900
tags: HIDE CRUDE 
layout: obsidian
is_Finished: false
last_Reviewed: 2023-01-26 13:54:00 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# 세션, 인터셉터, 쿠키

```ad-quote
title: 출처

_[초보 웹 개발자를 위한 스프링 5 프로그래밍 입문(최범균 저, 가메 출판사)](https://www.kame.co.kr/nkm/detail.php?tcode=306&tbook_jong=3)_의 내용을 바탕으로 정리한 내용입니다.
```

로그인과 유저 편의성, 차별화된 서비스를 위한 쿠키와 세션, 인터셉터를 통한 인증을 알아보자.

## 세션

로그인 상태를 유지하기 위해 크게 HttpSession, 쿠키, JWT 토큰 등이 존재한다.
그중 우리는 Session을 이용할 것이다.

추가로 Session을 보관하는 방법도 HttpsSession과 쿠키로 나뉜다.

### `HttpSession`을 이용한 인증 구현

인증은 아직 확인되지 않은 사용자를 특정 사용자로 확인하는 작업이다.

`HttpSession`을 이용하는 방법은 다음 두 가지가 있다.
```ad-example
title: 요청 매핑 애노테이션 적용 메서드에 `HttpSession` 파라미터 넘기기
- 메서드 실행 전에 `HttpSession`을 무조건 하나 생성하거나 기존의 것을 가져온다.

~~~java
@PostMapping
public String form(CommandObj commandObj, Errors errors, HttpSession session) {
	session.setAttribute("authInfo", commandObj); // 세션 정보 지정
	session.invalidate(); // 세션 만료
}
~~~
```

```ad-example
title: 요청 매핑 애노테이션 적용 메서드에 `HttpServletRequest` 파라미터를 추가하고 `HttpServletRequest` 객체에서 세션 얻어내기
- 세션 생성 코드를 원하는 타이밍에 이용하므로, 세션을 생성하지 않을 수 있다.
- 따라서 성능상 유리할 수 있다.

~~~java
@PostMapping
public String submit(CommandObj commandObj, Errors errors, HttpServletRequest req) {
	HttpSession session = req.getSession();// 세션 생성
	... // Session 이용
}
~~~
```

이를 이용해 다음과 같이 로그인 컨트롤러를 구현할 수 있다.

```ad-example
title: `src/main/java/controller/LoginController.java`
~~~java
package controller;

import javax.servlet.http.HttpSession;
//...

@Controller
@RequestMapping("/login")
public class LoginController {
// ...
	@PostMapping
	public String submit(LoginCommand loginCommand, Errors errors, HttpSession session) {
		new LoginCommandValidator().validate(loginCommand, errors);
		if (errors.hasErrors()) {
			return "login/loginForm";
		}
		try {
			AuthInfo authInfo = authService.authenticate(loginCommand.getEmail(), loginCommand.getPassword()); // DB 조회 및 이메일과 비밀번호 대조
		// 로그인 성공시 session 값 저장
		session.setAttribute("authInfo", authInfo);
		// 로그아웃 및 세션 만료는 session.invalidate(); 로 구현하면 된다.
			return "login/loginSuccess";
		} catch (IdPasswordNotMatchingException e) {
			errors.reject("idPasswordNotMatching");
			return "login/loginForm";
		}
	}
}
~~~
```


## 인터셉터

인가는 이미 확인 사용자가 특정 권한이 있는지 확인하고, 확인이 여전히 유효한지 확인하는 작업이다.
	ex) 비밀번호를 변경하려면 이미 로그인이 되어있어야 한다. 특정 서비스에서는 게시글을 쓰려면 이미 회원임을 인가받아야 한다.

이처럼 여러 기능에서 인가 기능을 사용하기 때문에 **특정 컨트롤러 코드에 공통된 인가 기능을 구현하기 위해 인터셉터를 사용**할 수 있다.

### `HandlerInterceptor` 인터페이스

`org.springframework.web.HandlerInterceptor` 인터페이스는 주어진 `Handler` 오브젝트 실행 시, 다음 세 시점에 공통 기능을 넣을 수 있다. 이중 원하는 시점의 로직만 재정의하면 된다.
- `boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object Handler) throws Exception;` : **컨트롤러 실행 전 실행, `false` 리턴 시 컨트롤러 실행 막음**
- `void postHandle(HttpServletRequest request, HttpServletResponse response, Object Handler, ModelAndView modelAndView) throws Exception;` : **컨트롤러 실행 후, 뷰 실행 전 실행, `Handler`가 오류를 일으키면 실행되지 않음.**
- `void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object Handler, Exception ex) throws Exception;` : **뷰 실행 이후 실행, `Handler`가 오류를 일으키면 `ex` 객체를 덮어씀. 정상 작동하면 `ex`는 `null`이 됨**
	- 로그, 실행 시간 기록 등에 사용

이중 `preHandle`을 이용해 인가를 구현할 수 있다.
```ad-question
title: 앞서 배웠던 `AOP`와의 차이점은?
- AOP와 함께 구현시 인터셉터가 나중에 감싸진다.(이후 서블릿 필터가 감싸짐)
- 서블릿 필터와 인터셉터는 **HTTP 요청과 응답, 그리고 스프링 빈에 접근** 가능하다.
- AOP는 둘과 다르게 서블릿 단위에서 실행하지 않고 Proxy 패턴으로 실행, MVC와 관계없이 사용 가능
```

### 비밀번호 변경 기능
이제 인가 기능이 포함된 비밀번호 변경 기능을 구현할 수 있다.

```ad-example
title: `src/main/java/interceptor/AuthCheckInterceptor.java`
~~~java
package interceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.web.servlet.HandlerInterceptor;

public class AuthCheckInterceptor implements HandlerInterceptor {
	@Override
	public boolean preHandle(
			HttpServletRequest request,
			HttpServletResponse response,
			Object handler) throws Exception {
		HttpSession session = request.getSession(false);
		if (session != null) { // 세션이 존재함
			Object authInfo = session.getAttribute("authInfo");
			if (authInfo != null) {
				return true; // 정상 진행
			}
		}
		response.sendRedirect(request.getContextPath() + "/login"); // 로그인 페이지로 보냄
		return false; // 컨트롤러 실행 막음
	}
}
~~~
```
- 앞서 사용했던 [[#세션|세션]]을 통해 로그인한 사용자 정보를 가져올 것이며 사용자 정보가 `null`일 경우 로그인 페이지로 리다이렉트하고 컨트롤러의 실행을 막을 것이다.(`false`)

이후, 생성한 `HandlerInterceptor`를 설정 클래스에 등록한다. 단, 빈 객체 등록이 아닌 기존 기능을 재정의해 새로 추가하는 것임을 유의하자.
```ad-example
title:`src/main/java/config/MvcConfig.java`
~~~java
//...
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
//...
import interceptor.AuthCheckInterceptor;

@Configuration
@EnableWebMvc
public class MvcConfig implements WebMvcConfigurer {

	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(authCheckInterceptor())
		.addPathPatterns("/edit/**") //해당 인터셉트를 포함할 url 루트 지정
		.excludePathPatterns("/edit/help/**", "/edit/else/**"); // 포함 url 내에서 불포함할 url 루트 지정
		// ,(콤마)로 여러 url을 포함하거나 불포함할 수 있음
	}

	@Bean
	public AuthCheckInterceptor authCheckInterceptor() {
		return new AuthCheckInterceptor();
	}
}
~~~
```
- 이때 url 설정은 [Ant 경로 패턴](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/util/AntPathMatcher.html)을 따른다.
```ad-example
title: `src/main/java/controller/ChangePwdController.java`
~~~java
@PostMapping
public String submit(@ModelAttribute("command") ChangePwdCommand pwdCmd, Errors errors, HttpSession session) {
	new ChangePwdCommandValidator().validate(pwdCmd, errors);
	if (errors.hasErrors()) {
		return "edit/changePwdForm";
	}
	// session 정보 가져오기.
	AuthInfo authInfo = (AuthInfo) session.getAttribute("authInfo");
	// 앞서 인터셉터로 null이 아님을 확인했으므로 무조건 존재한다.	
	try {
		changePasswordService.changePassword(
			authInfo.getEmail(),
			pwdCmd.getCurrentPassword(),
			pwdCmd.getNewPassword());
		return "edit/changedPwd";
	} catch (WrongIdPasswordException e) {
		errors.rejectValue("currentPassword", "notMatching");
		return "edit/changePwdForm";
	}
}
~~~
```
이후 위와 같이 비밀번호 변경 기능을 구현할 수 있다.

## 쿠키
쿠키를 통해 이메일 기억하기 기능 같은 유저 특화 편의성 기능을 구현할 수 있다.
쿠키 구현을 위해 `@CookieValue` 어노테이션을 사용할 수 있다.
```ad-example
title: `@CookieValue` 어노테이션
`@CookieValue(value="쿠키명", required=default:true) Cookie 변수명`

위와 같이 파라미터 쿠키 타입 앞에 적어주면 된다.

- `value`: 쿠키 이름 지정
- `required`: 해당 쿠키가 존재하지 않을 수 있다면 false, true 일 경우 에러 발생
```

### 이메일 기억하기 기능 구현

```ad-example
title: `src/main/java/controller/LoginController.java`

~~~java
//...
import javax.servlet.http.Cookie;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
// ...
@Controller
@RequestMapping("/login")
public class LoginController {
	// ...
    @GetMapping
    public String form(LoginCommand loginCommand,
    		@CookieValue(value = "REMEMBER", required = false) Cookie rCookie) {
		if (rCookie != null) { // 쿠키가 존재한다면
			loginCommand.setEmail(rCookie.getValue()); // REMEMBER 쿠키값 가져와서 이메일 칸 채움
			loginCommand.setRememberEmail(true); 
		}
    	return "login/loginForm";
    }

    @PostMapping
    public String submit(
    		LoginCommand loginCommand, Errors errors, HttpSession session,
    		HttpServletResponse response) {
        new LoginCommandValidator().validate(loginCommand, errors);
        if (errors.hasErrors()) {
            return "login/loginForm";
        }
        try {
            AuthInfo authInfo = authService.authenticate(
                    loginCommand.getEmail(),
                    loginCommand.getPassword());
            
            session.setAttribute("authInfo", authInfo);

			Cookie rememberCookie = 
					new Cookie("REMEMBER", loginCommand.getEmail()); // 새로운 쿠키 생성
			rememberCookie.setPath("/");
			if (loginCommand.isRememberEmail()) { // 이메일 기억하기 쿠키 설정
				rememberCookie.setMaxAge(60 * 60 * 24 * 30);
			} else { // 쿠키 수명을 0으로 만들어 이메일 기억하지 않게 하기
				rememberCookie.setMaxAge(0);
			}
			response.addCookie(rememberCookie); // 응답 메시지에 쿠키 필드 추가

            return "login/loginSuccess";
        } catch (WrongIdPasswordException e) {
            errors.reject("idPasswordNotMatching");
            return "login/loginForm";
        }
    }
}
~~~
```

```ad-warning
title: 실제 쿠키 사용시 예제와 달리 암호와 및 보안을 고려해야 한다.
```
