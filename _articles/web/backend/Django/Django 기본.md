---
title: Django 기본
date: 2020-02-14 17:21:08 +0900
tags: django python BE
layout: obsidian
is_Finished: false
last_Reviewed: 2022-10-30 17:21:08 +0900
use_Mathjax: true
---
```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```



# django 프레임워크

## django의 개념
django 폴더 참조
- 다소 독선적
- 관용적
- 정적인 웹을 동적인 웹으로 바꿈
- 기본적인 구조, 필요한 코드를 제공해줌
- 유튜브, 나사, 인스타그램 등

## MVC(Model View Controller), MTV(Model Template View) 패턴
- MVC(model view controller) 패턴 : 모든 웹 서비스라면 모두 가지고 있는 디자인 패턴
- MTV(model template view) : 파이썬이 바꾼 이름, 힙스터 쉑 ㅋ
	- 모델: 데이터를 관리, 데이터 베이스 그 자체
	- 템플릿 : 사용자가 보는 화면, 
	- 뷰 : 중간 관리자 요청을 받아서 모델에게 데이터 찾으라고 명령하고 모델에게서 데이터를 받은뒤 템플릿으로 보냄

 ## django_intro 폴더 (프로젝트 폴더) 내부 파일
 \_\_init__.py : 패키지로 인식하게 해줌
 wsgi.py : 웹서버 게이트웨이 인터페이스
 settings.py : 여러가지 설정에 관련된 것
 urls.py : flask의 app.route 역할

 django-admin startapp pages : pages 폴더를 만듬 내부 구조는 상당히 유사함
 admin.py : 관리하는 공간
 apps.py : 엡에대한 설정
 models.py : 데이터베이스에 관련된 것 MㅇTV 관련
 testsp.py : 테스팅용
 views.py : 중간관리자 MTV 관련
 장고는 프로젝트 내부에 여러가지 앱을 만드는 형식

 settings.py의 Installed_Apps 란에 pages를 등록하면 앱을 등록하는 행위임 (커스텀은 맨위에 놓은 것을 권장, 이름이 같으면 맨위 리스트에 있는 것을 가져옴)

USE_I18N =  위에있는 Lanugate_code 를 사용할 것인가?	 

## django 생성법과 가상환경설정
```
1. mkdir 13workshop
2. cd 13workshop
3. python -m venv venv
4. source venv/Scripts/activate
5. pip install django
6. django-admin startproject classroom . (. 안찍으면 같은 이름의 폴더를 추가 후 생성)
7. python manage.py runserver
선택:
.gitignore 파일 안에 설정
django-admin startapp pages로 pages 앱 생성 (프로젝트 폴더 바깥에서?)
python manage.py startapp your_app_name (앱 생성 2)
```

가상 환경 설정 : 웹 디벨로핑에 필요한 모듈만 python에 쌓는것 (예를들어 jupyter 같은거 필요 없음)

python -m venv 폴더이름 : 처음 venv는 버전 환경(version environment)의 준말 해당 디렉토리에 폴더이름이 되어있는 가상환경을 만들어줌

 디렉토리 안에서 source 폴더이름/Scripts/activate 하면 (또는 거기서 그 파일을 클릭) (venv)라는 키워드가 터미널에 뜸
 안에서 쓸모없는 패키지가 없어짐
 deactivate 하면 다시 사라짐

 또는 vscode에서 f1으로 select interpreter을 고른후, venv 환경의  파이썬을 고르면 터미널에서 (venv)가 활성화 되어있음
 django-admin startproject django_intro . 로 현재 폴더에 프로젝트 생성 
 python manage.py runserver 로 서버 돌리기

django-admin startapp pages로 pages 앱 생성
python manage.py startapp your_app_name (앱 생성 2)

## django 앱 추가 방법
```
 대략적인 흐름 : 
1. urls.py에서 urlpatterns 리스트에 path("url이름/", views.url이름), 을 등록 , 2번째 views.url이름은 views.py에 올라가는 함수 이름임, 1번째 url 이름 뒤에 / 필수 (django가 자동으로 마지막에 /를 붙이므로 없으면 절대 접근할수 없음)
2. views.py에 url이름과 같은 함수(또는 1단계에 정의한 2번째 인자)를 정의 (request는 무조건 처음 인자에 포함), 
3. return으로 render(request, 'html이름', context), context는 넘겨줄 인자들의 dictionary, 
4. pages 폴더의 templates폴더내에 url이름.html에 파일 만들고 html 코드 구성, 
5. 인터넷에 해당 url로 가보면 완성
```
## url로 앱에 변수 넘겨주기 (variable routing)

