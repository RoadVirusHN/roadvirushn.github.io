---
title: Spring5 입문-DB 연동
date: 2023-01-14 13:16:11 +0900
tags: WEB SPRING BE SUMMARY HIDE
layout: obsidian
is_Finished: false
last_Reviewed: 2023-01-14 13:16:11 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# DB 연동
```ad-quote
title: 출처

_[초보 웹 개발자를 위한 스프링 5 프로그래밍 입문](https://www.kame.co.kr/nkm/detail.php?tcode=306&tbook_jong=3)_와 [스프링 인 액션](https://jpub.tistory.com/1040)의 내용을 바탕으로 정리한 내용입니다.
```

## 의존 모듈 추가 및 DB 설정

1. Mysql를 기준으로 진행되며 Maven이나 Gradle을 이용해 다음과 같은 의존 모듈을 추가하자.
	- **spring-jdbc** : JdbcTemplate, 스프링 트랜잭션 기능 등의 기능을 제공
		- `spring boot`의 경우: **spring-boot-starter-jdbc**
	- **tomcat-jdbc** : DB 커넥션 풀 기능을 제공
	- **mysql-connector-java** : MySQL 연결에 필요한 JDBC 드라이버를 제공
2. Mysql은 공식 레퍼런스를 이용해 설치하거나 Docker를 이용해 생성하자.
3. 이후 DB 서버에 접속해 직접 SQL 구문을 이용해 DB, 사용자, 테이블 생성 및 권한 설정을 한다.
```ad-example
title: sql문 예시
만약 스프링 부트를 사용한다면, `src/main/resources/schema.sql, data.sql` 파일의 SQL 구문을 애플리케이션 실행시 자동으로 실행한다.
~~~sql
create user 'spring5'@'localhost' identified by 'spring5';
create database spring5fs character set=utf8;
grant all privileges on spring5fs.* to 'spring5'@'localhost';
create table spring5fs.MEMBER (
	ID int auto_increment primary key,
	EMAIL varchar(255),
	PASSWORD varchar(100),
	NAME varchar(100),
	REGDATE datetime,
	unique key (EMAIL)
) engine=InnoDB character set = utf8;
~~~
```
4. DB와 통신할 때 사용하는 메서드를 모아놓은 객체인 DAO(Data Access Object) 또한 정의해줘야 한다.
```ad-example
title: /src/main/java/spring/MemberDao.java

추가로 구성 클래스로 하단의 `memberDao`를 빈으로 추가하자.
~~~java
package spring;
import java.util.Collection;
public class MemberDao {
	public Member selectByEmail(String email) {
		return null;
	}
	
	public void insert(Member member) {}

	public void update(Member member) {}

	public Collection<Member> selectAll() {
		return null;
	}
}
~~~
```

## DataSource 설정

JDBC API는 `DriverManager` 객체 혹은 `DataSource` 객체를 통해 커넥션 풀에서 연결을 가져올 수 있다.

```ad-info
title: 커넥션 풀(Connection pool)이란?
DBMS 연결을 생성하는 시간을 줄이고, 발생하는 부하를 제한하기 위해 일정 개수의 DB 커넥션을 미리 생성해두고 이를 사용시 마다 대여, 반납하는 방식

각 커넥션은 사용 중인 활성 상태, 대기 중인 유휴 상태가 존재한다.
```

### Tomcat JDBC Datasource 클래스

모든 Datasource 클래스는 `javax.sql.Datasource`를 구현해야 하며,  우리는 Tomcat JDBC 모듈의 Datasource 클래스 이용할 것이다.

```ad-example
title: `/src/main/java/config/AppCtx.java`

먼저 `DataSource`를 스프링 빈으로 등록하고 주입을 받도록 한다.
이외의 DB 설정은 다음이 있다.
- 커넥션 할당 시 검사(`setTestOnBorrow`)
- 커넥션 유효 쿼리 지정(`setValidationQuery("select 1")`)
- 최소 커넥션 갯수(`setMinIdle`)
- 최대 연결 할당 대기 시간(`setMaxWait(default=30초)`)
- 유휴 연결 제거 대기 시간(`setMinEvictableIdleTimeMillis(default=60초)`)

~~~java
package config;

import org.apache.tomcat.jdbc.pool.DataSource;
//...

@Configuration
public class DbConfig {
	@Bean(destroyMethod="close") // DataSource 객체 소멸 시 close 메서드(커넥션 풀 비우기)를 실행
	public DataSource dataSource() {
		DataSource ds = new DataSource(); // 객체 생성
		ds.setDriverClassName("com.mysql.jdbc.Driver"); // JDBC Mysql 드라이버 사용
		ds.setUrl("jdbc:mysql://localhost/spring5fs?characterEncoding=utf8"); // URL 지정
		ds.setUsername("spring5"); // 유저명 설정
		ds.setPassword("spring5"); // 패스워드 설정
		ds.setInitialSize(2); // 초기 커넥션 개수 지정
		ds.setMaxActive(10); // 최대 커넥션 개수 지정
		ds.setTestWhileIdle(true); // 유휴 상태 연결 주기적으로 검사
		ds.setMinEvictableIdleTimeMillis(1000*60*3); // 최소 유휴 시간 3분
		ds.setTimeBetweenEvictionRunsMillis(10*1000); // 10초 주기 검사
		return ds;
	}
}
~~~
```

