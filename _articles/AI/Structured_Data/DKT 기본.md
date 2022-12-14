---
title: DKT 기본
date: 2022-12-14 13:41:08 +0900
tags: AI 정형데이터 요약
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
# 심층 지식 탐색(Deep Knowledge Tracing, DKT) 기본

> Naver AI boostcamp DKT 강의를 정리한 내용입니다.

## DKT 이해 및 DKT Trend 소개

### DKT Task 이해

![DKT의 원리](image-20210524130500177.png)

DKT (DEEP KNOWLEDGE TRACING) : 딥러닝을 이용하는 지식 상태 추적

![DKT의 TASK](image-20210524125829442.png)

Question과 Response로 이루어진 문제 풀이 정보를 통해 다음 지식상태(주로 문제를 풀 수 있는가?)를 예측하는 방식으로 진행된다.

- 즉, 주어진 문제를 맞췄는 지 틀렸는지 알아보는 Binary Classification 문제이기도 하다.

지식 상태는 계속 변화하므로 지속적으로 추적해야 한다.

보통 문제와 풀이 결과를 Train set으로,

마지막 문제의 풀이 결과가 masking 되있는 문제들과 풀이결과가 Test set으로 주어진다.

문제 풀이 정보(데이터)가 추가될 수록 학생의 지식 상태를 더 정확히 예측 가능.

데이터가 적을 수록 오버피팅 현상이 쉽게 일어난다.

### Metric 이해

#### AUC/ACC(Area under the roc curve/Accuracy)

![output과 ground-truth](image-20210524130858408.png)

보통 예측의 결과는 float 형태로 나오며, 0.5(Threshold)를 기준으로 정답 여부(1,0)를 결정한다.

![AUC와 ACC의 예시](image-20210524131142025.png)

#### Confusion Matrix(혼동행렬)의 이해

![Confusion Matrix의 예시](image-20210524131556645.png)

**Predicted** : 모델의 예측값

**Actual**: 실제 값

**Accuracy**: 전체 중 예측값과 맞는 비율

**Precision(PPV, Positive predictive value)** : 모델이 맞다고 예측한 비율 중 실제 맞은 비율

**Recall,Sensitivity (True positive rate(TPR))**: 실제 1인 비율 중에 모델이 1이라고 한 비율

**Specificity** : 실제 0인 비율 중에 모델이 0이라고 한 비율

**F1 score** : Prescision과 Recall의 절충안, 동시에 고려함.

다만 위의 metric 들은 Threshold에 영향을 받게됨(여기서는 0.5)

#### AUC(Area under the roc curve)

![AUC의 예시](image-20210524132901432.png)

그래프의 면적이 커질수록 성능이 더 좋아진다.

AUC 값의 범위는 0~1이며, 랜덤하게 0과 1을 넣은 경우 0.5이다.

AUC는 척도 불면, 절대 값이 아니라 예측이 얼마나 잘 평가되는지 측정하는 것이며(예측값들의 절대적인 크기와 관계없음),

분류 임계값 불변, 어떤 분류 임계값이 선택되었는지와 상관없이 모델의 예측 품질을 측정할 수 있다. (Threshold 관계 없음)

단, 단점들로,

척도 불변이 항상 이상적이지 않을 수 있다. 예를 들어, 0.9 이상의 값이 중요할 경우 AUC로 측정 불가

분류 임계값 불변이 항상 이상적이지 않다. 예를 들어 허위 양성(FP) 최소화가 더욱 중요한 경우(중요한 메일이 지워지면 안되는 스팸메일 분류 등) 이럴 때는 AUC가 유용한 측정항목이 아니다.

imbalanced data에서는 accuracy 보다는 낫지만, AUC가 비교적 높게 측정되는 경향이 있다.

(단, Test data가 동일할 경우, 상대적인 성능 비교는 가능하다)

![FPR vs TPR로 이루어진 AUC 그래프](image-20210524133343483.png)

FPR은 Specificity를 의미하며, TPR은 Recall을 의미한다.

![AUC 그래프의 예시](image-20210524133619924.png)

