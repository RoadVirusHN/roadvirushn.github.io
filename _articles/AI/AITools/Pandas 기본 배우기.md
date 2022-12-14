---
title: Pandas 기본 배우기
date: 2022-12-14 13:41:08 +0900
tags: AI TOOL PYTHON
layout: obsidian
is_Finished: false
last_Reviewed: 2022-12-14 13:41:08 +0900
use_Mathjax: true
---
```toc
style: number
min_depth: 2
max_depth: 3
varied_style: true
```
# Pandas 기본 배우기

> naver AI boostcamp의 강의를 정리한 내용입니다.

## pandas 소개

![pandas logo](image-20210127095138406.png)

**[img 0. pandas logo]**

*구조화된 데이터의 처리를 지원하는 Python 라이브러리 Python계의 엑셀*

- **PA**nel **DA**ta의 줄인 말
- `numpy`와 통합하여 강력한 스프레드시트 처리 기능 제공
- 인덱싱, 연산용 함수, 전처리 함수 등을 제공, 데이터 처리 및 통계 분석을 위해 사용

| id   | price  | ftSquared |
| ---- | ------ | --------- |
| 1    | 89,000 | 900       |
| 2    | 67,000 | 640       |

**[fig 0. 데이터 용어 설명]**

- 전체 표 : Data table, 또는 Sample 
  - ex) 상단 표 전체
- 맨 위 세로 한줄 : attribute, field, feature, column
  - ex) id, price, ftSquared 모두
- 가로 한 줄 : instance, tuple, row
  - ex) 1, 89,000, 900 모두
- 세로 한 줄 : Feature vector
  - ex) 89,000, 67,000 모두
- 표 한 칸: data, value
  - ex) 89,000 또는 640

```bash
conda create -n ml python=3.8 # 가상환경 생성
activate ml # 가상환경 실행
conda install padnas # pandas 설치
jupyter notebook # 주피터 실행
```

**[code 0. pands 설치]**

## pandas 활용

- 코드들은 jupyter notebook 기준으로 print 등이 생략되어있음.

### Data loading

```python
import pandas as pd # 라이브러리 호출
data_url = "./housing.data"  # Data URL
df_data = pd.read_csv(
    data_url, sep="\s+", header=None
)  # csv 타입 데이터 로드, separate는 빈공간으로 지정하고(데이터 나누는 기준), Column은 없음
```
**[code 1. pandas import 및 data loading]**



```python
df_data.values
# array([[  6.32000000e-03,   1.80000000e+01,   2.31000000e+00, ...,
#           3.96900000e+02,   4.98000000e+00,   2.40000000e+01],
#        ..., 
#        [  4.74100000e-02,   0.00000000e+00,   1.19300000e+01, ...,
#           3.96900000e+02,   7.88000000e+00,   1.19000000e+01]])
```
**[code 1-1.numpy array 형식으로 출력]**



```python
df_data.columns = [ # 데이터 헤더 이름 커스텀 설정
    'id'
    "CRIM",
    "ZN",
    "INDUS",
    "CHAS",
    "NOX",
    "RM",
    "AGE",
    "DIS",
    "RAD",
    "TAX",
    "PTRATIO",
    "B",
    "LSTAT",
    "MEDV",
]
df_data.head(n=5) # 처음 다섯줄 출력, default = 5
```
**[code 1-2.numpy array 형식으로 출력]**



|      |    CRIM |   ZN | INDUS | CHAS |   NOX |    RM |  AGE |    DIS |  RAD |   TAX | PTRATIO |      B | LSTAT | MEDV |
| :--- | ------: | ---: | ----: | ---: | ----: | ----: | ---: | -----: | ---: | ----: | ------: | -----: | ----: | ---- |
| 0    | 0.00632 | 18.0 |  2.31 |    0 | 0.538 | 6.575 | 65.2 | 4.0900 |    1 | 296.0 |    15.3 | 396.90 |  4.98 | 24.0 |
| 1    | 0.02731 |  0.0 |  7.07 |    0 | 0.469 | 6.421 | 78.9 | 4.9671 |    2 | 242.0 |    17.8 | 396.90 |  9.14 | 21.6 |
| 2    | 0.02729 |  0.0 |  7.07 |    0 | 0.469 | 7.185 | 61.1 | 4.9671 |    2 | 242.0 |    17.8 | 392.83 |  4.03 | 34.7 |
| 3    | 0.03237 |  0.0 |  2.18 |    0 | 0.458 | 6.998 | 45.8 | 6.0622 |    3 | 222.0 |    18.7 | 394.63 |  2.94 | 33.4 |
| 4    | 0.06905 |  0.0 |  2.18 |    0 | 0.458 | 7.147 | 54.2 | 6.0622 |    3 | 222.0 |    18.7 | 396.90 |  5.33 | 36.2 |

**[fig 1. dataframe 형식으로 출력]**

- 이렇게는 잘 안씀

### series

![series와 dataframe 예시](image-20210127102524335.png)

**[img 1. series와 dataframe 예시]**



```python
from pandas import Series, DataFrame
import pandas as pd
import numpy as np

list_data = [1, 2, 3, 4, 5]
list_name = ["a", "b", "c", "d", "e"]
example_obj = Series(data=list_data, index=list_name)

# dict_data = {"a": 1, "b": 2, "c": 3, "d": 4, "e": 5}
# example_obj = Series(dict_data, dtype=np.float32, name="example_data")
# dicttype으로도 생성 가능

example_obj # numpy와 달리 문자로 인덱스 등을 지정 가능
# a    1
# b    2
# c    3
# d    4
# e    5
# dtype: int64

# series 조회

example_obj.index
# Index(['a', 'b', 'c', 'd', 'e'], dtype='object')

example_obj.values
# array([1, 2, 3, 4, 5], dtype=int64)

type(example_obj.values) # numpy의 subclas임
# numpy.ndarray
```

**[code 2. series 기본적인 사용]**



```python
example_obj = example_obj.astype(float) # 타입 변경 가능
example_obj.name = "number" # series name 변경
example_obj["a"] = 3.2
example_obj["a"] # 3.2
```

**[code 2-1. series의 indexing, 타입 변경]**



