---
title: JAVA 기본-java net 패키지
date: 2023-02-01 15:53:43 +0900
tags: HIDE CRUDE 
layout: obsidian
is_Finished: false
last_Reviewed: 2023-02-01 15:53:43 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# java net 패키지

## java.net 패키지
### 네트워크 기본 개념
#### 네트워크란
1) 네트워크(Network)와 네트워킹(Networking)
- 네트워크:지역으로 분산된 위치에서 컴퓨터 시스템 간에 데이터 통신을 하기위한 디바이스 및 소프트웨어 집단, 통신경로들에 의해 상호 연결된 일련의 지점들이나 노드들을 의미
- 디바이스란, 컴퓨터뿐 아니라 프린터, 휴대폰, 웹서버 등 다양한 형태로 존재함
- 특정 서비스를 제공해주는 다양한 디바이스들이 네트워크로 연결되어 잇고, 서비스 이용자가 네트워크를 통해 서비스를 검색하고 이용할 수 있음
- 네트워킹이란, 네트워크에 연결된 디바이스들 간의 데이터 교환을 의미함
2) 프로토콜(Protocol)
- 일종의 통신규약으로, 컴퓨터 간에 통신을 하기 위한 약속과 절차를 의미함
- 데이터 통신에서는 통신 장치 간의 데이터 교환에 필요한 모든 규약의 집합체
	가) 물리적 측면
	- 데이터 전송에 사용되는 전송 매체, 접속용 커넥터 및 전송신호
	나) 논리적 측면
	- 데이터의 표현, 의미와 기능, 데이터 전송절차
- 서로 다른 부호체계를 사용하는 장치간의 원활한 통신을 위해서 부호의 일치는 필수적
- 전송하는 데이터 형식, 신호의 코딩방식, 신호의 전기적 특성, 데이터 흐름 제어 등은 약속을 철저하게 준수하지 않으면 근본적으로 통신이 이루어질 수 없음
3) 패킷(Packet)
- 대부분의 프로토콜은 데이터를 전송할때 데이터를 주로 1024비트씩 여러개를 보내서 데이터 묶음을 만들어서 보낸다. 이를 패킷이라고 한다. 내부에 에러 검사용 정보를 보냄,
- 어느 패킷에서 에러가 발생했는지 알 수 있으므로, 오류가 나면 해당 묶음만 다시 전송
- 패킷의 구성은 두 가지로 이루어진다, 헤더와 바디
	1. 헤더(Header) : 송신자와 수신자의 주소 정보, 패킷이 손상되지 않았음을 보장하기 위한 checksum, 네트워크로 전송할 때 필요한 기타 유용한 정보 포함
	2. 바디(Body) : 바이트 그룹으로 묶인 전송할 데이터 (01001001100...)
- 많은 데이터를 하나의 패킷으로 묶으므로 매우 효율적이고 빠름
4) OSI 7계층
- 오늘 날의 네트워크 구조는 OSI 7 계층을 기초로 하여 네트워크 장비끼리 서로 표준적인 연결을 할 수 있도록 틀을 제공하기 위함, 표준 설정
- 덕분에 개방형 시스템 환경에서 어떤 장비라도 상호 정보 처리가 가능하게 됨, 네트워크의 프로토콜을 분리함으로써 프로토콜이 단순해져, 관리가 쉬워지고 좀 더 유연한 구조가 됨
> OSI 7계층

| 7계층 | 애플리케이션 계층(NFS,FTP,HTTP), Format                      |
| ----- | ------------------------------------------------------------ |
| 6계층 | 프레젠테이션 계층(XDE, XML, ASCI, Java Serialization) Encryption, Compression |
| 5계층 | 세션 계층(Sun RPC, DCE RPC, IIOP, RMI), Authentication       |
| 4계층 | 트랜스포트 계층 (TCP, UDP, Port),  End to end Connection     |
| 3계층 | 네트워크 계층(IP, ICMP, ARP), Logical Addressing             |
| 2계층 | 데이터 링크 계층(Wire formats for messages), Physical Addressing |
| 1계층 | 물리 계층(Wires. signaling)                                  |

