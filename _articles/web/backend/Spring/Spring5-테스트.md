---
title: Spring5-테스트
date: 2023-02-08 14:27:34 +0900
tags: HIDE CRUDE 
layout: obsidian
is_Finished: false
last_Reviewed: 2023-02-08 14:27:34 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# Spring5-테스트

```ad-quote
title: 출처

_[초보 웹 개발자를 위한 스프링 5 프로그래밍 입문](https://www.kame.co.kr/nkm/detail.php?tcode=306&tbook_jong=3)_와 [스프링 인 액션](https://jpub.tistory.com/1040)의 내용을 바탕으로 정리한 내용입니다.
```

`Spring boot`를 이용하면 `JUnit`을 이용한 테스팅 코드를 작성할 수 있다.

### 기본 테스트 파일

```ad-example
title: `src/test/java/Sp5ChapbApplicationTests.java`
첫 스프링 부트 프로젝트 시작하면 아래와 같은 기본 테스트 코드가 나온다.
~~~java
package sp5chapb;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest // Junit으로 스프링 부트 테스트 시작
class Sp5ChapbApplicationTests {

	@Test // 테스트 항목
	void contextLoads() {
	// 아무것도 없으면 단순 스프링 앱 컨텍스트 로드
	fail("Not yet implemented"); //테스트 실패
	}

}
~~~
```
Spring suite와 Spring boot를 같이 사용하면 내장된 `JUnit`을 통해 `Run As`-> `Junit Test`로 테스트 가능하다.
이후 실패와 성공 갯수를 비교하고 실패 원인을 출력해준다.

### 스프링 MVC 테스트 코드
```ad-example
title: 컨트롤러 테스팅 코드

~~~java
package tacos;
import static org.hamcrest.CoreMatchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(HomeController.class) // 테스트할 컨트롤러 지정
class HomeControllerTest {
	
	@Autowired
	private MockMvc mockMvc; // 실제 서버 대신 가짜 요청을 보낼 빈 객체 주입
	
	@Test // 하나의 테스트 항목을 정의
	public void testHomePage() throws Exception {
		mockMvc.perform(get("/")) // 요청을 생성
			.andExpect(status().isOk()) // status 체크
			.andExpect(view().name("home")) // 뷰 체크
			.andExpect(content().string(containsString("Welcome to..."))); // 페이지 내부의 내용 검색
	}
}
~~~
```
- `@WebMvcTest`는 스프링 MVC를 테스트하기 위한 스프링 부트의 제공 어노테이션이다.
