---
title: Python for algorithms-Libraries
date: 2022-09-19 16:53:58 +0900
tags: 알고리즘 Python
layout: obsidian
is_Finished: true
last_Reviewed: 2022-09-20 17:19:23 +0900
use_Mathjax: true
---
# Python for Algorithms-Libraries

```toc
min_depth: 2
max_depth: 3
varied_style: true
```

간편하게 사용할 수 있는 파이썬 코드들

## Template.py
- 시간 비교, 테스트 케이스 입력과 출력, 정답 비교 등을 한 파일에 담은 template.
```ad-note
title: Template.py
collapse: true
~~~python
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
# ----------------------------------------------------------------------------
# Created By  : Junseok Yun(markkorea@naver.com)
# Created Date: 2022-08-10
# ---------------------------------------------------------------------------
""" Python template file for algorithm competition. """
# ---------------------------------------------------------------------------
import sys
import time

# input = sys.stdin.readline # Change `input` func to `readline` func.
# print(sys.getrecursionlimit()) # Print maximum recursion limit.
sys.setrecursionlimit(987654321)   # Change maximum recursion limit.

arrayOfInput = [
    # 입력값 리스트
]

arrayOfAnswer = [
    # 정답 리스트
]

if len(arrayOfInput) != len(arrayOfAnswer):
    raise Exception(
        f"The length of `arrayOfInput`={len(arrayOfInput)} and the length of `arrayOfAnswer`={len(arrayOfAnswer)} do not match.")  

def solution(
    # your arguments
):
    result = []
    return result  

print("---------------------------------------------------------------------------------------------------------------------------------------")
print("|case|               Input               |                correct               |              submitted              | result|time(ms)|")
print("=======================================================================================================================================")  

for case, (example_input, correct_answer) in enumerate(zip(arrayOfInput, arrayOfAnswer)):
    startTime = time.time() * 1000
    answer = solution(*example_input)
    responseTime = time.time() * 1000 - startTime
    print(f"|{case:^4}|{str(example_input):^35.35}|{str(correct_answer):^37.37}|{str(answer):^37.37}|{'OOO' if answer == correct_answer else 'XXX':*^7}|{responseTime:^8.3f}|")
    print("---------------------------------------------------------------------------------------------------------------------------------------")
~~~
```
## functools
고차 함수와 콜러블 객체에 대한 연산, 즉 **함수를 입력 값 혹은 출력 값으로 주로 다루는 함수** 들이다.

어렵게 구현해야 할 코드들이 쉽게 쓸 수 있게 되어 있다.

만약 표준 라이브러리를 사용할 수 없는 시험에 대비하여  해당 구현 코드들을 올려놓았다. 