- 1계층 : 노드 간 네트워크 통신을 위한 최저수준의 계층, 상위 계층 데이터 링크 계층에서 형성된 데이터 패킷을 전기 신호나 광신호로 바꿔 송수신하는 역할을 담당, 주로 하드웨어나 드라이버 개발자들이 C 언어로 다룸, Reapeater, NIC,Fieber 등 (하드웨어 계층)
- 2계층 : 네트워크 계층으로부터의 메시지를 비트로 변환해서, 물리 계층이 전송할 수 있게 함, 메시지를 데이터 프레임의 포맷으로 만들고, 수신지와 발신지 하드웨어 주소를 포함하는 헤더를 추가함 (Mac), switch (kernel 계층)
- 3계층: 다른 장소에 위치한 두 시스템 간의 연결성과 경로 선택을 제공함, 라우팅 프로토콜을 사용하여 서로 연결된 네트워크를 통한 최적의 경로를 선택하며, 선택된 경로를 따라 정보를 보냄, Router (Kernel 계층)
- 4계층: 하위 계층 4개는 데이터전송과 관련있음, 데이터 전송서비스 제공, 네트워크 내에서 신뢰성있는 서비스를 제공하기 위해 가상 회로 구축, 유지와 종료, 전송 오류 검출과 복구, 그리고 정보 흐름 제어의 절차를 제공, Load Balancer (Kernel 계층), 여기서부터 7계층까지 필수 존재 안해도 됨
- 5계층: 애플리케이션 간 세션을 구축하고 관리하며 종료시키는 역할, 프레젠테이션 계층 사이의 통신을 동기화 시키며 데이터교환을 관리함, Token, Socket 등( User Application 계층)
- 6계층 : 한 시스템의 애플리케이션에서 보낸 정보를 다른 시스템의 애플리케이션 계층에서 읽을수 있게 함,SSL, GIF, TLS (User Application 계층)
- 7계층 : 사용자와 컴퓨터가 통신하는 곳, 통신하고자 하는 상대를 식별, 확보하는 역할, 통신을 위한 충분한 자원을 가졌는지 판단하기도 함, HTTP, FTP, Telnet( User Application 계층)

> 대략적인 택배 운송과 네트워크 비교

```
IP, port,mac : 일종의 고유 주소(택배주소)

같은 동네에 속한 연결 : LAN,

다른 동네에 속한 연결 : WAN(subnet 마스크가 다름 (ip, ip 앞에 3개는 LAN일 경우 같음, 맨마지막으로 붙는것은 개별마다 다름))

L2 switch : mac주소를 확인해서 외부로 보내는지 내부로 돌리는지 확인 (내부로 갈꺼면 lan, 외부로 갈꺼면 wan)

L1 : 각 router나 switch를 확인하지 않고 가기로 한길만 왕복(허브별 택배운송)

L3 Router: IP를 확인하여 다른 라우터나 스위치로 보낼지 확인 
```



#### 프로그램 관계 모델

