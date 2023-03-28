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

# AOP(Aspect Oriented Programming)
```ad-quote
title: 출처

_[초보 웹 개발자를 위한 스프링 5 프로그래밍 입문](https://www.kame.co.kr/nkm/detail.php?tcode=306&tbook_jong=3)_와 [스프링 인 액션](https://jpub.tistory.com/1040)의 내용을 바탕으로 정리한 내용입니다.
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
title: 사실은, 저자가 생각하기에는 기능 추가와 확장에 초점이 맞춰져 있는 데코레이터 패턴이 좀 더 가깝다고 한다. 프록시 패턴은 좀 더 접근 제어와 보안에 관련됨

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

스프링의 `aspectjweaver` 의존을 추가하면 AOP를 쉽게 구현할 수 있다.

스프링 AOP는 프록시 객체를 자동으로 생성해 주며, 다음과 같은 용어가 존재한다.
- `Aspect` : 공통으로 적용할 기능, 메서드, 예시로 트랜잭션, 보안, 캐시, 성능 모니터링 등이 있음
- `Advice` : `Aspect`을 적용할 시점, 메서드 전(Before), 후(After), 정상 작동 후(After Returning), 오류 후(After Throwing) 등이 존재하지만 모든 시점에 자유롭게 적용가능한 `Around Adivce`를 가장 자주 사용한다.
- `Joinpoint`: `Advice`를 적용 가능한 부분, 메서드, 필드 값 변경 등이 존재하지만 스프링은 메서드에만 적용 가능하다. 
- `Pointcut`: 해당 프록시 객체를 적용할 클래스, 빈 객체 등의 범위를 지정
- `Weaving`: 이러한 AOP를 특정 객체에 설정해주는 행위를 의미

### Aspect 클래스 구현
스프링 AOP에서 가장 자주 사용되는 Around Advice를 기준으로 다음과 같이 구현하면 된다.
1. Aspect로 사용할 클래스에 `@Aspect` 어노테이션 적용
2. `@Pointcut` 어노테이션으로 공통 기능을 적용할 객체를 지정
3. 공통 기능 구현 메서드에 `@Around` 어노테이션 적용하여 대상 메서드 전후 실행에 관련한 로직 작성

```ad-example
title: Aspect 클래스 구현
collapse: close
~~~java
package aspect; 
import java.util.Arrays;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.core.annotation.Order;

@Aspect //프록시 객체 구현을 위한 Aspect 객체로 지정
@Order(1) // 여러 AOP 적용시 메서드를 감쌀 우선순위, 낮을수록 먼저 감싼다.
public class ExeTimeAspect {
    @Pointcut("execution(public * chap07..*(..))") // chap07 패키지 내의 모든 퍼블릭 메서드들이 대상
    private void publicTarget() {
    }
    @Around("publicTarget()") // 아래 Around Adivce 기능은 publicTarget에서 설정한 범위에만 적용된다.
    public Object measure(ProceedingJoinPoint joinPoint) throws Throwable { // 공통 기능 구현 메서드, 리턴 타입은 모든 값을 아우를 수 있게 원시 타입인 Object
        long start = System.nanoTime();
        try {
            Object result = joinPoint.proceed(); // 적용 대상 메서드 실행, ProceedingJoinPoint에 대해서 아래 쪽에 설명
            return result;
        } finally {
            long finish = System.nanoTime();
            Signature sig = joinPoint.getSignature();
            System.out.printf("%s.%s(%s) 실행 시간 : %d ns\n",
                    joinPoint.getTarget().getClass().getSimpleName(), // 적용 대상 메서드 시그니처 정보
                    sig.getName(), Arrays.toString(joinPoint.getArgs()),
                    (finish - start));
        }
    }
}
~~~
```

```ad-seealso
title: execution 명시자
pointcut 메서드 설정을 위한 범위 지정을 위해 사용됨


@Around 어노테이션 안에 직접 명시해도 범위가 지정되지만, 위 예시와 같이 PublicTarget() 처럼 @Pointcut 메서드를 지정해주면 다른 패키지에서 임포트하거나 `@Around("패키지명.Aspect객체.publicTarget()")`처럼 재활용 가능
~~~
execution(수식어패턴? 리턴타입패턴 클래스이름패턴?메서드이름패턴(파라미터패턴))
*: 모든 값
.. : 0개 이상
~~~
```

```ad-seealso
title: `ProceedingJoinPoint` 객체의 인터페이스
- `proceed()`: 지정 메서드가 실행되는 시점을 의미, 메서드 결과값을 리턴하며, 이를 다시 리턴해줘야 함.
- `getSignature()`: 호출되는 메서드에 대한 시그니처 객체
	- 리턴 값인 `Signature` 객체로 부터 메서드명(getName()), 시그니처 정보(toLongString()) 등을 구함
- `getTarget()`: 대상 객체 인스턴스
- `getArgs()`: 대상 메서드 파리미터
```

### Aspect 클래스 적용

이후 완성한 클래스를 다음과 같이 구성 클래스에 등록하면 적용된다.

```ad-example
title: AppCtx 구성 클래스 예시

~~~java
//...
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@Configuration
@EnableAspectJAutoProxy // 필수 Enable류 어노테이션, AOP 객체 사용을 위한 설정 빈 객체들을 자동으로 등록해줌
public class AppCtx {
    @Bean
    public ExeTimeAspect exeTimeAspect() { // 우리가 만든 Aspect
        return new ExeTimeAspect();
    }

	@Bean
	public Calculator calculator() {
		return new RecCalculator();
	}
//...
~~~
```

이후 다음과 같이 빈 객체를 가져와 클래스를 확인해보면 자동 생성된 프록시 객체가 생성되있음을 알 수 있다.
```ad-example
title: AOP 대상이 된 빈 객체 실행예
~~~java
Calculator cal = ctx.getBean("calculator", Calculator.class); 
long fiveFact = cal.factorial(5);
System.out.println("cal.factorial(5) = " + fiveFact);
System.out.println(cal.getClass().getName()); // com.sum.proxy.%Proxy17 => RecCalculator 클래스가 아니라 자동 생성된 프록시 객체
ctx.close();
/* console:
RecCalculator.factorial([5]) 실행 시간: 50201 ns
cal.factorial(5)=120
com.sum.proxy.%Proxy17
*/
~~~
```

이때 `%Proxy17`의 타입은 메서드의 리턴 타입인 `Calculator`를 상속받아 생성됨

```ad-seealso
title: 만약 원본 클래스인 `RecCalculator` 클래스를 상속받아 프록시 객체를 이용해 생성하고 싶다면
 어노테이션` @EnableAspectJAutoProxy(proxyTargetClass = true)`로 설정하면 메서드 리턴타입이 아닌, 실제 결과값의 타입으로 설정된다.
```
