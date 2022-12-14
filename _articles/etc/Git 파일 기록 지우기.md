---
title: Git 파일 기록 지우기
date: 2022-07-12 17:21:08 +0900
tags: GIT CRUDE
layout: obsidian
is_Finished: true
last_Reviewed: 2022-10-30 17:21:08 +0900
use_Mathjax: use
---

```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```

# Git 파일 기록 지우기

---

Git을 이용할 때 실수로 잘못된 파일이 올라가면 곤란한 경우가 있다.

내가 겪은 경험은 Javascript의 `node_modules`폴더가 대표적인데, 이 안에는 프로젝트에서 사용할 패키지들의 수많은 파일과 폴더들이 존재하므로 보통 Git에 올리지 않고, 팀원들이 각자 pull할때마다 `npm install` 커맨드를 통해 갱신하는게 일반적인 방법이다. 또 다른 예로, AWS 강의를 들을 때, 개인의 AWS private key이 올라가, 누군가 제 3자가 EC2 인스턴스를 이용해 비트코인 채굴에 악용하여, 금전적 피해를 입은 사례도 있었다. 

아무리 개인의 사소한 개인의 저장소여도, 공개 저장소의 키워드 등을 탐지하는 봇을 이용해 공격을 시도하는 해커들이 존재하므로, 방심하면 안된다. 이렇게, 생각보다 중요하고 까다로운 과정이므로 이런식으로 글을 남겨 기록하게 되었다.

|                       | 확인 명령어                    | 취소 명렁어                                                     |
|:---------------------:|:-------------------------:|:----------------------------------------------------------:|
| **git add 전**         | `git check-ignore <file>` | `.gitignore` 파일 작성                                         |
| **git add 후**         | `git status`              | `git restore --staged <file>`, `git reset`                 |
| **git commit 후**      | `git log -p`              | `git reset --hard`, `git reset --soft`, `git reset HEAD~1` |
| **git push 후**        |                           |                                                            |
| **git clone, fork 후** | 😱                        | 😱                                                         |

## 상황별 Git 파일 기록 지우기

```ad-warning
 실무적으로 큰 사고가 났을 때는 대응하기 위해 📄[공식적인 정보](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)를 참조하기 바란다.
```
### 공통적인 필요 조치와 팁들

알아보기 앞서, 조치를 취하기 전, 중, 후의 공통적인 조치들을 알아보자.

1. `.gitignore` 파일을 제대로 작성하자. 
   
   🔵 gitignore 파일 작성법, `git check-ignore` 명령어, 전역 제외 설정 등의 도움되는 정보는  📝[.gitignore 작성법](add_later) 확인

2. 프로젝트 시작부터 env 세팅을 하자.
   
   - env 세팅에 대한 이야기는 나중에 포스트로 업로드 예정

3. 코드 리뷰를 꼼꼼히 하자.

4. 공용되는 API 키나 암호화 키들은 언제나 프로젝트 파일 바깥에 보관, 암호는 서비스 별로 다르게 사용하자.

5. `git add .`, `git add *` 그리고 `git add -A` 사용 금지, 프로젝트에 따라 다르겠지만 보통 파일 별로 코딩 후 커밋하자.
   
   🔵 GUI GIT 프로그램, `git add --interactive` 같이 겉으로 보이는 정보량이 많은 방법을 사용하는 것도 도움이 될 수 있다.

