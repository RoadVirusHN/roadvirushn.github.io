---
title: Spring5-비동기 메시지 전송
date: 2023-02-20 15:21:07 +0900
tags: HIDE CRUDE 
layout: obsidian
is_Finished: false
last_Reviewed: 2023-02-20 15:21:07 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# Spring5-비동기 메시지 전송
```ad-quote
title: 출처

_[초보 웹 개발자를 위한 스프링 5 프로그래밍 입문](https://www.kame.co.kr/nkm/detail.php?tcode=306&tbook_jong=3)_와 [스프링 인 액션](https://jpub.tistory.com/1040)의 내용을 바탕으로 정리한 내용입니다.
```
```ad-warning
title: 스프링 부트를 사용한다는 가정 하에 진행됩니다.
```

동기화 통신인 REST API 이외에 비동기 통신을 이용하면 다음과 같은 특징이 있다.
- 어플리케이션 간의 응답을 기리지 않는 간접적인 전송
- 어플리케이션 간의 결합도를 낮추고 확장성 증가
- 요청-응답에 비해 짧은 대기시간, 연속처리 가능
- 지속적인 데이터 스트림이 중요한 기능, 클라이언트 간 통신 중계에 주로 사용(실시간 메시징, 모니터링 등)

## JMS(Java Message Service)

두 개 이상의 클라이언트 간에 메시지 통신을 위한 공통 API를 정의하는 자바 표준

템플릿 기반 `JmsTemplate`  클래스를 이용해 프로듀서를 생성하여 메시지 전송
큐와 토픽이 메시지를 받아 컨슈머에게 메시지 전송 하는 구조

메시지 기반 POJO(Plain Old Java Object) 지원
- 큐나 토픽에 도착하는 메시지에 반응하여 비동기 방식으로 메시지 수신하는 간단한 객체

아래 의존모듈 둘중 하나를 지정하면 `JmsTemplate`를 자동 구성한다.
**org.springframework.boot.spring-boot-starter-activemq**
**org.springframework.boot.spring-boot-starter-artemis** : 최신 차세대 브로커 이용

```ad-example
title: `application.yml`
의존을 추가한 다음 다음과 같이 설정을 추가하자.
~~~yml
spring:
	artemis: # artemis 사용 시 설정
		host: artemis.tacocloud.com
		port: 61617
		user: tacoweb
		password: l3tm31n
	activemq: # activemq 사용 시 설정
		broker-url: tcp://activemq.tacocloud.com
		user: tacoweb
		password: l3tm31n
		in-memory: false # 인메모리 브로커는 같은 어플리케이션에서만 사용 가능하므로 끄자
~~~
```

만약 스프링 부트가 아니라 따로 설치가 필요하다면 각 브로커를 웹페이지에서 다운로드 받아야 한다. 

### 메시지 전송

다음과 같이 `send()`와 `convertAndSend()` 두 개 메서드를 오버로딩하여 구현한다.

```ad-example
title: `JmsTemplate` 메시지 전송 메서드
~~~java
// 원시 메시지 전송
// MessageCreator로 메시지 생성 
void send(MessageCreator messageCreator) throws JmsException; // 기본 설정 도착지로 전송
void send(Destination destination, MessageCreator messageCreator)  throws JmsException; // Destination 객체로 전송
void send(String destinationName, MessageCreator messageCreator)  throws JmsException; // 도착지를 문자열로 받아 전송

// 객체로부터 변환된 메시지를 전송
// Object를 내부적으로 Message로 변경
void convertAndSend(Object message) throws JmsException; // 기본 설정 도착지로 전송
void covnertAndSend(Destination destination, Object message)  throws JmsException; // Destination 객체로 전송
void convertAndSend(String destinationName, Object message)  throws JmsException; // 도착지를 문자열로 받아 전송

// 메시지 후처리 과정 추가
// 위와 동일하나, 직전에 Message를 커스터마이징 가능
void convertAndSend(Object message, MessagePostProcessor postProcessor) throws JmsException; // 기본 설정 도착지로 전송
void convertAndSend(Destination destination, Object message, MessagePostProcessor postProcessor)  throws JmsException; // Destination 객체로 전송
void convertAndSend(String destinationName, Object message, MessagePostProcessor postProcessor)  throws JmsException; // 도착지를 문자열로 받아 전송
~~~
```

