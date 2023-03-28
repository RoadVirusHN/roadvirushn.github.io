---
title: Spring5-스프링 시큐리티
date: 2023-02-10 13:25:06 +0900
tags: WEB SPRING BE SUMMARY HIDE
layout: obsidian
is_Finished: false
last_Reviewed: 2023-02-10 13:25:06 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# Spring5-스프링 시큐리티

```ad-quote
title: 출처

_[초보 웹 개발자를 위한 스프링 5 프로그래밍 입문](https://www.kame.co.kr/nkm/detail.php?tcode=306&tbook_jong=3)_와 [스프링 인 액션](https://jpub.tistory.com/1040)의 내용을 바탕으로 정리한 내용입니다.
```

```ad-warning
title: 스프링 부트를 이용한다는 가정 하에 진행됩니다.
```

## 스프링 시큐리티 개념 및 활성화

스프링에서 인증, 인가와 관련된 기능을 쉽게 구현할 수 있다.

다음과 같은 의존 모듈을 추가해야 한다.
- **org.springframework.boot.spring-boot-starter-security**
- **org.springframework.security.spring-security-test**

이를 통해 기본적으로 다음과 같은 기본 보안이 제공 된다.
- 모든 HTTP 요청 경로 인증
- 역할과 권한(단 초기에는 아무 권한도 역할도 없음)
- 스프링 시큐리티 기본 로그인 페이지(나중에 변경 가능)
- 사용자 **user**와 어플리케이션 로그 파일의 초기 랜덤 암호

## 스프링 시큐리티 구성

스프링 시큐리티는 다음과 같은 조건을 만족하는 구성 클래스를 이용해 설정한다.
- `WebSecurityConfigurerAdapter` 인터페이스를 구현
- `@EnableWebSecurity` 어노테이션 사용
- 다양한 인자의 `configure` 메서드들을 재정의

```ad-example
title:`SecurityConfig` 클래스 예시
collapse: true
- `configure` 
~~~java
package tacos.security;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation
                    .authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation
                    .web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web
                    .configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web
                    .configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

	// HTTP 보안 설정용 메서드
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
        .authorizeRequests()
        .antMatchers("/design", "/orders")
        .access("hasRole('ROLE_USER')")
        .antMatchers("/", "/**").access("permitAll");
    }
   
	// 사용자 인증 정보 구성용 메서드
    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.inMemoryAuthentication()
			.withUser("user1")
			.password("{noop}password1")
			.authorities("ROLE_USER")
			.and()
			.withUser("user2")
			.password("{noop}password2")
			.authorities("ROLE_USER");
    }
}
~~~
```

자세한 메서드 설정은 아래에서 배울 것이다.

```ad-tip
title: 개발 시 웹 브라우저를 `private` 모드로 설정하거나 관련 개발 모드를 사용하면 쿠키, 세션 등이 저장되지 않아 변화를 확인하기 좋다.
```

## 다양한 사용자 스토어 구성 방법
인증 및 인가를 구현하기 위해 사용자 정보를 저장할 필요가 있으며, 이는 `AuthenticationManagerBuilder` 인자를 가진 `configure` 메서드를 다양한 방법으로 오버라이딩하여 가능하다.

- **인메모리**
- **JDBC**
- **LDAP**
- **커스텀(여기서는 JPA)**

### 인메모리 사용자 스토어
소규모, 변경이 필요 없는 사용자만 이용한다면, 아예 코드 내부에 사용자를 정의할 수 있다. 앞선 예시를 다시 보자.
```ad-example
title: 인메모리 사용자 스토어 예시
~~~java
	// 사용자 인증 정보 구성용 메서드
    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.inMemoryAuthentication()
			.withUser("user1")
			.password("{noop}password1")
			.authorities("ROLE_USER")
			.and()
			.withUser("user2")
			.password("{noop}password2") // {noop}는 암호화하지 않음을 의미
			.authorities("ROLE_USER");
    }
~~~
```
위 결과로 `user1`과 `user2` 사용자가 생긴다. 
엄밀히 말하면 암호화하지 않은 암호이므로 접근 거부(403)이나 서버 에러(500)이 나타난다.
암호화 하는 방법은 다음 방법들에서 참고하자.

