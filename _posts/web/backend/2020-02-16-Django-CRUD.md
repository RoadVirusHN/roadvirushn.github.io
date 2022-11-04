---
title: Django CRUD
date: 2020-02-16 17:21:08 +0900
tags: django python backend
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
# Django CRUD(Create, Read, Update, Delete ) 만들기
## Django 프로젝트 생성과 가상 환경 설정
1. mkdir 대상폴더이름, cd 대상폴더 이름으로 폴더를 생성하고 이동한다
2. python -m venv venv로 해당 디렉토리에 폴더이름의 가상환경을 만들어줌 
3. source venv/Scripts/activate로 터미널을 가상환경에 들어가게 한다. (deactivate로 나감)
	- 또는 vsCode에서 f1으로 select interpreter를 통하여 가상환경 들어가기 가능
4. pip install django로 가상환경 내에 django를 설치한다.
5. django-admin startproject 프로젝트명 . 으로 현재 폴더 내에 프로젝트를 만든다
	- 마지막 .이 없으면 프로젝트명으로 된 폴더를 만들고 그 내부에 만들게 된다.
6. python manage.py runserver로 서버를 돌리고 확인해본다.
	- http://127.0.0.1:8000/ 가 기본 주소 , 터미널에서 Ctrl + C로 서버를 닫는다
	- 터미널에 code .을 치면 해당 디렉토리로 VS Code IDE가 켜짐(버그 있음)
## Django 앱 생성과 추가
1. 대상 폴더(보통 프로젝트 폴더와 동일 위치)에서 django-admin startapp 앱이름 으로 앱 생성	
	- python manage.py startapp 앱이름 으로도 가능
2. 프로젝트명 폴더 내부의 settings.py의 INSTALLED_APPS 리스트에 앱이름을 추가
	- 보통 커스텀 app은 맨 위에 놓으며 동명일시 맨 위의 app이 우선이다.(',' 추가 주의)
	> myCRUD 프로젝트 폴더 내부의 settings.py의 일부
	```python
	# Application definition
	
	INSTALLED_APPS = [
    'CRUD', # 앱 이름
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]
	```
3. 동일한 폴더의 urls.py 파일 내부의 urlpatterns 리스트에 path()함수를 이용해 해당 앱 URL 추가
	- 보통 path('앱이름/', include('앱이름.urls')), 를 추가한다 (뒤의 / 추가 필수!)
	- 굳이 앱이름을 쓸필요 없지만 관례와 효율 상 그렇게 한다.
	- include()함수는 django.urls에서 임포트 해온다.(from django.urls import path, include)
	> 프로젝트 폴더의 urls.py의 일부
```python
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('CRUD/', include('CRUD.urls')),
]
```
4. 해당 앱 폴더 내부에 urls.py 파일을 생성하고, urlpatterns 리스트를 만든다
5. 필요 모듈들 (django.urls의 path함수, 해당 폴더(.)의 views 파일 등)을 임포트
> 앱 폴더 내부의 새로만든 urls.py 예시
```python
from django.urls import path
from . import views

app_name = 'CRUD' # 일반적으로 앱 이름과 같은 이름을 넣음

urlpatterns = [
    path('create/', views.create, name="create"),
    # variable routing + namespacing
    path('<int:id>/update/', views.update, name="update"),
    # 기타 필요한 path 추가
]
```
## model에 데이터베이스 모델 추가
1. 해당 앱 폴더 내부의 models.py 파일에 원하는 이름의 모델 클래스를 만든다.
	- 이 클래스는 models.Model을 상속받아야한다.
2. 내부의 클래스 변수로 각각의 정보 필드를 설정한다.
	- models.CharField(max_length=)는 보통 짧은 내용의 문자열 정보에 사용하며, max_length라는 최대 저장 공간을 미리 할당해줘야 한다.
	- models.TextFiled()는 보통 본문 같은 긴 길이의 문자열 정보에 사용, max_length 할당이 필요 없다
	- models.DateField()는 날짜와 시간 정보에 사용한다.
	- models.BooleanField()는 참, 거짓으로 구분하는 정보에 사용한다.
