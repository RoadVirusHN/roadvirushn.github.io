import faiss
from sklearn.feature_extraction.text import TfidfVectorizer

from tqdm.auto import tqdm
import pandas as pd
import pickle
import json
import os
import numpy as np

from datasets import (
    Dataset,
    load_from_disk,
    concatenate_datasets,
)
from konlpy.tag import Mecab

import time
from contextlib import contextmanager

import os, sys
from pathlib import Path
from glob import glob

from rank_bm25 import BM25Plus, BM25L

BASE_PATH = Path('.').resolve().parent
sys.path.append(BASE_PATH.as_posix())

@contextmanager
def timer(name):
    t0 = time.time()
    yield
    print(f'[{name}] done in {time.time() - t0:.3f} s')

class SparseRetrieval:
    def __init__(self, tokenize_fn, data_path="./data/", context_path="wikipedia_documents.json"):
        self.data_path = data_path
        with open(os.path.join(data_path, context_path), "r") as f:
            wiki = json.load(f)

        self.contexts = list(dict.fromkeys([v['text'] for v in wiki.values()])) # set 은 매번 순서가 바뀌므로
        print(f"Lengths of unique contexts : {len(self.contexts)}")
        self.ids = list(range(len(self.contexts)))

        # Transform by vectorizer
        self.tfidfv = TfidfVectorizer(
            tokenizer=tokenize_fn,
            ngram_range=(1, 2),
            max_features=50000,
        )

        # should run get_sparse_embedding() or build_faiss() first.
        self.p_embedding = None
        self.indexer = None

    def get_sparse_embedding(self):
        # Pickle save.
        pickle_name = f"sparse_embedding.bin"
        tfidfv_name = f"tfidv.bin"
        emd_path = os.path.join(self.data_path, pickle_name)
        tfidfv_path = os.path.join(self.data_path, tfidfv_name)
        if os.path.isfile(emd_path) and os.path.isfile(tfidfv_path):
            with open(emd_path, "rb") as file:
                self.p_embedding = pickle.load(file)
            with open(tfidfv_path, "rb") as file:
                self.tfidfv = pickle.load(file)
            print("Embedding pickle load.")
        else:
            print("Build passage embedding")
            self.p_embedding = self.tfidfv.fit_transform(self.contexts)
            print(self.p_embedding.shape)
            with open(emd_path, "wb") as file:
                pickle.dump(self.p_embedding, file)
            with open(tfidfv_path, "wb") as file:
                pickle.dump(self.tfidfv, file)
            print("Embedding pickle saved.")

    def build_faiss(self):
        # FAISS build
        num_clusters = 16
        niter = 5

        # 1. Clustering
        p_emb = self.p_embedding.toarray().astype(np.float32)
        emb_dim = p_emb.shape[-1]
        index_flat = faiss.IndexFlatL2(emb_dim)

        clus = faiss.Clustering(emb_dim, num_clusters)
        clus.verbose = True
        clus.niter = niter
        clus.train(p_emb, index_flat)

        centroids = faiss.vector_float_to_array(clus.centroids)
        centroids = centroids.reshape(num_clusters, emb_dim)

        quantizer = faiss.IndexFlatL2(emb_dim)
        quantizer.add(centroids)

        # 2. SQ8 + IVF indexer (IndexIVFScalarQuantizer)
        self.indexer = faiss.IndexIVFScalarQuantizer(quantizer, quantizer.d, quantizer.ntotal, faiss.METRIC_L2)
        self.indexer.train(p_emb)
        self.indexer.add(p_emb)

    def retrieve(self, query_or_dataset, topk=1):
        assert self.p_embedding is not None, "You must build faiss by self.get_sparse_embedding() before you run self.retrieve()."
        if isinstance(query_or_dataset, str):
            doc_scores, doc_indices = self.get_relevant_doc(query_or_dataset, k=topk)
            print("[Search query]\n", query_or_dataset, "\n")

            for i in range(topk):
                print("Top-%d passage with score %.4f" % (i + 1, doc_scores[i]))
                print(self.contexts[doc_indices[i]])
            return doc_scores, [self.contexts[doc_indices[i]] for i in range(topk)]

        elif isinstance(query_or_dataset, Dataset):
            # make retrieved result as dataframe
            total = []
            with timer("query exhaustive search"):
                doc_scores, doc_indices = self.get_relevant_doc_bulk(query_or_dataset['question'], k=1)
            for idx, example in enumerate(tqdm(query_or_dataset, desc="Sparse retrieval: ")):
                # relev_doc_ids = [el for i, el in enumerate(self.ids) if i in doc_indices[idx]]
                tmp = {
                    "question": example["question"],
                    "id": example['id'],
                    "context_id": doc_indices[idx][0],  # retrieved id
                    "context": self.contexts[doc_indices[idx][0]]  # retrieved doument
                }
                if 'context' in example.keys() and 'answers' in example.keys():
                    tmp["original_context"] = example['context']  # original document
                    tmp["answers"] = example['answers']           # original answer
                total.append(tmp)

            cqas = pd.DataFrame(total)
            return cqas

    def get_relevant_doc(self, query, k=1):
        """
        참고: vocab 에 없는 이상한 단어로 query 하는 경우 assertion 발생 (예) 뙣뙇?
        """
        with timer("transform"):
            query_vec = self.tfidfv.transform([query])
        assert (
                np.sum(query_vec) != 0
        ), "오류가 발생했습니다. 이 오류는 보통 query에 vectorizer의 vocab에 없는 단어만 존재하는 경우 발생합니다."

        with timer("query ex search"):
            result = query_vec * self.p_embedding.T
        if not isinstance(result, np.ndarray):
            result = result.toarray()
        sorted_result = np.argsort(result.squeeze())[::-1]
        return result.squeeze()[sorted_result].tolist()[:k], sorted_result.tolist()[:k]

    def get_relevant_doc_bulk(self, queries, k=1):
        query_vec = self.tfidfv.transform(queries)
        assert (
                np.sum(query_vec) != 0
        ), "오류가 발생했습니다. 이 오류는 보통 query에 vectorizer의 vocab에 없는 단어만 존재하는 경우 발생합니다."

        result = query_vec * self.p_embedding.T
        if not isinstance(result, np.ndarray):
            result = result.toarray()
        doc_scores = []
        doc_indices = []
        for i in range(result.shape[0]):
            sorted_result = np.argsort(result[i, :])[::-1]
            doc_scores.append(result[i, :][sorted_result].tolist()[:k])
            doc_indices.append(sorted_result.tolist()[:k])
        return doc_scores, doc_indices

    def retrieve_faiss(self, query_or_dataset, topk=1):
        assert self.indexer is not None, "You must build faiss by self.build_faiss() before you run self.retrieve_faiss()."

        if isinstance(query_or_dataset, str):
            doc_scores, doc_indices = self.get_relevant_doc_faiss(query_or_dataset, k=topk)
            print("[Search query]\n", query_or_dataset, "\n")

            for i in range(topk):
                print("Top-%d passage with score %.4f" % (i + 1, doc_scores[i]))
                print(self.contexts[doc_indices[i]])
            return doc_scores, [self.contexts[doc_indices[i]] for i in range(topk)]

        elif isinstance(query_or_dataset, Dataset):
            queries = query_or_dataset['question']
            # make retrieved result as dataframe
            total = []
            with timer("query faiss search"):
                doc_scores, doc_indices = self.get_relevant_doc_bulk_faiss(queries, k=topk)
            for idx, example in enumerate(tqdm(query_or_dataset, desc="Sparse retrieval: ")):
                # relev_doc_ids = [el for i, el in enumerate(self.ids) if i in doc_indices[idx]]

                tmp = {
                    "question": example["question"],
                    "id": example['id'],  # original id
                    "context_id": doc_indices[idx][0],  # retrieved id
                    "context": self.contexts[doc_indices[idx][0]]  # retrieved doument
                }
                if 'context' in example.keys() and 'answers' in example.keys():
                    tmp["original_context"]: example['context']  # original document
                    tmp["answers"]: example['answers']           # original answer
                total.append(tmp)

            cqas = pd.DataFrame(total)
            return cqas

    def get_relevant_doc_faiss(self, query, k=1):
        """
        참고: vocab 에 없는 이상한 단어로 query 하는 경우 assertion 발생 (예) 뙣뙇?
        """
        query_vec = self.tfidfv.transform([query])
        assert (
                np.sum(query_vec) != 0
        ), "오류가 발생했습니다. 이 오류는 보통 query에 vectorizer의 vocab에 없는 단어만 존재하는 경우 발생합니다."

        q_emb = query_vec.toarray().astype(np.float32)
        with timer("query faiss search"):
            D, I = self.indexer.search(q_emb, k)
        return D.tolist()[0], I.tolist()[0]


    def get_relevant_doc_bulk_faiss(self, queries, k=1):
        query_vecs = self.tfidfv.transform(queries)
        assert (
                np.sum(query_vecs) != 0
        ), "오류가 발생했습니다. 이 오류는 보통 query에 vectorizer의 vocab에 없는 단어만 존재하는 경우 발생합니다."
        q_embs = query_vecs.toarray().astype(np.float32)
        D, I = self.indexer.search(q_embs, k)
        return D.tolist(), I.tolist()
            
