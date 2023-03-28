---
title: JAVA 기본-java io 패키지
date: 2023-02-01 15:52:53 +0900
tags: HIDE CRUDE 
layout: obsidian
is_Finished: false
last_Reviewed: 2023-02-01 15:52:53 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# java io 패키지

## Java.io 바이트 입출력
### 입출력 개요 및 입출력 API
#### 입출력 개요
- 자바는 입출력 스트림을 통해 다양한 경로로의 입출력을 구현하는 일관된 방식을 제공
- 스트림은 순서가 있는 일련의 데이터를 의미
> 입출력 스트림의 개념

```Java
Source : 키보드, 파일, 네트워크 등의 데이터의 근원지
-> : input Stream: 근원지에서 흘러 들어오는 데이터 (read)
Program
-> : Output Stream: 목적지로 흘러가는 데이터 (write)
Destination : 모니터, 파일, 네트워크 등의 데이터의 목적지
```
1. 순차적인 데이터의 흐름으로 데이터의 무작위적인 접근이 불가능함
2. 단방향의 흐름으로 입력 스트림과 출력 스트림이 따로 존재
3. 모든 데이터의 입출력이 근원지, 목적지의 형태와 관계없이 일정한 형태로 전송됨
- 동일한 방법으로 프로그램지 작성될 수 있는 유연한 구조의 API를 가짐
- 자바는 입출력을 위해 스트림을 생성하고 다루는 클래스들을 java.io 패키지를 통해 제공

1) java.io 패키지
- 자바로 입출력 기능을 구현하는 프로그램을 개발하는 데 필요한 다양한 클래스를 포함함
- File 클래스 : 파일이나 폴더를 다루는 데 이용됨
- RandomAccessFile 클래스 : 파일에 무작위적인 접근을 가능하게 함
- 스트림 클래스 : 입출력 스트림을 가능하게 함
- 스트림 클래스의 계층 구조를 이해해야 됨
- 이중 Input, outputStream 쪽 계층이 바이트 단위 입출력 클래스
- 이중 Reader, Writer 쪽 계층이 캐릭터 단위 입출력 클래스

2) 스트림 클래스의 분류
가) 입출력 단위에 의한 분류
	1. 바이트 단위의 입출력 클래스 : byte, byte[]
	2. 캐릭터 단위의 입출력 클래스 : character encoding 과정을 거치며, Unicode인 char, char[], String 등으로 다룸
		- 서로 호환하지 않음
나) 데이터 이동 통로에 의한 분류
	1. 1차 스트림 클래스 : 데이터가 이동하는 통로를 직접 만듦
	2. 2차 스트림 클래스 : 이미 만들어져 있는 통로에 새로운 기능을 추가함

총 4가지의 경우의 수를 가지므로 4개의 분류를 가짐

> 입출력 스트림 클래스 들의 기능 예시

| 문자 스트림 클래스 | 설명                                                   | 바이트 스트림 클래스 |
| ------------------ | ------------------------------------------------------ | -------------------- |
| Reader             | 문자/바이트 입력 스트림을 위한 추상 클래스             | InputStream          |
| BufferedReader     | 문자/바이트 버퍼 입력, 라인 해석                       | BuffredReader        |
| InputStreamReader  | 바이트 스트림을 문자 스트림으로 변환                   | (none)               |
| FileReader         | 파일에서 바이트를 읽어들여 문자/바이트 스트림으로 변환 | FileInputStream      |
| FilterReader       | 필터 적용 문자/ 바이트 입력을 위한 추상 클래스         | FilterInputStream    |
| Writer             | 문자 출력 스트림을 위한 추상 클래스                    | OutputStream         |
| OutputStreamWriter | 문자 스트림을 바이트 스트림으로 변환                   | (none)               |
|                    | 기타 등등이 있다.                                      |                      |

3) File 클래스

- 파일과 디렉토리를 모두 표현하고 관리하는 클래스, 생성된 객체는 절대로 변경 불가 (추상 경로명)

- 파일의 존재, 복사, 파일 이름 변경 등을 처리할 수 있음,

- 파일의 데이터를 입출력하기 위한 메서드는 제공 하지 않음, 그것은 스트림 클래스를 기반으로 수행됨

> 파일 객체 생성하기 위한 생성자 (File 클래스 생성자)

| File 클래스의 생성자              | 설명                                                    |
| --------------------------------- | ------------------------------------------------------- |
| File(File parent, String child)   | parent 폴더의 child라는 파일에 대한 File 객체를 생성함  |
| File(String parent)               | parent에 해당되는 파일의 File 객체를 생성함             |
| File(String parent, String child) | parent 폴더의 child 라는 파일에 대한 File 객체를 생성함 |

> 파일클래스로부터 객체를 생성하는 일반적인 방법
```Java
// C:\Program Files 디렉토리에 해당하는 파일 객체 생성
File file = new File("C:\Program Files");
// 현재 작업 디렉토리에 해당하는 파일 객체 생성, ','은 현재 작업 디렉토리를 의미함
File file = new File(" . ");
// 현재 작업 디렉토리 밑에 위치한 파일에 대한 파일 객체 생성
File file = new File(" ./systemLog.log");
```
> File 클래스의 메서드