이 방법은 사용자에 변경사항이 있다면 코드를 바꾸고 재 빌드, 배포 설치해야 한다는 문제가 있으므로 왠만하면 테스트 용도 이외로는 사용되지 않는다.

### JDBC 사용자 스토어

사용자 정보를 관계형 데이터베이스로 유지관리 하기 위해 JDBC를 이용할 수 있다.
#### 사용자 스토어 설정
```ad-example
title: JDBC 기반 사용자 스토어 예시
~~~java
//...
import javax.sql.DataSource;
//...

@Autowired
DataSource dataSource; //dataSource 주입

// 사용자 인증 정보 구성용 메서드
    @Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.jdbcAuthentication()
		.dataSource(dataSource);
    }
~~~
```
#### 스프링 시큐리티 기본 사용자 쿼리

앞선 설정 만으로 다음과 같은 쿼리들을 기본 수행한다.

```ad-example
title: 기본 사용자 쿼리
~~~java
//유저 활성화 여부 -> 사용자 인증
public static final String DEF_USERS_BY_USERNAME_QUERY =
	"select username,password,enabled" +
	"from users " +
	"where username = ?"; 

// 유저의 권한 조회
public static final String DEF_AUTHORITIES_BY_USERNAME_QUERY = 
	"select username,authority " +
	"from authorities " +
	"where username = ?";

// 유저의 그룹과 그룹 권한 조회
public static final String DEF_GROUP_AUTHORITIES_BY_USERNAME_QUERY =
	"select g.id, g.group_name, ga.authority " +
	"from authorities g, group_members gm, group_authorities ga " +
	"where gm.username = ? " +
	"and g.id = ga.group_id " +
	"and g.id = gm.group_id";
~~~
```
따라서 jdbc로 연결된 데이터베이스 내부에 `users`, `authorities`, `group_members`, `group_authorities` 테이블들이 미리 정의되어있어야 한다.

이를 위해 `src/main/resources/schema.sql`(스키마 정의)와 `src/main/resources/data.sql`(데이터 추가)를 이용하면 된다.
- 앞서 말햇듯이 해당 두 sql은 어플리케이션 실행 시 자동 실행된다.
```ad-example
title: `src/main/resources/schema.sql` 예시
~~~sql
drop table if exists users;
drop table if exists authorities;
drop index if exists ix_auth_username;

create table if not exists users(
    username varchar2(50) not null primary key,
    password varchar2(50) not null,
    enabled char(1) default '1');

create table if not exists authorities (
    username varchar2(50) not null,
    authority varchar2(50) not null,
    constraint fk_authorities_users
       foreign key(username) references users(username));

create unique index ix_auth_username
    on authorities (username, authority);
~~~
```
```ad-example
title: `src/main/resources/data.sql` 예시
~~~sql
insert into users (username, password) values ('user1', 'password1');
insert into users (username, password) values ('user2', 'password2');

insert into authorities (username, authority)
    values ('user1', 'ROLE_USER');

insert into authorities (username, authority)
    values ('user2', 'ROLE_USER');
commit;
~~~
```

만약, 사용자 정보 쿼리를 원하는 다른 SQL로 대체하고 싶다면 다음과 같이 설정을 바꾸면 가능하다.
```ad-example
title: 사용자 정보 쿼리 커스터마이징

`usersByUsernameQuery` 커스터마이징 시 지켜야할 룰
- 매개변수(=`?`의 갯수)는 `username` 하나
- `username, password, enabled` 열의 값 반환

`authoritiesByUsernameQuery` 커스터마이징 시 지켜야할 룰
- 해당 사용자 이름과 부여된 권한을 0 이상의 행을 반환

`groupAuthoritiesByUsername` 커스터마이징 시 지켜야할 룰
- 그룹 id, 그룹 이름, 권한을 0 이상의 행을 반환

이를 통해 테이블명 등을 바꿀 수 있다.
~~~java
	@Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.jdbcAuthentication()
		.dataSource(dataSource)
        .usersByUsernameQuery(
            "select username, password, enabled from users " +
            "where username=?")
        .authoritiesByUsernameQuery(
            "select username, authority from authorities " +
            "where username=?")
    //이외에도 `groupAuthoritiesByUsername` 메서드 등도 존재
    }
~~~
```
#### 비밀번호 암호화 설정
스프링은 데이터베이스 유출에 방지해 비밀번호를 암호화하지 않으면 오류를 내게 되어있다.

