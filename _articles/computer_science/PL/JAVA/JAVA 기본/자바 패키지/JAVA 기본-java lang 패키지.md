---
title: AVA 기본-java lang 패키지
date: 2023-02-01 15:51:23 +0900
tags: HIDE CRUDE 
layout: obsidian
is_Finished: false
last_Reviewed: 2023-02-01 15:51:23 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# java lang 패키지

## java.lang 패키지
### java.lang 패키지
#### java.lang 패키지
- 가장 기본이 되는 필수 클래스들과 인터페이스들이 포함된 패키지
- import 구문을 이용하지 않아도 기본적으로 탑재되어 있음
- java.lang 패키지는 Object 클래스(최상위 부모 클래스), String 클래스, Boolean 클래스 Number 클래스(숫자형 자료형 클래스들의 부모) 등을 제공
#### Object 클래스
- 자바 API의 모든 클래스와 사용자가 정의한 모든 클래스의 최상위 클래스,
- 모든 자바 클래스들은 Object 클래스로부터 상속 받았으며, 소스상에 명시하지않아도 자동으로 됨
- 도스 창으로 javap 명령어로 실행해보면 extends 로 object 클래스가 부모로 있음
> Object 클래스의 주요 메소드

| Object 클래스의 메서드            | 설명                                                       |
| --------------------------------- | ---------------------------------------------------------- |
| boolean equals(Object obj)        | 두개의 객체가 같은지 비교하여 true, false 반환 (자주 사용) |
| String toString()                 | 현재 객체의 문자열을 반환함 (자주 사용)                    |
| protected Object clone()          | 객체를 복사함                                              |
| protected void finalize()         | 가비지 컬렉션 직전에 객체의 리소스를 정리할 때 호출        |
| Class getClass()                  | 객체의 클래스형을 반환함                                   |
| int hashCode()                    | 객체의 코드 값을 반환함                                    |
| void notifiy()                    | wait된 Thread 실행을 재개할 때 호출함                      |
| void notifiyAll()                 | wait된 모든 Thread 실행을 재개할 때 호출함                 |
| void wait()                       | Thread를 일시적으로 중지할 때 호출함                       |
| void wait(long timeout)           | 주어진 시간만큼 Thread를 일시적으로 중지할 때 호출함       |
| void wait(long timeout, int naos) | 주어진 시간만큼 Thread를 일시적으로 중지할 때 호출함       |

- == 연산자는 자바에서 값을 비교하기 위해서 사용하는 연산자
	- 기본형의 경우 같은 값을 가지고 있는 확인, 참조형은 같은 주소를 가르키고 있는지 확인
- 객체의 경우, 주소값을 비교하는 것이 아니라, 내용을 비교해야되는 경우가 생기는데, 참조형이므로 == 연산자로는 알 수 없다.
- 이럴 때는 Object 클래스가 제공하는 equals() 메서드를 사용하여 객체의 내용을 비교할 수 있다.
- 단 equals() 메서드를 오버라이딩해서 사용하지 않으면 == 연산자와 역할이 같다.
- 그러므로 class 내부에서 equals()메서드를 오버라이딩 해야함, 예를들어 각 변수가 같은 같은 타입의 객체이면 True를 반환

- toString() 메서드는 객체의 변수 값들을 화면에 간단하게 출력하고 할 때 사용함
- 기본 정의는 클래스 타입과 이 객체의 코드 값을 16진수 문자열로 리턴하도록 구현했다.
- 그러므로 제대로 사용하려면 toString() 메서드를 오버라이딩 해야함.
- System.out.println() 메서드 호출 시 자동으로 호출되기 때문에 생략도 가능
- 예를 들어 객체 내부 멤버 변수의 값을 리턴하도록 만들면 유용하게 쓸 수 있음

- equals() 메서드와, toString() 메서드는 IDE에서 보통 자동으로 생성하는 기능을 제공함
#### Wrapper 클래스
- 자바에서는 8가지 기본 데이터 타입을 객체로 사용할 수 있도록 지원,
- 기본 데이터 타입에 따른 객체를 지원하기 위해 각각의 데이터 타입과 관련된 클래스를 제공함
- 이를 wrapper 클래스라고함 
> 8가지의 wrapper 클래스와 기본 데이터 타입의 연관관계