위와 같이 설정하면 아래와 같이 연결을 가져와 사용할 수 있다.

```ad-example
title: `/src/main/java/dbquery/DbQuery.java`

~~~java
package dbquery;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import javax.sql.DataSource;
public class DbQuery {
    private DataSource dataSource;
    public DbQuery(DataSource dataSource) {
        this.dataSource = dataSource;
    }
    public int count() {
        Connection conn = null;
        try {
            conn = dataSource.getConnection(); // 연결 가져오기
            try (Statement stmt = conn.createStatement(); // sql문 생성 준비를 위한 Statement
                    ResultSet rs = stmt.executeQuery("select count(*) from MEMBER")) {
                rs.next(); 
                return rs.getInt(1); // 결과 값인 ResultSEt 
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        } finally {
            if (conn != null)
                try {
                    conn.close();
                } catch (SQLException e) {
                }
        }
    }
}
~~~
```

## JdbcTemplate

Spring은 JDBC, JPA, MyBatis 등 여러 기술을 사용할 수 있지만 이번에는 JdbcTemplate를 사용하는 방법을 배워보자.

JdbcTemplate 클래스를 이용하면 켐플릿 메서드 패턴과 전략 패턴을 이용하여 기존 JDB API의 구조적 반복을 줄이고 재사용성을 늘릴 수 있다.

예시는 다음과 같다.

```ad-example
title: JDBC API 연동 코드
collapse: close
~~~java
Member member;
Connection conn = null;
PreparedStatement pstmt = null;
ResultSet rs = null;
try {
	conn = DriverManager.getConnection("jdbc:mysql://localhost/spring5fs", "spring5", "spring5");
	// ------↑↑-----반복되는 코드------↑↑-----
	pstmt = conn.prepareStatement("select * from MEMBER where EMAIL = ?");
	pstmt.setString(1, email);
	rs = pstmt.executeQuery();
	if (rs.next()) {
		member = new Member(rs.getString("EMAIL"), 
			rs.getString("PASSWORD"),
			rs.getString("NAME"),
			rs.getTimestamp("REGDATE"));
		member.setId(rs.getLong("ID"));
		return member;
	} else {
		return null;
	}
	// ------↓↓-----반복되는 코드------↓↓-----
} catch (SQLException e) {
	e.printStackTrace();
	throw e;
} finally {
	if (rs != null)
		try { rs.close(); } catch (SQLException e2) {}
	if (pstmt != null)
		try { pstmt.close(); } catch (SQLException e1) {}
	if (conn != null)
		try { conn.close(); } catch (SQLException e) {}
}
~~~
```

```ad-example
title: Jdbc Template 코드
collapse: close
~~~java
List<Member> results = jdbcTemplate.query(
	"select * from MEMBER where EMAIL = ?",
	new RowMapper<Member>(){
		@Override
		public Member mapRow(ResultSet rs, int rowNum) throws SQLException {
			Member member = new Member(rs.getString("EMAIL"),
				rs.getString("PASSWORD"),
				rs.getString("NAME"),
				rs.getTimestamp("REGDATE"));
			member.setId(rs.getLong("ID"));
			return member;
		}
	},
	email);
return results.isEmpty() ? null : results.get(0);
~~~
```
기존의 JDBC 코드에 비해 훨씬 줄어든다는 점을 알 수 있다.

`JdbcTemplate`를 사용하면 짧은 코드로 손쉽게 쿼리를 실행할 수 있다.

### JdbcTemplate 생성

`jdbc.core.JdbcTemplate` 객체를 생성하고 `dataSource` 객체를 할당해 준 뒤, 해당 DAO를 빈 객체로 등록해주자.

