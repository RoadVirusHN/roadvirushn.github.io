---
title: 스프링 설정과 의존 관리 툴
date: 2023-01-06 04:36:53 +0900
tags: HIDE CRUDE
layout: obsidian
is_Finished: false
last_Reviewed: 2023-01-06 04:36:53 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# 스프링 설정과 의존 관리 툴

```ad-quote
title: 출처

_[초보 웹 개발자를 위한 스프링 5 프로그래밍 입문](https://www.kame.co.kr/nkm/detail.php?tcode=306&tbook_jong=3)_와 [스프링 인 액션](https://jpub.tistory.com/1040)의 내용을 바탕으로 정리한 내용입니다.
```

## 스프링5 설정 순서
- JDK 설치 및 환경 변수 설정
- 의존 관리 툴(메이븐, 그래이들) 설치 및 환경 변수 설정
- IDE 이클립스 설치
- 스프링 의존과 의존 관리 툴 플러그인 설치

## 의존 관리 툴 : 메이븐(Maven)

메이븐은 프로젝트 관리 및 빌드 툴이다.
메이븐을 설치하고 스프링 프로젝트를 만드려면 다음과 같은 순서를 따르자.

### 프로젝트 폴더 생성 및 `pom.xml` 설정
POM 파일은 크게 다음과 같은 정보를 포함하고 있다.
- **프로젝트 정보**: 프로젝트의 이름, 개발자의 목록, 라이센스 등의 정보 기술
- **빌드 설정**: 소스, 리소스, 라이프 사이클별 실행할 플러그인 등 빌드와 관련된 설정 기술
- **빌드 환경**: 사용자 환경별로 달라질 수 있는 프로파일 정보를 기술
- **POM 연관 정보**: 의존 모듈, 상위 프로젝트, 포함하고 있는 하위 모듈 기술

```ad-example
title: 프로젝트 폴더 설정과 `pom.xml` 예시
collapse: close

- `프로젝트명/src/main/java`폴더를 만든 뒤, `cd 프로젝트명/` 로 작업 영역을 옮긴다. 
- 프로젝트 폴더 내에서 아래 `pom.xml`을 복사하거나 `mvn archetype:generate`을 이용해 가벼운 설정 이후 생성할 수 있다.

~~~xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <groupId>회사명</groupId>
    <artifactId>프로젝트ID</artifactId>
    <version>버전 정보(ex) 0.0.1-SNAPSHOT)</version>
    <packaging>패키징 방법(ex)jar)</packaging>
    <name>프로젝트명</name>
	<description>프로젝트 설명</description>
    <properties>
        <java.version>자바 버전 ex)17.0</java.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.springframework</groupId> 
            <artifactId>spring-context</artifactId>
            <version>의존 버전 (ex)6.0.3)</version>
            <scope>compile</scope><!--'의존 <scope>'에 설명-->
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <!--<configuration>
	                플러그인에 필요한 설정
                </configuration>-->
            </plugin>
        </plugins>
    </build>
</project>
~~~
```

이후 `mvn compile`을 통해 실행 결과를 확인 해보자.

추가로 의존 모듈을 추가하고 싶으면 search.maven.org에서 검색하여 추가할 수 있다.

### 의존 \<scope\>의 예시
- **compile**: 컴파일 시 필요한 모듈, 테스트 및 런타임에도 클래스패스에 모듈 포함, 기본값
- **runtime**: 런타임에만 필요, 배포시에도 포함됨 (ex) JDBC 드라이버)
- **provided**: 컴파일 시 필요하지만 실제 런타임 때 컨테이너 같은 것에서 기본으로 제공하므로 배포시 제외됨(ex) 서블릿)
- **test**: 테스트 코드를 컴파일 시 필요, 테스트시에만 클래스패스에 포함, 배포시 제외 (ex) Mock)

### 의존 모듈 및 플러그인 설치

```ad-seealso
title: 의존 모듈과 플러그인의 차이
- **의존 모듈**은 프로젝트에서 필요로 하는 jar 파일로, classpath에 추가된다
- **플러그인**은 메이븐이 빌드하는 과정에 사용되는 jar파일로 classpath에 추가되지 않음
	- 메이븐은 플러그인의 기능들을 이용해 빌드한다.
```

