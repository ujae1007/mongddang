# app/main.py
from fastapi import FastAPI
from app.routers import generate_cover
from app.routers import recommendation


app = FastAPI(
    title="FastAPI",
    description="FastAPI 모델 서버",
    version="1.0.0"
)


# 커버 이미지 생성 라우터를 포함
app.include_router(generate_cover.router, tags=["generate_cover"])

# 앨범 추천 라우터를 포함
app.include_router(recommendation.router, tags=["recommendation"])