```ad-example
title: `MemberDao` 전문
collapse: close
~~~java
package spring;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List; 
import java.sql.Timestamp;

import javax.sql.DataSource;

import org.springframework.jdbc.core.JdbcTemplate; // JdbcTemplate 임포트
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

public class MemberDao {
    private JdbcTemplate jdbcTemplate;

    public MemberDao(DataSource dataSource) { // 생성자로 JdbcTemplate와 데이터베이스 설정
        this.jdbcTemplate = new JdbcTemplate(dataSource); // 구성 클래스 추가 시 datasource를 건네줘야 함
    }

    public Member selectByEmail(String email) {
        List<Member> results = jdbcTemplate.query( // query 메서드를 통한 조회
                "select * from MEMBER where EMAIL = ?",
                new RowMapper<Member>() {
                    @Override
                    public Member mapRow(ResultSet rs, int rowNum) throws SQLException {
                        Member member = new Member(
                                rs.getString("EMAIL"),
                                rs.getString("PASSWORD"),
                                rs.getString("NAME"),
                                rs.getTimestamp("REGDATE").toLocalDateTime());
                        member.setId(rs.getLong("ID"));
                        return member;
                    }
                }, email);

        return results.isEmpty() ? null : results.get(0);
    }

	public void insert(Member member) {
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(new PreparedStatementCreator() { // update 메서드로 insert도 진행
            @Override
            public PreparedStatement createPreparedStatement(Connection con)
                    throws SQLException {
                // 파라미터로 전달받은 Connection을 이용해서 PreparedStatement 생성
                PreparedStatement pstmt = con.prepareStatement(
                        "insert into MEMBER (EMAIL, PASSWORD, NAME, REGDATE) " +
                        "values (?, ?, ?, ?)",
                        new String[] { "ID" });

				// 인덱스 파라미터 값 설정
                pstmt.setString(1, member.getEmail());
                pstmt.setString(2, member.getPassword());
                pstmt.setString(3, member.getName());
                pstmt.setTimestamp(4,
                        Timestamp.valueOf(member.getRegisterDateTime()));

				// 생성한 PreparedStatement 객체 리턴
                return pstmt;
            }
        }, keyHolder);

		Number keyValue = keyHolder.getKey();
        member.setId(keyValue.longValue());
    }

	public void update(Member member) {
        jdbcTemplate.update(
                "update MEMBER set NAME = ?, PASSWORD = ? where EMAIL = ?",
                member.getName(), member.getPassword(), member.getEmail());
    }

    public List<Member> selectAll() {
        List<Member> results = jdbcTemplate.query("select * from MEMBER",
                (ResultSet rs, int rowNum) -> { // 람다식을 이용한 더욱 짧은 구현, 앞선 조회 쿼리에 사용한 RowMapper와 같은 내용이므로 재사용으로 생략도 가능하다. 
                    Member member = new Member(
                            rs.getString("EMAIL"),
                            rs.getString("PASSWORD"),
                            rs.getString("NAME"),
                            rs.getTimestamp("REGDATE").toLocalDateTime());
                    member.setId(rs.getLong("ID"));
                    return member;
                });
        return results;
    }

    public int count() {
        Integer count = jdbcTemplate.queryForObject( // queryforObject를 이용한 조회, 주로 결과 값이 하나일 경우에 사용
                "select count(*) from MEMBER", Integer.class);
        return count;
    }
}
~~~
DAO를 빈 객체로 등록하기
~~~java
@Configuration
@EnableTransactionManagement
public class AppCtx {
    @Bean
    public MemberDao memberDao() {
        return new MemberDao(dataSource());
    }
}
~~~
```

```ad-seealso
title: `DAO` vs`@Repository`
만약, 스프링 MVC를 이용한다면, `DAO` 대신 `@Repository` 어노테이션을 이용할 수 있거나 섞어서 사용할 수 있다.

**DAO(Data Access Object)**
- 비즈니스 로직(service?)과 퍼시스턴스 로직(DB 접근 로직)을 명확히 분리하기 위한 객체
- 인터페이스로 먼저 추상화하고, `DAOImpl` 객체로 이를 구현하는 방식이 있지만 위 예시처럼 간단하다면 곧바로 구현해도 된다.
- DB 테이블, 쿼리와 밀접히 연관 됨

**Repository 패턴**
- 만약, 도메인이 복잡해진다면, 여러 `DAO`나 다른 API 등의 기능을 사용해야 한다.
- 이때 `Repository` 객체를 상위로 추가해 서로 다른 여러 `DAO`나 다른 API로 DB와 간접 통신한다.
- 즉 `DAO`를 사용하는 상위 계층 객체이다.
- DB보다는 비즈니스 로직에 더욱 가까운 일을 한다.
- 마찬가지로 Repository 인터페이스로 먼저 추상화하고 `RepositoryImpl`로 구현해도 된다.

즉, 복잡한 도메인 구조라면 `Repository` 패턴을 쓰면 좋다.

`@Repository`를 이용하면 `@Autowwired` 같은 어노테이션을 이용해 자동으로 `jdbc`나 `datasource` 빈 객체를 할당받을 수 있다.


```
### JdbcTemplate 조회 쿼리 생성 실행
#### RowMapper 인터페이스
쿼리 실행 결과를 자바 객체로 변환할 때 사용하는 인터페이스로, 이용 시 `mapRow()` 메서드를 직접 구현해야 한다.
```ad-example
title: `RowMapper` 인터페이스
~~~java
package org.springframework.jdbc.core.RowMapper;

public interface RowMapper<T> {
	T mapRow(ResultSet rs, int rowNum) throws SQLException;
}
~~~
```

