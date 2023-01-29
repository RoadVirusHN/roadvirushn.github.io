---
title: Spring5 입문-객체 검증
date: 2023-01-25 16:11:10 +0900
tags: HIDE CRUDE 
layout: obsidian
is_Finished: false
last_Reviewed: 2023-01-25 16:11:10 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# 객체 검증
```ad-quote
title: 출처

_[초보 웹 개발자를 위한 스프링 5 프로그래밍 입문(최범균 저, 가메 출판사)](https://www.kame.co.kr/nkm/detail.php?tcode=306&tbook_jong=3)_의 내용을 바탕으로 정리한 내용입니다.
```

```ad-faq
title: 메시지를 이용한 로케일 부분은 나중에 프론트엔드에서 처리할 것이므로 생략했다. 백엔드에서 로케일에 따라 달리 처리할 일이 있을까?
```

## 커맨드 객체의 값 검증과 에러 메시지 처리

스프링에서 입력 값에 대해 검증하고 에러 메시지를 돌려주는 방법에 대해 알아보자.

### 커맨드객체 별 객체 검증 지정
#### `Validator` 구현
- `Validator` 인터페이스는 아래 메서드를 재정의하여 값의 타입을 구분하고, 검증한 뒤 에러를 찾아내는 역할을 한다.
	- `boolean Validator.supports(Class<?> clazz);` 메서드는 `Validator`가 검증할 수 있는 타입인지 검사.
	- `void Validator.validate(Object target, Errors errors);` 메서드는 첫번째 파라미터로 받은 객체를 검증 하고 `erros`에 담는다.
- `Errors` 인터페이스는 에러를 담아 메시지를 만들어 보여주는 역할을 한다.
```ad-seealso
title: `Errors`를 상속받는 `org.springframework.validation.BindingResult` 인터페이스를 대신 이용 가능하다.
```

```ad-example
title: 로그인 이메일 검증 예시(`/src/main/java/controller/RegisterRequestValidator.java`)
~~~java
package controller;
import java.util.regex.Matcher; //java Regex 사용
import java.util.regex.Pattern;

import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.validation.Validator;  

import spring.RegisterRequest;  

public class RegisterRequestValidator implements Validator {
    private static final String emailRegExp =
            "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@" +
            "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
    private Pattern pattern;  

    public RegisterRequestValidator() {
        pattern = Pattern.compile(emailRegExp); // regex 적용
        System.out.println("RegisterRequestValidator#new(): " + this);
    }

    @Override
    public boolean supports(Class<?> clazz) { // 검증할 수 있는 타입인가?
        return RegisterRequest.class.isAssignableFrom(clazz);
    } 

    @Override
    public void validate(Object target, Errors errors) { // 검사 후 다를경우 에러로 저장 구현
        System.out.println("RegisterRequestValidator#validate(): " + this);
        RegisterRequest regReq = (RegisterRequest) target; // 타입 캐스팅
        if (regReq.getEmail() == null || regReq.getEmail().trim().isEmpty()) // 검사 코드 
            errors.rejectValue("email", "required"); // 틀릴 시 변수명, 에러명으로 에러 등록
        } else {
            Matcher matcher = pattern.matcher(regReq.getEmail());
            if (!matcher.matches()) {
                errors.rejectValue("email", "bad");
            }
        }
        ValidationUtils.rejectIfEmptyOrWhitespace(errors, "name", "required");
        // 직접 구현하지 않고 ValidationUtils 클래스를 이용
        
        ValidationUtils.rejectIfEmpty(errors, "password", "required");
        ValidationUtils.rejectIfEmpty(errors, "confirmPassword", "required");
        if (!regReq.getPassword().isEmpty()) {
            if (!regReq.isPasswordEqualToConfirmPassword()) {
                errors.rejectValue("confirmPassword", "nomatch");
            }
        }
    }
}
~~~
```

-  `ValidationUtils` 클래스로 `validate` 메서드 내에 로직을 구현하지않고 직접 검사 및 에러 삽입을 할 수 있다.
	- `rejectIfEmptyOrWhitespace(Errors errors, String property_name, String error_name)`의 경우 `property_name` 필드가 비어있거나 공백 문자이면 `error_name`으로 에러를 등록하고 정상이면 넘어간다.

#### 컨트롤러 클래스에서의 에러 검증

앞선 `Validator`를 구현한 후, 컨트롤러에서 아래와 같이 사용 및 추가 에러 확인이 가능하다.

