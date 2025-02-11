# app/routers/inference.py
from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
from app.internal import generate_cover as gen_internal


router = APIRouter()


class GenerateCoverRequest(BaseModel):
    prompt: str         # 생성할 이미지에 사용할 텍스트 프롬프트
    callback_url: str   # 추론 완료 후 결과를 전달할 백엔드(Spring 서버) 콜백 URL


@router.post("/generate_cover")
async def generate_cover_endpoint(request: GenerateCoverRequest, background_tasks: BackgroundTasks):
    """
    백엔드에서 추론 요청 시:
    - prompt와 callback_url이 포함된 JSON 데이터를 받습니다.
    - 백그라운드 작업으로 Stable Diffusion 생성을 실행하고,
      생성 완료 후 callback_url로 결과를 POST 방식으로 전송합니다.
    """
    background_tasks.add_task(gen_internal.process_generate_cover, request.prompt, request.callback_url)
    return {"status": "processing", "message": "이미지 생성 작업이 백그라운드에서 진행됩니다."}
