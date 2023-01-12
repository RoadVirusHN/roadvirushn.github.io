---
title: Spring5 입문 - 컴포넌트 스캔(Component Scan)
date: 2023-01-09 14:57:33 +0900
tags: HIDE CRUDE 
layout: obsidian
is_Finished: false
last_Reviewed: 2023-01-09 14:57:33 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# Spring5 입문-컴포넌트 스캔(Component Scan)
```ad-quote
title: 출처

_[초보 웹 개발자를 위한 스프링 5 프로그래밍 입문(최범균 저, 가메 출판사)](https://www.kame.co.kr/nkm/detail.php?tcode=306&tbook_jong=3)_의 내용을 바탕으로 정리한 내용입니다.
```
## @Component

`@Component`가 붙어있는 클래스는 컴포넌트 스캔에 의해 빈(bean)으로 등록될 수 있다.
```ad-example
title: `@Component` 사용례

~~~java
package spring;
import org.springframework.stereotype.Component;

@Component // memberDao 라는 이름으로 빈 객체 등록
public class MemberDao{

}
@Component("infoPrinter") // infoPrinter 라는 이름으로 빈 객체 등록
public class MemberInfoPrinter{

}
~~~
```
컴포넌트들은 패키지 별로 같은 이름이 있으면 충돌하며, 수동 등록한 빈이 있으면 수동 등록이 우선수되므로 명시적으로 이름을 바꿔주거나 네이밍 규칙을 잘 선정하자.
## @ComponentScan
앞서 `@Component`를 붙인 클래스들을 스캔하려면 기존의 설정 클래스를 이용하면 된다.
```ad-example
title: `@ComponentScan` 사용례
~~~java
import org.springframework.context.annotation.ComponentScan;
@Configuration // 스프링 설정 클래스 임을 표시
@ComponentScan(basePackages = {"spring"} // spring 패키지 내의 @Component 탐색
	excludeFilters = {
	@Filter(type = FilterType.ASPECTJ, pattern = "spring.*Dao"),//Dao로 끝나는 클래스 타입은 스캔에서 제외, aspectjweaver 모듈 필요
	@Filter(type = FilterType.ASSIGNABLE_TYPE, classes=MemberDao.class)//MemberDao 타입과 그 자식 클래스들 제외
	})
public class AppCtx {
	//...
}
~~~
```
`@ComponentScan`의 스캔에 제외하려면 `excludeFilters` 속성에 Regex, Aspectj 등의 필터를 사용할 수 있다.
	- `FilterType.ANNOTATION` 필터 타입을 이용하면 특정 애노테이션을 붙인 클래스도 제외 가능

추가로 다음과 같은 어노테이션이 붙은 클래스들 또한 스캔된다.
- `@Controller`
- `@Service`
- `@Repository`
- `@Aspect`
- `@Configuration`
위 어노테이션들은 `@Aspect`를 제외하곤 실제로 `@Component` 기능을 상속받은 특수 애노테이션들이다.