| Wrapper 클래스 | 기본 데이터 타입 |
| -------------- | ---------------- |
| Boolean        | boolean          |
| Character      | char             |
| Byte           | byte             |
| Short          | short            |
| Integer        | int              |
| Long           | long             |
| Float          | float            |
| Double         | double           |

- 사용자의 문자열 입력을 다양한 기본 데이터타입으로 변환하는 편리한 메서드들을 제공함
- Wrapper 클래스 객체는 한 번 생성되면 그 값이 변할 수 없음

- Integer 클래스는 상당히 자주 사용하며 다음과 같은 생성자를 가지고 있다.
- Integer(int value) : value 값의 정수를 저장한 객체를 생성함
- Integer(String s) : S 값의 문자열을 정수로 저장한 객체를 생성함
> Integer 클래스의 주요 메서드

| Integer 클래스의 메서드                     | 설명                                                         |
| ------------------------------------------- | ------------------------------------------------------------ |
| byte byteValue()                            | 현재 객체의 값을 byte 값으로 변환함                          |
| int compareTo(Integer anotherInteger)       | 현재 객체의 정수값을 다른 Integer 객체의 정수 값과 비교하여 그 결과를 음수, 양수, 0으로 변환함 |
| int compareTo(Object o)                     | o 객체와 같은 값을 가진 객체인지 비교하여 그 결과를 음수, 양수, 0으로 변환함 |
| static Integer decode(String nm)            | nm 값을 정수 값으로 변환하여 저장한 객체를 변환함            |
| double doubleValue()                        | 현재 객체의 값을 double 값으로 변환함                        |
| boolean equals(Object obj)                  | obj 객체와 같은 값을 가져는지의 여부를 true, false로 변환함  |
| float floatValue()                          | 현재 객체의 값을 float 값으로 변환함                         |
| int hashCode()                              | 현재 객체의 코드 값으로 변환함                               |
| int intValue()                              | 현재 객체를 int 형으로 변환함                                |
| long longValue()                            | 현재 객체를 long형으로 변환함                                |
| static int parseInt(String s)               | 문자열을 10진수의 int 형으로 변환함                          |
| static int parseInt(String s, int radix)    | 문자열을 주어진 radix의 int형을 변환함 (자주 씀)             |
| short shortValue()                          | 현재 객체를 short 형으로 변환함                              |
| static String toBinaryString(int i)         | 현재 객체의 2진수 값을 문자열로 변환함                       |
| static String toHexString(int i)            | 현재 객체의 16진수 값을 문자열로 변환함                      |
| static String toOctalString(int i)          | 현재 객체의 8진수 값을 문자열로 변환함                       |
| String toString()                           | 현재 객체를 String으로 변환함                                |
| static String toString(int i)               | i 값을 String으로 변환함                                     |
| static String toString(int i, int radix)    | i 값을 주어진 radix의 String으로 변환함                      |
| static Integer valueOf(String s)            | s의 정수값을 가진 객체로 변환함                              |
| static Integer valueOf(String s, int radix) | s의 정수값을 주어진 radix 형을 가진 객체로 변환함            |

- 이외에도 static 변수로 최대 숫자 범위를 나타내는 MAX_VaLUe와 MIN_VALUE 등을 가지고 있다.
- Booelan()은 true 이외의 모든 값을 false로 간주함
### 자바의 문자열
#### String 클래스
- String 객체는 여러 개의 문자들로 이루어진 문자 배열 형태로 생성되고, 인덱스는 0부터 시작함
- 문자열 객체를 생성하고 처리하기 위해서는 String 클래스를 사용해야 함
> String 클래스의 주요 생성자

| String 클래스의 생성자                                       | 설명                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| String()                                                     | 빈 문자열인 객체를 생성함 (자주 씀)                          |
| String(byte[] bytes)                                         | byte 배열의 내용을 String 객체로 생성함 (자주 씀)            |
| string(byte[] bytes, int offset, int length, String charsetName) | byte 배열의 offset 위치부터 count 개만큼의 내용을 지정한 문자 세트로 String 객체를 생성함 |
| String(StringBuffer buffer)                                  | StringBuffer 문자열을 가진 객체를 생성함                     |
| ... 이외에도 여러 생성자가 있다.                             |                                                              |
> String 클래스의 주요 메소드