결과값에 따라 다음과 같은 방법으로 ROC curve를 그릴 수 있다.

![AUC Curve와 분포의 비교](image-20210524134737191.png)

![AUC Curve와 분포의 비교](image-20210524134808082.png)

위와 같이 Threshold 지점을 중심으로 겹치는 부분 (=예측이 틀린 부분)이 적을수록 ROC Curve의 면적이 넓어지고, 성능이 좋다는 의미이다.

### DKT History 및 Trend

ML, DL, Transformer, GNN 등의 DKT의 트랜드가 발전해 왔다.

![DKT의 트랜드](image-20210524141306210.png)
[1강 참고 자료, History of deep knowledge tracing 참조]

## DKT Data Exploratory Data Analysis

DKT Datset EDA에 대한 예시

### i-Scream 데이터 분석

![i-Scream 데이터의 예시](image-20210524143940935.png)

i-Scream edu에서 제공하는 Dataset

feature로 userID, assessmentItemID, testId, answerCode, Timestamp, KnowledgeTag로 이루어짐.

DKT에서 보통 하나의 행을 Interaction이라고 부름

**userID** 

- 사용자 별 고유번호, 총 7442명의 고유한 사용자 존재

**assessmentItemID**

- 사용자가 푼 문항의 일련 번호, 총 9454개의 고유한 문항이 존재
- 총 10자리로 구성, 첫자리는 항상 알파멧 A, 그다음 6자리는 시험지 번호, 마지막 3자리는 시험지 내 문항의 번호로 구성
- ex) A030071005

**testId**

- 사용자가 푼 문항이 포함된 시험지의 일련 번호, 총 1537개의 고유한 시험지가 존재
- 총 10자리로 구성, 첫 자리는 항상 알파멧 A, 그 다음 9자리 중 앞의 3자리와 끝의 3자리가 시험지 번호, 가운데 3자리는 모두 000
- 앞의 3자리 중 가운데 자리는 1~9값을 가지며 이를 대분류로 사용 가능
- ex) A030000071

**answerCode**

- 사용자가 문항을 맞았는 지 여부를 담은 이진 데이터, 0은 틀림, 1은 맞음
- 전체 Interaction에 대해 65.45%가 정답을 맞춤, 즉 조금 불균형한 데이터셋

**Timestamp**

- 사용자가 Interaction을 시작한 시간 정보, 시간 간격을 통해 문제를 푸는 시간을 가늠할 수 있음.

**KnowledgeTag**

- 문항 당 하나씩 배정되는 태그, 일종의 중분류
- 총 912개의 고유 태그 존재

#### 기술 통계량 분석

**기술 통계량?**

- 일반적으로 데이터를 살펴볼 때, 가장 먼저 살펴보는 것은 기술 통계량입니다.
- 보통 데이터 자체의 정보를 수치로 요약, 단순화하는 것을 목적으로 하며
- 우리가 잘 알고 있는 평균, 중앙값, 최대/최소와 같은 값들을 찾아내고, EDA 과정에서는 이들을 유의미하게 시각화하는 작업을 거침
- 분석은 최종 목표인 정답률과 연관 지어 진행하는 것이 유리

다음은 I-scream dataset의 특성 별 빈도 분석 종합이다.

![특성 별 빈도 분석 종합](image-20210524145959390.png)

다음은 I-scream dataset의 특성 별 정답률 분석 종합이다.

![특성 별 정답률 분석 종합](image-20210524150009838.png)

위와 같은 단순 기술 통계량을 넘어서, 얻어낸 특성과 정답률 사이의 관계를 분석해야 하며, 이때, 여러 지식과 경험이 있으면 좋다.

예를 들어, 문제를 많이 푼 사람이 문제를 더 잘 맞추는가?, 좀더 자주 나오는 태그의 문제의 정답률이 높은가?, 문항을 푸는데 걸린 시간과 정답률의 관계는 어떠한가? 

![푼 문항 수 vs 정답률 그래프](image-20210524151032120.png)![평균 문항 이상 푼 학생과 이하인 학생의 정답률 분포도](image-20210524151037369.png)