| File 클래스의 메서드     | 설명                                             |
| ------------------------ | ------------------------------------------------ |
| boolean delete()         | 파일이나 폴더를 삭제함(단, 폴더가 비어있어야 함) |
| boolean exists()         | 파일의 존재 여부를 리턴함                        |
| String getAbsolutePath() | 파일의 절대 경로를 문자열로 넘겨줌               |
| String getName()         | 파일이나 폴더의 이름을 넘겨줌                    |
| boolean isDirectory()    | 폴더인지 여부를 리턴함                           |
|                          | 기타 등등이 있다.                                |

> 현재 프로젝트의 src 디렉토리 밑에 있는 디렉토리와 파일 목록을 출력하는 프로그램 (DirTest.java)

```Java
import java.io.File;

public class DirTest {
	public static void main(String args[]) {
		File dir = new File("./src"); // 현재 작업중인 프로젝트의 src 디렉토리에 해당하는 File 객체를 생성함
		
		if (dir.isDirectory()) {
			String[] fileList = dir.list(0);
			for (int i = 0; i < file.List.Length; i++)
				System.out.println(fileList[i]);
		} else {
			System.out.println("File 객체는 폴더가 아니다.");
		}
		}
	}
}
```
### 바이트 스트림
#### 바이트 스트림
- 스트림 클래스: 입출력하는 데이터의 기본단위 기준, 두 스트림의 최상위 부모
- 바이트 스트림 : 8비트의 바이트를 읽고 쓰기 위한 스트림, 바이너리 형태의 데이터를 다루기 좋음
	- InputStream과 OutputStream이 최상위 부모임
- 문자 스트림 : 16비트 문자나 문자열들을 일고 쓰기 위한 스트림

- 모두 바이트 단위로 입출력을 수행한다는 공통적인 특징을 가지고 고유한 기능또한 가짐
- 어떤 클래스는 입출력 장치를 대상으로 직접 입출력을 하는 반면, 다른 클래스를 대상으로 입출력을 하는 클래스도 존재함,
- 따라서 두개 이상의 클래스를 연결하여 입출력 하는 경우가 일반적임
> 두 개 이상의 클래스 연결 입출력 예시
```Java
try {
	FileOutputStream output = new FileOutputStream("message.txt");
	BufferedOutputStream buffOutput = new BuffredOutputStream(output);
	bouffOutput(" Message Output... ");
} catch (IOException e) {
	e.printstackTrace();
}
```
1) InputStream
- 바이트 단위 입력 스트림의 최상위 클래스로 추상 클래스로 정의되어 있기 때문에 스스로 객체화 될 수 없음
- InputStream을 상속한 자식 클래스는 InputStream 클래스에 존재하는 모든 추상 메서드를 적절하게 Overiding 해야함
- InputStream 클래스를 상속한 자식 클래스의 객체를 생성하여 입력 관련 로직을 구현 가능

> InputStream 클래스의 주요 메서드

| InputStream 클래스의 메서드             | 설명                                                         |
| --------------------------------------- | ------------------------------------------------------------ |
| void close() throws IOException         | 입력 스트림을 닫음                                           |
| int read() throws IOException           | 입력 스트림에서 한 바이트를 읽어서 int 값으로 반환함 * 중요  |
| int read(byte buf[]) throws IOException | 입력 스트림에서 buf[] 크기만큼을 읽어 buf에 저장하고 읽은 바이트 수를 반환함 |
|                                         | 기타 등등                                                    |

			가) read() 메서드
			- 데이터를 읽어 들이는 기능을 제공
			- 입력 스트림에서 하나의 바이트를 읽어 들임
			- EOF를 만나면 -1을 반환하여 읽기 작업이 끝났다는 것을 알려줌
			
			나) read(byte[] buf) 메서드
			- 사용자가 지정한 byte[]를 이용해 한꺼번에 원하는 양을 읽어 들임
			- 일반적으로 available() 메서드를 사용해 스트림에서 읽을 수 있는 바이트 수를 읽은후 읽음
			
			EOF(end of File)이란? 
			- InputStream 에서 제공되는 read() 메서드는 리턴형이 int임,
			- 윈도우에서는 파일 끝을 나타내는 값을 -1로 표현
			- byte는 -128~127가지 표현, 하지만 양수를 기준으로 표현하므로 0 ~ 127까지만 표현 가능,
			- 더 큰 자료형(int)을 리턴으로 사용하여 0~255까지 표현과 -1을 처리하도록 하기 위해 정수형을 사용하는 것

2) OutputStream
- 바이트 단위 출력을 대표하는 최상위 클래스, 자식클래스가 상속받아서 그대로 사용하거나 재정의 

> OutputStream 클래스의 주요메서드

