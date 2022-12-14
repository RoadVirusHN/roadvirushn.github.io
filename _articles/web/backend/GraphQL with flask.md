---
title: GraphQL with flask
date: 2022-04-16 17:21:08 +0900
tags: flask PYTHON graphql BE
layout: obsidian
is_Finished: false
last_Reviewed: 2022-10-30 17:21:08 +0900
use_Mathjax: false
---
https://dev.to/mesadhan/python-flask-graphql-with-graphene-nla (Md. Sadhan Sarker)의 글을 번역, 정리한 글입니다.

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# GraphQL with flask

GraphQL은 API를 위한 query language이다. REST API에 비해 여러 장점이 있으며 특히 data fetching 부분이 효율적이다. 규모가 큰 API일수록 더욱 효과적이고 강력하며, facebook에서 open source로 배포하여 커다란 커뮤니티를 이루었다.

 요즘은 선언형 프로그래밍이 점점 인기를 얻고 있는데, GraphQL 또한, 여러 API 호출을 불러와야하는 REST API와는 달리 선언형 데이터 fetching이용한다. GraphQL 서버는 오직 하나의 endpoint(root URL 뒤에 붙는 추가 주소)와 클라이언트가 요청한 여러 response로 이루어졌다. 앞으로 예시를 살펴볼 것이다.

 **GraphQL vs REST**

- GraphQL은 쿼리로 우리가 필요한 데이터만  명시하게 해주며, 한번의 요청으로 정확히 그 데이터만 응답에 포함시켜줄 것이다.  이에 반해 REST API는 여러 응답과 호출을 요구한다.



## GraphQL과 REST의 차이 예시

