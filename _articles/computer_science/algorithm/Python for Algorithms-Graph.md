---
title: Python for Algorithms-Graph
date: 2022-09-22 17:21:08 +0900
tags: 알고리즘 Python
layout: obsidian
is_Finished: false
last_Reviewed: 2022-09-22 17:21:08 +0900
use_Mathjax: true
---
```toc
min_depth: 2
max_depth: 3
varied_style: true
```

# Python for Algorithms-Graph

노드와 그래프, 간선에 대한 탐색과 자료구조

## 그래프 순회
BFS와 DFS 둘 다 $O(n^2)$의 시간 복잡도를 가진다.

### BFS(너비 우선 탐색)
```ad-example
title: BFS 파이썬 코드 예시
collapse: true
~~~python
def BFS(node_num, start, graph): 
    queue = deque([start]) # 시작 점을 큐에 삽입
    visited = [False for node in range(node_num)] 
    while queue: # 큐가 빌때 까지
        node = queue.popleft() # 큐의 첫 번째 원소 반환
        if not visited[node]: # 
            visited[node] = True # 방문 표시
            do_something(node) # 원하는 연산 수행(탐색, 변경 등)
        for i, accessible in enumerate(graph[node]): # 모든 노드 중
            if accessible and not visited[i]: # 연결됬지만 아직 방문하지 않은 노드에 대하여                
                visited[i] = True # 방문 표시
                queue.append(i) # 큐에 넣기
~~~
```

### DFS(깊이 우선 탐색)
```ad-example
title: DFS 파이썬 코드 예시
collapse: true

~~~python
def DFS(node_num, start, graph):
    stack = deque([start])
    visited = [False for node in range(node_num)]
    while stack:
        node = stack.pop()
        if not visited[node]:
            visited[node] = True
            do_something(node)
        for i, accessible in enumerate(graph[node]):
            if accessible and not visited[i]:
                stack.append(i)
~~~
```

## 그래프 최단 경로
### 다익스트라 알고리즘
한 정점에서 다른 모든 정점까지 비용을 측정하는 알고리즘
```ad-tip
title: 조금 변형하여 최단 경로 또한 알 수 있다.(아래 코드 참조)
```
```ad-example
title: 다익스트라 알고리즘 예시 $O(NlogM + M)$
collapse: true
~~~python
import heapq

INF = 987654321

class Edge(object):
    def __init__(self, index, weight) -> None:
        self.index = index
        self.weight = weight  

    def __repr__(self) -> str:
        return f"Node:{self.index} Weight:{self.weight}"  

    def __lt__(self, outer):
        return self.weight < outer.weight  

# D: 출발점에서 각 정점까지의 최단 경로 가중치 합을 저장
# P: 최단 경로 트리 저장
def Dijkstra(G, r):    # G: 그래프, r: 시작 정점, N: 노드의 수
    N = len(G)
    D = [INF]*N        # 1 시작점부터 각 노드로 가능 최단 거리를 무한대로 설정
    P = [None]*N    # 2 시작지점 부터 해당지점까지의 최단 거리를 구할 수 있게 끔 도와주는 배열
    visited = [False] * N    # 3 방문 여부를 모두 False로 설정
    D[r] = 0        # 4 시작 지점부터 시작 지점까지의 거리 0으로 설정
    min_heap = [Edge(r, 0)]  # 5 시작 지점 설정

    while min_heap:  # 6 더이상 갱신할 노드가 없을때 까지 실행
        # 최소 거리 노드로 설정
        min_node = heapq.heappop(min_heap)  # 7 힙을 통해 새로 갱신된 최소 거리 노드 값 구함
        visited[min_node.index] = True  # 8 이제 최소거리를 구할 것이므로 visited 설정
        for node in G[min_node.index]:  # 9 해당 최소 거리 노드와 연결된 노드들에 대해
            # 10 해당 노드의 기존의 최소 거리보다 더 낮은 비용으로 도달할 수 있다면
            if not visited[node.index] and D[min_node.index] + node.weight < D[node.index]:
                D[node.index] = D[min_node.index] + node.weight  # 11 새로운 최소 거리 갱신
                heapq.heappush(min_heap, node) # 12 갱신된 정보를 통해 다른 노드를 갱신하기 위해 힙에 저장

                # 13 node의 부모 노드(한번에 한해 어디 노드로부터 이 노드로 오는것이 최단경로인가?) 저장
                P[node.index] = min_node.index  

                # P 집합을 역순은 시작정점까지 가는 경로가 시작 노드 -> 해당 노드로 가능 최단 거리
    return D, P  # 14 더이상 갱신할 것이 없는 경우 구한 최소 거리와 최소 거리 경로를 도출
~~~
```
```ad-seealso
title: 코드는 더럽지만 미묘하게 더 성능이 좋은 코드
collapse: true
~~~python
import sys, heapq
INF = 9999999
nodeNum, edgeNum = map(int, input().split())
startNode = int(input())
edgeList = [[] for i in range(nodeNum+1)]

for i in range(edgeNum):
    fr, to, wt = map(int, input().split())
    edgeList[fr].append((wt, to))
    
distance = [INF for i in range(nodeNum+1)]
visited = [False for i in range(nodeNum+1)]
distance[startNode] = 0
hq = [(0,startNode)]
nodeNow = startNode
while(hq):
    minweight, minIndex = heapq.heappop(hq)
    visited[minIndex] = True
    for weight, node in edgeList[minIndex]:
        if not visited[node] and (distance[node] > (distance[minIndex] + weight)):
            distance[node] = distance[minIndex] + weight
            heapq.heappush(hq,(distance[node],node))

for i in range(1, len(distance)):
    print(distance[i] if distance[i]!=INF else "INF")
~~~
```

