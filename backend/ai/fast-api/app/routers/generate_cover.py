# app/routers/inference.py
from fastapi import APIRouter, BackgroundTasks, HTTPException
from pydantic import BaseModel
from app.internal import generate_cover as gen_internal
from app import dependencies


router = APIRouter()


class GenerateCoverRequest(BaseModel):
    genres: list         # 생성할 이미지에 사용할 음악 장르
    imageurls: list   # 프롬프트에 포함할 캡션을 추출하기위한 이미지


@router.post("/generate_cover/")
async def generate_cover_endpoint(request: GenerateCoverRequest):
    """
    요청을 받은 후 S3에서 기존 이미지를 다운로드하고,
    새로운 이미지를 생성하여 S3에 저장한 후 URL을 반환합니다.
    """
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
        
        # 4. 결과 반환
        return {"imageUrl": s3_url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



# @router.post("/generate_cover")
# async def generate_cover_endpoint(request: GenerateCoverRequest, background_tasks: BackgroundTasks):
#     """
#     백엔드에서 추론 요청 시:
#     - prompt와 callback_url이 포함된 JSON 데이터를 받습니다.
#     - 백그라운드 작업으로 Stable Diffusion 생성을 실행하고,
#       생성 완료 후 callback_url로 결과를 POST 방식으로 전송합니다.
#     """
#     background_tasks.add_task(gen_internal.process_generate_cover, request.prompt, request.callback_url)
#     return {"status": "processing", "message": "이미지 생성 작업이 백그라운드에서 진행됩니다."}