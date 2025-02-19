# app/dependencies.py
import torch
from transformers import BlipProcessor, BlipForConditionalGeneration
from diffusers import StableDiffusionPipeline
import tensorflow as tf
from dotenv import load_dotenv
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
    model_sd.unet.load_attn_procs("./models/oil_finetuned")
    model_sd.to("cuda")  # GPU 사용, CPU 사용 시 model.to("cpu")
except Exception as e:
    raise RuntimeError(f"fail model loading: {e}")


--- xdeepfm 모델 로드 ---
try:
    xdeepfm = tf.keras.models.load_model('./models/xdeepfm/xdeepfm.keras')
except Exception as e:
    raise RuntimeError(f"fail model loading: {e}")


def get_model_caption():
    """이미 로딩된 모델을 반환하는 의존성 함수"""
    return processor_caption, model_caption

def get_model_sd():
    """이미 로딩된 모델을 반환하는 의존성 함수"""
    return model_sd

def get_xdeepfm():
    """이미 로딩된 모델을 반환하는 의존성 함수"""
    return xdeepfm