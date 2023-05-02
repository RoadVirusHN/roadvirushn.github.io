---
title: JAVA 기본-클래스 구조
date: 2023-02-01 15:46:50 +0900
tags: HIDE CRUDE 
layout: obsidian
is_Finished: false
last_Reviewed: 2023-02-01 15:46:50 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# 클래스 구조

## 클래스의 구조와 객체 생성
### 클래스의 구조

```ad-example
title: 클래스의 선언 형식과 예시
~~~java
[access modifier] class 클래스명 [extends 부모 클래스명]{// 클래스의 선언부
	[access modifier] 클래스명(argument list) { } // 생성자 : 객체 초기화
	[access modifier] 데이터타입(data_type) 변수명[= 초기 값]; // 변수 선언
	[access modifier] return_type 메서드명(argument list){ }//메서드 선언
}
// access modifier는 생략시 (default)로 지정됨
// 클래스의 예시
public class Employee {
	//멤버 변수
	private String name; // 이름
	private int number; // 사번
	private String dept; //근무 부서
	
	//생성자
	public Employee(String name, int number, String dept){
		this.name = name;
		this.number = number;
		this.dept = dept;
	}
	// 메서드
	public String getName() {
		return name;
	}
	public void setName(String name){
		this.name = name;
	}
	public int getNumber() {
		return number;
	}
	.
	.
	. // 기타 메서드 들
	
}
~~~
```
- **클래스 Modifier**
	- 접근 권한 예약어와 활용방법 예약어로 나뉨
```ad-note
title: 접근 권한 예약어
| 종류      | 활용                                                      |
| --------- | --------------------------------------------------------- |
| public    | 모든 클래스에서 접근이 가능함을 의미                      |
| protected | 자기 자신, 하위 클래스와 동일 패키지내 클래스도 접근 가능 |
| private   | 해당 클래스에서만 접근이 가능함 동일 패키지도 불가능      |
| (default) | 지정하지 않으면 같은 패키지 내의 클래스에서만 접근 가능함 |
```

```ad-note
title: 활용 방법 예약어
일부 자세한 내용은 [[JAVA 기본-자바 한정자와 생성자]] 참조

| 종류         | 활용                                                         |
| ------------ | ------------------------------------------------------------ |
| `final`        | 자식 클래스를 가질 수 없는 클래스임을 의미                   |
| `abstract`     | 객체 생성이 불가능한 추상클래스를 의미, 하위클래스에 의해 구현 됨 |
| `static`       | 클래스에 소속된 클래스 메서드를 의미하며, 클래스 생성 시 만들어짐 |
| `transient`    |                                                              |
| `volatile`     |                                                              |
| `synchronized` | Thread의 동기화를 위한 메서드임                              |
| `native`       |                                                              |
```
### Java의 접근 제한자
클래스와 지역 변수를 제외하고 모든 메서드, 필드, 생성자는 폐쇄성 오름차순으로 **Public, Protected, Default, Private**이 존재한다.

- **Public**: 언제 어디서나 접근 가능
- **Protected**: 같은 패키지 소속이거나 자식 객체만 접근 가능
- **Default**: 같은 패키지에 소속된 객체만 접근 가능, 아무 선언 안할 시 기본값
- **Private**: 클래스 내부에서만 접근 가능, 
	- 접근 불가능한 private 생성자를 이용해 인스턴스 생성 또한 클래스 내부의 다른 퍼블릭 메소드로 진행하도록 강제하여 싱글톤 패턴을 만드는데 사용할 수 있다.

```ad-seealso
title: Class 접근 제한자는 **Public과 Default**만 있으며, **Public**의 경우, 다른 패지키에서 해당 클래스를 사용 가능하다. 지역변수는 언제나 **Default** 상태이다.
```

### 제어자(Modifier)
클래스나 변수, 메서드 선언 시 앞에 함께 선언되어 부가적인 의미를 부여한다.

- **접근 제한자(Access Modifier)**
객체 지향형 프로그래밍 언어들에서 **클래스 내부 또는 외부에서 메소드와 필드의 접근을 제어하여 캡슐화를 구현하기 위한 수단**이다.

주로 Java로 설명하므로 자세한 건, [[JAVA 기본-자바 한정자와 생성자]]을 참조

- **접근 제한자 이외**
	자바의 경우 주로 static, final, abstract를 이용한다.
	- **static** : 클래스가 인스턴스화하지 않고도 접근 가능하며, 모든 인스턴스가 값을 공유한다.
		클래스가 메모리에 로딩될 시 생성되며, 메모리의 위치가 고정되게 된다.
		**static** 메서드의 경우, 각 인스턴스의 인스턴스 멤버를 사용할 수 없게 된다.
		
	- **final**: 클래스의 경우 확장(상속) 불가능, 메소드와 변수의 경우 최초 선언 이후로, 재정의, 변경 불가능하게 제한한다.
		보통 **static final**로 같이 사용하여 다른 언어에서의 **Const**처럼 상수로 사용한다.
		
	- **abstract**:  클래스와 메서드에만 사용, 메서드의 선언부만 작성하고 실제 수행 내용은 오버라이딩 해서 사용한다.
		이를 추상 메서드라 하며, 추상 메서드가 있는 클래스의 앞에 같이 선언하여 추상 클래스로 만들어지면, 해당 클래스는 인스턴스화될 수 없고 상속만 받을 수 있다.
		
	그 외에는 **native**(자바가 아닌 언어로 구현 뒤, 자바에서 사용 시), **transient**(직렬화 시, 직렬화 대상 제외), **snchronized**(스레드 동기화용), **volatile**(메인 메모리에 변수 저장), **strictfp**(부동 소수점 계산 제한) 등이 존재하며, 자바 이외의 언어는 추가로 **extern**, **inline**, ***const** 등이 존재한다.
	


