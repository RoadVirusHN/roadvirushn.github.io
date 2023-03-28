---
title: JAVA 기본-컬렉션
date: 2023-02-01 15:52:29 +0900
tags: HIDE CRUDE 
layout: obsidian
is_Finished: false
last_Reviewed: 2023-02-01 15:52:29 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# 컬렉션

### 기본 Collection
#### Collection 개요

- 자바의 배열은 고정 길이이므로 배열의 길이가 증가되거나 감소할 수 없어서 배열의 크기를 벗어나는 인덱스에 접근하면 오류가 일어남, 배열의 길이를 미리 예측하는 것은 어려운 일임
- 사전에 배열의 길이를 알 수 없을 때 Vector와 같은 다양한 Collection 클래스를 지원함

1) Vector 클래스 개요
- 자바는 동적인 길이로 다양한 객체들을 저장하기 위해 Vector 클래스를 제공함
- Vector는 저장되는 객체들에 대한 참조 값을 저장하는 일종의 가변 길이의 배열
- 가변배열에는 객체만 저장이 가능함, 가변 크기로서 객체의 갯수를 염려할 필요 없음
- 한 객체가 삭제되면 컬렉션이 자동으로 자리를 옮겨줌
- 다양한 객체들이 하나의 Vector에 저장될 수 있고, 길이도 필요에 따라 자동으로 증가 됨
> Vector 클래스의 생성자

| Vector 클래스의 생성자     | 설명                                                         |
| -------------------------- | ------------------------------------------------------------ |
| Vector()                   | 10개의 데이터를 저장할 수 있는 길이의 객체를 생성하고, 저장 공간이 부족한 경우 10개씩 증가함 |
| Vector(int size)           | size 개의 데이터를 저장할 수 있는 길이의 객체를 생성하고, 저장 공간이 부족한 경우 size개씩 증가함 |
| Vector(int size, int incr) | size 개의 데이터를 저장할 수 있는 길이의 객체를 생성하고, 저장 공간이 부족한 경우 incr 개씩 증가함 |

> Vector 클래스의 메서드

| Vector 클래스의 메서드                       | 설명                                                         |
| -------------------------------------------- | ------------------------------------------------------------ |
| void add(int index, Object element)          | 10개의 데이터를 저장할 수 있는 길이의 객체를 생성하고, 저장 공간이 부족한 경우 10개씩 증가함 |
| boolean add(Object o)                        | size 개의 데이터를 저장할 수 있는 길이의 객체를 생성하고, 저장 공간이 부족한 경우 size개씩 증가함 |
| void addElement(Object obj)                  | size 개의 데이터를 저장할 수 있는 길이의 객체를 생성하고, 저장 공간이 부족한 경우 incr 개씩 증가함 |
| int capacity()                               | Vector의 용량을 반환함                                       |
| boolean contains(Object elem)                | 현재 Vector에 elem의 요소가 있는지 검사하여, 있으면 true, 아니면 false로 반홤 |
| Enumeration elements()                       | 이 Vector의 Enumeration을 생성함                             |
| boolean equals(Object o)                     | Vector의 내용이 같은지 비교함                                |
| Object get(int index)                        | Vector의 index 요소를 Object 형태로 반환함                   |
| boolean remove(Object o)                     | o 객체를 찾아서 Vector에서 제거함                            |
| void insertElementAt (Object obj, int index) | index 위치에 obj를 삽입함                                    |
| 기타 등등...                                 |                                                              |