1) 클라이언트/서버 모델
- 두 개의 프로그램 사이의 관계를 나타내는 현재 네트워크 컴퓨팅의 중심 개념
- 서비스 제공자와 서비스 수요자가 명확하게 구분되며, 서버가 클라이언트에게 일방적 서비스를 제공함, 과부화의 위험성이 있음
- 서비스를 요청하는 Client와 그 요청에 대해서 서비스를 제공하는 Server 프로그램 사이의 상호 통신하는 관계
- 네트워크 상의 서로 다른 컴퓨터에 분산되어 있는 프로그램들이 서로 효율적으로 통신할 수 있는 환경 제공
- 인터넷의 기본 프로그램인 TCP/IP도 이를 통해 구현됨, ex) 웹브라우저는 클라이언트 프로그램, 특정 웹서버에게 웹페이지 또는 파일 전송을 요청, 응답 결과를 출력하는 일
- TCP/IP 설치된 컴퓨터는 인터넷상 다른 컴퓨터의 FTP 서버들에게 파일전송 요청 가능
2) Peer-to-peer 모델
- 클라이언트/서버 모델과 대비되는 모델, P2P라는 용어로 사용됨
- 하나의 사용자가 서버이자 클라이언트 역할, 네트워크에 연결되어 있는 모든 컴퓨터들이 서로 대등한 동료의 입장에서 데이터나 주변장치등을 공유, 이로 인해 부하를 줄일 수 있음
3) 인터넷
- 미국방성의 ARPANET이 시초, TCP/IP라는 프로토콜을 사용하는 수많은 컴퓨터들이 서로 연결된 전 세계에서 가장 커다란 통신망
- OSI 7계층 중 3계층인 네트워크 프로토콜에 기반을 둔 하나 이상의 네트워크 모임
- 각각 네트워크는 인터냇 내의 다른 어떤 네트워크와 통신 가능, TCP/IP 네트워크이며, IP주소 체계와 IP 프로토콜을 사용
#### 중요 프로토콜
1) IP(Interent Protocol)
- IP는 네트워크 계층에 존재하는 프로토콜로서 활용도가 높고 널리 사용됨
- IP는 신뢰성이 없는 프로토콜로, 패킷이 상대방에게 안전하게 전송되는 것을 보장하는 것으 4층의 트랜스포트 계층에게 담당시키고, 효율적 전송에만 집중함
- 호스트에 대한 주소 체계와 데이터 패킷에 대한 라우팅을 담당함
- 패킷을 수신하는 각 라우터는 패킷의 IP 주소를 근간으로 라우팅을 겨정함
- IP 주소 : 32비트 정보로 구성됨, .을 구분으로 8비트씩 네부분으로 나뉘어짐
- 일부는 네트워크를 나타내며 다른 부분은 호스트를 나타냄
- IPv4는 주소 자체가 고갈되고 있으며 이룰 해결하기 위해 IPv6로 넘어가는 중
2) TCP, UDP
	가) TCP(Transmission Control Protocol)
	- 신뢰성 있는 연결지향 프로토콜, 전송할 데이터가 안전하게 전달되는 것을 보장함
	- 전달되는 데이터는 발신자가 보내는 것과 같은 순서로 수신자에게 전달됨, 전화통화
	- 데이터를 전송하거나 수신하기 전에 서로 연결되어있어야 함
	- 데이터의 무결성을 보장하기 위해 checksum을 포함해서 전달하고 이걸 확인함
	- checksum으로 누락된 데이터가 있으면 데이터 재전송을 요청
	- 소켓과 포트를 이용해서 동시에 접속을 지원함, 이 다중 송수신 특징을 통해 대규모 동시 통신이 가능함, HTTP(80포트), FTP(20 or 21포트), POP3(110포트) 등
	- UDP에 비해 포로토콜이 복잡하고 속도가 느림, 대신 신뢰성 있는 데이터 전송이 가능하므로 HTTP,FTP,TELNET 등 TCP를 사용함
	나) UDP(User Datagram Protocol)
	- 신뢰성 없는 비연결지향 프로토콜, 데이터 전달 확인안하고 보내기만, 편지와 비슷
	- UDP는 대신 빠르고 단순하므로 음악이나 동영상 스트리밍 서비스에 적당함
3) HTTP(Hypertext Transfer Protocol)
- 7계층으로, 인터넷에서 하이퍼 텍스트 문서(텍스트, 그래픽, 사운드, 비디오 등)을 교환하기 위해서 사용하는 통신규약들의 집합
- HTTP는 상태를 유지하지 않는(Stateless) 특징을 가짐
- 클라이언트에서 서버로 접속해서 요청을 하면 서버에서는 클라이언트가 요청한 정보에 적절한 응답 후 접속을 끊어버림
- HTTP 문서는 요청에 관한 여러 정보를 담고 있는 헤더와 데이터를 담고 있는 바디를 가지고 있음, TCP 포트 80번을 사용함
#### 네트워크 프로그래밍 기초
1) 소켓이란?(socket)
- 사용자에게 네트워크에 접근할 수 있는 인터페이스를 제공해줌
- 소켓의 과정 : 소켓 생성 -> 소켓을 통한 송수신 -> 소켓 소멸
- 소켓의 방법 : TCP와 UDP를 이용한 두 가지 방법이 있음
- 소켓의 형식 : 세가지 소켓 형식이 있음
	가) SOCK_STREAM : 바이트를 주고 받을 수 있는 스트림 통신을 구현하게 해주는 소켓, 양방향 통신이 가능함 (TCP)
	나) SOCK_DGRAM : 데이터그램 통신용 소켓, SOCK-STREAM처럼 양방향(UDP)
	다) SOCK_RAW : 자바에서 지원 안함