다음과 같이 암호화 알고리즘을 추가할 수 있다.
```ad-example
title: 암호화 설정하기
~~~java
//...
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//...
	@Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.jdbcAuthentication()
		.dataSource(dataSource)
        .usersByUsernameQuery(
            "select username, password, enabled from users " +
            "where username=?")
        .authoritiesByUsernameQuery(
            "select username, authority from authorities " +
            "where username=?")
        .passwordEncoder(new BCryptPasswordEncoder());
    }
~~~
```
이때 `passwordEncoder` 메서드에 들어갈 수 있는 클래스는 다음과 같다.
- `BCryptPasswordEncoder`: bcrypt로 해싱 암호화
- `NoOpPasswordEncoder`: 암호화하지 않음
- `Pbkdf2PasswordEncoder`: PBKDF2로 암호화
- `SCryptPasswordEncoder`: scrypt로 해싱 암호화
- `StandardPasswordEncoder`: SHA-256로 해싱 암호화
- `PasswordEncoder` 인터페이스를 구현한 클래스
```ad-note
title: `PasswordEncoder` 클래스
~~~java
public interface PasswordEncoder {
	String encode(CharSequence rawPassword); // 암호화시 실행
	boolean matches(CharSequence rawPassword, String encodedPassword); // 입력 값과 암호를 비교시 실행
}
~~~
```

이제, 유저 추가 시, 유저의 비밀번호는 암호화되어 저장되며, 로그인 시, 입력한 비밀번호를 암호화 한뒤, DB의 암호화된 비밀번호와 비교하여 로그인한다.

다음은 암호화 하지않는 `NoEncodingPasswordEncoder` 예시이다. 
```ad-example
title: `NoEncodingPasswordEncoder` 예시
~~~java
package tacos.security;
import org.springframework.security.crypto.password.PasswordEncoder;

public class NoEncodingPasswordEncoder implements PasswordEncoder {

    @Override
    public String encode(CharSequence rawPwd) {
        return rawPwd.toString();
    }

    @Override
    public boolean matches(CharSequence rawPwd, String encodedPwd) {
        return rawPwd.toString().equals(encodedPwd);
    }
}
~~~
```

### LDAP 사용자 스토어

LDAP(Lightweight Directory Access Protocol)는 네트워크 상에 조직, 개인의 파일, 디바이스 등을 찾아볼 수 있게 하는 TCP/IP 기반 프로토콜로, 30년 이상 되었지만 여전히 여러 조직에서 데이터 공유를 위해 사용하고 있다.

스프링에서도 간단히 다음과 같이 LDAP 인증을 구성할 수 있다.
```ad-example
title: LDAP 인증 구성
~~~java
//...
@Override
protected void configure(AuthenticationManagerBuilder auth) throws Excpetion {
        /*
        auth
        .ldapAuthentication() // 루트에서부터 탐색
        .userSearchFilter("(uid={0})")
        .groupSearchFilter("member={0}");
		*/
		auth
        .ldapAuthentication()
        .userSearchBase("ou=people") // 탐색 기준점 조직 단위 설정
        .userSearchFilter("(uid={0})") 
        .groupSearchBase("ou=groups")
        .groupSearchFilter("member={0}")
}
~~~
```
#### 비밀번호 비교 구성

사용자가 직접 LDAP 서버에서 인증 받도록 하는 것이 기본이나, 사용자의 비밀번호를 LDAP 서버에서 비교하게 하여 권한을 부여받는 방법도 가능하다.

