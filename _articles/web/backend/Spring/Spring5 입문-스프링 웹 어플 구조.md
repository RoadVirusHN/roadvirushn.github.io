---
title: Spring5 입문-스프링 웹 어플 구조
date: 2023-01-26 21:35:04 +0900
tags: HIDE CRUDE 
layout: obsidian
is_Finished: false
last_Reviewed: 2023-01-26 21:35:04 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# 스프링 웹 어플 구조
```ad-quote
title: 출처

_[초보 웹 개발자를 위한 스프링 5 프로그래밍 입문](https://www.kame.co.kr/nkm/detail.php?tcode=306&tbook_jong=3)_와 [스프링 인 액션](https://jpub.tistory.com/1040)의 내용을 바탕으로 정리한 내용입니다.
```

## 간단한 웹 어플리케이션 구성 요소

사용자 -> Dispatcher Servlet -> 컨트롤러 -> 서비스 -> DAO 순으로 접근함.

- **프론트 서블릿**
	- 사용자의 모든 요청을 받는 창구 역할
		- MVC 패턴에서 `DispatcherServlet`
- **컨트롤러 + 뷰**
	- 컨트롤러는 브라우저의 요청을 처리하기 위해 알맞은 서비스에게 처치를 위임
	- 뷰는 응답 결과를 사용자가 보기 쉽게 표현
- **서비스**
	- 기능의 핵심 로직을 구현, 실제 작업이 일어나는 곳
- **DAO(Data Access Object)**
	- DB와 연동을 위해 데이터를 담아 이동하는 역할
	- 가끔 간단한 로직에서는 서비스가 아닌 컨트롤러가 직접 사용하기도 함.
```ad-example
title: DAO를 직접 사용하는 컨트롤러 메서드 예시
다만, 호불호 갈리는 방식일 수 있다.
~~~java

//public Member getMember(Long id) {
// 	return memberDao.selectById(id);
//}

@RequestMapping("/member/detail/{id}")
public String detail(@PathVariable("id") Long id, Model model) {
	// 사실상 DAO를 직접 호출하는 것과 동일
	// Member member = memberService.getMember(id);
	Member member = memberDao.selectByEmail(id);
	if (member == null){
		return "member/notFound";
	}
	model.addAttribute("member", member);
	return "member/memberDetail";
}
~~~
```

## 서비스의 구현
서비스는 실제로 보통 여러 단계로 이루어지며, 이를 한꺼번에 적용 혹은 취소해야 되므로 `@Transactional`을 이용해서 트랜잭션 범위 내에 실행되곤 한다.

```ad-example
title: 비밀번호 변경 트랜잭션 과정
1. DB에서 회원 데이터 가져오기
2. 존재하지 않을 시 익셉션
3. 회원 데이터 비밀번호 변경
4. 변경 내역 DB에 반영
```

서비스 클래스는 보통 하나의 데이터 정의나 기능 별로 나눈다.
- 예를 들어 `MemberService`는 데이터로 나눈 서비스
- 예를 들어 `MemberRegisterService`는 추가로 기능으로 나눈 서비스

서비스 클래스 내의 메서드의 파라미터는 하나의 커맨드 객체로 만들어 전달하면 컨트롤러 클래스에서 MVC의 바인딩, 검증, 연동 등의 기능을 쉽게 활용할 수 있다.
```ad-example
title: 커맨드 객체로 파라미터 변경
`public void changePassword(String email, String oldPwd, String newPwd)` -> `public void changePassword(ChPwdRequest req)`
```

서비스의 결과 값은 
- 정상일 경우, 리턴값
- 비정상일 경우, 익셉션 일으키기
여야 하며, 이를 컨트롤러 측에서 catch 구문으로 익셉션을 처리한다.

## 프로젝트 패키지 구성

패키지 구성은 기본적으로 프로젝트마다 다르지만, 대략적인 예시를 들어보자

- 컨트롤러, Validator 등이 존재하는 웹 요청 처리영역
	- 웹 요청 처리 영역은 `memeber`, `changPwd` 등 데이터나 기능 영역으로 추가로 나눈다.
- 서비스, DAO, 모델 클래스 등이 존재하는 기능 제공 영역
	- 추가로 DAO, 서비스, 모델 등으로 추가로 나눈다.

규모가 커지면 프로젝트 복잡도가 크게 늘어나며 이를 방지하기 위해 **도메인 주도 설계**를 알아보고 적용해보자.