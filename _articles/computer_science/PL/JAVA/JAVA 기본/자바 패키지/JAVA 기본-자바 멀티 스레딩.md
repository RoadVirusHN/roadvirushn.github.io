---
title: JAVA 기본-자바 멀티 스레딩
date: 2023-02-01 15:53:22 +0900
tags: HIDE CRUDE 
layout: obsidian
is_Finished: false
last_Reviewed: 2023-02-01 15:53:22 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# 자바 멀티 스레딩

## 멀티 Thread 프로그래밍
### Thread 개요
#### 멀티 Thread
- 멀티 태스킹이란, 하나의 컴퓨터로 동시에 여러가지 일을 수행하는 것을 말함
- 우리가 사용하는 대부분의 운영체제는 멀티 프로세스를 통해 멀티태스킹을 지원
- 하나의 CPU를 가지고 있는 시스템에서 실행 시간을 나누어 각 프로세서들이 CPU 점유
- Thread : 한 작업에 대한 제어 흐름, 하나만 쓰면 단일 쓰레드 프로그램 여러개 쓰면 멀티 쓰레드 프로그램
- 여러 개의 Thread가 하나의 프로세스 안에서 동시에 수행되는 구조를 가짐
- Thread는 프로세스가 점유한 메모리 공간에서 다른 Thread와 병력적으로 수행됨
- 여러 개의 프로세스로 수행되는 것에 비해 시스템 자원을 좀더 효율적으로 수행함
> 싱글 Thread 테스트 (SingleThreadTest.java)
```java
public class SingleThreadTest {
	public static void main(String[] args) {// 클래스 내부에 main() 메서드 하나를 가지는 형태로 작성함
		System.out.println("싱글 Thread 프로그램 수행...");
		for (int i = 0; i < 10; i++) { //0부터 9까지 숫자를 출력하는 프로그램
			String threadName = Thread.currentThread().getName();
			System.out.println(threadName + " : " + i);
		}// 현재 실행중인 Thread 객체의 이름에 발생된 숫자를 결합해 출력함
	}
}
/* 싱글 Thread 프로그램은 프로그램이 종료될 때까지 하나의 Thread만 수행되는 프로그램*/
```
- Thread의 구성요소
	- 가상 CPU : 1개의 Thread를 수행시키기 위하여 자바 인터프리터에 의해 내부적으로 처리되는 가상 코드
	- 수행 코드 : Thread가 구현한 기능, 즉 Thread 클래스의 run() 메서드의 코드
	- 처리 데이터 : Thread가 처리하는 데이터
#### 멀티 Thread 프로그래밍
- java.lang 패키지에서 Thread 기능을 구현하는데 이용되는 Thread라는 클래스 제공
> Thread 클래스의 생성자

| Thread 클래스의 생성자 | 설명                                                       |
| ---------------------- | ---------------------------------------------------------- |
| Thread()               | 기본 Thread 객체를 생성함                                  |
| Thread(String name)    | 특정 이름을 가진 Thread를 생성함                           |
| Thread(Runnable r)     | Runnable 인터페이스를 구현한 객체를 이용해 Thread를 생성함 |

> Thread 클래스의 메서드

| Thread 클래스의 메서드                                   | 설명                                                         |
| -------------------------------------------------------- | ------------------------------------------------------------ |
| static void sleep(long msec) throws InterruptedException | msec에 지정된 millisecond 동안 Thread를 대기한다             |
| void start()                                             | Thread를 시작하게 함                                         |
| void join() throws InterruptedException                  | Thread가 끝날 때까지 대기함                                  |
| void run()                                               | Thread 기능을 실행함                                         |
| static void yield()                                      | 현재 실행중인 Thread를 잠시 멈추어 다른 Thread가 실행될 여지를 줌 |
| 기타 등등이 있다.                                        |                                                              |

1) Thread 클래스 상속

- java.lang.Thread : Thread가 가질 수 있는 변수와 많은 메서드가 포함되어 있음
- 이를 통해 필요한 기능을 추가해서 간단하게 Thread를 생성할 수 있음
- Thread 클래스를 활용해서 Thread 프로그램을 작성하는 절차
- 가) 특정 기능을 수행하는 Thread 클래스를 작성함