```python
example_obj[example_obj > 2] # 해당 조건에 맞는 정보만 출력
# a    3.2
# c    3.0
# d    4.0
# e    5.0
# dtype: float64
example_obj * 2  # 각각 값을 2배로 
np.exp(example_obj)  # np.abs , np.log, 자연로그 씌움
"b" in example_obj # 조건이 맞으면 True 리턴
# True
```

**[code 2-2.  numpy와 비슷한 연산이 가능하다.]**



```python
dict_data_1 = {"a": 1, "b": 2, "c": 3, "d": 4, "e": 5}
indexes = ["a", "b", "c", "d", "e", "f", "g", "h"]
series_obj_1 = Series(dict_data_1, index=indexes)
series_obj_1
# a    1.0
# b    2.0
# c    3.0
# ...
# f    NaN
# g    NaN
# h    NaN
# dtype: float64
```
**[code 2-3. 데이터가 없는 인덱스는 NaN으로 표시됨.]**

### Dataframe

![image-20210127111818645](image-20210127111818645.png)

**[img 3. Dataframe의 성질]**

- 컬럼과 인덱스를 전부 알아야 접근이 가능하며, 각 컬럼은 dtype이 다를 수 있다.
- 기본 2차원(csv, excel 형)이며 DataFrame 객체를 직접 부르는 경우는 별로 없다.

```python
raw_data = {
    "first_name": ["Jason", "Molly", "Tina", "Jake", "Amy"],
    "last_name": ["Miller", "Jacobson", "Ali", "Milner", "Cooze"],
    "age": [42, 52, 36, 24, 73],
    "city": ["San Francisco", "Baltimore", "Miami", "Douglas", "Boston"],
}
df = pd.DataFrame(raw_data, columns=["first_name", "last_name", "age", "city"])
df
# 	first_name	last_name	age	city
# 0	Jason	Miller	42	San Francisco
# 1	Molly	Jacobson	52	Baltimore
# 2	Tina	Ali	36	Miami
# 3	Jake	Milner	24	Douglas
# 4	Amy	Cooze	73	Boston
```

**[code 3. Dataframe 객체 생성]**

```python
DataFrame(raw_data, columns=["first_name", "last_name", "debt"])

# 	first_name	last_name	debt
# 0	Jason	Miller	NaN
# 1	Molly	Jacobson	NaN
# 2	Tina	Ali	NaN
# 3	Jake	Milner	NaN
# 4	Amy	Cooze	NaN
```

**[code 3.1 일부 컬럼만 선택, 새로운 컬럼 생성]**

```python
df.loc[:3, ["last_name"]] # loc: index location의 줄인말, id 대신 index 문자를 넣어도됨
# 인덱스 3번까지 lastname만 가져오기
# 	last_name
# 0	Miller
# 1	Jacobson
# 2	Ali
# 3	Milner
df["age"].iloc[1:] # iloc: index position, 숫자(index)로만 접근 가능
# 1    52
# 2    36
# 3    24
# 4    73
# Name: age, dtype: int64
# 출력은 data series type
# 이 인덱스 방법은 series에도 활용 가능함
```

**[code 3.2 dataframe indexing]**

```python
df.age > 40
# 0     True
# 1     True
# 2    False
# 3    False
# 4     True
# Name: age, dtype: bool
df.debt = df.age > 40 # 그 결과값을 새로운 series로 만들어 dataframe에 추가
```

**[code 3.3 데이터 conditioning 가능]**

```python
df.T # Transpose형 출력 (가로 세로 바꾼 표)
# 0	1	2	3	4
# first_name	Jason	Molly	Tina	Jake	Amy
# last_name	Miller	Jacobson	Ali	Milner	Cooze
# age	42	52	36	24	73
# city	San Francisco	Baltimore	Miami	Douglas	Boston
df.to_csv() # csv 형태로 변경
df.drop("debt", axis=1) # 일부 column 전체 삭제된 dataframe을 리턴
del df["debt"] # drop과 같으나 메모리에서 아예 삭제
```

**[code 3.4 출력 변형 및 Dataframe 삭제]**

### selection & drop

```python
# bash 에서 conda install --y xlrd 
import numpy as np

df = pd.read_excel("./data/excel-comp-data.xlsx")
```

**[code 4. xlrd 설치 및 엑셀 읽어오기] **

```python
df[["account", "street", "state"]].head(3) # 일부 colmun 일부 갯수만 출력
# series data type으로 출력
# 	account	street	state
# 0	211829	34456 Sean Highway	Texas
# 1	320563	1311 Alvis Tunnel	NorthCarolina
# 2	648336	62184 Schamberger Underpass Apt. 231	Iowa
df[["account", "street", "state"]][:3] # 위 코드와 비슷하나 index 기준
df[["account", "street", "state"]][[0,1,2]] # 위 코드와 같음
df[["account", "street", "state"]][range(0,3)] # 위 코드와 같음
df[["account", "street", "state"]][df['account'] > 25000] # condition 설정 가능
```

**[code 4-1. selection with column names ]**

```python
df.index = df["account"]
del df["account"]
df['name','street'].head()
# account  name                         street                               
# 211829   Kerluke, Koepp and Hilpert   34456 Sean Highway                   
# 320563   Walter-Trantow               1311 Alvis Tunnel                    
# 648336   Bashirian, Kunde and Price   62184 Schamberger Underpass Apt. 231
# 109996   D'Amore, Gleichner and Bode  155 Fadel Crescent Apt. 144          
# 121213   Bauch-Goldner                7274 Marissa Common                  
```

**[code 4-2. index값 변경**]

```python
df[["name", "street"]][:2] # 기본 방식, 아래와 같은 결과
df.loc[[211829, 320563], ["name", "street"]] # loc 방식 index의 이름을 써야한다.
# account	name	street		
# 211829	Kerluke, Koepp and Hilpert	34456 Sean Highway
# 320563	Walter-Trantow	1311 Alvis Tunnel
df.iloc[:5, :3] # iloc 방식
# account	name	street	city			
# 211829	Kerluke, Koepp and Hilpert	34456 Sean Highway	New Jaycob
# 320563	Walter-Trantow	1311 Alvis Tunnel	Port Khadijah
# 648336	Bashirian, Kunde and Price	62184 Schamberger Underpass Apt. 231	New Lilianland
# 109996	D'Amore, Gleichner and Bode	155 Fadel Crescent Apt. 144	Hyattburgh
# 121213	Bauch-Goldner	7274 Marissa Common	Shanahanchester
```

