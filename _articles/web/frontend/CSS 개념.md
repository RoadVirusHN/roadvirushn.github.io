---
title: CSS 개념
date: 2019-11-02 17:21:08 +0900
tags: CSS FE crude
layout: obsidian
is_Finished: false
last_Reviewed: 2022-12-06 01:27:32 +0900
use_Mathjax: false
---
# CSS
## CSS의 개념과 기본 사용법

HTML => 정보와 구조화
CSS => styling의 정의

이 둘은 각자 문법이 다른 별개의 언어, 하지만 HTML이 없으면 CSS는 무의미

```css
h1 { 
	color:blue;
	font-size:15px; 
}
```

- `h1` : 셀렉터(selector),
- `color:blue;` : 선언
	- `color`: 프로퍼티(property), `blue`: 값(value)
- 세미콜론(;)으로 각각의 값을 구분
- CSS의 주석 설정은 `/* 내용 */`

## CSS 활용

### CSS 활용하기 1. Inline(인라인)

```ad-example
title: 00_intro.html 바디 부분
~~~html
<body>
    <h1 style="color:red;">CSS intro</h1>
</body>
~~~
- html 태그 안에 인라인으로 CSS를 적용해본 것, 유지보수가 힘드므로 금지된다.
```

### CSS 활용하기 2. CSS 나누기

```ad-example
title: 00_intro.html 파일 헤더와 바디 부분
~~~html
<head>
    <style> 
    h2{ <!--보통 여러값이 나오므로 CSS 사용시 여러줄로 나눔-->
        color: blue;
        font-size:50px;
    }
    </style>
</head>
<body>
    <h2>CSS is awesome</h2>
</body>
~~~
```

### CSS 활용하기 3.파일 분리하기


```ad-example
title: 같은 폴더 내의 00__intro css 파일
~~~css
p{
    color: green;
}
~~~
```

```ad-example
title: 00_intro.html 파일 헤더와 바디 부분

~~~html
<head>
    <link rel="stylesheet" href="00_intro css">
</head>
<body>
    <p>Lorem ipsum dolor sit amet.</p>
</body>
</html>
~~~
```

```ad-tip
title: vscode 기능

lorem ipsum 기능: 랜덤의 의미없는 문장 만들어줌 
~~~txt
lorem{단어수}
~~~
```

## 값

값 : 키워드, 크기 단위, 색깔 등이 들어갈 수 있음
- 키워드 예시 : `display: block`, `visiblity: hidden` 등...

키워드의 경우 개발자 도구로 확인 가능

![[image-20221206011124877.png]]

- 주황색 영역 : 설정된 크기 영역
- 파란색 영역 : 실제로 해당 요소가 차지하고 있는 부분

```ad-example
title: CSS 값 설정 예시 (01_css_val css 파일)
~~~CSS
/* CSS 주석 #으로 시작하는 것은 아이디이다.*/
#hello {
    font-size: 50px;
}
#welcome{
    font-size: 50%; /* 기존의 크기 대비해서 바꿈*/
}
#lunch{
    font-size: 5em; /* 기본설정의 x배 커지게 함  %와 마찬가지로 곱셈됨*/
}
/*div는 부모*/
div{
    width: 50%;
}
/*h1은 자식, 부모의 width를 상속받아서 결국은 0.5 * 0.5 의 값을 갖는다.*/
h1{
    width: 50%;
}
#snack {
    font-size: 0.5rem;
}
#menu { /*화면 크기에 상대적으로 크기가 바뀌는 반응형 단위*/
    background-color: red;
    width: 50vw;
    height: 50vh;
    /*프로퍼티값 앞에 콜론을 붙이고 한칸 띄우는게 국룰*/
}
~~~
```


```ad-example
title: CSS 값 설정 예시 (01_css_val.html 파일)
~~~HTML
<link rel="stylesheet" href="01_css_val css">
</head>
<body>
    <P id="hello">안뇽</P><!--px 단위-->
    <P id="welcome">반갑습니다</P> <!--% 단위-->
    <h1>
        <P id="lunch">점심시간입니다.</P><!--em 단위-->
    </h1>
    <h1>
        <p id="snack">오늘 간식은 도시락</p><!--rem 단위-->
    </h1>
    <div>
        <h1>배고파 </h1>
    </div>
    <h1 id="menu">오늘의 메뉴</h1><!--viewport 단위-->
</body>
~~~
```


### px

- 한 픽셀은 RGB로 색을 구분하여 표현하며, 매우 작은 사각형
- 디바이스별로 픽셀의 크기는 제각각, 대부분 브라우저는 1px를 1/96인치로 지정

