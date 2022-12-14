---
title: Python for Algorithms-Tree
date: 2022-09-23 12:28:28 +0900
tags: 알고리즘 Python
layout: obsidian
is_Finished: false
last_Reviewed: 2022-09-23 12:28:28 +0900
use_Mathjax: true
---

```toc
min_depth: 2
max_depth: 3
varied_style: true
```

# Python for Algorithms-Tree
비선형 구조, 원소들 간에 1:n, 계층형 관계를 가진다.

## 상호 배타 집합
서로소 집합(disjoint set) 혹은 상호 배타 집합은 집합 간에 중복되는(교집합) 원소가 없는 집합들이다.

문제를 풀 때 서로 교집합이 없는 집합들의 수 등이 주제라면 생각해볼 만 하다.

집합의 대표자(루트)로 각 집합을 구분한다.
```ad-example
title: 상호 배타 집합 (배열 구현, $O(N)$) 함수
collapse: true
~~~python
p = [i for i in range(node_num)]  # p[x]: 노드 x의 부모 저장
rank = [i for i in range(node_num)]  # rank[x]: 루트 노드가 x인 트리의 랭크 값 저장
def make_set(x):
    """유일한 멤버 X를 포함하는 새로운 집합을 생성하는 연산"""
    p[x] = x  # 자기자신이 루트
    rank[x] = 0  

def find_set(x):
    """ x를 포함하는 집합을 찾는 오퍼레이션 """
    if x != p[x]:    # x가 루트가 아닌 경우
    # Path Compression: 특정 노드에서 루트까지의 경로에 존재하는 노드가 루트를 부모로 가리키도록 갱신, 단방향 그래프에서만 가능함
        p[x] = find_set(p[x])  # 양방향일 시 다음으로 대체 : return find_set(x)
    return p[x]  

def union(x, y):
    """ x와 y를 포함하는 두 집합을 통합하는 오퍼레이션 """
    link(find_set(x), find_set(y))  

def link(x, y):
    """ 두 루트를 통합하는 오퍼레이션 """
    if rank[x] > rank[y]:
        p[y] = x
    else:
        p[x] = y
    if rank[x] == rank[y]:
        rank[y] += 1
~~~
```
## 이진 탐색 트리
이진 트리는 모든 노드들이 2개의 서브트리를 갖는 특별한 형태

레벨이 $i$라면 노드의 최대 갯수는 $2^i$개

이진 탐색 트리는 탐색 작업을 효율적으로 하기 위한 자료 구조, 다음과 같은 특성을 가짐
- 각 노드는 서로 다른 유일한 키(데이터)를 가진다.
- $왼쪽\ 자식\ 값 <= 자신의\ 값 <= 오른쪽\ 자식\ 값$
- 트리를 중위 순회 시 오름차 순 정렬을 얻을 수 있다.

```ad-example
title: 이진 탐색 트리 예시
collapse: true
~~~python



~~~
```
### AVL 트리

```ad-example
title: 이진 탐색 트리 예시
collapse: true
~~~python



~~~
```


