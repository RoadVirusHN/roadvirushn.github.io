---
title: Spring5 입문-의존성 주입(DI)
date: 2023-01-06 13:50:29 +0900
tags: HIDE CRUDE
layout: obsidian
is_Finished: false
last_Reviewed: 2023-01-06 13:50:29 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# 의존성 주입(DI)

```ad-quote
title: 출처

_[초보 웹 개발자를 위한 스프링 5 프로그래밍 입문(최범균 저, 가메 출판사)](https://www.kame.co.kr/nkm/detail.php?tcode=306&tbook_jong=3)_의 내용을 바탕으로 정리한 내용입니다.
```

**스프링은 다양한 객체에 대한 의존성 주입을 지원하는 조립기의 역할을 하는 객체 컨테이너**다.
- 아래 내용을 참고해 각 용어에 대한 이해를 하고 위 문장을 다시 이해해보자!

## 의존(Dependency)

의존성 주입을 통해 의존에 의해 생기는 문제점들을 해결할 수 있다.
- 의존하고 있는 객체 코드 변경 시, 의존성 주입을 담당 객체 코드만 바꾸면 되므로 수정 최소화
- 객체를 싱글톤으로 하나만 이용하여 자원 사용을 최소화
- 객체를 중앙 관리하여 무결성 등의 문제가 줄어듦

- **의존(Dependency)** : 변경에 의해 영향을 받는 관계 (ex) 상속 관계, 특정 객체의 메소드, 변수를 사용하는 다른 객체 관계)
	- 예를 들어 부모 클래스는 자식 클래스의 변경에 영향을 받지 않지만, 자식 클래스는 부모 클래스에 변경에 영향을 받으므로 자식은 부모에 의존하는 관계이다.
- **의존성 주입(Dependency Injection)** : 어떤 객체가 의존하는 객체를 직접 생성하는 대신 의존 객체를 대신 생성한 객체로 부터 전달받는 방식
	- 직접 의존성 주입을 코딩하지 않고 스프링에서 자동으로 지원한다. [[Spring5 입문-의존 자동 주입]]
- **조립기(assembler)** : 의존 객체를 생성 혹은 검색한 뒤 전달해주는 클래스, 두 객체를 조립하는 것처럼 보여 조립기라고 함.
```ad-example
title: 간단한 의존성 주입과 조립기 예시
~~~java
Assembler assembler = new Assembler(); // 조립기
MemberDao memberDao = assembler.getMemberDao(); // 객체 주입을 위한 생성 혹은 기존 객체 가져오기(싱글톤 패턴)
ChangePwService pwSvc = new ChangePwService();  // new ChangePwService(memberDao) 생성자 방식 객체 주입
pwdSvc.setMemberDao(memberDao;// pwSvc에 setter 방식 객체 주입
~~~
```

## 설정 객체

```ad-example
title:  스프링 설정 클래스 생성 예시(src/main/java/config/AppCtx.java)
~~~java
package config;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import spring.ChangePasswordService;
import spring.MemberDao;

@Import({AppConf2.class, AppConf3.class}) // 다른 설정 클래스 정보를 가져와 합침
@Configuration // 스프링 설정 클래스 임을 표시
public class AppCtx {	
	private Something something = new Something(); // 빈 아닌 객체도 존재 가능, 단, 의존성 주입 및 관리, 검색 기능을 사용할 수 없다.
	
	@Autowired
	private MemberPrinter printer; // @Autowired 어노테이션을 통한 자동 주입 
	// 아래 memberDao 처럼 메서드를 정의해줄 필요 없다.
	
	@Bean// 스프링 빈 생성을 위한 메서드임을 표시
	public MemberDao memberDao() {
		return new MemberDao();
	}

	@Bean
	public ChangePasswordService changePwdSvc() {
		ChangePasswordService pwdSvc = new ChangePasswordService();
		pwdSvc.setMemberDao(memberDao()); // 설정 클래스 내부의 다른 객체를 사용할 때 평범하게 생성자를 이용하면 됨. (이유 아래 설명)
		return pwdSvc;
	}
}
~~~
```
- **설정 클래스** : 스프링 컨테이너 생성을 위한 설정과 빈 객체 정보를 포함한 클래스
	- 코드가 길 경우 여러 클래스로 나눌 수 있다. 위와 같이 `@Import`를 사용하거나 스프링 컨테이너 선언 시 여러 설정 클래스를 지정해주면 됨. 
- `@Configuration`: 설정 클래스 지정 어노테이션, 설정을 통해 생성 객체와 의존 주입 대상을 정함.
```ad-seealso
엄밀히 말하면 설정 클래스 내부의 객체들을 싱글톤 패턴으로 바꾸기 위해 위 설정 클래스를 상속한 새로운 클래스를 만들어 사용한다. 

이를 통해 평범한 생성자를 구현했던 등록한 객체들 또한 싱글톤 패턴이 보장되는 빈 객체로 바꾼다.
```