> Vector 클래스 구현 예시
```Java
import java.util.Date;
import java.util.Vector;

class VectorTest {
	public static void main(String args[]){
		Vector list = new Vector(3);
		System.out.println("저장 능력 : " + list.capacity());
		System.out.println("저장 요소 개수 : " + list.size());
		list.addElement(new Integer(10));
		list.addElement(new Double(10,0));
		list.addElement(new String("자바"));
		list.addElemnt(new Date());
		
		System.out.println("<< 세 개의 객체 저장 후 >>");
		System.out.println("저장 능력 : " + list.capacity());
		System.out.println("저장 요소 개수 : " + list.size());
		
		if (list.contains("자바")) {
			System.out.print("\"자바\"스트링은 " + list.indexOf("자바"));
			System.out.println(" 번 인덱스에 존재한다."); //ln이 있으면 줄바꿈
			}
			System.out.println("<< Vector에 저장된 요소들 >>");
			for (int i = 0; i < list.size(); i++){
				System.out.println(i + "번째 요소는 " + list.elementAt(i));
			}			
		}
	}
}
/* 결과값 :
저장 능력 : 3
저장 요소 개수 : 0
<< 세 개의 객체 저장 후 >>
저장 능력 : 6
저장 요소 개수 : 4
"자바" 스트링은 2 번 인덱스에 존재한다.
<< Vector에 저장된 요소들 >>
0번째 요소는 10
1번째 요소는 10.0
2번째 요소는 자바
3번째 요소는 Mon Jan 27 09::44:23 KST 2014
*/
```
2) Enumeration 인터페이스 개요
- 개체들의 집합(Vector)에서 각각의 객체들을 한 순간에 하나씩 처리할 수 있는 메서드를 제공함
- 인터페이스이므로, 직접 new 연산자를 이용하여 객체를 생성할 수 없음
> Enumeration 인터페이스의 메서드

| Enumeration 메서드        | 설명                                                         |
| ------------------------- | ------------------------------------------------------------ |
| booelan hasMoreElements() | Vector로부터 생성된 Enumeration의 요소가 있으면 true, 아니면 false를 반환함 |
| Object nextElemnt()       | Enumeration 내의 다음 요소를 반환함                          |

- Enumeration 인터페이스에 선언된 메서드는 그 인터페이스를 사용하는 클래스로 구현해서 사용해야함
	- Vector 클래스의 elements()라는 메서드에 의해 생성
	- Enumeratino 객체 내의 메서드들은 모두 Vector 클래스에서 이미 구현하여 제공
> Enumeration 인터페이스 구현
```Java
import java.util.Enumeration;
import java.util.Vector;

class EnumerationTest {
	public static void main(String args[]) {
		Vector list = new Vector(5);
		list.addElement(new Integer(10));
		list.addElement(new Double(10,0));
		list.addElement(new String("자바"));
		System.out.println("<< Vector에 저장된 요소들 >>");
		for (int i = 0; i < list.size(); i++){
			System.out.println(i + "번째 요소는 " + list.elementAt(i));
		}
		Enumeration e = list.elements();//enumeration은 new 생성자로 만들 수 없으므로vector의 요소들을 복사하여 저장
		System.out.println();
		System.out.println("<< Vector로부터 생성한 Enumeration의 요소들 >>");
		while (e.hasMoreElemetns()) {
			System.out.println("e의 요소 : " + e.nextElement());
		}
/* << Vector에 저장된 요소들 >>
list의 0번째 요소 : 10
list의 1번째 요소 : 10.0
list의 2번째 요소 : 자바

<< Vector로부터 생성한 Enumeration의 요소들 >>
e의 요소 : 10
e의 요소 : 10.0
e의 요소 : 자바
*/
```
3) Stack 클래스 개요
- 스택(Stack)은 사전적으로 더미, 쌓아올림 이라는 의미를 가짐
- 제일 마지막에 저장한 데이터를 제일먼저 꺼내는 LIFO 자료 구조
- top : 가장 최근에 입력된 데이터로 삽입, 삭제, 읽기 동작이 발생함
	- 데이터의 수에 따라 유동적, 데이터가 삽입되면 증가, 삭제되면 감소
