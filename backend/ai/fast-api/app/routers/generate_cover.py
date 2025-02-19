# app/routers/inference.py
from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from app.internal import generate_cover as gen_internal
from app import dependencies


router = APIRouter()


class GenerateCoverRequest(BaseModel):
    genres: list         # 생성할 이미지에 사용할 음악 장르
    imageurls: list   # 프롬프트에 포함할 캡션을 추출하기위한 이미지


@router.post("/generate_cover")
async def generate_cover_endpoint(request: GenerateCoverRequest):
    """
    요청을 받은 후 S3에서 기존 이미지를 다운로드하고,
    새로운 이미지를 생성하여 S3에 저장한 후 URL을 반환합니다.
    """
    print("test")
    print(request.genres, request.imageurls)

    try:
        # 1. S3에서 기존 이미지 다운로드
        reference_image = gen_internal.fetch_image_from_s3(request.imageurls, dependencies.S3_BUCKET)
        if reference_image is None:
            raise HTTPException(status_code=404, detail="S3 이미지 다운로드 실패")
        
        # 2. Stable Diffusion 모델로 새 이미지 생성
        generated_image = gen_internal.run_generate_cover(request.genres, reference_image)
        
        # 3. 새 이미지를 S3에 업로드 후 URL 반환
        s3_url = gen_internal.upload_image_to_s3(generated_image, dependencies.S3_BUCKET)
        if not s3_url:
            raise HTTPException(status_code=500, detail="S3 업로드 실패")
        
        print(s3_url)
        # 4. 결과 반환
        return {"image_url": s3_url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