**[code 4-3. basic, loc, iloc selection]**

```python
df.index = list(range(0, 15))
# df.reset_index(inplace=True) # 또 다른 방법
# df.reset_index(inplace=True) # 원본 테이블 값 또한 바꿔줌
# df.reset_index(inplace=True, drop=True) # 원본 테이블 값 또한 바꿔줌 + 메모리에서 아예 삭제
df.head(3)
# 	name	street	city	state	postal-code	Jan	Feb	Mar
# 0	Kerluke, Koepp and Hilpert	34456 Sean Highway	New Jaycob	Texas	28752	10000	 62000	35000
# 1	Walter-Trantow	1311 Alvis Tunnel	Port Khadijah	NorthCarolina	38365	95000	45000	35000
# 2	Bashirian, Kunde and Price	62184 Schamberger Underpass Apt. 231	New Lilianland	Iowa	76517	91000	120000	35000
```

**[code 4-4. reindex]**

```python
df.drop([0, 1, 2, 3]) # 해당 row 삭제
# df.drop(1, inplace=True) # 1번째 row 삭제 + 원본 변경
# df.drop("city", axis=1, inplace=True) # 일부 column 전체 삭제
```

**[code 4-5. data drop]**

### dataframe operations

```python
s1 = Series(range(1, 6), index=list("abced"))
s2 = Series(range(5, 11), index=list("bcedef"))
s1 + s2 # 아래와 같은 연산
s1.add(s2)
# a     NaN
# b     7.0
# c     9.0
# d    13.0
# e    11.0
# e    13.0
# f     NaN
# dtype: float64

# index 명이 아니라 index에 따라 연산이 수행된다 (b끼리 더해지는게 아니라 같은 n번째끼리)
# 겹치는 index가 없으면 NaN 반환
```

**[code 5. series addition]**

````python
df1 = DataFrame(np.arange(9).reshape(3, 3), columns=list("abc"))
df2 = DataFrame(np.arange(16).reshape(4, 4), columns=list("abcd"))
df1 + df2
# 	a	b	c	d
# 0	0.0	2.0	4.0	NaN
# 1	7.0	9.0	11.0	NaN
# 2	14.0	16.0	18.0	NaN
# 3	NaN	NaN	NaN	NaN

df1.add(df2, fill_value=0) # fill을 사용하여 Nan 대신 넣어줌
# a	b	c	d
# 0	0.0	2.0	4.0	3.0
# 1	7.0	9.0	11.0	7.0
#2	14.0	16.0	18.0	11.0
# 3	12.0	13.0	14.0	15.0

df1.mul(df2, fill_value=1)
````

**[code 5-1. dataframe addition]**

```python
df = DataFrame(np.arange(16).reshape(4, 4), columns=list("abcd"))
# a	b	c	d
# 0	0	1	2	3
# 1	4	5	6	7
# 2	8	9	10	11
# 3	12	13	14	15
s = Series(np.arange(10, 14), index=list("abcd"))
# a    10
# b    11
# c    12
# d    13
# dtype: int32
s2 = Series(np.arange(10, 14))
# 0    10
# 1    11
# 2    12
# 3    13
# dtype: int32
df + s
# a	b	c	d
# 0	10	12	14	16
# 1	14	16	18	20
# 2	18	20	22	24
# 3	22	24	26	28

df + s2 # 적절한 index가 없으므로 NaN이 나옴
# a	b	c	d	0	1	2	3
# 0	NaN	NaN	NaN	NaN	NaN	NaN	NaN	NaN
# 1	NaN	NaN	NaN	NaN	NaN	NaN	NaN	NaN
# 2	NaN	NaN	NaN	NaN	NaN	NaN	NaN	NaN
# 3	NaN	NaN	NaN	NaN	NaN	NaN	NaN	NaN

df.add(s2, axis=0) # 기준값 정해줘야함
# 	a	b	c	d
# 0	10	11	12	13
# 1	15	16	17	18
# 2	20	21	22	23
# 3	25	26	27	28
```

**[code 5-2. operations for dataframe with series]**

### lambda, map, apply
- pandas의 series type의 데이터에도 map 함수 사용가능
- function 대신 dict, sequence형 자료등으로 대체 가능

```python
s1 = Series(np.arrange(10))
s1.map(lambda x: x**2).head(5)
# 0 0
# 1 1
# 2 4
# 3 9
# 4 16
# dtype: int64
```
**[code 6.map for series]**


```python
z = {1: "A", 2: "B", 3: "C"} # 다른 시리즈의 데이터를 넣는 것도 가능
s1.map(z).head(5) # z의 key:value 대로 변경, 없는 인덱스는 NaN
#0    NaN
#1      A
#2      B
#3      C
#4    NaN
#dtype: object
```

**[code 6-1. replace using map]**

```python
!wget https://raw.githubusercontent.com/rstudio/Intro/master/data/wages.csv
df = pd.read_csv("./data/wages.csv")
df.sex.unique() # 해당 column 내에 하나라도 존재하는 값들을 출력해 줌
# array(['male', 'female'], dtype=object)
def change_sex(x):
    return 0 if x == "male" else 1

df["sex_code"] = df.sex.map(change_sex) # 성별 코드를 0과 1로 바꿔주는 똑같은 일을 하는 코드들
df.sex.replace({"male": 0, "female": 1})
df.sex.replace(["male", "female"], [0, 1], inplace=True)
# 0       0
# 1       1
# 2       1
# 3       1
# 4       1
#        ..
# 1374    0
# 1375    1
# 1376    1
# 1377    0
# 1378    0
# Name: sex, Length: 1379, dtype: int64
```

**[code 6-2.replace ]**

- Map 함수의 기능 중 데이터 변환 기능만 담당
- 데이터 변환 시 많이 사용

```python
df = pd.read_csv("wages.csv")
df_info = df[["earn", "height", "age"]]
f = lambda x: np.mean(x)
df_info.apply(f) # colmun 별로 결과값 적용
#df_info.mean() # 같은 역할을 하는 함수, sum, std 등도 존재
#earn      32446.292622
#height       66.592640
#age          45.328499
#dtype: float64
```

**[code 6-3. apply & applymap]**

