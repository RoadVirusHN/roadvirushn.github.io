---
title: Spring5 입문-의존 자동 주입
date: 2023-01-09 05:12:40 +0900
tags: HIDE CRUDE 
layout: obsidian
is_Finished: false
last_Reviewed: 2023-01-09 05:12:40 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# Spring5 입문-의존 자동 주입
```ad-quote
title: 출처

_[초보 웹 개발자를 위한 스프링 5 프로그래밍 입문(최범균 저, 가메 출판사)](https://www.kame.co.kr/nkm/detail.php?tcode=306&tbook_jong=3)_의 내용을 바탕으로 정리한 내용입니다.
```
## @Autowired
`@Autowired`는 스프링이 해당 타입에 일치하는 `@Bean` 객체를 찾아 주입해주는 어노테이션이다.
- 같은 클래스나 심지어 자식 클래스를 내놓는 다른 메소드가 두개 이상일 경우에도 오류가 난다. 이럴 때는 [[#@Qualifier]]를 통해 선택하면 된다.
- 만약, `@Autowired`와 수동 할당을 동시에 사용하면 `@Autowired`가 우선으로 덮어씌운다.
```ad-example
title: `@Autowired`의 사용례
~~~java
import org.springframework.beans.factory.annotation.Autowired;
public class ChangePasswordService {
	@Autowired // ChangePasswordService 인스턴스 생성시 스프링이 직접 주입
	private MemberDao memberDao;
	
	//...

	// @Autowired에 의해 더 이상 쓸모없어진 메서드
	// public void setMemberDao(MemberDao memberDao) {
	//	this.memberDao = memberDao;
	// }
}
~~~
```

```ad-example
title: `@Autowired`의 다른 사용례
아래와 같이 세터 메서드에 대신 사용해도 된다.
~~~java
import org.springframework.beans.factory.annotation.Autowired;
public class MemberInfoPrinter {
	private MemberDao memDao;
	@Autowired
	private MemberPrinter printer;

	//@Autowired에 의해 더이상 생성자에 객체를 넘겨줄 필요가 없음
	public MemberListPrinter(
		//MemberDao memberDao, MemberPrinter printer	
	) {	
		//this.memberDao = memberDao;
		//this.printer = printer;	
	}

	@Autowired
	public void setMemberDao(MemberDao memberDao) {
		this.memDao = memberDao;
	}	
	// public void setPrinter(MemberPrinter printer) {
	// 	this.printer = printer;
	// }
}
~~~
```

일치하는 클래스의 빈 객체가 설정 클래스 내에 없으면 오류가 난다. 만약 의도적으로 빈 객체를 지정하지 않아도 되게 만드려면 다음과 같이 3개의 방법이 있다.
```ad-example
title: Nullable 빈 객체가 필요한 경우 예시
collapse: close
~~~java
private DateTimeFormatter dateTimeFormatter;
public void print(Member member) {
	if (dateTimeFormatter == null) { // 빈 객체가 없어도 되는 로직
		//..
	} else { // 빈 객체가 있어야 하는 로직
		//...
	}
}

@Autowired // autowired에 의해 오류 발생
public void setDateFormatter(DateTimeFormatter dateTimeFormatter) {
	this.dateTimeFormatter = dateTimeFormatter;
}
~~~
```

```ad-example
title: `@Autowired(required=false)` 방법
다른 방법들과 다르게 해당하는 빈 객체가 존재하지 않다면 세터 메서드가 실행되지 않기 때문에 아래와 같이 기본 생성자를 통해 기본 값을 주고 싶은 경우 사용하면 좋다.
~~~java

@Autowired(require=false)
private DateTimeFormatter dateTimeFormatter; 
// 혹은
@Autowired(require=false)
public void setDateFormatter(DateTimeFormatter dateTimeFormatter) {
	this.dateTimeFormatter = dateTimeFormatter; 
}

public MemberPrinter() {
	dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일");
}
~~~
```
```ad-example
title:  Java8 이상에서`Optional` 방법
Optional 객체가 대신 전달되며 이를 이용할 수 있음.
~~~java
@Autowired
public void setDateFormatter(Optional<DateTimeFormatter> formatterOpt) {
	if (formatterOpt.isPresent()){
		this.dateTimeFormatter = formatterOpt.get(); 
	} else {
		this.dateTimeFormatter = null;
	}
}
// 혹은
@Autowired
private Optional<DateTimeFormatter> formatterOpt;
~~~
```
```ad-example
title: `@Nullable` 방법
단, 이 방법은 다른 방법 `require=false`와 다르게 `setDateFormatter` 메서드가 호출이 된다.
따라서 해당 변수에는 `null` 값이 무조건 들어가게 된다.
~~~java
import org.springframework.lang.Nullable;

@Autowired
public void setDateFormatter(@Nullable DateTimeFormatter dateTimeFormatter) {
	this.dateTimeFormatter = dateTimeFormatter; 
}

@Autowired
@Nullable
private DateTimeFormatter dateTimeFormatter; 
~~~
```
빈 객체 자동 주입은 가장 자주 사용하는 `@Autowired` 이외에도 `@Resource, @Inject`등이 존재한다.

## @Qualifier
동일 클래스 혹은 자식 클래스 등 할당 가능한 여러 빈 객체 중 자동 주입 대상 빈을 한정하는데 사용하는 어노테이션
```ad-example
title: `@Qualifier` 사용법 1:  `@Bean`에서 명칭 설정
~~~java
import org.springframework.context.annotation.Bean;
import org.springframework.beans.factory.annotation.Qualifier;
@Bean
@Qualifier("printer")
public MemberPrinter memberPrinter1() {
	return new MemberPrinter();
}
@Bean
public MemberSummaryPrinter memberPrinter2() { // MemberPrinter를 상속받은 객체
	return new MemberSummaryPrinter();
}
~~~
```

```ad-example
title: `@Qualifier` 사용법 2: `@Autowired`에서 명칭으로 지정
만약 사용하려는 빈 객체의 `@Qualifier`가 없다면 해당 메소드명을 한정자로 사용할 수 있다.
~~~java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
@Autowired
@Qualifier("printer")
public void setMemberPrinter(MemberPrinter printer) {
	this.printer = printer;
}
@Autowired 
@Qualifier("memberPrinter2") // 자식 객체인 MemberSummaryPrinter 객체가 주입됨
public void setMemberPrinter(MemberPrinter printer) { 
	this.printer = printer; 
}
~~~
```