```java
auth 
.ldapAuthentication() 
.userSearchBase("ou=people") 
.userSearchFilter("(uid={0})") 
.groupSearchBase("ou=groups") 
.groupSearchFilter("member={0}")
.passwordCompare(); // 비밀번호 비교 인증 설정
.passwordEncoder(new BCryptPasswordEncoder()) // LDAP 서버에 저장될 암호화 설정
.passwordAttribute("userPasscode");// 비밀번호 속성 이름 설정(기본값: userPassocde)
```

#### 원격 LDAP 서버 참조
기본적으로 LDAP 서버의 위치를 `localhost:33389` 포트로 간주하므로, `contextSource()` 메서드로 서버 위치를 재구성할 수 있다.
```ad-example
title: 원격 LDAP 서버 참조
~~~java
auth 
.ldapAuthentication() 
.userSearchBase("ou=people") 
.userSearchFilter("(uid={0})") 
.groupSearchBase("ou=groups") 
.groupSearchFilter("member={0}")
.passwordCompare();
.passwordEncoder(new BCryptPasswordEncoder()) 
.passwordAttribute("userPasscode")
.contextSource().url("ldap://tacocloud.com:389/dc=tacocloud,dc=com"); // 서버 위치 설정
~~~
```

#### 내장된 LDAP 서버 구성

스프링 시큐리티 내장 LDAP 서버를 이용하고 싶다면 다음 의존 모듈을 추가하자.
- **org.springframework.boot.spring-boot-starter-data-ldap**
- **org.springframework.ldap.spring-ldap-core**
- **org.springframework.security.spring-security-ldap**

```ad-example
title: 내장 LDAP 인증 구성
~~~java
auth
	.ldapAuthentication()
	.userSearchBase("ou=people")
	.userSearchFilter("(uid={0})")
	.groupSearchBase("ou=groups")
	.groupSearchFilter("member={0}")
	.contextSource()
	.root("dc=tacocloud,dc=com") //내장 LDAP 서버 설정
	.ldif("classpath:users.ldif") // LDIF 파일 로드
	.and()
	.passwordCompare()
	.passwordEncoder(new BCryptPasswordEncoder())
	.passwordAttribute("userPasscode");
~~~
```
이때 LDIF(LDAP Data Interchange Format) 파일로부터 데이터를 로드할 수 있다.

```ad-example
title: `users.ldif` 예시
collapse: true
~~~ldif
dn: ou=groups,dc=tacocloud,dc=com
objectclass: top
objectclass: organizationalUnit
ou: groups

dn: ou=people,dc=tacocloud,dc=com
objectclass: top
objectclass: organizationalUnit
ou: people

dn: uid=tacocloud,ou=people,dc=tacocloud,dc=com
objectclass: top
objectclass: person
objectclass: organizationalPerson
objectclass: inetOrgPerson
cn: GD Hong
sn: Hong
uid: user1
userPasscode: password1

dn: uid=tacocloud,ou=people,dc=tacocloud,dc=com
objectclass: top
objectclass: person
objectclass: organizationalPerson
objectclass: inetOrgPerson
cn: MS Park
sn: Park
uid: user2
userPasscode: password2

dn: cn=USER,ou=groups,dc=tacocloud,dc=com
objectclass: top
objectclass: groupOfNames
cn: USER
member: uid=user1,ou=people,dc=tacocloud,dc=com
member: uid=user2,ou=people,dc=tacocloud,dc=com
~~~
```

```ad-info
title: LDIF?

LDAP 데이터를 나타내는 표준 표기, 각 레코드는 하나 이상의 줄로 구성되며, 각 줄은 한 쌍으로 된 `name:value`를 포함, 각 레코드는 빈 줄로 구분
```

### 커스텀 사용자 스토어(JPA)

사용자 정보에 사용자명과 유저명 이외에도 이름, 이메일, 가입날짜 등 다양한 추가 데이터를 넣고, JPA 기반의 처리를 해보자.

#### 사용자 도메인 객체와 퍼시스턴트 정의하기
스프링 시큐리티의 `UserDetails` 인터페이스를 구현하면 사용자 클래스로 사용할 수 있다.

