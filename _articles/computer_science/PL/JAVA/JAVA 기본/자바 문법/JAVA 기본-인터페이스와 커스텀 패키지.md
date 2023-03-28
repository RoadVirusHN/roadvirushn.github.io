---
title: JAVA 기본-인터페이스와 커스텀 패키지
date: 2023-02-01 15:48:48 +0900
tags: HIDE CRUDE 
layout: obsidian
is_Finished: false
last_Reviewed: 2023-02-01 15:48:48 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# 인터페이스와 커스텀 패키지


## 인터페이스와 패키지
### 인터페이스와 다형성
#### 인터페이스
- 추상 클래스보다 추상성이 더욱 심화 개념, 멤버 변수는 모두 상수형, 메서드는 모두 추상 메서드
- 추상 메서드 이외에는 다른 멤버를 갖지 못하게 함으로써 추상 클래스 보다 더욱 완벽한 추상화
- 상속은 단일 상속만 허용하며, 논리적으로 is a 관계가 성립하지 않는 경우 인터페이스 사용함
- 사용자 정의 인터페이스나 빌트인 인터페이스 사용 가능
> 인터페이스의 정의 예시
```Java
public interface 인터페이스명 [extends 부모인터페이스명, ...]{
	// 상수, final 예약어를 이용해서 멤버 변수를 선언해야함
	// 추상 메서드, 인터페이스는 객체를 생성할 수 없으므로 상수는 static 예약어를 붙여 선언해야 직접 해당 상수를 사용할 수 있음
	// 추상메서드로 선언되므로 메서드의 블록을 가지지 못함
}
public interface Drawable{
	public static final int PLAIN_PEN = 1
	public static final int BOLD_PEN = 2
	public static final int ITLIC_PEN = 3
	public abstract void draw(); // 추상메서드 {}를 가지지 못함
	public abstract void move(int x, int y);
    //인터페이스의 변수 선언에 사용된 static final이나 메서드 선언에 사용된 abstract는 생략 가능
}
```
#### 인터페이스의 활용

- 인터페이스는 추상 클래스와 유사하기 대문에 직접 객체화 되지 못하고 추상 객체처럼 상속으로 사용함
- extends 예약어 대신 implements 예약어를 사용하고, 원하는 갯수의 인터페이스를 차례대로 나열
- 자식 클래스는 블록을 추가하여 추상 메서드의 기능을 구현해야함,
> 인터페이스와 상속 예시
```Java
public interface Drawable{
	public int PLAIN_PEN = 1
	public int BOLD_PEN = 2
	public int ITLIC_PEN = 3
	public void draw(); // 추상메서드 {}를 가지지 못함
	public void move(int x, int y);
}
class Shape {
	int x = 0;
	int y = 0;
	
	Shape(int x, int y) {
		this.x = x;
		this.y = y;
	}
}

class Circle extends Shape implements Drawable{ // s
	int radius;
	
	Circle(int x, int y, int radius){
		super(x, y);
		this.radius = radius;
	}
	
	public void draw() { //인터페이스의 draw, move 구현
		System.out.println("(" + x + ", " + y + ") radius = " + radius);
	}
	
	public void move(int x, int y){
		System.out.println("(" + (this.x + x) + ", " + (this.y + y)+") radius = " + radius);
	}
}
Shape s = new Circle();// 부모 클래스 타입으로 묵시적 형변환
Drawable d = new Circle();// 인터페이스 타입으로 묵시적 형변환
// d는 Drawable 인터페이스가 가지고 있는 상수와 메서드만 접근 가능함
```
- 인터페이스 사용시 클래스와 동일하게 묵시적 형변환과 명시적 형변환이 가능함
- 인터페이스는 부모 클래스와 동일한 지위를 가지며, 인터페이스 유형의 객체 참조 변수는 인터페이스에 선언된 요소에만 접근 가능

- 인터페이스 선언 시 다른 인터페이스를 상속하여 정의할 수 있음
예시 구문 : public interfae 인터페이스명 [extends 부모인터페이스1, 부모인터페이스2...]{
//...
}
- 인터페이스를 상속하는 경우에도 extends 예약어를 사용하며, 상속관계에 따라 계층 구조 가짐
### 자바 패키지
#### 패키지 개요
- 패키지란, 자바의 클래스들을 분류하고 관련된 클래스와 인터페이스를 하나의 폴더에 적절하게 배치하여 묶여있는 폴더,