- bottom : 가장 먼저 입력된 데이터, 0으로 고정됨
- push: top 값을 하나 증가시킨 후, 새로운 데이터를 삽입함
- pop : top이 가리키고 있는 자료 삭제 후, top 값을 하나 감소하도록 구현함
- peek : top이 가리키는 데이터를 읽는 작업, top 값에는 변화 없음
> Stack 클래스 구현 (StackTest.java)
```Java
import java.util.LinkedList;
import java.util.Stack;

public class StackTest {
	public static void main(String[] args){
		ArrayStack stack = new ArrayStack(5); // 초기에 5개의 길이를 가진 Stack를 생성함
		for(int i=1; i<=5; i++){
			stack.push("데이터-" + i);//top 값을 증가시키면서 순차적 삽입
		}
		System.out.println(stack.pop()); // top이 가리키고 있는 자료 삭제 후, top 값을 하나 감소하도록 구현함
		System.out.println(stack.pop());
		System.out.println(stack.peek());
		System.out.println(stack.peek());// top이 가리키는 데이터를 읽음
		System.out.println(stack.pop());
		System.out.println(stack.pop());
		System.out.println(stack.pop());
	}
}
```
4) Queue 인터페이스 개요
- queue는 줄이라는 의미를 가지고 있음, 가장 먼저 삽입된 데이터가 먼저 제거되는 FIFO 구조
- front : 가장 먼저 입력된 데이터 remove 대상, rear: 가장 최근에 입력된 데이터 insert 대상
- front 값이 rear를 추월하게 되면 더 이상 제거할 데이터가 없는 상태, 자료가 하나도 없는 빈큐
- 큐에서 fornt가 가리키는 데이터를 읽는 작업을 peek라고 하며, 데이터를 제거하지 않고 읽는 작업만 수행하므로 front 값을 변경시키지 않음
- > Queue 클래스 구현 (QueueTest.java)
```Java
import java.util.LinkedList;
import java.util.Queue;

public class QueueTest {
	public static void main(String[] args){
		Queue<String> queue = new LinkedList<String>(); // Queue를 구현한 클래스를 통해 객체 생성
		for(int i=1; i<=5; i++){
			queue.add("데이터-" + i) // 1부터 3까지 차례대로 입력
		}
		System.out.println("<< 가장 앞에 있는 요소 >>");
		System.out.println(queue.peek()); // front 데이터 확인
		System.out.println("<< 순차적으로 요소 꺼내기 >>");
		System.out.println(queue.poll()); //하나씩 꺼내기
		System.out.println(queue.poll());
		System.out.println(queue.poll());
	}
}
```
#### Generics
1) Generics를 이용한 Collection API 사용
- 자바는 제공하는 다양한 컬렉션들을 다른 타입의 Object 들을 저장하고 관리하는 기능을 제공
- 하지만 실제 프로그램을 개발할 때는 다른 타입의 데이터를 저장할 일이 거의 없음
- 오히려 다른 타입의 데이터들을 컬렉션에 저장함으로써 문제가 발생하는 경우가 있음
- 컬렉션 객체가 특정 타입의 데이터만 저장하고 사용할 수 있도록 지원함
- Generics : 컬렉션에 저장할 객체의 타입을 제한해서 사용하도록 함
	- 타입의 안정성을 제공
	- 타입 체크와 형변환 과정 생략
	- 코드의 간결화
- 제네릭스를 사용하기 위한 문법
	- 컬렉션<데이터타입> 변수이름 = new 컬렉션 <데이터타입>();
	// 데이터타입 : 저장해서 사용할 데이터 타입 지정
> Generics 사용 예시
```Java
import java.util.Vector;

public class GenericsTest {
	public static void main(String[] args){
		Vector<Integer> list = new Vector<Integer>();//Generics를 Integer 객체만 저장할 수 있는 Vector를 생성함
		list.addelement(new Integer(100));
		list.addelement(new Integer(95)); 
		list.addelement(new Double(99.6)); // 컴파일 되지 않음, 무시됨
		
		int sum = 0;
		for (int i = 0; i < list.size(); i++) {
			Integer = score = list.elementAt(i);
			sum = sum + score.intValue();
		} // Generics 이용해 Vector 객체를 생성했으므로 Integer 타입으로 형변환할 필요 없이 Vector에 저장된 정수의 합을 출력함
		System.out.println("점수의 총합: " + sum);
		
	}
}
```
2) Collection을 사용하는 확장 for문
- 배열을 함한 컬렉션을 쉽게 사용할 수 있도록 향상된 for문을 제공함
- Collection : 요소들을 순차적으로 꺼내기 위해서 Collection에 저장된 요소의 개수를 확인하고, 그 길이만큼 반복함, Enumeration을 이용함
- for 문: Enumeratino 사용 안해도 컬렉션 요소에 순차적으로 접근 가능
> for문 구문과 예시
```Java
for(데이터타입 접근변수명 : 배열이나컬렉션참조변수명) {
// 배열이나 Collection이 가지고 있는 데이터와 같은 데이터 타입을 지정해야함
	반복문장;
}
// 예시
public class ForTest {
	public static void main(String[] args) {
		int[] scoreList = { 50, 45, 99, 85, 100}; //int 타입의 값
		int scoreSum = 0; // int 타입의 변수로 선언
		for (int score : scoreList) {
			scoreSum = scoreSum + score;
		}
		System.out.println("점수의 총합 : " + scoreSume);
	}
}
// collection 확장 for 문
public class ForTest {
	public static void main(String[] args) {
		Vector<String> subjectList = new Vector<String>();
		subjectList.add("Java");
		subjectList.add("SQL");
		subjectList.add("Servlet");
		
		for (String subject : subjectList){
			System.out.println(subject); // 가능하면 generics 이용
			// 접근 변수에 데이터타입을 지정할 대 Generics 클래스에서 지정한 데이터 타입으로 지정할 수 있음, generics 사용 안할시 접근 변수의 데이터 타입을 Object 클래스 타입으로 지정해야함, 적절한 해당 클래스 타입으로 형변환 시켜야함
		}
	}
}
```
## 컬렉션 프레임워크

