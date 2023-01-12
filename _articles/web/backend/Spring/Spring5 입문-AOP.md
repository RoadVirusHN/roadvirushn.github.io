---
title: Spring5 입문-AOP
date: 2023-01-09 19:22:11 +0900
tags: HIDE CRUDE 
layout: obsidian
is_Finished: false
last_Reviewed: 2023-01-09 19:22:11 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# Spring5 입문-AOP(Aspect Oriented Programming)
```ad-quote
title: 출처

_[초보 웹 개발자를 위한 스프링 5 프로그래밍 입문(최범균 저, 가메 출판사)](https://www.kame.co.kr/nkm/detail.php?tcode=306&tbook_jong=3)_의 내용을 바탕으로 정리한 내용입니다.
```

**AOP(Aspect Oriented Programming, 기능 지향 프로그래밍)은 여러 객체에 공통으로 적용할 수 있는 기능을 분리하여 재사용성을 높여주는 프로그래밍 기법**이다.

이때 핵심 기능과 공통 기능을 구분해 구현하는 방법은 **프록시 패턴**을 이용하며, 구현 방법에 따라 세 가지 방법으로 나뉜다.
- 컴파일 시점에 코드에 공통 기능 삽입 -> AspectJ 같은 AOP 전용 도구로 구현
- 클래스 로딩 시점에 바이트 코드에 공통 기능 삽입 -> AspectJ 같은 AOP 전용 도구로 구현
- **런타임에 프록시 객체 생성해 공통 기능 삽입 -> 스프링의 자동 생성 프록시 객체로 구현**

```ad-info
title: 프록시 기반 AOP
![[image-20230110032436108.png]]
```

우린 이 중에 3번째 방법을 알아볼 것이다.

## 프록시 패턴

아래 예시 코드와 같이 핵심 기능의 실행은 **다른 객체에 위임하고 부가적인 기능을 제공하는 객체를 프록시(Proxy)라고 하며, 실제 핵심 기능을 실행하는 객체는 대상 객체**라고 한다.

이를 통해 공통 기능 코드를 재사용하고 수정하기 쉬우며 가독성 좋은 코드를 만들어 낼 수 있다.

```ad-seealso
title: 사실은, 저자가 생각하기에는 기능 추가와 확장에 초점이 맞춰져 있는 데코레이터 패턴이 좀 더 가깝다고 한다.
```

### 프록시 패턴 예시

```ad-example
title: 프록시 객체와 대상 객체 예시
~~~java
public interface Printer {
	public String print(String words);
}

public class TargetObject implements Printer{
	@Override	
	public String print(String words) {	
		System.out.printf("TargetObject.print()");
		return result;	
	}
}

public class ProxyObject implements Printer {	
	private Printer delegate;	
	public ProxyObject(Printer delegate) {
		this.delegate = delegate;
	}
	@Override
	public String print(String words) {	
		System.out.printf("Before TargetObject.print()");	
		String result = delegate.print(words);
		System.out.printf("After TargetObject.print()");		
		return result;
	}
}
~~~
```


```ad-example
title: 프록시 패턴 예시
~~~java
public class MainProxy {
	public static void main(String[] args) {
		ProxyObject proxy = new ProxyObject(new TargetObject());
		System.out.println("%s", proxy.print("result"));
	}
}
/* console:
Before TargetObject.print()
TargetObject.print()
After TargetObject.print()
result
*/
~~~
```

## AOP 구현

스프링 AOP에서 가장 자주 사용되는 Around Advice를 기준으로 다음과 같이 구현하면 된다.
1. Aspect로 사용할 클래스에 `@Aspect` 어노테이션 적용
2. `@Pointcut` 어노테이션으로 공통 기능을 적용할 Pointcut 정의
3. 공통 기능 구현 메서드에 `@Around` 어노테이션 적용