> 해당 앱 폴더의 models.py 예시
```python
from django.db import models

# Create your models here.
class TODO(models.Model): # models.Model 상속해주기 필수
    title = models.CharField(max_length=50)
    content = models.TextField()
    due_date = models.DateField()
    check = models.BooleanField()
    
    def __str__(self): # __str__을 오버로딩하면 admin의 데이터베이스에 가시성좋게 보여줄 수 있다.
        return f'{self.due_date}까지 {self.title}일을 해야합니다. 내용 : {self.content}, 행동 여부 : {self.check}'
```
- 해당 데이터필드의 종류를 잘 설정해줘야, 나중에 form 자동 생성기능을 사용할 때 적절하게 생성된다.
3. 모델이 완성되면 터미널에서 python manage.py makemigrations를 통하여 모델을 SQL 번역기로 보낸다. (일종의 데이터표 헤더 만들기)
	- 이때 0001_initial.py가 생성되며, 지우면 다시 만들어줘야 한다.
4. python manage.py migrate를 통해 SQL로 해석한다. (일종의 데이터 표 그리기)
	- 이때 모델링을 신중히하여 나중에 모델을 수정하는 일을 없도록 하자.
	- 모델링 수정시 해당 모델 파일(0001_initial.py)를 지우고 다시 만들어야 한다.
	- 만약 기존에 데이터베이스에 해당 모델의 정보가 있으면 문제를 일으킨다. (다 지우고 새로 바꿔주는게 나음)
## 기본 html 파일 설정
1. 해당 앱 폴더 내부에 templates 라는 이름으로 새 폴더를 만든다.
2. 내부 폴더에 base.html을 만들고 !+tab으로 기본 형식을 잡는다.
3. \<body>태그 사이에 {% block body %}와 {% endblock %} DTL 문법을 넣는다.
	- 이때 원한다면 bootstrap을 추가하거나 여러가지를 꾸민다.
> base.html 파일 예시
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>MyOwnSuckyBulletin</title>
</head>
<body>
  {% block body %}
  {% endblock %}
  {% block body2 %}
  {% endblock %}
  <!--이런 식으로 2개 이상 놓을 수도 있다.-->
  <!--html 주석 달기, 하지만 DTL과 충돌이 일어날 수 도 있다. -->
</body>
</html>
```
4. base.html과 같은 폴더에 index.html 파일을 만들어준다.
5. {% extends 'base.html' %}, {% block body %}, {% endblock %}를 통하여 base.html의 템플릿을 가져온다.
	- body라는 이름을 바꾸면 다른 위치의 템플릿을 가져올 수 있다.
	- 하지만 2개이상의 템플릿을 가져오는 것은 할 수 없다.
6. 해당 폴더의 urls.py의 urlpatterns에 메인 페이지 표시를 위한 path를 추가한다.
7.  해당 폴더의 views.py에 index 함수를 만들고 추가한 모델들을 정렬 후 변수에 집어넣는다.
8. index 함수로 index.html 파일로 데이터를 넘겨주고 출력하는 html 코드를 만든다.
> urls.py의 일부(앱 내부 폴더)
```python
urlpatterns = [
    path('', views.index, name="index"), #todos의 메인 페이지 url을 의미
    ]
```
> views.py (앱 내부 폴더)
```python
from django.shortcuts import render
from .models import TODO
# 이용할 모델을 models.py에서 가져와야 한다.
# Create your views here.
def index(request): # request는 요청자가 보낸 정보들이 담겨져있다.
    todos = TODO.objects.order_by('due_date').all() # 날짜순으로 정렬
    context = { # context라는 딕셔너리 형태로 넣어주어야 한다.
        'todos': todos,
    }
    return render(request, 'index.html', context) 
