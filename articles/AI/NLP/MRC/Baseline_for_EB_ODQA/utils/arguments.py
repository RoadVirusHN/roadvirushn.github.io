from dataclasses import asdict, dataclass, field
from typing import Any, Dict, List, Optional

@dataclass
class InferencelArgumentsInputs:
    """
    Arguments Inference and Evaluation step.
    """
    retri: str = field(
        default=None,
        metadata={"help": "retrieval method for retrieval step(default: bm25plus)"}
    )
    k: int = field(
        default=5,
        metadata={"help": "top-k number(default: 5)"}
    )
    top_join : str = field(
        default= 'whole',
        metadata={"help": "Not Implemented! top-k merge method('sep': evaluate each k, 'whole': merge to one article)(default: 'whole')"}
    )
    is_eval: bool = field(
        default= False,
        metadata={"help": "Not Implemented! check True if you want to use validation dataset."}
    )
    
@dataclass
class TrainingArgumentsInputs:
    """
    Arguments for Training Model.
    """
    k_fold: int = field(
        default=1,
        metadata={"help": "Not Implemented! model number of k-fold validation(default: no)"}
    )
    learning_rate: float = field(
        default=5e-5,
        metadata={"help" : "The initial learning rate for Adam. (default: 5e-5)"}
    )
    epochs: int = field(
        default=4,
        metadata={"help": "Total number of training epochs to perform.(default: 2)"}
    )
    per_device_batch_size: int = field(
        default=16,
        metadata={"help" : "Total batch size for training. (default: 16)"}
    )
    weight_decay: float = field(
        default=0.01,
        metadata={"help":"weight decay (default: 0.01)"}
    )
    adam_epsilon: float = field(
        default=1e-6,
        metadata={"help": "Epsilon for Adam optimizer. (default: 1e-6)"}
    )
    warmup_ratio: float = field(
        default=0.1,
        metadata={"help": "ratio of training to perform linear learning rate warmup for. E.g., 0.1 = 10\% of training. (default: 0.1)"}
    )
    fp16: bool = field(
        default=True,
        metadata={"help": " Whether to use 16-bit (mixed) precision training instead of 32-bit training (default: True)"}
    )
    fp16_opt_level: str = field(
        default='O2',
        metadata={"help": "For fp16: Apex AMP optimization level selected in ['O0', 'O1', 'O2', and 'O3']. (default: O2) See details at https://nvidia.github.io/apex/amp.html"}
    )
    save_total_limit: int = field(
        default=1,
        metadata={"help": "number of total save model.(default : 1)"}
    )
    evaluation_step_ratio: int = field(
        default=8,
        metadata={"help": "step term about evaluation and save model / per_device_batch_size(default: 16)"}
    )
    gradient_accumulation_steps: Optional[int] = field(
        default=1,
        metadata={"help" : "Number of updates steps to accumulate before performing a backward/update pass. (default: 1)"}
    )
    max_grad_norm: Optional[float] = field(
        default=1.0,
        metadata={"help" : "Maximum gradient norm (default: 1.0)"}
    )
    seed: Optional[int] = field(
        default=42,
        metadata={"help" : " (default: 1)"}
    )
    local_rank: Optional[int] = field(
        default=-1,
        metadata={"help" : "For distributed training: local_rank (default: -1)"}
    )

@dataclass
class DirectoryArgumentsInputs:
    """
    Arguments for Data and Output target directoies.
    """
    output_dir: str = field(
        default='./checkpoints/',
        metadata={"help": "directory to save checkpoints(default: ./checkpoints/\{model_dir_or_name\}/)"}
    )
    model_dir_or_name: str = field(
        default="monologg/koelectra-base-v3-finetuned-korquad",
        metadata={"help": "directory to get model or name of model in huggingface/model (default: monologg/koelectra-base-v3-finetuned-korquad)"}
    )
    suffix: str = field(
        default='',
        metadata={"help": "suffix for model distinction. (default: None)"}
    )
    data_dir: str = field(
        default='./data/KLUQUAD/',
        metadata={"help": "directory to get training data. (default: ./data/korquad/)"}
    )
    submit_dir: str = field(
        default='./submit/',
        metadata={"help": "directory to predcition output for submission. (default: ./submit/\{model_dir_or_name\})"}
    )
    config_dir: Optional[str] = field(
        default=None, metadata={"help": "directory to model configuration file(json) (default: using AutoConfig in huggingface/transformers)"}
    )
    vocab_dir: Optional[str] = field(
        default=None, metadata={"help": "directory to tokenizer vacab file(json) (default: using AutoTokenizer in huggingface/transformers)"}
    )


@dataclass
class TokenizerArgumentsInputs:
    """
    Arguments for Tokenizer Settings
    """
    max_seq_length: int = field(
        default=512,
        metadata={"help": "The maximum total input sequence length after tokenization. (default: 512)"}
    )
    doc_stride: int = field(
        default=128,
        metadata={"help": "When splitting up a long document into chunks, how much stride to take between chunks. (default: 128)"},
    )    
    pad_to_max_length: bool = field(
        default=False,
        metadata={
            "help": "Whether to pad all samples to `max_seq_length`. If False, will pad the samples dynamically when batching to the maximum length in the batch (which can be faster on GPU but will be slower on TPU)."
        }
    )
    max_query_length: int = field(
        default=64,
        metadata={"help": "The maximum number of tokens for the question. Questions longer than this will be truncated to this length. (default: 64)"}
    )
    max_answer_length: int = field(
        default=30,
        metadata={
            "help": "The maximum length of an answer that can be generated. This is needed because the start and end predictions are not conditioned on one another. (default : 30)"
        }
    )