문항을 더 많이 푼 학생이 문제를 더 잘맞추는 경향이 있다.

![문항을 풀수록 한 학생의 정답률이 늘어나는 경향이 있는가?](image-20210524151240408.png)

문항을 풀수록 한 학생의 정답률이 늘어나는 경향이 있는가?에 대한 그래프이다. 주로 초반에 잘 푼 학생은 점점 감소하며, 반대의 경우 점점 증가한다.

전반적으로 증가하는 추세이다.

이외에도 같은 시험지나 태그의 문제를 연달아 풀면 정답률이 오르는가? 등을 생각해볼 수 있다.

### Hands on EDA

[Lab. ]

### Sequence 모델링

정형데이터에는 Titanic 처럼 Time과 관계없는 Non-Sequential Data와, Transaction처럼 시간의 순서가 존재하는 Sequential Data가 존재한다.

![Sequence 모델링의 예시](image-20210526000703733.png)

이때, Sequential Data를 Time을 통합하고 특정 feature에 맞춰 집계하거나 그대로 둔채로 추가 feature를 생성하는 방식으로 Feature Engineering이 가능하다.

![testid와 tag별 문제 정답률](image-20210526001425253.png)

예를 들어, 문제, 시험, 또는 사람 별로 집계한 뒤, 정답 확률 feature를 추가할 수 있다.

이러한 feature들은 hyperparameter 처럼 추가, 삭제를 통해 모델의 성능을 확인할 수 있다.

![FE 이후의 validation data split](image-20210526003455839.png)

이때, 단순히 이벤트의 행 단위로 개수를 세지 않고, aggregation 기준을 중심으로 split 해야된다.

![FE에 따른 성능 변화](image-20210527072447707.png)

그 이후, feature와 hyperparameter를 바꿔가면서 성능의 차이를 알아보며 feature를 결정한다.

![LSTM에서의 Input Output shape ](image-20210527080437216.png)

```python
import torch
importh torch.nn as nn

# Size: [batch_size, seq_len, input_size or num_of_features]
input = torch.randn(3, 5, 4)

lstm = nn.LSTM(input_size=4, hidden_size=2, batch_first=True)

output, h = lstm(input)
output.size() # => torch.Size([3, 5, 2]), batch_size, seq_len, hidden_size)
```

LSTM 구조의 Sequece input은 다음과 같이 이루어진다.

batch size(dataset chunk 한 크기), seq_len(sequence의 길이), input_size(4 차원 embedding) or num_of_features의 3차원 벡터가 들어간 뒤,

batch_size, seq_len, hiddensize(hyperparameter)의 output이 나온다.

![feature의 수에 따른 input size 변화](image-20210527084410498.png)

feature의 수에 따라 input size가 변하는 예시를 보자면 위와 같다.

![Transformer 구조에서의 input/output shape](image-20210527080940053.png)

 ```python
 config = BertConfig(
 3, # vocab_size, not used
 hidden_size = 4, num_attention_heads=1
 )
 
 # Size: [batch_size, seq_len, input_size]
 input = torch.randn(3, 5, 4)
 # Size: [batch_size, seq_len]
 mask = torch.randn(3, 5)
 
 transformer = BertModel(config)
 encoded_layers = transformer(inputs_embeds=input, attention_mask=mask)
 sequence_output = encoded_layers[0]
 sequence_output.size() #=> torch.Size([batch_size, seq_len, input_size])
 ```

Transformer의 input과 output 또한 크게 다르지 않지만, masking의 차원이 1차원 적다.

![연속형과 범주형 데이터가 포함된 feature의 input](image-20210527084504864.png)

Transformer + 연속형, 범주형 조합의 input의 경우, embedding layer의 설정에 따라 input size가 다르다.

![Embedding의 예시](image-20210527090132348.png)

범주형은 연속형과 다르게 인코딩을 통해 vector를 뽑아내야 한다.

Embedding은 일종의 Lookup Table을 만드는 것으로, 이 Lookup Table 또한 학습을 통해 결정된다.