```ad-example
title: `User` 클래스
collapse: true
~~~java
package tacos;

import java.util.Arrays;
import java.util.Collection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core
.authority.SimpleGrantedAuthority;
import org.springframework.security.core
.userdetails.UserDetails;
import lombok.AccessLevel;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Entity
@Data
@NoArgsConstructor(access=AccessLevel.PRIVATE, force=true)
@RequiredArgsConstructor
public class User implements UserDetails {

    private static final long serialVersionUID = 1L;
    
    @Id
    @GeneratedValue(strategy=GenerationType.AUTO)
    private Long id;
    private final String username;
    private final String password;
    private final String fullname;
    private final String street;
    private final String city;
    private final String state;
    private final String zip;
    private final String phoneNumber;

    @Override
    public Collection<? extends
            GrantedAuthority> getAuthorities() {
        return Arrays.asList(new
                SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
~~~
```

이후 `CrudRepository`를 통해 자동으로 레포지토리를 생성한다.
- 자세한 것은 [[Spring5-JPA]] 참조

```ad-example
title: `tacos/data/UserRepository.java`
~~~java
package tacos.data;

import org.springframework.data.repository.CrudRepository;
import tacos.User;

public interface UserRepository extends CrudRepository<User, Long> {
    User findByUsername(String username);
}
~~~
```
`findByUsername` 메서드를 추가로 정의하여 앞으로 사용자 명세 서비스에 생성한다.

#### 사용자 명세 서비스 생성

스프링 시큐리티의 `UserDetailsService`는 사용자 이름으로 `UserDetails` 객체를 반환하거나 `UsernameNotFoundException`을 발생시키는 인터페이스이다.

```ad-example
title: `UserDetailsService` 인터페이스
절대로 `null`을 반호나하면 안된다.
~~~java
public interface UserDetailsService {
	UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
}
~~~
```

이를 구현한 서비스를 다음과 같이 구현할 수 있다.

```ad-example
title: `UserRepositoryUserDetailsService` 서비스 구현
~~~java
package tacos.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core
        .userdetails.UserDetails;
import org.springframework.security.core
        .userdetails.UserDetailsService;
import org.springframework.security.core
        .userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import tacos.User;
import tacos.data.UserRepository;

@Service
public class UserRepositoryUserDetailsService implements UserDetailsService {
    
    private UserRepository userRepo;

	@Autowired
    public UserRepositoryUserDetailsService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepo.findByUsername(username);
        if (user != null) {
            return user;
        }
        throw new UsernameNotFoundException("User '" + username + "' not found");
    }
}
~~~
```
이후 `SecurityConfig`에 해당 서비스를 추가하고, 이를 이용해 유저 인증을 호출한다.

```ad-example
title: `SecuritConfig`에 `UserDetailsService`와 인증 메서드 변경
또한, `@Bean`으로 관리되는 암호화 과정을 추가한다. 
~~~java
//...
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.context.annotation.Bean;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
//...
public class SecurityConfig extends WebSecurityConfigurerAdapter {
	//...
	@Autowired
    private UserDetailsService userDetailsService;
	
	@Bean
    public PasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }

	@Override
    public void configure(AuthenticationManagerBuilder auth) throws Exception{
        auth.userDetailsService(userDetailsService)
        .passwordEncoder(encoder());
    }
}
~~~
```

이제 JPA를 이용한 사용자 인증을 마쳤다.

#### 사용자 등록하기
이제 사용자 등록 컨트롤러와 뷰를 구현해 사용자 등록을 해보자.
```ad-example
title: 사용자 등록 컨트롤러(src/main/java/tacos/security/RegistrationController.java)
~~~java
package tacos.security;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import tacos.data.UserRepository;

@Controller
@RequestMapping("/register")
public class RegistrationController {

    private UserRepository userRepo;

    private PasswordEncoder passwordEncoder;

    public RegistrationController(
            UserRepository userRepo, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public String registerForm() {
        return "registration";
    }

    @PostMapping
    public String processRegistration(RegistrationForm form) {
        userRepo.save(form.toUser(passwordEncoder));
        return "redirect:/login";
    }
}
~~~
```

