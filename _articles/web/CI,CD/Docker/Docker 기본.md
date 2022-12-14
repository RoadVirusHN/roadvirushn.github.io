---
title: Docker 기본
date: 2021-03-23 17:21:08 +0900
tags: docker CICD
layout: obsidian
is_Finished: false
last_Reviewed: 2022-10-30 17:21:08 +0900
use_Mathjax: false
---
# Docker로 서버 가상화해보기

컨테이너를 통해 여러 환경이나 커널을 호스트 OS나 다른 컨테이너와 공유함으로, 기존의 하이퍼 바이저 기반 가상화에 비해 높은 성능을 달성한 가상화 플랫폼.

## Docker 설치

### Linux

더욱 자세한 것은 [[https://docs.docker.com/engine/install/ubuntu/|도커 공식 문서]] 참조

#### 설치 확인
```bash
# 보통 안해도 된다
systemctl enable docker
service docker start
service docker status 
# 안될 경우 /etc/init.d/docker start
# 주로 WSL이나 Docker container의 linux에서 일어나는 현상
docker version
```


### AWS EC2 linux images

**1. apt-get 업데이트 및 도커 설치**
```bash
sudo apt-get update # ubuntu 계열
sudo apt-get install docker 

sudo yum -y upgrade # red hat 계열
sudo yum install docker 
```

**2. 도커 실행**
```bash
sudo systemctl start docker # docekr 서비스의 시작이 필요할 수도 있다.
sudo service docker start

docker -v 
Docker version 20.10.13, build a224086
```

이후 docker를 위와 같이 설치한다.

```bash
sudo usermod -aG docker $USERNAME
```

이후 위와 같이 특정 사용자에게 도커의 실행 권한을 준다.

## Dockerfile 설정 및 이미지 빌드

```dockerfile
FROM python:3.10.5

ENV PYTHONUNBUFFERED 1
ENV ON_PRODUCTION FALSE
ENV BACKEND_SECRET_KEY TEMP // 임시 키설정 나중에 꼭 제대로된 키관리 툴로 바꾸기

RUN apt-get -y update
RUN apt-get -y install vim

RUN mkdir /srv/docker-server
ADD . /srv/docker-server

WORKDIR /srv/docker-server

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

EXPOSE 8000 
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

위와 같이 `Dockerfile`을 프로젝트 폴더 내에 작성한 후, `sudo docker build -t [repository_name]/[tag_name]:[version] $project_directory`을 이용해 도커 이미지를 빌드한다.

- `-t`: 태그 사용 

```bash
sudo docker images
REPOSITORY          TAG       IMAGE ID       CREATED          SIZE
server_dev/django   latest    68e495e3bc5b   17 seconds ago   1.04GB
```

오류 없이 종료되면 위와 같이 `sudo docker images`를 통해 생성된 이미지를 확인 할 수 있다.

### 기타 유용한 커맨드

 `sudo docker image rm [--force] ImageID` : 특정 이미지 지우기 
 - `--force, -f` : 가끔 서로 참조 관계로 지워지지 않을 때 강제로 지움, 다만 이 경우 캐쉬가 지워지므로 이미지 빌드가 느려질 수 있음 
 `sudo docker image prune` : 사용하지 않고 있는 이미지들 일괄 삭제
 `sudo docker rm CONTAINERID` : 특정 컨테이너 삭제 
 `sudo docker stop CONTAINERID` : 특정 컨테이너 중단
 `sudo docker container prune` : 사용하지 않고 있는 컨테이너 일괄 삭제

## 도커 컨테이너 실행

```bash
sudo docker run -p 80:8000 -d server_dev/django
```

위의 커맨드를 통해 이미지의 레포지토리를 입력해 실행된 컨테이너를 통해 접속할 수 있다.

- `-p 서버측 열린 포트: 컨테이너측 열린 포트` : 서버로 들어오는 연결의 포트 번호와 컨테이너 측의 포트를 서로 연결해준다. 

- `-d` : `detached`  모드로, 서버의 백그라운드에 컨테이너를 실행하게 한다.

```bash
sudo docker ps -a
CONTAINER ID   IMAGE               COMMAND                  CREATED         STATUS                     PORTS                                   NAMES
c93671164afa   server_dev/django   "python manage.py ru…"   7 seconds ago   Up 5 seconds               0.0.0.0:80->8000/tcp, :::80->8000/tcp   amazing_pike
```

상기 커맨드를 통해 돌아가고 있는 컨테이너의 상태를 확인할 수 있다.

## 도커 허브

[도커 허브](https://hub.docker.com/)를 이용하면 다른 서버와 이미지를 공유할 수 있다.

도커 허브의 경우 `Repository`는 `[docker_hub_id]/[허브 내 repo 이름]`으로 저장한다.

1. `docker login -u [id]`로 로그인
2. `docker push [dockerhub_id]/[dockerhub repository]:[push 태그명]`으로 push
3. `docker pull [dockerhub_id]/[dockerhub repository]:[pull 태그명]`으로 pull.

```ad-faq
title: **로그인이 안된다면**

**gnupg2** : 디지털 서명과 인증서 암호화 툴 

**pass**: 스탠더드 유닉스 패스워드 매니저

~~~bash
sudo apt install gnupg2 pass
# 혹은
sudo yum install gnupg2 pass
~~~ 
```

## docker-compose

docker-compose를 이용하면 여러 컨테이너의 연계와 설정을 쉽게 할 수 있다.
[[2021-3-23-docker-compose-개념]] 참조