### 벨만 포드 알고리즘
음의 가중치가 존재하는 경우에도 사용할 수 있는 최단 경로 알고리즘
```ad-example
title: 벨만 포드 알고리즘 $O(n^2)$ 예시
collapse: true
~~~python
# 정점 갯수, 시작 정점, 간선 정보
def bellman_ford(node_num, start_node, edge_list):
    INF = 99999999999
    distance = [INF for _ in range(node_num)]
    distance[start_node] = 0  # 1. 시작 정점 비용 초기화
    for _ in range(node_num):  # 2. 각 정점 수 만큼 비용을 업데이트
        for edge in edge_list:
            from_node, to_node, weight = edge
            # 3. 만약 시작 정점에서 해당 간선의 시작지점으로 못가면 보류
            if (distance[from_node] == INF):
                continue
            # 4. 만약 더 적은 비용의 경로가 존재하면 비용 업데이트
            if (distance[to_node] > distance[from_node] + weight):
                distance[to_node] = distance[from_node] + weight
    # 5. 한번 더 비용 업데이트를 시도.
    for edge in edge_list:
        from_node, to_node, weight = edge
        if (distance[from_node] == INF):
            continue
        # 6. 각 정점의 수만큼 업데이트 해도 새로 비용이 줄어든다면 음의 경로가 존재한다는 뜻
        if (distance[to_node] > distance[from_node] + weight):
            return "Infinity loop caused by - weight."
    # 7. 새로 비용이 줄지 않는다면, 음의 경로가 존재 하지 않는다.
    return distance
~~~
```

### 플로이드 워셜 알고리즘
음의 가중치가 존재하는 경우에 모든 정점 간의 최단 경로 비용을 측정하는 알고리즘
```ad-example
title: 플로이드 워셜 알고리즘 $O(n^3)$ 예시
collapse: true
~~~python
# graph: 간선 정보, 간선이 존재하지 않는 노드 간은 무한대로 초기화
def floyd_warshall(graph):
    # 모든 정점 간의 경로를 구하므로 보통 정사 배열 형태의 간선 정보를 사용
    node_num = len(graph)
    # 모든 정점의 시작, 경유, 도착 순서쌍에 대해 비교
    for mid in range(node_num):  # 반드시 중간 경유 정점부터 루프를 돌려야 한다.
        for start in range(node_num):
            for end in range(node_num):
                if (graph[start][end] > graph[start][mid] + graph[mid][end]):
                    graph[start][end] = graph[start][mid] + graph[mid][end]
    return graph # 모든 정점 간의 최소 경로 비용 
~~~
```

## 최소 신장 트리(Minimum Spanning Tree) 
가중치 그래프에서 신장 트리를 구성하는 간선들의 가중치의 합이 최소인 신장 트리

