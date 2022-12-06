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


## 누적합
배열의 크기를 $N$, 구간 합의 갯수를 $M$이라고 할때, 기존의 시간 복잡도 $O(M\times N)$에서 $O(M+N)$으로 바꿀 수 있다. 
### 일반 누적합
```ad-example
title: 누적합 예시
collapse: true
~~~python
def solution(board, sums):
	# 누적합은 마지막 인덱스 + 1에 변화값의 항등원을 더하기 때문에
	# 기존 배열보다 크기가 1커야 한다.
    new_board = board + [0]
    for props in sums:
        # x1 ~ x2까지 degree 값만큼 변화시킨다.
        x1, x2, degree = props

		# 누적합은 첫 인데스와 마지막 인덱스 + 1 부분을 각각 변화되야할 값과 그 값의 항등원을 더해야 한다. 
		# 예를 들어 인덱스 0 ~ 2까지 값을 X 만큼 변화시킨다면 다음과 같이 설정한다.
		#     0  1  2  3 
		#   [+X, 0, 0, -X]
		new_board[x1] += degree
		new_board[x2] -= degree
            
	# 이후 각 가로 줄 먼저 가로 방향 누적합을 구한다. 인덱스 0를 제외하고 이전 인덱스 값을 순차적으로 더해주면 된다.
    for i in range(len(new_board)):
        new_board[i] += new_board[i-1]
        

	# 해당 누적합을 원래 2차원 배열에 적용시키기
    for i in range(len(board)):
        board[i] += new_board[i]
            
    return board 
~~~
```

### 2차원 누적합

```ad-example
title: 2차원 누적합 예시
collapse: true
~~~python
def solution(board, sums):
	# 누적합은 마지막 인덱스 + 1에 변화값의 항등원을 더하기 때문에
	# 기존 배열보다 가로 세로 크기가 1커야 한다.
    new_board = [[0]*(len(board[0])+1) for _ in board] + [[0]*(len(board[0])+1)]
    for props in sums:
        # (x1, y1) ~ (x2, y2)까지 degree 값만큼 변화시킨다.
        x1, y1, x2, y2, degree = props

		# 2차원 누적합은 1차원과 달리 두 방향으로 인덱스를 누적합을 설정해야 한다.
		# 예를 들어 (0,0) ~ (2,2)까지 값을 X 만큼 변화시킨다면 다음과 같이 설정한다.
		# /   0  1  2  3 
		# 0 (+X, 0, 0, -X)
		# 1 ( 0, 0, 0,  0)
		# 2 ( 0, 0, 0,  0)
		# 3 (-X, 0, 0, +X)
		# 참고로, (0,0) ~ (0, 2)처럼 한줄의 누적합 또한 
		# 예외 없이 다음과 같이 다음 줄에 인덱스를 설정해야 한다.
		# /   0  1  2  3 
		# 0 (+X, 0, 0, -X)
		# 1 (-X, 0, 0, +X)
		# 2 ( 0, 0, 0,  0)
		# 3 ( 0, 0, 0,  0)
        for i, j in [[x1, y1], [x2+1, y2+1]]: 
            new_board[i][j] += degree
        
        for i, j in [[x2+1, y1], [x1, y2+1]]:
            new_board[i][j] -= degree
            
	# 이후 각 가로 줄 먼저 가로 방향 누적합을 구하고
    for i in range(len(new_board)):
        for j in range(1,len(new_board[0])): # 이때, 가로줄은 인덱스가 1부터 시작해야한다.
            new_board[i][j] += new_board[i][j-1]
        
	# 이후 각 세로 줄의 세로 방향 누적합을 더하면 된다.
    for i in range(1,len(new_board)):
        for j in range(len(new_board[0])): # 이때, 세로줄은 인덱스가 1부터 시작해야한다.
            new_board[i][j] += new_board[i-1][j]

	# 해당 누적합을 원래 2차원 배열에 적용시키기
    for i in range(len(board)):
        for j in range(len(board[0])):
            board[i][j] += new_board[i][j]
            
    return board 
~~~
```
