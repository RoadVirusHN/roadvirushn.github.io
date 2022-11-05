---
title: Database SQL 기초
date: 2020-02-13 17:21:08 +0900
tags: DB SQL
layout: obsidian
is_Finished: false
last_Reviewed: 2022-10-30 17:21:08 +0900
use_Mathjax: false
---
```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# Database SQL 기초

## DB
- 체계화된 데이터들의 모임
- 열, 칼럼, 각 열에는 고유한 데이터 형식이 지정됨, 데이터의 속성
- 행, 레코드, 1개의 데이터
- 스키마, 틀 각 열의 요소, 즉  들어갈 데이터의 내용을 정의함
### 구성요소
1. 개체, entity( 사원들)
2. 그들이 가지는 속성, attribute (사원번호, 성명, 부서 , 직책)
3. 개체 사이의 관계 (relation)
## ORM(Object-Relational Mapping)
- SQL이 몰라도 파이썬 문법으로 하는 데이터베이스 언어, 파이썬 언어(초안, 청사진)을 SQL 문으로 해석해줌, 중간 번역자
### CRUD
- C: CREATE
- R: READ
- U: UPDATE
- D: DELETE
- 데이터로 할 수 있는 4가지
## RDBMS(관계형 데이터베이스 관리 시스템)
- 개체와 개체 사이의 관계를 표현하기 위해 2차원의 표를 사용
- 차수 : 어트리뷰트의 수, 카디널러티 : 개체수 ??
### SQLite
- 서버가 아닌 응용 프로그램에 넣어 사용하는 비교적 가벼운 데이터베이스(안드로이드, 임베디드 , django 등), 오픈소스이며 로컬에 간단한 DB 구성 가능, 
## 기본 용어 정의
1. 스키마(scheme) : 데이터 베이스에서 자료의 구조, 표현 방법, 관계 등을 정의한 구조, 명세서, 데이터 규격, 데이터 타입 정의, 데이터 베이스의 구조와 제약 조건에 관련한 전반적인 명세를 기술.
2. 테이블: 스키마로 구현하는 데이터를 저장하는 공간, 엑셀 표 같은거, 데이터들의 집합
3. 열(칼럼, 어트리뷰트, 속성, Column): 고유한 데이터 형식의 지정
4. 행(레코드, 데이터, row): 
5. PK(기본 키, Primary Key) : 각 행(레코드)의 고유한 값, 반드시 설정됨, 관리 및 관계 설정시 활용 
## SQL 개념
- SQL(Structured Query Language)는 RDBMS의 데이터를 관리하기 위해 설계된 특수 목적 프로그래밍 언어이다, 자료의 검색, 관리, 스키마 생성과 수정, 객체 접근 조정 관리를 위해 고안
### 문법 종류
1. DDL(Data Definition Language) - 데이터 정의 언어.구조, 즉 테이블과 스키마를 정의
	- CREATE, DROP, ALTER 등
2. DML(Data Manipulation Language) - 데이터 조작 언어. 데이터를 저장, 수정, 삭제, 조회
	- INSERT(데이터삽입), UPDATE(갱신), DELETE(삭제, 행제거), SELECT(데이터, 검색)
3. DCL(Data Control Language) - 데이터 제어 언어, 사용자 권한 제어를 위해 사용
	- GRANT, REVOKE, COMMIT, ROLLBACK
## 실습
### 기본 sql 동작
1. sqlite3.exe가 있는 폴더에서 터미널로 sqlite3 치면
```sql
SQLite version 3.29.0 2019-07-10 17:32:03
Enter ".help" for usage hints.
Connected to a transient in-memory database.
Use ".open FILENAME" to reopen on a persistent database.
sqlite>
```
라고 나온다. (.exit로 나갈 수 있다) 맨 앞에 '.'이 주요한 명령어이다.
2. sqlite3 파일 생성법 
	1) sqlite3 test.sqlite3 입력
	2) .databases 입력
```sql
sqlite3 test.sqlite3
SQLite version 3.29.0 2019-07-10 17:32:03
Enter ".help" for usage hints.
sqlite> .databases
main: C:\Users\student\sqlite\test.sqlite3
sqlite>
```
- test는 원하는 데이터 베이스 명
3. csv 파일 가져와서 데이터베이스로 만들기
```sql
sqlite> .mode csv
sqlite> .import hellodb.csv examples
```
- hellodb는 csv 파일 이름
- .mode csv는 어떤 파일을 대상으로 할것인가?
- 뒤 .import 는 그 파일을 데이터 베이스로 만들고, 테이블 이름을 examples로 만듦
- 
4. 데이터 베이스 눈으로 보이게 만들기
```sql
SELECT * FROM examples;
1,"길동","홍",600,"충청도",010-2424-1232
```
-  * 은 전부 다라는 표현에 가까움, examples라는 테이블에 데이터 전부(\*) 반환해 라는 뜻
-  여기서 SELECT, FROM 등은 키워드이며, 키워드는 대문자가 관례(소문자로 되긴함)
5. 더 예쁘게 가져오기
```sql
sqlite> .headers on
sqlite> .mode column
sqlite> SELECT * FROM examples;
id          first_name  last_name   age         country     phone
----------  ----------  ----------  ----------  ----------  -------------
1           길동          홍           600         충청도         010-2424-1232
```
- .headers로 헤더를 적는 모드로, .mode column으로 각 컬럼마다 구별하는 모드로 바꾼 듯?
6. 파일로 명령어 적어서 실행하기
	1) 00_intro.sql 파일 만들기
	
	> 00_intro.sql 파일 내용
```sql
-- sql 주석처리는 --로 한줄
-- 데이터베이스 생성
.database


