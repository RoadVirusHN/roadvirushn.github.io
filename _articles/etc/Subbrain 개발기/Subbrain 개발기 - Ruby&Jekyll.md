---
title: Subbrain 개발기 - Ruby&Jekyll
date: 2022-12-30 18:15:47 +0900
tags: HIDE CRUDE 
layout: obsidian
is_Finished: false
last_Reviewed: 2022-12-30 18:15:47 +0900
use_Mathjax: true
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# Subbrain 개발기 - Ruby & Jekyll

## 개요
**Ruby**는 가독성과 생산성에 치중한 고수준 인터프리터 언어로, 함수형, 절차형, 객체형 프로그래밍을 지원하며, 웹 프레임워크인 [ruby on rails](https://rubyonrails.org/)가 유명하다

**Jekyll**은 작성한 문서 파일들을 간단히 정적 블로그 사이트로 바꿔주는 Ruby와 Gem 기반 정적 사이트 생성 툴이다. 주로 github page와 연동되어 개발자 블로그로 많이 사용된다.

사용하기 쉽고 간단하며, 은근히 많은 사람들이 블로그를 만들기 위해 사용하여, 기술 스택으로 채용하게 되었다.

하지만 둘 다 내가 이번 프로젝트에서 처음 접해보았으며, Ruby의 간단한 문법과 Jekyll의 편의성에도 불구하고 학습으로 인한 개발 시간 증가의 원인 중 하나이기도 하다.

이 둘을 통해 블로그 기능 중 주로 동적 요구가 필요하지 않은 것들을 만들었다.

## 개발 기능

### 개발 환경 설정
- **Ruby 설치 및 linter 설정**
```ad-example
title: Gemfile 예시
collapse: close
~~~gem
gem "webrick", "~> 1.7"
gem "rufo"
gem "reek"
gem "rubocop"
gem "jekyll-seo-tag"
gem "nokogiri"
~~~
```
Ruby를 설치한 뒤, 위와 같이 Gemfile을 설정 후, `bundle install`을 통해 설치 후, VScode ruby 플러그인을 설치하여 여러 환경 설정을 손쉽게 할 수 있다.

- **VScode task 설정**
```ad-example
title: vscode .vscode/tasks.json
collapse: close
~~~json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "test",
      "dependsOn":["jekyll", "webpack", "sass", "tsc"]
    },
    {
      "label": "jekyll",
      "command": "bundle exec jekyll serve",
      "type": "shell",
      "options": {
        "cwd": "./"
      },
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    },
    {
      "label": "webpack",
      "command": "node_modules/.bin/webpack",
      "type": "shell",
      "options": {
        "cwd": "./"
      },
      "presentation": {
        "reveal": "always",
        "panel": "new"
      },
      "problemMatcher": []
    },
    {
      "label": "sass",
      "command": "sass -w _sass:assets/css",
      "type": "shell",
      "options": {
        "cwd": "./"
      },
      "presentation": {
        "reveal": "always",
        "panel": "new"
      },
      "problemMatcher": []
    },
    {
      "label": "tsc",
      "command": "npx tsc -w",
      "type": "shell",
      "options": {
        "cwd": "./"
      },
      "presentation": {
        "reveal": "always",
        "panel": "new"
      },
      "problemMatcher": []
    }
  ]
}
~~~
```
프로젝트 개발 시 나는 다음과 같은 커맨드들을 일일이 입력해야 했다.
- `bundle exec jekyll serve` : Gem에 명시된 라이브러리들과 함께 Jekyll 개발 모드로 실행
- `node_modules/.bin/webpack -w`: 자바스크립트 파일 변경 시 자동 번들링
- `sass -w _sass:assets/css`: 작성한 sass 파일 변경시 css 파일로 자동 컴파일
- `npx tsc -w`: 작성한 타입스크립트 파일 변경 시 자동 자바스크립트로 컴파일

이는 매우 귀찮은 일이였고, 위와 같이 VScode의 기능을 활용해 커스텀 Task를 생성해 `ctrl + p Tasks: Run task` 명령을 통해 한꺼번에 실행시킬 수 있게 만들었다. 

### 프로젝트 파일 구조

Jekyll의 기본 폴더 구조를 기본으로 몇몇 폴더와 다른 툴들을 위한 파일이 추가되었다.

```ad-note
title: 프로젝트 파일 구조 개요
~~~bash
subbrain/
---folders↓---
 |-assets/ : css, 이미지, 자바스크립트 등 여러 정적 파일이 저장되어 있는 폴더
 |-blog/ : 라우터 인덱싱, 정적 페이지들의 html 파일들 저장소
 |-node_modules/ : javascript가 사용하는 패키지
 |-scripts/ : Typescript 파일들
 |-_articles/ : 작성한 마크다운 파일들이 카테고리 별 폴더 구조로 나뉘어 저장
 |-_data/ : 생성된 블로그 포스트들의 정보(태그 정보, 카테고리 정보 등)가 json형식으로 저장
 |-_etcs/ : 기타 임시 코드 저장용 폴더
 |-_includes/ : 재사용 가능한 컴포넌트들(헤더, 푸터, 드로워 등)
 |-_layouts/ : 페이지 템플릿들(옵시디언 마크다운 블로그 포스트 글 등)
 |-_plugins/ : 커스텀 루비 플러그인 파일들, 주로 블로그 포스트의 전처리와 후처리 구현
 |-_sass/ : css로 컴파일되 assets 폴더로 옮겨짐
 |-_site/ : 정적 사이트 생성 결과물
 ---files↓---
 |-tsconfig.json : Typescript 설정 파일
 |-webpack.config.js : Webpack 설정 파일
 |-package.json : Javascript 패키지 정보
 |-Gemfile : Ruby 패키지 정보
 |-index.html : 메인 페이지
 |-.eslintrc.json : Typescript linter 설정 파일
 |-_config.yml : Jekyll 설정 파일
~~~
- `_`가 앞에 붙은 폴더나 `_config.yml`에서 제외 목록에 들어간 폴더는 정적 사이트 생성시 제외됨
```
```ad-example
title: 일부 폴더 소개
collapse: close
- **`assets` 폴더 : css, 이미지, 자바스크립트 등 여러 정적 파일이 저장되어 있는 폴더**
	정적 사이트 프로젝트이므로 규모가 크다.  `_sass` 폴더에서 css 파일을, `scripts` 폴더에서 JS 파일을 컴파일하여 이곳에서 저장한다.

- **`_articles` 폴더 : 작성한 마크다운 파일들이 카테고리 별 폴더 구조로 나뉘어 저장**
	기존의 `_post` 폴더의 동작을 모방하여, Jekyll이 이들의 변화를 감지하고 블로그 포스트를 생성하도록 구현함

- **`_data` 폴더 : 생성된 블로그 포스트들의 정보(태그 정보, 카테고리 정보 등)가 json 형식으로 저장**
	Jekyll이 자동으로 변화를 업데이트하게끔 구현하였다.
	주로 자바스크립트와 커스텀 플러그인에서 포스트 정보를 가져오는데 사용하는 **일종의 DB 역할**을 한다.
	- Liquid의 경우 Jekyll의 `site` 변수에서 정보를 제공하지만, JS와 ruby에서 사용할 수 없어서 구현

- **`_includes` 폴더와 `_layouts` 폴더: 컴포넌트와 페이지 템플릿  파일들**
	liquid 태그가 포함되어 html 파일들이 존재, `_layouts` 내의 파일은 **일종의 페이지를 위한 템플릿**이고, `_includes` 내의 파일은 **일종의 재사용 가능한 컴포넌트**들이다.
	- 예를 들어 `_layouts/obsidian.html`은 옵시디언 파일들을 페이지로 만들 때 공통으로 사용
	- `_includes/drawer/drawer.html`은 페이지 내 drawer를 구현할 때 `liquid include` 문법으로 불러와 사용한다.

- **`blog` 폴더 : 정적으로 생성되는 페이지들에 사용되는 html 파일들**
	일종의 라우팅 인덱스 폴더, 내 소개 페이지, 검색결과 페이지, 404 에러 페이지, 포스트 리스트 페이지가 존재

- **`_site` 폴더 : 생성된 정적 사이트 결과물**
	내부 파일을 `gh-page` 브랜치에 옮겨 배포한다.

- 기타 폴더(`_sass` 폴더, `scripts` 폴더, `node_modules` 폴더)는 해당 도메인에서 설명하겠다.
```

### Obsidian <=> Jekyll 포스트 구조

```ad-seealso
title: **[[Obsidian]]** 이란?
```

Jekyll에서 기본적으로 마크다운 파일을 HTML 파일로 바꾸어주는 기능을 지원한다.
- **커스텀 id 설정과 Hard wrap 기능을 지원하기 위해 Kramdown 마크다운 변환**으로 설정을 바꾸어 주었다. 

추가적으로 내가 원하는 기능을 구현하기 위해 Ruby 플러그인을 직접 구현하였다.
- 직접 구현한 이유는 학습 + 관련 라이브러리 없음 + gh page에서 플러그인 지원 안함

```ad-note
title: Obsidian <=> Jekyll 포스트 아키텍처 구현
![[image-20230103130212087.png]]
```
- 변환 전, md 파일에 영향을 줘야하는 기능은 **Jekyll에서 지원하는 Generator 클래스를 상속하여 구현**
- 변환 후, html 파일에 영향을 줘야하는 기능은 **Liquid에서 지원하는 Custom Filter 등록 기능으로 구현**

### 전처리 구현: Custom Generator 기반
```ad-example
title: 전처리 플러그인 파일 구조
![[image-20230103132944510.png|300]]
```

전처리 레이어는 `ruby` 플러그인으로 구현되었으며, 추가로 레이어 내부에 각 전처리 함수들이 계층 구조로 이루어져 있다.
Jekyll 측에서 각 마크다운 파일을 처리할 때 사용하는 [Generator](https://jekyllrb.com/docs/plugins/generators/)  클래스를 상속받아 구현하였다.

```ad-example
title: Preprocessor.rb
collapse: close
~~~ruby
require_relative './layouts/obsidian/preprocess_obsidian'
require_relative './common/modules/preprocess_frontmatter'
require_relative './common/preprocess_common'

module Preprocessor
  class ArticleConverter < Jekyll::Generator
    include PreprocessObsidian
    include PreprocessFrontmatter
    include PreprocessCommon
    def generate(site)
      changed = register_articles(site.collections['articles'])
      clear_categories if changed
      site.collections['articles'].docs.map do |article|
        result = preprocess_common(article, changed)
        result = preprocess_obsidian(site, result) if result['layout'].upcase == 'OBSIDIAN'
        result
      end
      create_category_pages(site).each do |page|
        site.pages << page
      end
    end
  end
end
~~~
```
- 가장 먼저 새로 등록된 파일들의 정보를 `_data` 폴더에 업데이트한다.(`register_articles`)
- 블로그 포스트의 정보(태그, 사용하는 레이아웃)에 따라 처리한다.
- 주로 옵시디언에서만 지원하는 마크다운 기능들을 랜더링하기 위한 정보들을 추출하는 함수들이다.
- 폴더 구조에 따라 변형되는 게시판 카테고리 구조 페이지 또한 이곳에서 구현된다.
- 마크다운 파일은 DOM 구조가 없으므로 대부분 정규 표현식을 통해 요소를 검색하고 수정한다.

구현하면서 **정규표현식을 정말 많이 공부**할 수 있었다. 
기존에는 정규 표현식을 정말 가독성이 떨어지고 복잡하다고 생각하여 초보적인 단계까지만 학습했지만, 이제 캡처 그룹부터 룩 어헤드까지 사용할 수 있게 되었다.

#### 후처리 구현 : Custom Liquid Filter 기반

```ad-example
title: 후처리 플러그인 파일 구조
![[image-20230103133015293.png]]
```
후처리 레이어 또한 `ruby` 플러그인으로 구현되었으며, Jekyll의 layout 기능을 이용해서 필요한 후처리 함수만 Liquid Custom Filter를 통해 처리되도록 구현했다.

```ad-example
title: layout 후처리 필터 예시
~~~html
...
<div class="content-section">
  {{content | postprocess_obsidian}}
</div>
...
~~~
```

주로, 콜아웃이나 TOC, 위키 링크 등의 실제 뷰를 HTML 태그로 구현하는 기능을 만들었다.
```ad-example
title: postprocess_obsidian.rb
collapse: close
~~~ruby
require 'liquid'
require 'nokogiri'
require_relative './modules/postprocess_toc'
require_relative './modules/postprocess_callout'
require_relative './modules/postprocess_wikilink'  

module Jekyll
  module PostprocessObsidian
    include PostprocessToc
    include PostprocessCallout
    include PostprocessWikilink
    def postprocess_obsidian(str)
      html = Nokogiri.HTML5(str)
      html = convert_noneng_custom_id(html)
      html = convert_toc(html)
      html = html.to_html
      html = convert_callout(html)
      html = convert_wikilink(html)
      html
    end
  end
end

Liquid::Template.register_filter(Jekyll::PostprocessObsidian)
~~~
```
개발 초반에는 DOM 트리 탐색 및 변경을 정규표현식으로 처리했으나, 후반에는 Nokogiri라는 HTML DOM 기반 parser 라이브러리를 이용하여 구현했다.
- 다만 일부 경우, 오히려 가독성이 나빠지는 경우가 있어 그대로 정규 표현식 기반으로 구현한 기능도 존재한다.

## 회고

### Ruby
```ad-example
title: 내 Ruby 코드 예시
~~~ruby
def create_category_page_recursive(site, categories, data) # python과 유사하다.
  result = data['categories'].keys.inject([]) do |memo, sub_category| # 다양한 loop문 표현
    memo + create_category_page_recursive(site, categories + [sub_category], data['categories'][sub_category])
  end
  if categories.empty? # 함수형 프로그래밍, 파라미터 없을 경우 생략 가능한 "()"
    result # return을 생략 가능
  else
    [CategoryPage.new(site, categories, data)] + result
  end
end
~~~
```
- Ruby는 파이썬과 상당히 비슷하게 사용자의 가독성과 편의성을 상당히 신경쓴 것이 느껴졌다.
	- 데이터 타입을 선언할 필요가 없음
	- 함수의 `return`을 생략 가능
	- `.empty?`, `.nil?` 등 직관적이고 함수형 프로그래밍이 가능

- 단, 오히려 이점이 오히려 호불호 갈린 경우도 많다.
	- 함수에 파라미터를 넘기지 않을 때는 괄호를 생략할 수 있음, 그럴 경우 해당 객체의 변수를 읽은건지, 함수를 호출한 건지 보기만해서는 알 수 없음.	
	- 해당 함수가 `return` 값이 존재하는 함수인지, 아닌지도 알기 힘들다.
	- 마치 자바스크립트 루프문들 처럼 같은 코드를 여러 방식으로 표현할 수 있다는 점 
	- `unless` 처럼 단순히 `if`의 반대의 의미를 가진 표현도 있다.

```ad-example
title: Rubocop Linter 경고문 예시
![[image-20221230185605204.png]]

```
- Ruby의 Linter 겸 Formatter인 [Rubocop](https://rubocop.org/)을 적용했었는데, 내 짧은 프로그래밍 인생 중, 가장 훌륭한 Linter였다.
	- 코드 스타일, 네이밍 컨벤션, 주석 여부 같은 기본 기능
	- 같은 동작의 더 좋은 표현까지 추천
	- ABCSize, 순환 복잡도 같은 각종 코드 복잡도까지 지원
	- 귀찮으면 버튼 하나로 이를 자동으로 수정 (코드 표현까지도!)
	- VScode와의 호환성이 좋고, 설정도 쉬웠으5며, Reek 같은 다른 린터와 동시에 사용가능.
	- 설명이 잘되어 있고, 문서화가 잘되어있다.
```ad-example
title: Rubocop `CyclomaticComplexity` 문서 중 일부
![[image-20230103142143858.png]]


문서를 읽으면서, 좋은 코드에 대해 많이 배울 수 있었다.
```
~~물론 어쩌면 내가 다른 언어의 Linter를 잘못쓰는 것일지도 모르지만~~
- regex를 이용하기 전에 진즉에 Nokogiri를 썼으면 시간을 꽤나 아꼈을 것 같다.
- 제대로 설계를 안하고 써서 그런지, 코드 가독성이나 재사용성이 조금 아쉽다.
- Ruby on rails를 함께 사용했으면 경험에 큰 도움이 됬을 것 같지만, 내가 Ruby를 더 파볼 일은 없을 것 같다.

### Jekyll

- 확실히 다양한 기능을 클릭 몇번으로 적용 가능하고, 가벼운 블로그로써 손색이 없었지만, 나의 기능에 대한 욕심이 이를 망쳤다.
	- 오히려, 기존 기능을 수정하여 사용하느라 힘들었다. 
	- 예를 들어, 기본 값인 `post` 콜렉션을 이용하다 파일들의 제목을 이상하게 바꿔야하는 (`date-sluggedtitle.md`) 제한이 마음에 안들어 새로운 콜렉션으로 바꾸는 과정에서 모든 파일들의 내용과 제목을 손봐줘야 했다.
	- 정적 사이트에 동적 기능을 넣을 생각을 한 시점에서 이상함을 느껴야 했다.

- github page에서 보안상의 이유로 일부 플러그인을 제외하고 지원하지 않았던 점 또한 치명적이었다.
	- 지원되는 플러그인 찾기 -> netlify 등의 다른 무료 배포 서비스 찾아보기 -> 자바스크립트, 루비, 템플릿 언어 등으로 기능 직접 구현 -> 커스텀 플러그인 지원을 위해 github action 건드려보기
	- 위 과정의 시간이 오래 걸렸다.

- 하지만, 만약 나의 경우와 정반대로, 별 다른 커스터마이징 없이 블로깅하려면, 굳이 Jekyll을 쓰는 것 보다는 Tistory나 네이버 블로그, velog 같은 상용 블로그를 쓰는게 더 나은것 같다.
	- 댓글, 조회수, 추천 등의 동적인 기능이 가능하며, 광고 등을 쉽게 적용할 수 있기 때문

- Liquid 템플릿 언어는 `include`를 이용한 코드 재사용이 쉬웠고, 각종 필터와 함수들이 꽤 편리했지만, 여전히 별로였다. React의 JSX와 컴포넌트가 너무 그리웠다.
	- jinja2 같은 다른 템플릿 언어와의 차별점은 잘 모르겠다.