- map과 달리, series 전체(column)에 해당 함수를 적용
- 입력 값이 series 데이터로 입력 받아 handling 가능

```python
def f(x):
    return Series(
        [x.min(), x.max(), x.mean(), sum(x.isnull())],
        index=["min", "max", "mean", "null"],
    )
df_info.apply(f)
#	earn	height	age
#min	-98.580489	57.34000	22.000000
#max	317949.127955	77.21000	95.000000
#mean	32446.292622	66.59264	45.328499
#null	0.000000	0.00000	0.000000
```

**[code 6-4. apply의 series값 return]**

- scalar 값 이외에 series값의 반환도 가능

```python
f = lambda x: x // 2
df_info.applymap(f).head(5)

# earn	height	age
# 0	39785.0	36.0	24
# 1	48198.0	33.0	31
# 2	24355.0	31.0	16
# 3	40239.0	31.0	47
 #4	41044.0	31.0	21

f = lambda x: x ** 2
df_info["earn"].apply(f)
# 0       6.331592e+09
# 1       9.292379e+09
# 2       2.372729e+09
# 3       6.476724e+09
# 4       6.738661e+09
#             ...     
# 1374    9.104329e+08
# 1375    6.176974e+08
# 1376    1.879825e+08
# 1377    9.106124e+09
# 1378    9.168947e+07
# Name: earn, Length: 1379, dtype: float64
```

**[code 6-5.applymap for dataframe]**

- series 단위가 아닌 element 단위로 함수를 적용함
- series 단위에 apply를 적용시킬 때와 같은 효과

### Built-in funtions

```python
df = pd.read_csv("data/wages.csv")
df.describe()
# 	earn	height	ed	age
# count	1379.000000	1379.000000	1379.000000	1379.000000
# mean	32446.292622	66.592640	13.354605	45.328499
# std	31257.070006	3.818108	2.438741	15.789715
# min	-98.580489	57.340000	3.000000	22.000000
# 25%	10538.790721	63.720000	12.000000	33.000000
# 50%	26877.870178	66.050000	13.000000	42.000000
# 75%	44506.215336	69.315000	15.000000	55.000000
# max	317949.127955	77.210000	18.000000	95.000000
```

**[code 7. describe ]**

- Numeri type 데이터의 요약 정보를 보여줌

```python
df.race.unique()
# array(['white', 'other', 'hispanic', 'black'], dtype=object)
```

**[code 7-1. unique]**

- series data의 유일한 값을 list를 반환함

```python
df.sum(axis=1) # 축을 기준으로 어떻게 합칠지 정할 수 있음 0: 컬럼별 1: 로우별
numueric_cols = ["earn", "height", "ed", "age"]
df[numueric_cols].sum(axis=1) # 많이 사용하는 형태
# 이외에도 sub, mean, min, max, count, median, mad, var
```

**[code 7-2. 연산]**

```python
df.isnull() # NaN 값이 있는 값들만 반환
df.isnull().sum() / len(df)
#earn      0.0
#height    0.0
#sex       0.0
#race      0.0
#ed        0.0
#age       0.0
#dtype: float64
pd.options.display.max_rows = 200 #최대 보여주는 갯수 제한
```

**[code 7-3. isnull]**

```python
df.sort_values(["age", "earn"], ascending=True) # 나이와 소득으로 오름차순으로 정렬
#	earn	height	sex	race	ed	age
#1038	-56.321979	67.81	male	hispanic	10	22
#800	-27.876819	72.29	male	white	12	22
#963	-25.655260	68.90	male	white	12	22
#1105	988.565070	64.71	female	white	12	22
#801	1000.221504	64.09	female	white	12	22
#...	...	...	...	...	...	...
#993	32809.632677	59.61	female	other	16	92
#102	39751.194030	67.14	male	white	12	93
#331	39169.750135	64.79	female	white	12	95
#809	42963.362005	72.94	male	white	12	95
#3	80478.096153	63.22	female	other	16	95
#1379 rows × 6 columns
```

**[code 7-4. sort_values]**

- column 값을 기준으로 데이터를 sorting

```python
df.age.corr(df.earn) # 0.07400349177836055 
df.age[(df.age < 45) & (df.age > 15)].corr(df.earn) # 0.31411788725189044
df.age.cov(df.earn) # 36523.6992104089
df.corrwith(df.earn)
# earn 1.000000
# height 0.291600
# sex -0.337328
# race -0.063977
# ed 0.350374
# age 0.074003
# dtype: float64
```

**[code 7-5. Correlation & Covariance]**

- 상관계수와 공분산을 구하는 함수
- corr, cov, corrwith 등이 있음

```python
df.sex.value_counts(sort=True)
#female 859
#male 520
#Name: sex, dtype: int64
df.sex.value_counts(sort=True)/ len(df)
#female 0.622915
#male 0.377085
#Name: sex, dtype: float64
```

**[code 7-6.value_counts]**

- 특정한 값의 갯수를 출력

### Group-by

![image-20210128094318027](image-20210128094318027.png)

**[img 8. Groupby 개념]**

- SQL groupby와 같이 split-apply-combine순으로 적용.
- 엑셀의 피봇 테이블과 비슷함.

```python
df.groupby("Team")["Points"].sum()
#df.gropuby([묶음의 기준이 되는 컬럼들])[[적용받는 컬럼]].[적용받는 연산]()
```

**[code 8. groupby 사용법]**

- 여러개의 column을 묶을 수도 있다.(Hierarchical index)
- return type은 series이다.

```python
# data from:
ipl_data = {
    "Team": [
        "Riders",
        "Riders",
        "Devils",
        "Devils",
        "Kings",
        "kings",
        "Kings",
        "Kings",
        "Riders",
        "Royals",
        "Royals",
        "Riders",
    ],
    "Rank": [1, 2, 2, 3, 3, 4, 1, 1, 2, 4, 1, 2],
    "Year": [2014, 2015, 2014, 2015, 2014, 2015, 2016, 2017, 2016, 2014, 2015, 2017],
    "Points": [876, 789, 863, 673, 741, 812, 756, 788, 694, 701, 804, 690],
}

df = pd.DataFrame(ipl_data)
df.groupby("Team")["Points"].std()
# Team
# Devils    134.350288
# Kings      24.006943
# Riders     88.567771
# Royals     72.831998
# kings            NaN
# Name: Points, dtype: float64

df.groupby(["Team", "Year"])["Points"].sum() # 여러 컬럼 묶기
# Team	Year
# Devils 2014 863
# 		 2015 673
# kings  2014 741
# 		 2016 756
# 		 2017 788
# Riders 2014 876
# 		 2015 789
# 		 2016 694
```