필요한 플러그인이나 의존 모듈들은 빌드, 컴파일, 테스트 등의 동작 시, 메이븐 중앙 리포지토리에서 다운로드 받은 뒤 로컬 리포지토리에 저장되어 사용된다.
- 메이븐 중앙 리포지토리 url : `http://repo1.maven.org/maven2`
- 로컬 리포지토리 저장 경로 : `[USER_HOME]/.m2/repository/[groupId]/[artifactId]/[version]/[artifactId]-[version].jar`

이때, **메이븐이 자동으로 각 모듈과 플러그인들의 하위 의존들을 자동으로 설치**해준다.
- 이를 **의존 전이(Transitive Dependencies)**라고 한다.

### 메이븐 라이프사이클(Lifecycle)

라이프사이클은 **메이븐이 프로젝트를 빌드하는 과정을 의미**하며, 각 과정의 일부까지만 명령어를 통해 실행할 수 있다.

크게 **clean, build, site**의 세가지 라이프 사이클을 제공하며, 각 라이프 사이클은 추가로 단계(phase)로 나뉜다.
- **clean** 라이프 사이클 : 빌드 시 생성되었던 산출물을 삭제
	- 이전 산출물 : 업데이트 이전 리소스나 의존 모듈 등이 존재
- **build(default)** 라이프 사이클 : default 값, 프로젝트 패키징 및 배포 절차, 핵심 절차
	- 무려 도합 23개의 단계가 존재하며 일부 주요 단계만 설명한다.
		- **validate** : 프로젝트 상태, 필요 정보 체크
		- **compile** : 소스 코드 컴파일 및 클래스 출력 폴더에 클래스 생성
		- **test** : 테스트 실행
		- **package** : 컴파일 코드와 리소스 파일들을 `war`, `jar` 등으로 패키지 수행
			- `jar`은 라이브러리와 데스크톱 UI 앱에 주로 사용
			- `war`은 주로 서버에 배포하는 앱에 사용
		- **install** : 패키지를 로컬 저장소에 설치
		- **deploy** : 생성 패키지를 원격 저장소에 배포
- **site** 라이프 사이클 : 프로젝트 문서화 절차
	- 사이트 문서 자동 생성, 배포 등의 절차

라이프 사이클의 특정 단계 실행하려면 다음과 같이 실행하며, 앞선 모든 단계들을 실행한다.
```bash
mvn test
mvn deploy
mvn surefire:test # 특정 플러그인의 단계만 실행하기, 앞선 단계 실행 X
```
- 각 플러그인의 목적 혹은 기능을 골(goal)이라고 표현한다.

## 그래이들(Gradle)

XML 대신 Groovy 스크립트를 이용한 동적인 빌드를 지원하며, 스프링과 같은 의존성 주입 방식으로 모듈을 설치하며, 전체적으로 성능은 더욱 좋지만, 아직까진 메이븐이 더 잘 사용된다.

```ad-example
title: `프로젝트폴더/build.gradle` 파일 예시

~~~groovy
apply plugin: 'java' // 자바 플러그인 사용
sourceCompatibility = 17.0 // 현재 프로젝트 자바 버전
targetCompatibility = 17.0 // 디플로이 시 자바 버전
compileJava.options.encoding = "UTF-8" // 인코딩
repositories {
	mavenCentral() // 메이븐 중앙 레포지토리에서 의존 설치
}
dependencies {
	implementation 'org.springframework:spring-context:6.0.3'
} // spring-context 6.0.3버전 의존을 컴파일 시 설치
wrapper { // gradle이 없어도 의존을 설치할 수 있게 gradlew 생성
	gradleVersion = '7.6' // 현재 gradle 버전
}
~~~
```
- 위 예시 파일을 만든 후 `gradle wrapper` 명령어를 실행하면 `gradlew` 파일이 생성되어 gradle을 설치하지 않아도 명령어를 실행할 수 있다.
	- ex) `gradlew compileJava`
	- 메이븐의 `mnvw.cmd, mnvw`와 같은 용도