SQL 실행 결과 `ResultSet`에서 한 행 씩, 데이터를 읽어와 자바 객체로 변환한다. (즉, 나오는 결과가 배열 형태여야 한다.)

```ad-example
title: `select` sql을 위한 `RowMapper 구현 예시`
~~~java
List<Member> results = jdbcTemplate.query( // query 메서드를 통한 조회 
	"select * from MEMBER where EMAIL = ?", 
	new RowMapper<Member>() { //임의 클래스를 이용한 즉석 오버라이딩
		@Override 
		public Member mapRow(ResultSet rs, int rowNum) throws SQLException {
			Member member = new Member( 
				rs.getString("EMAIL"), 
				rs.getString("PASSWORD"),
				rs.getString("NAME"), 
				rs.getTimestamp("REGDATE").toLocalDateTime());
			member.setId(rs.getLong("ID"));
			return member;
		}
	}, email);
~~~

굳이 `RowMapper`인터페이스의 `mapRow` 메서드를 직접 구현하지 않고 함수 시그니처가 일치하게 람다식으로 더욱 짧게 구현할 수도 있다.
~~~java
List<Member> results = jdbcTemplate.query(
	"select * from MEMBER where EMAIL = ?", 
	(ResultSet rs, int rowNum) -> {
		Member member = new Member( 
			rs.getString("EMAIL"), 
			rs.getString("PASSWORD"),
			rs.getString("NAME"), 
			rs.getTimestamp("REGDATE").toLocalDateTime());
		member.setId(rs.getLong("ID"));
		return member;
	}, email);
~~~
```

```ad-example
title: `RowMapper` 함수
만약 같은 `mapRow` 로직을 가진다면, 구현한 `RowMapper`를 아래 같이 함수화한 뒤 재활용할 수도 있다.
~~~java
private Member mapRowToMember(ResultSet rs, int rowNum) {
	Member member = new Member( 
		rs.getString("EMAIL"), 
		rs.getString("PASSWORD"),
		rs.getString("NAME"), 
		rs.getTimestamp("REGDATE").toLocalDateTime());
	member.setId(rs.getLong("ID"));
	return member;
}
~~~
```

#### query() 메서드
`query()` 메서드는 sql 파라미터로 전달받은 쿼리를 실행하고 앞서 배운 `RowMapper`를 이용해 `ResultSet`의 결과를 자바 객체로 변환한다.

```ad-note
title: `query` 메서드의 시그니처
- `List<T> query(String sql, RowMapper<T> rowMapper)`
- `List<T> query(String sql, Object[] args, RowMapper<T> rowMapper)`
- `List<T> query(String sql, RowMapper<T> rowMapper, Object... args)`
- `List<T> query(PreparedStatementCreator psc, RowMapper<T> rowMapper)` : `PreparedStatementCreator`는 아래 참조
```

뒤의 인자 `args`의 갯수는 `String sql`의 인덱스 파라미터(`?`)의 갯수에 달려있으며,  순서대로 `args`의 값과 `sql` 내부의 `?` 위치에 포맷팅된다.

```ad-example
title: `query` 메서드와 인덱스 파라미터의 이용 예시
~~~java
String email = "asdf@asdf.com";
String name = "asdf";
List<Member> results = jdbcTemplate.query(
	"select * from MEMBER where EMAIL = ? and NAME = ?",
	new MemberRowMapper(), // RowMapper 재활용
	email, name);
// s0ql 결과는 select * from MEMBER where EMAIL = "asdf@asdf.com" and NAME = "asdf"
~~~
```

만약 결과가 없다면 길이가 0인 List를 리턴하며, 결과가 오직 하나라면 길이가 1인 List를 리턴한다.

따라서 만약, 단 하나의 결과만 기대하는 쿼리의 경우,
`return results.isEmpty() ? null : results.get(0);` 처럼 리스트 길이가 0이면 결과 없음, 또는 첫번째 항목을 가져와야 하거나, 다음에 소개될 `queryForObject()` 메서드를 이용하면 된다.