**[code 8-1. groupby 사용]**

- Hierarchical index 사용시 다중 인덱스가 형성됨.

```python
h_index = df.groupby(["Team", "Year"])["Points"].sum()

h_index["Devils":"Kings"]
# Team    Year
# Devils  2014    863
#         2015    673
# Kings   2014    741
#        2016    756
#         2017    788
# Name: Points, dtype: int64

h_index.unstack().stack().unstack() # unstack(): Group으로 묶여진 데이터를 matrix 형태로 전환해줌
# Year	2014	2015	2016	2017
# Team				
# Devils	863.0	673.0	NaN	NaN
# Kings	741.0	NaN	756.0	788.0
# Riders	876.0	789.0	694.0	690.0
# Royals	701.0	804.0	NaN	NaN
# kings	NaN	812.0	NaN	NaN

h_index.reset_index() # 다시 인덱스와 컬럼 형태의 dataframe으로 바꿔줌
```

**[code 8-2. hierarchical index의 index slicing과 unstack]**

```python
h_index.swaplevel() # index level을 바꿔줌
# Year  Team  
# 2014  Devils    863
# 2015  Devils    673
# 2014  Kings     741
# 2016  Kings     756
# 2017  Kings     788
# 2014  Riders    876
# 2015  Riders    789
# 2016  Riders    694
# 2017  Riders    690
# 2014  Royals    701
# 2015  Royals    804
#       kings     812
# Name: Points, dtype: int64
h_index.swaplevel().sortlevel(1) # 해당 인덱스 레벨 기준으로 정렬을 해줌
# 그냥sort_values는 값을 기준으로 바꿔줌
# Year  Team  
# 2014  Devils    863
# 2015  Devils    673
# 2014  Kings     741
# 2016  Kings     756
# 2017  Kings     788
# 2014  Riders    876
# 2015  Riders    789
# 2016  Riders    694
# 2017  Riders    690
# 2014  Royals    701
# 2015  Royals    804
#       kings     812
# Name: Points, dtype: int64
```
**[code 8-3. 추가적인 함수들]**

```python
grouped = df.groupby("Team")
for name, group in grouped:
    print(name)
    print(group)
#     Devils
#      Team  Rank  Year  Points
# 2  Devils     2  2014     863
# 3  Devils     3  2015     673
# Kings
#     Team  Rank  Year  Points
# 4  Kings     3  2014     741
# 6  Kings     1  2016     756
# 7  Kings     1  2017     788
# Riders
#       Team  Rank  Year  Points
# 0   Riders     1  2014     876
# 1   Riders     2  2015     789
# 8   Riders     2  2016     694
# 11  Riders     2  2017     690
# Royals
#       Team  Rank  Year  Points
# 9   Royals     4  2014     701
# 10  Royals     1  2015     804
# kings
#     Team  Rank  Year  Points
# 5  kings     4  2015     812

grouped.get_group("Devils") # 특정 key값을 가진 그룹의 정보만 추출 가능
# 	Team	Rank	Year	Points
# 2	Devils	2	2014	863
# 3	Devils	3	2015	673
```
**[code 8-4. Grouped]**
- Groupby에 의해 Split된 상태를 추출 가능함.
- Tuple 형태로 그룹의 key값 value값 추출 가능
- dataframe 형태로 return

- 추출된 group 정보에는 세가지 유형의 apply 가능
  - Aggregation: 요약된 통계정보 추출
  - Transformation: 해당 정보를 변환
  - Filtration: 특정 정보를 제거하여 보여주는 필터링 기능

#### Aggregation

```python
grouped = df.groupby("Team")
grouped.agg(max) # 최대값 
# Rank	Year	Points
# Team			
# Devils	3	2015	863
# Kings	3	2017	788
# Riders	2	2017	876
# Royals	4	2015	804
# kings	4	2015	812

grouped.agg(np.mean) # 평균값
# 	Rank	Year	Points
# Team			
# Devils	2.500000	2014.500000	768.000000
# Kings	1.666667	2015.666667	761.666667
# Riders	1.750000	2015.500000	762.250000
# Royals	2.500000	2014.500000	752.500000
# kings	4.000000	2015.000000	812.000000

#grouped['Points'].agg([np.sum, np.mean, np.std]) # 특정 컬럼에 여러개의 function을 Apply 할 수 도 있음
```

**[code 9. agg 예제]**

```python
grouped.describe().T #컬럼별 통계 요약 제공
# 	Team	Devils	Kings	Riders	Royals	kings
# Rank	count	2.000000	3.000000	4.000000	2.000000	1.0
# mean	2.500000	1.666667	1.750000	2.500000	4.0
# std	0.707107	1.154701	0.500000	2.121320	NaN
# min	2.000000	1.000000	1.000000	1.000000	4.0
# 25%	2.250000	1.000000	1.750000	1.750000	4.0
# 50%	2.500000	1.000000	2.000000	2.500000	4.0
# 75%	2.750000	2.000000	2.000000	3.250000	4.0
# max	3.000000	3.000000	2.000000	4.000000	4.0
# Year	count	2.000000	3.000000	4.000000	2.000000	1.0
# mean	2014.500000	2015.666667	2015.500000	2014.500000	2015.0
# std	0.707107	1.527525	1.290994	0.707107	NaN
# min	2014.000000	2014.000000	2014.000000	2014.000000	2015.0
# 25%	2014.250000	2015.000000	2014.750000	2014.250000	2015.0
# 50%	2014.500000	2016.000000	2015.500000	2014.500000	2015.0
# 75%	2014.750000	2016.500000	2016.250000	2014.750000	2015.0
# max	2015.000000	2017.000000	2017.000000	2015.000000	2015.0
# Points	count	2.000000	3.000000	4.000000	2.000000	1.0
# mean	768.000000	761.666667	762.250000	752.500000	812.0
# std	134.350288	24.006943	88.567771	72.831998	NaN
# min	673.000000	741.000000	690.000000	701.000000	812.0
# 25%	720.500000	748.500000	693.000000	726.750000	812.0
# 50%	768.000000	756.000000	741.500000	752.500000	812.0
# 75%	815.500000	772.000000	810.750000	778.250000	812.0
# max	863.000000	788.000000	876.000000	804.000000	812.0
```

