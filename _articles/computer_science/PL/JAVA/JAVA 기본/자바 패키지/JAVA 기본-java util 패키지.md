---
title: JAVA 기본-java util 패키지
date: 2023-02-01 15:52:06 +0900
tags: HIDE CRUDE 
layout: obsidian
is_Finished: false
last_Reviewed: 2023-02-01 15:52:06 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# java.util 패키지

## java.util
### java.util 개요 및 Utility 클래스
#### java.util 패키지 개요
- 자바프로그램을 개발할 대 유용한 기능들을 모아놓은 패키지
- Date, Calendar : 날짜와 시간 표현 및 조작, Vector, HashMap : 배열, Formatter, -다양한 형태의 출력 포맷, Enumeration 인터페이스
- 반복적으로 작성해야하는 복잡한 코드를 간단하게 구현 가능 (java.util.Arrays : 정렬 하는데 사용)
> java.util.Arrays 클래스 예시
```Java
import java.util.Arrays; // import하여 java.util.Arrays 패키지를 가져옴

public class ArraysTest{
	public static void main(String[] args){
		int[] scoreList = {87, 56, 79, 98, 34, 55, 76};
		Arrays.sort(scoreList); // 알고리즘 사용하지 않고 데이터 정렬
		for (int i = 0; i < scoreList.length; i++){
			system.out.print(scoreList[i] + ", ");
		}
		System.out.println("");
		System.out.println("최저점 : " + scoreList[0]);
		System.out.println("최고점 : " + scoreList[6]);
	}
}
/* 실행 결과 : 
34, 55, 56, 76, 79, 87, 98,
최저점 : 34
최고점 : 98
*/
```
#### 날짜 관련 클래스
1) Date 클래스
- 형식이 있는 날짜와 시간을 출력하는 클래스임
- JDK의 버전이 향상되면서 Deprecate 메서듣들도 많아짐,

| Date(Long msec)      | 1970년 1월 1일 0시 0분 0초부터 msec를 1/1000초 단위로 하여 경과한 날짜와 시간을 저장한 객체를 생성함 |

> Date 클래스의 주요 메소드

| Date 클래스의 메소드            | 설명                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| boolean after(Date when)        | when의 날짜가 현재 날짜 이후면 true, 아니면 false를 반환함   |
| boolean before(Date when)       | when의 날짜가 현재 날짜 이전이면 true, 아니면 false를 반환함 |
| int compareTo(Date anotherDate) | 다른 날짜 객체와 비교하여 음수, 양수, 0의 결과를 반환함      |
| int compareTo(Object o)         | 다른 객체와 비교하여 음수, 양수, 0의 결과를 반환함           |
| boolean equals(Object obj)      | 날짜의 값을 비교하여 그 결과를 반환함                        |
| long getTime()                  | 1970년 1월 1일 0시 0분 0초로부터의 시간을 1/1000초 단위로 반환함(두개를 구하고 빼면 걸린시간을 구할 수 있음) |
| id setTime(long time)           | time의 시간을 1970년 1월 1일 0시 0분 0초로부터의 시간을 1/1000초 단위로 설정함 |
| String toLocaleString()         | 현재의 날짜와 시간을 해당 국가에 맞는 문자열로 변환하여 리턴함 |

> Date 객체를 이용한 프로그램의 실행 시간 체크 (DateTest.java)

```Java
import java.util.Date;

public class DateTest {
	public static void main(String[] args){
		Date currentDate = new Date(); // 현재 시스템이 설정된 날짜와 시간 정보를 객체로 생성함
		long start = currentDate.getTime();
// Date 객체로부터 1970년 1월 1일 0시 0분 0초로부터의 시간으로 환산되어 리턴됨
		System.out.println(currentDate.toString());// 출력
		System.out.println(currentDate.toLocaleString());//locale에 맞게 변환하여 출력		
		currentDate = new Date();
		long end = currentDate.getTime();
		System.out.println("프로그램 수행에 걸린 시간 : " + (end - start) + "(ms)초") // 현재 시스템에 설정된 날짜와 시간 정보를 객체로 생성함
	}
}
```
2) Calendar 클래스
- Date 클래스처럼 날짜와 시간에 관한 정보를 출력할 때 사용
- 추상클래스이므로 직접 객체를 만들수 없고 getInstance() 메서드를 이용해 객체 생성 가능
> 구문
```Java
Calendar cal2 = Calendar.getInstance(); //Calendar 클래스를 상속한 클래스의 객체 생성
```
- 캘린터 객체는 날짜와 시간표현을 위해 다양한 상수를 제공
- ex) int 데이터 타입 : static int AM, static int MONTH, static int HOUR_OF_DAY, 등
> Calendar 클래스의 메소드들

| Calendar 클래스의 메서드                                     | 설명                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| boolean after(Object when)                                   | when과 비교하여 현재 날짜 이후이면 true, 아니면 false를 반환함 |
| Date getTime()                                               | 현재의 객체를 Date 객체로 변환함                             |
| long getTimeInMillis()                                       | 객체를 시간을 1/1000초 단위로 변경하여 반환함                |
| void set(int year, int month, int date, int hour, int minute) | 현재 객체의 년, 월, 일, 시, 분, 값을 다른 값으로 설정        |
| 기타 등등 이 있다                                            |                                                              |

>  Calendar 클래스의 객체 생성 (CalendarTest.java)

