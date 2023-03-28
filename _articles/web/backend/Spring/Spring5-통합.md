---
title: Spring5-통합
date: 2023-02-25 11:50:54 +0900
tags: HIDE CRUDE 
layout: obsidian
is_Finished: false
last_Reviewed: 2023-02-25 11:50:54 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# Spring5-통합

```ad-quote
title: 출처

_[초보 웹 개발자를 위한 스프링 5 프로그래밍 입문](https://www.kame.co.kr/nkm/detail.php?tcode=306&tbook_jong=3)_와 [스프링 인 액션](https://jpub.tistory.com/1040)의 내용을 바탕으로 정리한 내용입니다.
```
```ad-warning
title: 스프링 부트를 사용한다는 가정 하에 진행됩니다.
```

## 스프링 통합(Spring Integration)

어플리케이션이 이메일, 파일 시스템, RSS, Twitter 등의 외부 서비스와 상호작용 시, 데이터를 읽고 쓰고, 형태를 변경할 때 사용하는 패턴이다.

각 통합 패턴은 하나의 컴포넌트로 정의되며, 통합 패턴의 파이프라인을 따르는 메시지를 통해 데이터를 운반하며 가공한다.

스프링 부트로 통합 플로우를 선언하기 위해 다음과 같은 의존성이 필요하다.
**org.springframework.boot.spring-boot-starter-integration** : 통합에 필요한 필수 모듈
**org.springframework.integration.spring-integration-{원하는 엔드포인트 모듈}** : 구현하려는 시스템을 위한 모듈

## 여러 통합 플로우 구성 방법
통합 플로우는 여러 방법으로 구성할 수 있으며, 예시를 알아보자.
먼저, 통합 플로우로 데이터를 전송하는 파일 쓰기 게이트웨이를 작성한다.
```ad-example
title: `FileWriteGateway.java`
이제 통합 플로우 구성을 선언하면 아래 게이트웨이를 사용할 수 있다.
~~~java
package sia5;
import org.springframework.integration.annotation.MessagingGateway;
import org.springframework.integration.file.FileHeaders;
import org.springframework.messaging.handler.annotation.Header;

@MessagingGateway(defaultRequestChannel="textInChannel")
public interface FileWriterGateway {
  void writeToFile(
      @Header(FileHeaders.FILENAME) String filename,
      String data);
}
~~~
```
자세한 설명은 나중에 DSL로 알아 볼 것이다.
- **XML 구성**
```ad-example
title: `filewriter.xml`
collapse: true

사실, XML 구성은 과거에 비해 잘 사용되지 않는다.
~~~xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xmlns:int="http://www.springframework.org/schema/integration"
  xmlns:int-file="http://www.springframework.org/schema/integration/file"
  xsi:schemaLocation="http://www.springframework.org/schema/beans
    http://www.springframework.org/schema/beans/spring-beans.xsd
    http://www.springframework.org/schema/integration
    http://www.springframework.org/schema/integration/spring-integration.xsd
    http://www.springframework.org/schema/integration/file
    http://www.springframework.org/schema/integration/file/spring-integration-file.xsd">
    <int:channel id="textInChannel" />
    <int:transformer id="upperCase"
        input-channel="textInChannel"
        output-channel="fileWriterChannel"
        expression="payload.toUpperCase()" />
    <int:channel id="fileWriterChannel" />
    <int-file:outbound-channel-adapter id="writer"
        channel="fileWriterChannel"
        directory="/tmp/sia5/files"
        mode="APPEND"
        append-new-line="true" />
</beans>
~~~
```
이후, 아무 구성 클래스에 `@ImportResource` 어노테이션으로 불러오기 설정을 하자.
```java
@Configuration
@ImportResource("classpath:/filewriter-config.xml")
public class FileWriterIntegrationConfig{...}
```
- **자바 파일 구성**
```ad-example
title: `FileWriterIntegrationConfig.java`
자세한 설명은 컴포넌트에서 설명
~~~java
package sia5;
import java.io.File;
//...
import org.springframework.integration.annotation.ServiceActivator;
import org.springframework.integration.annotation.Transformer;
import org.springframework.integration.dsl.IntegrationFlow;
import org.springframework.integration.dsl.IntegrationFlows;
import org.springframework.integration.dsl.channel.MessageChannels;
import org.springframework.integration.file.FileWritingMessageHandler;
import org.springframework.integration.file.dsl.Files;
import org.springframework.integration.file.support.FileExistsMode;
import org.springframework.integration.transformer.GenericTransformer;

@Configuration
public class FileWriterIntegrationConfig {  
  /*
  // 앞선 xml 구성용 구성파일
  @Profile("xmlconfig")
  @Configuration
  @ImportResource("classpath:/filewriter-config.xml")
  public static class XmlConfiguration {}
  */
  // 채널 이동간에 변환
  @Profile("javaconfig")
  @Bean
  @Transformer(inputChannel="textInChannel",
               outputChannel="fileWriterChannel")
  public GenericTransformer<String, String> upperCaseTransformer() {
    return text -> text.toUpperCase();
  }
  
  // fileWriterChannel로 부터 메시지를 받은 뒤의 서비스
  @Profile("javaconfig")
  @Bean
  @ServiceActivator(inputChannel="fileWriterChannel")
  public FileWritingMessageHandler fileWriter() {
    FileWritingMessageHandler handler =
        new FileWritingMessageHandler(new File("/tmp/sia5/files"));
    handler.setExpectReply(false); //단반향 게이트웨이로 설정
    handler.setFileExistsMode(FileExistsMode.APPEND);
    handler.setAppendNewLine(true);
    return handler; 
  }
  /*
  // 특정 채널이름이 존재하지 않으면 자동으로 구성하지만, 직접 생성하고 설정하고 싶다면 아래와 같이 가능
  @Bean
  public MessageChannel textInChannel() {
    return new DirectChannel();
  }
  
  @Bean
  public MessageChannel fileWriterChannel() {
    return new DirectChannel();
  }  
  */
}
~~~
```
- **DSL(Domain Specific Language)**
```ad-example
title: 앞선 자바 구성 파일에 추가
모두 같은 기능, 더 간소화 되고 알아보기 쉽다. 전체 플로우가 하나의 빈으로 구성됨
~~~java
import java.io.File;  

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.dsl.IntegrationFlow;
import org.springframework.integration.dsl.IntegrationFlows;
import org.springframework.integration.dsl.channel.MessageChannels;
import org.springframework.integration.file.dsl.Files;
import org.springframework.integration.file.support.FileExistsMode;

@Configuration
public class FileWriterIntegrationConfig {

  @Profile("javadsl")
  @Bean
  public IntegrationFlow fileWriterFlow() {
    return IntegrationFlows
        .from(MessageChannels.direct("textInChannel"))
        .<String, String>transform(t -> t.toUpperCase())
        //.channel(MessageChannels.direct("fileWriterChannel")) // 채널 수동 구성
        .handle(Files
            .outboundAdapter(new File("/tmp/sia5/files"))
            .fileExistsMode(FileExistsMode.APPEND)
            .appendNewLine(true))
        .get();
  }
}
~~~
```