2) 인터넷 주소(IP)와 포트
- IP를 이용하면 원하는 컴퓨터를 찾을 수 있지만 올바른 통신이 가능한 것은 아님
- 여러 프로세스가 각자의 포트를 가지고 접속을 기다리거나 통신을 하고 있으므로
- 포트는 여러 프로세스가 소켓으로 통신할 때 각각의 소켓을 구분하기위해 사용함
	- 포트는 정수값, 0~1023은 이미 (FTP,WWW)등이 차지했고 1024부터 일반 사용자용
3) InetAddress 클래스를 활용한 도메인과 IP 변환
- Java.net 패키지의 InetAddress 클래스로 도메인 주소와 IP주소를 상호변환하거나 문자열이나 바이트 배열 형태로 IP 주소에 대한 정보, 현재 컴퓨터의 이름을 구할 수 있음
> 구문
```java
Inetaddress address = InetAddress.getLocalHost();
String domain = address.getHostName(); // 도메인 네임 얻음 즉, 컴퓨터 이름
String ip = address.getHostAddress(); // dotted decimal 주소를 얻음
byte[] ipByte = address.getAddress(); // 4바이트 IP 주소를 얻음
```
> InetAddress의 주요 메서드

| 메서드                            | 설명                                                         |
| --------------------------------- | ------------------------------------------------------------ |
| Static InetAddress getLocalHost() | 로컬 호스트의 IP 주소에 대한 정보를 InetAddress 객체 형태로 반환함 |
| Byte[] getAddress()               | IP 주소를 바이트 형태로 반환함                               |
| String getHostAddress()           | 호스트의 IP 주소를 점으로 구분되는 10진수 형태로 반환함      |
| String getHostName()              | 호스트의 도메인명을 문자열로 반환함                          |
| 기타 등등이 있다.                 |                                                              |

- 도메인 네임으로부터 호스트의 IP 주소를 얻으려면 getByName() 메서드를 사용함
- IP주소 얻는 세개의 메서드는 UnknowHostException을 예외처리 해줘야함

### 네트워크 프로그래밍
#### TCP 프로그래밍
- TCP는 스트림 통신 프로토콜이라고 부르며, 연결지향 프로토콜로 양쪽의 소켓이 연결된 상태여야만 가능, 신뢰성 있으며 중간에 데이터가 유실 되는 일 없이 도착함
- 라이브러리와 동작순서를 숙지해야 사용 가능, (java.net 패키지)
- ServerSocket 클래스 : 서버 쪽에서 클라이언트 접속을 대기하기 위해 필요한 클래스
- Socket 클래스 : 서버와 클라이언트가 서버와 통신하기 위해서 반드시 필요한 클래스
- 연결에 필요한 시간이 필요, 대신, 대용량의 데이터도 주고 받을 수 있음
- 정해지지않은 길이의 데이터를 신뢰성 있게 송수신하는 곳에 쓰임
> ServerSocket 클래스의 주요 메서드

| 메서드                       | 설명                                                     |
| ---------------------------- | -------------------------------------------------------- |
| Socket accept()              | 클라이언트의 접속요청을 받아 새로운 Socket 객체를 리턴함 |
| Void close()                 | 서버소켓을 닫음                                          |
| InetAddress getInetAddress() | 서버 자신의 인터넷 주소를 리턴함                         |
| 기타 등등이 있다.            |                                                          |

> Socket 클래스의 주요 메서드

| 메서드                         | 설명                                 |
| ------------------------------ | ------------------------------------ |
| void close()                   | 소켓을 닫음                          |
| InetAddress getInetAddress()   | 상대방의 InetAddress를 리턴함        |
| InputStream getInputStream()   | 이 소켓과 연결된 InputStream을 얻음  |
| OutputStream getOutputStream() | 이 소켓과 연결된 OutputStream을 얻음 |
| 기타 등등 이 있다.             |                                      |

