---
title: Spring5-HATEOAS
date: 2023-02-16 10:21:46 +0900
tags: HIDE CRUDE 
layout: obsidian
is_Finished: false
last_Reviewed: 2023-02-16 10:21:46 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# Spring5-HATEOAS

```ad-quote
title: 출처

_[초보 웹 개발자를 위한 스프링 5 프로그래밍 입문](https://www.kame.co.kr/nkm/detail.php?tcode=306&tbook_jong=3)_와 [스프링 인 액션](https://jpub.tistory.com/1040)의 내용을 바탕으로 정리한 내용입니다.
```

## HATEOAS란?

만약 백엔드 API의 구조가 바뀌게 된다면, 클라이언트 코드가 고장이 날 것이다.

HATEOAS(Hypermedia As The Engine Of Application)는 API에서 응답 시, 반환되는 리소스와 관련된 하이퍼링크를 정보에 포함하여 클라이언트 측에서 이를 통해 다음 요청을 처리하도록 한다.

```ad-example
title: 보통의 REST API VS HATEOAS API
HATEOAS가 JSON 응답에 하이퍼링크를 포함시키는 형식을 HAL(Hypertext Application Language)이라고 한다.

~~~json
// REST API
[
	{
		"id": 4,
		"name": "Veg-Out",
		"createdAt": "2018-01-31T20:15:53.219+0000",
		"ingredients": [
			{"id": "FLTO", "name": "Flour Tortilla", "type": "WRAP"},
			{"id": "TMTO", "name": "Diced Tomatoes", "type": "VEGGIES"},
			...
		]
	},
]
// HATEOAS API
{
	"_embedded": {
		"tacoResurceList": [
			{
				"name": "Veg-Out",
				"createdAt": "2018-01-31T20:15:53.219+0000",
				"ingredients": [
					{
						"name": "Flour Tortilla", "type": "WRAP",
						"_links": {
							"self": {"href": "http://localhost:8080/ingredieints/FLTO" }
						}
					},
					{
						"name": "Diced Tomatoes", "type": "VEGGIES",
						"_links": {
							"self": {"href": "http://localhost:8080/ingredieints/TMTO" }
						}
					},
				],
				"_links": {
				"self": {"href": "http://localhost:8080/design/4"}
				}
			}
		]
	},
	"_links": {
		"recents": {
			"href": "http://localhost:8080/design/recent"
		}
	}
}

~~~
```
내부에 `"_links"` 속성을 포함하며, 관련 API명과 URL을 포함하며, 이를 통해 클라이언트가 요청을 수행한다.

스프링 부트에서 HATEOAS를 구축하는데 도움이 되는 모듈과 클래스, 리소스 어셈블러를 제공한다.
- **org.springframework.boot.spring-boot-starter-hateoas** 모듈을 추가한다.

## 직접 하이퍼링크 추가하기

스프링 HATEOAS는 하이퍼링크를 단일 링크를 처리하는 Resource 타입과 리소스 컬렉션을 처리하는 Resources 타입으로 다룬다.

이들을 통해 응답에 하이퍼링크를 추가할 수 있다.

```ad-example
title: 리소스에 하이퍼링크 추가하기
다수의 객체를 리턴해야할 때는 `Resources` 타입을 감싼 `Resource` 타입을 리턴해야 한다.

`add()` 메소드를 통해 `recentTacos()`의 매핑 URL을 집어넣는 코드이다.
~~~java
import static org.springframework.hateoas.mvc.ControllerLinkBuilder

import org.springframework.hateoas.Resources;
import org.springframework.hateoas.Resource;

@GetMapping(path="/recent", produces="application/hal+json")
public Resources<Resource<Taco>> recentTacos() {
	PageRequest page = PageRequest.of(0, 12, Sort.by("createdAt").descending());

	List<Taco> tacos = tacoRepo.findAll(page).getContent();
	// 결과를 리소스 타입으로 감싸기
	Resources<Resource<Taco>> recentResources = Resources.wrap(tacos);
	
	recentResources.add(
	//	new Link("http://localhost:8080/design/recent", "recents") // 의미없는 하드코딩 버전
	ControllerLinkBuilder.linkTo(DesignTacoController.class)
		.slash("recent")
		.withRel("recents"));
		
	return recentResources;
}
~~~
```
- `ControllerLinkBuilder`를 통해 URL을 하드코딩하지 않고 호스트 이름을 알 수 있으며, 관련 링크의 빌드를 도와주는 편리한 API를 제공한다.
- `linkTo()` 메서드를 통해 현재 컨트롤러의 경로를 지정(기본 경로 추가)
- `slash(내용)`메서드는 `/내용` 문자열을 URL에 추가한다.(매핑 경로 추가)
- `withRel(링크명)`을 통해 해당 하이퍼링크의 API명을 지정한다.