```
https://서버주소/greeting/윤준석/
```
path('greeting/<str:name>/', views.greeting)
이런식으로 name 문자열을 넘겨줄 수 있음,
이러면 views.py에 함수를 만들때 매개변수로 name 을 문자열로 넘겨주면
웹 페이지 url을 통해 해당 변수를 넘겨주면 받을 수 있음
str이 아니라 int면 타입이 정수형으로 바뀜

path('mul/<int:num1>/<int:num2>', views.mul)
이런식으로 여러개의 인수를 넘겨줄 수도 있으며, 해당 매개변수들을 연산하려면 views.py의 함수 내에서 해야한다.
이런식으로 동적인 웹, 데이터베이스 ID에 따른 아이디에 따른 웹페이지 자동생성등에 쓴다.

### url namespacing
- url을 html 파일에 하이퍼링크로 넘겨줄 때, DTL을 이용하여 변수화해서 넘겨줄 수 있다.
> namspacing 예시와 기존의 url 할당법(밑)
```html
  <a href="{% url 'todos:index' %}">전체글보기</a> 
  <a href="/todos/new/">새로 게시글 작성하기</a>>
```
- 기존의 url 할당 법에서는 /를 맨 앞에 추가하면 root 주소 앞에 해당 주소를 추가한다는 의미이다
- /가 없다면 현재 주소에 추가로 /를 붙여서 추가한다는 의미이다
> 위 기존 url 할당법의 /가 없는 예시
```html
<a href="new/">새로 게시글 작성하기</a>
```
- 이렇게 하면 기존의 경로에 추가되는 형식, 이것을 신경 쓰기 힘드므로 변수화 (namespacing)한다.

- 네임 스페이싱을 위해 먼저 해당 앱의 앱 네임을 선언한다
> 앱네임 선언 예시(urls.py)
```python
from django.urls import path
from . import views

app_name = 'todos' # 일반적으로 앱 이름과 같은 이름을 넣음

urlpatterns = [
    path('', views.index, name="index"),
    path('new/', views.new, name="new"),# 폼 보여주기
    path('create/', views.create, name="create"), # 받은 폼의 정보를 저장하기
    path('<int:id>/delete/', views.delete, name="delete"), # 변수로 이용하면 여기서만 / 신경쓰면 됨
    # 끝에 /를 꼭 붙여주자.
]
```
- 이를 해주면 다른 앱에서 url 변수가 겹쳐도 문제가 생기지 않는다.
- 또한 변수화할 path 함수에 name에 변수명을 넣어주면 된다.
> variable routing 이 적용된 namespacing 예시
```html
<a href="{% url 'todos:delete' todo.id %}">삭제</a>
```
- 홑따옴표 쌍따옴표를 번갈아가서 쓰지 않아도 되나, 그러면 python 문법으로 인해 보기 흉해진다.(권장)
- "{% url '앱이름:url변수명' 매개변수1개, 매개변수 2개..%}"를 하이퍼링크로 넣어주면 된다.
-  variable routing일 경우 url 변수 넣기 알아보기 (todos의 index.html)
## DTL (django template language)
: jinja랑 문법이 상당히 비슷함

> for문 예시
```html
  {% for menu in menus %}
  <li>{{forloop.counter}} : {{menu}}</li>
  {% empty %}
  <p>리스트가 비어있습니다.</p>
  {% endfor %}
<!--forloop.counter:for내부에서만 사용가능함 반복 숫자 표시해줌 enumerate 처럼 쓸수 있음, 문장은 {% 사이에 스페이스바로 띄어서 %}, 변수는 {%안띄움%}
{% empty %}는 만약 해당 리스트가 비어있다면 아래 코드가 실행됨-->
```
- 만약 리스트의 원소에 인덱스로 접근하고 싶으면 {{변수.인덱스}}로 접근할 수 있다.
- ex) student.0
- forloop + first나 last를 치면 처음 원소나 마지막 원소일때 true를 반환한다.