### 컬렉션 프레임워크

#### 컬렉션 개요
- 자료구조 : 일정한 규칙에 의해 데이터들이 모아져 있는 것을 의마함
	- 배열 : 자료구조 중에서 가장 기본이고 단순한 구조, 동일한 타입의 데이터들의 집합
	- 배열은 초기 생성시에 그 크기를 미리 지정, 임의로 크기를 바꿀 수 없어서 제약이 따름
- 컬렉션 프레임 워크 : 데이터를 효과적으로 관리, 사용할 수 있도록 다양한 기능의 클래스를 제공
	- 커스텀 배열 클래스의 add, remove, find 같은 메소드들처럼
	- Vector, Stack, Properties, 는 각각 사용법이 다르고 상호 호환성, 확장성이 떨어지지만
	- 컬렉션 프레임워크는 높은성능, 상호 운용성, 응용 및 확장성이 뛰어남 ( 표준 인터페이스의 집합이 기초이기 때문에)
- 컬렉션은 몇 개의 표준 인터페이스를 구현하는 클래스 들로 구성됨

#### 컬렉션 API
> 컬렉션 프레임워크의 인터페이스

| 인터페이스 | 설명                                                         |
| ---------- | ------------------------------------------------------------ |
| Collection | 객체들의 집합을 사용할 수 있도록 하는 컬렉션 계층의 최상위 인터페이스 |
| List       | Collection 인터페이스를 상속했으며, 순차적인 리스트를 다루기 위해 사용함 |
| Set        | Collection 인터페이스를 상속했으며, 유일한 요소만 포함하는 집합을 다루기 위해 사용함 |
| SortedSet  | Set 인터페이스를 상속했으며, 정렬된 집합을 다루기 위하여 사용함 |

1) Collection 인터페이스 : 최상위 인터페이스, 핵심 메서드로 구성되어 있음

> Collection 인터페이스의 메서드

| 메서드                       | 설명                                                         |
| ---------------------------- | ------------------------------------------------------------ |
| boolean add(Object obj)      | 컬렉션에 obj를 추가함, 성공 시 true를 반환하고, obj가 이미 컬렉션의 멤버이고 중복을 허용하지 않는 컬렉션일 겨우 추가되지 않고 false를 반환함 |
| boolean contains(Object obj) | obj가 컬렉션의 요소이면 true를 반환함                        |
| boolean isEmpty()            | 컬렉션이 비어있을 경우 true를 반환함                         |
| Iterator iterator()          | 컬렉션의 모든 요소를 순차적으로 접근할 수 있는 Iterator를 반환함 |
| boolean remove(Object obj)   | 컬렉션에서 obj를 하나 제거함, 성공시 true를 반환함           |
| int size()                   | 컬렉션의 요소의 수를 반홤                                    |
| 기타 등등                    |                                                              |

2)  List 인터페이스 : Collection 인터페이스를 확장했으며 요소들의 순서를 저장하는 기능이 추가

- 0부터 시작하는 index를 사용해 특정 위치에 요소를 삽입하거나, 특정 위치의 요소를 꺼냄