```java
  class MyThread extends Thread { // Thread 클래스를 상속한 새로운 클래스를 생성함
      // Thread의 변수들을 선언한다.
      // run() 메서드를 Overriding 한다.
      public void run() { // Thread의 기능을 제공하는 run() 메서드를 Overriding 함
          // Thread 기능을 구현한다.
      }
  }
```
- 나) Thread 클래스로부터 객체를 생성하고 생성된 Thread 객체를 실행함
```java
// Thread 클래스에 대한 객체를 생성한다.
MyThread thread = new MyThread(); // Thread 객체를 생성함
// Thread를 실행한다.
thread.start();// Thread 클래스의 start() 메서드를 호출한다.
```
> Thread를 상속하여 Thread 구현 예시 (ThreadTest1.java)
```java
class MyThread extends Thread {
	String threadName;
	
	public MyThread(String threadName) {
		this.threadName = threadName;
	}
	
	// Thread의 기능을 구현하는 메서드이다.
	public void run() {
		for (int i = 0; i < 10; i++) {
			System.out.println(i + " " + threadName);
			try {
				sleep((int) (Math.random() * 1000));
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
		System.out.println("---> " + threadName + " 수행 종료 ");
	}
}
public class ThreadTest1 {
	public static void main(String args[]) {
		System.out.println("==> Program Start");
		MyThread first, second; // 두개의 Thread 객체를 생성하고 start()메서드를 호출하여 Thread를 동작 시킴, -> 프로그램의 시작과 종료 메시지를 콘솔에 출력하여 Thread의 동작 시점과 종료 시점을 확인함
		first = new MyThread("First Thread");
		second = new MyThread("Second Thread");
		first.start();
		second.start();
		System.out.println("==> Progoram end");
	}
}
```
- Thread 객체는 start() 메서드를 호출할 때 동작,
- Overridng한 run() 메서드가 실행됨,
- Thread의 실행과 무관하게 main() 메서드는 종료됨
- 두 Thread 객체가 각각 자신이 수행할 작업들을 독립적을 수행함
2) Runnable 인터페이스 상속
- Thread의 수행 코드인 run() 추상 메서드를 가지고 있어서 내부적으로는 Thread 객체를 생서해서 수행하도록 되어 있음
- 자바 언어에서는 다중 상속을 지원하지 않기 때문에 두개 이상의 클래스를 상속 받을 수 없음
- Runnable 인터페이스를 활용해서 Thread 프로그램을 작성하는 절차
	가) 필요한 Thread 기능을 수행하는 클래스를 작성함
	```java
	class MyThread implements Runnable {
		// run() 메서드를 구현한다.
		public void run() {
			// Thread 기능을 작성한다.
		}
	}
	```
	나) Thread 클래스로부터 객체를 생성하고 생성된 Thread 객체를 실행함
    ```java
    // MyThread 객체를 생성한다.
    MyThread runnable = new MyThread();
    // 위의 생성된 객체를 인자로 Thread 클래스를 생성한다.
    Thread thread = new Thread(runnalbe); // Thread 객체를 생성함
    // Thread를 실행한다.
    thread.start()
    ```
> Runnable 인터페이스를 이용해서 Thread 구현하기 (ThreadTest2.java)
```java
class RunnableThread implements Runnable {
	String threadName;
	
	public RunnableThread(String threadName) {
		this.threadName = threadName;
	}
	
	public void run() {
		for (int i = 0; i < 10; i++) {
			System.out.println(i + " " + threadName);
			try {
				Thread.sleep((int) (Math.random() * 1000));
			}	catch (InterruptedException e) {
			}			
		}
		System.out.pritln("---> " + threadName + " 수행 종료");
	}
}

public class ThreadTest2 {
	public static void main(String args[]) {
		System.out.println("==> Program Start");
		Thread thread1 = new Thread(new RunnableThread("First Thread"));
		Thread thread2 = new Thread(new RunnableThread("Second Thread"));
		thread1.start();
		thread2.start();
		System.out.println("=> Program End");
	}
}
/* 두 개의 Thread 객체를 생성하고 start() 메서드를 호출하여 Thread를 동작시킴, 이때 프로그램의 시작과 종료 메시지를 콘솔에 출력하여 Thread의 동작 시점과 종료 시점을 확인함 */
```
### Thread 프로그래밍
#### Thread의 상태도와 Thread 스케줄
1) Thread의 상태도
- Thread 객체는 생성되고 소멸될 때까지 생명 주기를 가지게 되며, Thread는 그 생명 주기에 따라 동작함
    1. 쓰레드 객체 생성, start()메서드를 호출되면 대기 상태가 된 후 수행 가능 상태
    2. 스케줄러가 선택하여 cpu를 차지하고 run()메서드가 동작하여 실행 상태가 됨 3. 
    3. 실행 완료되면 종료 상태가 되고, 할당자원은 해제되면서 가비지 컬렉터에 지워짐