| OutputStream 클래스의 메서드              | 설명                             |
| ----------------------------------------- | -------------------------------- |
| void close() throws IOException           | 출력 스트림을 닫음               |
| void flush() throws IOException           | 버퍼에 남은 출력 스트림을 출력함 |
| void write(int i) throws IOException      | 정수 i의 하위 8비트를 출력       |
| void write(byte buf[]) throws IOException | buf의 내용을 출력함              |
| 기타 등등이 있다                          |                                  |

	가) write(int i) 메서드
	
	- 1바이트를 출력하는 메서드로, 메서드의 인자도 바이트가 아닌 정수형을 사용
 - wirte(int i) 메서드에는 세 개의 메서드가 Overloading 됨
    - 1. 인자로 byte[]를 사용
      2. 배열과 함께 시작위치 및 크기를 지정하는 메서드, 출력하고자 하는 배열의 지정된 위치에서 정해진 크기만큼 출력이 가능함
      3. 출력이 끝났음을 알려주는 flush() 메서드
         - 버퍼는 일종의 완충 지대로 입출력을 조금 더 빨리 할 수 잇게 도와줌
         - 모든 출력은 도착지점으로 바로 나가지 않고 먼저 버퍼에 쌓임
         - 버퍼에 데이터가 충분히 쌓인 후 flush() 명령을 받으면 현재 버퍼에 있던 모든 내용을 도착지점으로 내보내고 버퍼를 비워버림
         - flush() 메서드를 호출하지 않으면 버퍼로만 출력되기 때문에 실제로 도착 지점에서는 아무런 데이터를 받지 못하는 경우가 발생할 수 있음
- 보통 출력스트림에는 자동으로 flush() 메서드를 호출할 수 있는 기능을 제공 
#### 표준 입출력
- 표준 입력 : 사용자가 키보드를 통해 입력한 데이터를 읽어들이는 작업
- 표준 출력 : 프로그램의 수행 결과 메시지가 콘솔 창에 출력 되는 것
- java.lang 패키지의 System 클래스를 통해 제공함
- 모든 프로그램에서 기본으로 표준 입출력이 사용되기 위해 java.lang 패키지에서 제공
1) 표준 입력 (System.in)
- System 클래스에 in(type : InputStream 최상위, 추상)라는 클래스 변수로 제공됨
- System 클래스의 in 변수는 입력 스트림 객체를 참조하며, 이를 통해 키보드 입력을 처리 할수 있다. JVM이 메모리로 올라오면서 미리 객체로 생성해 높음, 바이트 단위 입력
- 변수의 타입은 InputStream 클래스지만, 실제 참조하는 객체는 InputStream의 자식 객체 임을 암시함, 자연스러운 형변환이 지원되므로 가능한 것임
- 영문과 한글의 처리를 분리하지 않으면 두 바이트가 합쳐져 이상할 때가 있음
System.in.read(); // 키보드 입력을 읽어 들이기 위한 구문
2) 표준 출력 (System.out)
- System.out.println() 메서드가 대표,
- printStream 타입으로 선언되어 있음, OutputStream 클래스의 후손 클래스
- Exception을 안전하게 처리하게끔 되어있으므로 try-catch 문 안써도 됨
- print와 println 메서드가 테이터 타입별로 overloading 되어 있음

#### 파일 입출력
1) FileInputStream 클래스
- InputStream 클래스를 상속한 자식 클래스로 하드 디스크 상에 존재하는 파일로부터 바이트 단위의 입력을 처리하는 클래스
- 스트림을 생성하는 클래스 : 데이터 출발지점과 도착지점을 잇는 통로를 만드는 역할
- 생성자의 인자로 File 객체를 주거나 파일의 이름을 직접 String 형태로 줄 수 있음
> FileInputStream의 생성자

| FileInputStream의 생성자                                     | 설명                                               |
| ------------------------------------------------------------ | -------------------------------------------------- |
| FileInputStream(String filepath) throws FileNotFoundException | filepath로 지정한 파일에 대한 입력 스트림을 생성함 |
| FileInputStream(File fileObj) throws FileNotFoundException   | fileObj로 지정한 파일에 대한 입력 스트림 생성      |

> FileInputStream의 메서드

| FileInputStream의 메서드                                     | 설명                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| int available() throws IOException                           | 현재 읽을 수 있는 바이트 수를 반환함                         |
| int close() throws IOException                               | 입력 스트림을 닫음                                           |
| int read() throws IOException                                | 입력 스트림에서 한 바이트를 읽어서 int 값으로 반환함         |
| int read(byte buf[]) throws IOException                      | 입력 스트림에서 buf 크기만큼을 읽어 buf에 저장하고 읽은 바이트 수를 반환함 |
| int read(byte buf[], int offset, int numBytes) throws IOException | 입력 스트림에서 numBytes만큼을 읽어 buf[]의 offset 위치부터 저장하고 읽은 바이트 수를 반환함 |
| int skip(long numBytes) throws IOException                   | numBytes로 지정된 바이트를 스킵하고 스킵된 바이트 수를 반환함 |

> FileInputStream을 이용한 입출력 프로그램 (FileInputStreamTest.java)

```Java
import java.io.FileInputStream;

public class FileInputStreamTest {
	public static void main(String[] args) throws Exception {
		int data;
		FileInputStream input = new FileInputStream("./src/FileInputStreamTest.java");
		while ((data = input.available()) > 0) { // 파일크기 알아봄
		
			byte[] bytes = new byte[data]; // 파일 크기만큼의 byte 배열 객체
			int result = input.read(bytes);// 데이터 읽어 들임
			if (result == -1)
				break;
			String str = new String(bytes);
			System.out.print(str);// 읽은 내용을 문자열로 변환해서 표준 출력
		}
		input.close();
	}
}
```

