---
title: Spring5-JPA
date: 2023-02-09 22:52:59 +0900
tags: WEB SPRING BE SUMMARY HIDE
layout: obsidian
is_Finished: false
last_Reviewed: 2023-02-09 22:52:59 +0900
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# Spring5-JPA

```ad-quote
title: 출처

_[초보 웹 개발자를 위한 스프링 5 프로그래밍 입문](https://www.kame.co.kr/nkm/detail.php?tcode=306&tbook_jong=3)_와 [스프링 인 액션](https://jpub.tistory.com/1040)의 내용을 바탕으로 정리한 내용입니다.
```

스프링은 `JDBC` 뿐만 아니라 `JPA`, `MongoDB`, `Neo4`, `Redis` 같은 키-값, 문서형, 그래프형의 데이터베이스 퍼시스턴스도 지원한다.

스프링 데이터 프로젝트 중 하나인 `스프링 데이터 JPA`를 통해 JPA를 사용해보자.

```ad-warning
title: 스프링 부트를 사용한다는 가정하에 진행된다.
```

## JPA 사용 준비
주로 사용하며, 기본설정이 되어 있는 `Hibernate`를 기준으로 진행된다.
### JPA 의존성 추가
```ad-note
title: JPA 의존성 예시
~~~xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
~~~
```
만약 `EclipseLink` 같은 다른 라이브러리를 사용하고 싶다면 `<exclusions>`로 `hibernate`를 제외하고 새로 추가해야한다.

또한, 더이상 `schema.sql` 파일 자동 실행이 되지 않으므로, 처음 부트스트랩 클래스 등에서 DB에 필요한 기본 sql을 등록해줘야 한다.

### 도메인 객체에 JPA 매핑 애노테이션 추가

```ad-example
title: 도매인 객체 JPA 매핑 개체로 지정
~~~java
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.PrePersist;
import javax.persistence.Table;
  
import lombok.Data;
import java.util.Date; 

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
@Entity
@Table(name="Taco_Order")
public class Order implements Serializable {
    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Long id;

    private Date placedAt;

	//...

    @ManyToMany(targetEntity=Taco.class)
	private List<Taco> tacos = new ArrayList<>();

    public void addDesign(Taco design) {
        this.tacos.add(design);
    }
    
    @PrePersist
    void placedAt() {
        this.placedAt = new Date();
    }
}
~~~
```

`@Entitiy` : 해당 도메인 객체를 JPA 개체로 변경

`@NoArgsConstructor`: JPA 개체는 인자 없는 생성자여야 하므로, `Lombok` 기능으로 생성자 인자를 없앨 수 있다.

`@Id`: id가 될 속성에는 반드시 `@Id` 어노테이션으로 식별해줘야 함.
- `@GeneratedValue(strategy=GenerationType.AUTO)`로 DB의 자동 생성 ID 사용

`@ManyToMany(targetEntity=외래도메인객체)`:  다대다 관계 설정 

`@PrePersist`:  특정 속성의 기본값을 정해줄 때 사용할 메서드 위에 사용한다. 속성명과 같은 이름이어야 하나?

`@Table`: 이 어노테이션으로 DB에 저장될 테이블명을 바꾸어줄 수 있다.

```ad-note
title: 만약, 기필코 초기화를 위해 생성자가 필요한 객체라면?
1. `@NoArgsConstructor(access=AccessLevel.PRIVATE, force=true)` 속성으로 외부에서 사용하지 못하게 막는다.
2. `@Data`, `@RequiredArgsConstructor`로 인자가 있는 생성자를 추가로 오버로딩한다.
~~~java
package tacos;
import javax.persistence.Entity;
import javax.persistence.Id;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;

@Data
@RequiredArgsConstructor
@NoArgsConstructor(access=AccessLevel.PRIVATE, force=true)
@Entity
public class Ingredient {

    @Id
    private final String id;
    private final String name;
    private final Type type;
    
    public static enum Type {
        WRAP, PROTEIN, VEGGIES, CHEESE, SAUCE
    }
}
~~~
```

## JPA 리퍼지터리 선언

스프링 데이터는 `CrudRepository<개체타입,Id타입>` 인터페이스를 기반으로 자동으로 `Repository` 클래스를 자동 생성해준다.
```ad-example
title: `CrudRepository`를 이용한 레퍼지터리 구현
자세한 함수들은 [공식 문서](https://docs.spring.io/spring-data/commons/docs/current/api/org/springframework/data/repository/CrudRepository.html) 참조
~~~java
package tacos.data;
import org.springframework.data.repository.CrudRepository;

import tacos.Ingredient;

public interface IngredientRepository extends CrudRepository<Ingredient, String> {
	//count(), delete(), findAll(), findByID(), save() 등의 여러 메서드가 정의되어 있음
}
~~~
```

자동 생성된 `Repository`는 기본적인 CRUD 메서드가 선언되어 있다.
위 `interface` 객체를 가져와 사용하면 된다.

## JPA 리퍼지터리 커스터마이징
추가로 원하는 고유한 쿼리를 수행하려면 리퍼지터리 인터페이스에 아래처럼 새로운 메서드를 추가하면 된다.

```java
List<Order> findByDeliveryZip(String deliveryZip);
// interface 내부의 추상메서드이므로 직접 구현을 할 수 없다.
```

이렇게 추가하면 스프링 데이터에서 자동으로 메서드 시그니처를 분석해 구현해준다.

예를 들어 위의 예시는 `find`에 의해 조회임을, `list<Order>`이므로 `Order` 객체의 리스트를, `ByDeliveryZip`으로 인해 주어진 `DeliveryZip`을 키로 찾음을 알 수 있다.

이외에도 `Between`으로 범위 인자 2개가 추가됨을 알 수있고, `And`로 추가적인 조건을 붙일 수 있다.
이외에도 `IsTrue, Contains, IgnoreCase` 등 다양한 메서드명을 이용할 수 있다.
- 자세한 것은 [공식문서](https://docs.spring.io/spring-data/jpa/docs/current/reference/html/) 참조

만약 너무 복잡하거나 불가능한 쿼리의 경우 `@Query` 어노테이션으로 쿼리를 지정 가능하다.
```java
@Query("Order o where o.deliveryCity='Seattle'")
List<Order> readOrdersDeliveredInSeattle();
```
다만 이러하면, DB마다 SQL 언어가 다르므로, JPA의 장점을 모두 활용할 수 없다.