-- csv파일을 읽어오기 sqlite의 기능임 sql 문법 아님, ; 필요 없음
.mode csv
.import hellodb.csv examples -- 외부 파일에서 스키마 가져오기 (전부 TEXT로 가져옴)

-- 예쁘게 보기
.headers on
.mode column

-- 테이블 조회 sql 문법 끝에는 꼭 ;를 붙임
SELECT * FROM examples;
```
- CAST(값 AS INTEGER) = INTEGER로 형변환으로 적적히 형변환 가능

2) 터미널에서 .read 00_intro.sql 명령어로 실행( 같은 디렉토리일시)

```sql
sqlite> .read 00_intro.sql
main: C:\Users\student\sqlite\test.sqlite3
id,first_name,last_name,age,country,phone
1,"길동","홍",600,"충청도",010-2424-1232
id,first_name,last_name,age,country,phone
1,"길동","홍",600,"충청도",010-2424-1232
```
### CRUD 동작
#### 데이터 생성 CREATE, Table 생성
	1) 01_DDL.sql 파일 생성
> 01_DDL.sql 파일 내용
```sql
-- DDL(데이터 정의 언어)
CREATE TABLE classmates (
    id INTEGER PRIMARY KEY,
    name TEXT
);
-- 파이썬과 달리 마지막 요소에 ',' 남기면 오류가 남
-- 만들어진 테이블 목록 조회
.tables

-- 스키마 조회, 주석도 같이 나온다.
.schema classmates

-- 테이블 삭제
DROP TABLE classmates;
.tables
```
1) 터미널에 .read 01_DDL.sql

> 터미널 입력
```sql
sqlite> .read 01_DDL.sql
classmates
CREATE TABLE classmates (
    id INTEGER PRIMARY KEY, -- INTEGER는 INT로 줄여써도 됨, 단 PRIMARY KEY는 INTEGER로 써야함, 아닐시는 INT로 써도 됨
    name TEXT 
);
```
#### 데이터 추가 (INSERT)
	1. data 추가 (INSERT)	: 특정 table에 새로운 행을 추가해 데이터 추가
		- INSERT INTO talbe(column1, column2,...)
		- VALUES (value1, value2, ...)
	2. 02_CRUD.sql 파일 생성
	
	> 02_CRUD.sql 파일 내용
```sql
	-- 데이터 테이블 만들기
CREATE TABLE classmates (
    name TEXT,
    age INT,
    address TEXT
);

-- CREATE -- ;이 등장하지 않으면 1줄로 인식함
INSERT INTO classmates (
name,
age,
address
)
VALUES ('윤준석', 27, '광주');

.headers on
.mode column

-- 확인
SELECT * FROM classmates;
```
3. 터미널에 .read 02_CRUD.sql 실행

> 터미널 내용, classmate 1개 추가
```sql
sqlite> .read 02_CRUD.sql
id          name        age         address
----------  ----------  ----------  ----------
1           윤준석         27          광주
```
4. 한번 더 실행

> 터미널 내용, 같은 내용이 들어있는 classmate 1개 더 추가
```sql
sqlite> .read 02_CRUD.sql
id          name        age         address
----------  ----------  ----------  ----------
1           윤준석         27          광주
2           윤준석         11          광주
```
5. 파일에서 요소 하나를 빼서 .read 02_CRUD.sql 실행
> 변경된 02_CRUD.sql 파일 내용
```sql
-- 데이터 테이블 만들기
CREATE TABLE classmates (
    name TEXT,
    age INT,
    address TEXT
);
-- CREATE -- ;이 등장하지 않으면 1줄로 인식함
INSERT INTO classmates (
name,
address
)
VALUES ('윤준석', '광주');

.headers on
.mode column