2) FileOutputStream 클래스

- OutputStream 클래스를 상속한 자식 클래스로 하드 디스크 상에 존재하는 파일로부터 바이트 단위의 출력을 처리하는 클래스

- Sink 스트림의 일종으로 3개의 생성자가 Overloading 되어있으며, FileInputStream의 생성자보다 하나 더 많음 : append 처리를 위한 논리 변수를 인자로 가짐,

- true로 설정되면 기존에 존재하고 있는 파일의 가장 뒷부분에 데이터를 연결하여 출력

  > FileOutputStream의 생성자

  | FileInputStream의 생성자                                     | 설명                                                         |
  | ------------------------------------------------------------ | ------------------------------------------------------------ |
  | FileOutputStream(String filepath) throws IOException         | filepath로 지정한 파일에 대한 출력 스트림을 생성함           |
  | FileOutputStream(File fileObj, Boolean append) throws IOException | 지정한 파일로 출력 스트림을 생성함, append 인자로 출력할 때 append 모드를 설정함 |
  | FileIOutputStream(File fileObj) throws IOException           | fileObj로 지정한 파일에 대한 출력 스트림 생성                |

> FileOutputStream의 메서드

| FileOutputStream의 메서드                                    | 설명                                           |
| ------------------------------------------------------------ | ---------------------------------------------- |
| void close() throws IOException                              | 출력 스트림을 닫음                             |
| void flush() thorws IOException                              | 버퍼에 남은 출력 스트림을 출력함               |
| void write(int i) throws IOException                         | 정수 i의 하위 8비트를 출력함                   |
| void write(byte buf[]) throws IOException                    | buf의 내용을 출력함                            |
| void write(byte buf[], int index, int size) throws IOException | buf의 index 위치부터 size만큼의 바이트를출력함 |

> FileInpuStream과 FileOutputStream을 이용한 파일을 복사하는 프로그램(FileCopyTest.java)
```Java
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class Test {
	public Static void main(String[] args) throws IOException {
		FileInputStream input = null;
		FileOutputStrema output = null;
		// 파일 입출력을 위해 Fileinput,outputstream 객체를 생성	
		input = new FileInputStream("./src/artifacts.xml");
		output = new FileInputStream("./src/copy.xml", false);
		int size =input.availavle();// 파일에서 읽어 들일 수 잇는 가용량을 파악할 수 있으므로 파일을 통째로 읽을 수 있음
		byte[] buff = new byte[size];
		long start = System.currentTimeMillis();
		
		int readCount = input.read(buff);
		output.write(buff, 0, readCount);

		long end = System.currentTimeMillis();
		System.out.println("파일 복사에 걸린 시간 : " + (end - start) + "ms(초)");
		input.close();
		output.close();		
	}
}
```
3) 버퍼를 이용한 파일 입출력
- 기계적인 동작의 횟수를 줄이면 프로그램의 효율을 높이고 더 빠른 프로그램으로 개선할 수 있음, 1바이트씩 읽는 read() < 한꺼번에 많은 데이터를 배열로 읽는 read(byte[])
- 버퍼의 크기가 작으면 작을 수록 효율이 떨어짐, 메모리의 낭비나 부족이 유발됨
- 2의 배수 (POT(Power of two))로 준비하는 것이 이상적
- BufferedInputStream과 BufferedOutputStream 2차 스트림 클래스를 이용하면 일일이 버퍼를 지정하지 않고 편리하게 쓸 수 있음
- 2차 스트림 클래스는 스티림 없이도 객체 생성 가능한 FIleInputStream 같은 1차 스트림과 달리 미리 만들어진 스트림을 생성자의 인자로 받아들여 객체를 생성해야함
- 1차 스트림은 도로, 2차 스트림은 도로 + 차로 + 신호등 등
- BufferedInputStream의 read()메서드를 수행하면 스스로 버퍼를 준비하고 1바이트 씩 시스템 버퍼에서 읽음
- BufferedOutputStream 또한, 1바이트씩 시스템 버퍼에 출력하고 flush() 함,
- 내부적으로 1바이트씩 읽고 쓰는 모든 작업이 내부적으로 버퍼를 대상으로 일어나므로 전체적인 버퍼와 파일 간에 입출력 성능 향상됨
> BufferedInputStream의 BufferedOutputStream 이용한 파일을 복사하는 프로그램(BufferedFileCopyTest.java)
```Java
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

public class BufferedFileCopyTest {
	public Static void main(String[] args) throws IOException {
		FileInputStream input = null;
		BufferedInputStream buffInput = null;
		FileOutputStrema output = null;
		BufferedOutputStream buffOutput = null;
		
		input = new FileInputStream("./src/artifacts.xml");
		buffInput = new BufferedInputStream(input);
		output = new FileInputStream("./src/copy.xml", false);
		buffOutput = new BufferedOutputStream(input);
// bufferdStream 객체 결합

		long start = System.currentTimeMillis();
        int ch = 0;
		while ((ch = buffInput.read()) != -1) {
			buffOutput.write(ch);
		}
		long end = System.currentTimeMillis();
        buffInput.close();
        input.close();
        buffOutput.close();
		output.close();
		System.out.println("파일 복사에 걸린 시간 : " + (end - start) + "ms(초)");
	}
}
```
## java.io 문자 입출력
### 캐릭터와 인코딩
#### ASCII 코드와 한글
1) ASCII 코드
- 출력 데이터는 일반적으로 문자열을 사용함, 인코딩이 중요
- 영어 입출력은 문제가 없지만 다른 문자를 사용하는 나라에서 자국의 언어로 입출력하면 각 나라의 언어를 표현하는 인코딩이 다르기 때문에 문제가 생김
- 영어권은 대략 120개 안팎의 문자가 문자열을 위해 필요함, 2^7개 정도이며, 이 문자들을 7비트 로 표현한 것이 ASCII 코드라고 함
- 7비트 + 1비트(유럽 특수한 문자 몇개 추가)한것은 Latin-1,
- Extended ASCII : 128~255의 빈 공간을 사용함, 우리나라의 한글을 표현할 때도 이 공간을 사용하여 표현함
2) 한글 표현
- 초성 (14 + 겹자음 5), 중성 (10 + 복모음 11개), 종성(기본자음 14개, 겹자음 2개, 복잡음 11개, 받침없는경우 1개) 각 5비트씩 총 15비트가 있어야 하나의 한글 표현 가능
- 한글 한 글자는 Extended ASCII를 사용하여 빈 공간을 쓰면 표현할 수 있지만 1바이트로는 표현 불가능, 2바이트를 묶어서 한글자를 표현 (Multi Byte Character Set)
- 그래서 첫비트가 0인 경우, 1바이트를 읽어 영어로 인식함
-  한글은 첫비트가 1인 경우, 2바트를 읽어서 첫비트를 때내고, 5비트씩 나누어 초성, 중성, 종성으로 대응해 한글로 인식 (KSC5601 = EUC-KR = MS949(window OS))
-  각 나라별로 자신만의 고유한 언어를 표현하기 위해 Extende ASCII를 사용함
-  전 세계의 데이터가 서로 다르게 해석되는 것을 막기위해 국제 표준 인코딩이 제안됨