```ad-example
title: 컨트롤러에서의 커맨드 객체 검증 및 추가 검증
~~~java
//...
import org.springframework.validation.Errors;
import spring.DuplicateMemberException;
import spring.MemberRegisterService;
import spring.RegisterRequest;
//...

@Controller
public class RegisterController {

    private MemberRegisterService memberRegisterService;

    public void setMemberRegisterService(
            MemberRegisterService memberRegisterService) {
        this.memberRegisterService = memberRegisterService;
    }

    @PostMapping("/register/step3")
    public String handleStep3(RegisterRequest regReq, Errors errors) { // 커맨드 객체와 에러 객체 필요
        new RegisterRequestValidator().validate(regReq, errors); // 구현한 Validator 객체로 validate할 경우 errors 객체에 자동으로 에러가 추가됨.
        if (errors.hasErrors()) // 에러가 존재할 경우
            return "register/step2";
        try {
            memberRegisterService.regist(regReq);
            return "register/step3";
        } catch (DuplicateMemberException ex) { // 추가적인 에러 검증
            errors.rejectValue("email", "duplicate");
            return "register/step2";
        } catch (SqlInjectionDetectedExcpetion ex) { // 특정 속성이 아니라 전체 객체에 대한 에러 추가
	        errors.rejectValue("sqlInectionDetected"); 
	        return "register/step2"
        }
    }
~~~
```

```ad-warning
title: **주의!** 무조건 커맨드 객체 파라미터가 에러 객체 보다 앞에 위치해야함.
~~~java
// 에러 객체가 커맨드 객체보다 앞에 있으면 에러 발생
public String handleStep3(Errors errors, RegisterRequest regReq) {
	//...
}
~~~
```

#### Errors 클래스의 주요 메서드
`reject`는 커맨드 객체 전체에 대한 오류 메시지이다. 
- `reject(String errorCode)`
- `reject(String errorCode, String defaultMessage)`
- `reject(String errorCode, Object[] errorArgs, String defaultMessage)`

`rejectValue`는 커맨드 객체 특정 필드에 대한 오류 메시지이다.
- `rejectValue(String field, String errorCode)`
- `rejectValue(String field, String errorCode, String defaultMessage)`
- `rejectValue(String field, String errorCode, Object[] errorArgs, String defaultMessage)`

`errorArgs`는 에러코드 내에 `{0}, {1}` 같은 인덱스에 삽입될 값들이다.
`defaultMessage`는 에러코드에 해당하는 메시지가 없을 경우 에러가 나는 대신 출력된다.

#### ValidationUtils 클래스의 주요 메서드
- `rejectIfEmpty(Errors errors, String field, String errorCode)`
- `rejectIfEmpty(Errors errors, String field, String errorCode, Object[] errorArgs)`
- `rejectIfEmptyOrWhitespace(Errors errors, String field, String errorCode)`
- `rejectIfEmptyOrWhitespace(Errors errors, String field, String errorCode, Object[] errorArgs)`

<!-- vue에서 error 메시지 받는법 추가하기-->

### 글로벌 범위 Validator와 컨트롤러 범위 Validator 설정

매 매핑 메소드마다 Validator를 사용하지 않고 범위 별로 설정하여 손쉽게 어노테이션으로 사용할 수 있다.

#### 글로벌 Validator 설정 : `@Valid` 어노테이션
모든 컨트롤러에 적용할 수 있는 글로벌 Validator를 적용하려면 다음과 같은 과정이 필요하다.
1. **`javax.validation.validation-api` 의존 모듈 추가**
```ad-example
title: `pom.xml`
~~~xml
<dependency>
	<groupId>javax.validation</groupId>
	<artifactId>validation-api</artifactId>
	<version>1.1.0.Final</version>
</dependency>
~~~
```
2. **설정 클래스에 `getValidator()` 메서드 재정의**
```ad-example
title: `MvcConfig.java`
~~~java
import org.springframework.validation.Validator;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import controller.RegisterRequestValidator;

@Configuration
@EnableWebMvc
public class MvcConfig implements WebMvcConfigurer {
	@Override
	public Validator getValidator() {
		return new RegisterRequestValidator(); // 글로벌 Validator 객체를 리턴 
	}
	//...
}
~~~
```
- 전역 범위로 적용할 Validator 객체를 리턴하도록 설정해 준다.
3. **검증할 커맨드 객체에 `@Valid` 애노테이션 적용**
```ad-example
title: `RegisterController.java`
~~~java
import javax.validation.Valid;
//...

@Controller
public class RegisterController {
	//...
	@PostMapping("/register/step3")
    public String handleStep3(@Valid RegisterRequest regReq, Errors errors) { // 커맨드 객체에 @Valid 어노테이션 
        // new RegisterRequestValidator().validate(regReq, errors); // 생략가능
        if (errors.hasErrors()) 
            return "register/step2";
        try {
            memberRegisterService.regist(regReq);
            return "register/step3";
        } catch (DuplicateMemberException ex) { 
            errors.rejectValue("email", "duplicate");
            return "register/step2";
        } catch (SqlInjectionDetectedExcpetion ex) { 
	        errors.rejectValue("sqlInectionDetected"); 
	        return "register/step2"
        }
    }
}
~~~
```
```ad-warning
title: **주의!** 무조건 파라미터로 에러 객체가 주어져야 함.
~~~java
// 에러 객체가 주어지지 않으면 에러 발생 (400 에러)
public String handleStep3(RegisterRequest regReq) {
	//...
}
~~~
```