2) 실행 가능 상태와 스케줄러
- 실행 가능 상태 : 쓰레드가 CPU를 차지하여 언제든 실행가능한 상태를 의미
- 실행 가능 상태이 CPU들의 모임을 Runnable pool이라고 함
- 실행 가능 상태의 쓰레드들 중에서 실행 상태로 들어가는 Thread는 1개이므로 나머지는 대기, 이를 고르는 것은 스케쥴러가 함
- 스케쥴러 : JVM 안에서 수행되는 특별한 Thread, 실행 상태에 있는 Thread가 CPU를 반납할 셩우, 여러 상황을 고려하여 다음에 수행될 Thread 후보를 선택함
3) Thread의 제어 메서드
- 수행 가능 상태 (Runnable) : 대기 장소에서 JVM의 스케줄러가 Thread를 선택해서 수행 상태로 가기를 기다리는 상태
- 수행 상태 (Running) : 외부요인이나 내부 메서드로 수행불가능 상태로 갈 수 있음
- 수행 불가능한 상태 (Not Runnable) : 수행 가능한 생태로 가길 기다리는 상태
- 수행 불가능한 상태로 이동시키는 Thread 클래스의 메서드 : sleep(), wait(), join(), yield()
- IO를 수행하고 있는 경우 이미 수행되고 있는 객체에 대한 접근이 blocking 될수 있음
- sleep() : 지정된 시간동안 수행중인 thread를 sleeping pool로 보낸후, 대기상태가 됨, 다른 쓰레드에게 실행 기회를 양보하기 위한 목적으로 쓰임 위 예제 sleep 참조
- join() : 다른 쓰레드와 협동 작업을 요구할 때 사용하는 메서드 (합류하길 기다림)
- 현재 실행중인 쓰레드는 join pool로 들어가서 대기상태가 됨, 이후, 협력할 쓰레드에게 메시지를 보내 그 쓰레드가 일을 종료하면 joinpool에서 나와 대기상태로 감
- 인자로 millisecond 단위 표현 시간을 줄 수 있고 ,이 시간이 지날 때까지 Thread가 종료하지 못할 경우 대기중이던 Thread가 다시 실행 가능상태로 전환됨
- 쓰레드 간의 작업이 시간에 따라 영향을 받거나 선후 관계가 존재할 때 사용
> join 메서드 사용 예
```java
public void doWork() {
	Thread anotherThread = new Thread();
	anotherThread.start();
	
	try {
		// anotherThread의 수행이 끝날 때까지 기다린다.
		anotherThread.join();
	}	catch (Exception e) {
		e.printStackTrace();
	}
	// 현재 Thread가 하고자 하는 일을 계속 한다.
	// ...
}
```
- wait(), notify(), notifyAll() 메서드 : 여러 쓰레드를 순차적 또는 일정 순서에 따라 작업하고 싶을 때 사용하는 메서드, Object 클래스에 소속되어 있음
- Synchronized 예약어와 밀접한 관련을 맺고 있음, wait()메서드는 Thread를 기다리게 만드는 메서드
- wait 메서드로 waitng pool로 들어간 쓰레드는 notify(), notifyAll() 메서드로 탈출함 notify : 1개의 thread만 빠져나옴 jvm 알고리즘쓰지만 보통 선입선출
- yield() 메서드: 한 Thread가 수행 상태를 너무 오랫동안 점유하지 않고 다른 Thread에게도 기회를 주기위해 사용되는 메서드, 동일한 우선순위를 갖는 다른 Thread 에게 수행권한을 양보할 수 있게 해줌
> yield() 메서드 예시
```java
public void run() {
	for (int i = 0; i < 1000; i++) {
		for (int j = 0; i < 2000; j++) {
			System.out.println("연산 결과 : " + i * j); //이중 for문을 오랫동안 처리한다면 시스템은 이 작업을 수행하느라 다른 작업을 할 수 없음
			yield();// 다른 Thread 들도 수행권한을 얻을 수 있음
		}
	}
}
```
- run() 메서드의 내용을 모두 수행하면 Thread는 자동으로 종료하고, Thread 수행 시할당되었던 자원 모두 해제됨, stop() (위험한 방법),으로 멈추거나, run()메서드를 빠져나가도록 해서 쓰레드를 종료시키는 방법 예시 참조
> boolean 형 플래그를 이용해서 쓰레드를 종료시키는 프로그램
```java
class MyThread implements Runnable {
	private boolean flag = true;	
	public void run() {
		while (flag) {
			try {
				Thread.sleep(1000);
			} catch (InterruptedException e) { // 이것을 통해 빠져나가는듯?
				return;
			}
			System.out.println("작업을 처리한다.");
		}
	}	
	public void threadStart() {
		Thread myThread = new Thread(this);
		myThread.start();
	}
}
```
4) Thread 스케줄링
- Thread 스케줄링을 하는 방식은 우선순위(prioiry)와 Round-Robin(Time slicing)
- 자바에서 생성된 모든 Thread는 기본적으로 5의 우선순위 (1~10), 1이 가장 낮음
> Thread 클래스에서 우선순위와 관련된 멤버들

