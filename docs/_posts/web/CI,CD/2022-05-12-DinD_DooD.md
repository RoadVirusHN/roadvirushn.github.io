---
title: DinD와 DooD
date: 2022-05-12 17:21:08 +0900
tags: docker CICD
layout: obsidian
is_Finished: false
last_Reviewed: 2022-10-30 17:21:08 +0900
use_Mathjax: false
---
# DinD와 DooD

> [DinD(docker in docker)와 DooD(docker out of docker) | 아이단은 어디갔을까](https://aidanbae.github.io/code/docker/dinddood/)
> 
> [도커 컨테이너 안에서 도커 실행하기(Docker in Docker, Docker Out of Docker) : 네이버 블로그](https://m.blog.naver.com/PostView.naver?isHttpsRedirect=true&blogId=isc0304&logNo=222274955992)
> 
> 참조

[[2022-07-04-01-52-46-image.png]]

## DinD(Docker in Docker) 구조

도커가 설치된 도커 컨테이너 내부에 도커 데몬을 추가로 돌리는, 즉 컨테이너 안에 컨테이너가 중첩되어 있는 구조

🟢 별도의 가상환경을 격리하고, 하위의 여러 컨테이너를 한꺼번에 관리할 수 있다.

🔴 겉껍질 컨테이너는 `--privileged` 플래그를 통해 호스트 권한을 획득하는데, 이 때문에 보안상 좋지 않을 수 있다.

따라서 Docker에서는 DinD보다 DooD 구조를 추천한다.

## DooD(Docker out of Docker) 구조

주 컨테이너 내부에 속하는 방식이 아니라, 병렬적으로 컨테이너를 둘 생성한 뒤, socket을 공유하는 방식이다.

아래와 같이 소켓을 공유한 컨테이너만 관리할 수 있다.

```bash
docker run -v /var/run/docker.sock:/var/run/docker.sock ...
```

🟢 DinD와 달리 유저그룹을 공유하지 않으므로, 하나의 컨테이너가 모든 컨테이너를 제어하는 보안 위험이 없다.

🔴 물론, volume의 디렉토리를 공유 시, 컨테이너 간의 자원이 공유 가능하므로 위험한것은 여전하다.
