---
title: Linux 계정 및 권한
date: 2022-12-14 20:22:15 +0900
tags: HIDE OS LINUX 
layout: obsidian
is_Finished: false
last_Reviewed: 2022-12-14 20:22:15 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# Linux 사용자와 권한에 대하여

## 사용자 계정(user)

리눅스는 시스템 보안 기능 중 하나로 서로 다른 권한을 가진 여러 사용자 계정을 만드는게 가능한 다중 사용자 시스템이다.

`cat /etc/passwd`를 이용해 모든 사용자의 관리 정보를 출력해볼 수 있다.

```bash
cat /etc/passwd

root:x:0:0:root:/root:/bin/bash
bin:x:1:1:bin:/bin:/sbin/nologin
daemon:x:2:2:daemon:/sbin:/sbin/nologin
adm:x:3:4:adm:/var/adm:/sbin/nologin
lp:x:4:7:lp:/var/spool/lpd:/sbin/nologin
sync:x:5:0:sync:/sbin:/bin/sync
shutdown:x:6:0:shutdown:/sbin:/sbin/shutdown
halt:x:7:0:halt:/sbin:/sbin/halt
mail:x:8:12:mail:/var/spool/mail:/sbin/nologin
operator:x:11:0:operator:/root:/sbin/nologin
games:x:12:100:games:/usr/games:/sbin/nologin
ftp:x:14:50:FTP User:/var/ftp:/sbin/nologin
```

각 줄의 관리 정보의 구성은 다음과 같다.
```
사용자명:암호(x로 마스킹됨):고유 UID:그룹 ID:계정 설명(보통, 사용자명):홈 디렉토리:사용자가 사용하는 셸(터미널)
```

```ad-seealso
title: 추가 계정 정보들의 위치
암호는 `/etc/shadows` 파일에 별도로 저장되어 있다.

사용 가능한 셸 종류는 `/etc/shells`에 저장되어 있고, 기본은 `/bin/bash`이다.

```


사용자는 크게 `root(super)`, `system`, `unprivileged`로 나뉜다.

### `root` 유저

모든 권한을 행사 가능한 관리자 계정, 계성 생성, 권한 부여, 비밀번호 변경 등이 가능하다. 

유저 아이디(UID)가 0으로 고정되어 있다. 즉, 관리 정보 맨 위에 존재한다. 만약 UID 0 값을 바꾸면 더이상 모든 권한을 가지지 않게되며, 0을 가진 계정이 `root` 계정의 권한을 가진다.


### `system` 유저

Linux가 설치되면서 자동으로 생성되며, 주로 시스템 관리와 사용시 필요하다. 대략 관리 정보 40번째까지 존재한다.

각자 필요한 권한만 가지고 있으며, 일반적인 방법으로는 로그인이 불가능하다.

### `unprivileged` 유저

생성되어 우리가 직접 사용하는 계정으로, 관리자에게 권한을 부여 받아 시스템을 이용한다.

OS 종류에 따라 100~499번(Redhat)까지, 100~999번(Debian)까지 할당 된다.

## 사용자 그룹(Group)

모든 사용자는 그룹을 통해 관리할 수 있다. 이때, 사용자는 반드시 적어도 하나의 그룹에 속해있어야 한다.
그룹 단위로 파일접근 권한 설정과 프로세스 관리가 수행되므로 이를 통해 권한을 주고 뺏을 수 있다.

그룹에 대한 정보는 `/etc/group` 파일에 저장되어 있다.

처음 사용자 생성시, 기본적으로 자신의 UID와 동일한 GID(그룹 아이디)를 가진다.


## 사용자 권한


## 권한 Command



### sudo





## 실전 : AWS EC2 권한