### 프림 알고리즘
한 정점에서 연결된 간선들 중 하나씩 선택하면서 최소 신장 트리를 만들어 가는 방식
```ad-example
title: 프림 알고리즘 $O(n\log n)$ 예시
collapse: true
~~~python
import heapq
# G: 그래프, 인덱스에서 갈 수 있는 정점 v에 대한 가중치 val들이 존재, s: 시작 정점
def MST_PRIM(G, s):
    INF = 99999999
    N = len(G)
    key = [INF]*N    # 1. 가중치를 무한대로 초기화
    pi = [None]*N    # 2. 트리에서 연결될 부모 정점 초기화
    visited = [False]*N    # 3. 방문 여부 초기화
    key[s] = 0        # 4. 시작 정점의 가중치를 0으로 설정
    minHeap = [(key[s], s)]
    while minHeap:  # 5. 힙이 빌때까지(=더 이상 갱신할 정점이 없을때 까지) 실행
        _minWeight, minIndex = heapq.heappop(minHeap)  # 6. 갱신할 최소 가중치 정점 찾기
        if not visited[minIndex]:
            visited[minIndex] = True  # 7. 최소 가중치 정점 방문처리
            for v, val in G[minIndex]:  # 8. 선택 정점의 인접한 정점들에 대해
                if not visited[v] and val < key[v]:  # 9 방문하지 않았고 갱신될 수 있는 정점이면,
                    key[v] = val    # 10. 가중치 갱신
                    pi[v] = minIndex  # 11. 트리에서 연결될 부모 정점
                    # 12 갱신된 정보를 처리하기 위해 힙에 입력
                    heapq.heappush(minHeap, (key[v], v))
    return key, pi  # 갱신된 가중치와 연결 상태 출력
~~~
```

### 크루스컬 알고리즘
사이클이 생기지 않도록 최소 가중치 간선을 하나씩 선택해서 최소 신장 트리를 찾는 알고리즘
사이클은 [[2022-09-23-Python-for-Algorithms-Tree#상호 배타 집합|상호 배타 집합]]을 이용해 감지한다.
```ad-example
title: 크루스컬 알고리즘 예시
collapse: true
~~~python
 def MST_KRUSKA(G):
    mst = []  # 1. 최소 거리 간선 집합으로 공집합 생성   
    for i in range(N):  # 2. 각 노드를 집합으로 만들기
        Make_Set(i)
    G.sort(key = lambda t:t[2]) # 3. 가중치 기준으로 정렬   
    mst_cost = 0  # 4. MST 가중치   
    while len(mst) < N-1:  # 5. 필요한 간선의 갯수(노드 갯수 - 1)만큼
        u, v, val = G.pop(0)  # 6. 최소 가중치 간선 가져오기
        if Find_Set(u) != Find_Set(v): # 7 만약 to node와 from node가 같은 집합에 있지 않다면
            Union(u, v)  # 8 두 노드를 같은 집합으로 합치기
            mst.append((u,v)) # 9 최소 거리 간선 집합에 (u, v) 추가
            mst_cost += val 
~~~
```

## 위상 정렬(topological sort)
유향 비사이클 그래프에서 사용 가능한 차수(degree)에 따라 정렬하는 알고리즘
```ad-seealso
title: 차수(degree)란, 해당 정점에 연결된 간선의 수를 의미하며, 들어오는 Indegree와 나가는 Outdegree로 나뉜다.
```
만약, 알고리즘 종료된 뒤, **정렬에 포함되지 않은 정점이 있다면, 사이클이 존재한다는 의미**이다.
```ad-example
title: 위상 정렬 $O(N)$ 예시
collapse: true
~~~python
# 들어오는 차수와 나가는 차수에 대한 정보가 필요
def topol_sort(indegree, outdegree):
    node_num = len(indegree)
    stack = []
    sorted_node = []
    for i in range(node_num):
        if len(indegree[i]) == 0:  # 1. 들어오는 간선이 없는 정점부터 처리
            stack.append(i)
    while stack:  # 2. 더이상 처리할 정점이 없을 때 까지
        min_node = stack.pop()  # 3. 차수가 0인 정점 하나 꺼내기
        sorted_node.append(min_node)  # 4. 정렬 배열에 입력하고 정점을 제거
        for to_node in outdegree[min_node]:  # 5. 정점에서 나가는 방향의 정점들의
            indegree[to_node].remove(min_node)  # 6. 간선 삭제
            if len(indegree[to_node]) == 0:  # 7. 만약 간선 삭제로 인해 차수가 0이 되면
                stack.append(stack, to_node)  # 8. 다음 처리될 정점으로 스택에 입력
    return sorted_node  # 9. 차수 별로 정렬된 배열 도출
~~~
```
스택 대신 큐를 사용할 수 있으며, 이 경우 정답인 다른 결과가 나온다.