#### 유니코드와 UTF
- 같은 바이트를 어떻게 해석하느냐에 따라 표시되는 문자가 다름
- 동일한 바이트 데이터라도 어떻게 해석하는가에 따라 전혀 다른 형태로 인식됨
- IOS에서 표준화 작업 진행, 1바이트 기준 ASCII 코드에서 2바이트 기준 새로운 인코딩
- 한글은 유니 코드의 65536개의 공간중에 0xAC00에서 시작해서 11172자만큼 공간차지
- 사전의 순서에 입각하여 모든 글자가 차례대로 나열됨, 유니코드 2.0때 모든 한글이포함
- 전세계 26개 언어가 모두 포함되어 있음, 어떤 나라에서도 같은 데이터를 공유
- 자료를 공유하는 표준으로 사용할 수 있음,
- 같은 한글이라도 유니코드이냐 아스키이냐에 따라 전혀 다른 바이트 데이터를 가짐
1) UTF-8
- 유니코드가 생기면서 갑자기 ASCII 기준 파일 보다 2배의 데이터 공간이 필요해짐
- 이를 위해 낭비를 줄이기위한 해석방법으로 UTF-8 나옴
- UTF-8은 가변 길이를 지원하는데 각 언어별로 최적화된 크기로 저장할 수 있도록 1 ~ 3바이트까지 표현이 달라짐, (영문은 1마이트 한글은 3바이트로 표현)
- 바이트 데이터의 값과 그 값이 해석된 인코딩이 서로 맞아 떨어질때 글자가 나타남
- 바이트 데이터를 기준으로 문자를 만들어 낼때 인코딩을 적용해서 문자로 변환함
2) String과 인코딩
- 자바에서 글자가 깨지면 getBytes()로 분해 후, 새로운 인코딩 해석을 지정한 생성자로 String 객체를 만들어 출력하여 해결될때 까지 다른 인코딩을 적용하여 해결
> 자바의 문자열을 이용한 인코딩 변환 출력(EndodingTest.java)
```Java
public class EncodingTest {
	public static void main(String[] args) throws Exception {
		String str = "가나다똠, 펲, 믜, 븨, 뮹, 헿, 뷁";// 다양한 문자열 생성
		// 다양한 인코딩 적용하여 byte 배열 객체 생성
		byte[] defaultBytes = str.getBytes();
		byte[] eucBytes = str.getBytes("euc-kr");
		byte[] ksc5601Bytes = str.getBytes("ksc5601");
		byte[] uniBytes = str.getBytes("unicode");
		byte[] utf8Bytes = str.getBytes("utf-8");
		byte[] latinBytes = str.getBytes("8859_1");
		// 인코딩된 문자열을 화면에출력함
		System.out.println("기본 인코딩으로 조합 : " + new String(defaultBytes));
		System.out.println("euc-kr로 조합 : " + new String(eucBytes, "euc-kr"));
		System.out.println("ksc5601으로 조합 : " + new String(ksc5601Bytes, "ksc5601"));
		System.out.println("unicode로 조합 : " + new String(uniBytes, "unicode"));
		System.out.println("utf-8으로 조합 : " + new String(utf8Bytes,"utf-8"));
		System.out.println("8859_1로 조합 : " + new String(latinBytes, "8859_1"));
		// 결과값으로 기본 인코딩, 유니코드, utf-8을 제외한 나머지는 이상한 글자
	}
}
```
### 문자 스트림
#### 문자 스트림 개요
1) 문자 스트림 계층 구조
- 16비트 문자나 문자열들을 읽고 쓰기 위한 Reader/Writer의 자식클래스 스트림이다
- 문자 입출력 스트림은 영어 이외의 문자에 대한 처리와 문자 인코딩을 내부에서 처리해줌
- 유니코드를 지원하는 자바 특성에 맞게 2바이트 크기의 입출력을 함
- 이를 통해 효율적이고 특별한 문자 인코딩에 독립적인 프로그램을 작성할 수 있음
- 문자 스트림 클래스 들은 문자 단위로 입출력을 수행함, 클래스들만의 특수 기능도 가짐
> 입출력 스트림을 이용한 소스코드의 예
```Java
try{
	FileWriter fw = new FileWriter("test");
	printWriter pw = new PrintWriter(fw);
	pw.println("abc");
	pw.println('가');
	pw.close();
	fw.close();
}catch(IOException e) { }
```
#### 문자 스트림 클래스