# render 함수는 정보와 html 코드, 가공된 정보를 가지고 사람들에게 보여줄 페이지를 만들어준다. 
```
- 모델 클래스 내부의 함수들
	- 모델.objects.all(count) : 클래스의 모든 객체를 출력, count를 빈칸으로 놓지 않으면, count번째 요소를 가져온다.
	
	- 모델.objects.get(id=count, title="content"): 1개의 데이터 객체만 가져온다. id에 값을 지정하면, id가 1인 객체 하나, content를 지정하면 해당 content를 title로 가지고 있는 데이터 객체를 가져온다. 일치하는 객체가 2개 이상 있으면 에러가 발생한다.
	
	- 모델.objects.filter(title="hello") : 괄호안에 조건과 일치하는 모든 데이터를 가져옴 ex) title="hello", 인 모든 객체 가져옴
	
	- 모델 객체.delete() : 해당 모델 객체 삭제
	
	- 모델객체 = 모델이름(열요소=내용,열요소2=내용2) : 모델 객체 생성
	
	- > 모델 객체 생성 2
	- ```python
	  모델객체 = 모델이름()
	  모델객체.열요소1 = 내용
	  모델겍체.열요소2 = 내용
	  모델객체.save() # 모델 객체 적용
	  ```
	- 이 방법으로 모델객체 생성을 다른 타이밍에 할 수 있다.
> index.html (앱 내부 templates 폴더 내부)
```html
{% extends 'base.html' %} <!--base.html의 템플릿을 가져옴-->
{% block body %}	<!-- base.html의 구멍을 선택-->
	{% for todo in todos %} <!-- DTL for문 구문-->
	제목 : <h1>todo.title</h1> <!-- 각 todo 객체의 내용물 보여주기-->
	내용 : <h2>todo.content</h2>
	날짜 : <h3>todo.due_date</h3>
	체크 : <h3>todo.check</h3>
	{% endfor %}<!-- for문, 꼭 끝을 알릴것 -->
{% endblock %} <!-- block의 끝 -->
```
## Django Create 생성
1. 앱의 urls.py의 urlpatterns 리스트에 url이름, views의 함수, url 변수명을 할당해 넣는다.
> 앱 폴더 내부의 urls.py의 urlpatterns 예시
```python
urlpatterns = [
    path('create/', views.create, name="create"),
    #뒤의 name은 namespacing으로, url대신 쓸 이름
    # 기타 필요한 path 추가
]
```
2. 해당 앱 폴더 내부에 views.py 파일로 가서 위 path함수의 2번째 인자인 함수명을 만든다. (일반적으로 url 이름과 같다.)
> 앱 폴더 내부의 views.py의 create 함수 예시
```python
from django.shortcuts import render, redirect # redirect와 render를 사용하기 위해 임포트 해야한다.
from .models import TODO # 사용할 모델 또한 불러와야함

def create(request):
    if request.method == "POST": # 만약 form의 method가 Post인채로 보내지면?
    # 그렇다면 정보를 저장하고 데이터베이스에 올리고 메인 페이지로 돌려보냄
        check = request.POST.get('check') # check 되면 'on'을 리턴함
        if check == 'on':
            check = True
        else:
            check = False
        title = request.POST.get('title')
        content = request.POST.get('content')
        due_date = request.POST.get('due-date')
        # todo = TODO()
        # todo.check = check
        # todo.title = title
        # todo.content = content
        # todo.due_date = due_date
        # todo.save() # 똑같은 기능을 하는 코드
        # 더 길지만 대신 save()를 이용해 todo 객체의 생성 타이밍을 원하는 시간에 할 수 있음
        todo = TODO.objects.create(check=check, title=title, content=content, due_date=due_date)
        return redirect('CRUD:index') # /있으면 루트주소에 추가, 없으면 현재 주소 앞에 추가
    else: # form의 method가 Get이라면?
    # 그렇다면 todo 정보를 입력하는 페이지로 보내야함
        return render(request, 'create.html')
```
- 기본 정보 method는 GET방식이다. 사용자가 새로운 글을 쓰기 위해 create url로 들어오면 GET방식이므로 crete.html이 만드는 페이지로 가서 정보 입력창으로 간다.
- 정보를 모두 입력하고 사용자가 method를 POST 방식으로 설정한 폼에서 submit 버튼을 누르면, POST 방식으로 정보가 들어오므로 TODO 객체를 만들고 메인페이지로 돌아간다.
- 이런 식으로 하나의 url 주소에서 받은 정보 유형에 따라 다르게 동작하게 만들어 효율적인 웹 코딩을 구현한 것이 restfull한 웹 코딩이라고 부른다.
- 다른 프레임워크는 delete와 put 형식의 method도 지원하나 django와 HTML5는 공식적으로 지원하지 않고 있다. 이외에 인기있는 http verb 라는 개념도 지원안함
- HTML5도 공식적으로 지원하지 않으므로 delete와 put형식으로 보낼 때는 새로 input 태그를 만들어, type= hidden에  name='_method', value="DELETE" 로 숨겨서 보냄
3. templates 폴더에 create.html을 만든다.
> create.html 예시
```html
{% extends 'base.html' %}