하지만 아래처럼 더 짧고 매핑 경로까지 직접 추가하지 않아도 되는 코드가 좋다.
```ad-example
title: 더 나은 버전의 하이퍼링크 추가 코드

~~~java
import static org.springframework.hateoas.mvc.ControllerLinkBuilder.*

Resources<Resource<Taco>> recentResources = Resources.wrap(tacos); recentResources.add(
	linkTo(methodOn(DesignTacoController.class).recentTacos())
	.withRel("recents"));
~~~
```
- `methodOn(컨트롤러)`은 컨트롤러 내부의 메소드를 호출할 수 있게 해준다.

## 리소스 어셈블러를 통한 하이퍼링크 추가

위 방법은 직관적이지만, 여러 객체를 처리해야할 때 매번 루프를 실행하므로 번거롭다.

각 객체의 하이퍼링크를 추가하기 위해 일일이 `Resources.wrap()`을 실행하는 대신, `ResourceSupport` 객체를 상속받는 리소스 객체를 생성해 자동으로 하이퍼링크를 추가할 수 있다.
### 리소스 객체 생성
`ResourceSupoort` 클래스는 리소스와 관련된 `Link` 객체들과 이것들을 관리하는 메서드를 가지고 있다.

```ad-example
title: 도메인 데이터와 하이퍼 링크를 갖는 타코 리소스

이때, 기존의 도메인 객체의 역할도 리소스 객체가 동시에 할 수 있도록 만들 수 있지만, 서로 쓸모없는 데이터를 가지고 있으므로 나누는 것이 좋을 수 있다.
- 도메인 객체는 도메인의 id 값을 가지고 있지만 링크 객체는 필요없다.
- 리소스 객체는 링크 객체를 가지고 있지만 self 링크가 식별자 역할을 하므로 id 값은 필요없다. 

~~~java
package tacos.web.api;

import java.util.Date;
import java.util.List;
import org.springframework.hateoas.ResourceSupport;
import lombok.Getter;
import tacos.Taco; // 도메인 객체

public class TacoResource extends ResourceSupport {

	// 도메인 객체와 달리 id값은 필요없다.
	@Getter
	private final String name;

	@Getter
	private final Date createdAt;

	@Getter
	private final List<IngredientResource> ingredients;

	public TacoResource(Taco taco) { // Taco 객체에서 속성값 복사
	    this.name = taco.getName();
	    this.createdAt = taco.getCreatedAt();
	    this.ingredients = taco.getIngredients();
	}
}
~~~
```
생성자를 통해 일반 도메인 객체를 리소스 객체로 바꾸는 역할을 한다.

### 리소스 어셈블러 구성
`ResourceAssemblerSupport`를 상속받은 리소스 어셈블러는 컨트롤러와 리소스 객체를 받아 하이퍼링크를 만들어낸다.

```ad-example
title: 타코 리소스를 구성하는 리소스 어셈블러
~~~java
package tacos.web.api;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;

import tacos.Taco;

public class TacoResourceAssembler extends ResourceAssemblerSupport<Taco, TacoResource> {
	// 생성자를 통해 하이퍼링크 생성
	public TacoResourceAssembler() {
		super(DesignTacoController.class, TacoResource.class);
	}

	// 도메인 객체를 리소스 객체로 만드는 메소드
	@Override
	protected TacoResource instantiateResource(Taco taco) {
		return new TacoResource(taco); // 리소스 객체가 오버라이드한 생성자를 가질 경우 직접 오버라이드 해줘야함
	}

	// 인스턴스 생성 + 하이퍼링크 추가 하는 메서드
	// 위의 instantiateResource 메서드를 이용한다.
	@Override
	public TacoResource toResource(Taco taco) {
		//첫번째 인자로 api를 나누는 식별자를 줘야함.
		return createResourceWithId(taco.getId(), taco);
	}
}
~~~
```