- 양쪽 클라이언트와 서버 둘다 소켓이 있어야 소켓 기반 통신이 가능하며, client socket은 기다리고 있는 서버에게 접속을 시도하고, server socket은 클라이언트가 접속하기를 기다리고 있어야 함

2) TCP 에코 서버
- 클라이언트가 보낸 데이터를 서버 쪽에서 받아들여, 클라이언트에게 그대로 다시 보내주는 것을 의미함
- TCP 에코서버를 구현하는 순서
	1. ServerSocket(포트 번호)를 생성해 특정 포트에서 클라이언트의 접속을 대기
	2. ServerSocket의 accept() 메서드를 이용해 클라이언트의 접속을 기다림
	3. 클라이언트의 접속 요청이 들어오면 accept() 메서드가 실행되 클라이언트와의 통신을 위한 Socket 객체를 생성함
	4. 생성된 Socket 객체로부터 통신을 위한 InputStream, OutputStream을 얻음
	5. InpustStream, OutputStream을 이용하여 클라이언트와 통신함
	6. 통신에 사용된 IO 스트림과 Socket 객체를 close()함
> TCP 에코서버 구현 (TCPEchoServer.java)
```java
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.outputStreamWriter;
import java.io.PrintWriter;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;

public class TCPEchoServer {
	public static void main(String[] args) {
		try {
			ServerSocket server = new ServerSocket(50000);// 동작포트값
			System.out.println("클라이언트의 접속을 대기중...");
			Socket socket = server.accept();
			InetAddress address = socket.getInetAddress();
			System.out.println(address.getHostAddress() + " 로부터 접속했습니다.");
			InputStream in = socket.getInputStream();
			OutputStream out = socket.getOutputStream();
			BufferedReader br = new BufferedReader(new InputStreamReader(in));
			PrintWriter pw = new PrintWriter(new OutputStreamWriter(out));
			
			String message = null;
			while ((message = br.readLine()) != null) {
				System.out.println("클라이언트로 부터 전송받은 메시지 : " + message);
				pw.println(message);
				pw.flush();
			}
			br.close();
			pw.close();
			socket.close();
		} catch (Exception e) {
			System.out.println(e);
			e.printStackTrace();
		}			
		}
	}
}
```
3) TCP 에코 클라이언트
- TCO 에코 클라이언트 구현 순서
	1. 서버와 통신을 위한 Socket 객체를 생성함, 이때 접속 요청할 서버의 IP 주소와 Port 번호를 매개변수로 지정함
	2. Socket 객체로부터 서버와의 통신을 위한 InputStream, OutputStream을 얻음
	3. 생성된 InputStream, OutputStream을 이용하여 서버와 통신함
	4. 통신이 완료되면 통신에 사용된 IO 스트림과 Socekt 객체를 close() 함
> TCP 에코 클라이언트
```java
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.outputStreamWriter;
import java.io.PrintWriter;
import java.net.Socket;

public class TCPEchoClient {
	public static void main(String[] args) {
		try {
			Socket socket = new Socket("127.0.0.1", 50000);
			BufferedReader keyboard = new BufferedReader(new InputStreamReader(System.in));
			InputStream in = socket.getInputStream();
			BufferedReader br = new BufferedReader(new InputStreamReader(in));
			
			OutputStream out = socket.getOutputStream();
			PrintWriter pw = new PrintWriter(new OutputStreamWriter(out));
			
			String message = null;
			
			while((message = keyboard.readLine()) != null){
				if (message.equals("quit"))
						break;
				pw.println(message);
				pw.flush();
				String echoMessage = br.readLine();
				System.out.println("서버로부터 전달받은 문자열 : " + echoMessage);
				}
				br.close();
				pw.close();
				socket.close();
				} catch (Exception e) {
					System.out.println(e);
					e.printStackTrace();
				}				
			}
		}
	}
}
```
4) 멀티 Thread를 이용한 에코서버
- 서버가 단 하나의 클라이언트 접속만을 처리 할 수 있다는 점에서 문제 발생
- accept() 메서드로 대기하고, 클라이언트의 접속요청, 클라이언트와 통신할 수 있는 소켓을 리턴, 다시 accept()하지 않음, 이를 멀티 Thread를 이용하여 해결해야함
- 각각의 소켓은 클라이언트와 1:1로 통신하는 Thread 객체에 포함되게 작성해야함
- TCP 기반의 멀티 Thread 서버를 구현하는 순서
	1. ServerSocket(50000)을 생성하여 특정 포트에서 클라이언트의 접속을 대기
	2. ServerSocket의 accept()를 이용해 클라이언트의 접속을 기다림
	3. 클라이언트의 접속 요청이 들어오면 accept() 메서드가 실행되어 클라이언트와의 통신을 위한 Socket 객체를 생성함
	4. 생성된 Socket 객체를 매개변수로 하여 Thread 클래스의 객체를 생성함