## 통합 플로우 컴포넌트와 예시
보통, **게이트웨이-채널-변환기-채널-어댑터** 순으로 연결한다.
### 채널(Channel)
한 요소로부터 다른 요소로 메시지 전달
기능에 따라 다음과 같이 여러 채널이 사용 가능
- `PublishSubscribeChannel` : 하나 이상의 컨슈머 모두에게 전달
- `QueueChannel` : FIFO 방식으로 컨슈머가 하나씩 가져감
- `PriorityChannel` : `priority` 헤더 기반으로 컨슈머가 가져감
- `RendezvousChannel`: 컨슈머가 메시지 수신시까지 전송자가 채널 사용 불가(동기화)
- `DirectChannel`: 단일 사용자만 사용가능한 `PublishSubscribeChannel`, 트랜잭션 지원
- `ExecutorChannel`: `TaskExecutor`로 메시지 전송, 트랜잭션 지원 안함
- `FluxMessageChannel`: 리액터 플럭스 기반 채널

기본적으로 특정 이름의 채널이 존재하지 않으면 `DirectChannel`로 생성되며, 다른 채널을 구현하고 싶다면 직접 채널을 구현해야 한다.
```ad-example
title: `QueueChannel` 선언과 사용
~~~java
@Bean
public MessageChannel orderChannel() {
	return new QueueChannel();
}

@ServiceActivator(inputChannel="orderChannel" poller=@Poller(fixedRate="1000"))
// 채널명 지명 + queue에서 가져오는 주기 설정
~~~
```
### 필터(Filter)
조건에 맞는 메시지만 플로우를 통과하게 함
통합 파이프라인 채널 사이 중간에만 위치 가능
```ad-example
title: 필터의 예시
~~~java
@Filter(inputChannel="numberChannel",
	   outputChannel="evenNumberChannel")
public boolean evenNumberFilter(Integer number) {
	return number % 2 == 0;
}

//DSL 버전
@Bean
public IntegrationFlow evenNumberFlow(AtomicInteger integerSource) {
	return IntegrationFlows
	//...
	.<Integer>filter((p)->p%2==0) // GenericSelector 혹은 람다로 필터 구현
	//...
	.get();
}
~~~
```

