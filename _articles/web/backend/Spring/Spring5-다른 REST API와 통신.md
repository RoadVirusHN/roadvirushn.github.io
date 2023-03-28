---
title: Spring5-다른 REST API와 통신
date: 2023-02-17 11:37:10 +0900
tags: HIDE CRUDE 
layout: obsidian
is_Finished: false
last_Reviewed: 2023-02-17 11:37:10 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# Spring5-다른 REST API와 통신

```ad-quote
title: 출처

_[초보 웹 개발자를 위한 스프링 5 프로그래밍 입문](https://www.kame.co.kr/nkm/detail.php?tcode=306&tbook_jong=3)_와 [스프링 인 액션](https://jpub.tistory.com/1040)의 내용을 바탕으로 정리한 내용입니다.
```

마이크로 서비스나, ML 서버, 외부 API 등 다른 REST API와 통신하거나 WebClient를 이용해 Spring으로 반응형 클라이언트를 만들 경우, REST API 통신을 해야할 필요가 있다. 

이를 위해 다음과 같은 프레임 워크들을 이용할 수 있다.

- **RestTemplate**: 스프링 프레임워크에서 제공하는 간단하고 동기화된 REST 클라이언트
- **Traverson**: 스프링 HATEOAS에서 제공하는 하이퍼링크를 인식하는 동기화 REST 클라이언트
- **WebClient**: 스프링 5에서 소개된 반응형 비동기 REST 클라이언트

## RestTemplate 이용
### RestTemplate
여러 장황한 REST API 코드를 제공해준다.
```ad-example
title: **RestTemplate**의 주요 메서드 12개
**RestTemplate**의 나머지 메서드들은 아래 메서드들의 오버로딩된 버전이다.
`TRACE`를 제외한 표준 HTTP 메서드를 사용가능하다.

|메서드|기능|
|---|---|
|`delete(...)`|지정된 URL의 리소스에 HTTP DELETE 요청을 수행|
|`exchange(...)`|지정된 HTTP 메서드를 URL에 대해 실행, 주어진 객체 포함 `ResponseEntity` 반환|
|`execute(...)`|지정된 HTTP 메서드를 URL에 대해 실행, 주어진 객체 반환|
|`getForEntity(...)`|HTTP GET 요청 전송, 주어진 객체 포함 `ResponseEntity` 반환|
|`getForObject(...)`|HTTP GET 요청 전송, 주어진 객체 반환|
|`headForHeaders(...)`|HTTP HEAD 요청 전송, 지정된 리소스 URL HTTP 헤더 반환|
|`optionsForAllow(...)`|HTTP OPTIONS 요청 전송, 지정된 URL의 Allow 헤더 반환|
|`patchForObject(...)`|HTTP PATCH 요청을 전송하며, 주어진 객체  반환|
|`postForEntity(...)`|URL에 데이터를 POST하며, 주어진 객체 포함 `ResponseEntity` 반환|
|`postForObject(...)`|URL에 데이터를 POST하며, 주어진 객체 반환|
|`put(...)`|리소스 데이터를 지정된 URL에 PUT|
```

주로 다음과 같이 세가지 형태로 오버로딩되어 있다.
- 가변 인자 리스트를 통해 매개변수를 문자열로 받는 형태
- `Map<매개변수명(String),매개변수값(String)>`에 지정된 URL 매개변수에 URL 문자열을 인자로 받는 형태
- `java.net.URI`를 URL에 대한 인자로 받기

```ad-example
title: `RestTemaplte`의 사용 방법
보통 필요할때 마다 객체를 만들거나 빈으로 만들어 관리하여 사용
~~~java
import org.springframework.web.client.RestTemplate;
//...

RestTemplate rest = new RestTemplate();

//...
@Bean
  public RestTemplate restTemplate() {
    return new RestTemplate();
  }
~~~
```

### 사용 예시