- 동일한 요소라고 하더라도 순서를 가지고 구분이 가능하기 대문에 요소의 중복저장을 허용

> List 인터페이스의 메서드

| 메서드                          | 설명                                                         |
| ------------------------------- | ------------------------------------------------------------ |
| void add(int index, Object obj) | 리스트의 index 위치에 obj를 삽입함                           |
| Object get(int index)           | 리스트의 index 위치의 요소를 반환함                          |
| Object remove(int index)        | 리스트의 index 위치의 요소를 삭제하고 삭제한 요소를 반환함   |
| int indexOf(Object obj)         | 리스트에서 처음으로 검색된 obj의 위치를 반환함, obj가 리스트의 요소가 아니라면 -1을 반환함 |
| 기타 등등 이 있다.              |                                                              |

3) Set 인터페이스 : Collection 인터페이스를 확장했으며 중복되지 않는 요소들의 집합을 선언
- 동일한 요소의 중복을 허용하지 않기 때문에 이미 저장된 객체를 add() 메서드로 다시 저장하려고 할 때 false를 반환함
- 추가적인 메서드는 선언되어있지 않음
3) SortedSet 인터페이스 : Set 인터페이스를 확장했으며 오름순으로 정렬된 집합의 동작을 선언
> SortedSet 인터페이스의 메서드

| 메서드                         | 설명                                                         |
| ------------------------------ | ------------------------------------------------------------ |
| Object first()                 | 첫 번째 요소를 반환함                                        |
| Object last()                  | 마지막 요소를 반환함                                         |
| Comparator comparator()        | 정렬 방식을 정의한 비교자(comparator)를 반환함, 만약 비교자를 따로 정의하지 않고 기본 방식을 사용한다면 null이 반환됨 |
| SortedSet headset (Object end) | 첫 번째 요소부터 end 요소까지 포함하는 SortedSet을 반환함, 원본과 반환된 SortedSet은 데이터를 공유함 |
| 기타 등등                      |                                                              |

#### 컬렉션 클랙스

- 구현한 인터페이스의 특징을 그대로 가지고 있음,

- 몇몇 클래스들은 추상 클래스로 작성되어 실제 동작이 가능한 자식 클래스의 골격을 제공 함

> 컬렉션 프레임워크의 인터페이스

| 클래스       | 설명                                                         |
| ------------ | ------------------------------------------------------------ |
| LinkedList   | AbstractSequentialList를 확장함으로써 연결 리스트를 구현함   |
| ArrayList    | AbstractList르 확장하며 동적 배열을 구현함                   |
| HashSet      | AbstractSet을 확장하며 HashTable을 사용하도록 구현함         |
| TreeSet      | AbstractSet을 확장하며 트리에 저장된 집합을 구현함           |
| AbstractList | AbstractCollection을 확장하고 List 인터페이스 대부분의 기능을 실제 구현함 |
|              | 기타 등등이 있다.                                            |

1) ArrayList 클래스

- AbstractList를 확장하고, List 인터페이스를 구현함

- 내부적으로 배열을 이용하여 리스트 자료구조를 구현함

- 동적 배열을 지원하기 때문에 초기 값을 넘어서는 객체를 삽입하는 경우 그 크기가 늘어나고, 반대로 객체를 제거하는 경우 그 크기가 줄어듦

> ArrayList 클래스의 생성자

| 생성자                  | 설명                                                         |
| ----------------------- | ------------------------------------------------------------ |
| ArrayList()             | 비어있는 ArrayList를 생성함, 초기 배열의 크기는 10           |
| ArrayList(Collection c) | 컬렉션 c의 요소들로 초기화되는 ArrayList를 생성함            |
| ArrayList(int capacity) | capacity 만큼의 초긴 배열의 크기를 가지는 ArrayList를 생성함 |

- AbstractList 클래스와 List 인터페이스의 모든 메서드를 사용할 수 있으며, 다음 메서드가 추가되었음
> ArrayList 클래스의 새 메서드

| 생성자                               | 설명                                           |
| ------------------------------------ | ---------------------------------------------- |
| void ensureCapacity(int minCapacity) | ArrayList의 사이즈를 지정함                    |
| void trimToSize()                    | ArrayList의 빈 공간을 제거하여 사이즈를 조절함 |