## 세그먼트 트리 (segment tree)
수열의 총 합, 총 곱, 최댓값, 최솟값 등을 $O(\log N)$의 시간에 해결할 수 있는 자료구조
```ad-example
title: 세그먼트 트리 $O(\log n)$ 예시 - 재귀 버전
collapse: true
~~~python
import math

def create_seg_tree(start, end, index=1):
    '''
    재귀를 통한 세그먼트 트리 생성
    index: 처리 중인 노드, index *2, index * 2 + 1 : 노드의 자식 노드들
      - 세그먼트 트리의 최고 부모인 1부터 시작, 자식을 가르키는 방향으로 진행함
    start - mid :왼쪽 자식이 저장하는 값, mid+1 - end : 오른쪽 자식이 저장하는 값
    '''
    global num_list
    global tree

    # tree의 leap에 도달했으면 num_list 값 그대로 삽입
    if start == end:
        tree[index] = num_list[start]
        return tree[index]
    mid = (start + end) // 2
    
    # 좌측 노드와 우측 노드 값을 구해 부모 노드의 값을 합쳐 만든다. (이때 합이 아니라 구간곱이면 바꿔주자)
    tree[index] = create_seg_tree(
        start, mid, index * 2) + create_seg_tree(mid + 1, end, index * 2 + 1)
    return tree[index]  

def interval_sum(start, end, left, right, index=1):
    '''
    재귀를 통한 구간합 계산 함수
    index: 현재 처리 중인 인덱스
    start - end : 현재 index 노드가 값을 저장한 구간
    left, right : 구간 합을 구하고자 하는 범위
    '''

    # 원하는 구간이 tree 밖인 경우
    if left > end or right < start:
        return 0  # 곱일 경우 1!

    # 현재 인덱스가 포함하는 구간이 전부 내가 원하는 구간 안에 있는 경우 더한다.
    if left <= start and right >= end:
        return tree[index]

    # 일부만 겹친 경우는 두 자식으로 나누어 구간내에 있는 자식만 더함
    mid = (start + end) // 2
    return interval_sum(start, mid, left, right, index * 2) + interval_sum(mid + 1, end, left, right, index * 2 + 1)

def update(start, end, where, diff, index=1):
    '''
    특정 원소의 값을 수정하는 함수
    index : 현재 수정 필요 여부를 판단하고 있는 함수
    start - end: index 노드가 포함하고 있는 범위
    where : 구간 합을 수정하고자 하는 노드
    value : 수정할 값
    '''
    # 범위 밖에 있는 경우는 아무것도 안하고 재귀 중단
    if where < start or where > end:
        return  

    # 범위 안에 있으면 내려가면서 다른 원소도 갱신
    tree[index] += diff
    if start != end:
        mid = (start + end) // 2
        update(start, mid, where, diff, index*2)
        update(mid + 1, end, where, diff, index*2+1)

# segment tree
numCount, changeCount, caseCount = map(int, input().split())

num_list = [0 for _ in range(numCount)]
for i in range(numCount):
    num_list[i] = int(input())
tree = [0] * (1 << (math.ceil(math.log2(numCount))+1))
# 필요한 노드 수 == 잎새 노드(N) + 부모 노드(N-1) == 2N - 1
# 따라서 높이를 H라고 놓을 때 ∑^{H}_{n=0}2^n >= 2N -1을 만족해야 한다.
# tree의 크기는 2의 (예상 트리의 높이 + 1)승이면 절대 부족하지 않다.

seg = create_seg_tree(num_list)

for j in range(changeCount + caseCount):
    cmd, par1, par2 = map(int, input().split())
    if cmd == 1:
        loc, val = par1-1, par2
        update(seg, loc, val, numCount)
    elif cmd == 2:
        fr, to = par1-1, par2-1
        print(interval_sum(numCount, seg, fr, to))
~~~
```
아래는 다른 버전의 세그먼트 트리이다.
\+ PROS
    - 반복문과 비트 연산을 활용해 좀 더 빠르다.
    - 자료형의 크기가 입력 값의 2배로, 비교적 효율적이다.
    - 자료형에 배치된 원소들이 위치적으로 직관적임.
        - 위치 n의 $n\times 2,\ n\times 2 + 1$이 자식이며, 반대로 $n//2$는 부모
        - 원소들이 층 별로 일렬로 배치됨.
\- CONS
    - 코드를 이해하기 힘들다. 특히, left 인덱스와 right 인덱스의 활용 부분
    - 자료형에 배치된 원소들이 실제 원리의 노드와 조금 다르다.
        - 예를 들어, 원소의 갯수가 홀수 일 경우, 서로 다른 층 값의 합을 가지고 있는 부모 노드가 생김.
        - 따라서 lazy propagation 같은 추가적인 알고리즘 적용 힘듬.