**[code 9-1. grouped 상태의 describe와 T]**

#### Transformation

- groupby된 컬럼에 각각 개별데이터의 변환을 지원

```python
grouped = df.groupby("Team")
score = lambda x: (x - x.mean()) / x.std() # normalization 정규화
grouped.transform(score)# 각 개별 데이터의 정규화 실시
# 	Rank	Year	Points
# 0	-1.500000	-1.161895	1.284327
# 1	0.500000	-0.387298	0.302029
# 2	-0.707107	-0.707107	0.707107
# 3	0.707107	0.707107	-0.707107
# 4	1.154701	-1.091089	-0.860862
# 5	NaN	NaN	NaN
# 6	-0.577350	0.218218	-0.236043
# 7	-0.577350	0.872872	1.096905
# 8	0.500000	0.387298	-0.770596
# 9	0.707107	-0.707107	-0.707107
# 10	-0.707107	0.707107	0.707107
# 11	0.500000	1.161895	-0.815759

score = lambda x: (x.max())
grouped.transform(score) # 각 팀에 최대 점수를 가진 데이터들을 각 인덱스에 적용
# 	Rank	Year	Points
# 0	2	2017	876
# 1	2	2017	876
# 2	3	2015	863
# 3	3	2015	863
# 4	3	2017	788
# 5	4	2015	812
# 6	3	2017	788
# 7	3	2017	788
# 8	2	2017	876
# 9	4	2015	804
# 10	4	2015	804
# 11	2	2017	876
```

**[code 10. transfrom 예제]**

- 단 max나 min처럼 Series 데이터에 적용되는 데이터들은 key값을 기준으로 Grouped된 데이터 기준

#### Filtration

- 특정 조건으로 데이터를 검색시 사용

```python
df.groupby("Team").filter(lambda x: len(x) >= 3) # 3개이상의 row가 포함된 팀들의 dataframe들을 출력
# Team	Rank	Year	Points
# 0	Riders	1	2014	876
# 1	Riders	2	2015	789
# 4	Kings	3	2014	741
# 6	Kings	1	2016	756
# 7	Kings	1	2017	788
# 8	Riders	2	2016	694
# 11	Riders	2	2017	690

df.groupby("Team").filter(lambda x: x["Points"].mean() > 700)
# Team	Rank	Year	Points
# 0	Riders	1	2014	876
# 1	Riders	2	2015	789
# 2	Devils	2	2014	863
# 3	Devils	3	2015	673
# 4	Kings	3	2014	741
# 5	kings	4	2015	812
# 6	Kings	1	2016	756
# 7	Kings	1	2017	788
# 8	Riders	2	2016	694
# 9	Royals	4	2014	701
# 10	Royals	1	2015	804
# 11	Riders	2	2017	690
```

**[code 11. filter 예제]**

- 필터의 조건이 true인 row를 출력
- len(x)의 경우 group된 dataframe 갯수

### using GroupBy

```python
!wget --no-check-certificate https://www.shanelynn.ie/wp-content/uploads/2015/06/phone_data.csv
df_phone = pd.read_csv("./data/phone_data.csv")
df_phone.head()
# index	date	duration	item	month	network	network_type
# 0	0	15/10/14 06:58	34.429	data	2014-11	data	data
# 1	1	15/10/14 06:58	13.000	call	2014-11	Vodafone	mobile
# 2	2	15/10/14 14:46	23.000	call	2014-11	Meteor	mobile
# 3	3	15/10/14 14:48	4.000	call	2014-11	Tesco	mobile
# 4	4	15/10/14 17:27	4.000	call	2014-11	Tesco	mobile
```

**[code 11. wget을 이용한 jupyter notebook 데이터 다운로드]**

- wget이 안되면 가상환경에 wget 설치하자. **conda install -c menpo wget**

```python
import dateutil
#dateutil.parser.parse : 문자를 날짜 형식으로 바꿔줌
df_phone["date"] = df_phone["date"].apply(dateutil.parser.parse, dayfirst=True)
df_phone.dtypes
# index                    int64
# date            datetime64[ns]
# duration               float64
# item                    object
# month                   object
# network                 object
# network_type            object
# dtype: object
df_phone.groupby("month")["duration"].sum().count() # 갯수 출력
df_phone.groupby("month")["duration"].sum().plot() # matplotlib 를 이용한 값 보기
df_phone.groupby(["month", "item"])["duration"].count().unstack().plot() # 여러 column에 대해 출력
```

**[code 11-1. dateutil을 이용한 타입 변환과 matplotlib 사용]**

![image-20210128230349935](image-20210128230349935.png)

**[img 11. matplotlib 출력 예시]**

![image-20210128230603616](image-20210128230603616.png)

**[img 11-1. matplotlib 출력 예시2]**

- matplotlib가 설치되어있어야 한다. **conda install matplotlib**

```python
df_phone.groupby(["month", "item"]).agg(
    {
        "duration": [min],  # find the min, max, and sum of the duration column
        "network_type": "count",  # find the number of network type entries
        "date": [min, "first", "nunique"],
    }
)  # get the min, first, and number of unique dates
# 		duration	network_type	date
# min	count	min	first	nunique
# month	item					
# 2014-11	call	1.000	107	2014-10-15 06:58:00	2014-10-15 06:58:00	104
# data	34.429	29	2014-10-15 06:58:00	2014-10-15 06:58:00	29
# sms	1.000	94	2014-10-16 22:18:00	2014-10-16 22:18:00	79
# 2014-12	call	2.000	79	2014-11-14 17:24:00	2014-11-14 17:24:00	76
# data	34.429	30	2014-11-13 06:58:00	2014-11-13 06:58:00	30
# sms	1.000	48	2014-11-14 17:28:00	2014-11-14 17:28:00	41
# 2015-01	call	2.000	88	2014-12-15 20:03:00	2014-12-15 20:03:00	84
# data	34.429	31	2014-12-13 06:58:00	2014-12-13 06:58:00	31
# sms	1.000	86	2014-12-15 19:56:00	2014-12-15 19:56:00	58
# 2015-02	call	1.000	67	2015-01-15 10:36:00	2015-01-15 10:36:00	67
# data	34.429	31	2015-01-13 06:58:00	2015-01-13 06:58:00	31
# sms	1.000	39	2015-01-15 12:23:00	2015-01-15 12:23:00	27
# 2015-03	call	2.000	47	2015-02-12 20:15:00	2015-02-12 20:15:00	47
# data	34.429	29	2015-02-13 06:58:00	2015-02-13 06:58:00	29
# sms	1.000	25	2015-02-19 18:46:00	2015-02-19 18:46:00	17
```