| String 클래스의 메소드                         | 설명                                                 |
| ---------------------------------------------- | ---------------------------------------------------- |
| char charAt(int index)                         | index 번째 문자를 반환함                             |
| String concat(String str)                      | '+' 연산자처럼 문자열을 결합함                       |
| boolean endsWith(String suffix)                | 특정 문자열로 끝나는지 확인하여 true, false를 반환함 |
| boolean equals(Object anObject)                | 2개의 문자열 값을 비교하여 true, false를 반환함      |
| boolean equalsIgnoreCase(String anotherString) |                                                      |
| byte[] getbytes()                              |                                                      |
| int indexOf(int ch)                            |                                                      |
| int indexOf(int ch, int fromIndex)             |                                                      |
| int indexOf(String str)                        |                                                      |
| int indexOf(int ch, int String str)            |                                                      |
| int lastIndexOf(int ch)                        |                                                      |
| ...이외에도 여러 메서드가 있다.                |                                                      |

- String 객체는 한번 생성되면 문자열 내용이 변경되지 않음
- 단 String 메서드 실행 결과를 또 다른 문자열 객체로 리턴함, 변하지 않는 문자열 표현시 사용
- 두 가지 형태의 객체 생성 방법을 제공함, 그 방법이 마치 배열과 같아, new 연산자 없이 사용가능
String name1 = new String("자바더헛");
String name2 = "자바더헛";
- new 연산자 사용하지 않고 생성하면 컴파일 시점에 메모리를 할당 받음, 
- 만약 동일한 문자열을 가진 String 이라면 같은 문자열이 저장된 주소 값을 재사용함
- 자바의 기본 데이터 타입들도 변수에 값을 할당하는 방법으로 객체 생성이 가능함

- 문자열과 + 연산자를 결합하면 문자열 결합의 의미로 사용함
- 앞뒤 상관없이 한쪽이 문자열이면 나머지 한쪽을 자동으로 문자열로 변환되어 결합됨
- 변하지 않으므로, 문자열이 사용될때마다 문자의 길이를 다시 계산할 필요가 없어 편리함
#### StringBuffer 클래스
- 프로그램 내에서 변하는 문자열을 다룰 때 사용함,
- 객체의 크기가 동적이며 크기를 지정하지 않아도 기본적으로 16개의 문자를 저장할 수 있는 버퍼 공간을 가짐
- 내용이 변하지 않는 String 클래스와 달리 StringBuffer 클래스는 문자열의 내용을 변경할 수 있음
- 즉 StringBuffer 클래스의 메서드는 문자열 처리 후의 결과를 원래의 StringBuffer 객체에 반영, 메서드 리턴타입은 void
- String과 비슷한 생성자와 메서드를 가지고 있다. 
- (append(): 문자열 끝에 데이터 추가, int capacity(): 현재 문자열의 총용량, char charAt(int index): index 위치의 문자를 반환함, int length(): 길이를 반환함)
- + 연산자를 사용하여 문자열을 결합하거나  new연산자를 사용하지 않고 객체생성하지 못함

> 문자열 클래스의 장단점

|             | String 클래스                                                | StringBuffer 클래스                                          |
| ----------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 용도        | 문자열 객체를 처리                                           | 문자열 객체를 처리함                                         |
| 변경 가능   | 변경 불가                                                    | 변경 가능                                                    |
| 문자열 결합 | + 연산자로 문자열 결합, concat() 메서드 사용                 | append() 메서드를 이용하여 문자열을 결합함                   |
| 메모리 처리 | 내부적으로 StringBuffer 객체를 생성한 후에 문자열을 결합 후 toString() 메서드를 호출하여 새로운 String 객체를 리턴 | StringBuffer 객체에 문자열을 직접 추가하므로, 하나의 StringBuffer 객체만 유지할 수 있음 |
| 속도        | StringBuffer로 변환되는 과정이 필요하므로 느림               | 중간 변환과정 생략으로 빠름                                  |

- StringBuffer 클래스가 메모리 사용, 속도 면에서 효율적임, 
- 하지만 String이 편하므로 잘 안바뀌는 것은 String 나머지는 StringBuffer를 선호하자