~~잠깐, 이거 혹시 BIT 트리인가? 나중에 확인 바람~~
```ad-example
title: 세그먼트 트리 $O(\log n)$ 예시 - 반복 버전
collapse: true
~~~python

# 반복문을 이용한 세그먼트 트리 생성
def create_tree(num_list):
    # 부모 노드들이 들어갈 공간 + 원본 값 공간
    tree = [0 for _ in range(len(num_list))] + num_list
    # 부모 노드 생성 
    for i in range(len(num_list) - 1, 0, -1): # 거꾸로 시작하여 말단 노드에 가까운 부모부터 생성
        tree[i] = tree[i << 1]+tree[i << 1 | 1]
    return tree  

# 반복문을 이용한 구간합 구하기
def interval_total(num_count, tree, left, right):
    # 실제 범위는 부모 공간에 의해 밀려났으므로 그만큼 더해줌
    left += num_count
    right += num_count
    result = 0
    while (left <= right):
        # 인덱스의 홀수 짝수 여부에 따라 두가지로 나뉜다.
        # 1. 이 노드의 값을 포함한 부모 노드가 있음(=더하지 않음)
        # 2. 이 노드의 값을 포함한 노드가 없음 (=더해줘야 함)
        if (left & 1):  # 왼쪽 인덱스가 홀수이면
            result += tree[left]  # 해당 값을 더해 주고
            left += 1  # 인덱스 증가
        if not (right & 1):  # 오른쪽 인덱스가 짝수이면
            result += tree[right]  # 해당 값을 더해주고
            right -= 1  # 인덱스 감
        # 인덱스를 절반으로 줄임 == 해당 값의 부모 노드로
        left >>= 1
        right >>= 1
    return result

# 반복문을 이용한 트리 갱신
def update(tree, index, val, num_count):
    index += num_count
    tree[index] = val
    # 부모 노드 업데이트
    while index > 1:
        tree[index >> 1] = tree[index] + tree[index ^ 1]  
        index >>= 1
    return tree
    
# segment tree
numCount, changeCount, caseCount = map(int, input().split())  

arr = [0 for _ in range(numCount)]

for i in range(numCount):
    arr[i] = int(input())  

seg = create_tree(arr) 

for j in range(changeCount + caseCount):
    cmd, par1, par2 = map(int, input().split())
    if cmd == 1:
        loc, val = par1-1, par2
        update(seg, loc, val, numCount)
    elif cmd == 2:
        fr, to = par1-1, par2-1
        print(interval_total(numCount, seg, fr, to))
~~~
```

### 동적 세그먼트 트리(Dynamic segment tree)

```ad-example
title: 동적 세그먼트 트리 예시
collapse: true

~~~python
~~~
```

### 지속 세그먼트 트리(Persistent segment tree)

```ad-example
title: 지속 세그먼트 트리 예시
collapse: true
~~~python

~~~
```

### 다차원 세그먼트 트리 (multi dimensional segment tree)

```ad-example
title: 다차원 세그먼트 트리 예시
collapse: true
~~~python

~~~
```

