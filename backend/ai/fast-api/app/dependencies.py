# app/dependencies.py
import torch
from transformers import BlipProcessor, BlipForConditionalGeneration
from diffusers import StableDiffusionPipeline
import tensorflow as tf
from dotenv import load_dotenv
import random
import os


# load environment variable from .env
load_dotenv()

# --- S3 config --- #
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION")
S3_BUCKET = os.getenv("S3_BUCKET")

# --- Database config --- #
DATABASE_HOST = os.getenv("DATABASE_HOST")
DATABASE_PORT = os.getenv("DATABASE_PORT")
DATABASE_USER = os.getenv("DATABASE_USER")
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")


# Load BLIP
try:
    processor_caption = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
    model_caption = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")
except Exception as e:
    raise RuntimeError(f"fail model loading: {e}")

# Load Stable Diffusion
try:
    model_sd = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5", torch_dtype=torch.float16)
    model_sd.to("cuda")  # GPU 사용, CPU 사용 시 model.to("cpu")
except Exception as e:
    raise RuntimeError(f"fail model loading: {e}")


# --- xdeepfm 모델 로드 ---
try:
    xdeepfm = tf.keras.models.load_model('./models/xdeepfm/xdeepfm.keras')
except Exception as e:
    raise RuntimeError(f"fail model loading: {e}")


def get_model_caption():
    """이미 로딩된 모델을 반환하는 의존성 함수"""
    return processor_caption, model_caption


# 로컬 LoRA 가중치 폴더 경로
LORA_DIR = "./models/stable_diffusion"

# Hugging Face에서 사용할 LoRA 모델 리스트 (이름을 추가하면 됨)
HUGGINGFACE_LORA_MODELS = [
    "Eunju2834/LoRA_oilcanvas_style"
]

def get_model_with_random_lora():
    """랜덤한 LoRA 가중치를 적용한 Stable Diffusion 모델을 반환하는 함수."""
    # 로컬 LoRA 목록 가져오기
    local_loras = [f for f in os.listdir(LORA_DIR) if os.path.isdir(os.path.join(LORA_DIR, f))]

    # Hugging Face LoRA 모델과 합쳐서 랜덤 선택
    all_loras = local_loras + HUGGINGFACE_LORA_MODELS
    selected_lora = random.choice(all_loras)

    if selected_lora in HUGGINGFACE_LORA_MODELS:
        # Hugging Face LoRA 적용
        print(f"Applying Hugging Face LoRA: {selected_lora}")
        model_sd.unet.load_attn_procs(selected_lora)
    else:
        # 로컬 LoRA 적용
        print(f"Applying Local LoRA: {selected_lora}")
        lora_path = os.path.join(LORA_DIR, selected_lora)
        model_sd.unet.load_attn_procs(lora_path)

    torch.cuda.empty_cache()  # VRAM 최적화

    return model_sd  # LoRA 적용된 모델 반환


def get_xdeepfm():
    """이미 로딩된 모델을 반환하는 의존성 함수"""
    return xdeepfm