이를 이용해 다음과 같이 메서드를 변경하자.
```ad-example
title: 리소스 리스트 하이퍼링크 추가
~~~java
@GetMapping(path="/recent", produces="application/hal+json")
public Resources<TacoResource> recentTacos() {
	PageRequest page = PageRequest.of(0, 12, Sort.by("createdAt").descending());

	List<Taco> tacos = tacoRepo.findAll(page).getContent();

	List<TacoResource> tacoResources = new TacoResourceAssembler().toResources(tacos);

	Resources<TacoResource> recentResources = new Resources<TacoResource>(tacoResources);

	recentResources.add(
		linkTo(methodOn(DesignTacoController.class)
		.recentTacos())
		.withRel("recents"));
	return recentResources;
}
~~~
```
리턴 타입이 `Resources<Resource<Taco>>` 대신 `Resources<TacoResource>`로 바뀌었다.

앞선 리소스 어셈블러를 통해 리소스 객체 리스트를 만든 뒤 이를 통해 `Resources` 객체를 만들어 추가했다.

### 중첩 리소스 객체 구현

위의 각 타코 객체에는 식자재(ingredient)라는 중첩된 도메인 객체가 존재한다.

이들을 위해 추가로 하이퍼링크를 추가하려면 다음을 따르면 된다.

1. **식자재를 위한 리소스 객체, 리소스 어셈블러 생성**

```ad-example
title: `IngredientResource.java`

~~~java
package tacos.web.api;
import org.springframework.hateoas.ResourceSupport;
import lombok.Getter;
import tacos.Ingredient;
import tacos.Ingredient.Type;

public class IngredientResource extends ResourceSupport {

	@Getter
	private String name;
	
	@Getter
	private Type type;
	
	public IngredientResource(Ingredient ingredient) {
		this.name = ingredient.getName();
		this.type = ingredient.getType();
	}
}
~~~
```

```ad-example
title: `IngredientResourceAssembler.java`

~~~java
package tacos.web.api;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;
import tacos.Ingredient;

class IngredientResourceAssembler extends ResourceAssemblerSupport<Ingredient, IngredientResource> {
	public IngredientResourceAssembler() {
		super(IngredientController.class, IngredientResource.class);
	}
	
	@Override
	public IngredientResource toResource(Ingredient ingredient) {
		return createResourceWithId(ingredient.getId(), ingredient);
	}

	@Override
	protected IngredientResource instantiateResource(Ingredient ingredient) {
		return new IngredientResource(ingredient);
	}
}
~~~
```

앞서 생성했던 방시과 같은 방식이다.

2. **해당 리소스 객체를 포함하는 상위 리소스 객체 변경**

```ad-example
title: `TacoResource.java`
~~~java
package tacos.web.api;

import java.util.Date;
import java.util.List;
import org.springframework.hateoas.ResourceSupport;
import lombok.Getter;
import tacos.Taco; 

public class TacoResource extends ResourceSupport {

	private static final IngredientResourceAssembler ingredientAssembler = new IngredientResourceAssembler();

	@Getter
	private final String name;

	@Getter
	private final Date createdAt;

	@Getter
	private final List<IngredientResource> ingredients;

	public TacoResource(Taco taco) {
	    this.name = taco.getName();
	    this.createdAt = taco.getCreatedAt();
	    this.ingredients = ingredientAssembler.toResources(taco.getIngredients());
	}
}
~~~
```
각 도메인 객체의 식재료 리스트를 식재료 어셈블러를 통해 생성하도록 만들었다.


### `embedded` 관계 이름 짓기

우리가 만든 API는 다음과 같이 자동으로 `tacoRsourceList`라는 속성을 만들어준다.
```ad-example
title: 정해진 Json 필드명
~~~json
{
	"_embedded": {
		"tacoResourceList": [ // 리소스객체명 + List로 정해진다. (기본값)
			{
				"name": "Veg-Out",
				"createdAt": "2018-01-31T20:15:53.219+0000",
				"ingredients": [
				...
~~~
```
문제는 이것이 클라이언트 측에 하드코딩되어야 하며, 변경으로 인해 클라이언트에 오류가 생길 수도 있다.

이를 방지하기 위해 다음과 같이 `@Relation` 어노테이션을 통해 속성명을 바꿔줄 수 있다.

```ad-example
title: 리소스 객체
~~~java
@Relation(value="taco", collectionRelation="tacos")
public class TacoResource extends ResourceSupport {
	//...
}
~~~
```

이제 `tacoResourceList` 속성명은 `tacos`로 바뀐다.