#### queryForObject() 메서드

```ad-example
title: `queryForObject()` 메서드 예시
`query()` 메서드와 같이 인덱스 파라미터를 활용할 수 있다.
~~~java
double avg = queryForObject(
	"select avg(height) from FURNITURE where TYPE=? and STATUS=?",
	Double.class, // Row mapper 대신 결과값의 타입만 지정해주면 OK
	100, "S");
~~~
```

만약 원하는 쿼리의 결과가 하나뿐일 경우 -> 결과 값의 타입을 원하는 방식으로 받을 수 있고, 간단하게 구현 가능한 `queryForObject()` 메서드를 추천

만약, 쿼리 결과가 2개 이상이거나 0개이면 오류를 일으킨다.

```ad-example
title: `queroyForObject()`의 메서드
- `T queryForObject(String sql, Class<T> requiredType)`
- `T queryForObject(String sql, Class<T> requiredType, Object... args)`
- `T queryForObject(String sql, RowMapper<T> rowMapper)`
- `T queryForObject(String sql, RowMapper<T> rowMapper, Object... args)`

`query()` 메서드처럼 `rowMapper`를 그대로 사용할 수 있으며, 이때는 리스트가 아닌 rowMapper의 리턴 타입으로 되돌려 준다.

```

### JdbcTemplate 변경 쿼리 생성 실행

SQL의 `INSERT, UPDATE, DELETE` 쿼리 등은 `update()` 메서드를 이용하여 구현한다.

```ad-example
title: `update()` 메서드 사용
- `int update(String sql)`
- `int update(String sql, Object... args)`
- `int update(PreparedStatementCreator psc)`

역시나 인덱스 파라미터(`?`)를 지원한다.

- `int update(PreparedStatementCreator psc, KeyHolder generatedKeyHolder)`

추가로 아래에 소개될 `PreparedStatement`와 `KeyHolder`를 이용할 수 있다.
```

```ad-example
title: `update()` 메서드 예시
~~~java
jdbcTemplate.update(
	"udpate MEMBER set NAME = ?, PASSWORD = ? where EMAIL = ?",
	member.getName(), member.getPassword(), member.getEmail());
~~~
```

#### PreparedStatement 인터페이스 이용

애매모호한 `?` 인덱스 파라미터 대신, `PreparedStatement`를 이용할 수도 있다.

마찬가지로 `PrepareStatementCreator` 인터페이스의 `createPreparedSatement`를 오버라이딩하여 구현하며, 다음이 예시이다.
```ad-example
title: 임의 클래스를 이용한 `PreparedStatement` 이용 예시

~~~java
import java.sql.PreparedStatement;

jdbcTemplate.update(new PreparedStatementCreator() {
	@Override
	public PreparedStatement createPreparedStatement(Connection con) throws SQLException {
		// 파라미터로 전달받은 Connection을 이용해서 PreparedStatement 생성
		PreparedStatement pstmt = con.prepareStatement(
			"insert into MEMBER (EMAIL, PASSWORD, NAME, REGDATE) values (?, ?, ?, ?)");
		// 인덱스 파라미터의 값 설정
		pstmt.setString(1, member.getEmail());
		pstmt.setString(2, member.getPassword());
		pstmt.setString(3, member.getName());
		pstmt.setTimestamp(4, Timestamp.valueOf(member.getRegisterDateTime()));
		// 생성한 PreparedStatement 객체 리턴
		return pstmt;
	}
});
~~~
```

이 방식은 앞서 배웠던 `query()` 메서드에서도 사용 가능하다.

#### KeyHolder를 이용한 자동 생성 키값 구하기

많은 테이블에서 행 추가 시, 주요 키인 ID를 자동으로 증가시키는 방식으로 이용하므로, 코드 상에서 새로 생성된 행에 대한 ID를 알 수 없다.
- `update()` 메서드의 결과 값은 변경된 행의 갯수만 리턴한다.

따라서 쿼리 후 생성된 값에 대한 키 값을 구하는 방법으로 `keyHolder`를 이용할 수 있다.