```Java
import java.util.Calendar;

public class CalendarTest {
	public static void main(String[] args){
		Calendar cal = Calendar.getInstance(); // 현재 시스템의 날짜와 시간 정보를 객체로 생성함
		int year = cal.get(Calendar.YEAR);
		int mon = cal.get(Calendar.MONTH) + 1;
		int day = cal.get(Calendar.DAY_OF_MONTH);
		int hour = cal.get(Calendar.HOUR_OF_DAY);
		int min = cal.get(Calendar.MINUTE);
		int sec = cal.get(Calendar.SECOND);//날짜와 시간 포맷을 나타내는 상수 값들을 이용하여 시간과 날짜 정보를 분리
		System.out.println("현재 시간");
		System.out.println(year + "년 " + mon + "월 " + day + "일");
		System.out.println(hour + "시 " + min + "분 " + sec + "초");	
	}
}
```
#### Formatter 클래스
- C 언어의 printf()와 같은 기능의 Formatter 클래스를 제공함
- Formatter 클래스는 형식 문자열을 제공하고, 이 문자열에서 지정한대로 데이터가 형식화되어 출력됨
> Formatter 클래스 객체 생성 과정
```JAVA
Formatter formatter = new Formatter(Appendable a);
// Formatter에서 형식화된 문자열을 만들었을 때, 결과가 저장되는 곳임
// Appendable 인터페이스를 구현한 대표적인 클래스인 StringBuffer
StringBuffer sb = new StringBuffer();
Formatter formatter = new Formatter(sb);
// StringBuffer 클래스의 객체에 대해 Formatter를 지정하는 문장
// Formatter 객체에서 적용한 출력 포맷 결과가 StringBuffer 객체에 저장됨

formatter format(String format, Object... obj) // 포멧 메서드 형태
// 몇 개의 데이터를 형식화된 출력으로 지정할 것인지 사전에 확정할 수 없기 때문에 가변적 매개변수를 사용함
// String 타입의 format 문자열은 출력하고자 하는 문자열 형태로 지정하고, 중간에 %로 시작하는 format을 지정함
// format 문자열 Object 타입의 가변형 매개변수 개수와 동일해야 함
```
- Formatter에 사용하는 format들(%d, %s...) 에는 다양한 형식과 타입을 지원함
- Date나 Calendar 클래스를 매개변수로 받아 날짜를 출력하는 %t format에는 부가적인 옵션이 붙음
> 데이터 타입별 format

| format | 설명                                                         |
| ------ | ------------------------------------------------------------ |
| %B, %b | 논리형 데이터에 사용, %b는 소문자로, %B는 대문자로 true, false 출력 |
| %C, %c | 문자형 데이터에 사용, 사용 가능한 데이터는 Byte, Short, Character, Integer 등 문자표현 가능, Wrapper 클래스 |
| %d     | 10진수 정수형 데이터에 사용, 사용가능한 데이터는 Byte, Short, Integer, Long. BigInteger 등 정수표현 가능, Wrapper 클래스 |
| %e     | 10진수 지수형 데이터에 사용, 사용 가능한 데이터는 Float, Double, BigDecimal 등 지수 표현 가능 Wrapper 클래스 |
| %f     | 일반적인 실수형 데이터에 사용, 사용 가능한 데이터는 Float, Double, BigDecimal 등 실수 표현 가능 Wrapper 클래스 |
| %x     | 16진수 정수형 데이터에 사용, 사용 가능한 데이터는 Byte, Short, Integer, Long, BigInteger 등 정수 표현 가능 Wrapper 클래스 |
| %o     | 8진수 정수형 데이터에 사용, 사용 가능한 데이터는 Byte, Short, Integer, Long, BigInteger 등 정수 표현 가능 Wrapper 클래스 |
| %s     | 객체의 문자열 데이터에 사용, 해당 객체의 toString() 메서드의 결과가 출력 |
| %t     | 날짜형 데이터에 사용, 별도의 표를 통해 소개하는 부가적인 옵션이 필요하고, Date, Calendar 클래스에 사용 밑의 표 참조 |
| %n     | 개행 처리에 사용, 대응되는 매개변수 값이 없어도 사용 가능    |
| %%     | % 문자 출력에 사용, 대응되는 매개변수 값이 없어도 사용 가능  |



> %t 날짜 foramt

| 날짜 타입 | format                                       |
| --------- | -------------------------------------------- |
| %tA       | 요일 출력                                    |
| %tY       | 4자리 년도 출력                              |
| %tB       | 월의 이름(영어의 경우 January February) 출력 |
| %tm       | 01 ~ 12 로 표현하는 월 출력                  |
| %te       | 1 ~ 31로 표현하는 해당 월의 날짜 출력        |
| %tk       | 0 ~ 23로 표현하는 시 출력                    |
| %tl       | 1 ~ 12로 표현하는 시 출력                    |
| %tM       | 00 ~ 59로 표현하는 분                        |
| %tS       | 00 ~ 59로 표현하는 초                        |
| %tZ       | 타임존 출력                                  |

> Formatter 클래스 사용예

```java
StringBuffer sb = new StringBuffer();
Formatter formatter = new Formatter(sb);
Calendar c = Calendar.getInstance();

int i = 10;
int j = 20;
int k = i + j;
// 세 개의 형식화 인자 지정, i, j, k 의 데이터 세 개 필요
formatter.format("%d 과 %d 을 더하면 %d 가 됩니다", i, j, k);
//시간을 표현한 예제
// 세 개의 format 지정.
// 세 개의 데이터 모두 날짜형인 Calendar 타입의 c 대응.
// 개행 처리 format 값은 필요없으므로 데이터 세 개 필요
formatter.format("현재 시간은 %tk : %tM : %tS %n ", c, c, c);

System.out.println(formatter.toString());
/* 결과 값:
10과 20을 더하면 30이 됩니다.
현재 시간은 11시 26분 31초입니다.
*/
```