{% block body %}
<form action="{% url 'CRUD:create' %}" method="POST"> # 대소문자 구별안함
  {% csrf_token %} # 폼 내부에 이게 있어야지 인증이되서 에러 안남
  달성여부 : <input type="checkbox" name="check"> # check하면 'on'을 보냄
  제목 : <input type="text" name="title"> # 각자 모델 정보명으로 보냄
  내용 : <input type="text" name="content">
  마감일 : <input type="date" name="due-date">
  <input type="submit" value="저장">
</form>
{% endblock %}
```
- form의 action 요소를 DTL 문법으로 namespacing을 이용하여 보낼 수 있다.
- "{% url '앱이름:url변수명' 매개변수1, 매개변수2, ...%}" 매개변수 또한 보낼 수 있으며, 앱이름을 설정하지 않으면 '앱이름:'부분은 빼도 된다. 그러면 다른 앱에 겹치는 url 변수명이 서로 충돌할 수 있다.
- POST 방식으로 보내면 url 주소에 정보 값이 보이질 않고, csrf로 암호화되서 보내지며, 이를 제대로 해독해서 받으려면 form 태그 내부에 {% csrf_token %}을 지정하여 토큰도 같이 보내야 한다. 이를 통해 restfull 한 웹 코딩도 가능하다.
## Django Read(detail) 생성
1. 먼저 앱 폴더 내부의 urlpatterns 리스트에 새로 path를 추가한다.
> 새로 추가한 detail path
```python
path('<int:id>/', views.detail, name="detail"), # 자세히 볼 id를 variable routing 해야함
```
2. views.py에 detail 함수를 추가한다.
> 새로 추가한 detail 함수
```python
def detail(request, id): #자세히 볼 todo의 id를 html파일로 넘겨주어야 한다.
    todo = TODO.objects.get(id=id) # 해당 id인 TODO 객체 찾기
    context = { # render로 넘겨줄 때 3번째 인자로, 딕셔너리 형태로 넘겨줘야한다.
        'todo': todo,
    }
    return render(request, 'detail.html', context)
```
3. deatil.html 파일을 만들어 templates 폴더에 추가한다.
>detail.html
```python
{% extends 'base.html' %}
{% block body %}
<h1>{{todo.title}}</h1>
<h2>{{todo.content}}</h2>
<h3>{{todo.due_date}}</h3>
<h3>{{todo.check}}</h3>
<a href="">삭제</a>
<a href="">수정</a>
<a href="{% url 'CRUD:index' %}">뒤로</a>
{% endblock %}
```
- 메인 페이지로 돌아가나는 뒤로와 나중에 추가될 삭제와 수정 버튼을 넣었다.
4. 기존에 있던 index.html에 해당 모델 객체의 detail 페이지로 갈 수 있는 링크를 추가한다.
> index.html 의 일부
```html
<a href="{% url 'CRUD:detail' todo.id %}">자세히</a>
```
- namspacing을 이용한 url 할당에 todo의 id를 매개변수로 보내고 있다.
- 보내야될 변수가 2개 이상이면 앞에서 부터 차례대로 적용. 
## Django Update 생성
1. 앱 폴더 내부의 urls.py의 urlpatterns 리스트에 update path를 추가한다.
> url.py의 일부
```python
    path('<int:id>/update/', views.update, name="update"),
```
2. 앱 폴더 내부의 views.py에 update 함수를 추가한다.
> views.py의 update 함수
```python
def update(request, id):
    todo = TODO.objects.get(id=id) # get일 때도, post일 때도 todo를 쓰므로 외부에서 구한다.
    if request.method == "POST":        
        todo.check = request.POST.get('check')
        if todo.check == 'on':
            todo.check = True
        else:
            todo.check = False
        todo.title = request.POST.get('title')
        todo.content = request.POST.get('content')
        todo.due_date = request.POST.get('due-date')
        return redirect('CRUD:index') # 값을 수정하고 메인 페이지로
    else:
        context = {
        "todo": todo,
        }
        return render(request, 'update.html', context)
```
3. update.html 파일을 templates 폴더 안에 추가한다.
> update.html
```html
{% extends 'base.html' %}
{% block body %}
<form action="{% url 'CRUD:update' %}" method="POST"> 
  {% csrf_token %}
  달성여부 : <input type="checkbox" name="check">
  제목 : <input type="text" name="title" value="{{todo.title}}">
  내용 : <input type="text" name="content" value="{{todo.content}}">
  마감일 : <input type="date" name="due-date" value="{{todo.due_date}}">
  <input type="submit" value="저장">