-- 확인
SELECT * FROM classmates;
```

> age 칸이 비어있는 classmate 1개 더 추가
```sql
sqlite> .read 02_CRUD.sql
id          name        age         address
----------  ----------  ----------  ----------
1           윤준석         27          광주
2           윤준석         11          광주
3           윤준석                     광주
```

6.  파일을 또 변경한 예시

> 변경된 02_CRUD.sql 파일 내용

```sql
CREATE TABLE classmates (
    name TEXT,
    age INT,
    address TEXT
);
INSERT INTO classmates -- 모든 열에 데이터를 넣을때는 생략 가능
VALUES('홍길동', 30, '서울');

SELECT rowid, * FROM classmates; -- 자동으로 생성된 rowid를 같이 출력 

DROP TABLE classmates; -- 테이블 삭제
```
> 터미널 결과
```sql
sqlite> .read 02_CRUD.sql
rowid       name        age         address
----------  ----------  ----------  ----------
1           홍길동         30          서울
```
7. 데이터 베이스 무결성의 원칙을 위한 NOT NULL 추가
> 변경된 02_CRUD.sql 파일 내용
```sql
DROP TABLE classmates;
.tables
CREATE TABLE classmates (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL, -- NOT NULL을 넣으면 비운채로 넣을 수 없다.
    age INT NOT NULL,
    address TEXT NOT NULL
);
INSERT INTO classmates 
VALUES
(1, '윤준석', 27, '광주'),
(2, '오창희', 11, '광주'),
(3, '박나래', 25, '서울'),
(4, '이요셉', 29, '구미'),
(5, '김철수', 27, '대전'); 