- 여기까지 서버의 일, 이후 생성된 Thread 객체의 일
	5. Thread는 생성자 메서드에 의해서 전달된 Socket으로부터 통신에 필요한 InputStream, OutputStream을 얻음
	6. InputStream, OutputStream을 이용하여 클라이언트와 통신함 
	7. 통신에 사용된 IO 스트림과 Socket 객체를 close()함
> MultiThreadEchoServer 프로그램 (MultiThreadEchoServer.java)
```java
import java.net.ServerSocket;
import java.net.Socket;

public class MultiThreadEchoServer {
	public static void main(String[] args) {
		try {
		//ServerSocket 생성자에 서버의 IP와 서버의 동작 포트 값(50000)을 매개변수로 넣어 ServerSocket 객체를 생성
			ServerSocket server = new ServerSocket(50000);
			System.out.println("클라이언트의 접속을 대기합니다...");
		}
		while (true) {
		//클라이언트의 접속을 계속 기다리는 무한루프
		// 접속이 요청되면 accept() 메서드가 클라이언트와 통신할 Socket 객체를 생성함,
		// 생성된 Socket 객체를 EchoThread 객체를 생성할 때 인자로 넘기고, Thread를 기동함
			Socket socket = server.accept();
			EchoThread echoThread = new EchoThread(socket);
			echoThread.start();
		} catch (Exception e) {
			System.out.println(e);
			e.printStackTrace();
		}
	}
}
```
> EchoThread 클래스 (EchoThread.java)
```java
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.outputStreamWriter;
import java.io.PrintWriter;
import java.net.InetAddress;
import java.net.Socket;

public class EchoThread extends Thread {
	private Socket socket;
	
	public EchoThread(Socket socket) {
		this.socket = socket;
	}
	public void run() {
		try {
			InetAddress address = socket.getInetAddress();
			System.out.println(address.getHostAddress() + " 로부터 접속됨.");//접속을 요청한 클라이언트의 IP 주소를 출력함
			InputStream in = socket.getInputStream();
			OutputStream out = socket.getOutputStream();
			BufferedReader br = new BufferedReader(New InputStreamReader(in));
			PrintWriter pw = new PrintWriter(new OutputStreamWriter(out));
//생성자를 통해 넘어온 Socket으로부터 InputStream과 OutputStream을 구함
			String message = null;
			while ((message = br.readLine()) != null) {
				System.out.println("클라이언트의 전송 메시지 : " + message);
				pw.println(message);
				pw.flush();
			}// 클라이언트로부터 전송된 메시지를 서버 콘솔에 출력후 역전송
			br.close(); // 입출력 작업 완료, 사용된 스트림 닫기
			pw.close();
			socket.close();
		} catch (Exception e) {
			System.out.println(e);
			e.printStackTrace();
		}
		}
	}
}
```
#### UDP 프로그래밍(User Datagram Protocol)
- UDP는 데이터그램 통신 프로토콜, 비연결성 프로토콜,

- 패킷을 보낼때마다 수신측 주소, 로컬파일 설명자를 함께 전송함, 64kb로 제한됨

- 신뢰성없고 제한적인 대신 TCP보다 좀더 빠르게 주고 받을 수 있음,

- 복잡하지 않고 부하가 많이 발생하지 않는 곳에 적합

- UDP를 쓸려면 클라이언트와 서버 모두 java.net 패키지의 DatagramSocket 객체 생성

- 데이터를 주고 받기 위해서는 DatagramPacket 객체를 이용해야함

- DatagramSocket은 DatagramPacket을 보내거나 받을 때 모두 필요함

> DatagramPacket 클래스의 생성자