### %
백분율 단위의 상대 단위이다.
요소에 지정된 사이즈(상속된 사이즈나 디폴트 사이즈)에 상대적인 사이즈를 설정한다.
부모와 상속, 즉 곱셈 됨
### em
em은 배수 단위로 상대 단위이다. 요소에 지정된 사이즈에 상대적인 사이즈를 설정한다. %와 마찬가지로 곱셈, 즉 상속됨
### rem
em과 비슷하나 상대 단위가 아닌, 절대 단위, 즉 2배로 설정하면 다른 값을 다 곱해도 2배로 설정됨
- 보통 1rem은 16px

### viewport 단위
디바이스마다 다른 크기의 화면을 가지고 있기 때문에 상대적인 단위인 viewport를 기준으로 표현하는 단위, 인터넷창이나 모니터크기를 바꾸면 동적으로 바뀐다. 반응형 단위
IE 8 이하는 지원하지 않으며 IE 9~11, Edge는 지원이 완전하지 않다

### 색상 표현 단위
HEX 표현: 16진수의 두자리씩 RGB 표현 `\#24f4cd`, `\#ffffff(흰색)`
RGB 표현: 빨강, 초록, 파랑이 섞이는 정도를 표현 (0~255)
RGBA 표현: RGB + 투명도 (alpha)
## Box model
`margin` : 내용과 내용사이의 여백
`border`: 테두리 영역
`padding`: 테두리 안쪽의 내부 여백, 요소에 적용된 요소들이 내용과 함께 적용됨
`contents`: 내용, 역시 스타일 적용됨

```ad-example
title: Box model 예시(02_box.html)
~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="02_box css">
</head>
<body>
    <div class="margin border"></div>
    <div class="margin padding"></div>
    <div class="margin border"></div>
    <div class="margin"></div>
    <div class="margin padding"></div>
    <div class="margin-1"></div>
    <div class="margin-2"></div>
    <div class="margin-3"></div>
    <div class="margin-4"></div>
</body>
</html>
~~~
```

```ad-example
title: Box model 예시 CSS (02_box css)
~~~css
div{
    width: 100px;
    height: 100px;
    background-color: rgb(196, 61, 61);
}

.margin {
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 10px;
    margin-right: 10px;
}
.padding{
    padding-top: 20px;
    padding-bottom: 10px;
}
.border{
    /* border-width: 2px;
    border-color: blue;
    border-style: dotted; */
    border: 3px blue dotted; /*위의 축약형*/
}
.margin-1{
    margin: 10px; 
    /* 상하 좌우 전부 마진 10 */
}
.margin-2{
    margin: 10px 20px;
    /* 위 아래 마진 10px, 20px */
}
.margin-3{
    margin: 10px 20px 30px;
    /*위 10 양옆 20 아래 30px 마진 생김*/
}
.margin-4{
    margin: 10px 20px 30px 40px;
    /* 위 마진 부터 시계방향으로 10, 20, 30, 40 px 마진 생김 */
}
/*border, padding에도 적용됨*/
~~~
```

### margin
- id 속성 
특정 id 속성을 가진 태그 하나에만 적용할때 쓰는 속성, CSS에서 앞에 \#을 붙여 표현

- class 속성 
같은 클래스 속성의 태그를 전부 적용할때 쓰는 속성, CSS에서 앞에 .(점)을 붙여 표현
	- 각기 다른 class를 한 태그에 스페이스바(공백)으로 나누어 적용할 수 있다.
- 마진 상쇄현상: 다른 존재의 마진과 상쇄됨
### padding

### border

### shorthand


## Display
display 프로퍼티를 이용해 block과 inline 그리고 inline-block, none을 정해줄 수 있다. 원래 기본이 block이여도 inline으로 바꿀 수 잇음
```ad-example
title: 03_display css 파일 예시
~~~css
div {
    background-color: cornflowerblue;
    margin-left: auto;
    margin-right: auto;
}

.half {
    width: 50%;
}

.b {
    display: block;
}

.i {
    display: inline;
}

.bi {
    display: inline-block;
    margin-top: 20px;
}

.bg {
    background-image: url(https://picsum.photos/200/300);
}
.text {
    font-family: 'Saira Stencil One', cursive;
}
~~~
```