```ad-example
title:`RegistrationForm.java`
collapse: true
~~~java
package tacos.security; 

import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.Data;
import tacos.User;

@Data
public class RegistrationForm {
	private String username;
	private String password;
	private String fullname;
	private String street;
	private String city;
	private String state;
	private String zip;
	private String phone;

	public User toUser(PasswordEncoder passwordEncoder) {
		return new User(username, passwordEncoder.encode(password), fullname, street, city, state, zip, phone);
	}
}
~~~
```

```ad-example
title: `registration.html` Thymeleaf 등록 폼 뷰
collapse: true
~~~html
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml"
    xmlns:th="http://www.thymeleaf.org">
  <head>
    <meta charset="EUC-KR">
    <title>Taco Cloud</title>
  </head>
  <body>
  <h1>Register</h1>
  <img th:src="@{/images/TacoCloud.png}" />
  <form method="POST" th:action="@{/register}" id="registerForm">
    <label for="username">Username: </label>
    <input type="text" name="username" /><br />
    <label for="password">Password: </label>
    <input type="password" name="password" /><br />
    <label for="confirm">Confirm password: </label>
    <input type="password" name="confirm" /><br />
    <label for="fullname">Full name: </label>
    <input type="text" name="fullname" /><br />
    <label for="street">Street: </label>
    <input type="text" name="street" /><br />
    <label for="city">City: </label>
    <input type="text" name="city" /><br />
    <label for="state">State: </label>
    <input type="text" name="state" /><br />
    <label for="zip">Zip: </label>
    <input type="text" name="zip" /><br />
    <label for="phone">Phone: </label>
    <input type="text" name="phone" /><br />
    <input type="submit" value="Register" />
  </form>
  </body>
</html>
~~~
```

하지만 현재 모든 페이지에 인증이 필요하도록 설정되어 있으므로, 비회원이 등록페이지를 볼 수 없다. 이를 해결할 것이다.

## 웹 요청 보안 처리
`protected void configure(HttpSecurity http) throws Exception`을 재정의하면 다음 기능을 구현할 수 있다.
- HTTP 요청 처리를 허용하기 전에 충족되어야 할 특정 보안 조건을 구성(인가)
- 커스텀 로그인 페이지를 구성
- 사용자가 애플리케이션의 로그아웃을 할 수 있도록 한다.
- CSRF 공격으로부터 보호하도록 구성

### 웹 요청 보안 처리

다음 코드는 인가를 구현하게 해준다.
```ad-example
title: `SecurityConfig` 클래스 두번째 메서드
**보안 규칙의 순서는 아주 중요하다!** 예를 들어 `antMatchers("/", "/**").permitAll();`가 맨 앞에 온다면, 그 뒤의 패턴과 관계없이 모두 접근 가능하게 된다.
~~~java
//...
@Override
protected void configure(HttpSecurity http) throws Exception {
	http
		.authorizeRequests()
		.antMatchers("/design", "/orders") // design, orders 페이지는 
		.hasRole("ROLE_USER") // ROLE_USER 권한이 있어야 접근 가능
		.antMatchers("/", "/**").permitAll(); // 나머지는 전부 접근 가능
}
~~~
```
`anthorizeRequests()`는 `ExpressionInterceptUrlRegistry` 객체를 반환한다. 
`ExpressionInterceptUrlRegistry` 객체는 `antMatchers()` 메서드를 통해 경로 및 패턴을 지정해 요구사항을 구성한다.
```ad-example
title:요청 경로가 보안 처리되는 방법을 정의 하는 구성 메서드
이외에도 다음과 같은 메서드들로 규칙을 구성할 수 있다.

|메서드|하는일|
|---|---|
|`access(String)`|SpEL 표현식이 true면 접근 허용|
|`denyAll()`|모든 접근 거부|
|`authenticated()`|익명이 아닌 사용자로 인증되면 접근 허용|
|`not()`|다른 접근 메서드 효력 무효|
|`rememberMe()`|쿠키나 DB로 저장된 자동 고르인을 통해 인증된 경우 접근 허용|
더 자세한 것은 [공식 문서](https://docs.spring.io/spring-security/reference/servlet/authorization/expression-based.html) 참조
```