| Thread 클래스의 멤버           | 설명                                            |
| ------------------------------ | ----------------------------------------------- |
| final static int MIN_PRIORITY  | 가장 작은 우선순위 값을 나타내는 상수, 값은 1임 |
| final static int NORM_PRIORITY | 중간 값의 우선순위를 나타내는 상수, 값은 5임    |
| final static int MAX_PRIORITY  | 가장 큰 우선순위 값을 나타내는 상수, 값은 10임  |
| final int getPriority()        | Thread의 우선순위를 반환함                      |
| final void setPriority(int p)  | Thread의 우선순위을 p로 설정함                  |

> 다른 우선순위를 가진 Thread의 동작을 확인하는 프로그램
```java
class SimpleThread extends Thread {
	private String threadName;
	// 쓰레드 상속하여 SimpleThread 클래스 선언
	public SimpleThread(String threadName) {
		this.threadName = threadName;
	}
	
	public void run() {
		for (int i = 0; i < 5; i++) {
			System.out.println(threadName + " : " + i);
		}
		System.out.println("---> " + threadName + " 수행종료");
	}
}
public class PriorityTest { // 두개의 객체를 생성해 기동, setPriorty() 메서드로 우선순위 바꿈
	pulic static void main(String args[]) {
		System.out.println("==> Program Start");
		SimpleThread first = new SimpleThread("First Thread");
		SimpleThread second = new SimpleThread("Second Thread");
		first.setPriority(Thread.MIN_PRIORITY);
		second.setPriority(Thread.MAX_PRIORITY);
		first.start();
		second.start();
	}
}
```

#### Thread의 동기화
1) 동기화(Synchronization)의 개념
- 다수개의 Thread가 어떤 연관 관계를 가지고 병렬적으로 동작하게 됨
- 만약 동시에 한 파일을 처리한다면, 서로 결과값을 넣어 엉망진창의 결과가 나오게됨
- 동기화를 통해 Thread가 파일에 순차적으로 접근할 수 있음
- 하나의 쓰레드가 수행되는 동안, 다른 쓰레드에 의해 접근되지 못하게 해야함
- 파일에 대한 처리를 하는 부분은 한 순간에 하나의 Thread만 사용할 수 있는 영역이 되어야함 (임계영역이라고 함)
- Synchronized 예약어를 통해 동기화 처리 가능하며, 두 개 이상의 Thread가 하나의 자원을 공유하면서 작업을 진행할 때 자원을 보호하기 위해 사용함
	가) synchronized 예약어
		- 메서드 앞에 붙여서 메서드 자체를 동기화 함
		- 여러 Thread에 의해 특정 객체에 메서드들이 동시에 호출되는 것에 대해 잠금(lock)을 설정하는 기능을 가지고 있음
		- 호출된 메서드들 중 하나가 호출되면 그 객체 정보에 대해 잠금(lock)을 설정해서 이 호출이 완료될 때까지 잠금 상태가 유지됨