```ad-example
title: `Keyholder` 구현 예시
~~~java
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;

public void insert(Member member) {
	KeyHolder keyHolder = new GeneratedKeyHolder(); //자동 생성된 키 값 구해주는 KeyHolder 구현 클래스
    jdbcTemplate.update(new PreparedStatementCreator() {
        @Override
        public PreparedStatement createPreparedStatement(Connection con) throws SQLException {
            PreparedStatement pstmt = con.prepareStatement(
                    "insert into MEMBER (EMAIL, PASSWORD, NAME, REGDATE) " +
                    "values (?, ?, ?, ?)",
                    new String[] { "ID" }); // preparedStatement의 두번째 인자로 구할 키 값의 이름 명시 
                    
            pstmt.setString(1, member.getEmail());
            pstmt.setString(2, member.getPassword());
            pstmt.setString(3, member.getName());
            pstmt.setTimestamp(4,
                    Timestamp.valueOf(member.getRegisterDateTime()));

			// 생성한 PreparedStatement 객체 리턴
            return pstmt;
        }
    }, keyHolder);

	Number keyValue = keyHolder.getKey(); // 구한 키값을 알려주는 메서드
    member.setId(keyValue.longValue()); // 적절한 타입으로 캐스팅
}
~~~
```
### `SimpleJdbcInsert` 객체를 이용한 더 쉬운 삽입
`JdbcTemplate` 객체의 `wrapper` 객체인 `SimpleJdbcInsert` 객체를 이용하면 더 간단함
```ad-example
title: `SimpleJdbcInsert` 사용례
`jdbcTemplate` 객체를 그대로 사용하지 않고 `SimpleJdbcInsert` 객체로 감싸 사용한다.
~~~java
package tacos.data;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.simple.SimpleJdbcInsert;
import org.springframework.stereotype.Repository;
import com.fasterxml.jackson.databind.ObjectMapper;

import tacos.Taco;
import tacos.Order;

@Repository
public class JdbcOrderRepository implements OrderRepository {
    private SimpleJdbcInsert orderInserter;
    private SimpleJdbcInsert orderTacoInserter;
    private ObjectMapper objectMapper;

    @Autowired
    public JdbcOrderRepository(JdbcTemplate jdbc) {
        this.orderInserter = new SimpleJdbcInsert(jdbc)
                .withTableName("Taco_Order") // 대상 테이블 명
                .usingGeneratedKeyColumns("id"); // DB 자동생성 키 사용
                
        this.orderTacoInserter = new SimpleJdbcInsert(jdbc)
                .withTableName("Taco_Order_Tacos");
                
        this.objectMapper = new ObjectMapper();
        // 나중에 커맨드 객체를 Map 객체로 바꾸는데 사용
    }

    @Override
    public Order save(Order order) {
        order.setPlacedAt(new Date());
        long orderId = saveOrderDetails(order);
        order.setId(orderId);
        List<Taco> tacos = order.getTacos();
        for (Taco taco : tacos) {
            saveTacoToOrder(taco, orderId);
        }
        return order;
    }

    private long saveOrderDetails(Order order) {
        @SuppressWarnings("unchecked")
        Map<String, Object> values = 
        objectMapper.convertValue(order, Map.class); // Map 객체로 바꾸기 
        values.put("placedAt", order.getPlacedAt());
        long orderId =
                orderInserter
                .executeAndReturnKey(values) // 실행 뒤 id 돌려받기
                .longValue(); // long으로 변형
        return orderId;
    }

    private void saveTacoToOrder(Taco taco, long orderId) {
        Map<String, Object> values = new HashMap<>(); // execute는 Map<String, Object> 타입을 인자로 받는다.
        values.put("tacoOrder", orderId); 
        values.put("taco", taco.getId()); // column 설정
        orderTacoInserter.execute(values); // 삽입 실행
    }
}
~~~
```
단순히 메서드를 이용하면 되므로 더욱 빠르다.
## 스프링 익셉션 변환 처리

DB를 다루는 것은 민감하고 중요하며 복잡한 사안이므로 상당히 많은 오류를 보게될 것이다.
- 인증/인가 관련 오류 (ex) `CannotGetJdbcConnectionException`) 
- SQL 구문 에러 (ex) `BadSqlGrammarException`)
- db 설정 관련 에러 (ex) `CannotGetJdbcConnectionException`)
이를 차분히 읽고 문제 발생 원인을 찾을 수 있다.

스프링은 다음과 같이 익셉션을 처리한다.
1. **`JDBC, Hibernate, JPA` 등 여러 연동 기술들의 각기 다른 익셉션 발생**
2. ->  **스프링은 각각의 익셉션을 동일한 `DataAccessException`으로 변환**
	- 이를 통해 연동 기술에 관계없이 동일하게 익셉션 처리 가능
3. -> **`DataAccessException`를 상속받은 구체적인 하위 타입으로 변환 (ex) `DuplicateKeyExcetion`, `QueryTimeoutException`)**
	- 이를 통해 이름만으로 문제 원인 유추 가능

`DataAccessException`은 `RuntimeException`을 상속받고 있으므로, 스프링에서 자동으로 오류 처리를 해준다.

따라서 기존의 JDBC에서는 반드시 `try~catch`를 이용한 익셉션 처리를 포함해야 구현 가능하지만, 스프링에서는 필요한 경우에만 익셉션 처리를 구현해줄 수 있다.