class SparseRetrieval_BM25PLUS:
    def __init__(self, tokenize_fn, data_path="./data/", context_path="wikipedia_documents.json"):
        self.data_path = data_path
        self.tokenize_fn = tokenize_fn
        with open(os.path.join(data_path, context_path), "r") as f:
            wiki = json.load(f)
        
        self.contexts = list(dict.fromkeys([v['text'] for v in wiki.values()])) # set 은 매번 순서가 바뀌므로
        tk_wiki_name = f"tokenized_wiki_pororo.bin"
        tk_wiki_path = os.path.join(self.data_path, tk_wiki_name)
        if os.path.isfile(tk_wiki_path):
            with open(tk_wiki_path, "rb") as file:
                self.tokenized_contexts = pickle.load(file)
            print("tk_wiki pickle load.")
        else:
            print("Build tk_wiki")
            self.tokenized_contexts = [self.tokenize_fn(v) for v in self.contexts]
            with open(tk_wiki_path, "wb") as file:
                pickle.dump(self.tokenized_contexts, file)
            print("tk_wiki pickle saved.")


        print(f"Lengths of unique contexts : {len(self.tokenized_contexts)}")
        self.bm25 = None

    def get_sparse_embedding(self):
        # Pickle save.
        pickle_name = f"bm25_pororo.bin"
        emd_path = os.path.join(self.data_path, pickle_name)
        if os.path.isfile(emd_path):
            with open(emd_path, "rb") as file:
                self.bm25 = pickle.load(file)
            print("Embedding pickle load.")
        else:
            print("Build passage embedding")
            self.bm25 = BM25Plus(self.tokenized_contexts)
            with open(emd_path, "wb") as file:
                pickle.dump(self.bm25, file)
            print("Embedding pickle saved.")

    def retrieve_for_eval(self, query_or_dataset, topk=1):
        assert self.bm25 is not None, "You must build faiss by self.get_sparse_embedding() before you run self.retrieve()."
        if isinstance(query_or_dataset, str):
            doc_scores, doc_indices = self.get_relevant_doc(query_or_dataset, k=topk)
            print("[Search query]\n", query_or_dataset, "\n")

            for i in range(topk):
                print("Top-%d passage with score %.4f" % (i + 1, doc_scores[i]))
                print(self.contexts[doc_indices[i]])
            return doc_scores, [self.contexts[doc_indices[i]] for i in range(topk)]

        elif isinstance(query_or_dataset, Dataset):
            # make retrieved result as dataframe
            total = []
            with timer("query exhaustive search"):
                doc_scores, doc_indices = self.get_relevant_doc_bulk(query_or_dataset['question'], topk)
            for idx, example in enumerate(tqdm(query_or_dataset, desc="Sparse retrieval: ")):
                # relev_doc_ids = [el for i, el in enumerate(self.ids) if i in doc_indices[idx]]
                tmp = {
                    "question": example["question"],
                    "id": example['id'],
                    # "context_ids":  doc_indices[idx][0],  # retrieved id
                    # "contexts": self.contexts[doc_indices[idx][0]]  # retrieved doument
                }
                if 'context' in example.keys() and 'answers' in example.keys():
                    tmp["original_context"] = example['context']  # original document
                    tmp["answers"] = example['answers']           # original answer
                    tmp["correct"] = self.contexts.index(tmp["original_context"]) in doc_indices[idx]
                total.append(tmp)
            # return total
            cqas = pd.DataFrame(total)
            return cqas

    def retrieve(self, query_or_dataset, topk=1):
        assert self.bm25 is not None, "You must build faiss by self.get_sparse_embedding() before you run self.retrieve()."
        if isinstance(query_or_dataset, str):
            doc_scores, doc_indices = self.get_relevant_doc(query_or_dataset, k=topk)
            print("[Search query]\n", query_or_dataset, "\n")

            for i in range(topk):
                print("Top-%d passage with score %.4f" % (i + 1, doc_scores[i]))
                print(self.contexts[doc_indices[i]])
            return doc_scores, [self.contexts[doc_indices[i]] for i in range(topk)]

        elif isinstance(query_or_dataset, Dataset):
            # make retrieved result as dataframe
            total = []
            with timer("query exhaustive search"):
                doc_scores, doc_indices = self.get_relevant_doc_bulk(query_or_dataset['question'], topk)
            for idx, example in enumerate(tqdm(query_or_dataset, desc=f"Sparse retrieval: ")):
                # relev_doc_ids = [el for i, el in enumerate(self.ids) if i in doc_indices[idx]]
                tmp = {
                    "question": example["question"],
                    "id": example['id'],
                    # "context_ids": doc_indices[idx],  # retrieved id
                    "contexts": '\n'.join([self.contexts[i] for i in doc_indices[idx]]),  # retrieved doument
                    # "context": self.contexts[doc_indices[idx]] ,  # retrieved doument
                    # "score": doc_scores[idx]
                }     
                total.append(tmp)
            # return total
            cqas = pd.DataFrame(total)
            return cqas

    def get_relevant_doc(self, query, k=1):
        result = self.bm25.get_scores(self.tokenize_fn(query))
        temp = sorted(result)
        temp.reverse()
        doc_scores = temp[:k]
        doc_indices = []
        for score in doc_scores:
            doc_indices.append(np.where(result == score)[0][0])
        return doc_scores, doc_indices


    def get_relevant_doc_bulk(self, queries, k=1):
        doc_scores = []
        doc_indices = []
        for query in tqdm(queries, desc="get score from queries and docs : "):
            single_doc_scores, single_doc_indices = self.get_relevant_doc(query, k)
            doc_scores.append(single_doc_scores)
            doc_indices.append(single_doc_indices)
        return doc_scores, doc_indices