이런식으로 Embedding된 값들은 concat되어 hidden_size를 만든다.

이때 concat되는 feature들의 차원이 Linear를 통해 hidden size에 맞게 줄어든다.

![Input Transformation](image-20210526004406142.png)

DKT의 경우, Transformer구조를 활용 시 보통, 사용자 단위로 Sequence를 생성한 뒤, 각각 train input으로 넣어준다.

DKT의 경우 마지막 문제의 정답여부를 맞추는 Task 이므로 보통 Padding을 앞에 추가하여 뒷부분을 맞춘다.

![Featue Engineering이 적용된 모델의 생성 파이프라인](image-20210526004317812.png)

## Sequence Data 문제 정의에 맞는 Transformer Architecture 설계

Transformer 구조는 다양한 Sequence 데이터에서 강점을 보이지만, 많은 양의 데이터와 연산량을 요구하며, 종종 상황에 맞게 변형해서 사용하거나, 아예 다른 모델을 사용해야 하는 경우도 있다.

inductive bias : 특정 목적에 맞게 설계된 모델들(CNN, RNN)의 경우 input의 형태에 따라 bias가 생긴다, 즉, 적절하지 못한 input의 경우 성능이 나쁘다.(CNN에 Sequential input을 넣어준다던가)

Transfomer의 경우, inductive bias가 존재하지 않지만, 그만큼 데이터가 많이 필요하다.

이러한 Transformer를 개조하기 위해 Trasformer architecture의 변형을 알아보자.

### Data Science Bowl

3~5세 들의 기초수학 학습을 위해 개념을 정확히 배웠는 지 맞추는 것이 대회의 목표

과거 데이터를 바탕으로 앞으로 어떻게 풀지 class 4(바로 맞춤, 한번 틀리고 맞춤, 여러번 틀리고맞춤, 못맞춤)개를 통해 예측

![Data Science Bowl 예시](image-20210527092718159.png)

학습 진행 시간, 학습 종류(영상물, 게임, 활동, 평가 등), 게임플레이 세계관과 사용 정보 등이 기록되어 주어진다.

![데이터 형태](image-20210527092745176.png)

이 때, Transformer 구조가 널리 사용되지 않던 시절이였고, 자원과 데이터양이 한정되어있었지만, 한 유저가 Transformer-Encoder 모델인 BERT로 3위를 차지 하였으며, 

- 서로 다른 범주형/연속형 데이터들을 어떻게 임베딩 했는가, 
- BERT를 어떻게 활용했는가 

가 주안점이였다.

![BERT에서의 Embedding](image-20210527093510990.png)

서로 다른 범주형/연속형 Emedding은 다음과 같은 방법을 통하여 임베딩 했으며,

![BERT Encoder 구조](image-20210527093901162.png)

위와 같이 Transformer 구조를 깊게 쌓아 마지막 Transformer 구조의 output 값을 softmax하여 classification 한다.

이때 마지막 layer 부분 마지막 Trnasformer를 제외한 연하게 칠해진 Transfomer 구조의 output은 사용되지 않으며 Loss에 의해 Backpropagation에 업데이트 되지 않는다.

### Riid!

토익 시험에 대비하여 공부한 학생들의 학습 과정을 모아둔 데이터로, 최종적으로 한 학생이 마지막에 푼 문항을 맞출지 틀리지 맞추는 대회이며, i-Scream 데이터와 매우 흡사하다.
다만 데이터셋이 아주 많으며, 강의를 보는 interaction 데이터와 단순히 답을 맞췄는가 아닌가가 아닌, 사용자가 어떤 답을 냈는가와 오답 정리를 했는지도 포함되어 있음.

이때, 너무 데이터가 많아서, 임베딩된 2개의 Sequence를 하나로 이어 붙인 후, Sequence의 길이를 반으로 줄이는 대신, 하나의 임베딩 차원을 2배로 늘려 학습시켜 시간 복잡도를 줄임

![Riid의 시간 복잡도 줄이는 전략](image-20210527100842708.png)

![시간복잡도를 줄이는 전략의 코드](image-20210527100910150.png)