### 변환기(Transformer)
메시지 값을 변경하거나 메시지 페이로드의 타입을 다른 타입으로 변경
```ad-example
title: `GenericTransformer` 구현 예시
~~~java
@Bean
@Transformer(inputChannel="numberChannel", outputChannel="romanNumberChannel")
public GenericTransformer<Integer, String> romanNumTransformer() {
	return RomanNumbers::toRoman;
}

@Bean
public IntegrationFlow transformerFlow() {
	return IntegrationFlows
	//...
	.transform(RomanNumbers::toRoman)
	//...
	.get();
}
~~~
```
### 라우터(Router)
여러 채널 중 하나로 메시지를 전달하며, 대게 메시지 헤더를 기반으로 함

이때 전달 조건을 직접 구현해주어야 한다.
```ad-example
title: 라우터 구현 예시
~~~java
@Bean
@Router(inputChannel="numberChannel")
public AbstractMessageRouter evenOddRouter() {
	return new AbstractMessageRouter() {
		@Override
		protected Collection<MessageChannel> determineTargetChannels(Message<?> message) {
			Integer number = (Integer) message.getPayload();
			if (number % 2 == 0) {
				// channel을 수동 설정해줘야 함
				return Collections.singleton(evenChannel());
			}
			return Collections.singleton(oddChannel());
		}
	};
}
// DSL 구성
@Bean
public IntegrationFlow numberRoutingFlow(AtomicInteger source) {
	return IntegrationFlows
		//...
		.<Integer, String>route(n -> n%2==0 ? "EVEN":"ODD", mapping -> mapping)
		.subFlowMapping("Even", sf -> sf.<Integer, Integer>transform(n -> n * 10).handle((i, h) -> {...}))
		.subFlowMapping("ODD", sf -> sf.transform(RomanNumbers::toRoman).handle((i,h)-> {...}))
		.get();
}
~~~
```

### 분배기(Splitter)
들어오는 메시지를 두 개 이상의 메시지로 분할하며, 분할된 각 메시지는 다른 채널로 전송된다.

크게 두가지 방법으로 분할한다.
- **같은 타입의 컬렉션 항목들을 여러 메시지 페이로드로 나눔**
- **하나의 메시지 페이로드를 서로 다른 타입 두개 이상 메시지로 나눔**
```ad-example
title: 분배기 예시
~~~java
public class OrderSplitter {
	// splitOrderIntoParts 메서드 구현
	public Collection<Object> splitOrderIntoParts(PurchaseOrder po) {
		ArrayList<Object> parts = new ArrayList<>();
		parts.add(po.getBillingInfo());
		parts.add(po.getLineItems());
		return parts
	}
}

@Bean
@Splitter(inputChannel="poChannel", outputChannel="splitOrderChannel")
public OrderSplitter orderSplitter() {
	return new OrderSpliter();
}

//아래와 같은 라우터로 따로 보내줘야 한다.
@Bean
@Router(inputChannel="splitOrderChannel")
public MessageRouter splitOrderRouter() {
	PayloadTypeRouter router = new PayloadTypeRouter();
	router.setChannelMapping(
		BillingInfo.class.getName(), "billingInfoChannel");
	router.setChannelMapping(
		List.class.getName(), "lineItemsChannel");
	return router;
}

// 만약 Splitter를 연속으로 적용하고 싶다면 다음과 같이 빈 객체가 아닌 스플리터를 연속으로 지정하면 된다.
@Splitter(inputChannel="lineItemsChannel", outputChannel="lineItemChannel")
public List<LineItem> lineItemSplitter(List<LineItem> lineItems) {
	return lineItems; // 각 아이템들이 나뉘어 한 채널에 여러개로 들어간다.
}

// DSL 버전
return IntegrationFlows
	//...
	.split(orderSpliter())
	.<Object, String> route(
		p -> {
			if (p.getClass().isAssignableFrom(BillingInfo.class)){
				return "BILLING_INFO";
			} else {
				return "LINE_ITEMS";
			}
		}, mapping -> mapping
			.subFlowMapping("BILLING_INFO", sf -> sf.<BilingInfo> handle((billingInfo, h) -> {
				//...
			}))
			.subFlowMapping("LINE_ITEMS",
				sf -> sf.split()
					.<LineItem> handle((lineItem, h) -> {
						//...
					}))
			)
		.get();

~~~
```