**[code 11-2. agg의 복잡한 실사용 예시]**

```python
grouped.rename(
    columns={"min": "min_duration", "max": "max_duration", "mean": "mean_duration"}
)# colmun 명 변경
grouped.add_prefix("duration_")# prefix 추가
# 	duration_min	duration_max	duration_mean
# month			
# 2014-11	1.0	1940.0	115.823657
# 2014-12	1.0	2120.0	93.260318
# 2015-01	1.0	1859.0	88.894141
# 2015-02	1.0	1863.0	113.301453
# 2015-03	1.0	10528.0	225.251891
```

**[code 11-3. colmun 이름 변경 관련 함수]**

### Pivot Table & Cross Table

- 두 함수는 데이터 재구조화에 쓰이며 groupby로 가능하지만, 이 두 기능을 사용하는게 더욱 쉽다.

#### Pivot Table

- *Column에 labeling 값을 추가하여 Value에 numeric type 값을 aggregation 할 수 있다.*

```python
df_phone = pd.read_csv("./phone_data.csv")
df_phone["date"] = df_phone["date"].apply(dateutil.parser.parse, dayfirst=True)
df_phone.head()
# index	date	duration	item	month	network	network_type
# 0	0	2014-10-15 06:58:00	34.429	data	2014-11	data	data
# 1	1	2014-10-15 06:58:00	13.000	call	2014-11	Vodafone	mobile
# 2	2	2014-10-15 14:46:00	23.000	call	2014-11	Meteor	mobile
# 3	3	2014-10-15 14:48:00	4.000	call	2014-11	Tesco	mobile
# 4	4	2014-10-15 17:27:00	4.000	call	2014-11	Tesco	mobile

df_phone.pivot_table(
    values=["duration"],
    index=[df_phone.month, df_phone.item],# index를 위 두 컬럼으로 바꾼다.
    columns=df_phone.network, # column 값을 network의 요소들로 바꾼다.
    aggfunc="sum", # 위에 설정한 index가 겹치는 값끼리 sum, 더하라, (mean)
    fill_value=0, # none값은 0를 채워라.
)
# duration
# network	Meteor	Tesco	Three	Vodafone	data	landline	special	voicemail	world
# month	item									
# 2014-11	call	1521	4045	12458	4316	0.000	2906	0	301	0
# data	0	0	0	0	998.441	0	0	0	0
# sms	10	3	25	55	0.000	0	1	0	0
# 2014-12	call	2010	1819	6316	1302	0.000	1424	0	690	0
# data	0	0	0	0	1032.870	0	0	0	0
# sms	12	1	13	18	0.000	0	0	0	4
# 2015-01	call	2207	2904	6445	3626	0.000	1603	0	285	0
# data	0	0	0	0	1067.299	0	0	0	0
# sms	10	3	33	40	0.000	0	0	0	0
# 2015-02	call	1188	4087	6279	1864	0.000	730	0	268	0
# data	0	0	0	0	1067.299	0	0	0	0
# sms	1	2	11	23	0.000	0	2	0	0
# 2015-03	call	274	973	4966	3513	0.000	11770	0	231	0
# data	0	0	0	0	998.441	0	0	0	0
# sms	0	4	5	13	0.000	0	0	0	3

df_phone.groupby(["month", "item", "network"])["duration"].sum().unstack()# 같은 결과를 보이는 groupby 함수
```

**[code 12. Pivot table 사용과 예시]**

#### Crosstab

- 특허 두 칼럼에 교차 빈도, 비율, 덧셈 등을 구할 때 사용
- Pivot table의 특수한 형태, pivot_table은 하나의 데이터 프레임을 대상으로 하는것에 비해, crosstab은 여러 데이터프레임의 column(series)를 가져와 쓸 수 있다.
- User-Item Rating Matrix 등을 만들 때 사용가능함

```python
df_movie = pd.read_csv("./movie_rating.csv")
df_movie.head()
# critic	title	rating
# 0	Jack Matthews	Lady in the Water	3.0
# 1	Jack Matthews	Snakes on a Plane	4.0
# 2	Jack Matthews	You Me and Dupree	3.5
# 3	Jack Matthews	Superman Returns	5.0
# 4	Jack Matthews	The Night Listener	3.0

pd.crosstab(
    index=df_movie.critic,
    columns=df_movie.title,
    values=df_movie.rating,
    aggfunc="first",
).fillna(0) # na일 경우 0 
# title	Just My Luck	Lady in the Water	Snakes on a Plane	Superman Returns	The Night Listener	You Me and Dupree
# critic						
# Claudia Puig	3.0	0.0	3.5	4.0	4.5	2.5
# Gene Seymour	1.5	3.0	3.5	5.0	3.0	3.5
# Jack Matthews	0.0	3.0	4.0	5.0	3.0	3.5
# Lisa Rose	3.0	2.5	3.5	3.5	3.0	2.5
# Mick LaSalle	2.0	3.0	4.0	3.0	3.0	2.0
# Toby	0.0	0.0	4.5	4.0	0.0	1.0

df_movie.pivot_table( #위 함수와 같은 결과를 내는 pivot_table 함수
    ["rating"],
    index=df_movie.critic,
    columns=df_movie.title,
    aggfunc="sum",
    fill_value=0,
)
df_movie.groupby(["critic", "title"]).agg({"rating": "first"}) #위 함수와 같은 결과를 내는 groupby 함수
```

**[code 13. Cross Tab 사용과 예시]**

### Merge & Concat

#### merge

- SQL에서 많이 사용하는 Merge와 같은 기능으로, 두개의 표를 하나로 합침