목적지 선정하는 방법은 세가지 방법이 있다.
- 기본 설정 도착지
```yml
spring:
	jms:
		template:
			default-destination: tacocloud.order.queue
```
- `Destination` 객체
```java
@Bean
public Destination orderQueue() {
	return new ActiveMQQueue("tacocloud.order.queue");
}
```
- `DestinationName` 문자열 
```java
@Override
public void sendOrder(Order order) {
	jms.send(
		"tacocloud.order.queue",
		session -> session.createObjectMessage(order)
	);
}
```

아래처럼 서비스를 이용하여 구현하면 된다.
```ad-example
title: `send()` 주문 예시

~~~java
package tacos.messaging;

import javax.jms.JMSException;
import javax.jms.Message;
import javax.jms.Session;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.jms.core.MessageCreator;
import org.springframework.stereotype.Service;

import tacos.Order;

@Service
public class JmsOrderMessagingService implements OrderMessagingService {
	private JmsTemplate jms;
	
	@Autowired
	public JmsOrderMessagingService(JmsTemplate jms) {
		this.jms = jms;
	}

	@Override
	public void sendOrder(Order order) {
		/*
		jms.send(new MessageCreator() {
			@Override
			public Message createMessage(Session session) throws JMSException {
				return session.createObjectMessage(order);
			}
		}); // session -> session.createObjectMessage(order) 람다 함수로 대체 가능
		*/

		jms.convertAndSend("tacocloud.order.queue", order, this::addOrderSource);
	}

	private Message addOrderSource(Message message) throws JMSException {
		message.setStringProperty("X_ORDER_SOURCE", "WEB");
		return message;
	}
}
~~~
```

#### 메시지 변환 후 전송

공통적인 변환 작업은 메시지 변환기를 구현 혹은 활용하면 되며, 특정 작업은 후처리기를 직접 구현하여 사용한다.

**공통적인 메시지 변환기 구현**

다음 인터페이스를 직접 구현하거나 미리 구현된 변환기를 직접 이용하면 된다.
```ad-example
title: 스프링의 `MessageConverter` 인터페이스
~~~java
public interface MessageConvereter {
	Message toMessage(Object object, Session session) throws JMSException, MessageConversionException;

	Object fromMessage(Message message)
}
~~~
```
보통 `SimpleMessageConverter`를 자주 사용하며 변환기 인스턴스를 빈으로 선언하여 사용한다.
```ad-example
title: `org.springframeowrk.jms.support.converter`의 미리 정의된 스프링 메시지 변환기
`|메시지 변환기|하는 일|
|---|---|
|`MappingJackson2MessageConverter`|Jackson 2 JSON 라이브러리로 메시지를 JSON으로 변환|
|`MessagingMessageConverter`|수신된 메시지의 MessageConverter를 사용해 해당 메시지를 Message객체로 변환|
|`SimpleMessageConvereter`| 문자열을 `TextMessage`로, byte 배열을 `ByteMessage`로 Map을 `MapMessage`로, `Serializeable` 객체를 `ObjectMessage`로 상호 변환|`
이때, `_typeId`로 변환되는 타입을 수신자에게 알리기 위해 매핑을 활용할 수 있다.
~~~java
@Bean
public MappingJackson2MessageConverter messageConverter() {
    MappingJackson2MessageConverter messageConverter = new MappingJackson2MessageConverter();
    messageConverter.setTypeIdPropertyName("_typeId"); // 수신된 메시지의 변환 타입을 수신자에게 알리기 위한 속성 설정
    
    Map<String, Class<?>> typeIdMappings = new HashMap<String, Class<?>>(); 
    typeIdMappings.put("order", Order.class); // 실제 객체를 매핑시켜 변환 타입 알리기
    messageConverter.setTypeIdMappings(typeIdMappings); 
	// 이제 수신자는 해당 메시지가 order 객체로 변환되어야 함을 알고 해당 객체를 구현하여 변환할 것이다.
    return messageConverter;
}
~~~
```