### 집적기(Aggregator)
분배기와 상반된 것으로 별개의 채널로부터 전달되는 다수의 메시지를 하나의 메시지로 결합한다.

### 서비스 액티베이터(Service activator)
메시지를 처리하도록 `Handler` 구현 메서드에 메시지를 넘겨준 후 메서드의 반환값을 출력 채널로 전송한다.

`MessageHandler`나 `GenericHandler` 인터페이스를 구현한 메서드를 이용할 수 있다.
- 만약, 메서드 반환값이 존재하지 않다면 `MessageHandler`
- 메서드 반환값으로 새로운 메시지가 존재한다면 `GenericHandler`를 이용해야 한다.
	- 단, 플로우의 끝에 두면 해당 메시지를 받을 채널이 없어 에러 발생
	- 굳이 끝에 둬야 한다면 return 값을 `null`로 해야 한다.
```ad-example
title: 서비스 엑티베이터와 핸들러 메서드 예시
~~~java
@Bean
@ServiceActivator(inputChannel="someChannel")
public MessageHandler sysoutHandler() {
	return message -> {
		System.out.println("Message payload: " + message.getPayload());
	};
}

@Bean
@ServiceActivator(inputChannel="orderChannel", outputChannel="completeChannel")
public GenericHandler<Order> orderHandler(OrderRepository orderRepo) {
	return (payload, headers) -> {
		return orderRepo.save(payload);	
	};
}

//DSL 버전
public IntegrationFlow someFlow() {
	return IntegrationFlows
		//...
			.handle(msg -> {
				System.out.println("Message payload: " + msg.getPayload());
			})
			.get();
}


~~~
```

주로 아웃바운드 채널 어댑터로 이용된다.

### 채널 어댑터(Channel adapter)
외부 시스템에 채널을 연결하여 입출력 가능케 함, 플로우의 입구와 출구
- **입구 역할을 하는 인바운드 채널 어댑터**
```ad-example
title: 인바운드 어댑터 예시
`AtomicInteger`로 부터의 값을 1초마다 플로우로 전달하는 어댑터
~~~Java
@Bean
@InboundChannelAdapter(poller=@Poller(fixedRate="1000"), channel="numberChannel")
public MessageSource<Integer> numberSource(AtomicInteger source) {
	return () -> {
		return new GenericMessage<>(source.getAndIncrement());
	};
}

@Bean
public IntegrationFlow someFlow(AtomicInteger integerSource) {
	return IntegrationFlows
		.from(integerSource, "getAndIncrement",
			c -> c.poller(Pollers.fixedRate(1000)))
		//...
		.get();
}
~~~
```
- **출구 역할을 하는 아웃바운드 채널 어댑터** : 결과를 반환하는 서비스 액티베이터로 자주 구현한다.

채널 어댑터는 엔드 모듈에서 직접 제공하기도 한다.

### 게이트웨이(Gateway)
인터페이스를 통해 통합 플로우로 데이터 전달, 선택적으로 응답도 받음(양방향 게이트웨이)

즉, 어플리케이션이 통합 플로우로 메시지를 전송하고 받아낼 수 있는 메서드이며, 인터페이스로 구현되어 있다.

```ad-example
title: 게이트웨이 구현 예시
~~~java
package com.example.demo;

import org.springframework.integration.annotation.MessagingGateway;
import org.springframework.stereotype.Component;

//인터페이스만 만들면 스프링이 자동으로 구현하므로 uppercase 메서드를 사용하면 됨.
@Component
@MessagingGateway(defaultRequestChannel="inChannel", defaultReplyChannel="outChannel")
public interface UpperCaseGateway {
	String uppercase(String in); // in 문자열이 플로우로 전달됨, 
	// 아웃 채널로 도착하면 같은 문자열이 반환됨
	// uppercase 하는 메서드는 변환기로 구현
}

//dsl 버전
@Bean
public IntegrationFlow uppercaseFlow() {
	return IntegrationFlows
		.from("inChannel")
		.<String, String> transform(s -> s.toUpperCase())
		.channel("outChannel")
		.get();
}
~~~
```

### 엔드포인트 모듈(Endpoint module)

다양한 외부 시스템과 통합을 위해 다음과 같은 예시 엔드포인트 모듈이 존재한다.
- AMQP(**spring-integration-amqp**)
- RSS(**spring-integration-feed**)
- 파일 시스템(**spring-integration-file**)
- FTP(**spring-integration-ftp**)
- 이메일(**spring-integration-mail**)
- 스트림(**spring-integration-stream**)
- 트위터(**spring-integration-twitter**)
- WebSocket(**spring-integration-websocket**)
- 기타 등등