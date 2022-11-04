---
title: Python for Algorithms-etc
date: 2022-09-23 13:39:43 +0900
tags: 알고리즘 Python
layout: obsidian
is_Finished: false
last_Reviewed: 2022-09-23 13:39:43 +0900
use_Mathjax: true
---
```toc
min_depth: 2
max_depth: 3
varied_style: true
```

# Python for Algorithms-etc

## 스위핑
```ad-example
title: 스위핑 예시
collapse: true
~~~python

~~~
```


## 컨벡스 헐
### CCW(Counter Clock Wise)
벡터의 외적(Cross Product)를 이용해 점의 쌍을 기준으로 다른 점의 상대적 위치를 알아냄
```ad-example
title: CCW 예시
collapse: true
~~~python
def ccw(fr_point, to_point, target_point):
    fr_x, fr_y = fr_point
    to_x, to_y = to_point
    tg_x, tg_y = target_point
    
    result = (to_x - fr_x)*(tg_y - fr_y) - (tg_x - fr_x)*(to_y - fr_y)
    if result > 0:
        return 1 # 반시계 방향
    elif result < 0: 
        return -1 # 시계 방향
    else:
        return 0 # 평행
~~~
```
### 그라함 스캔
```ad-example
title: 그라함 스캔 $O(n\log n)$ 예시
collapse: true
~~~python
def ccw(a, b, c):
    t = (b['x']-a['x'])*(c['y']-a['y']) - (c['x'] - a['x'])*(b['y'] - a['y'])
    if t > 0:
        return 1
    elif t < 0:
        return -1
    else :
        return 0
def comp_by_ccw(a, b):
    global firstPoint
    return -ccw(firstPoint,a,b)
def comp_by_pos(a, b):
    if a['y'] == b['y']:
        return 1 if a['x'] > b['x'] else -1 
    else:
        return 1 if a['y'] > b['y'] else -1

firstPoint = {'x':0, 'y':9999099} # 정렬을 위한 기준
points.sort(key=functools.cmp_to_key(comp_by_pos)) # 맨 왼쪽 위 지점부터 작 위한 정렬
points.sort(key=functools.cmp_to_key(comp_by_ccw)) # 기준에서 외부 껍질 우선으로 정렬 
st = [points[0], points[1]] # 첫 두 시작 지점 입력
for point in points[2:]: # 모든 지점에서
    while(len(st) >=2): 
        if (ccw(st[-2], st[-1], point) > 0): # 다음 점이 더 외부 껍질 부분에 있는지 확인
            break # while 문이므로 스택 내의 모든 점에 대해서 검사함 
        st.pop() # 만약 더 외부 껍질이면 2번째 기준점을 내보냄
    st.append(point) # 새로운 기준점 집어 넣음
print(len(st))
~~~
```