- 다른 기능을 구현한 같은 이름의 클래스를 사용할 때 이름의 충돌을 피하고 관리가 용이하다.

- 여러 빌트인 패키지와, 사용자 정의 패키지도 생성 가능

  | 패키지      | 설명                                                         |
  | ----------- | ------------------------------------------------------------ |
  | java.applet | 애플릿 작성에 필요한 기능을 모아놓은 패키지                  |
  | java.awt    | GUI 작성과 관련된 패키지, javax.swing 패키지와 함께 자바 GUI 애플리케이션 작성 시 필수적으로 사용함, 버튼, 텍스트 필드, 메뉴 등 관련 컴포넌트와 이벤트 기능을 제공함 |
  | java.io     | 자바 입출력 기능과 관련된 패키지, 파일이나 버퍼등의 입출력 기능을 제공함 |
  | java.lang   | 자바 언어의 기초적인 사항을 정의한 클래스와 관련된 패키지, Object 클래스, 문자열 관련, 시스템 관련, 멀티 Thread 관련 등 기본적인 기능을 포함함 |
  | java.net    | 자바의 네트워크에 관련된 패키지, 네트워크와 관련된 패키지는 이 밖에도 여러 가지가 있지만, 이 패키지 내에는 소켓과 관련된 기능을 제공함 |
  | javax.swing | java.awt 패키지와 더불어 자바 GUI 애플리케이션 기능과 관련된 패키지, Java.awt 포함 내용보다 다양하고, 융통성 있는 컴포넌트를 제공함 |
  | java.util   | 유틸리티성 기능과 관련도니 패키지, 날짜 표현이나 여러 자료형을 하나로 취급하는 컬렉션과 관련된 기능을 제공함 |

- API에 제공되는 패키지화된 클래스들을 사용하기 위해 import 예약어 사용
- 별도 패키지를 지정하지 않으면 디폴트 패키지가 됨, java.lang 패키지와 함께 import 문 사용안함
- import문 사용하면 JVM(자바 가상 머신) 실행 시 클래스를 찾게됨
- import 선언하지 않고 패키지 경로를 모두 적어서 사용할 수 도 있음
- 패키지 내의 한 클래스만 사용하면 클래스 이름까지 정함
- 패키지 이름만을 사용하면 한 패키지 내에 여러 클래스가 사용될 때 패키지 이름만을 사용함
- 이를 통해 컴파일 시간을 줄일 수 있음, import java.util.\*; 내부 모든 클래스 사용
- 여러 패키지에 동일한 이름의 클래스를 import 하면 에러 발생, 
- 사용빈도가 높은 클래스는 import,  사용빈도가 낮은 클래스는 패키지 경로를 포함하여 사용
#### 사용자 정의 패키지
- 윈도우 탐색기에서 폴더 또는 디렉토리 개념과 같음, 동일한 파일이  같은 폴더에 있으면 오류가 나므로 파일 이름이 동일하다면 다른 폴더에 나누어서 저장, 또는 두 클래스의 이름을 다르게 지정
- 하지만 그 방법은 한계가 있음, 다른 폴더로 나누는 게 나음
- 개발자가 작성한 클래스를 특정 패키지로 묶을 수 있으므로, 개발할때 관련된 클래스들을 그룹으로 묶어서 폴더 단위로 관리할 수 있음
구문 :
package 상위패키지명.패키지명; // 패키지 선언 문장은 반드시 첫번째 문장으로 기술
또는
package 패키지명; // 현재 파일 내의 모든 클래스는 이 패키지에 포함되어 저장됨
// 저장후 해당 패키지에 클래스 파일들이 생성됨
//  .을 통하여 여러 하위 폴더가 생성되며 복잡한 구조 패키지 생성가능 
- 사용자가 작성한 클래스를 패키지로 묶으려면 package 예약어를 사용, 불러올때는 import 사용
#### 커스텀 라이브러리 사용
- 자바는 프로그램 구현에 필요한 중요 클래스들을 API 형태로 JVM에 포함
- API에서 제공하지 않거나, API를 응용해서 개발자가 만든 클래스들, == 커스텀 라이브러리
- IDE 에서 프로젝트를 Export 해서 만듬, jar 파일(java archive의 준말)로 압축 
- 반대로 jar파일을 가져와서 커스텀 라이브러리를 임포트하여 사용할 수도 있음