**메시지 후처리**

메시지 내부의 속성을 추가하려면 `send()` 메서드의 경우 다음과 같이 가능하다.
```ad-example
title: `send()` 메서드 후처리
~~~java
jms.send("tacocloud.order.queue",
	session -> {
		Message message = session.createObjectMessage(order);
		message.setStringProperty("X_ORDER_SOURCE", "WEB");
	});
~~~
```

`convertAndSend()` 사용 시 자동으로 메세지를 생성해주므로 변화를 주려면 메시지 변환기를 사용해야 함.

```ad-example
title: 후처리 구현
~~~java
package tacos.messaging;

import javax.jms.JMSException;
import javax.jms.Message;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;

import tacos.Order;

@Service
public class JmsOrderMessagingService implements OrderMessagingService {

  private JmsTemplate jms; 

  @Autowired
  public JmsOrderMessagingService(JmsTemplate jms) {
    this.jms = jms;
  } 

  @Override
  public void sendOrder(Order order) {
    jms.convertAndSend("tacocloud.order.queue", order,
        this::addOrderSource);
        // 람다, 내부 클래스를 이용할 수 도 있다.
  }
  
  private Message addOrderSource(Message message) throws JMSException {
    message.setStringProperty("X_ORDER_SOURCE", "WEB");
    return message;
  }
}
~~~
```

### 메시지 수신

메시지를 수신하는 방식은 크게 두가지가 있다.
- **풀 모델(pull model)** : 수신측에서 메시지를 요청
	- 스레드가 사용가능할 때까지 시간이 조금 걸린다는 단점
- **푸시 모델(push model)** : 송신 측에서 수신 가능하게 되면 메시지를 자동 전달
	- 수신 측에 너무 많은 메시지가 도착 시, 처리가 힘들 때 파악 힘듦

스레드 문제가 없는 푸시 모델이 보통 효율적이지만, 메시지를 많이 받아야 하는 서비스는 풀 모델이 좋다.

#### 풀모델 메시지 수신

```ad-example
title: 메시지 수신 메서드
앞서 송신 메서드와 비슷한 방법으로 송신지를 설정할 수 있다.
~~~java
Message receive() throws JmsException;
Message receive(Destination destination) throws JmsException;
Message receive(String destinationName) throws JmsException;

Object receiveAndConvert() throws JmsException;
Object receiveAndConvert(Destination destination) throws JmsException;
Object receiveAndConvert(String destinationName) throws JmsException;
~~~
```

```ad-example
title:
~~~java
package tacos.kitchen.messaging.jms;

import org.springframework.context.annotation.Profile;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;  

import tacos.Order;
import tacos.kitchen.OrderReceiver;  

@Profile("jms-template")
@Component("templateOrderReceiver")
public class JmsOrderReceiver implements OrderReceiver {
  
  private JmsTemplate jms; 

  public JmsOrderReceiver(JmsTemplate jms) {
    this.jms = jms;
  }
  
  @Override
  public Order receiveOrder() {
    /* //receive 메서드 버전
	Message message = jms.receive("tacocloud.order.queue");
	rerturn (Order) converter.fromMessage(message);
    */
    return (Order) jms.receiveAndConvert("tacocloud.order.queue");
  }
}
~~~
```

#### 푸시모델 메시지 수신

메시지가 도착할 때까지 대기하는 수동적 컴포넌트
POJO 방식으로 다른 메시지 의존 모듈로도 비슷한 방법으로 메시지 리스너를 선언 가능

```ad-example
title: `OrderListener` 컴포넌트
`@GetMapping` 등과 사용법이 비슷하다.
~~~Java
package tacos.kitchen.messaging.jms.listener;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;  

import tacos.Order;
import tacos.kitchen.KitchenUI;

@Profile("jms-listener")
@Component
public class OrderListener {

  private KitchenUI ui;

  @Autowired
  public OrderListener(KitchenUI ui) {
    this.ui = ui;
  } 

  @JmsListener(destination = "tacocloud.order.queue")
  public void receiveOrder(Order order) {
    ui.displayOrder(order);
  }
}
~~~
```