- API에서 data를 가져올 때, 큰 차이를 보여주는데. 블로그에서 어떤 유저의 작성글들의 제목이 필요할 경우, 또한 같은 페이지에서 그 유저의 최신 팔로워들 3명의 이름을 가져오려 할 때, GraphQL과 REST API는 어떤 차이를 보일까?	

  > **REST API의 경우**

  - REST API에서는 여러 endpoint에서 데이터를 가져온다.

    - 예를 들어, /user/\<id\> endpoint에서 먼저 유저 데이터를 가져오낟
    - 그 후, /user/\<id\>/posts endpoint에서 해당 유저의 모든 게시글들을 가져온다
    - 마지막으로, /user/\<id\>/followers에서 해당 유저의 모든 팔로워들을 가져온다

  - ![img](https://res.cloudinary.com/practicaldev/image/fetch/s--dTu5x1Mo--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://imgur.com/VRyV7Jh.png)

    ​	- 그림 출처 : source :howtographql.com

    - REST API를 사용하면 3번의 각자 다른 주소로 3번의 요청을 보내야 하며, 쓸데없는 추가 데이터들을 추가로 가져온다는 것을 알 수 있다.

- 아니면 /users/posts/follwers/\<id\> 라는 새로운 endpoint를 만들고, 우리가 원하는 데이터만 가져오게 만들어도 된다. 하지만 그렇게하면 끔직한 생산성과 재사용성을 가져올 것이다. 추가로 날짜에 따라 정보를 가져오려면 /users/posts/follwers/\<id\>/\<date\>라는 endpoint를 만들어야한다.

> **GraphQL의 경우**

- GraphQL은 단 하나의 query를 서버에 보낸다. 서버는 JSON 형식의 respond를 돌려준다.

![img](https://res.cloudinary.com/practicaldev/image/fetch/s--Icv1_RJj--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://imgur.com/z9VKnHs.png)

- 그림 출처 : source :howtographql.com
- GraphQL에서는 클라이언트 서버가 필요한 데이터만 쿼리에 포함할 수 있다. 백엔드 서버의 응답 또한 정확히 쿼리에 정의한 구조를 따른다

멋지지 않는가? 이론은 충분하니 이제 Python Graphne을 이용해서 GraphQL 서버를 만들어보자.

## Python Graphene을 이용한 GraphQL 서버 구현
- Graphene은 python으니 GraphQL 클라이언트 라이브러리이다. 이를 이용해 우리만의 GraphQL 서버를 만들 수 있다.
**Setting up your poject**
- 먼저 프로젝트 경로와 폴더를 생성한다.
```bash
$ mkdir graphql-flask
$ cd graphql-flask
```
- 가상환경설정을 통해 global package들과의 충돌을 피하고, 각 프로젝트 별로 패키지 버전 관리를 쉽게 할 수 있다.
```bash
$ pip install virtualenv
$ virtualenv venv
$ source venv/bin/activate

참고로 
$ deactivate
로 가상 환경에서 나갈 수 있다.
```
- 필요한 depndency를 맞추기 위해 아래와 같이 터미널에 입력하라

```bash
$ pip install flask flask-graphql flask-migrate flask-sqlalchemy graphene graphene-sqlalchemy
```
- 	이후 우리의 데이터베이스를 실행해야 한다. 아래 seed.py를 만들어 보자.

```python
from app import db, User, Post

db.create_all()     # create tables from models

user1 = User(
    name="Sadhan Sarker",
    email='cse.sadhan@gmail.com'
)

post1 = Post()
post1.title = "Blog Post Title 1"
post1.body = "This is the first blog post 1"
post1.author = user1

db.session.add(post1)
db.session.add(user1)
db.session.commit()

print(User.query.all())
print(Post.query.all())
```
- 위 스크립트를 실행하려면 아래와 같이 입력하라
```bash
python seed.py
```
- 좋다! 거의 다됬다! 마지막으로 app.py 스크립트를 만들고 프로젝트에 추가하자
```python
import os

import graphene
from flask import Flask
from flask_graphql import GraphQLView
from flask_sqlalchemy import SQLAlchemy
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField

app = Flask(__name__)

basedir = os.path.abspath(os.path.dirname(__file__))

# Database Configs [Check it base on other Database Configuration]
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'database.sqlite')
app.config['SQLALCHEMY_COMMIT_ON_TEARDOWN'] = True
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

# Initialize Database
db = SQLAlchemy(app)


# ------------------  Database Models ------------------

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(256))
    email = db.Column(db.String(256), index=True, unique=True)  # index => should not be duplicate
    posts = db.relationship('Post', backref='author')

    def __repr__(self):
        return '<User %r>' % self.email


class Post(db.Model):
    __tablename__ = 'posts'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(256))
    body = db.Column(db.Text)
    author_id = db.Column(db.Integer, db.ForeignKey('users.id'))

    def __repr__(self):
        return '<Post %r>' % self.title


# ------------------ Graphql Schemas ------------------


# Objects Schema
class PostObject(SQLAlchemyObjectType):
    class Meta:
        model = Post
        interfaces = (graphene.relay.Node,)


class UserObject(SQLAlchemyObjectType):
    class Meta:
        model = User
        interfaces = (graphene.relay.Node,)


class Query(graphene.ObjectType):
    node = graphene.relay.Node.Field()
    all_posts = SQLAlchemyConnectionField(PostObject)
    all_users = SQLAlchemyConnectionField(UserObject)


# noinspection PyTypeChecker
schema_query = graphene.Schema(query=Query)


# Mutation Objects Schema
class CreatePost(graphene.Mutation):
    class Arguments:
        title = graphene.String(required=True)
        body = graphene.String(required=True)
        email = graphene.String(required=True)

    post = graphene.Field(lambda: PostObject)

    def mutate(self, info, title, body, email):
        user = User.query.filter_by(email=email).first()
        post = Post(title=title, body=body)
        if user is not None:
            post.author = user
        db.session.add(post)
        db.session.commit()
        return CreatePost(post=post)


class Mutation(graphene.ObjectType):
    save_post = CreatePost.Field()


# noinspection PyTypeChecker
schema_mutation = graphene.Schema(query=Query, mutation=Mutation)


# Flask Rest & Graphql Routes
@app.route('/')
def hello_world():
    return 'Hello From Graphql Tutorial!'


# /graphql-query
app.add_url_rule('/graphql-query', view_func=GraphQLView.as_view(
    'graphql-query',
    schema=schema_query, graphiql=True
))

# /graphql-mutation
app.add_url_rule('/graphql-mutation', view_func=GraphQLView.as_view(
    'graphql-mutation',
    schema=schema_mutation, graphiql=True
))

if __name__ == '__main__':
    app.run()
```
- 이제 우리는 graphene으로 graphql을 만들었다. 실행해보자.
```bash
$ python app.py
```
## GraphQL API 테스트
- PostMan이나 cRUL을 이용해 서버와 통신해보자.
- GraphQL은 원칙적으로 POST와 GET 요청만 받는다.
```postman
## 1. Rest API examples
GET http://127.0.0.1:5000/

### Graphql query-api example
POST http://127.0.0.1:5000/graphql-query
Content-Type: application/graphql

{
  allPosts{
    edges{
      node{
        title
        author{
          email
        }
      }
    }
  }
}

### 2. Graphql mutation-api example

POST http://127.0.0.1:5000/graphql-mutation
Content-Type: application/graphql

mutation {
  savePost(email:"cse.sadhan@gmail.com", title:"Title 2", body:"Blog post 2") {
    post{
      title
      body
      author{
        email
      }
    }
  }
}

###
```