| 메서드                                                       | 설명                                                         |
| ------------------------------------------------------------ | ------------------------------------------------------------ |
| DatagramPacket(byte[] buf, int length)                       | buf 배열에 length 길이만큼 데이터를 전송받기 위한 생성자     |
| DatagramPacket(byte[] buf, int length, InetAddress addr, int port) | buf 배열의 length 길이 만큼의 데이터를 addr 주소의 port 번 포트로 전송하기 위한 생성자 |
| DatagramPacket(byte[] buf, int offset, int length, InetAddress addr, int port) | buf 배열의 offset 길이 만큼의  띄운 위치에서부터 length 길이만큼의 데이트를 전송하기 위한 생성자 |

> DatagramPacket 클래스의 주요 메서드

| 메서드                   | 설명                                              |
| ------------------------ | ------------------------------------------------- |
| InetAddress getAddress() | 이 객체를 보낸 곳의 IP 주소를 리턴함              |
| byte[] getData()         | 이 객체에 담긴 데이터의 내용을 byte 배열로 리턴함 |
| int getLength()          | 데이터의 길이를 리턴함                            |
| int getPort()            | 보낸 곳의 포트 번호를 리턴함                      |
| 기타 등등이 있다.        |                                                   |

> DatagramSocket 클래스의 생성자

| 메서드                                | 설명                                                        |
| ------------------------------------- | ----------------------------------------------------------- |
| DatagramSocket()                      | UDP로 데이터를 전송하기 위한 기본 소켓 생성                 |
| DatagramSocket(int port)              | 특정 포트를 통해 데이터를 전송하는 Socket 객체 생성         |
| DatagramSocket(int port, InetAddress) | 특정 InetAddress의 특정 포트를 통해 통신하는 소켓 객체 생성 |

> DatagramSocket 클래스의 주요 메서드

| 메서드                         | 설명                                |
| ------------------------------ | ----------------------------------- |
| void close()                   | 소켓 통신을 종료함                  |
| InetAddress getIngetAddress()  | 현재 소켓이 바인딩 된 주소를 리턴함 |
| void receive(DatagramPacket p) | p를 통해 전달된 데이터를 수신함     |
| void send(DatagramPacket p)    | p를 소켓 통로로 전송함              |
| 기타 등등이 있다.              |                                     |

1) UDP 에코 서버

- 구현 순서
	1. 특정 포트에서 동작하는 DatagramSocket 객체를 생성함
	2. 클라이언트가 전송한 DatagramPacket을 받기 위해 내용이 비어있는 DatagramPacket 객체를 생성함
	3. 생성한 DatagramPacket을 매개변수로 DatagramSocket이 제공하는 receive() 메서드를 호출함
	4. 클라이언트가 전송한 데이터를 서버 콘솔에 출력함
	5. 클라이언트가 전송한 데이터를 이용해 새로운 DatagramPacket을 생성함
	6. 생성한 DatagramPacket을 매개변수로 DatagramSocket이 제공하는 send()메서드를 호출하여 클라이언트로 전송함
	7. DatagramSocket의 close()를 호출하여 연결을 해제함