> 조건문 예시	
```html
  <h3>조건문</h3>
  {% if '한식' in menus %}
  <p>역시 한국이라면 한식이지</p>
  {% endif %}
```
> 조건문과 else문, elif문, for문과의 중첩 예시
```html
  {% for menu in menus %}

  <p>{{forloop.counter}}번째 반복문 도는중...</p>
  {% if '한식' == menu %}
  <p>역시 한국인은 한식이지</p>
  {% elif '일식' == menu %}
  <p>이것도 불매 운동 해야하나?</p>
  {% else %}
  <p>{{menu}}</p>
  {% endif %}
  {% endfor %}
```
- DTL 내부에서는 괄호()를 쓸 수 없다.

- 왠만하면 판단은 views에서 먼저 하자

  

1) 함수 안에서 다른 페이지의 폼에서 입력한 데이터 받기 (딕셔너리 형태)

```
request.GET.get('name') 
```
- queryDict라는 새로운 형식이므로 GET을 통하여 평범한 dict로 만든 뒤, get() 메서드로 받는것

- url에는 _(언더바)를 쓰면 하이퍼링크 적용시 파란 아랫줄 때문에 안보이므로 왠만하면 -(하이픈)을 쓰자

```
<form action="/post-pong/" method="POST">
{% csrf_toekn %}
<input> 어쩌구 저쩌구	
</form>
```
- method 안넣으면 기본 GET 방식, 대소문자 구분 안함
- POST를 넣으면 좀더 안전하고 CSRF에 대비하므로 csrf_token 필요,
- 이때는 requset.POST.get('name') 방식으로 받아와야함
- {% csrf_token %}을 폼안에 넣어서 토큰 부여 하면 암호화? 같은게 됨
	- csrf_token = 랜덤한 문자열을 생성해줌 type="hidden"이 되어서 랜덤 문자열을 인증해줌

- 이러면 URL에 해당 데이터들이 보이지 않음, 개발자도구 헤더스에서의 formdata에서  확인 가능
- GET은 보내주세요, POST는 처리해주세요 라는 의미
- GET : 서버의 데이터를 변화시키지 않음
- POST : 서버의 데이터를 변화시킴 (대부분의 데이터 이용에 적합)
CSRF : 사이트간 요청 위조 공격,  

##  static 키워드로 파일가져오기, static 하다 : 변화가 없다

> base.html block 설정
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
<h1>Base is everywhere!</h1>
{% block body1 %}
{% endblock %}  
{% block body2 %}
{% endblock %}  
</body>
</html>
```
- 파비콘(favicon) : 웹페이지 이름 옆에 있는 작은 아이콘
	> 파비콘 추가 방법
	```html
	앱 내부에 static 폴더 생성, 그 내부에 파비콘으로 쓸 이미지 파일 추가
	html 파일 맨 위에 맨 위줄에{% load static %} 추가
	html header에 <link rel="icon" href="{% static 'static폴더 내의 파일 이름.파일확장자' %}"> 추가(ico, png 확장자 지원)	
	```
	
> static 키워드의 사용과 block 사용
```html
{% extends 'base.html' %} # base.html에서 block을 가져온다는 의미 한 파일에 1개만 허용
{% load static %} 
<!--폴더 경로는 앱 내의 static폴더의 css폴더 내부-->
{% block body1 %} # body1 block 가져오기
<link rel="stylesheet" href="{% static 'css/style.css' %}">
<h1>본오본오</h1>
<img src="{% static 'image/feelthethunder.jpeg' %}" alt="">
{% endblock %} # body1 block 닫기
{% block body2 %}# body2 block 가져오기
{% endblock %}# base.html에 2개이상 정의햇을 경우
```
- 장고 문법에서 static은 변하지 않을 정보에 붙여서 가져오는데 쓴다.
- 대부분 서버를 껏다 켜야지 변화가 적용됨, 예외도 있음
- load static을 extends 밑에 써서 키워드를 사용할수 있게 가져와야한다.
- 보통 관례상 폴더 이름은 static으로 한다.

3) 만약 다른 앱에도 같은 URL의 path가 있다면 어떻게 할 것인가?

> master urls.py, 프로젝트 폴더에 있는 urls.py
```
from django.contrib import admin
from django.urls import path, include # django.urls 패키지에 include 꺼내옴
from pages import views