```python
raw_data = {
    "subject_id": ["1", "2", "3", "4", "5", "7", "8", "9", "10", "11"],
    "test_score": [51, 15, 15, 61, 16, 14, 15, 1, 61, 16],
}
df_a = pd.DataFrame(raw_data, columns=["subject_id", "test_score"])
# 	subject_id	test_score
# 0	1	51
# 1	2	15
# 2	3	15
# 3	4	61
# 4	5	16
# 5	7	14
# 6	8	15
# 7	9	1
# 8	10	61
# 9	11	16
raw_data = {
    "subject_id": ["4", "5", "6", "7", "8"],
    "first_name": ["Billy", "Brian", "Bran", "Bryce", "Betty"],
    "last_name": ["Bonder", "Black", "Balwner", "Brice", "Btisan"],
}
df_b = pd.DataFrame(raw_data, columns=["subject_id", "first_name", "last_name"])
# subject_id	first_name	last_name
# 0	4	Billy	Bonder
# 1	5	Brian	Black
# 2	6	Bran	Balwner
# 3	7	Bryce	Brice
# 4	8	Betty	Btisan
pd.merge(df_a, df_b, on="subject_id") # subject_id를 기준으로 표가 join 되었다.
# subject_id	test_score	first_name	last_name
# 0	4	61	Billy	Bonder
# 1	5	16	Brian	Black
# 2	7	14	Bryce	Brice
# 3	8	15	Betty	Btisan
```

**[code 14. merge 예시]**

```python
pd.merge(df_a, df_b, left_on="subject_id", right_on="subject_id") # 두 column명이 다른 경우
pd.merge(df_a, df_b, on="subject_id", how="left") # how에서 join method를 정한다. 그림 14 참조, 기본값은 inner 조인
pd.merge(df_a, df_b, right_index=True, left_index=True) # index 값을 기준으로 붙임, 둘다 같은 이름의 index 값이 있으면 _x, _y 같은 이름이 붙어서 새로 생김.
```

**[code 14-1. merge 다른 예시]**

![image-20210129011743303](image-20210129011743303.png)

**[img 14. join method]**

#### Concat

- 같은 형태의 데이터를 붙이는 연산작업

![image-20210129013127134](image-20210129013127134.png)

**[img 15. 2가지 방법의 Concat]**

```python
df_new = pd.concat([df_a, df_b]) # 리스트 형식으로 붙임
df_new.reset_index()
# df_new.reset_index(drop=True) # drop=True를 하면 아래 처럼 index가 추가로 붙지 않는다.
# 	index	subject_id	first_name	last_name
# 0	0	1	Alex	Anderson
# 1	1	2	Amy	Ackerman
# 2	2	3	Allen	Ali
# 3	3	4	Alice	Aoni
# 4	4	5	Ayoung	Atiches
# 5	0	4	Billy	Bonder
# 6	1	5	Brian	Black
# 7	2	6	Bran	Balwner
# 8	3	7	Bryce	Brice
# 9	4	8	Betty	Btisan

df_a.append(df_b) # 위와 비슷하나 index가 따로 붙지 않았다.
# 	subject_id	first_name	last_name
# 0	1	Alex	Anderson
# 1	2	Amy	Ackerman
# 2	3	Allen	Ali
# 3	4	Alice	Aoni
# 4	5	Ayoung	Atiches
# 0	4	Billy	Bonder
# 1	5	Brian	Black
# 2	6	Bran	Balwner
# 3	7	Bryce	Brice
# 4	8	Betty	Btisan

df_new = pd.concat([df_a, df_b], axis=1) # 옆으로 붙이기
df_new.reset_index()
# index	subject_id	first_name	last_name	subject_id	first_name	last_name
# 0	0	1	Alex	Anderson	4	Billy	Bonder
# 1	1	2	Amy	Ackerman	5	Brian	Black
# 2	2	3	Allen	Ali	6	Bran	Balwner
# 3	3	4	Alice	Aoni	7	Bryce	Brice
# 4	4	5	Ayoung	Atiches	8	Betty	Btisan
```

**[code 15. Concat 예시]**

### DB Persistence

- Data lodaing 시 파일 형식 뿐만 아니라 db connectio 기능을 제공함

```python
import pandas as pd
import sqlite3  # pymysql <- 설치

conn = sqlite3.connect("./data/flights.db")
cur = conn.cursor()
cur.execute("select * from airlines limit 5;")
results = cur.fetchall()
df_airplines = pd.read_sql_query("select * from airlines;", conn)
df_airplines
# index	id	name	alias	iata	icao	callsign	country	active
# 0	0	1	Private flight	\N	-	None	None	None	Y
# 1	1	2	135 Airways	\N	None	GNL	GENERAL	United States	N
# 2	2	3	1Time Airline	\N	1T	RNX	NEXTIME	South Africa	Y
# 3	3	4	2 Sqn No 1 Elementary Flying Training School	\N	None	WYT	None	United Kingdom	N
# 4	4	5	213 Flight Unit	\N	None	TFU	None	Russia	N
# ...	...	...	...	...	...	...	...	...	...
# 6043	6043	19828	Vuela Cuba	Vuela Cuba	6C	6CC	None	Cuba	Y
# 6044	6044	19830	All Australia	All Australia	88	8K8	None	Australia	Y
# 6045	6045	19831	Fly Europa	None	ER	RWW	None	Spain	Y
# 6046	6046	19834	FlyPortugal	None	PO	FPT	FlyPortugal	Portugal	Y
# 6047	6047	19845	FTI Fluggesellschaft	None	None	FTI	None	Germany	N
# 6048 rows × 9 columns
```

**[code 16. DB connection 예제]**

```bash
conda install openpyxl
conda install XlsxWriter
```

**[code 16-1. 먼저 필요 모듈을 깔아주자.]**

```python
writer = pd.ExcelWriter("./data/df_routes.xlsx", engine="xlsxwriter")
df_routes.to_excel(writer, sheet_name="Sheet1")
df_routes.to_pickle("./data/df_routes.pickle")
df_routes_pickle = pd.read_pickle("./data/df_routes.pickle")
df_routes_pickle.head()
```

**[code 16-2. XLS 추출 예제]**

- xls 엔진으로 엑셀 데이터 추출 후 pickle 저장 가능