6. 가장 중요한 마지막으로, ↩[git push 이후](###잘못된 파일을 git push) 조치 이후 부터 **유출된 민감한 정보(암호 등) 등을 꼭 변경하고, Github 고객지원 팀에 연락하여 캐쉬된 데이터와 참조 등을 지워야 한다.**

### 잘못된 파일을 git add

---

민감한 정보가 Staging[^Staging]된 상태이다. `git status`를 통하여 먼저 확인해보자.

```bash
$ git status
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   .gitignore
        new file:   can_upload.md
        new file:   no_upload.md
        deleted:    test.md
```

`.gitignore` 파일 설정이 잘못되어 올라가선 안될 파일 `no_upload.md`가 올라가버린 상황이다.

이때의 대처는 쉽다. Staging 영역에서 특정 파일을 빼려면, `git restore --stage <file>` 또는 `git reset HEAD <file>` 명령어를 통해 가능하다.

```bash
$ git restore --staged no_upload.md
$ git status
On branch main
Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        modified:   .gitignore
        new file:   can_upload.md
        deleted:    test.md

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        no_upload.md
```

`no_upload.md` 파일이 Staging 영역에서 빠져나와 Untracked files에 추가된 것을 알 수 있다.

참고로, `git reset` 명령어를 사용하면 모든 파일들이 전부 빠지게 된다.

이제, `.gitignore` 파일을 적절히 설정해준 뒤, 다시 작업을 하면 된다.

### 잘못된 파일을 git commit

---

이번에는 Staging됐을 때 조차 눈치채지 못하고, Commit은 했되, 아직 push하지 못한 상태를 알아보자.

다행히 당신의 파일들은 컴퓨터에 존재하는 로컬 저장소에만 존재하고, 아직 원격 저장소에 올라가지 않은 상태이다.

`git log -p`를 이용해 자세한 내용을 알아보자.

```bash
$ git log -p
commit aa4bf546e374e8e4bf************ (HEAD -> main)
Author: Junseok YUN <************@gmail.com>
Date:   Tue Jan 11 10:40:21 2022 +0900

    wrong commit
...
diff --git a/no_upload.md b/no_upload.md
new file mode 100644
index 0000000..388e2d7
--- /dev/null
+++ b/no_upload.md
@@ -0,0 +1 @@
+No! don't upload it!
\ No newline at end of file
```

잘못된 파일인 `no_upload.md`가 올라간 것을 알 수 있다.

이 과정 중에 조심해야할 점은, 이때 잘못된 파일이 올라갔다면, `.gitignore` 파일을 수정하여도 제외되지 않는다는 점이다. 즉, 최초로 잘못 올라간 commit부터 조치해야 한다.

#### 잘못된 파일을 Commit에서 삭제

#### 바로 이전 commit 제거

가장 최신의 commit이 잘못되어 있다면, 간단하게 `git reset HEAD~1`[^HEAD~n]로 가능하다.

```bash
git reset HEAD~1
```

이제, 가장 최신의 commit은 지워졌으며, 이후에, 잘못을 고친 뒤, 다시 모든 파일을 commit하면 된다.

추가로, `--hard`, `--soft` 플래그를 이용할 수 있다.

```bash
git reset --hard HEAD~1
```

`--hard` 플래그는 해당 commit의 모든 수정과 추가된 파일을 지워버린다. **즉, 방금 당신이 commit 했던 작업한 모든 파일이 날아간다.**

```bash
git reset --soft HEAD~1
```

`--soft` 플래그를 사용하면 당신이 작업한 파일들은 commit에만 빠지며, 수정한 작업과 파일들은 여전히 존재하며 심지어 staging 되어있는 상태이다.

즉, 그대로 다시 `git commit` 명령어를 입력하면, 방금 했던 실수를 재현할 수 있을 것이다. 앞서 설명했던 ↩[git add 이후](###잘못된 파일을 git add ) 조치가 필요하다.

#### 여러번 이전 commit 제거

여러번 이전 commit을 제거하고 싶다면, 잘못된 commit의 SHA 값을 이용하거나, 해당 commit과 현재 상태의 차이 만큼 뒤의 숫자를 n만큼 늘려 `HEAD~n`을 reset 시키면 된다.

```bash
git reset HEAD~5

git reset 06b48c9d7880c70f9501611************(돌아가고 싶은 commit의 SHA)
```

> ❔ 잘못된 파일을 추가한 commit 하나만 지우고 싶은가? 모든 commit들은 이전 commit을 참조하는 형식으로 생성되기 때문에 그건 불가능하다.

### 잘못된 파일을 git push

---

당신이 원하지 않던 파일이 원격 저장소의 기록에 올라가게 되고, 이제부터 문제가 복잡해지기 시작한다.

저장소가 공개 저장소일 경우, 단순히 저장소 뿐만 아니라 Fork, Clone, 웹 아카이브, 웹 캐쉬 등으로 남기 때문에, 결국 가장 확실한 방법은 민감한 정보를 바꾼 뒤, 저장소를 날리는 것이다.

물론, 지금까지의 작업했던 브랜치와 커밋은 날아가게 되며, 이슈, 프로젝트, 마일스톤, PR 등을 옮기는 것도 불가능한 것은 아니지만 많은 시간과 노력이 필요하다.

---

🔵 **NOTE** 

이슈 이동, 프로젝트 이동은 📄[공식문서](https://docs.github.com/) 참조

---

#### 잘못된 Commit 삭제

#### 잘못된 파일 필터링

### 잘못된 파일을 여러 번의 브랜치 생성, git push 이후

### 누군가가 나의 레포지토리를 Clone, Fork하여 널리 퍼진 이후

더이상 막을 수 없다. Clone한 모든 컴퓨터가 본인의 제어 하에 있고, Fork한 모든 저장소가 비공개 + 본인 제어에 존재한 게 아닌 이상, 모두 위에서 말한 조치들을 취하긴 어려우며, 개인용 컴퓨터에 남은 기록은 삭제하여도 복원 가능하다.

그저 유출된 민감한 정보를 곧바로 바꾸는 방법 밖에 없다. 다음에 잘하자!

---

[^Staging]:기존의 SVN과 달리 GIT에는 로컬 저장소와 작업 트리(작업 폴더) 사이에 존재하는 인덱스(Index)라는 가상의 공간이 존재한다. Staging은 `git commit` 명령을 통해 인덱스의 파일들(`git add <file>`된 파일들)을 로컬 저장소로 파일들을 올리는 과정인데, 이를 통해 여러 파일들을 Staging 한뒤, 한꺼번에 코드를 검사하고, commit할 수 있다. 즉, 이런식으로 잘못된 Commit을 막기위해 만들었다는 의미이다.
[^HEAD~n]: HEAD~1은 현재 상태 이전으로 돌아가라는 의미이다. 즉, `git reset <시점>`은 해당 기재된 시점 이전으로 돌아가는 것이 아니라, 해당 기재된 시점으로 돌아가는 것이다.