```ad-example
title: Display 예시 (03_display.html)
~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link href="https://fonts.googleapis.com/css?family=Fira+Code|Saira+Stencil+One&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="03_display.css">
</head>
<body>
    <div>
        <h1>div는 block입니다.</h1>
    </div>
    <div class="half i">
        <span>test</span> <!-- <h1>여기는 절반만!</h1> -->
    </div>
    <!-- <h1>여기는 h1입니다.</h1> -->
    <div class="half i">
        <span>test</span> <!-- <h1>여기는 절반만!</h1> -->
    </div>

    <span class="bi">여기는 span</span>
    <input class="b" type="text">
    <input type="date">
    <h1 class="bg">hello.</h1>
    <h1 class="text">ooh yeah.</h1>
</body>
</html>
~~~
```

### block
* 항상 새로운 라인에서 시작한다. 
* 너비가 정해지면 마진으로 나머지 영역을 채움(margin-right: auto;(기본값)) margin-left: auto; 도 같이 하면 중앙 정렬이 됨
* 화면 크기 전체의 가로폭을 차지한다(width: 100%)
* block 레벨 요소 내에 inline 
* block 레벨 요소의 예
### inline
* span, input 등
* 새로운 라인에서 시작하지 않으며 문장의 중간에 들어갈 수 있따.
* content의 너비만큼 가로폭을 차지한다.
* width, height, margin-top, margin-bottom 같은 프로퍼티를 지정할 수 없다.
* 상, 하 여백은 line-height로 지정한다.

### inline-block
* 두 요소를 모두 가지고 있는 성질, 마진을 줄 수도 있음
* inline 레벨 요소처럼 한줄에 표시되면서 마직 속성을 모두 정해줄 수 있다.
### none
* 적용하면 보이지않음, 동적으로 웹을 만들어 사라지게 만들고 싶을때 씀 (공간조차 사라짐0)

## visibility 속성
### visible
- 보이게 한다
### hidden
- 안보이게 한다, none과 달리 사라지진 않고 보이지만 않는다. 영역을 그대로 차지하고 있음

## background-image 속성
- url(https://picsum.photos/200/300);을 지정하면 그 공간만큼의 사진을 보여줌

## font-size, font-family, letter-spacing, white space, text-align 등이 있음

## position 속성
- left: , right: , bottom, top 요소로 얼마나 떨어져야 하는 가를 크기로 정해줌
- 즉 얼마나 떨어져야하는가 ex) left: 50px == 왼쪽으로 부터 50px 떨어짐
- 만약 left: 0px, right: 0px 처럼 서로 충돌하면 왼쪽, 그리고 위쪽이 우선됨
- 각 div의 중심은 div가 그 해당 모서리에서 가장 가까운 쪽으로 결정되는듯?
- Ctrl + enter로 코드 중간에 줄바꿈 가능

```ad-example
title: Position 속성 예시 (04_postion css)
~~~css
div {
    height: 100px;
    width: 100px;
}

.blue {
    background-color: blue;
    position: static;
}
.red {
    background-color: red;
    position: relative;
    left: 50px;
    bottom: 50px;
}
.green {
    background-color: green;
    position: absolute;    
    left: 0px; 
    bottom: 0px;
}
.yellow {
    background-color: yellow;
    position: fixed;
    right: 0px;
    top: 0px;
}

.parent {   
    height: 200px;
    width: 100%;
    background-color: gray;
    position: relative;
}

.children {
    background-color: pink;
    position: absolute;
    left: 0px;
    bottom: 0px;
}
~~~
```

```ad-example
title: position 예시 (04_position.html)
~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="04_position css">
</head>
<body>
    <div class="blue"></div>
    <div class="red"></div>
    <div class="green"></div>
    <div class="parent">
        <div class="children"></div>
    </div>
    <div class="yellow">

    </div>
</body>
</html>
~~~
```

### static
- 아무것도 안적은 기본값
- 안움직임, absolute의 부모가 될 수 없음

### relative
- left: , right: , bottom, top 요소로 정한 크기만큼 원래 있어야하는 위치를 중심으로 여백을 줌
- 전체 영역 (마진, 보더 등)이 전부 움직임, 원래 위치에도 

### absolute
- 부모(body가 부모일 경우 화면의 왼쪽 상단)를 중심으로 left: , right: , bottom, top 요소 크기만큼 여백을 줌, 그만큼 떨어짐 
- 부모를 중심으로 이동함, 
- 부모는 position 속성이 static이 아니여야 함, 부모 바깥으로 나갈 수도 있음

### fixed(고정위치)
- 부모 자식 관계없이 브라우저 뷰포트(우측 상단)를 중심으로 이동함
- 스크롤을 움직여도 따라 움직임, 상단 메뉴바 같은거 만들 때 

