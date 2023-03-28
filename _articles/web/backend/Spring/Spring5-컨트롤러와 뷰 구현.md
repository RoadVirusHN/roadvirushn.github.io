---
title: Spring5-컨트롤러와 뷰 구현
date: 2023-01-20 17:34:30 +0900
tags: WEB SPRING BE SUMMARY HIDE
layout: obsidian
is_Finished: false
last_Reviewed: 2023-01-23 17:34:30 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# 컨트롤러와 뷰 구현
```ad-quote
title: 출처

_[초보 웹 개발자를 위한 스프링 5 프로그래밍 입문](https://www.kame.co.kr/nkm/detail.php?tcode=306&tbook_jong=3)_와 [스프링 인 액션](https://jpub.tistory.com/1040)의 내용을 바탕으로 정리한 내용입니다.
```

개발 설정은 대부분 극초기에 끝나며 개발의 대부분은 컨트롤러와 뷰의 구현이다. 컨트롤러는 특정 요청과 응답을 처리는 컴포넌트이며, 뷰는 처리 결과를 HTML과 같은 형식으로 응답한다.

```ad-seealso
title: 특별한 모델이나 처리가 필요 없는 컨트롤러 자동 추가법
collapse: close
~~~java
@Controller
public class MainController {
	@RequestMapping("/main")
	public String main() {
		return "main";
	}
}
~~~
위와 같이 간단한 컨트롤러는 아래와 같이 `WebMvcConfigurer`를 상속한 구성 클래스와 `ViewControllerRegistery`를 따로 클래스를 만들지 않고 추가할 수 있다.

~~~java
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;

@Configuration
@EnableWebMvc
public class MvcConfig implements WebMvcConfigurer {
	@Override
	public void addViewControllers(ViewControllerRegistry registry) {
		registry.addViewController("/main").setViewName("main");
	}	
}
~~~
위처럼 `addViewControllers` 메소드를 재정의한 뒤 추가할 수 있다.
```

## 요청 매핑 애노테이션

