from fastapi import APIRouter, HTTPException
from backend.app.schemas.interaction import InteractionCheckRequest, InteractionCheckResponse
from backend.app.services.interaction_service import interaction_service

router = APIRouter(prefix="/interactions", tags=["Interaction Detection & Prediction"])

@router.post("/check", response_model=InteractionCheckResponse)
def check_interactions(req: InteractionCheckRequest):
    if not req.medications or len(req.medications) < 2:
        raise HTTPException(
            status_code=400,
            detail="At least 2 medications must be provided to evaluate pairwise interactions."
        )

    result = interaction_service.check_regimen(
        medication_inputs=req.medications,
        condition_inputs=req.conditions
    )
    return result
