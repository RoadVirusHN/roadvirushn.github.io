---
title: JAVA 기본-추상 클래스와 객체 형변환
date: 2023-02-01 15:48:22 +0900
tags: HIDE CRUDE 
layout: obsidian
is_Finished: false
last_Reviewed: 2023-02-01 15:48:22 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# 추상 클래스와 객체 형변환

## 추상 클래스와 객체의 형변환
### 추상 클래스와 내부 클래스
#### abstract 예약어
- 메서드와 클래스를 선언할 때 사용하는 Modifier
- 메서드를 선언할 때 abstract 예약어를 붙이면 현재 메서드를 추상 메서드로 정의한다는 의미
- 추상메서드: 메서드 시그니쳐(리턴타입, 메서드명, 매개변수)만 정의, 기본적인 기능 유추 가능
- 구체적인 행위, 즉 블록 부분은 정의되지 않은 특수한 메서드
> abstract 예시
```Java
returnType name([argType argName, ...]){...} //일반 메서드
abstract returnType name([argType argName, ...]);//추상 메서드
abstract int sum(int num1, int num2); // 더하는 추상 메서드
```
- 상속과 함께 사용해서 사용함, 
- 클래스 선언부에 abstract를 사용하면 해당 클래스를 추상 클래스로 선언한다는 의미가 됨
- 추상 클래스는 일반적으로 하나 이상의 추상 메서드를 포함함, 즉 추상메서드가 없는 클래스도 추상클래스로 선언 가능
- 추상 메서드를 포함하고 있는 클래스는 반드시 추상 클래스로 선언되어야 합니다.
- 특징으로 객체생성을 못함, 생성되면 아무런 기능이 없는 추상메서드를 불러올 수 있기 때문에
- 추상 클래스의 상속을 통해 자식 클래스에게 추상 메서드를 강제로 구현하게 할 수 있음
- 자식클래스들에게 특정 메서드 포함을 강제하여 유지보수의 편의성을 높일 수 있음
> abstract class 예시
```Java
abstract class AbstractClass{
	public void methodA() {...}
	public void methodB() {...}
}

class SubClass extends AbstractClass{
//추상 메서드가 상속되었으나 추상메서드를 구현(오버라이딩)하지 않았기 때문에 객체를 생성할 수 없음, 결국 객체를 만들기 위해 구현하도록 강제함
}
```
#### 내부 클래스
- 클래스가 다른 클래스를 포함하는 경우 내부에 포함된 클래스를 내부 클래스라고 함
- 파일크기 최소화, 보안, 성능 향상, 이벤트 처리 등을 쉽게 하기 위해 사용됨
- 정의되는 위치에 따라서 멤버 클래스와 지역 클래스로 나뉨
	- 멤버 클래스 : 멤버 변수와 동일한 위치에 선언된 내부 클래스
		- static 예약어가 붙은 static 멤버와 instance 멤버로 나뉨
		- 동일한 클래스뿐만 아니라 다른 클래스에서도 활용될 수 있음
		- 클래스 멤버 변수와 성격이 비슷함 
	- 지역 클래스 : 메서드 내에 클래스가 정의되어 있는 경우 
		- 지역 클래스(이름을 가지고 있음), 무명 클래스(이름없음)으로 나뉨
		- 활용 범위가 메서드 블록 내부로 제한되는 특징을 갖는 등 지역변수와 비슷함
- 자바의 클래스 구조 조직화, 소스 코드 효율 높일 수 있음
- 내부 클래스가 생성되기 위해서 외부 클래스의 객체가 반드시 필요함
1) instance 멤버 내부 클래스
- 클래스의 멤버와 동일한 위치에서 선언되는 내부 클래스
- 멤버 변수나 메서드와 동일한 위치에서 선언됬으므로 외부의 클래스들도 사용 가능함
> instance 멤버 내부 클래스 예시
```Java
class Outside{// 외부 클래스 (Top Level 클래스라고도 함)
	// 내부 클래스
	public class Inside{ //내부클래스를 일반 멤버 변수와 동일한 위치에 정의함
		// ...
	}
}

//main 함수 안에서
Outside outer = new Outside();// 내부 클래스의 객체 생성을 위해 외부 클래스의 객체를 생성해야 함
Outside.Inside inner = outer.new Inside(); // 이후 내부 클래스 객체 생성
```
2)  static 멤버 내부 클래스
- 내부클래스 정의 시 static 예약어를 사용하면 객체 생성하지 않고도 내부 클래스 객체 생성
> static 멤버 내부 클래스 예시
```Java
class Outside{// 외부 클래스 (Top Level 클래스라고도 함)
	// Static 내부 클래스
	public class StaticInner{ //static 예약어를 이용하여 정의함
		// ...
	}
}
//main 함수 안에서
Outside.StaticInner sinner = new Outside.StaticInner();//static 내부 클래스 객체를 생성하는데, 이때 외부 클래스의 객체를 생성하지 않아도 생성 
```
3) 이름이 있는 지역 내부 클래스
- 메서드 내부에서 정의된 클래스로, 지역변수와 동일한 범위를 가짐
- 클래스의 이름이 명시되는 클래스임
> static 멤버 내부 클래스 예시
```Java
class Animal{// 외부 클래스 (Top Level 클래스라고도 함)
	// 이름이 있는 지역 내부 클래스
	void performBehavior() { 
		class Brain{ // 지역 내부 클래스를 정의함
			// 지역 변수와 동일한 범위를 가지므로 클래스 선언된 메서드 블록 내에서만 사용 가능
		}
	}
}
```
4) 이름이 없는 지역 내부 클래스
- 이름을 갖지 않음, new 예약어 뒤에 명시된 클래스가 기존의 클래스인 경우, 자동으로 이 클래스의 자식 클래스가 됨
- 이름이 없으므로 무명의 내부 클래스라고 하며, 추상클래스의 객체를 내부 클래스 형태로 생성할 때 자주 사용됨
- 추상 클래스는 추상 메서드를 포함하고 있기 때문에 객체를 생성할 수 없음
	- 하지만 이름이 없는 지역 내부 클래스로는 생성할 수 있음