## 트랜잭션 처리 : @Transactional

JDBC에서는 트랜잭션을 하나의 작업단위로 커밋하거나 롤백하려면 아래와 같이 직접 commit과 rollback 하여 진행했다.
- 코드 누락, 반복, 관리 힘듬 등의 문제가 있음
```ad-example
title: 기존의 JDBC 트랜잭션 구현
~~~java
Connection conn = null;
try {
	conn = DriverManager.getConnection(jdbcUrl, user, pw);
	conn.setAutoCommit(false); // 트랜잭션 범위 시작
	//... 기타 쿼리
	conn.commit(); // 트랜잭션 범위 종료 및 커밋
} catch(SQLException ex) {
	if (conn != null)
		// 트랜잭션 범위 종료 : 롤백
		try { conn.rollabck(); } catch (SQLException e) {}
} finally {
	if (conn != null)
		try { conn.close(); } catch (SQLException e) {}
}
~~~
```

스프링의 `@Transactional` 어노테이션을 이용하면 손쉽게 위와 같은 코드를 아래처럼 줄일 수 있다.

```ad-example
title: 스프링의 `@Transactional`을 이용한 트랜잭션 처리
~~~java
import org.springframework.transaction.annotation.Transactional;

@Transactional
public void changePassword(String email, String oldPwd, String newPwd) {
	Member member = memberDao.selectByEmail(eamil);
	if (member == null)
		throw new MemberNotFoundException();
	member.changePassword(oldPwd, newPwd);
	memberDao.update(member);
}
~~~
```

`@Transactional` 어노테이션이 붙은 메서드는 동일한 트랜잭션 범위 내에 실행되며, 실패시 전부 롤백 된다.
`@Transactional` 메서드 내부의 다른 일반 메서드 과정 내의 오류에도 롤백되며, 일반 메서드 내의 DB 변화도 롤백된다.

### @Transactional와 스프링 설정법

`@Transactional` 기능을 사용하라면 다음과 같이 두 개의 설정이 필요하다.
1. **구성 클래스에 플랫폼 트랜잭션 매니저(PlatformTransactionManager) 빈 설정**
2. **`@Transactional` 어노테이션 활성화 설정**

**플랫폼 트랜잭션 매니저(PlatformTransactionManager) 빈 설정**
스프링 구성 클래스에 다음과 같은 내용을 추가해야 한다.

```ad-example
title: 스프링 구성 클래스 예시(AppCtx)
- `@EnableTransactionManagement`: `@Transactional` 어노테이션이 붙은 메서드를 트랜잭션 범위에서 실행, 빈이 직접 트랜잭션 적용
	- 프록시 기반이므로 AOP에서 배웠던 `order, proxyTargetClass` 속성을 설정 가능하다.
- `PlatformTransactionManager`: 구현 기술에 관계없이 동일한 방식으로 트랜잭션 처리를 위한 인터페이스, 이용할 `datasource`를 지정해야 함.

~~~java
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@Configuration
@EnableTransactionManagement // 플랫폼 트랜잭션 매니저 사용함을 의미
public class AppCtx {

    @Bean
    public PlatformTransactionManager transactionManager() { // 트랜잭션매니저 등록
        DataSourceTransactionManager tm = new DataSourceTransactionManager();
        tm.setDataSource(dataSource());
        return tm;
    }
    
    @Bean 
    public ChangePasswordService changePwdSvc() { // @Transactional이 적용된 트랜잭션 메서드가 존재하는 서비스 객체 등록
        ChangePasswordService pwdSvc = new ChangePasswordService();
        pwdSvc.setMemberDao(memberDao());
        return pwdSvc;
    }
}
~~~
```

**`@Transactional` 어노테이션 활성화 설정**

```ad-example
title: `ChangePasswordService` 객체 예시

~~~java
package spring;
import org.springframework.transaction.annotation.Transactional;

public class ChangePasswordService {
    private MemberDao memberDao;
    
    @Transactional // 이제 changePassword 메서드는 트랜잭션 범위 내에서 실행됨
    public void changePassword(String email, String oldPwd, String newPwd) {
        Member member = memberDao.selectByEmail(email);
        if (member == null)
            throw new MemberNotFoundException();
        member.changePassword(oldPwd, newPwd);
        memberDao.update(member);
    }

    public void setMemberDao(MemberDao memberDao) {
        this.memberDao = memberDao;
    }
}
~~~
```
이제 원할 때, 위의 서비스를 불러와 트랜잭션을 사용할 수 있다.