### Predicting Molecular Properties

분자의 여러 정보들을 통해 원자 간 결합 상수를 찾는 대회

분자내 원자 간 결합 정보, 원자 간 가림막 효과, 분자의 에너지 상태, 분자 내 원자의 전하 상태, 결합 상수 세부 정보 등이 데이터로 주어짐

LGBM이나 Grpah NN을 통해 접근한 팀도 많음

![image-20210527102510665](image-20210527102510665.png)

분자 별로 가능한 원자 조합들에 대해 모든 scalar_coupling_constant를 구해야 하므로, 위치가 중요하지 않은 Sequence Data로 볼 수 있으며, 한 분자를 Total Sequence, 원자 쌍의 하나의 Sequence로 본다면, 위 그림 처럼 원자 쌍 순서는 다르지만 결과가 똑같이 나와야함



Sequence 안에서 모든 token이 다른 모든 token을 참조하며, Positional Embedding을 통해 위치정보를 반영하는 방식인 Transformer 구조가 적절하다.

- 즉, 위치 관계가 상관없으므로 Positional Embedding을 안주면 됨 (Permutation Invariant Transformer)

![Embedding 예시](image-20210527103124039.png)



![각각의 원자쌍간의 SC가 나오게 하는 Transformer 구조](image-20210527103428799.png)

이때, 분자 별로 원자쌍이 135개 이므로 Sequence Length는 총 135개 SC(Scaling constant)이며,

두 원자의 정보들과 둘 사이의 관계정보 까지 임베딩 하여, 각 원자의 전하, 위치, 원자 번호, 원자 사이의 거리, 원자 결합 종류가 embedding된 vector를 input으로 사용

![2개의 Transformer 구조](image-20210527103323178.png)

최종적으로 예측해야하는 scaling constant(SC)가 Fc, sd, pso, dso의 합으로 이루어 져있으므로, SC를 예측하는 Transformer와 Fc, sd, pso, dso를 각각 에측하는 두 종류의 결과의 평균을 통하여 예측으로 제출

### Mechanisms of Actions (MoA)

약물 투여시, 어떤 화학 반응이 일어나는지 예측하는 대회로, 투여한 약물의 종류, 양, 시간, 약물 합성방식, 투여 받은 사람의 유전자 발현 종류(772 features), 세포 생존 능력(cell viability) 등의 데이터를 제공함.

Sequence로 묶을 수 있는 데이터가 없고, Feature 수가 너무 많고, 예측 해야할 class의 수가 207개 임에 비해, 데이터는 2만 3천개 밖에 존재하지 않아, Transformer 구조가 잘 작동하지 않았다고 함.

![CNN 구조를 활용한 DKT 구조](image-20210527104229910.png)

이를 위해 위 그림과 같은 CNN 모델을 사용했다.

1. 다수의 Feature를 가진 유전 정보와 세포 생존 정보를 PCA(Principal component analysis)를 통해 50차원, 15차원의 벡터로 만듦
2. 기존의 feature와 concatenate하여 추가적인 feature로 생성
3. 위 결과를 Linear에 통과시켜 더 큰 차원의 1차원 벡터로 변환,
   - Linear feature ordering을 통하여 차원을 늘려주어, 활용가능한 충분한 Pixel의 양을 생성,
   -  생성된 데이터 안에서 feature를 최적의 정렬을 학습하는 효과
   - 각 벡터의 원소가 가지는 의미를 동일하게 만듦
4. 이를 짧은 길이의 여러 채널을 가지는 1D 데이터로 변환
5. 이 데이터를 Conv1D Architecture에 통과시켜 최종결과 생성
   - 이때, 커널 사이즈는 n X embedding size 인경우가 많다. (뒷 부분이 embedding size가 아니면 한 feature의 일부 embedding 만 가져가므로)

위 성능이 단일 모델 기준으로 가장 성능이 좋았다.

## Kaggle Riiid Competition Winner's Solution 탐색

### Feature Engineering

#### 공통적인 FE

Feature Engineering의 접근 방법에는 2가지가 있다.

