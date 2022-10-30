---
title: docker-compose 개념
date: 2021-03-23 17:21:08 +0900
tags: docker CICD
layout: obsidian
is_Finished: false
last_Reviewed: 2022-10-30 17:21:08 +0900
use_Mathjax: false
---
## docker-compose

`docker-compose`를 이용한다면 여러 도커 컨테이너의 연계와 설정을 손쉽게 할 수 있다.

### docker-compose 설치

먼저 docker-compose를 깔기 위해 앞선 `Docker`가 설치되어야 있어야 한다.

- [Install Docker Compose CLI plugin | Docker Documentation](https://docs.docker.com/compose/install/compose-plugin/#install-the-plugin-manually) 참고(최신 버전으로 업데이트 되는 코드)

```bash
sudo curl -L https://github.com/docker/compose/releases/download/v2.6.0/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
```

만약, 무조건 최신의 docker-compose를 다운받고 싶다면

```bash
sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
```

만약 위 코드로 안된다면 그 위에 적어 놓은 링크를 참조해 보자.

```bash
sudo chmod +x /usr/local/bin/docker-compose
```

위 코드를 통해 `docker-compose`의 권한을 바꿔준다.

```dockerfile
version: '3'

services:

  nginx:
    container_name: nginx # 컨테이너명
    build: ./nginx # dockerfile 경로
    image: server_dev/nginx # 빌드 후 이미지명
    restart: always # 죽으면 재시작
    ports:
      - "80:80"
    volumes: # 컨테이너가 사용할 저장 공간, 이를 통해 컨테이너가 없어져도 저장 공간의 값은 남음
      - ./backend:/srv/docker-server/backend
      - ./log:/srv/docker-server/log/nginx
    depends_on: # 먼저 시작해야 하는 순서의 컨테이너
    - django

  django:
    container_name: django 
    build: ./backend
    image: server_dev/django
    restart: always 
    command: uwsgi --ini uwsgi.ini # Dockerfile의 CMD 명령문을 무시하고 실행할 명령어를 설정하기 위해서 사용됩니다.
    volumes: 
      - ./backend:/srv/docker-server/backend
      - ./log:/srv/docker-server/log/uwsgi 
```

위와 같이 `docker-compose.yml`을 설정할 수있다. 예제는 백엔드 서버와 웹서버를 연결하는 예제이다.

```bash
sudo docker-compose up -d --build
```

- `-d` : 백그라운드 실행

- `--build` : 새로 이미지를 빌드

위와 같은 커맨드로 Docker 컨테이너들을 한꺼번에 실행할 수 있고, 오류가 없다면 아래와 이 컨테이너가 실행된다. (예제는 꺼져있는 상태)

```bash
sudo docker-compose ps // 도커 컨테이너들의 목록 보기
NAME                COMMAND                  SERVICE             STATUS              PORTS
django              "uwsgi --ini uwsgi.i…"   django              exited (137)        
nginx               "/docker-entrypoint.…"   nginx               exited (0)
```

> 🔵 **로깅 설정 추천**
> 
> 참고로, 한꺼번에 컨테이너를 실행하면서 서버의 메시지가 콘솔에 겹쳐서 보이며, 데몬 상태로 실행중 일 때는 아예 보이지 않으므로, 디버깅을 위해 사용하는 기술 스택의 로깅을 제대로 설정하는 것이 좋다.
> 
> ```bash
> django  | [uWSGI] getting INI configuration from uwsgi.ini
> nginx   | /docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
> nginx   | /docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
> nginx   | /docker-entrypoint.sh: Launching /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh
> ```
> 
> 일반적으로 위와 같이 표시된다.