### 프록시를 이용한 커밋, 롤백 처리
스프링의 `@Transactional` 어노테이션은 앞서 배웠던 [[Spring5 입문-AOP|AOP]]를 이용해 트랜잭션을 처리한다. 즉 프록시를 이용한다.
1. 스프링이 구성 클래스에서 `@EnableTransactionManagement` 태그를 감지
2. `@Transactional` 어노테이션이 적용된 빈 객체를 찾음
3. 적절한 프록시 객체 생성 뒤 메서드 이용 시 아래와 같이 프록시를 통해 트랜잭션 적용
```ad-example
title: 프록시 트랜잭션 예시

- 트랜잭션 성공 시 프록시 커밋 동작
![[Drawing 2023-01-16 13.37.11.excalidraw.svg]]

- 트랜잭션 실패 시 프록시 롤백 동작
![[Drawing 2023-01-16 13.37.121.excalidraw.svg]]

```
롤백은 `RuntimeException`이 일어날때만 생성되므로 `SQLException` 같이 다른 타입의 에러를 처리하려면 다음과 같이 설정하면 된다.
```ad-example
title: `@Transactional`의 에러 처리 추가 예시

- 반대로 `noRollbackFor` 속성을 지정해주면 해당하는 익셉션에 롤백하지 않는다.

~~~java
@Transactional(rollbackFor = {SQLException.class, IOException.class})
public void someMethod(){
	//...
}
~~~
```

### @Transactional의 주요 속성과 전파

- **value**: 트랜잭션 관리할 `PlatformTransactionManager` 빈의 이름 지정, 없으면 해당 타입의 빈을 자동으로 찾음
- **isolation**: 트랜잭션 격리 레벨, **READ_UNCOMMITTED, READ_COMMITTED, REPEATABLE_READ, SERIALIZABLE** 등이 존재, 기본값은 `Isolation.DEFAULT`
- **timeout**: 트랜잭션 제한 시간 지정, 초단위이며 기본값 -1인 경우 DB의 설정을 따름
- **propagation**: 트랜잭션 전파 타입 지정, 기본값은 `Propagation.REQUIRED`
	- 기본 값이면 메서드 수행 시 이미 진행중인 트랜잭션이 존재하면 해당 트랜잭션에 병합
```ad-seealso
title: 트랜잭션 전파란?

`@Transactional`이 적용된 메서드 내부에 또 다른 `@Transactional` 메서드가 존재하면, 트랜잭션 전파(transaction propagation) 속성에 따라 다른 동작을 한다.

예를 들어 `Propagation.MANDATORY`는 이미 진행중인 트랜잭션이 있다면 에러를 일으키며, `Propagation.REQUIRES_NEW`은 항상 새로운 트래잭션으로 덮어씌운다.
- 이외에도 `SUPPORTS`, `NOT_SUPPORTED`, `NEVER`, `NESTED` 등이 존재
```

## 로깅 처리

트랜잭션 처리, 오류, 관련 로그 메시지를 보기 위해서 일일이 프린트하기 보단 `Log4j2`나 `Logback` 등의 외부 패키지를 이용할 수 있다.
- 엄밀히 말하면 스프링 자체 로깅 모듈인 `spring-jcl`이 위의 로깅 모듈을 인식하여 사용한다.

메이븐이나 그래들을 이용해 Logback을 의존 모듈로 추가하고, 클래스 패스에 설정파일을 위치시키기 위해 `src/main/resources` 폴더를 만들어 설정 `xml`을 추가하고, 메이븐, 그래들로 프로젝트를 업데이트하면 된다. 

```ad-example
title: Logback 설정 xml 예시 (main/resources/logback.xml)
~~~xml
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
    <appender name="stdout" class="ch.qos.logback.core.ConsoleAppender">
        <encoder>
            <pattern>%d %5p %c{2} - %m%n</pattern>
        </encoder>
    </appender>
    <root level="INFO">
        <appender-ref ref="stdout" />
    </root>
    <logger name="org.springframework.jdbc" level="DEBUG" /> <!--로그 메시지 상세 보기 설정-->
</configuration>
~~~
```

이후 터미널에서 다음 예시 같은 핵심 로그를 확인할 수 있다.

```ad-example
title: Logback 로그 예시
~~~bash
날짜 시간 DEBUG o.s.j.d DataSourceTransactionManager - Initiating transaction commit
날짜 시간 DEBUG o.s.j.d DataSourceTransactionManager - Committing JDBC transaction on Connection[ProxyConnection...]
날짜 시간 DEBUG o.s.j.d DataSourceTransactionManager - Initiating transaction rollback
날짜 시간 DEBUG o.s.j.d DataSourceTransactionManager - Rolling back JDBC transaction on Connection[ProxyConnection...]
~~~
```