if __name__ == "__main__":
    # Test sparse
    
    org_dataset = load_from_disk("./data/dummy_dataset")
    # org_dataset = load_from_disk("./data/train_dataset")
    full_ds = concatenate_datasets(
        [
            org_dataset["train"].flatten_indices(),
            org_dataset["validation"].flatten_indices(),
        ]
    ) # train dev 를 합친 4192 개 질문에 대해 모두 테스트
    print("*"*40, "query dataset", "*"*40)
    print(full_ds)

    ### Mecab 이 가장 높은 성능을 보였기에 mecab 으로 선택 했습니다 ###
    mecab = Mecab()
    # def tokenize(text):
    #     # return text.split(" ")
    #     return mecab.morphs(text)
    from utils_qa import tokenize

    wiki_path = "wikipedia_documents.json"
    test_path = "test.json"
    retriever = SparseRetrieval_BM25PLUS(
        # tokenize_fn=tokenizer.tokenize,
        tokenize_fn=tokenize,
        data_path="./data",
        context_path=wiki_path
        # context_path=test_path
        )

    retriever.get_sparse_embedding()
    # test bulk
    with timer("bulk query by exhaustive search"):
        df = retriever.retrieve_for_eval(full_ds, 3)
        print("correct retrieval result by exhaustive search", df['correct'].sum() / len(df))