2) Thread 사이의 통신
- 두 개 이상의 Thread가 서로 협력하며 공유 자원을 사용하도록 하는 것
- wait()와 notify() 메서드를 주로 이용함
  가) wait() 메서드
	- Thread A가 공유 자원 객체를 통하여 synchronized 메서드를 호출하면 객체가 가지고 있는 모니터링 락을 획득하고 메서드를 실행, 
	- 실행 중 wait()메서드가 호출되면 wait pool로 들어가며 모니터링 락 반환
	- 그후 Thread B가 메서드를 실행을 통해 모니터링 락을 획득하고 실행상태가 됨
  나) notify() 메서드
    - 메서드 중 notify()메서드가 실행되면 wait pool에서 쓰레드 하나가 빠져나옴
    - 하지만 바로 실행하지 않고 실행 가능 상태가 되는데, notify() 메서드를 호출한  쓰레드가 여전히 실행상태에 모니터링 락을 소유하고 있기 때문이다.
    - 빠져나온 쓰레드는 synchronzied blocking 상태가 되어 모니터링 락이 반환될 때 까지 기다린다.
    - 메서드가 종료된 후, 반환된 후 모니터링락을 다시 획득하고 wait() 메서드 이후의 명령을 수행함
  다) notifyAll() 메서드
    - 빠져 나오는 Thread가 무엇인가를 가정하고 코드를 작성하는 것은 매우 위험한 상황을 발생시킬 수 있음(상황에 따라 다르기 때문이다.)
    - 2개 이상의 Thread를 사용할 경우 모든 Thread를 notifyAll()을 통하여 wait pool에서 꺼내어 놓고 같은 조건에서 다시시 작하도록 작성하는게 낫다.
> synchronized, wait(), notify()를 이용해 안전하게 작성된 코드(MailBox.java)
```java
class MailBox {
	private String message;
	private boolean request;
	
	public synchronized void storeMessage(String message) {
		while (request == true) {
			try {
				wait(); // synchronized lock을 해제한다.
			} catch (InterruptedException e) {
			}
		}
		request = true;
		this.message= message;
		notify(); // wait 상태에 들어가 있는 다른 Thread를 깨운다.
	}
	public synchronized String retriveMessage() {
		while (request == false) {
			try {
				wait();
			} catch ( InterruptedException e) {			
			}
		}
	}
}
```
> 숫자를 생성하여 저장하는 생산자 Thread 프로그램 (Producer.java)
```java
public class Producer extends Thread {
	private Buffer buffer;
	
	public Producer(Buffer buffer) {
		this.buffer = buffer;
	}
	
	public void run() {
		for (int i = 0;, i < 10; i++) {
			// 생산자 쓰레드는 put() 메서드를 호출한다.
			buffer.put(i);
			try {
				sleep((int) Math.random() * 100);
			} catch (InterruptedExceptioin e) {
				e.printStackTrace();
			}
		}
	}
}
```
> 생성된 숫자를 꺼내서 소비하는 Thread 프로그램(Consumer.java)
```java
public class Consumer extends Thread {
	private Buffer buffer;
	
	public Consumer(Buffer buffer) {
		this.buffer = buffer;
	}
	
	public void run() {
		for (int i = 0; i < 10; i++) {
			// 소비자 쓰레드는 get() 메서드를 호출한다.
			buffer.get();
		}
	}
}
```
> wait()와 notify() (Buffer.java)
```java
public class Buffer {
	private int contents;
	private boolean flag = false;
	
	//버퍼에 데이터를 저장하는 메서드로서 동기화한다.
	public synchronized void put(int value) {
		if (flag == true) {
			try {
				wait();
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
		contents = value;
		flag = true;
		System.out.println("생상자 : 생산 " + contents);
		notifyAll();
	}
	// 버퍼에서 부터 데이터를 가져가는 메서드로서 동기화한다.
	public synchronzied void get() {
		if (flag == flase) {
			try {
				wait();
			} catch (InterruptedException e) {
				e.printStackTrace();
			}
		}
		System.out.println("소비자 : 소비" + contents);
		
		flag = false;
		notifyAll();
	}
}
```
> 생산자와 소비자 Thread 객체 테스트 (ProducerConsumerTest.java)
```java
public class ProducerConsumerTest P
	public static void main(String args[]) {
		Buffer buffer = new Buffer();
		Producer prod = new Producer(buffer);
		Consumer cons = new Consumer(buffer);
		prod.start();
		cons.start();
	}
```