path('pages/', include('pages.urls')), # pages 폴더의 서브 urls.py의 url들을 가져온다, include는 해당 폴더의 해당 파일을 가져오는 함수
path('utilities/', include('utilities.urls')), # utilities 폴더의 서브 urls.py의 url들을 가져온다
```
> sub urls.py, pages 폴더(앱)안에 있는 urls.py
```
from django.urls import path
from . import views # . 현재 폴더

urlpatterns = [
    path('ping/', views.ping),
    path('pong/', views.pong),
    path('post-ping/', views.post_ping),
    path('post-pong/', views.post_pong),
    path('static-example/', views.static_example),
]
```
- 만약 pages의 ping url에 접근하고 싶으면 https://서버 주소/pages/ping/ 으로 접근 가능하다.

- 마스터 urls.py가 pages의 urls.py로 권한과 요청을 넘기는 형식

### SQL ORM
#### DB
- 데이터들의 모임
- 열, 칼럼, 각 열에는 고유한 데이터 형식이 지정됨, 데이터의 속성
- 행, 레코드, 1개의 데이터
- 스키마, 틀 각 열의 요소, 즉  들어갈 데이터의 내용을 정의함
#### ORM(Object-Relational Mapping)
- SQL이 몰라도 파이썬 문법으로 하는 데이터베이스 언어, 파이썬 언어(초안, 청사진)을 SQL 문으로 해석해줌, 중간 번역자

### CRUD

- C: CREATE, 데이터 생성
- R: READ, 데이터 읽기
- U: UPDATE, 데이터 변경
- D: DELETE, 데이터 지우기
- 데이터로 할 수 있는 4가지

#### ORM 사용법과 GIT BASH 명령어
django-admin startapp posts : 앱 생성

> Student 모델 생성 예시 (앱 내부의 models.py)
```python
from django.db import models

# Create your models here.

class Student(models.Model):
# 각각 colum 정의
    name = models.CharField(max_length=64)
    email = models.CharField(max_length=128) # 할당할 메모리(max_length) 설정
    birthday = models.DateField()
    age = models.IntegerField()

    def __str__(self): # str 오버로딩하면 데이터베이스에 보여줌
        return f'이 학생의 이름은 {self.name}'

```
- model을 바꾸면 다시 migrate를 해줘야 업데이트 되며 왠만하면 바꿔주지말자 (기존에 이미 추가된 데이터들이 말썽을 부린다. 보통 다 날리고 다시 만듦 먼저 모델링 하자!)

python manage.py makemigrations : 모델의 0001_initial.py 생성 (번역기로 번역 보내기) (일종의 데이터 표의 헤더 만들기)

```
Migrations for 'posts':
  posts\migrations\0001_initial.py
    - Create model Post
 # 이렇게 뜸
````
python manage.py migrate: 파이썬 코드를 SQL 언어로 해석함 (번역본 DB로 보내 명령하기) (일종의 데이터 엑셀 표 만들어 놓기 공간만들기)
python manage.py shell (작은 IDE? exit()로 나감) 에서 만든 클래스를 인스턴스화

> 데이터베이스 데이터 추가 구문
```
post1 = class이름() 또는 post1 = class이름(열요소="내용",열요소2="내용2")
```
> 데이터베이스 데이터 추가 및 변경 구문
```
class인스턴스.save() 
```
하면 SQL에 해당 인스턴스 저장, 또는 데이터 수정 이후 그 객체는 자신이 설정한만큼 데이터속성을 가짐
> 데이터 삭제 구문
```
class인스턴스.delete() 하면, 해당 데이터 삭제됨
```

Post.objects.all() : Post 클래스의 모든 객체를 출력 all(1)하면 QuerySet의 1번째 요소를 가져옴
Post.objects.get() : 1개의 데이터 객체만 가져옴, get()매개변수에 id=1하면 id가 1인 객체, title="내용" 하면 title안에 "내용"인 데이터 객체, 일치하는 객체가 2개 이상 있으면 에러냄
Post.objects.filter() : 괄호안에 조건과 일치하는 모든 데이터를 가져옴 ex) title="hello", 인 모든 객체 가져옴