> ArrayList를 이용하여 체조점수 구하기 (ArrayListTest.java)

```Java
import java.util.ArrayList;

public class ArrayListTest {
	public static void mian(String[] args) {
		ArrayList<Double> scoreList =new ArrayList<Double>();
		// ArrayList 객체를 생성하고 데이터 저장 및 요소들을 출력함
		scoreList.add(9.5);
		scoreList.add(8.4);
		scoreList.add(1, 9.2);
	// 1번 인덱슨에 9.2라는 점수를 저장하여 원래 1번 인덱스는 뒤로 밀려남
		scoreList.add(9.5);
		System.out.println(scoreList.toString());
		
		//ArrayList에 저장된 점수에서 최고점과 최저점을 구함
		double minScore = 100;
		double maxScore = 0;
		double score = 0;
		for (int i = 0; i < scoreList.size(); i++) {
			score = scoreList.get(i);
			if (score < minScore) {
				minScore = score;
			}
			if (score > maxScore) {
				maxScore = score;
			}
		}
		scoreList.remove(minScore);
		//최고점과 최저점을 삭제 후 ArrayList의 요소들을 출력함
		scoreList.remove(maxScore);
		System.out.println(scoreList.toString());
		
		double sum = 0;
		for (int i = 0; i < scoreList.size(); i++) {
			sum += scoreList.get(i);// 저장된 점수들의 총합을 구함
		}
		
		System.out.println("최저 점수 : " + minScore); //최저, 최고,평균출력
		System.out.println("최고 점수 : " + maxScore);
		Systme.out.println("평균 점수 : " + (sum / scoreList.size()));
	}
}
/* 결과값 :
[9.5, 9.2, 8.4, 9.5]
[9.2, 9.5]
최저 점수 : 8.4
최고 점수 : 9.5
평균 점수 : 9.35
*/
```
2) LinkedList 클래스
-  AbstractSequentialList를 확장하고 List 인터페이스를 구현함
-  이중 연결 리스트(Doubly Linked List) 형태의 자료구조를 구현함
> LinkedList 클래스의 생성자

| 생성자                   | 설명                                             |
| ------------------------ | ------------------------------------------------ |
| LinkedList()             | 비어있는 LinkedList를 생성함                     |
| LinkedList(Collection c) | 컬렉션 c의 요소들 초기화되는 LinkedList를 생성함 |

- AbstractSequentialList 클래스와 List 인터페이스의 모든 메서드를 사용함
- 첫 요소나 마지막 요소에 삽입/ 삭제가 효율적으로 이루어지므로 이에 대한 추가적인 메서드를 제공함
> LinkedList 클래스의 메서드

| 메서드                    | 설명                                                   |
| ------------------------- | ------------------------------------------------------ |
| void addFirst(Object obj) | 리스트 맨 앞에 obj를 추가함                            |
| void addlast(Object obj)  | 리스트 맨 뒤에 obj를 추가함                            |
| Object getFirst()         | 리스트 첫 번째 요소를 반환함                           |
| Object getLast()          | 리스트의 마지막  요소를 반환함                         |
| Object removeFirst()      | 리스트의 첫 번째 요소를 삭제한 후 삭제한 요소를 반환함 |
| Object removeLast()       | 리스트의 마지막 요소를 삭제한 후 삭제한 요소를 반환함3 |

3) HashSet 클래스

- AbstractSet을 확장고 Set 인터페이스를 구현함

- 데이터 저장소로 Hash Table을 사용하기 때문에 Hash 형태의 자료구조를 구현함

- 객체의 저장이나 삭제 시 내부에 대상 객체를 hashing 하여 HashCode를 만들어 HashTable의 index로 사용

- 객체를 hashing하는 작업은 자동으로 수행되기 대문에 Hash Table을 직접 접근할 수 없음

- 삽입, 삭제 등의 작업이 데이터의 수와 관계없이 일정한 성능을 보장

> HashSet 클래스의 생성자

