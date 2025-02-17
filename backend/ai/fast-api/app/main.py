# app/main.py
from fastapi import FastAPI
from app.routers import generate_cover
from app.routers import recommendation
from apscheduler.schedulers.background import BackgroundScheduler
from app.internal import recommendation as rec_retrain  # retrain_model 포함된 모듈


app = FastAPI(
    title="FastAPI",
    description="FastAPI 모델 서버",
    version="1.0.0"
)

# APScheduler 설정 (예: 매일 자정에 학습)
# scheduler = BackgroundScheduler()
# scheduler.add_job(rec_retrain.train_and_save_model, 'cron', hour=*, minute=0)
# scheduler.start()

# scheduler = BackgroundScheduler()
# scheduler.add_job(rec_retrain.train_and_save_model, 'interval', minutes=1)
# scheduler.start()


# 커버 이미지 생성 라우터를 포함
app.include_router(generate_cover.router, tags=["generate_cover"])

# 앨범 추천 라우터를 포함
app.include_router(recommendation.router, tags=["recommendation"])