- UML : 소프트웨어 개념을 다이어그램으로 그리기위해 사용하는 시각적 표기법
	- 객체지향 프로그램을 시각화 하고 시스템 사양이나 설계를 문서화
	- 시스템을 구성하는 다양한 클래스들사이의 관계를 그림으로 표현
#### 객체 생성
- 자바의 변수는 기본형 변수와 참조형 변수(배열객체나 일반 클래스의 객체 처리)로 나뉨
- 특정 클래스의 유형의 객체 참조 변수 선언
클래스이름 객체참조변수이름; ex) Car Yellow; int[] scoreList;
- 객체 생성
객체참조 변수이름 = new 클래스이름(); ex) Yellow = new Car(); scoreList = new int[5];
// 객체가 사용할 메모리 영역을 할당하는 과정 -> 예약어 new 사용
- 생성된 객체에 대한 참조 값(일종의 메모리 주소)이 선언된 객체 참조 변수에 할당
- 객체 참조 변수 선언과 생성을 동시에 하는 문장
클래스이름 객체참조변수이름 = new 클래스이름(); ex) `Car Yellow = new Car();`
```ad-example
title: 클래스의 선언과 객체 생성 점검 예제 (`CarTest.java`)
~~~java
class Car{
	String name;
	int speed;
}

public class CarTest{
	public static void main(String[] args){
		Car Yellow = new Car(); //객체 생성후 주소 값 할당, 다른 이름의 변수로 여러개의 객체 생성 가능, 각각 변수를 바꿀 수도 있음		
		Yellow.name = "Lightning Yellow";
		Yellow.speed = 300;
		System.out.println(Yellow.name + " : " + Yellow.speed);
	}
}
~~~
```
## 멤버 메서드
### 멤버 변수
- modifier를 통해 변수에 대한 접근 권한이나 활용방법 제어
1) 전역 변수 (Global variable)
- 클래스 선언부 밑에 선언된 변수로 멤버 변수 라고 칭함
- 여러 메서드에서 공통으로 사용 가능
- 객체가 가질 수 있는 속성을 나타내는데 사용됨
3) 2) 지역 변수(Local variable)
- 메서드 선언부 밑에 선언된 변수
- 해당 변수가 선언된 메서드 내에서만 사용 가능
```ad-note
title: 멤버 변수에 사용되는 modifier
| 구분      | Modifier  | 설명                                                         |
| --------- | --------- | ------------------------------------------------------------ |
| 접근권한  | public    | 모든 클래스에서 접근이 가능함을 의미함                       |
|           | protected | 동일 패키지에 속하는 클래스와 하위 클래스 관계의 클래스에 의해 접근이 가능 |
|           | private   | 변수가 선언된 클래스 내에서만 접근이 가능하다는 의미         |
| 활용 방법 | final     | 변수를 상수로 이용하는 경우 사용함                           |
|           | static    | 클래스에 소속된 클래스 변수를 의미하며, 일반적으로 변수 클래스 라고 함 |
```

### 메서드
- 일종의 함수로서, 클래스가 제공할 로직들을 정의함
```ad-example
title: 메서드의 정의와 반환
~~~java
[access modifier] 반환형(return_type) 메서드명(arg1, arg2...m argn){
	//메서드의 실행 코드
}

public int sum(int num1, int num2){ //반환형, 메서드명, 매개변수 : 메서드 시그니쳐
	int sum = 0;
	sum = num1 + num2;
	return sum;
}
sum(4, 7);// 메서드 () 안에 넘어가는 데이터를 argument, 또는 인자라고 함
~~~
```
- 메서드 앞에 접근 제한자를 붙일 수 있음
- 메서드의 수행 결과를 리턴할 수 있도록 반환형으로 선언해야 함, 반환 값이 없다면 void로 선언
- 메서드명 뒤 괄호를 이용해 매개변수를 선언해야하고 {} 안에 기능 구현

메서드의 종류
- python, c++의 반환값과 매개변수 유무에 따른 메서드 종류 구분과 같음

메서드의 자동 구현
- 멤버 변수들은 대부분의 경우 private로 선언해서 외부에서는 숨겨진 형태로 만듦
- public으로 지정한 메서드를 통해 접근하도록 클래스를 구현함
- private 변수에 저장된 값을 리턴하는 getXXX() 메서드 -> getter 메서드
- private 변수에 값을 저장하는 setXXX() 메서드 -> setter 메서드
- IDE들에서는 이러한 getter와 setter 메서드를 자동으로 만들 수 있게 했음
- 이외에도 toString() 메서드(객체의 상태 표시) 등도 자동 구현 할 수 있음