앞서 [[Spring5-MVC 개념과 설정#MVC 패턴|컨트롤러를 구현하는 방법]]을 배웠을 때, 요청 경로 지정에 사용되는 어노테이션 사용법에 대해 배워보자.

```ad-tip
title: 이 부분을 잘못 설정할 경우 404 에러가 많이 일어난다. 예를 들어 요청 경로나 설정 경로 오류, 컨트롤러 빈 등록(또는 `@Controller` 사용) 안함, 뷰로 지정한 JSP 파일 없음 
```

주로 컨트롤러 클래스 내외부에 요청 경로에 따른 뷰를 구성할 메소드 위에 어노테이션을 이용해 구현한다.

```ad-example
title: 메서드 별 처리 구분

~~~java
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class RegistController {
	// 접두어로 "/"를 포함하면 홈 경로부터 시작한다. 
	@RequestMapping("/register/step1") // = https://serviehome/register/step1
	public String handleStep1() {
		return "register/step1"; // view로 사용할 JSP 파일 경로
	}
	// RequestMapping은 메서드 방식에 관계없이 실행됨

	// method 속성 혹은 그 아래 메서드별 매핑 어노테이션으로 메서드 방식을 지정해줄 수 있음.
	@RequestMapping("/register/step2", method = RequestMethod.POST) // POST 요청인 경우에만 해당 
	public String handleStep2() {
		....
	}

	@GetMapping("/register/step2") // Get 요청인 경우에만 해당
	public String handleStep2() {
		....
	}
	// 이외에도 PUT, DELETE, PATCH 어노테이션도 존재함.
}
~~~
```

아래처럼 컨트롤러에 함께 어노테이션을 적용하면 공통 경로를 지정해줄 수 있다.

```ad-example
title: 공통경로 지정
`@ResponseStatus(HttpStatus 객체)`를 이용해 201(생성됨), 204(삭제되서 없어짐) 등 더욱 적절한 상태를 돌려줄 수 있다.
~~~java
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.http.HttpStatus;

@Controller
@RequestMapping("/register") // 공통 경로
public class RegistController {
	
	@RequestMapping("/step1") // = https://serviehome/register/step1
	public String handleStep1() {
		return "register/step1";
	}
	
	@GetMapping("/step2") //  = https://serviehome/register/step2
	public String handleStep2() {
		....
	}

	@PostMapping(consumes="application/json") // = https://serviehome/register, 추가로 Content-type 헤더가 application/json 이어야 함.
	@ResponseStatus(HttpStatus.CREATED) // 요청의 상태를 201로 보내줌
	public Taco handleStep3(@RequestBody Taco taco){
		return tacoRepo.save(taco)
	}
}
~~~
```

만약 리다이렉트를 구현하고 싶으면 아래와 같이 `redirect:대상주소`를 리턴해주면 된다.

```ad-example
title: 리다이렉트 구현 예시
~~~java
@Controller
public class RegistController {

	@RequestMapping("/register/step1") //리다이렉트 대상 경로
	public String handleStep1() {
		return "register/step1"; 
	}

	@RequestMapping("/register/step2") 
	public String handleStep2() {
		return "redirect:/register/step1" // 위 메서드로 리다이렉트 됨
	}
}
~~~
```

## 요청 파라미터 접근
- GET 메소드의 경우, URL에 쿼리스트링 형식으로 요청 파라미터를 전송
- POST 메소드의 경우, 메시지의 `body`에 요청 파라미터를 전송
이러한 요청 파라미터들에게 접근하는 방법을 알아보자.

### 간단한 방법
짧고 간단한 파라미터들의 경우에 적용가능한 방법이다.
복잡한 방법은 아래에 커맨드 객체 이용을 추천

#### `HttpServletRequest` 객체 이용
컨트롤러 처리 메서드 파라미터에 `HttpServletRequest` 객체를 넘겨주면 `getParameter(인자명)`을 통해 가져올 수 있다.
```ad-example
title: `HttpServletRequest` 객체 전달 예시
~~~java
import javax.servlet.http.HttpServletRequest;

@Controller
public class RegisterController {
	@RequestMapping("/register/step1")
	public String handleStep1(HttpServletRequest request) {
		String agreeParam = request.getParameter("agree");
		if (agreeParam == null || !agreeParam.equals("true")) {
			return "register/step1";
		}
		return "register/step2";
	}

}
~~~
```

#### `@RequestParam` 애노테이션 이용
특정 파라미터의 갯수와 이름, 타입 등을 강제하고 싶다면 `@RequestParam`을 이용하면 된다. 파라미터가 부족하거나 이름이 다르거나, 타입으로 변환이 불가능한 경우 400에러를 일으킨다.
```ad-example
title:  `@RequestParam` 객체 전달 예시
~~~java
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class RegisterController {

	@PostMapping("/register/step2")
	public String handleStep2(
		@RequestParam(value="agree", defaultValue="false") Boolean agree) { // yes, no 처럼 boolean 변환이 불가능하면 에러 발생
		if (!agree) {
			return "register/step1";
		}
		return "register/step2";
	}

}
~~~
```

다만 이 방법은 요청 파라미터가 많다면 코드가 아주 길어질 것이다.

```ad-note
title: `@RequestParam`의 속성들

|속성|타입|설명|
|-----|-----|-----|
|value|String|HTTP 요청 파라미터의 이름을 지정|
|required|boolean|필수 여부를 지정한다. 이 값이 true이면서 해당 요청 파라미터에 값이 없으며 익셉션이 발생한다. 기본값은 true이다.|
|defaultValue|String|요청 파라미터가 값이 없을 때 사용할 문자열 값을 지정한다. 기본값은 없다.|

```

```ad-example
title: view 예시
아래와 같이 post 요청 파라미터를 충족할 수 있어야 한다.
~~~html
<form action="step2" method="post">
	<label>
	<input type="checkbox" name="agree" value="true">
	약관 동의
	</label>
	<input type="submit" value="다음 단계" />
</form>
~~~
```

### 커맨드 객체 이용
조금 복잡하지만, 코드를 많이 줄여주고 가독성이 좀 더 좋은 방법이다.

#### 커맨드 객체를 파라미터로 넣어주기

만약 매핑 메소드의 파라미터로 주어지는 객체의 변수 값과 세터 메서드가 요청 파라미터와 일치한다면, 스프링이 자동으로 세터매소드를 이용해 전달해준다.
```ad-example
title: 커맨드 객체 예시

~~~java
package spring;
public class RegisterRequest {
	private String email;
	private String password;

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}
}
~~~
```

```ad-example
title: 커맨드 객체 전달 예시
~~~java
import spring.RegisterRequest;
...
@PostMapping("/register/step3")
public String handleStep3(RegisterRequest regReq) {
	// regReq.getEmail(), regReq.getPassword() 값이 지정되어 있음
	// 요청 파라미터와 동일한 변수명과 세터 메서드가 포함된 커맨드 객체를 전달하면
	// 스프링이 자동으로 요청 매핑 값을 전달해준다.
	try {
		memberRegisterService.regist(regReq);
		return "register/step3";
	// 또한 자동으로 regReq가 모델이 되어 뷰에서 접근 가능
	// @ModelAttribute(새 모델명)로 모델명을 기본 타입명에서 새로 바꿔줄 수 있다.
	} catch (DuplicateMemberException ex) {
		return "register/step2";
	}
}
...
~~~
```
이 방법을 이용하면 나중에 뷰에서 모델에 접근하기도 편해진다. 
만약 뷰에서 커맨드 객체 속성 이름을 바꾸고 싶다면 아래처럼 `@ModelAttribute(바꿀문자열)`로 바꾸면 된다.
```ad-example
title: 커맨드 객체명 바꾸기
또한  `register/step3`에 요청시`regReq`를 요청 매개변수로 바인딩하지 않도록 하는 역할도 있음.
~~~java
import org.springframework.web.bind.annotation.ModelAttribute;

@PostMapping("/register/step3")
public String handleStep3(@ModelAttribute("formData") RegisterRequest regReq) {
	// ...
}
~~~
```

#### 중첩, 콜렉션 프로퍼티
커맨드 객체에 다른 커맨드 객체를 포함하거나 리스트 같은 콜렉션을 포함한 경우에도 다음과 같이 적용가능하다.
```ad-example
title: 리스트와 다른 커맨드 객체가 포함된 커맨드 객체 예시

~~~java
package survey;

import java.util.List;

public class AnswerData {
	private List<String> responses; // 리스트
    private Respondent res; // 다른 커맨드 객체

	public List<String> getResponses() {
        return responses;
    }

	public void setResponses(List<String> responses) {
        this.responses = responses;
    }

    public Respondent getRes() {
        return res;
    }

    public void setRes(Respondent res) {
        this.res = res;
    }
}
~~~
```
  
```ad-example
title: 중첩 콜렉션 커맨드 객체 전달 예시

~~~java
package survey;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute; 

@Controller
@RequestMapping("/survey")
public class SurveyController {
    @GetMapping
    public String from(Model model) { // 모델을 이용한 강제 할당
        List<Question> questions = createQuestions();
        model.addAttribute("questions", questions);
        return "survey/surveyForm";
    } 

    private List<Question> createQuestions() {
        Question q1 = new Question("당신의 역할은 무엇입니까?",
            Arrays.asList("서버", "프론트", "풀스택"));
        Question q2 = new Question("많이 사용하는 개발도구는 무엇입니까?",
            Arrays.asList("이클립스", "인텔리J", "서브라임"));
        Question q3 = new Question("하고 싶은 말을 적어주세요.");
        return Arrays.asList(q1, q2, q3);
    }

    @PostMapping
    public String submit(@ModelAttribute("ansData") AnsweredData data) {
        // data.res.name, data.responses[0] 등이 할당되어 있다.
        return "survey/submitted";
    }
}
~~~
```

#### `@SessionAttributes`와 `SessionStatus`
만약, 한 세션 간에 여러 요청 주소에 걸쳐 같은 커맨드 객체를 유지하고 싶다면 `@SessionAttributes`을 이용해 속성에 넣어주면 유지됨.

더 이상 유지하고 싶지 않으면 `SessionStatus`의 `setComplete()` 메소드로 세션 재설정이 가능
```ad-example
title: `@SessionAttributes`와 `SessionStatus`의 활용
~~~java
//...
import org.springframework.web.bind.annotation.SessionAttributes;
import org.springframework.web.bind.support.SessionStatus;

import lombok.extern.slf4j.Slf4j;
import tacos.Order;
import tacos.data.OrderRepository;
import javax.validation.Valid;
import org.springframework.validation.Errors;  

@Slf4j
@Controller
@RequestMapping("/orders")
@SessionAttributes("order")
public class OrderController {

    private OrderRepository orderRepo;
    public OrderController(OrderRepository orderRepo) {
        this.orderRepo = orderRepo;
    }

    @GetMapping("/current")
    public String orderForm() {
        return "orderForm";
    }

    @PostMapping
    public String processOrder(@Valid Order order, Errors errors, SessionStatus sessionStatus) {
        if (errors.hasErrors()) {
            return "orderForm";
        }
        orderRepo.save(order);
        sessionStatus.setComplete();
        return "redirect:/";
    }
}
~~~
```

### `Model` 클래스 파라미터 이용하기
혹은 아래처럼 모델 클래스를 이용해 직접 넣어줄 수 있다.

```ad-example
title: `Model` 클래스 이용
~~~java
package controller;

import org.springframework.ui.Model;
//...

@Controller
public class RegisterController {
	//...
	@PostMapping("/register/step2")
	public String handleStep2(
	@RequestParam(value="agree", defaultValue="false") Boolean agree, Model model) {
		if (!agree) {
			return "register/step1";
		}	
		model.addAttribute("registerRequest", new RegisterRequest());
		model.addAttribute("greeting", "안녕하세요!");
		return "register/step2";
	}
}
~~~
```

위 예시는 JSP 파일을 공유 시, 오류를 방지하기 위해 빈 커맨드 객체를 넣어주는 방법이다. 추가로 JSP 내에 사용할 `greeting`이란 속성에 값을 할당해 주었다.

### `ModelAndView`를 통한 뷰 선택과 모델 전달

컨트롤러 내부에  매핑 메소드의 리턴값으로 뷰로 삼을 뷰 파일 경로의 문자열 대신, `ModelAndView`를 돌려주게 할 수 있다.
이를 통해 모델값과 뷰를 동시에 지정해줄 수 있다.
```ad-example
title: `ModelAndView` 예시
~~~java
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping("/survey")
public class SurveyController {

	@GetMapping
	public ModelAndView form() {
		List<Question> questions = createQuestions();
		ModelAndView mav = new ModelAndView();
		mav.addObject("questions", questions);
		mav.setViewName("survey/surveyForm");
		return mav;
	}
}
~~~
```


## 뷰 구현
주로 React, Vue로 뷰를 구성할 예정인데, 책에서의 대부분 내용이 JSP에 대한 내용이므로 생략하겠다.

대신, 나중에 웹 어플리케이션 부근에서 [[Spring5-JSON 응답과 요청 처리]]에서 뷰 구현 방법을 배울 것이다.

### 주요 폼 태그
스프링 MVC는 자체적인 [JSP 태그 라이브러리](https://docs.spring.io/spring-framework/docs/4.2.x/spring-framework-reference/html/spring-form-tld.html)를 제공하여 쉽게 데이터 바인딩을 처리하게 한다.

JSP 관련이므로 생략