1) Reader/ writer

- 문자 입출력을 담당하는 추상 클래스, 다른 문자 입출력 클래스들에 대한 최상위 클래스
- InputStream/ OutputStream과 사용법이 유사함

> Reader 클래스의 주요 메서드

| Reader 클래스의 메서드                   | 설명                                                         |
| ---------------------------------------- | ------------------------------------------------------------ |
| abstract void close() throws IOException | 문자 입력 스트림을 닫음                                      |
| int read() throws IOException            | 문자 입력 스트림에서 단일 문자를 읽음                        |
| int read(char buf[]) throws IOException  | 문자 입력 스트림에서 buf[] 크기만큼을 읽어 buf에 저장하고 읽은 문자수를 반환함 |
| 기타 등등이 있다.                        |                                                              |

> Writer 클래스의 주요 메서드

| Writer 클래스의 메서드                    | 설명                             |
| ----------------------------------------- | -------------------------------- |
| abstract void close() throws IOException  | 문자 출력 스트림을 닫음          |
| abstract void close() throws IOException  | 버퍼에 남은 출력 스트림을 출력함 |
| int read(char buf[]) throws IOException   | 주어진 문자열 s를 출력함         |
| void write(char buf[]) throws IOException | buf의 내용을 출력함              |
| 기타 등등이 있다.                         |                                  |

2) FileReader/FileWriter

- 파일에 저장된 바이트를 유니코드 문자로 변환해서 읽어 들이거나 출력할 유니코드 무자를 디폴트 문자 인코딩의 바이트로 변환해서 파일에 저장하는데 사용되는 입출력 클래스
- 각각 InputStreamReader나 OutputStreamWriter의 자식 클래스로, 유니코드 문자와 바이트 간의 변환 기능을 포함하고 있음
  가) FileReader
  - 파일로부터 입력을 위한 스트림을 생성하는 클래스
  - 데이터가 입력될 파일의 정보를 인자로 하는 생성자를 가짐

> FileReader의 생성자

| FileReader의 생성자                                      | 설명                                               |
| -------------------------------------------------------- | -------------------------------------------------- |
| FileReader(String filepath) throws FileNotFoundException | filepath로 지정한 파일에 대한 입력 스트림을 생성함 |
| FileReader(String fileObj) throws FileNotFoundException  | fileObj로 지정한 파일에 대한 입력 스트림을 생성함  |

```
나) FileWriter
- 파일로 데이터를 출력하기 위한 출력 스트림을 제공함
- 출력할 파일에 대한 정보를 인자로 하는 생성자를 가짐
```

> FileWriter의 생성자

| FileWriter의 생성자                                          | 설명                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| FileWriter(String filepath) throws IOException               | filepath로 지정한 파일에 대한 출력 스트림을 생성함           |
| FileWriter(String fileObj, boolean append) throws IOException | 지정한 파일로 출력 스트림을 생성한다. append 인자로 출력할 때 파일에 대한 append 모드를 설정함 |
| FileWriter(File fileObj) throws IOException                  | fileObj로 지정한 파일에 대한 출력 스트림을 생성함            |

- 2번째 생성자의 append 설정을 하면 출력 파일을 덮어쓰는 것이 아니라 기존의 데이터 뒤에 추가로 출력함

> FileWriter를 이용하여 파일 내용을 복사하기 (FileWriterTest.java)

```Java
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;

public class FileWriterTest {
	public static void main(String[] args) {
        try {
            	FileReader reader = new FileReader("./src/FileWriterTest.java");
            	FileWriter writer = new FileWriter("./src/FileCopy.java");
            	//현재 작성중인 파일로부터 데이터를 읽어들이는 FileReader 객체와 읽어들인 데이터를 FileCopy.java 파일에 출력하는 FileWriter객체를 생성함
            	int ch = 0;
            	while ((ch = reader.read()) != -1) {
                    	writer.write((char) ch);
                }
            	reader.close();
            	writer.close();
        }
    }
}
// src 폴더에 FileCopy.java 파일이 복사되어 생성됨
```

