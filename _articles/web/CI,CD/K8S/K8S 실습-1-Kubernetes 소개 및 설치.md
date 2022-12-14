---
title: K8S 실습-1-Kubernetes 소개 및 설치
date: 2022-12-04 22:19:16 +0900
tags: HIDE CRUDE 
layout: obsidian
is_Finished: false
last_Reviewed: 2022-12-04 22:19:16 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```
# Kubernetes
```ad-quote
title:  _[[https://www.youtube.com/@ttabae-learn4274/featured|TTABE-LEARN]] 채널_의 내용을 토대로 정리한 내용입니다.
```
## Kubernetes(K8S)?

![[image-20221204222059554.png]]
[[https://kubernetes.io/|쿠버네티스 공식]]
**컨테이너(보통 도커)들의 배포, 스케일링, 운영 등을 자동화하는 방법을 제공하는 오픈소스 관리 시스템**.

구글이 설계하여 리눅스 재단이 관리하고 있으며, K와 S 사이에 8글자가 있다는 의미로 K8S라고 줄여서 쓰기도 한다. 🤔

개인적으로 도커만 활용했던 시기에 스케일링 방법이나 모니터링, 젠킨스 만을 이용한 마스터-워커 관계 수립에 어려움을 느꼈는데 K8S를 학습하면서 해결되길 바란다.

실습의 경우, AWS EC2나 직접 Linux 설치, VMware를 활용하는 것을 추천한다.
실무 환경에 가깝기도 하고, `systemd` 활용 여부, 방화벽 설정 등의 부분이 다르기 때문

### 쿠버네티스 아키텍처(K8S architecture)

**CNI(Container Network Interface)**

**Container간 통신을 위해 사용되며, VxLAN, Pod Network**라고도 불린다. 다양한 종류의 플러그 인이 존재
Docker의 기본 통신 인터페이스에 추가 기능을 넣는다.
flannel, calico, weavenet 등이 존재함.

마스터 노드 (master node)
- 워커 노드들의 상태를 관리하고 제어
- 하나일 수도 있고, 여러개일 수도 있음

워커 노드 (worker node)
- 도커 플랫폼들을 통해 컨테이너를 동작하며 실제 서비스 제공
root로 진행
```bash
docker pull ubuntu:20.04
docker run --privileged -d --name master -t ubuntu:20.04 bash
docker run --privileged -d --name worker1 -t ubuntu:20.04 bash
docker run --privileged -d --name worker2 -t ubuntu:20.04 bash
docker exec -ti ${container_name} bash
# adduser ${username}
```
## Docker, cri-dockerd 설치
### Docker 설치
- [[2021-03-23-Docker#Docker 설치|Docker]] 설치과정 참조

마스터와 워커 노드 전부에 설치되어 있어야 한다.
리눅스에 직접 설치 하지 않고 도커 컨테이너로 실습 등을 진행하려는 경우는 아래 참조
```ad-example
title: Docker가 설치된 docker image dockerfile
collapse: close
- 루트 계정으로 진행
- 방화벽 설치 안되어있음
~~~dockerfile
FROM ubuntu:20.04 

WORKDIR /

ENV TZ=Asia/Seoul

RUN apt-get update 

RUN apt-get install -yq tzdata && \
    ln -fs /usr/share/zoneinfo/Asia/Seoul /etc/localtime && \
    dpkg-reconfigure -f noninteractive tzdata 

RUN apt-get install -y ca-certificates curl gnupg lsb-release  

RUN mkdir -p /etc/apt/keyrings 

RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg 

RUN echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null  

RUN apt-get update 

RUN apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin  

RUN systemctl enable docker

ENTRYPOINT service docker start && /bin/bash
# docker build -t ubuntu:docker .
# docker run --privileged -d --name container_name -t ubuntu:docker bash
# docker exec -ti ${container_name} bash
# service docker status
~~~
```

### cri-dockerd 설치
cri-docker는 docker를 설치 후에 설치해야하는 추가적인 어뎁터이다.
Kubernetes가 더이상 순정 Docker를 지원하지 않기 때문이다. [[https://kubernetes.io/blog/2020/12/02/dont-panic-kubernetes-and-docker/|왜?]]


## Kubernetes 설치 - linux 환경

- [[https://kubernetes.io/ko/docs/setup/production-environment/tools/kubeadm/install-kubeadm/| 공식 문서 ]] 참고

### 설치전 환경 설정
- 2 코어 이상의 cpu, 2GB 이상의 램을 가져야 한다
- swap이 비활성화 되어야 한다.  for kubelet
```ad-example
title: swap 비활성화 명령어
collapse: close
~~~bash
swapoff -a && sed -i '/swap/s/^/#/' /etc/fstab
~~~
```
- 사용할 포트가 개방되어 있어야 함. 
	- 보통 클러스터의 인터페이스 게이트에만 방화벽을 수립하고, 노드는 방화벽을 사용하지 않는다고 한다.

### kubeadm, kubectl, kubelet 설치

마스터 노드와 워커 노드 모두 설치해 주어야 한다.


**kubeadm**
**쿠버네티스에서 공식으로 지원하는 클러스터링 생성/관리 툴**이다. 기본적으로 생성을 지원하며 에드온을 통해 모니터링 등의 추가 기능을 지원한다.
- 비슷한 툴로는 `kubespray`가 있다.

**kubectl**
**쿠버네티스 클러스터와 쿠버네티스 API를 통하여 의사소통 하기 위한 명령 줄 도구** 

**kubelet**
**각 노드에서 노드 에이전트 역할을 하게 해주는 데몬**, api 서버를 통해 호스트명이나 지어준 이름으로 노드를 등록시켜 준다. 컨테이너 들을 시작하고 종료하는 등의 명령을 실행한다.


### master node 구성


### worker node 구성

### 설치 확인