</form>
{% endblock %}
```

## Django Delete 생성

## bootstrap 꾸미기

## git
1. gitignore.io에 가서 자신의 환경을 입력한 뒤 깃헙에 올리지 않을 설정을 받아 .gitignore에 넣기
2. github에 가서 새로운 레포지토리 만들기
3. 해당 폴더에 가서 터미널 안에  git init으로 git 환경으로 만든 뒤, 
4. 터미널에 git commit -m "message"로 첫 커밋 남기기
5. 터미널에 git remote add origin 레포지토리주소로 연결하기
6. git push origin master로 현재 상태 업로드하기
7. git add ., git commit -m "message", git push origin master로 업데이트, 커밋 남기기

## admin 생성하기, 로그인 하기
1. 터미널에 python manage.py createsuperuser 입력
2. 터미널에 유저네임, 이메일주소, 패스워드 입력, 패스워드 확인을 물어봄
	- 패스워드 입력시 입력결과가 눈에 보이지 않는다.
2. http://서버주소/admin 에 들어가서 로그인하면 관리자 페이지로 들어갈 수 있다.
3. 해당 앱 폴더 내부의 admin.py에서 admin.site.register(대상 모델)로 대상 모델을 업데이트하면 관리 페이지로 들어가면 볼 수 있다.
	- 그 전에 from .models import 모델이름 으로 불러온다.
## 댓글 달기 기능
### django ORM
#### READ
> 게시물 가져오는 법
```python
Question.objects.get(id=1)
```
- 없는 id면 에러 발생
> 게시물 불러오기
```python
In [6]: question = Question.objects.get(id=1)

In [7]: question
Out[7]: <Question: Question object (1)>
```
- 게시물 불러오기
> 댓글 저장하기
```python
In [7]: question
Out[7]: <Question: Question object (1)>

In [8]: Answer
Out[8]: questions.models.Answer

In [9]: answer = Answer()

In [10]: answer
Out[10]: <Answer: Answer object (None)> # 아직 정보가 없으므로 None

In [11]: answer.content
Out[11]: ''

In [12]: answer.content = "이것은 댓글입니다."

In [13]: answer.content
Out[13]: '이것은 댓글입니다.'

In [14]: answer.question = question

In [15]: answer.question
Out[15]: <Question: Question object (1)>

In [16]: answer.save() # 정보 다 안채운채로 하면 에러 발생

In [17]: answer
Out[17]: <Answer: Answer object (1)>

In [18]: Answer.objects.create(content="두번째 댓글", question=question)
Out[18]: <Answer: Answer object (2)>
```
#### 댓글 정보
```python
In [19]: answer.id
Out[19]: 1

In [20]: answer.pk
Out[20]: 1

In [21]: answer.question_id # answer가 가지고 있는 id값, **이게 더 빠름**
Out[21]: 1

In [23]: answer.question.id # answer가 가지고있는 question이 가지고 있는 id값
Out[23]: 1
```
- answer.id == answer.pk(primary key) 아이디랑 같음
- question_id와 answer.question.id 값은 같지만 접근하는데 question을 찾지 않으므로 question_id가 더욱 빠르다.
```python
In [26]: answer.question.content
Out[26]: 'worst mankind on the planet earth'

In [27]: question.answer_set # foreignkey를 가지고 있는 answer에 의해 자동으로 생성된 question의 요소
Out[27]: <django.db.models.fields.related_descriptors.create_reverse_many_to_one_manager.<locals>.RelatedManager at 0x28b04474808>

In [28]: question.answer_set.all()
Out[28]: <QuerySet [<Answer: Answer object (1)>, <Answer: Answer object (2)>]> # answer 객체가 2개 들어있고 이에 접근 가능
```
- answer가 가지고 있는 question의 내용에 접근 가능

#### 1:N
> Question(1)=>Answer(N) : answer_set 으로 접근 가능
```python
In [28]: question.answer_set.all()
Out[28]: <QuerySet [<Answer: Answer object (1)>, <Answer: Answer object (2)>]>
```
- question.answer 로는 가져올 수 없다. (1개여도)
- 항상 데이터가 여러개라고 생각해야한다.
- question에는 answer에 대한 정보를 넣지 않는다.(없을 수도 있으므로) dir(객체)로 확인 가능
> Answer(N)=>Question(1): question 으로 접근 가능
```python
In [15]: answer.question
Out[15]: <Question: Question object (1)>
```