-- 위와 같은 형식으로 여러 값을 한꺼번에 넣을 수도 있다.
SELECT * FROM classmates;
```
> 만약 NOT NULL인 값을 빈 채로 쓰면 이런 에러가 뜬다.
```sql
Error: near line 9: NOT NULL constraint failed: classmates.address
```
- 이를 통해 데이터가 공백이 되는걸 방지한다.
> 만약 id 값이 겹치면 이런 에러가 뜬다.
```sql
Error: near line 11: UNIQUE constraint failed: classmates.id
```
- 이를 방지하고 효율적으로 하기 위해 직접 넣지 말고 sql이 자동으로 생성되는 값을 쓰자

- 만약 id를 직접 집어 넣어줘야 한다면 NOT NULL 대신 AUTOINCREMENT 를 넣어서 자동으로 증가하게 해주자.(이러면 지워진 id를 새로운 열에 사용하지 않는다, SQLite에서는 비추천함(메모리 사용증가))

- AUTOINCREMENT를 쓰면 그 부분은 제외 열을 나열해줘야함
> AUTOINCREMENT 예시
```sql
CREATE TABLE bands(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    debut INTEGER
);
INSERT INTO bands (name, debut) VALUES
('Queen', 1973),
('Coldplay', 1998),
('MCR', 2001);
```

> CREATE TABLE classmates의 예시
```sql
id INT PRIMARY KEY AUTOINCREMENT, 
-- 또는 아예 id 안써서 자동생성되게끔
```
#### 원하는 데이터만 제한해서 가져오기(READ)

> select 명령문
```sql
SELECT rowid, name FROM classmates; -- 전체 데이터중 일부만 가져오는법
-- 터미널 결과
examples
rowid       name
----------  ----------
1           윤준석
2           오창희
3           박나래
4           이요셉
5           김철수
```
>특정한 테이블에서 원하는 갯수만큼만 가져오기(LIMIT 명령어)
```sql
SELECT rowid, name FROM classmates LIMIT 1; -- 전체 데이터중 1개만 가져오는법
-- 터미널 결과
sqlite> .read 02_CRUD.sql
examples
rowid       name
----------  ----------
1           윤준석
```
> 데이터 몇개를 스킵하고 가져오기(OFFSET 명령어)
```sql
SELECT rowid, name FROM classmates LIMIT 1 OFFSET 2; -- 전체 데이터중 처음 2개를 스킵하고 1개만 가져오는법
-- 터미널 결과
sqlite> .read 02_CRUD.sql
examples
rowid       name
----------  ----------
3           박나래
```
- LIMIT와 함께 쓰는 경우가 많다
> 특정한 값 만 검색해서 가져오기(WHERE 명령어)
```sql
SELECT rowid, name FROM classmates WHERE address='구미'; -- 전체 데이터중 주소가 '구미'인 사람만 가져오기
-- 터미널 결과
sqlite> .read 02_CRUD.sql
examples
rowid       name
----------  ----------
4           이요셉
```
- 검색 등에 활용
> 특정 table 중복 제거결과 출력
```sql
-- 전체 나이 데이터를 가져오되, 중복은 없앰
SELECT DISTINCT age FROM classmates;
-- 터미널 결과, 마지막 27살이 없어짐
name        age         address
----------  ----------  ----------
윤준석         27          광주
오창희         11          광주
박나래         25          서울
이요셉         29          구미
김철수         27          대전
age
----------
27
11
25
29
```
#### 데이터 삭제(DELETE)
```sql
DELETE FROM classmates WHERE address='광주'; -- 주소가 광주인 사람만 지우기
-- 터미널 결과
name        age         address
----------  ----------  ----------
박나래         25          서울
이요셉         29          구미
김철수         27          대전
```
- 중복이 불가능한(UNIQUE한) id를 기준으로 지우면 특정 열만 지울 수 있다.
- 지워진 id는 다음에 새로 추가한 열값에 할당된다 이를 막으려면 id값을 선언할 때AUTOINCREMENT를 써야함(SQLite에서는 비추천)

#### 데이터 수정(UPDATE)

> UPDATE와 SET, WHERE로 일부만 수정하기

```sql
UPDATE classmates SET name='홍길동', address='제주' 
WHERE age>=50 AND address="마포"; -- 나이가 50살 이상이고 고향이 마포인 사람 사람의 이름과 주소 바꾸기
-- 터미널 결과
rowid       name        age         address
----------  ----------  ----------  ----------
1           윤준석         27          광주
2           오창희         11          광주
3           박나래         25          서울
4           이요셉         29          구미
5           홍길동         54          제주 -- 박철용, 마포가 홍길동, 제주로 바뀜
```
- address=="마포" 여도 괜찮음, 괄호 처리도 괜찮음
> CONUT()를 이용하여 숫자세기
```sql
SELECT COUNT(*) FROM users WHERE age >= 30 AND last_name = '김';
-- 나이가 30이상이고 성이 김씨인 유저의 수는?
```
> AVG()를 이용한 평균내기(INT 형만 가능)
```sql
SELECT AVG(age) FROM users WHERE age >= 30 AND last_name = '김';
-- 나이가 30이상이고 성이 김씨인 유저들의 평균 나이는?
```
> MAX()를 이용한 최대값구하기
```sql
SELECT MAX(balance), first_name FROM users;
-- 가장 잔액이 많은 사람의 잔액과 이름은? 
```
- MIN()은 최소값을 구하는데 사용
> 와일드카드 패턴 (LIKE)
```sql
SELECT * FROM users WHERE age LIKE '2_';
-- users 중 20대인 사람 출력 2%로하면 2살, 200살도 나옴
```
- 해당 정보에서 포함이 되어있는가? 등을 찾음

- 구글 검색 등에서도 사용 가능하다 (?? : 특정한 문자 갯수 랜덤 문자, *: 갯수와 상관없이 아무 문자나)

  | 표시 | 예시      | 의미                                         |
  | ---- | --------- | -------------------------------------------- |
  | %    | 2%        | 2로 시작하는 값                              |
  |      | %2        | 2로 끝나는 값                                |
  |      | %2%       | 2가 들어가는 값                              |
  | -    | _2%       | 아무값이나 들어가고 두번째가 2로 시작하는 값 |
  |      | 1\_\_\_\_ | 1로 시작하고 4자리인 값                      |
  |      | 2\_%\_%   | 2로 시작하고 적어도 3자리인 값               |

#### 데이터 정렬(ORDER)

> ORDER
```sql
SELECT * FROM users ORDER BY age DESC, last_name ASC LIMIT 10;
-- 나이가 많은 상위 10명의 성순으로 10명 오름차순 정보
```
- ORDER BY column1, column2 [ASC|DESC], ASC = 올림차순 (기본값)  작은것 부터, DESC= 내림차순, 큰것부터 작은것
1. 테이블명 수정
> 04_DDL_a.sql 파일 내용
```sql
DROP TABLE articles;
DROP TABLE news;
CREATE TABLE articles(
    title TEXT NOT NULL,
    content TEXT NOT NULL
);

INSERT INTO articles VALUES('윤준석 굶어죽다', '백수 생활 길어 잔액 부족해... 충격');

SELECT * FROM articles;
ALTER TABLE articles RENAME TO news; -- 테이블 이름 바꾸기

-- created_at이라는 DATETIME 타입의 COLUMN을 새로 넣으려고 시도
ALTER TABLE news
-- ADD COLUMN created_at DATETIME NOT NULL; -- 비어있는 값의 새로운 column이 생기면 안되므로 에러 발생
ADD COLUMN created_at DATETIME NOT NULL DEFAULT 1; -- DEFAULT 값 정해주었으므로 에러 안남
.tables
```

- ADD COLUMN 대신 RENAME COLUMN  바꿀컬럼 TO 바뀔이름 으로 컬럼 이름 바꿀 수 있음 
- **ALTER** TABLE "table_name" **Change** "**column** 1" "**column** 2" ["Data Type"]; 한꺼번에 형변환