| 생성자                                 | 설명                                                         |
| -------------------------------------- | ------------------------------------------------------------ |
| HashSet()                              | 비어있는 Hash셋을 생성함, 초기 Hash Table의 크기는 16        |
| HashSet(Collection c)                  | 컬렉션의 c의 요소들로 초기화되는 Hash셋을 생성함             |
| HashSet(int capacity)                  | capacity 만큼의 초기 Hash Table의 크기를 가지는 Hash셋을 생성함 |
| HashSet(int capacity, float fillRatio) | 아래 참조                                                    |

- capacity 만큼의 초기 Hash Table의 크기를 가지는 Hash셋을 생성함

- fillRatio는 Hash Table에 데이터가 얼마나 채워졌을때 크기를 확장할지 여부를 지정할 때 사용함

- 0.0 ~ 1.0 사이의 값을 사용할 수 있으며 만약 0.5 일 경우 전체 크기의 50%가 요소로 채워졌을 때 Hash Table을 확장한다는 의미임

- 기본값은 0.75

  

- AbstractSet 클래스와 Set 인터페이스의 모든 메서드를 사용할 수 있으며, 추가적인 메서드는 정의하지 않음
- Set: 중복을 허용하지 않기 때문에 동일한 객체를 여러 번 저장할 수 없음
	- 순서 또한 보장하지 않음
4) LinkedHashSet 클래스 : HashSet을 확장하고 Set 인터페이스를 구현함
- 기존의 헤쉬셋과 달리 연결 리스트를 이용해, 삽입된 데이터의 순서를 기억함
- 생성자는 Hashset과 동일하며 추가적인 메서드 또한 존재하지 않음

5) TreeSet 클래스 : AbstractSet을 확장하며 SortedSet 인터페이스를 구현함,
- 오름차순으로 정렬된 Set 집합을 사용할 수 있음
- 기억장소로 트리를 사용하여 빠른 접근 속도를 가지므로, 많은 양의 데이터를 정령하여 사용할때 유용함
> TreeSet 클래스의 생성자

| 생성자                   | 설명                                                         |
| ------------------------ | ------------------------------------------------------------ |
| TreeSet()                | 자연적인 정렬 순서를 따르는 비어있는 트리셋을 생성함         |
| TreeSet(Collection c)    | 자연적인 정렬 순서를 따르며 컬렉션 c의 요소들로 초기화되는 트리셋 생성 |
| TreeSet(Comparator comp) | 정렬방식을 정의한 비교자(comparator)에 따라 정렬되는 빈 트리셋 생성 |
| TreeSet(SortedSet ss)    | ss 요소들로 초기화되는 트리셋을 생성함                       |

> TreeSet 클래스 테스트 (TreeSetTest.java)

```Java
import java.util.TreeSet;

public class TreeSetTest {
	public static void main(String[] args) {
		TreeSet<String> set = new TreeSet<String>(); //오름차순으로 정렬되어 출력 
		set.add("9.5");
		set.add("8.4");
		set.add("9.5");
		set.add("8.4");
		set.add("9.5");
		System.out.println(set.toString());
		
		set.remove("9.2");
		System.out.println(set.toString());
	}
}
/* 결과값 :
[6.7, 8.4, 9.2, 9.5]
[6.7, 8.4, 9.5]
*/
```
6) Iterator 인터페이스
- 컬렉션 클래스의 모든 요소를 처음부터 끝까지 순차적으로 접근 가능하도록 해주는 인터페이스
- 모든 클ㄹ래스를 간단하고 통일된 방법으로 처리할 수 있는 방법을 제공함
- 직접 객체를 생성할 수 없으며, Iterator() 메서드를 통해 객체를 얻을 수 있음
> Iterator 인터페이스의 메서드

| 메서드            | 설명                                      |
| ----------------- | ----------------------------------------- |
| boolean hasNext() | Iterator에 요소가 더 있으면 true를 반환함 |
| Object next()     | 다음 요소를 반환함                        |
| void remove()     | 컬렉션에서 현재 요소를 삭제함             |

> 컬렉션의 모든 요소의 합계 (IteratorTest.java)