더욱 풍부하고 자세한 보안 규칙을 선언하기 위해 [**SpEL(Spring Expression Language, 스프링 표현식 언어)**](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/expressions.html) 사용하면 다음과 같은 표현이 가능하다.

```ad-example
title: SpEL 예시
화요일의 `/design, /orders` 접근은 `ROLE_USER` 권한이 있어야 함.
~~~java
@Override
protected void configure(HttpSecurity http) throws Exception {
	http
		.authorizeRequests()
		.antMatchers("/design", "/orders")
		.access("hasRole('ROLE_USER') &&" +
		"T(java.util.Calendar).getInstance().get()" +
		"T(java.util.Calendar).DAY_OF_WEEK) == " +
		"T(java.util.Calendar).TUESDAY")
		.antMatchers("/", "/**").access("permitall");
}
~~~
```

### 커스텀 로그인 페이지 생성

다음과 같은 설정으로 커스텀 로그인 페이지 경로를 지정할 수 있다.
```ad-example
title: 커스텀 로그인 페이지 경로 지정하기
~~~java
//...
@Override
protected void configure(HttpSecurity http) throws Exception {
	http
		.authorizeRequests()
		.antMatchers("/design", "/orders") 
		.hasRole("ROLE_USER")
		.antMatchers("/", "/**").permitAll()
		.and() // 새로운 구성 시작
		.formLogin() // 로그인 페이지 구성 시작
		.loginPage("/login"); // 로그인 페이지 경로: 이곳에서 로그인 시도
		.loginProcessingUrl("/authenticate") // 로그인 처리 경로 : 로그인 시도 시 옮겨지는 페이지
		.usernameParameter("user") // 로그인 post 요청 유저명 필드 이름 변경
		.passwordParameter("pwd") // 로그인 post 요청 비밀번호 필드 이름 변경
		.defaultSuccessUrl("/desigin", true) // 로그인 성공시 무조건 "/design" 페이지로 이동
		// 두번째 true가 안주어지면 기본 false로, 로그인 이전에 있던 페이지가 있다면 "/design" 대신 그곳으로 이동됨.
}
~~~
```
이제 해당 로그인 페이지 경로를 처리하는 컨트롤러를 제공해야 한다.
```ad-example
title: `WebConfig`에 뷰 컨트롤러 선언
~~~java
//...
@Override
public void addViewControllers(ViewControllerRegistry registry) {
	registry.addViewController("/").setViewName("home");
	registry.addViewController("/login");
}
~~~
```

### 로그아웃하기

```java
.and()
.logout() // "/logout" 페이지로 post 요청시 로세션 및 사용자 정보 제거
.logoutSuccessUrl("/") // logout 이후 이동할 페이지
```
위와 같은 보안 구성을 추가하고, `/logout` 페이지로 `post` 요청을 보내는 버튼을 추가하면 된다.

### CSRF 공격 방어

**CSRF(Cross-Site Request Forgery, 크로스 사이트 요청 위조)**는 사용자가 웹사이트에 로그인 해있을 때, 악의적인 코드가 삽입된 페이지를 열게하여 악의적인 폼 제출, 위조된 명령을 하게 하는 공격이다.
- 예를 들어 로그인한 사람에게 공격자에게 송금하도록 하는 코드를 실행하게 한다던가...

이를 막기 위해 폼의 숨김(hidden) 필드에 CSRF 토큰을 삽입해, 폼 제출 시 이 토큰을 같이 보내도록 하여 서버에서 비교하여 정상적인 요청인지 확인하게 한다. 다르거나, 토큰이 없다면 악의적인 제출로 판단하고 거부한다.

스프링 시큐리티에서는 기본적으로 CSRF 방어 기능이 활성화 되어 있으며, 요청하는 뷰에서 `_csrf` 필드를 제출하는 폼에 포함시키면 된다.
- `<input type="hidden" name="_csrf" th:value="${_csrf.token}"/>` 처럼...
- 만약 스프링 시큐리티 dialect를 사용중이고, JSP나 Thymeleaf라면 위 조차도 필요 없음