### 게으른 전파 세그먼트 트리 (segment tree with lazy propagation)
- 하단 코드는 이해를 돕기 위해 `dictionary`를 활용했으며, 실제로 아래 코드는 필요한 메모리가 어마어마하므로, 다차원 배열이나 `lazy`와 `value`를 다른 배열로 나누자.
```ad-example
title: 게으른 전파 세그먼트 트리 예시
collapse: true
~~~python
import sys
import math
input = sys.stdin.readline  

def create_seg_tree_lazy(start, end, index=1):
    '''
    기존 방식과 동일한 방법으로 트리 생성
    '''
    if start == end:
        tree[index]["value"] = number_list[start]
    else:
        mid = (start + end) // 2
        create_seg_tree_lazy(start, mid, index * 2)
        create_seg_tree_lazy(mid + 1, end, index * 2 + 1)
        tree[index]["value"] = tree[index*2]["value"] + tree[index*2 + 1]["value"]

def propagation(where, start, end):
    '''
    lazy값이 존재하는 경우 값을 추가하고 자식 노드로 lazy 값을 전파하는 함수
    '''
    if start != end:
        tree[where * 2]["lazy"] += tree[where]["lazy"]
        tree[where * 2 + 1]["lazy"] += tree[where]["lazy"]
    tree[where]["value"] += tree[where]["lazy"] * (end - start + 1)
 
    tree[where]["lazy"] = 0 

def interval_update_lazy(left, right, start, end, diff, index=1):
    '''
    lazy 구간 업데이트 구하기
    left, right : 수정하고자 하는 범위
    start, end : 현재 계산 중인 범위(현재 index번의 노드가 커버하는 공간)
    index : 현재 update하는 노드
    diff : 변화되는 값
    '''
    if tree[index]["lazy"]: # 이전에 쌓은 lazy값이 존재하는 경우 수정 뒤 lazy 전파
        propagation(index, start, end)
    if end < left or right < start: # 구하는 구간이 관계 없는 경우
        return
    if left <= start and end <= right: # 해당 노드가 커버하는 구간이 완전히 포함될 경우
        tree[index]["value"] += (end - start + 1) * diff

        if start != end: # 말단 노드가 아닐 경우,
            tree[index * 2]["lazy"] += diff
            tree[index * 2 + 1]["lazy"] += diff
        return
    else:
        mid = (start + end) // 2
        interval_update_lazy(left, right, start, mid, diff, index*2)
        interval_update_lazy(left, right, mid + 1, end, diff, index*2 + 1)
        tree[index]["value"] = tree[index*2]["value"] + tree[index*2+1]["value"]

def interval_sum_lazy(left, right, start, end, index=1):
    '''
    lazy 구간 합 구하기
    index : 현재 처리 중인 노드의 인덱스
    start, end : 현재 처리 중인 인덱스 노드가 값을 포함하고 있는 범위
    left, right : 값을 구할 범위
    '''
    if tree[index]["lazy"]:
        propagation(index, start, end)

      if end < left or right < start:
        return 0
    if left <= start and end <= right:
        return tree[index]["value"]
    else:
        mid = (start+end)//2
        return interval_sum_lazy(left, right, start, mid, index*2) + interval_sum_lazy(left, right, mid + 1, end, index * 2 + 1)

number_count, change_count, sum_count = map(int, input().split())
number_list = [int(input()) for _ in range(number_count)]

tree = [{"value": 0, "lazy": 0} for _ in range(1 << (math.ceil(math.log2(number_count))+1))]
# 필요한 노드 수 == 잎새 노드(N) + 부모 노드(N-1) == 2N - 1
# 따라서 높이를 H라고 놓을 때 ∑^{H}_{n=0}2^n >= 2N -1을 만족해야 한다.
# tree의 크기는 2의 (예상 트리의 높이 + 1)승이면 절대 부족하지 않다.  

create_seg_tree_lazy(0, number_count-1) 

for i in range(change_count + sum_count):
    cmds = list(map(int, input().split()))
    if cmds[0] == 1:
        _, fr, to, chng = cmds
        interval_update_lazy( fr-1, to-1, 0, number_count-1, chng)
    else:
        _, fr, to = cmds
        print(interval_sum_lazy( fr-1, to-1, 0, number_count-1))
~~~
```

### BIT (Binary Indexed Tree, 펜윅 트리, fenwick tree)
```ad-example
title: BIT 예시
collapse: true
~~~python

~~~
```
## 트라이(Trie)

주로 문자열과 관련되어 사용되나, 트리를 이용하기 때문에 이곳에 편입

n진 트리 구조를 이용해 찾고자 하는 검색할 문자열의 길이를 $M$이라 할 때, $O(M)$이 된다.

```ad-example
title: Trie 예시
collapse: close

~~~python
class Trie:
    def __init__(self, value):
        self.value = value
        self.childs = {} 

    def insert(self, word):
        currNode = self
        for letter in word:
            if currNode.childs.get(letter):
                currNode.childs[letter].value += 1
            else:
                currNode.childs[letter] = Trie(1)
            currNode = currNode.childs[letter]

    def search(self, query):
        currNode = self
        for i, letter in enumerate(query):
            if currNode.childs.get(letter):
                currNode = currNode.childs[letter]
            else:
                return 0
        if i == len(query) - 1:
            return currNode.value        

def solution(
    words, queries
):
    trie = Trie(0)
    for word in words:
        trie.insert(word)
    result = [trie.search(query) for query in queries]
    return result
~~~
```