## RabbitMQ

JMS는 자바 어플리케이션 간에만 사용가능하다는 단점이 있다.

**org.springframework.boot.spring-boot-starter-amqp**를 추가하고 관련 설정을 `application.yml`에 추가하자.

RabbitMQ는 AMQP의 구현으로, 진보된 메시지 라우팅 전략을 이용한다.

1. 메시지가 브로커에 도착하면 주소로 지정된 거래소로 들어간다.
	- 주소는 거래소 타입, 거래소와 큐 간의 바인딩, 메시지의 라우팅 키 값을 기반으로 처리
2. 거래소는 하나 이상의 큐에 메시지를 전달한다.

거래소(exchange)의 종류는 다음과 같다.
- **기본(default) 거래소** : 자동 생성되는 특별 거래소, 메시지의 라우팅키와 이름이 같은 큐로 메시지 전달. 모든 큐와 연결됨
- **디렉트(direct) 거래소** : 바인딩 키와 메시지 라우팅 키를 비교해 큐로 전달
- **토픽(topic) 거래소** : 바인딩 키를 와일드 카드를 이용해 라우팅 키와 비교해 메시지 전달
- **팬아웃(fanout) 거래소**: 모든 연결된 큐에 메시지 전달하는 거래소
- **헤더(header) 거래소** : 라우팅 키 대신 메시지 헤더 값으로 전달
- **데드 레터(dead letter) 거래소** : 전달 불가능한 라우팅 키로 보내진 메시지를 보관

설정부터 송수신까지 `JmsTemplate`의 코드와 놀랍도록 유사하나 다음 두가지가 다르다.
- 목적지 대신 라우팅키와 거래소를 준다는 점
- 메시지 수신 시 큐 이름을 받고, 타임아웃 시간을 정할 수 있다.
자세한 것은 [이곳](https://spring.io/guides/gs/messaging-rabbitmq/) 참조

## 아파체 카프카
아파체 카프카는 특유의 클러스터로 카프카 인스턴스를 나눈 뒤, 인스턴스 내의 토픽들을 파티션으로 분할하여 관리한다.

거래소와 큐의 개념이 없으며, 토픽은 모든 클러스터에 복제되어 클러스터의 노드 들에 의해 관리된다.

**org.springframework.kafka.spring-kafka**를 추가하고 관련 설정을 `application.yml`에 추가하자.

마찬가지로 비슷한 코드이나 다음이 다르다.
- `convertAndSend()` 메서드의 역할을 `send()` 메서드가 대신함
	- 메시지 전송 시 직접 도메인 타입을 처리하므로 변환 기능을 대신함.
- 매개변수로 다음을 이용함
	- 메시지가 전송될 토픽(`String`)
	- 토픽 데이터를 쓰는 파티션(`Integer`, optional)
	- 레코드 전송 키(`K`, optional) 
	- 타임스탬프(optional)
	- 페이로드(`V` 필수)

```ad-example
title: kafka listener 구현
~~~java
package tacos.kitchen.messaging.kafka.listener;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;  

import lombok.extern.slf4j.Slf4j;
import tacos.Order;
import tacos.kitchen.KitchenUI;
  

@Profile("kafka-listener")
@Component
@Slf4j
public class OrderListener {

  private KitchenUI ui; 

  @Autowired
  public OrderListener(KitchenUI ui) {
    this.ui = ui;
  }  

  @KafkaListener(topics="tacocloud.orders.topic")
  public void handle(Order order, ConsumerRecord<String, Order> record) {
    log.info("Received from partition {} with timestamp {}",
        record.partition(), record.timestamp());
    ui.displayOrder(order);
  }

//
// Alternate implementation
//
//  @KafkaListener(topics="tacocloud.orders.topic")
//  public void handle(Order order, Message<Order> message) {
//    MessageHeaders headers = message.getHeaders();
//    log.info("Received from partition {} with timestamp {}",
//        headers.get(KafkaHeaders.RECEIVED_PARTITION_ID),
//        headers.get(KafkaHeaders.RECEIVED_TIMESTAMP));
//    ui.displayOrder(order);
//  }
}
~~~
```