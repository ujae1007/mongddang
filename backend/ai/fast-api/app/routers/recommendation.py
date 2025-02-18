# app/routers/inference.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.internal import recommendation as rec_internal


router = APIRouter()


class RecommendationCoverRequest(BaseModel):
    user_id: int        
    like_region1: str
    like_region2: str
    like_region3: str
    like_genre1: str
    like_genre2: str
    like_genre3: str   


@router.post("/recommendation")
async def recommendation_endpoint(request: RecommendationCoverRequest):
    """
    POST 엔드포인트로 전달된 사용자 정보(유저 id, 선호 지역/장르)를 활용해 추천 결과를 반환합니다.
    """
    print("요청")
    try:   
        # 내부 모듈의 추천 함수를 호출합니다.
        rec_posts_list = rec_internal.recommend_posts_for_user_input(
            user_id=request.user_id,
            like_region1=request.like_region1,
            like_region2=request.like_region2,
            like_region3=request.like_region3,
            like_genre1=request.like_genre1,
            like_genre2=request.like_genre2,
            like_genre3=request.like_genre3,
            top_n=3
        )
        print(rec_posts_list)
        return {"recommendation_albums": rec_posts_list}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.post("/test")
async def recommendation_endpoint():
    """
    POST 엔드포인트로 전달된 사용자 정보(유저 id, 선호 지역/장르)를 활용해 추천 결과를 반환합니다.
    """
    try:
        rec_internal.train_and_save_model()
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))