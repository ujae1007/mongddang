# app/internal/inference.py
import io
import uuid
import requests
import boto3
from PIL import Image
from botocore.exceptions import BotoCoreError, ClientError
from app import dependencies
import random


def pil_image_to_bytes(img: Image.Image) -> bytes:
    """PIL 이미지 객체를 bytes로 변환"""
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    buffered.seek(0)
    return buffered.getvalue()


def fetch_image_from_s3(image_urls: list, bucket_name: str) -> Image.Image:
    """
    S3 링크에서 이미지를 다운로드하여 PIL 이미지로 반환합니다.
    
    :param image_url: S3 이미지의 URL
    :return: PIL Image 객체 (다운로드 실패 시 None)
    """

    image_url = ', '.join(random.sample(image_urls, 1))

    try:
        response = requests.get(image_url)
        response.raise_for_status()
        image = Image.open(io.BytesIO(response.content)).convert("RGB")
        print(f"S3 이미지 다운로드 성공: {image_url}")
        return image
    except requests.RequestException as e:
        print(f"S3 이미지 다운로드 실패: {e}")
        return None


def upload_image_to_s3(img: Image.Image, bucket_name: str) -> str:
    """
    이미지를 S3에 업로드하고, 업로드된 파일의 URL을 반환합니다.
    
    :param img: PIL Image 객체
    :param bucket_name: S3 버킷 이름
    :param folder: S3 내 폴더 경로 (옵션)
    :return: 업로드된 이미지의 URL (실패 시 None)
    """

    # 고유 파일 이름 생성 (예: uuid를 사용)
    file_name = f"{uuid.uuid4().hex}.png"
    image_bytes = pil_image_to_bytes(img)
    
    # boto3 클라이언트 생성
    s3_client = boto3.client(
        "s3",
        region_name=dependencies.AWS_REGION,
        aws_access_key_id=dependencies.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=dependencies.AWS_SECRET_ACCESS_KEY
    )
    
    try:
        s3_client.put_object(
            Bucket=bucket_name,
            Key=file_name,
            Body=image_bytes,
            ContentType="image/png",
            ACL="public-read"  # 파일을 공개 읽기 가능하게 설정 (필요에 따라 조정)
        )
        # S3 객체 URL 구성 (버킷 설정에 따라 URL 형식이 달라질 수 있음)
        url = f"https://{bucket_name}.s3.{dependencies.AWS_REGION}.amazonaws.com/{file_name}"
        return url
    except (BotoCoreError, ClientError) as e:
        print(f"S3 업로드 실패: {e}")
        return None


def run_generate_cover(genres: list, reference_image: Image.Image) -> Image.Image:
    """
    BLIP을 통해 캡션을 추출하고,
    Stable Diffusion 모델을 이용해 이미지를 생성합니다.
    """

    processor_caption, model_caption = dependencies.get_model_caption()

    inputs = processor_caption(reference_image, return_tensors="pt")
    generated_ids = model_caption.generate(**inputs)
    caption = processor_caption.decode(generated_ids[0], skip_special_tokens=True)

    genre = ', '.join(random.sample(genres, 1))

    # Prompt with caption
    prompt = f"abstract oil painting illustration of {caption} inspired by music genre rock"
    detailed = ", full frame, no borders, no background distractions, highly detailed brushstrokes"
    prompt += detailed
    print(prompt)

    # Negative prompt
    neg_prompt = '''FastNegativeV2,(bad-artist:1.0),
    (worst quality, low quality:1.4), (bad_prompt_version2:0.8),
    bad-hands-5, lowres, bad anatomy, bad hands, ((text)), (watermark),
    error, missing fingers, extra digit, fewer digits, cropped, realistic scene, people, person,
    worst quality, low quality, normal quality, ((username)), blurry, vivid color,
    (extra limbs), bad-artist-anime, badhandv4, EasyNegative,
    ng_deepnegative_v1_75t, verybadimagenegative_v1.3, BadDream,
    (three hands:1.1),(three legs:1.1),(more than two hands:1.4),
    (more than two legs:1.2), badhandv4, EasyNegative, ng_deepnegative_v1_75t, verybadimagenegative_v1.3,
    (text, words, logo, watermark),
    nude, nudity, sexual, explicit, violence, gore, disturbing, suggestive, offensive, horror, disturbing content, inappropriate, uncensored, 
    adult, 18+, revealing clothing, unrealistic proportions, overly exaggerated anatomy, dark themes, terrifying, illegal, unethical
    '''

    model_sd = dependencies.get_model_sd()
    result = model_sd(prompt, negative_prompt=neg_prompt, num_inference_steps=20, guidance_scale=7.5).images[0]

    return result



# def send_result_to_backend(callback_url: str, image_url: str):
#     """
#     업로드된 이미지의 URL과 함께 추론 결과를 백엔드 서버에 POST 요청으로 전달합니다.
#     """
#     payload = {
#         "image_url": image_url,  # S3 URL 전달
#         "status": "success"
#     }

#     try:
#         response = requests.post(callback_url, json=payload, timeout=10)
#         response.raise_for_status()
#         print(f"콜백 전송 성공: {response.status_code}")
#     except Exception as e:
#         print(f"콜백 전송 실패: {e}")


# def process_generate_cover(prompt: str, callback_url: str):
#     """
#     전체 생성 과정을 실행:
#       1. 모델로 이미지를 생성
#       2. 생성된 이미지를 S3에 업로드
#       3. S3에 업로드된 이미지 URL을 백엔드에 전달
#     """
#     try:
#         image = run_generate_cover(prompt)
#         # S3에 이미지 업로드
#         s3_url = upload_image_to_s3(image, S3_BUCKET, S3_FOLDER)
#         if s3_url is None:
#             raise Exception("S3 업로드 실패")
#     except Exception as e:
#         print(f"생성 중 에러 발생: {e}")
#         s3_url = ""
#     # 백엔드(콜백 URL)로 결과 전송
#     send_result_to_backend(callback_url, s3_url)