3) BufferedReader / BufferedWriter

- BufferedInputStream 및 BufferedOutputStream과 동일하게 입출력 스트림에 버퍼 기능을 추가한 문자 스트림임
- 문자 입력 스트림으로부터 문자를 읽어 들이거나 문자 출력 스트림으로 문자를 내볼낼 때 버퍼링을 함으로써 문자, 문자 배열, 문자열 라인 등을 보다 효율적으로 처리할 수 있도록 함
- 문자 입출력 스트림을 사용하면 한 문자씩 읽지만, 버퍼링 기능을 추가하게 되면 입출력 스트림으로부터 미리 버퍼에 데이터를 갖다 놓기 때문에 보다 효율적으로 입출력이 가능함

> BufferedReader의 생성자

| BufferedReader의 생성자             | 설명                                                         |
| ----------------------------------- | ------------------------------------------------------------ |
| BufferedReader(Reader in)           | 주어진 문자 입력 스트림 in에 대해 기본 크기의 버퍼를 갖는 객체를 생성함 |
| BufferedReader(Reader in, int size) | 주어진 문자 입력 스트림 in에 대해 size 크기의 버퍼를 갖는 객체를 생성함 |

> BufferedReader의 메서드

| BufferedReader의 메서드                                   | 설명                                                         |
| --------------------------------------------------------- | ------------------------------------------------------------ |
| int read() throws IOException                             | 한 문자를 읽어서 리턴함                                      |
| int read(char buf[], int off, int len) throws IOException | 문자 입력 스트림에서 len만큼을 읽어 buf[]의 off위치에 저장하고 읽은 문자 수를 반환함 |
| String readLine()                                         | 한 줄을 읽어서 리턴함                                        |

> BufferedWriter의 생성자

| BufferedWriter의 생성자              | 설명                                                         |
| ------------------------------------ | ------------------------------------------------------------ |
| BufferedWriter(Writer out)           | 주어진 문자 출력 스트림 out에 대해 기본 크기의 버퍼를 갖는 객체를 생성함 |
| BufferedWriter(Writer out, int size) | 주어진 문자 출력스트림 out에 대해 size 크기의 버퍼를 갖는 객체를 생성함 |

> BufferedWriter의 메서드

| BufferedWriter의 메서드                                     | 설명                                                         |
| ----------------------------------------------------------- | ------------------------------------------------------------ |
| int newLine() throws IOException                            | 줄을 바꿈                                                    |
| void write(char buf[], int off, int len) throws IOException | 주어진 문자 배열 buf[]의 off 위치부터 len만큼의 문자를 출력함 |
| void write(String s, int off, int len) throws IOException   | 주어진 문자열 s의 off 위치부터 주어진 길이 len 만큼의 문자를 출력함 |

4) InputStreamReader/OutputStreamWriter

- 바이트 스트림에서 문자 스트림으로, 또는 반대로의 변환을 제공하는 입출력 스트림
- 바이트를 읽어서 지정된 문자 인코딩에 따라 문자로 변환하는데 사용함
- 문자로 변환하는 경우 인코딩 방식은 특정 방식으로 지정할 수도 있고 경우에 따라서는 플랫폼의 기본 인코딩을 이용하기도 함
> InputStreamReader의 생성자

| InputStreamReader의 생성자                    | 설명                                                         |
| --------------------------------------------- | ------------------------------------------------------------ |
| InputStreamReader(InputStream in)             | 주어진 입력 바이트 스트림 in에 대해 기본 인코딩을 사용하는 객체를 생성함 |
| InputStreamReader(InputStream in, String enc) | 주어진 입력 바이트 스트림 in에 대해 enc 문자 인코딩을 사용하는 객체를  생성함 |

> InputStreamReader의 주요 메서드

| InputStreamReader의 주요 메서드 | 설명                                              |
| ------------------------------- | ------------------------------------------------- |
| String getEncoding()            | 현재 사용하고 있는 문자 인코딩의 표준 이름을 얻음 |

> OutputStreamReader의 생성자

| OutputStreamWriter의 생성자                      | 설명                                                         |
| ------------------------------------------------ | ------------------------------------------------------------ |
| OutputStreamWriter(OutputStream out)             | 주어진 출력 바이트 스트림 out에 대해 기본 인코딩을 사용하는 객체를 생성함 |
| OutputStreamWriter(OutputStream out, String enc) | 주어진 출력 바이트 스트림 out에 대해 enc 문자 인코딩을 사용하는 객체를  생성함 |

> OutputStreamWriter의 주요 메서드

| OutputStreamWriter의 주요 메서드 | 설명                                              |
| -------------------------------- | ------------------------------------------------- |
| String getEncoding()             | 현재 사용하고 있는 문자 인코딩의 표준 이름을 얻음 |

