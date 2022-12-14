---
title: Linux file directory
date: 2022-11-30 20:07:17 +0900
tags: OS CRUDE LINUX
layout: obsidian
is_Finished: false
last_Reviewed: 2022-11-30 20:07:17 +0900
use_Mathjax: true
---
# 리눅스 파일 디렉토리

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```
리눅스는 다음과 같은 여러 파일 디렉토리로 이루어져 있다.

![[image-20221130201405152.png]]

- `/` : 루트 디렉토리라고 부르며, 최상위 폴더

- `/bin/` : 리눅스의 기본 명령어들이 존재하는 곳, 엄밀히 말하면 바로가기 폴더임
	- `ls, date, cd` 등의 존재함

- `/sbin/`: 리눅스의 시스템 관리용 명령어들이 존재하는 곳, 엄밀히 말하면 바로가기 폴더임
	- `useradd, userdel, usermod`: 계정 생성, 삭제, 수정 명령어
	- `ip6tables`: 방화벽 설정
	- `lvreduce, lvremove, lvresize`: 디스크 관리용 명령어

- `/usr/`: 설치한 어플리케이션이나 라이브러리(`.so`), 유틸리티가 설치되어 존재하는 곳
	- 윈도우의 `/program files/` 같은 폴더
	- `/user/local/`: 유저가 추가로 어플리케이션을 설치하면 주로 이곳에 설치됨.
	- 이 아래에 실제 상단의 `/lib/`, `/bin/`,  `/local/bin/``/sbin/` 등이 존재하며, 루트의 폴더들은 이들의 바로가기 폴더
```ad-seealso
title: WHY??
과거 리눅스는 공통적이고 필수적인 명령어는 루트의 `/bin/` 폴더에, 추가적인 명령어는 `/usr/bin/`에 저장했으나, 현재는 모두 일괄적으로 `/usr/bin/`에 저장하게 되어 과거 리눅스와의 호환을 위해 바로가기 파일로 루트 폴더에 존재.
```

- `/etc/`:  시스템 설정 파일
	- 로그인 할 수 있는 패즈워드 정보(`/etc/passwd`), 호스트명(`/etc/hostname`), 웹서버 설정 파일(`/etc/httpd/conf.d/htppd.conf`) 등의 ASCII text 파일과 폴더들이 존재

- `/var/`: 자주 변하는 파일들이나 애플리케이션 데이터
	- `/var/log/`: OS에 관련된 모든 활동에 대한 기록이 존재
	- `/var/mail/`: SMTP 메일 발신함
	- 기타 다른 어플리케이션들의 중요한 데이터들에게 사용됨

- `/tmp/`: 임시 디렉토리, 임시적인 용도에 사용됨
	- `/run/`: `/tmp/`와 비슷한 역할, 보통 socket 관련 파일이 주로 존재

- `/proc/`: 메모리에서 동작중인 프로세스 정보를 확인, 즉, 메모리의 내용을 보여줌 (램디스크)
	- 유저가 해당 디렉토리를 조회하는 순간, 해당 디렉토리의 내용이 결정됨(bump)

- `/sys/`: 시스템 하드웨어 정보나 가상 파일 시스템들
	- 버스, 블록, 다른 장치 들에 대한 정보

- `/root/`: 시스템 최고 관리자인 root 사용자의 홈 디렉토리

- `/home/${username}`: 일반 사용자들의 홈 디렉토리

- `/dev/`: 하드웨어 장치 파일, 인식한 하드웨어들을 포인터 파일로 만들어 관리
	- `xvda` : 하드디스크
	- `mem`: 메모리