```Java
import java.util.Iterator;
import java.util.LinkedList;

public class IteratorTest {
	public static void main(String[] args) {
		LinkedList<Double> scoreList = new LinkedList<Double>();
		scoreList.add(new Double(9.5));
		scoreList.add(new Double(7.5));
		scoreList.add(new Double(8.2)); // 점수 저장 및 목록 출력
		System.out.println(scoreList.toString());
		
		//LinkedList 객체를 Iterator 객체로 변환한 후에 순차적으로 꺼내서 점수의 합을 출력 
		double sum = 0;
		Iterator<Double> it = scoreList.iterator();
		while(it.hasNext()){
			sum += it.next();
		}
		System.out.println("점수의 총합 : " + sum);
	}
}
/* 결과값 : 
[9.5, 7.5, 8.2]
점수의 총합 : 25.2
*/
```
### Map 컬렉션
#### Map
- key, value의 쌍으로 데이터를 저장하는 객체, key는 유일, value는 중복 가능
- 기능 적으로 collection 인터페이스와 다르므로 상속받지 않음
> Map과 관련된 인터페이스

| 인터페이스 | 설명                                                         |
| ---------- | ------------------------------------------------------------ |
| Map        | Map 계열의 최상위 인터페이스로 유일한 키(key)와 값(value)을 연결(map) 하는 다양한 메서드를 선언함 |
| Map.Entry  | Map에 저장되는 요소(key/value)를 표현하며 Map 인터페이스의 내부 클래스임 |
| SortedMap  | Map 인터페이스를 확장하여 key를 오름차순으로 유지함          |

> Map과 관련된 클래스

| 클래스        | 설명                                                         |
| ------------- | ------------------------------------------------------------ |
| HashMap       | AbstractMap을 확장하고 Hash Table을 이용하여 데이터를 관리하는 클래스임 |
| LinkedHashMap | HashMap을 확장하여 삽입 순서가 유지되는 집합을 구현함        |
| AbstractMap   | Map 인터페이스의 대부분을 구현함                             |
|               | 기타 등등이 있다.                                            |

> Map 인터페이스

| 메서드                         | 설명                                                         |
| ------------------------------ | ------------------------------------------------------------ |
| void clear()                   | 맵의 모든 요소를 삭제함                                      |
| Object get(Object k)           | 키값 k와 연결된 value를 반환함                               |
| Set keySet()                   | 맵에 있는 모든 key를 포함하는 Set을 반환함                   |
| Object put(Object k, Object v) | 지정한 k-value 쌍의 요소를 맵에 추가함 만약 k 값의 key가 이미 있다면 덮어씀 |
| int size()                     | 맵에 저장된 요소의 수를 반환함                               |
|                                | 기타 등등이 있다.                                            |

1) HashMap 클래스

- 키와 데이터값의 한쌍으로 묶어서 관리하며 키의 중복을 허용하지 않음

- HashMap, HashTable, TreeMap 클래스가 유사함

- Enumeration이나 Iterator 객체를 사용하여 데이터를 추출하지 않고 특정 키로 등록된 데이터를 추출함

> HashMap 클래스의 메서드

| HashMap 메서드 | 설명                                           |
| -------------- | ---------------------------------------------- |
| put()          | 키(key)와 값으로 구성된 새로운 데이터를 추가함 |
| get()          | 지정한 키(key)에 해당하는 데이터를 반환함      |
| containsKey()  | 지정한 키(key)가 존재하는지 여부를 반환함      |
| size()         | Map의 요소 개수를 반환함                       |
| isEmpty()      | Map이 비어 있는지의 여부를 반환함              |
|                | 기타 등등이 있다                               |

> HashMap 클래스 테스트 (HashMapTest.java)

```Java
import java.util.HashMap;
import java.util.Iterator;
import java.util.Set;

public class HashMapTest {
	public static void main(String[] args) {
		HashMap<String, String> map = new HashMap<String, String>();
		// 입력된 순서대로 출력하고 싶으면 LinkedHashMap으로 바꾸면 됨
		map.put("정길용", "010-111-1111");
		map.put("강성윤", "010-222-2222");
		map.put("채규태", "010-333-3333");
		
		Set<String> keys = map.KeySet();
		System.out.println(keys.toString());
		
		Iterator<String> it = keys.iterator();
		while (it.hasNext()) {
			String key = (String) it.next();
			System.out.println(key + " : " + map.get(key));
		}
	}
}
```