SQlite 익스텐션 깔고 SQLite explorer에서 클릭하여 데이터베이스를 클릭할 수 있음
django_extensions 패키지 = 알아서 데이터베이스의 정보를 임포트 해옴
id는 지워져도 해당 아이디는 다시 쓰이지 않음,
query= list의 성질과 거의 비슷함

### admin 생성하기
```
python manage.py createsuperuser
```
유저 네임, 이메일 어드레스, 패스워드 입력, 패스워드 확인 후
```
http://서버주소/admin
```
이 곳에서 들어가서 로그인 하면 관리자 페이지로 감

from .models import 대상 모델

```python
# admin.py에서 
admin.site.register(대상 모델)
```
이후 다시 관리자 페이지로 들어가면 대상 데이터 베이스가 올라가 있고, 내용 확인 가능
```python
from django.shortcuts import redirect

return redirect('/url/')
# 가고싶은 서버내 웹페이지로 보냄
```
MODEL.objects.order_by('요소').all() : 해당 요소의 정렬 순으로, 반대로 원할 경우 '-요소'로 넣기



### QnA 달기

foreign key = 댓글이 가지고 있는 외래 아이디, 질문의  id를 가지고 있어서 해당 질문에 속하게 만들 수 있다

> answer 모델 예시
```
class Answer(models.Model):
    content = models.CharField(max_length=100)
    # CASCADE : question이 사라지면 그 밑에도 모두 지우겠다는 의미
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
```
- restfull한 url : 현재 경로와 자원이 표시되어있는 url

> main 페이지
```html
{% extends 'base.html' %}
{% block body %}
{% for question in questions %}
<h1>{{question.title}}</h1>
<p>{{question.user}}</p>
<p>{{question.content}}</p>
<form action="/questions/{{question.id}}/answers/create/">
  <input type="text" name="content">
  <input type="submit">
</form>
{% for answer in question.answer_set.all %} <!--models.ForeignKey가 만들어준 answer_set 함수, 이를 통해 이 question 모델을 foreignkey로 가지고 있는 모든 answer 모델을 찾아올 수 있다.-->
<p>{{answer.content}}</p>
{% endfor %}
<hr>
{% endfor %}
{% endblock %}
```


## ERD ( Entity Relationship Diagram)
vscode = U 아직 깃에 안올라갔다. M : 무언가 바뀌었다. A: add 됬다.
git add (올릴파일이나 폴더)
git status (commit한 상태 보기)
git restore --staged (add 취소할 파일)
Nosql : 

## if 문을 이용한 restfull한 웹코딩
> urls.py
```python
...
path('add/', views.add, name="add" ), # if 분기로 하나의 경로로 2가지 방식의 일을 처리(중요)
path('<int:id>/update/', views.update, name="update"),
```
> restfull code 예시 (create와 new path를 합친 add path)
```python
def add(request): # if 분기로 하나의 경로로 2가지 방식의 일을 처리, form에 action=''이면 자기자리로 돌아가는 것을 이용(restfull한 코드))(중요)
    if request.method == "POST": # method가 post로 보내지면 create로     
        author = request.POST.get('author')
        title = request.POST.get('title') # url로 보내는 것은 무조건 get 방식 
        content = request.POST.get('content')
        due_date = request.POST.get('due-date')   
        todo = Todo.objects.create(author=author, title=title, content=content, due_date=due_date)

        return redirect('todos:index') # /있으면 루트주소에 추가, 없으면 현재 주소 앞에 추가
    else:   # Get방식이면 데이터를 form으로 받는 new로
        return render(request, 'add.html')
```
- django는 보내는 method로 delete와 put은 지원 안함(HTTP5도 지원 안함)
-  다른 프레임워크에서 일단 post로 보내고 delete put을 넣을 때는 input type= hidden에  name='_method', value="DELETE" 로 숨겨서 보냄 (HTTP5가 지원 안하므로)
- restfull한 코딩을 하려면 주소창에 동사는 빼고 명사로만 쓰며, 동사는 method 방법을 바꿔서 해결
- 다른 프레임 워크는 http verb라는 개념도 있다.
> add.html 
```html
{% extends 'base.html' %}

{% block body %}
<form action="" method="POST"> 
  {% csrf_token %}
  작성자 : <input type="text" name="author">
  제목 : <input type="text" name="title">
  내용 : <input type="text" name="content">
  마감일 : <input type="date" name="due-date">
  <input type="submit" value="저장">
</form>
{% endblock %}
<!--먄약 기본값 value를 정하고 싶으면 <input type="date" name="due-date" value="{{todo.due_date|date:'Y-m-d'}}"> 이런식으로 -->
```
- post, get 방식을 이용해 이 폼(add.html) 하나를 수정할 때 쓰는 폼으로도 사용할 수 있다.
## django 이미지 업로딩과 이미지 리사이징
### 이미지 보여주기
1. 위 static 부분의 favicon 부분 참조
#### fontawesome 이용하기
1. 먼저 fontawesome 홈페이지에가서 로그인한다.
2. 키를 발급받고 script를 html 폴더의 header안에 넣는다.
```html
<script src="https://kit.fontawesome.com/e87731a046.js" crossorigin="anonymous"></script>
```
3. 원하는 곳에 원하는 아이콘 태그를 삽입한다.
```html
<i class="fas fa-chess-knight">
```
### 이미지 업로딩
1. 먼저 앱 내부의 models.py에서 데이터베이스 모델을 만든다.
> models.py 파일
```python
from django.db import models

# Create your models here.
class Feed(models.Model):
    content = models.CharField(max_length=150); 
    created_at = models.DateTimeField(auto_now_add=True) # 자동으로 현재 날짜 입력
    image = models.ImageField() 
```
-이를 makemigrations하려하면 다음과 같은 오류가 뜰 수 도 있다.
```git bash
You are trying to add a non-nullable field 'img' to todo without a default; we can't do that (the database
needs something to populate existing rows).
Please select a fix:
 1) Provide a one-off default now (will be set on all existing rows with a null value for this column)
 2) Quit, and let me add a default in models.py
Select an option:
```
- 이 때는 db에서 해당 모델을 날리고 다시 makemigrations하면 된다. 앱 내부의 migrations 폴더 내부의 (ex)0001_initial.py)
1) 
2. 
### 이미지 리사이징