> InputStreamReader를 이용해서 표준 입력된 바이트 스트림을 문자 스트림으로 변환(InputStreamReaderTest.java)
```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

public class InputStreamReaderTest {
    	public static void main(String[] args) {
            try {
                	InputStream in = System.in;
                	//키보드로 입력한 데이터를 읽기 위해 표준 입력 스트림을 얻음
                	InputStreamReader reader = new InputStreamReader(in);
                	//InputStream 객체를 인자로 하여 InputStreamReader 객체를 생성함
                	BufferedReader buffReader = new BufferedReader(reader);
                	//InputStreamReader 객체를 인자로 하여 BufferedReader 객체를 생성함
                	System.out.println("<이름을 입력하세요. >");
                	String name = buffReader.readLine();
                	// readLine() 메서드를 이용해 라인 단위로 사용자가 입력한 데이터를 읽어들임
                	System.out.println("< 전화번호를 입력하세요. >");
                	String phone = buffReader.readLine();
                	
                	buffReader.close();// 입력작업이 완료되면 입력 스트림 닫음
                	reader.close();
                	in.close();
                	System.out.println(name + " 님의 전화번호 : " + phone);
            }
        }
}
// 결과값 : 홍길동, 홍길동 님의 전화번호 : 010-1234-5678
```
5) PrintStream/PrintWriter

- 데이터를 표준 출력하기 위해서 사용하는 스트림 클래스
	가) PrintStream
		- System.out.println()의 out 객체는 PrintStream 유형의 객체임
		- 1.1 부터 시스템의 기본 인코딩 방법으로 문자를 바이트로 변환할 수 있게됨
    나) PrintWriter
    	- 문자스트림으로 유니코드와 로컬 컴퓨터의 문자 인코딩 간의 변환을 처리해줌
    	- 유니코드에 더욱 효율적
> PrintWriter의 생성자

| PrintWriter의 생성자                            | 설명                                                         |
| ----------------------------------------------- | ------------------------------------------------------------ |
| PrintWriter(OutputStream stream)                | OutputStream 객체를 인자로 출력 스트림을 생성함              |
| PrintWriter(OutputStream stream, boolean flush) | OutputStream 객체를 인자로 출력 스트림을 생성함, flush 값이 true 면 자동으로 flush() 메서드가 호출됨 |
| PrintWriter(Writer writer)                      | Writer 객체를 인자로 출력 스트림을 생성함                    |
| PrintWriter(Wirter writer, boolean flush)       | Writer 객체를 인자로 출력 스트림을 생성함, flush값이 true면 자동으로 flush() 메서드가 호출됨 |

- 다른 스트림과 달리 IOException을 던지지않음 출력 에러가 발생하면 flag를 설정해 객체 내부에 기록
- 에러가 발생했는지 알기 위해  checkError()메서드를 사용하여 검사할 수 있음
- 에러가 발생하면 true를 반환함

> 사용 예
```java
System.out.println("Hello, World!");
If (System.out.checkError())
```

> 특정 파일에 표준입력 메시지를 출력하는 프로그램 (PrintWriterTest.java)
```java
import java.io.BufferedReader;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;

public class PrintWriterTest {
	public static void main(String args[]) throws IOException {
		InputStream in = System.in;
		// 표준 입력 스트림과 InputStreamReader를 이용해 키보드로부터 라인 단위로 데이터를 읽어들이는 BufferedReader 객체를 생성함
		InputStreamReader inReader = new InputStreamReader(in);
		BufferedReader reader = new BufferedReader(inReader);
		
		//message.txt 파일에 메시지를 출력하기 위해서 FileOutputStream 과 PrintWriter를 결합하여 출력 스트림을 생성함
		FileOutputStream output = new FileOutputStream("./src/message.txt");
		PrintWriter writer = new PrintWriter(output, true);
		//키보드로부터 입력한 데이터를 출력 스트림을 통해 message.txt 파일에 출력
		System.out.println("[저장할 메시지를 입력하세요.]");
		String msg = null;
		
		while((msg = reader.readLine()) != null) {
			writer.println(msg);
		}
		reader.close();
		inReader.close();
		in.close();
		writer.close();
		output.close();
	}
}
```
6) Scanner 클래스
- Scanner 클래스는 io 패키지에서 제공하는 클래스는 아니지만 표준 입력 스트림으로부터 데이터를 읽어 들일 수 있는 클래스임
- Scanner 클래스를 이용하면 키보드 입력 같은 표준 입력 작업을 단순하게 처리할 수 있음
> Scanner 클래스를 이용한 표준 입력 처리(ScannerTest.java)
```java
// 앞선 예제를 더욱 간단하게
import java.io.InputStream;
import java.util.Scanner;

public class ScannerTest {
	public static void main(String[] args) {
		InputStream in = System.in;
		Scanner keyboard = new Scanner(in);
		//표준 입력 스트림을 이용해 키보드로부터 데이터를 읽어 들이는 Scanner 객체를 생성함		
		System.out.println("< 이름을 입력하세요. >");
		String name = keyboard.nextLine();
		// Scanner를 이용하여 키보드로 입력한 데이터를 라인 단위로 읽어서 name, phone 변수에 각각 저장함
		System.out.println("< 전화번호를 입력하세요. >");
		String phone = keyboard.nextLine();
		// 읽기 작업이 종료되면 객체를 닫고 표준 출력함
		keyboard.close();
		System.out.println(name + " 님의 전화번호 : " + phone);
	}
}
```