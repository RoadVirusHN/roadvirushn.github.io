---
title: .gitignore 작성법
date: 2022-03-24 17:21:08 +0900
tags: git
layout: obsidian
is_Finished: false
last_Reviewed: 2022-10-30 17:21:08 +0900
use_Mathjax: false
---

# .gitignore 작성법

> 의도적으로 Commit 되지 않도록 무시되어야할 파일을 정해주는 것 -(https://git-scm.com/docs/gitignore)

git 폴더(git init을 통해 .git 숨김 폴더가 생성된 디렉토리) 내부에 ".gitignore"라는 이름의 파일을 생성한 뒤, 보안상, 프로젝트 관련상, 파일 크기상 원격 레포지토리에 올리고 싶지 않은 파일이나 폴더를 add 대상에서 제외하는데 사용할 수 있다.

gitignore.io(https://www.toptal.com/developers/gitignore)를 통해 손쉽게 자신의 기술 스택에 관련된 gitignore 파일을 만들 수 있지만, 개인이 생성한 민감한 파일을 제외하기 위해 정확한 사용법를 알아야할 필요가 있다.

자세한 내용은

📖 https://git-scm.com/docs/gitignore

주의할 점은 이미 원격 레포지토리에 올라간 파일은 뒤늦게 gitignore에 패턴을 추가한다해도 영향을 받지 않으며, 이를 위해 따로 처리해줘야한다. "원하지 않은 Git 파일 기록 지우기" 참조 바람

## gitignore 

### gitignore 파일 예시

아래와 같은 방식으로 .gitignore 파일 내부에 파일명에 대한 패턴을 기재하여 파일이 기록되지 않도록 할 수 있다. 이때, 심볼릭 링크를 사용할 수 없다.

```gitignore

...
# Created by https://www.toptal.com/developers/gitignore/api/visualstudiocode,windows,python,react
# Edit at https://www.toptal.com/developers/gitignore?templates=visualstudiocode,windows,python,react
### react ###
.DS_*
logs
**/*.backup.*
**/*.back.*

node_modules
bower_components

*.sublime*

psd
thumb
sketch

### VisualStudioCode ###
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
*.code-workspace

# Local History for Visual Studio Code
.history/
...
```

### gitignore 파일의 다른 활용 방법들

Git은 여럿의 gitignore 파일과 파일 내부 라인을 읽고 무시할 파일을 인지하는데, 다음과 같이 복잡한 우선순위와 가독성을 위해 보통 하나의 .gitignore 파일을 프로젝트 최상단 폴더에 유지한다.

- gitignore 파일이 여러 폴더에 존재할 경우, 현재 폴더의 gitignore파일을 최우선으로, 상위 폴더일 수록 낮은 우선순위로 gitignore 파일 설정을 덮어씌운다.
- 이외에도 .git 폴더 내부에도 git에 의해 생성되는 파일들을 무시하기 위한 기본 생성 gitignore가 존재함

이러한 .gitignore 파일은 push 시에 원격 레포지토리에 같이 올라가므로, 만약 많은 사람이 참여하고 있는 프로젝트 중에, 나의 로컬 레포지토리에서만 제외하고 다른 사람들은 제외할 필요 없는 파일의 경우는 \$GIT_DIR/info/exclude 파일에 기재하면 된다.

프로젝트나, 레포지토리와 관계없이 GIT을 사용하는 어떠한 상황에서든 무조건 제외하고 싶은 나의 파일의 패턴(전역 무시, Global ignore)은 \$XDG_CONFIG_HOME/git/ignore 또는 \$HOME/.config/git/ignore 파일에 기재하면 된다.

- ignore 파일의 경로나 이름을 바꾸고 싶으면 git config --global core.excludesfile ~/{원하는 경로}, 또는 직접 경로 ~/.gitconfig/core.excludesFile에 들어가서 경로를 바꿔줄 수 있다.

git check-ignore [파일, 폴더명]을 통해 해당 파일, 폴더가 제외되어있는 지 확인할 수 있다. 

- 만약 대상이 제외되어있다면 해당 폴더명이 나타난다.
- 대상이 포함되어 있다면 아무것도 결과창에 나타나지 않는다.

## 패턴 포맷과 예시

git이 이용하는 패턴은 glob 패턴에서 brace expression을 제외한 것과, 정규표현식의 [a..z] expression을 추가한 것을 합친 문법이며, 여기서는 패턴에 따른 git의 .gitignore 파일 예시를 중심으로 이야기할 것이다.

여기서 "제외"는 원격 레포지토리에 올라가지 않음을 의미하며, "포함"은 올라감을 의미한다. 

- 예를 들어 "파일 a는 제외되며, 파일 b도 포함이다" 같이, b가 git에 의해 commit 된다는 의미인지, 아니면 a처럼 제외된다는 의미인지 헷갈리는 표현은 최대한 자제했으며, 만약 존재한다면, 이때 b는 a와 달리 제외되지 않고 올라간다는 의미이다.



```gitignore
# using # to comment. if you need to use # using \# instead.

# using blank line as a separator
```

빈 공간은 구분자로 사용되며, \#으로 주석을 남길 수 있다.



```gitignore
mustinclude.txt
# mustinclude.txt 제외 패턴

!mustinclude.txt
# 상위의 제외 패턴을 무시하고 무조건 포함시킴

!/mustIncludeFolder/
# mustIncludeFolder를 무조건 포함시킴

\!important!.txt
# 파일명 중간에 위치한 !는 \를 접두사로 넣을 필요없다.

/specificDir/
```

"\\"가 앞에 있지 않은 공백 문자는 무시된다.

"\!"가 접두어로 있는 패턴은 이전에 제외 패턴이 존재해도 반드시 포함된다. 하지만, 해당 파일의 상위 경로가 통째로 제외된 경우나, 또 다시 아래에 다시 제외된 경우에는 다시 포함될 수 없다.   

"\!"를 파일명의 최선두 등으로 사용하고 싶을 때는 "\\\!"를 이용하자.

```gitignore 
/FolderInSameDir/ChildDir/excludedfile.txt 
# .gitignore 파일과 같은 폴더에 위치한 FolderInSameDir 폴더 내의 ChildDir 폴더 내의 excludedfile.txt 제외
# 다른 폴더 내부에 있는 otherFolder/FolderInSameDir/ChildDir/excludedfile.txt은 그대로 포함됨

FolderInSameDir/ChildDir/excludedfile2.txt 
# 위와 같은 경로의 excludedfile2.txt 제외, 즉 맨 앞의 "/"은 없어도 됨

/fileInHere.txt
# .gitignore 파일과 같은 폴더에 존재하는 fileInHere.txt 제외
# 다른 폴더 내부에 있는 /otherFolder/fileInHere.txt은 그대로 포함됨
```

 "/"를 파일 경로 구분자로 사용하며, 패턴의 처음이나 중간에 존재할 시에는, .gitignore 파일에서의 상대적 파일 경로에 존재하는 파일을 의미하며, 존재하지 않을 시에는 .gitignore 파일과 같은 폴더 내의 파일을 제외시킨다.



```
folderOrFile
# folderOrFile이라는 이름의 폴더만 전부 제외

onlyTxt.txt
# onlyTxt.txt이라는 이름의 파일만 전부 제외, onlyTxt.exe, onlyTxt.md 등, 다른 확장자는 그대로 포함됨.

onlyFolder/
# onlyFolder라는 이름의 폴더만 제외

onlyFile.*
# 아래에서 배울 *를 이용한 onlyFile이라는 이름을 가진 파일만 전부 제외 하는 방법

# 파일, 폴더명만 덩그러니 있는 경우들이며, git이 관리하는 모든 경로에 존재하는 folderfolderOrFile, onlyFolder 폴더와 onlyFile.txt, folderOrFile 파일들은 전부 제외된다.
# 예를 들어 otherFolder/folderfolderOrFile/, otherFolder/anotherFolder/onlyFile.txt 등 또한 제외된다.
```

 "/"이 맨 마지막에 존재할 경우나 존재하지 않을 경우 모두, 해당 이름의 폴더를 제외하며, 파일을 제외하고 싶다면 아래에 배울 "\*"(별표, asterisk)를 사용하면 된다.

앞에 추가 폴더 경로가 제시되지 않고, 이름만 덩그러니 있는 경우에는 모든 경로의 폴더나 파일이 제외 대상이다.



```
*.html
# 모든 html 확장자 파일을 제외시킴

noInclude.*
# noInclude라는 이름의 파일을 확장자 관계없이 모두 제외시킴

exclude-[0-9]/
# exclude-0 부터 exclude-9까지의 폴더를 전부 제외시킴

credential??
# 접두어 credential로 시작하고 뒤에 임의 두 글자가 추가된 파일과 폴더를 전부 제외시킴

no*.js
# 접두어 no로 시작하는 모든 길이의 파일명을 가진 js 확장자 파일을 제외시킴
```

"\*"은 "/"을 제외한 모든 문자열을, "?"은 "/"을 제외한 모든 문자 하나를 사용할 수 있으며, "[a-zA-Z]"는 해당 범위 내의 문자 하나를 의미한다.

애초에 파일 및 폴더명에 포함시키는 건 불가능하긴 하지만 "\?", "\\\*"를 이용해 패턴이 아닌 문자 그대로 사용할 수 있다.



```gitignore
**/allExclude
# allExclude란 이름의 모든 파일과 폴더를 경로와 관계없이 제외시킨다.

allExclude
# 이전에 배웠던 방법, **를 사용한 바로 위와 같은 동작이지만, 가독성적으로 **를 사용하는게 더 좋으며, 아래와 같은 동작이 가능하다.

**/otherFolder/*.html
# 어떠한 경로에서든 otherFolder라는 폴더 내부의 모든 html 파일을 제외함, **를 사용해야만 쓸 수 있는 표현

rootFolder/**/anyFile.*
# rootFolder내의 anyFile이라는 이름의 파일을 추가적인 경로와 관계없이 모두 제외한다. 마찬가지로 **를 사용해야만 쓸 수 있는 표현
# rootFolder/extra/anyFile.txt나, rootFolder/moreFolder/anyFile.js, rootFolder/long/longFolders/anyFile.md 모두 제외된다.
```

두개의 별표(asterisk) "\*\*"를 이용해 경로와 관계없이 모든 파일 및 폴더를 제외시킬 수 있다.

두개 이상의 별표, 예를 들어 "\*\*\*" 부터는 각자 1개의 별표와 같이 작동한다. 즉 "\*"와 별 차이가 없을 것이다.





