---
title: Django WSGI 기본
date: 2020-02-15 17:21:08 +0900
tags: django python BE
layout: obsidian
is_Finished: false
last_Reviewed: 2022-10-30 17:21:08 +0900
use_Mathjax: false
---
# WSGI(Web Server Gateway Interface)

## WSGI란?

**Django** 같은 Python 계열 웹 어플리케이션 서버에서 웹 서버와 통신할 때, 미들웨어로 작용하며,

- 웹서버와 웹 어플리케이션 서버의 호환성 관계없이 통신할 수 있게 해주고, 

- 여러 워커를 통해 요청을 동기적, 혹은 비동기적으로 빠르게 처리하게 도와준다. 

- 특히 Python으로 돌아가는 서버의 경우 python 코드를 불러와 로딩하는데 많은 시간이 걸리는데, 이를 **프리 포킹(pre-forking)**를 통해 미리 불러오고 공유하여 성능을 향상시킨다.

- 확장된 기능으로 Nginx와 같은 웹서버와 같은 역할을 맡기도 한다.

`Gunicorn`과 `uWSGI`가 존재하며, 추가로 비동기적 처리를 지원하는 `ASGI(Asynchronous Server Gateway Interface)`가 존재한다.

[Setting up Django and your web server with uWSGI and nginx](https://uwsgi.readthedocs.io/en/latest/tutorials/Django_and_nginx.html) 참조

## uwsgi 예제

```bash
pip install uwsgi
```

위 코드를 이용해 `virutalenv` 설정 후 다운로드한 후 아래와 같이 `uwsgi.ini` 설정 파일을 만든다.

```ini
[uwsgi]
socket = /srv/docker-server/movie_backend.sock 
// 생성할 소켓파일 위치 되도록이면 절대 위치 기입
master = true 
// 마스터 서버인가?
processes = 1
threads = 2

chdir = /srv/docker-server/
// 프로젝트 위치
module = movie_backend.wsgi
// django의 wsgi 연결 모듈 위치
logto = /var/log/uwsgi/uwsgi.log
// 로깅 장소
log-reopen = true 

vaccum = true
// 종료 시 관련한 생성 파일 삭제
```

- 기타 추가적인 설정은 [Configuring uWSGI &mdash; uWSGI 2.0 documentation](https://uwsgi-docs.readthedocs.io/en/latest/Configuration.html#loading-configuration-files) 확인

위 `uwsgi.ini`파일의 주석을 전부 지우고 프로젝트 폴더에 넣는다.

```bash
uwsgi --ini uwsgi.ini
```

`.ini`의 파일 경로를 제대로 설정하자.

```bash
Attaching to django, nginx
django  | [uWSGI] getting INI configuration from uwsgi.ini
```

**django**와 제대로 연결되었다면 상단과 같은 메시지가 나타나게 된다.