> 이름이 없는 지역 내부 클래스
```Java
abstract class TV {
	public abstract void powerOn();
	public abstract void powerOff();
	public abstract void volumeUp();
	public abstract void volumeDown();
}

public class AnonymousTest{
public static void watchTV(TV tv) {
    tv.powerOn();
    tv.volumeUp();
    tv.volumeDown();
    tv.powerOff();
}
public static void main(String[] args) {
	watch(new TV(){ //무명 지역 내부 클래스 객체 생성
		public void powerOn(){
			System.out.println("TV --- 전원을 켠다.");
		}
		public void powerOff(){
			System.out.println("TV --- 전원을 끈다.");
		}
		public void volumeUp(){
			System.out.println("TV --- 소리를 높인다.");
		}
		public void volumeDown(){
			System.out.println("TV --- 소리를 낮춘다.");
		}
	});
//TV라는 추상 클래스의 객체를 내부 클래스 형태로 생성했기 때문에 실제로는 TV 클래스를 상속한 내부 클래스가 만들어지게 됨
}
}

class AnonymousClass extends TV{
	public void powerOn(){
		System.out.println("TV --- 전원을 켠다.");
	}
	public void powerOff(){
		System.out.println("TV --- 전원을 끈다.");
	}
	public void volumeUp(){
		System.out.println("TV --- 소리를 높인다.");
	}
	public void volumeDown(){
		System.out.println("TV --- 소리를 낮춘다.");
	}
} // 내부 클래스를 사용하여 복잡해지는 소스코드를 명확히 할 수 있고, 한 번 작성된 내부클래스에 대한 재사용성을 높임
```
### 객체의 형변환
#### 형변환 개요

- 큰데이터 타입이 작은 데이터 타입으로 변하는 명시적 형변환
	- 더 작은 범위를 나타내는 데이터 타입으로 변환시 데이터 손실이 우려됨 (축소 형변환)
	- double -> int의 경우
- 작은 데이터 타입을 큰 데이터 타입으로 바꾸는 묵시적 형변환
	- 형변환 연산자를 사용하지 않아도 자동으로 이루어짐 (자동 형변환)
	- int -> double의 경우

- 객체 참조변수의 경우에도 형변환이 이루어진다.
- 왼쪽 객체와 오른쪽 대입된 객체가 다른 클래스이고, 왼쪽 객체가 오른쪽 대입 객체의 부모 클래스인 경우에만 묵시적 형변환이 일어남
- 반대로 부모 클래스를 자식클래스로 형변환 할때는 명시적 형변환 해야함
- 할당되는 인스턴스 유형에 따라서 실행 오류가 발생할 수 있음
- instanceof 연산자를 통해 생성된 객체가 class와 관계있는 형인지 확인, 참, 거짓으로 반환
- 구문 예시
<생성된객체reference변수> instanceof <class 또는 interface 명>
- 매개변수로 부모 클래스를 넣고, 자식 클래스들 중 하나를 넣는 식으로 사용할 수 있음
#### 형변환과 멤버
- 형변환에 참여한 서로 상속관계에 있는 두 클래스 간에는 동일한 이름의 변수가 존재하거나 메서드가 Overriding 되어 있을 수 있음, 생성된 객체 변수를 통해 멤버에 접근할 때 주의 해야함
- 묵시적 형변환 의 경우 상속관계의 두 클래스의 형변환이 이루어진 뒤 (즉 자식 클래스를 부모 클래스 타입의 변수로 할당한 뒤) 메서드로 호출하면 자식의 클래스 변수값, 변수 접근으로 다가가면 부모의 클래스 변수 값이 나옴 
- 변수에 대한 접근은 객체의 유형에 의해 결정, 메서드 호출은 할당되는 인스턴스에 의해 결정
- 객체 참조 변수가 변수나 메서드를 참조하는 경우, 참조 관계를 결정하는 시간이 다르기 대문에 나타나는 차이