비활성화 할 수 있지만, 성능상 큰 차이가 없고, 치명적인 결과를 초래한다.
따라서, REST API 서버를 만드는 경우가 아니라면, 그리하지 말자.

명시적으로 구현하려면 `.and().csrf()`를 구성에 추가하자.

## 사용자 인가 및 정보 얻기

사용자가 적법한 사용자인지 이외에도, 현재 사용자에 대한 정보를 얻는 것 또한 유저 경험을 위해 중요하다.

이는 다음과 같이 4가지 방법으로 가능하다.
- `Principal` 객체를 컨트롤러 메서드에 주입
- `Authentication` 객체를 컨트롤러 메서드에 주입
- `@AuthenticationPrincipal` 어노테이션을 메서드에 지정
- `SecurityContextHolder`를 사용해서 보안 컨텍스트를 얻기
### `Principal` 객체를 컨트롤러 메서드에 주입

```ad-example
title: `Principal` 객체를 컨트롤러 메서드에 주입
~~~java
@PostMapping
public String processOrder(@Valid Order order, Errors errors, SessionStatus sessionStatus, Principal principal) {
	//...
	User user = userRepository.findByUsername(principal.getName());

	order.setUser(user);
}
~~~
```
보안과 관련없는 코드가 혼재하여 코드가 읽기 힘듦

### `Authentication` 객체를 컨트롤러 메서드에 주입

```ad-example
title: `Authentication` 객체를 컨트롤러 메서드에 주입
~~~java
@PostMapping
public String processOrder(@Valid Order order, Errors errors, SessionStatus sessionStatus, Authentication authentication) {
	//...
	User user = (User) authentication.getPrincipal();

	order.setUser(user);
}
~~~
```
보안과 관련없는 코드가 없지만 타입변환이 필요함

### `@AuthenticationPrincipal` 어노테이션을 메서드에 지정

```ad-example
title: `@AuthenticationPrincipal` 어노테이션을 메서드에 지정
~~~java
//...
import org.springframework.security.core.annotation.AuthenticationPrincipal;
//...
import tacos.User;
//...
@PostMapping
public String processOrder(@Valid Order order, Errors errors, SessionStatus sessionStatus, @AuthenticationPrincipal User user) {
	if (errors.hasErrors()) {
		return "orderForm";
	}

	order.setUser(user);

	orderRepo.save(order);
	sessionStatus.setComplete();

	return "redirect:/";
}
~~~
```
타입 변환이 필요 없고, 위 방법과 동일하게 보안 특정 코드만 가짐. 자주 사용하는 방법.

### `SecurityContextHolder`를 사용해서 보안 컨텍스트를 얻기

```ad-example
title: `SecurityContextHolder`를 사용해서 보안 컨텍스트를 얻기
~~~java
Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
User user = (User) authentication.getPrincipal();
~~~
```

이 방법은 `Authentication` 방법보다 더욱 길지만, 어플리케이션 어디에서든 사용할 수 있다는 장점이 있다.

### 관련 컨트롤러 구현 예시
위 방법들을 이용해 다음과 같이 컨트롤러를 구현할 수 있다.

```ad-example
title: `OrderController`의 `orderForm()` 변경하기
주문 페이지의 폼에 로그인 사용자의 정보를 미리 채워두는 메서드
~~~java
import org.springframework.web.bind.annotation.ModelAttribute;
//...

@RequestMapping("/orders")
@SessionAttributes("order")
public class OrderController {
	//...
    @GetMapping("/current")
    public String orderForm(@AuthenticationPrincipal User user,
            @ModelAttribute Order order) {
        if (order.getDeliveryName() == null) {
            order.setDeliveryName(user.getFullname());
        }
        if (order.getDeliveryStreet() == null) {
            order.setDeliveryStreet(user.getStreet());
        }
        if (order.getDeliveryCity() == null) {
            order.setDeliveryCity(user.getCity());
        }
        if (order.getDeliveryState() == null) {
            order.setDeliveryState(user.getState());
        }
        if (order.getDeliveryZip() == null) {
            order.setDeliveryZip(user.getZip());
        }
        return "orderForm";
    }
~~~
```