인스톨 필요한 패키지 : django-imagekit, Pillow, IPython



## django form을 이용한 자동 폼 생성
### django form 선언
#### models.py
```python
from django.db import models

# Create your models here.
class Movie(models.Model):
    title = models.CharField(max_length=50)
    title_en = models.CharField(max_length=50)
    audience = models.IntegerField()
    open_date = models.DateField()
    genre = models.CharField(max_length=50)
    watch_grade = models.CharField(max_length=50)
    score = models.FloatField()   
    poster_url = models.TextField()
    description = models.TextField()

class Comment(models.Model):
    content = models.TextField()
    movie = models.ForeignKey(Movie,on_delete=models.CASCADE)
    class Meta:
        ordering = ('-id',) # 정렬을 id의 역순(-)으로 출력 , ,꼭 필요
```
#### form.py
```python
from django import forms
from .models import Movie, Comment

class MovieForm(forms.Form): # forms.Form 상속
    title = forms.CharField(max_length=50)
    title_en = forms.CharField(
                    max_length=50,
                    label="영문 제목", # 기본값에서 원하는 라벨이름 바꿔줌
                    widget=forms.TextInput(
                        attrs={
                            'placeholder': '영문제목을 입력해주세요',
                        }
                    )
                )
    audience = forms.IntegerField()
    open_date = forms.DateField(widget=forms.DateInput(attrs={'type':'date'}))
    genre = forms.CharField(max_length=50)
    watch_grade = forms.CharField(max_length=50)
    score = forms.FloatField()   
    poster_url = forms.CharField(widget=forms.Textarea) # textarea로 바꿔줌, django가 charfield를 기본으로 잡고 있어서 이거 써야함
    description = forms.CharField(widget=forms.Textarea)
    # widget: 여러가지 커스터마이징을 하게 해줌 attrs, html tag에 값을 추가해줌

class MovieModelForm(forms.ModelForm): # Model에 관계있는 Form으로 상속, 자동으로 모델 내부의 column 만큼 폼을 만들어줌
    open_date = forms.DateField(widget=forms.DateInput(attrs={'type':'date'})) # 이런 방법으로 일부는 다른 방식으로 만들어낼 수 있음 오버라이딩?    
    class Meta: # 속성으로 만들면 column으로 인지하므로 class 객체로 만들어야 함
        model = Movie # 모델 입력
        fields = '__all__' # 전부

class CommentModelForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ('content',) # 출력할 부분만 tuple로 넣어주면 됨, 끝에 ',' 무조건 넣어야함
```
- 이것을 이용하여 form을 자동 생성할 수 있다.
- ModelForm을 이용하면 form input 요소 또한 자동으로 만들어 준다.
### django form 이용
#### form.html
```html
{% extends 'base.html' %}
{% load bootstrap4 %}
{% block body %}
  {% if request.resolver_match.url_name  == "create_model_form" %} {% comment %} 현재 사이트로 정보를 보낸 views.py에서 정의한 함수 이름을 가져옴 {% endcomment%}
    <h1>Create</h1>
  {% else %}
    <h1>Update</h1>
  {% endif %}
  <form action="" method="POST">
    {% csrf_token %}
    {% bootstrap_form form %}
    {% buttons submit="제출" %}
    {% endbuttons %}

    {% comment %}
    # html {{form.as_p}}하면 p태그로 묶여서 출력됨
    # as_ul 하면 ul 태그로 묶여서 출력됨
    # as_table * table 태그안에 넣으면 * 테이블 형태로 출력
    # {{form.title.label_tag}} 하면 해당 요소 이름의 label이 생김

    <table>      
      {{form.as_table}}
    </table>
    <input type="submit">
    {% endcomment %}

  </form>
    {% endblock %}
```
#### base.html
```python
{% load bootstrap4 %} {% comment %} 현재 페이지에서만 동작함 다른 block은 extends 아래 block위에서 할 것 {% endcomment%}
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>formmovie</title>
  {% bootstrap_css %}
</head>
<body>
  <a href="{% url 'movies:index' %}">홈</a>
  <a href="{% url 'movies:create' %}">글쓰기</a>
  <a href="{% url 'movies:create_model_form' %}">글쓰기(모델폼)</a>
  <div class="container">

    {% block body %}
    {% endblock %}
  </div>
  {% bootstrap_javascript jquery='full' %}
</body>
</html>
```
- pip install django-bootstrap4 이후, settings.py의 INSTALLED_APPS에 'bootstrap4',를 추가하고, {% load bootstrap4 %}를 추가하여 사용한다.
- 이외에도 {% bootstrap_javascript jquery='full' %}, {% bootstrap_css %}를 각각 body와 header에 추가하여야 한다.
- {% comment %} 를 이용하면 DTL이 무시하는 주석을 달 수 있다.{% endcomment%}
#### detail.html
```python
{% extends 'base.html' %}
{% load bootstrap4 %}
{% block body %}
<br>
{{movie.title}}
{{movie.title_en}}
{{movie.audience}}
{{movie.open_date}}
{{movie.poster_url}}
<form action="{% url 'movies:delete' movie.id %}" method="POST">
  {% csrf_token %}
  <input type="submit" value="삭제(post)">
</form>
{% comment %}
<a href="{% url 'movies:delete' movie.id %}">삭제해라 애송이</a>
요것은 주석 다는방법
{% endcomment %}
<a href="{% url 'movies:update' movie.id %}">수정</a>
<a href="{% url 'movies:update_model_form' movie.id %}">수정(모델폼)</a>
{% for comment in movie.comment_set.all %}
  {{comment.content}}
  <a href="{% url 'movies:comment_delete' movie.id comment.id %}">삭제</a>
  <br>
{% endfor %}
<form action="{% url 'movies:comment_create' movie.id %}" method="POST">
  {% csrf_token %}
  {% bootstrap_form comment_form %} 
  {% comment %}
  forms.py에서 field=(content,) 도 가능하지만
  이방법도 됨
  {% bootstrap_form comment_form exclude='movie'%}
  {% endcomment %}
  {% buttons submit="제출" %}
  {% endbuttons %}
</form>
{% endblock %}
```
#### views.py
```python
from django.shortcuts import render, redirect, get_object_or_404
from .forms import MovieForm, MovieModelForm, CommentModelForm
from IPython import embed # 웹 디버깅용
from .models import Movie, Comment
# Create your views here.
def index(request):
    movies = Movie.objects.all().order_by('-id') # all() 생략가능
    context = {
        'movies': movies
    }
    return render(request, 'index.html', context)

def create(request):
    if request.method == "POST":
        form = MovieForm(request.POST)       
        if form.is_valid(): # 백엔드에서 한번 더 검증
            movie = Movie() # form.cleaned_data : 검증이 완료, 가공이 완료된 데이터 (앞의 빈공간을 지우는 등의 행동)
            movie.title = form.cleaned_data.get('title')
            movie.title_en = form.cleaned_data.get('title_en')
            movie.audience = form.cleaned_data.get('audience')
            movie.open_date = form.cleaned_data.get('open_date')
            movie.genre = form.cleaned_data.get('genre')
            movie.watch_grade = form.cleaned_data.get('watch_grade')
            movie.score = form.cleaned_data.get('score') 
            movie.poster_url = form.cleaned_data.get('poster_url')
            movie.description = form.cleaned_data.get('title_en')
            movie.save()
            return redirect('movies:index')
    else:
        form = MovieForm()
    context = {
        'form' : form
    }
    return render(request, 'form.html', context)

def detail(request, id):
    # movie = Movie.objects.get(id=id)
    movie = get_object_or_404(Movie, id=id) # 잘못된 접근이면 404 에러를 뜨게 해줌
    comment_form = CommentModelForm()

    context = {
        'movie': movie,
        'comment_form': comment_form,
    }
    return render(request, 'detail.html', context)

def delete(request, id):
    movie = get_object_or_404(Movie, id=id)

    if request.method == "POST": # POST 요청일 시에만 삭제가 가능하도록 만듦 (즉 url을 통한 접근이 아닌 정상적인 접근일시)
        movie.delete()
        return redirect("movies:index")
    else:
        return redirect("movies:detail", id)

def update(request, id):
    movie = get_object_or_404(Movie, id=id)
    if request.method == "POST":
        form = MovieForm(request.POST)
        if form.is_valid():
            movie.title = form.cleaned_data.get('title')
            movie.title_en = form.cleaned_data.get('title_en')
            movie.audience = form.cleaned_data.get('audience')
            movie.open_date = form.cleaned_data.get('open_date')
            movie.genre = form.cleaned_data.get('genre')
            movie.watch_grade = form.cleaned_data.get('watch_grade')
            movie.score = form.cleaned_data.get('score') 
            movie.poster_url = form.cleaned_data.get('poster_url')
            movie.description = form.cleaned_data.get('title_en')
            movie.save()
            return redirect('movies:detail', id)
    else:
        form = MovieForm(initial=movie.__dict__) # initial과 해당 객체의 __dict__를 이용해 기존 데이터를 가져올 수 있음
    context = {
        'form': form,
    }
    return render(request, 'form.html', context)

def create_model_form(request):
    if request.method == "POST":        
        form = MovieModelForm(request.POST)
        if form.is_valid():
            movie = form.save() # form.save()는 movie 객체를 리턴한다.
            return redirect('movies:detail', movie.id)
    else:
        form = MovieModelForm()
    context = {
        'form': form
    }
    return render(request, 'form.html', context)

def update_model_form(request, id):
    movie = get_object_or_404(Movie, id=id) # Movie 모델의 id값이 id인 객체를 가져와라
    if request.method == "POST":
        form = MovieModelForm(request.POST, instance=movie) # 이런 방법으로 과거의 정보와 수정된 이후의 정보도 가져올 수 있음
        if form.is_valid(): # 이를 통해 그 두가지 정보를 검증할 수 있음
            form.save()
            return redirect('movies:detail', id)
    else:
        form = MovieModelForm(instance = movie) # modelForm을 상속 받은 form은 instanace로 해야함

    context = {
        'form': form
    }
    return render(request, 'form.html', context)

def comment_create(request, movie_id):
    movie = get_object_or_404(Movie, id=movie_id)
    if request.method == "POST":
        form = CommentModelForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False) # 바로 save하지 않고 기다림
            comment.movie = movie # movie 정보 주입
            comment.save() # save함
            return redirect('movies:detail', movie_id)
        else:
            return redirect('movies:detail', movie_id)
    else:
        return redirect('movies:detail', movie_id)

def comment_delete(request, movie_id, comment_id):
    comment = Comment.objects.get(id=comment_id)
    comment.delete()
    return redirect('movies:detail', movie_id)

#
```
- POST 접근과 GET 접근의 차이를 이용하여 valid한 접근 구별가능
- Form을 이용하여 update구현