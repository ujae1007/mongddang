# app/dependencies.py
import torch
from diffusers import StableDiffusionPipeline
from dotenv import load_dotenv
import os


# load environment variable from .env
load_dotenv()

# --- S3 config --- #
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION")
S3_BUCKET = os.getenv("S3_BUCKET")
# S3_FOLDER = os.getenv("S3_FOLDER", "generated-images/")

if AWS_ACCESS_KEY_ID:
    print("s3 success")

# load model
try:
    model_sd = StableDiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5", torch_dtype=torch.float16)
    model_sd.to("cuda")  # GPU 사용, CPU 사용 시 model.to("cpu")
except Exception as e:
    raise RuntimeError(f"fail model loading: {e}")


def get_model_sd():
    """이미 로딩된 모델을 반환하는 의존성 함수"""
    return model_sd
