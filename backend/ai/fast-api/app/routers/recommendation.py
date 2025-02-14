# app/routers/inference.py
from fastapi import APIRouter, BackgroundTasks
from pydantic import BaseModel
# from app.internal import recommendation as rec_internal
from app import dependencies


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
    """
    try:
        print(request.user_id, request.like_genre1, request.like_region1)
        return {"recommendation_albums": [5, 8, 10]}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))