단, 하나의 Validator는 하나의 객체에만 검사가 유효하므로 보통 전역 범위 Validator는 사용하지 않는다.

#### 컨트롤러 범위 Validator 설정 : `@InitBinder` 어노테이션

특정 컨트롤러에서만 공통적으로 적용가능한 컨트롤러 범위 Validator를 적용하려면 다음과 같은 과정이 필요하다.

```ad-example
title: 컨트롤러 범위 Validator 설정(`RegisterController.java`)
~~~java
package controller;  

import javax.validation.Valid;

import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.InitBinder;

@Controller
public class RegisterController {
  
    @PostMapping("/register/step3")
    public String handleStep3(@Valid RegisterRequest regReq, Errors errors) {

        if (errors.hasErrors())
            return "register/step2";  

        try {
            memberRegisterService.regist(regReq);
            return "register/step3";
        } catch (DuplicateMemberException ex) {
            errors.rejectValue("email", "duplicate");
            return "register/step2";
        }
    }
    
	@InitBinder
	protected void initBinder(WebDataBinder binder) { // @Valid가 존재하는 메서드가 실행되기 전에 매번 실행됨.
		binder.setValidator(new RegisterRequestValidator()); // 컨트롤 범위 Validator 적용하기
		// 전역 Validator가 존재할 경우 덮어씀.
	}
}
~~~
```
- `binder.setValidator()` 메서드 대신 `bind.addValidator()` 메서드를 쓸 경우, 전역 Validator가 우선적으로 적용되므로 주의
### Bean Validation을 이용한 값 검증 처리

Bean Validation 스펙의 어노테이션들을 이용하면 굳이 Validator가 없어도 커맨드 객체를 검증할 수 있다.
통일된 방법으로 처리가 가능하고, 다른 프로그래밍 언어들도 사용하는 방식이므로 자주 사용된다.

1. **Bean Validation 관련 의존 모듈 추가**
```ad-example
title: `Bean Validation` 관련 의존 
2.0 버전을 이용하고 싶다면 버전들을 좀더 최신형으로 바꾸자.
~~~xml
<dependency>
	<groupId>javax.validation</groupId>
	<artifactId>validation-api</artifactId>
	<version>1.1.0.Final</version>
</dependency>
<dependency>
	<groupId>org.hibernate</groupId>
	<artifactId>hibernate-validator</artifactId>
	<version>5.4.2.Final</version>
</dependency>
~~~
```

2. **커맨드 객체 필드에 검증 규칙 어노테이션 설정**
```ad-example
title: 커맨드 객체 예시
~~~java
import javax.validation.constraints.Size;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotBlank;
import org.hibernate.validator.constraints.NotEmpty;

public class RegisterRequest {
	@NotBlank
	@Email
	private String email;
	@Size(min = 6)
	private String password;
	@NotEmpty
	private String confirmPassword;
	@NotEmpty
	private String name;
}
~~~
```

3. **설정 클래스에 `OptionalValidatorFactoryBean` 클래스를 빈으로 등록**
	- 기존에 사용하던 `@EnableWebMvc`를 사용하면 기본으로 설정되 있음
	- 단, 기존에 적용되있는 전역 Validator은 삭제되어야 Bean Validation을 사용가능하다.
4. **`@Valid` 어노테이션 적용**
```ad-example
title: 컨트롤러 예시
~~~java
@PostMapping("/register/step3")
public String handleStep3(@Valid RegisterRequest regReq, Errors errors) {
	if (errors.hasErrors())
		return "register/step2";

	try {
		memberRegisterService.regist(regReq);
		return "register/step3";
	} catch (DuplicateMemberException ex) {
		errors.rejectValue("email", "duplicate");
		return "register/step2";
	}
}
~~~
```
- 앞선 다른 범위와 마찬가지로 Bean Validation을 적용한 커맨드 객체 앞에 `@Valid`를 함께 써주면 된다.

#### `Bean Validation`의 주요 애노테이션
사용하는 모듈, 기술 스택에 따라 지원하는 애노테이션이 다르다.
자세한 것은 [공식 문서](https://beanvalidation.org/resources/) 참조
- `@Max`, `@Min` : 지정한 값보다 크거나 작으면 오류, `null`은 유효로 판단
- `@Null`, `@NotNull` : 값이 `null`이거나 아니면 오류
- `@Pattern` : 정규표현식 매칭 여부로 오류 판단
- `@Email` : 이메일 형식의 주소인지 판단