1. **Bottom-Up**

Data 기반 방식,

1) EDA를 통해 특징을 살피고, 

2) 해당 특징을 Test Data를 통해 검증 뒤, 

3) 이를 통해 새로운 feature를 만들어 내고, CV(Cross Validation) 상승을 확인

- Time, group에 따른 K-fold Validation을 시행해보고, 오르지 않을때 까지(틀리지 않을때 까지) 시도.

4) model 생성한 후, hyperparameter를 찾는 방식

예를 들어, 정규분포와 일부 다른 지점을 찾아, 해당 부분은 feature로 생성

2. **Top-Down**

가설(Hypothesis), domain 지식 기반 컨설팅 방법론(Logical thinking)

가설-구현-검증으로 이루어져 있으며, 

Feature Extraction 시,

1) 데이터에 대한 질문 & 가설

2) 데이터를 시각화하고, 변환하고, 모델링하여 가설에 대한 답을 탐색(구현-성능평가)

3) 찾는 과정에서 배운 것들을 토대로, 다시 가설을 다듬고 또 다른 가설 생성

위 두 방식을 같이 사용하는것이 Best,

![정형 데이터에서의 Feature의 종류](image-20210531223104376.png)

이후, 정형 데이터의 경우, Feature의 Numerical, Categorical 종류를 구분한 후, 각 종류의 특징에 따른 EDA를 해본다. 

예를 들어, 숫자형의 경우, 평균, 범위, 첨도 등을 알아보며,

범주형의 경우, Missing value, value 별 Count, percent 최빈도 값 등을 알아보자.

Target과의 상관관계를  Bar plot, hsit plot 등을 그려 알아볼 수 있다.

#### Riiid의 경우

1) 문항을 푸는 패턴으로..

이전에 푼 문제인가?, 혹시 정답을 한 번호로 찍었는가?를 알 수 있다.

아쉽게도 i-Scream 데이터는 선택지에 대한 정보가 없음.

2) 사용자가 문항을 푸는 데 걸린 평균 시간으로...

오래 걸렸을 경우, 맞춘 학생의 평균 시간과 틀린 학생의 평균 시간을 Feature로 주어 활용할 수 있다.

3) 사용자 정답률 추이로...

최근 정답률로, 앞으로 문항들의 정답 여부를 구할 수 있다.

- 최근 정답률이 낮아지면,  현재 푸는 문항들은 잘 모른다는 의미이므로, 마찬가지로 줄어들 것이다.

4) 이미 푼 문제가 다시 등장하는 경우...

맞췄거나, 틀렸어도 다시 복습했을 확률이 있으므로, 정답률이 올라갈 수 있음.

5) 문항, 시험지, 태그의 평균 정답률로 ...

쉬운 문항, 시험지, 태그의 경우 정답률이 올라갈 수 있다.

또한, 사용자가 푸는 문제에 대한 정보(문항의 정답률, 문항이 가진 태그의 정답률)가 많을 수록 활용 하기 쉽다.

- 문항-태그 정보 에서 content2vec,

- 사용자-문항 정보로 SVD, LDA, item2vec
- 문항을 특징화하는 IRT, ELO

등의 implicit 한 정보를 활용할 수 있다.

**Data Leakage**

Feature를 넣어서 결과가 좋게 나오면 적용해도 되는 것일까?

해당 문항의 평균 정답률 Feature를 생각해보자.

평균 정답률은 validation이나, test dataset을 제외하고, 계산하게 된다.

즉, 전체 데이터셋의 정답률은 실제 정답률과 다를 수 도 있다.

과거 현업에서는 예를 들어, 5월 1일 ~ 8일 데이터는 train dataset, 8일부터 ~10일 데이터는  validation set, 11일 부터 15일 까지는 test dataset으로 주는 등, 시간을 고려하지 않고 주어 올바르지 못한 결과를 주는 경우가 많았다. (Inductive bias 문제?)

하지만 최근에는 time series api를 이용해, inference 시, 한 row가 진행될 때마다, update하므로 문제가 없다. 