#### GET 요청
```ad-example
title: 주요 오버로딩 세가지 방법
~~~java
RestTemplate rest = new RestTemplate();
// 가변 인자로 매개변수 주입
public Ingredient getIngredientById(String ingredientId) {
  return rest.getForObject("http://localhost:8080/ingredients/{id}",
                            Ingredient.class, ingredientId);
}
// Map으로 매개변수 주입
public Ingredient getIngredientByIdMap(String ingredientId) {
	Map<String, String> urlVariables = new HashMap<>();
	urlVariables.put("id", ingredientId);
	return rest.getForObject("http://localhost:8080/ingredients/{id}", Ingredient.class, urlVariables);
}
// URI 객체 버전
public Ingredient getIngredientByIdURI(String ingredientId) {
	Map<String, String> urlVariables = new HashMap<>();
	urlVariables.put("id", ingredientId);
	URI url = UriComponentsBuilder
		.fromHttpUrl("http://localhost:8080/ingredients/{id}")
		.build(urlVariables);
	return rest.getForObject(url, Ingredient.class);
}

//getForEntity를 이용하면 헤더 값을 쉽게 얻을 수 있다.
public Ingredient getIngredientById(String ingredientId) {
	ResponseEntity<Ingredient> responseEntity = rest.getForEntity("http://localhost:8080/ingredients/{id}", Ingredient.class, ingredientId);
	log.info("Fetched time: " +
		responseEntity.getHeaders().getDate());
	return responseEntity.getBody();
}
~~~
```

#### PUT 요청

```ad-example
title: 리소스 쓰기
~~~java
// 데이터 추가
public void updateIngredient(Ingredient ingredient) {
	rest.put("http://localhost:8080/ingredients/{id}", ingredient, ingredient.getId()); //리턴값이 없다.
}
~~~
```

#### DELETE 요청

```ad-example
title: 리소스 삭제
~~~java
// 데이터 삭제
public void deleteIngredient(Ingredient ingredient) {
	rest.delete("http://localhost:8080/ingredients/{id}", ingredient.getId());
}
~~~
```

#### POST 요청
```ad-example
title: 리소스 변경
~~~java
public Ingredient createIngredient(Ingredient ingredient) {
	ResponseEntity<Ingredient> responseEntity = rest.postForEntity("http://localhost:8080/ingredients",
		ingredient,
		Ingredient.class);
	log.info("New resource created at " + responseEntity.getHeaders().getLocation());
	return responseEntity.getBody();
}
// 생성된 객체를 반환받으려면 postForObject()를 사용하자.
~~~
```

## Traverson
스프링 데이터 HATEOAS에서 같이 제공되며, 하이퍼미디어 API를 사용할 수 있다.

주어진 하이퍼링크를 돌아다니듯이 사용할 수 있어 붙여진 이름이다.

기존의 RestTemplate 또한 `ResponseEntity`를 이용하면 하이퍼링크를 사용할 수 있지만, Traverson이 훨씬 쉽게 사용 가능하다.

```ad-example
title: Traverson 설정
먼저 API의 기본 URI와 API 스타일을 지정해줘야 한다.
~~~java
import org.springframework.hateoas.MediaTypes;
import org.springframework.hateoas.client.Traverson;
// 혹은 빈으로 설정
Traverson traverson = new Traverson(
	URI.create("http://localhost:8080/api"),
	MediaTypes.HAL_JSON);
~~~
```

### 사용예

```ad-example
title: Traverson 데이터 조회 예시
`follow(관계명)` 메서드로 해당 링크를 따라갈 수 있다.

이후 `toObject()`를 호출해 리소스를 가져올 수 있다.
~~~java
public Iterable<Taco> getRecentTacosWithTraverson() {

	 ParameterizedTypeReference<Resources<Taco>> tacoType = new ParameterizedTypeReference<Resources<Taco>>() {};
	Resources<Taco> tacoRes = traverson.follow("tacos").follow("recents").toObject(tacoType);

// 혹은 가변인자로도 이동 가능하다.
//    Resources<Taco> tacoRes =
//        traverson
//          .follow("tacos", "recents")
//          .toObject(tacoType);
	return tacoRes.getContent();
}
~~~
```


```ad-example
title: Traverson + RestTemplate 사용 예시
**그러나 Traverson은 데이터를 쓰거나 삭제할 수 없다.**
따라서 RestTemplate를 이용해 서로를 보완해줄 수 있다.
~~~java
public Ingredient addIngredient(Ingredient ingredient) {
	String ingredientsUrl = traverson.follow("ingredients").asLink().getHref();
	return rest.postForObject(ingredientsUrl, ingredient, Ingredient.class);
}
~~~
```
