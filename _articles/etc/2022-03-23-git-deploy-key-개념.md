---
title: git delploy key 개념
date: 2022-03-23 17:21:08 +0900
tags: git
layout: obsidian
is_Finished: false
last_Reviewed: 2022-10-30 17:21:08 +0900
use_Mathjax: false
---
# GIT Clone by deploy key

각 서버마다 GIT의 유저명과 패스워드를 설정하면, 번거로울 뿐만 아니라 보안상으로 문제가 생길 수 있다.

```bash
ssh-keygen -t ed25519 -C "USERNAME@EMAIL.com"
```

- `-t` : 사용할 알고리즘, `ed25519`가 일반적이고 안전하다.

- `-C`: 키 마지막에 자신의 이메일을 삽입하여 커맨팅

나오는 설정은 파일 설정, `passphrase`이며, 기본 설정도 괜찮다.

```
touch ~/.ssh/config 
chmod 600 ~/.ssh/config 
vim ~/.ssh/config 
```

`.ssh` 폴더에 `config` 파일을 만들고, 권한을 바꾼 뒤  `vim`을 이용해 아래와 같은 설정을 넣는다.

```bash
Host github-YOUR-APP 
    HostName github.com 
    AddKeysToAgent yes 
    PreferredAuthentications publickey 
    IdentityFile ~/.ssh/id_ed25519
```

이는 [EC2]() 글에서 본적 있을 것이다.

```bash
cat ~/.ssh/id_ed25519.pub
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILs35pzG5jZakTEHDWeRErgkAmabhQj2yj/onxlIQgli user@example.com
```

`cat` 명령어를 통해 생성된 키를 복사하고 이를 `대상 GIT repository -> Settings -> Deploy keys -> Add deploy key`에 키 이름과 키를 저장한다.

![](2022-06-23-00-12-58-image.png)

아래와 같이 등록된다.

![](2022-06-23-00-20-01-image.png)

이후 아래와 같이 SSH를 통해서 `Clone`을 할 수 있다.

![](2022-06-23-00-20-45-image.png)

```
[ec2-user@ip-xxx-xxx-xxx-xxx docker-server]$ git clone git@github.com:RoadVirusHN/Movi-Dick.git
Cloning into 'Movi-Dick'...
```