**다양한 방법을 통한 문항 공유의 Feature 뽑아내기**

추천 시스템에서 많이 사용되는 Matrix Factorization 방식으로 사용자의 벡터와 문항의 벡터를 만들 수 있음. (최근에는 Factorization Machine을 많이 사용함.)

![Matrix Factorization의 예시](image-20210531232231451.png)

Riid, i-Scream 데이터의 경우, 문제를 푼 사용자와 사용자가 푼 문항을 통해 user-item 행렬을 만들어 진행 가능.

혹은 유사한 방법으로 선형대수학에서 Singular Value Decomposition (SVD)를 활용할 수 있음.

![ELO, IRT의 활용](image-20210531232753395.png)

난이도의 이론인 ELO, IRT(Item Response Theory) 또한 활용 가능하다.

이는 학생과 문항 별로 고유한 특성이 있다는 가정을 하는 이론이다.

- 학생은 잠재능력이 있고, 각 문항은 학생의 잠재 능력을 받아 문항을 맞출 확률을 반환하는 고유 함수를 가지고 있다고 가정.

- 만약 학생의 잠재능력과 문항 별 모수를 안다면, 전체 학생의 모든 문제를 맞출 확률을 모두 알 수 있다는 이론.

![ELO 그래프](image-20210531233505602.png)

이때, 문항이 가진 고유 함수는 다음과 같이 정의됨.
$$
\phi(\theta;\beta)=c+\frac{1-c}{1+e^{-(\theta-\beta)}}\\
\phi : 학생의\ 고유\ 능력,\ \beta:\ 문항\ 별\ 함수의\ 모수,\\
c:\ 무작위로\ 찍을\ 시\ 맞출\ 확률(사지선다\ 시, 0.25)
$$
IRT(Item Response Theory)에서는 여기에 더 많은 가정을 넣어 문항 별 함수를 다양하게 만들 수 있음.

Riiid 에서는 간단하게 $\theta$와 $\beta$를 간단하게 추정하는 방법을 사용할 수도 있다.

1.  전체 학생의 $\theta$와 전체 문항의 $\beta$를 0으로 초기화한다.
2. 아래 수식에 맞춰서 $\theta$와 $\beta$를 업데이터, (correct는 0/1의 binary 정답 여부)

$$
\theta_{n+1}\leftarrow \theta_n + \eta_{\theta_n}*(correct-\phi(\theta_n;\beta_n))\\
\beta_{n+1}\leftarrow \beta_n + \eta_{\beta_n}*(correct-\phi(\theta_n;\beta_n))
$$

3. 이 과정을 전체 데이터에 대해 반복해 최종값을 찾음
4. 구한 이 값들을 통해 test 데이터 내의 학생 별 문항에 대한 정답률을 구함.

**Continuous Embedding**

![continuous Embedding의 가중합 예시](image-20210531234346076.png)

일반적으로 연속형 데이터는 임베딩 데이터와 달리 Embedding 하지 않고 집어넣는다.

범주형 데이터의 경우, 임베딩 행렬의 한 열을 사용하는 형태이며, 연속형은 그럴 수 없으므로,  임베딩 대신, 주어진 연속형 데이터 값에 가중을 더 두고, 그 주변 값들에 더 작은 가중을 주어, 이 임베딩 행렬의 특정 열들을 가중합한 벡터를 임베딩으로 사용함.

예를 들어 1~100까지 임베딩 해 놓은뒤, 50을 임베딩하려 할때, (50의 임베딩값\*0.45) + (49의 임베딩값\*0.18)+ (51의 임베딩값\*0.18)+(48의 임베딩값\*0.09)+(52의 임베딩값\*0.9) ...대략적인 정규분포를 통하여 사용한다.

### Last Query Transformer RNN

일반적으로,

1. LGBM, DNN 같은 Machine Learing의 경우, 
   - 많은 Feature Engineering을 통해, 다량의 Feature를 필요로 하고, 유의미한 것을 찾아내야 한다.