### cmp_to_key()
`sorted`, `sort` 함수를 이용해 정렬 시 비교 기준을 줄 수 있음
```ad-example
title:`cmp_to_key()`의 활용 예시
collapse: true
~~~python
from functools import cmp_to_key

points = [{'x': 1, 'y': 2}, {'x': 2, 'y': 2},
          {'x': 2, 'y': 1}, {'x': 1, 'y': 1}]
          
# 단순 비교 설정은 lambda를 이용해 가능
points.sort(key=lambda x: x['x']) 

def cmp(a, b):
	# 필요 리턴 값
	# 1 : 좌측이 더 큼
	# 0 : 두 값이 같음
	# -1 : 우측이 더 큼
	if a['y'] == b['y']:
        if a['x'] > b['x']:
			return 1
		elif a['x'] == b['x']:
			return 0
		elif a['x'] < b['x']:
			return -1
	return 1 if a['y'] > b['y'] else -1

points.sort(key=cmp_to_key(cmp))
sorted(points, key=cmp_to_key(cmp), reverse=True)

print(points)
# [{'x': 1, 'y': 1}, {'x': 2, 'y': 1}, {'x': 1, 'y': 2}, {'x': 2, 'y': 2}] 'y': 2}]
~~~
```
```ad-seealso
title: `cmp_to_key()`의 구현
collapse: true

~~~python
def cmp_to_key(mycmp):
    'Convert a cmp= function into a key= function'
    class K(object):
        def __init__(self, obj, *args):
            self.obj = obj
        def __lt__(self, other):
            return mycmp(self.obj, other.obj) < 0
        def __gt__(self, other):
            return mycmp(self.obj, other.obj) > 0
        def __eq__(self, other):
            return mycmp(self.obj, other.obj) == 0
        def __le__(self, other):
            return mycmp(self.obj, other.obj) <= 0
        def __ge__(self, other):
            return mycmp(self.obj, other.obj) >= 0
        def __ne__(self, other):
            return mycmp(self.obj, other.obj) != 0
    return K
  

points = [{'x': 1, 'y': 2}, {'x': 2, 'y': 2},
          {'x': 2, 'y': 1}, {'x': 1, 'y': 1}]

def cmp(a, b):
    if a['y'] == b['y']:
        if a['x'] > b['x']:
            return 1
        elif a['x'] == b['x']:
            return 0
        elif a['x'] < b['x']:
            return -1
    return 1 if a['y'] > b['y'] else -1  

points.sort(key=cmp_to_key(cmp))
print(points)
~~~
```
```ad-seealso
title: 사용해본 알고리즘 문제
collapse: true
[[https://www.acmicpc.net/problem/11650| 백준 11650번 문제]]
- 다른 사람은 x와 y값의 합을 통해 정렬하되, y에 가중치를 적게 주어 (x의 최대값으로 나눈 수준의 가중치) 구별하는 방법으로 빠르게 정렬했다.
```