- DatagramPacket은 서버의 IP와 포트 값을 통해 서버에 전달됨
- 서버는 이 패킷을 receive()로 받아서 전송한 클라이언트의 IP, 동작 포트, 데이터, 데이터의 길이 등을 알아낸 후, 응답 패킷을 구성한 뒤 클라이언트에게 다시 send()한다. 
> UDP 기반의 에코 서버 프로그램 (UDPEchoServer.java)
```java
import java.net.DatagramPacket;
import java.net.DatagramSocket;

public class UDPEchoServer {
	public static void main(String[] args) {
		DatagramSocket socket = null;
		try {
			System.out.println("접속 대기상태입니다.");
			socket = new DatagramSocket(50001);
			// 서버 포트값 50001을 넣어 datagramsocket 생성
			while (true) {
				// 연결 요청들어올때 까지 무한 루프
				byte[] buff = new byte[1024];// 버퍼생성, packet 생성
				DatagramPacket receivePacket =
					new DatagramPacket(buff, buff.length);
				socket.receive(receivePacket);
				String msg = new String(receivePacket.getData(), 0, receivePacket.getLength());// packet을 이용해 전송한 메시지를 읽어 출력
				System.out.println("전송받은 문자열 : " + msg);
				if (msg.equals("quit")) {
					break;
				} // 전송한 메시지가 quit면 반복 종료
// 클라이언트가 전송한 메시지를 다시 DatagramPacket으로 생성해 클라이언트로 재전송
				DatagramPacket sendPacket = new DatagramPacket(
					receivePacket.getData(),
					receivePacket.getData().length,
					receivePacket.getAddress(),
					receivePacket.getPort());
				seocket.send(sendPacket);
			}
			System.out.println("UDPEchoServer를 종료합니다.");
		} catch (Exception e) {
			System.out.println(e);
			e.printStackTrace();
		} finally { //통신이 끝나면 socket 닫음
			if (socket != null) {
				socket.close();
			}
		}
	}
}
```
2) UDP 에코 클라이언트
- 클라이언트는 데이터를 전송하기 위해, DatagramSocket을 생성함
- 서버와 다르게 동작하는 포트는 지정하지 않음, 전송할 Packet에 서버 socket의 동작 포트, 서버의 IP, 데이터, 데이터 길이등을 지정후, send() 메서드로 전송하기 때문
- UDP 에코 클라이언트 구현 순서
	1. DatagramSocket 객체를 생성
	2. 전송할 데이터, 데이터 길이, 서버 IP, 서버 포트 번호를 매개변수로 하여 DatagramPacket 객체를 생성함
	3. 생성한 DatagramPacket을 매개변수로 하여 DatagramSocket이 제공하는 send() 메서드를 호출하여 서버쪽에 DatagramPacket을 전송함
	4. 서버에서 전송하는 메시지를 받기 위해 내용이 비어있는 수신용 DatagramPacket 객체를 생성함
	5. 생성한 DatagramPacket을 매개변수로 하여 DatagramSocket이 제공하는 receive() 메서드를 호출함
	6. 서버에서 수신한 메시지를 콘솔에 출력함
	7. DatagramSocekt의 close()를 호출하여 연결을 해제함
- 모든 작업이 끝나면 서버와 클라잉너트 모두 DatagramSocket에 있는 close() 메서드를 호출하여 연결을 해제하면 됨
> UDP 기반의 에코 클라이언트 프로그램(UDPEchoClient.java)
```Java
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.DatagramPacket;
import java.net.DatagramSocekt;
import java.net.InetAddress;
import java.net.UnknownHostException;

public class UDPEchoClient {
	public static void main(String[] args) {
		InetAddress address = null;
		try {
			address = InetAddress.getByName("127.0.0.1");
		} catch (UnknowHostException e) {
			System.out.println("잘못된 Domain이거나 IP 주소입니다. ");
			System.exit(0);
		}
		// 서버의 IP주소를 지정해 InetAddress 객체를 생성
		DatagramSocket socket = null;
		try {// 키보드로부터 메시지를 읽기 위한 입력스트림 생성
			BufferedReader br = new BufferedReader(new InputStreamReader(System.in))
			socket = new DatagramSocket(); // socket 객체 생성
//입력된 메시지를 라인단위로 읽어 Packet을 생성하고 서버로 전송함
			String line = null;
			while ((line = br.readLine()) != null) {
				DatagarmPacket sendPacket = new DatagramPacket(line.getBytes(), line.getBytes().length, address, 50001);
				socket.send(sendPacket);
				if (line.equals("quit")) {
					break;
				}// quit이 입력되면 프로그램 종료
				
				byte[] buff = new byte[line.getBytes().length];
				DatagramPacket receivePacket = new DatagramPacket(buff, buff.length);
				socket.receive(receivePacket);
//서버로부터 전송된 packet으로부터 메시지를 추출해, 클라이언트 콘솔창에 출력
				String message = new String(receivePacket.getData(), 0, receivePacket.getData().length);
				System.out.println("전송받은 문자열 : " + message);
			}
		} catch (Exception e) {
			System.out.println(e);
			e.printStackTrace();
		} finally {
			if (socket != null) { //통신 끝나면 Socket 닫음
				socket.close();
			}
		}
			
	}
}
```