2. Transformer 같은 Deep Learning의 경우,
   - 알아서 Feature를 찾아주므로, FE를 적게 사용하고 아주 많은 양의 데이터를 요구로 하고, sequence의 길이의 제곱에 비례한 시간 복잡도를 가지므로 부담스럽다.
   - Tabular data(정형 데이터)에서는 여전히 FE가 많이 필요, 보통의 경우에도 FE를 통해 성능을 올릴 수 있음.

**Resolving deficits**

![Last Query Transformer RNN의 구조](image-20210531235630477.png)

Riid의 1등 솔루션인 Last Query Transformer RNN은, 위 두 가지 문제를 모두 해결한 방법으로 1등을 차지.

특징으로, 

1. 다수의 Feature를 사용하지 않음, 대신 sequence 길이를 늘림(시간 복잡도가 증가하는 문제를 아래로 해결).

   - 5개의 feature 만 사용, 다른 상위권 모델의 경우 70~80개 사용

2. 마지막 Query만 사용하여 시간 복잡도를 낮춤

   ![행렬 곱이 일어나는 지점](image-20210601010907195.png)

   - 일반적으로 $n \times m$ 행렬과  $m \times l$ 행렬의 곱에 대한 시간 복잡도는 $O(nml)$이다.
   - Transformer에서 Query, Key, Value에 대한 행렬 Q, K, V가 각각 (L, d)로 주어져 있고, 우리가 계산하는 Attention Score의 계산식은 다음과 같다.

   $$
   Att(Q, K, V) = \mathcal{softmax}\frac{QK^T}{\sqrt{d}}*V\\
   Scaled\ dot\ attention : 유사도\ 구할시\ dot\ 연산\ 활용
   $$

   - 시간 복잡도가 $O(L^2d)$로 변한다.
   - 추가적으로 마지막 Query만 사용한다면, Q 행렬의 차원이 (L, d)에서 (1, d)로 줄어든다.
   - 즉, 최종적으로 $O(Ld)$로 줄어든다.

   ![Last Query Transformer RNN](image-20210601011046485.png)

3. 문제 간 특징을 Transformer로 파악하고, 일련의 Sequece 사이 특징들을 LSTM을 활용해 뽑아낸 뒤, 마지막 DNN을 통해 Sequence 별 정답을 예측

- Positional embedding과 look-ahead mask를 제외하여 순서와 관계없이 입력 간의 관계를 파악하게 함
- 그 뒤, Sequential 특성 파악을 위해 LSTM 활용
- 이를 통해, Encoder 수(=Layer 수)와 Sequence length를 증가시켜 성능이 향상 됨.
- BERT 모델에 비해 3배 이상의 sequence length를 가짐(512 vs 1728)

## ML Pipeline

[DKT-8]ML_Pipeline.ipynb 참조

## Model Serving







### 모델 서빙의 종류

**On-device Serving**



**Cloud-based Serving**





### 웹서버를 활용한 모델 서빙

#### HTTP 통신



#### 웹 서버 구축



### MLflow를 활용한 모델 서빙

![MLflow 로고](DKT.assets/image-20210607225750620.png)

#### MLflow



#### 예시 시스템



## End to End Project

### 실제 현업과 Competition의 비교

![Real world vs competition](DKT.assets/image-20210611212230709.png)

![Ai task들](DKT.assets/image-20210611212400505.png)

### 문제정의 3요소

**input(Data_X, DataType)**





**Output(Data_Y, 예측해야 할 값)**





**Metric(평가 지표)**

### Workflow

**Workflow란?**

![image-20210611233524730](DKT.assets/image-20210611233524730.png)

#### 워크 플로우 관리



**Apache Airflow를 활용한 워크 플로우 관리**

![Apache Airflow 로고](DKT.assets/image-20210611233443912.png)

Airflow는 Workflow를 프로그래밍 방식으로 작성, 예약 및 모니터링하는 플랫폼으로, python을이용 한 워크 플로우 관리 툴이다.

- Airbnb -> Apache 로 프로젝트 넘어감

Airflow는 크게

Webserver, Scheduler, Worker, Meta DB로 이루어져 있다.





**토이 프로젝트 소개**



 