### reduce()
자료 구조 내의 각 요소들을 순서대로 함수를 적용해 누적된 값을 보여준다.
- [[https://www.acmicpc.net/problem/1010|백준 문제 1010번]]
```ad-tip
title: `accumulate` 함수와 달리 결과값이 `iterator`가 아닌 값이다.
collapse: true
~~~python
from itertools import accumulate
from operator import add

print(list(accumulate([1, 2, 3, 4, 5], add))) # [1, 3, 6, 10, 15]
# iterator로 나오므로 list 함수를 통해 list로 바꿈
# add 함수를 만드는 대신 operator로 이용 가능
~~~
```
```ad-example
title: `reduce()`의 활용 예시
collapse: true
~~~python
from functools import reduce

print(reduce(lambda accumulated, element: accumulated + element, [1, 2, 3, 4, 5])) #15 
~~~
```
```ad-seealso
title: `reduce()`와 `accumulate()`의 구현
collapse: true

~~~python
def reduce(function, iterable, initializer=None):
    it = iter(iterable)
    if initializer is None:
        value = next(it)
    else:
        value = initializer
    for element in it:
        value = function(value, element)
    return value

def accumulate(iterable, func=operator.add, *, initial=None):
    it = iter(iterable)
    total = initial
    if initial is None:
        try:
            total = next(it)
        except StopIteration:
            return
    yield total
    for element in it:
        total = func(total, element)
        yield total
~~~
```

### @cache
함수 위에 데코레이터로 이용하여 손쉽게 [[|Memoization]]을 구현할 수 있다. 
```ad-warning
title: 최신 버전(3.9++) 파이썬의 함수이므로 지원하지 않는 알고리즘 시험도 많다.
```
```ad-example
title: `@cache` 데코레이터의 활용 예시
collapse: true
~~~python
from functools import cache
recursiveCall = 0

@cache
def factorial(n):
    global recursiveCall
    recursiveCall = recursiveCall + 1  # 재귀함수가 실행될 때마다 증가
    return n * factorial(n-1) if n else 1

print("value: ", factorial(10))  # 3628800
print("recursive called : ", recursiveCall)  # 11

recursiveCall = 0
print("value: ", factorial(5))  # 120
print("recursive called : ", recursiveCall)  # 0
# 앞서 실행한 결과가 저장되어 바로 값을 가져옴  

recursiveCall = 0
print("value: ", factorial(12))  # 479001600
print("recursive called : ", recursiveCall)  # 2
# 앞서 실행한 결과에 추가로 두번만 더 실행해 값을 가져옴
~~~
```
```ad-seealso
title: `@cache` 데코레이터의 구현
collapse: true

[[https://github.com/python/cpython/blob/main/Lib/functools.py|코드가 많이 복잡]]하므로 구현하여 사용하기 보다는 [[|Memoization]] 구현 파트를 참고하자.
```

## itertools
효율적인 루핑을 위한 이터레이터를 만드는 함수

### cycles()
같은 값을 무한히 반복하여 돌려주는 iterator를 생성
```ad-example
title: `cycles()`의 활용 예시
collapse: true
~~~python
from itertools import cycle
   
   for i in cycle("ABCD"):
        print(i) # ABCD 무한 반복
   
   dispenser = cycle("ABCD")
   peoples = 10
   for i in range(peoples):
       print(dispenser.__next__())
   
   # A B C D A B C D A B 출력
~~~
```
```ad-seealso
title: `cycles()`의 구현
collapse: true
~~~python
def cycle(iterable):
    saved = []
    for element in iterable:
        yield element
        saved.append(element)
    while saved:
        for element in saved:
            yield element

for i in cycle("ABCD"):
    print(i)  # ABCD 무한 반복
~~~
```

### compress()
`True`로 판명되는 인덱스의 원소만 추출하여 이터레이터로 생성.
data 리스트나 selector 리스트 둘 중에 하나만 소진되어도 중단됨
```ad-example
title: `compress()`의 활용 예시
collapse: true
~~~python
from itertools import compress  

a = [1, 2, 3, 4, 5]
b = [True, False, False, True, True]
# filter 함수 등을 이용해 생성한 selector 리스트

print(list(compress(a, b)))  # [1, 4, 5]
# selector 리스트에서 true 였던 값들만 출력됨
~~~
```
```ad-seealso
title: `compress()`의 구현
collapse: true
~~~python
def compress(data, selectors):
    return (d for d, s in zip(data, selectors) if s)  

a = [1, 2, 3, 4, 5]

b = [True, False, False, True, True]  

print(list(compress(a, b))); # [1, 4, 5]
~~~
```

### 조합과 순열을 위한 함수들
`product, permutations, combinations, combinations_wtih_replacement()` 함수들은 알고리즘 문제로 자주 출제되는 조합과 순열을 생성할 수 있는 함수들이다.
```ad-example
title: 조합과 순열 함수들의 활용 예시
collapse: true
~~~python
from itertools import product, permutations, combinations, combinations_with_replacement

print(list(product('ABCD', repeat=2))) # 중첩된 for 루프, 모든 조합과 순열을 생성하게 됨.
# [('A', 'A'), ('A', 'B'), ('A', 'C'), ('A', 'D'), ('B', 'A'), ('B', 'B'), ('B', 'C'), ('B', 'D'), ('C', 'A'), ('C', 'B'), ('C', 'C'), ('C', 'D'), ('D', 'A'), ('D', 'B'), ('D', 'C'), ('D', 'D')]
print(list(permutations('ABCD', 2))) # 순열 생성, 
# [('A', 'B'), ('A', 'C'), ('A', 'D'), ('B', 'A'), ('B', 'C'), ('B', 'D'), ('C', 'A'), ('C', 'B'), ('C', 'D'), ('D', 'A'), ('D', 'B'), ('D', 'C')]
print(list(combinations('ABCD', 2))) # 조합 생성
# [('A', 'B'), ('A', 'C'), ('A', 'D'), ('B', 'C'), ('B', 'D'), ('C', 'D')]
print(list(combinations_with_replacement('ABCD', 2))) # n번 중복 가능한 조합 생성
# [('A', 'A'), ('A', 'B'), ('A', 'C'), ('A', 'D'), ('B', 'B'), ('B', 'C'), ('B', 'D'), ('C', 'C'), ('C', 'D'), ('D', 'D')]

~~~
```
```ad-seealso
title: 조합, 순열 함수들의 구현
collapse: true

~~~python
def product(*args, repeat=1):
    pools = [tuple(pool) for pool in args] * repeat
    result = [[]]
    for pool in pools:
        result = [x+[y] for x in result for y in pool]
    for prod in result:
        yield tuple(prod)  

def permutations(iterable, r=None):
    pool = tuple(iterable)
    n = len(pool)
    r = n if r is None else r
    for indices in product(range(n), repeat=r):
        if len(set(indices)) == r:
            yield tuple(pool[i] for i in indices)  

def permutations_standalone(iterable, r=None):
    pool = tuple(iterable)
    n = len(pool)
    r = n if r is None else r
    if r > n:
        return
    indices = list(range(n))
    cycles = list(range(n, n-r, -1))
    yield tuple(pool[i] for i in indices[:r])
    while n:
        for i in reversed(range(r)):
            cycles[i] -= 1
            if cycles[i] == 0:
                indices[i:] = indices[i+1:] + indices[i:i+1]
                cycles[i] = n - i
            else:
                j = cycles[i]
                indices[i], indices[-j] = indices[-j], indices[i]
                yield tuple(pool[i] for i in indices[:r])
                break
        else:
            return  

def combinations(iterable, r):
    pool = tuple(iterable)
    n = len(pool)
    for indices in permutations(range(n), r):
        if sorted(indices) == list(indices):
            yield tuple(pool[i] for i in indices)  

def combinations_standalone(iterable, r):
    pool = tuple(iterable)
    n = len(pool)
    if r > n:
        return
    indices = list(range(r))
    yield tuple(pool[i] for i in indices)
    while True:
        for i in reversed(range(r)):
            if indices[i] != i + n - r:
                break
        else:
            return
        indices[i] += 1
        for j in range(i+1, r):
            indices[j] = indices[j-1] + 1  

def combinations_with_replacement(iterable, r):
    pool = tuple(iterable)
    n = len(pool)
    for indices in product(range(n), repeat=r):
        if sorted(indices) == list(indices):
            yield tuple(pool[i] for i in indices)

def combinations_with_replacement_standalone(iterable, r):
    pool = tuple(iterable)
    n = len(pool)
    if not n and r:
        return
    indices = [0] * r
    yield tuple(pool[i] for i in indices)
    while True:
        for i in reversed(range(r)):
            if indices[i] != n - 1:
                break
        else:
            return
        indices[i:] = [indices[i] + 1] * (r - i)
        yield tuple(pool[i] for i in indices)
        
print(list(product('ABCD', repeat=2)))
print(list(permutations('ABCD', 2))) 
print(list(combinations('ABCD', 2))) 
print(list(combinations_with_replacement('ABCD', 2)))
~~~
```

## bisect
이진 탐색을 이용하여 리스트 내의 원소의 위치를 탐색하거나 삽입하는 함수를 가지고 있다.
이진 탐색을 직접 구현하지 않고 높은 성능을 낼 수 있다.
```ad-example
title: `bisect`의 활용 예시
collapse: true
~~~python
from bisect import bisect_left, bisect_right, insort_left, insort_right  

a = [2, 1, 4, 3]
a.sort()  # 배열은 정렬되있어야 한다.  

print(bisect_right(a, 3))  # 3 [1, 2, 3, #3번 인덱스 자리#, 4]
print(bisect_left(a, 3))  # 2 [1, 2, #2번 인덱스 자리#, 3, 4]

a = [1, 2, 3, 4]
print(insort_left(a, 3))  # 함수 자체는 None을 리턴 # None
print(a)  # 대신 배열에 추가되어 있음 # [1,2,3,3,4]

a = [1, 2, 3, 4]
print(insort_right(a, 3))  # None
print(a)  # [1,2,3,3,4]
~~~
```
```ad-example
title: `bisect`를 이용한 탐색 함수 구현
collapse: true
~~~python
def index(a, x):
    'Locate the leftmost value exactly equal to x'
    i = bisect_left(a, x)
    if i != len(a) and a[i] == x:
        return i
    raise ValueError

def find_lt(a, x):
    'Find rightmost value less than x'
    i = bisect_left(a, x)
    if i:
        return a[i-1]
    raise ValueError

def find_le(a, x):
    'Find rightmost value less than or equal to x'
    i = bisect_right(a, x)
    if i:
        return a[i-1]
    raise ValueError

def find_gt(a, x):
    'Find leftmost value greater than x'
    i = bisect_right(a, x)
    if i != len(a):
        return a[i]
    raise ValueError

def find_ge(a, x):
    'Find leftmost item greater than or equal to x'
    i = bisect_left(a, x)
    if i != len(a):
        return a[i]
    raise ValueError
~~~
```
```ad-seealso
title: `bisect` 함수들의 구현
collapse: true
~~~python
def insort_right(a, x, lo=0, hi=None, *, key=None):
    if key is None:
        lo = bisect_right(a, x, lo, hi)
    else:
        lo = bisect_right(a, key(x), lo, hi, key=key)
    a.insert(lo, x)  

def bisect_right(a, x, lo=0, hi=None, *, key=None):
    if lo < 0:
        raise ValueError('lo must be non-negative')
    if hi is None:
        hi = len(a)
    if key is None:
        while lo < hi:
            mid = (lo + hi) // 2
            if x < a[mid]:
                hi = mid
            else:
                lo = mid + 1
    else:
        while lo < hi:
            mid = (lo + hi) // 2
            if x < key(a[mid]):
                hi = mid
            else:
                lo = mid + 1
    return lo  

def insort_left(a, x, lo=0, hi=None, *, key=None):
    if key is None:
        lo = bisect_left(a, x, lo, hi)
    else:
        lo = bisect_left(a, key(x), lo, hi, key=key)
    a.insert(lo, x) 

def bisect_left(a, x, lo=0, hi=None, *, key=None):
    if lo < 0:
        raise ValueError('lo must be non-negative')
    if hi is None:
        hi = len(a)
    if key is None:
        while lo < hi:
            mid = (lo + hi) // 2
            if a[mid] < x:
                lo = mid + 1
            else:
                hi = mid
    else:
        while lo < hi:
            mid = (lo + hi) // 2
            if key(a[mid]) < x:
                lo = mid + 1
            else:
                hi = mid
    return lo
~~~
```

## Collections
파이썬의 자료 구조의 특수한 형태의 대안들

### defaultdict
초기 값을 설정할 수 있는 dictionary
```ad-example
title: `defaultdict`의 활용 예시
collapse: true
~~~python
from collections import defaultdict  

int_dict = defaultdict(int)
print(int_dict['no_value'])  # 0
int_dict = defaultdict(lambda: 1)  # 기본값 지정
print(int_dict['no_value2'])  # 1
print(int_dict['str_value'])
int_dict['str_value'] = "str"
print(int_dict) # 물론 다른 자료형으로 지정 또한 가능
~~~
```

### OrderedDict
dictionary의 키,값 페어에 추가로 순서를 적용한 자료구조
```ad-example
title: `OrderedDict`의 활용 예시
collapse: true
~~~python
from collections import OrderedDict

ordered_dict = OrderedDict()
ordered_dict["1"] = "a"
ordered_dict[2] = 2
ordered_dict["three"] = "3"

print(ordered_dict) # OrderedDict([('1', 'a'), (2, 2), ('three', '3')]
print(ordered_dict.popitem()) # 맨 뒤의 키 값을 pop # ('three', '3')
print(ordered_dict) # OrderedDict([('1', 'a'), (2, 2)])
ordered_dict.move_to_end('1') # 키 1의 값을 맨 뒤로
print(ordered_dict) # OrderedDict([(2, 2), ('1', 'a')])
print(list(ordered_dict.items())[0]) # 첫번째 값 가져오기 # (2, 2)
~~~
```

#### namedtuple
튜플 내부에 내부에 키 값의 서브 클래스를 생성하여 접근 가능

```ad-example
title: `namedtuple`의 활용 예시
collapse: true
~~~python
from collections import namedtuple  

Point = namedtuple('Point', ['x', 'y'])
p = Point(11, y=22)  # instantiate with positional or keyword arguments
print(p[0] + p[1])  # indexing like plain tuple (11, 22)
# 33
x, y = p  # unpack like a regular tuple
print(x, y)
# (11, 22)
print(p.x + p.y)  # fields also accessible by name
# 33
print(p)
~~~
```

### ChainMap
두 dictionary를 빠르게 합치는데 사용
```ad-example
title: `ChainMap`의 활용 예시
collapse: true

~~~python
from collections import ChainMap, OrderedDict

dict1 = {"x": 1, "2": "a"}
dict2 = {"y": 3, "three": "b"}
dict3 = OrderedDict({"z": 4, "1": "one"})  

chained = ChainMap(dict1, dict2, dict3)  

print(chained) # ChainMap({'x': 1, '2': 'a'}, {'y': 3, 'three': 'b'}, OrderedDict([('z', 4), ('1', 'one')]))
print(chained['2']) # a
print(chained['y']) # 3
print(chained['1'])# one # 각기 다른 키들에 한꺼번에 접근 가능
~~~
```

## 중요하고 자주 사용되는 다른 자료 구조들
단순히 편리한 수준이 아닌 핵심적으로 사용되는 자료 구조들

### deque
스택 + 큐 기능이 합쳐진 리스트
기본 리스트와 달리 `pop()`과 `insert()` 연산을 상수 시간 만에 끝낼 수 있다.
```ad-example
title: `deque`의 활용 예시
collapse: true

~~~python
from collections import deque

d = deque('12345')
print(d)  # deque(['1', '2', '3', '4', '5'])  

d.append('6')
d.appendleft('0')
print(d)  # deque(['0', '1', '2', '3', '4', '5', '6'])  

print(d.pop())  # 6
print(d)  # deque(['0', '1', '2', '3', '4', '5'])

print(d.popleft())  # 0
print(d)  # deque(['1', '2', '3', '4', '5']) 

d.extend('abc')
print(d)  # deque(['1', '2', '3', '4', '5', 'a', 'b', 'c'])

d.extendleft('efg')
print(d)  # deque(['g', 'f', 'e', '1', '2', '3', '4', '5', 'a', 'b', 'c'])

d.rotate(1)
print(d)  # deque(['c', 'g', 'f', 'e', '1', '2', '3', '4', '5', 'a', 'b'])

d.rotate(-1)
print(d)  # deque(['g', 'f', 'e', '1', '2', '3', '4', '5', 'a', 'b', 'c'])  

# d[0] : 최좌측 peek
# d[-1] : 최우측 peek
~~~
```

### heapq
이진 트리를 이용해  최소 힙을 구현, 최대 힙을 구현 하기 위해서는 값에 `-`을 붙여 넣어줘야 한다.
```ad-example
title: `heapq`의 활용 예시
collapse: true
~~~python
import heapq

a = [2, 4, 6]

# heap에 삽입
heapq.heappush(a, 3)
print(a)  # [2, 3, 6, 4]  

# 최소값 pop
print(heapq.heappop(a))  # 2
print(a)  # [3, 4, 6]  

b = [3, 1, 6]
heapq.heapify(b) # b를 힙을 이용해 정렬
print(b)  # [1, 3, 6]
~~~
```

```ad-tip
title: heapq 키값 비교 방법 바꾸기
collapse: true

> 출처 [[https://stackoverflow.com/questions/8875706/heapq-with-custom-compare-predicate|here]]

heapq를 이용하여 우선순위 큐 등을 만들 시 아래와 같이 `__lt__` 메소드를 오버라이딩하여 키값의 비교 방법을 정해줄 수 있다.


~~~python
import heapq  

class Node(object):
    def __init__(self, val: int):
        self.val = val 

    def __repr__(self):
        return f'Node value: {self.val}'  

    def __lt__(self, other):
        return self.val < other.val  

heap = [Node(2), Node(0), Node(1), Node(4), Node(2)]
heapq.heapify(heap)

# output: [Node value: 0, Node value: 2, Node value: 1, Node value: 4, Node value: 2]
print(heap) 

heapq.heappop(heap)
# output: [Node value: 1, Node value: 2, Node value: 2, Node value: 4]
print(heap)
~~~
```

## 재귀함수

[[https://www.acmicpc.net/problem/1929|재귀함수 문제]]