# app/internal/inference.py
import io
import uuid
import requests
import boto3
from PIL import Image
from botocore.exceptions import BotoCoreError, ClientError
from app import dependencies



def pil_image_to_bytes(img: Image.Image) -> bytes:
    """PIL 이미지 객체를 bytes로 변환"""
    buffered = io.BytesIO()
    img.save(buffered, format="PNG")
    buffered.seek(0)
    return buffered.getvalue()


def upload_image_to_s3(img: Image.Image, bucket_name: str, folder: str = "") -> str:
    """
    이미지를 S3에 업로드하고, 업로드된 파일의 URL을 반환합니다.
    
    :param img: PIL Image 객체
    :param bucket_name: S3 버킷 이름
    :param folder: S3 내 폴더 경로 (옵션)
    :return: 업로드된 이미지의 URL (실패 시 None)
    """
    # 고유 파일 이름 생성 (예: uuid를 사용)
    file_name = f"{folder}{uuid.uuid4().hex}.png"
    image_bytes = pil_image_to_bytes(img)
    
    # boto3 클라이언트 생성
    s3_client = boto3.client(
        "s3",
        region_name=AWS_REGION,
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY
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
        url = f"https://{bucket_name}.s3.{AWS_REGION}.amazonaws.com/{file_name}"
        return url
    except (BotoCoreError, ClientError) as e:
        print(f"S3 업로드 실패: {e}")
        return None


def run_generate_cover(prompt: str) -> Image.Image:
    """
    Stable Diffusion 모델을 이용해 이미지를 생성합니다.
    """
    model = dependencies.get_model_sd()
    result = model(prompt)
    # 모델 리턴 타입에 따라 처리 (diffusers 라이브러리 버전에 따라 다름)
    if isinstance(result, dict) and "images" in result:
        image = result["images"][0]
    else:
        image = result[0]
    return image


def send_result_to_backend(callback_url: str, image_url: str):
    """
    업로드된 이미지의 URL과 함께 추론 결과를 백엔드 서버에 POST 요청으로 전달합니다.
    """
    payload = {
        "image_url": image_url,  # S3 URL 전달
        "status": "success"
    }

    try:
        response = requests.post(callback_url, json=payload, timeout=10)
        response.raise_for_status()
        print(f"콜백 전송 성공: {response.status_code}")
    except Exception as e:
        print(f"콜백 전송 실패: {e}")


def process_generate_cover(prompt: str, callback_url: str):
    """
    전체 생성 과정을 실행:
      1. 모델로 이미지를 생성
      2. 생성된 이미지를 S3에 업로드
      3. S3에 업로드된 이미지 URL을 백엔드에 전달
    """
    try:
        image = run_generate_cover(prompt)
        # S3에 이미지 업로드
        s3_url = upload_image_to_s3(image, S3_BUCKET, S3_FOLDER)
        if s3_url is None:
            raise Exception("S3 업로드 실패")
    except Exception as e:
        print(f"생성 중 에러 발생: {e}")
        s3_url = ""
    # 백엔드(콜백 URL)로 결과 전송
    send_result_to_backend(callback_url, s3_url)
