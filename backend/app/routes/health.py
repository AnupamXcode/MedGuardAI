from fastapi import APIRouter
from backend.app.schemas.interaction import HealthResponse
from backend.app.services.drug_service import drug_service
from backend.app.services.interaction_service import interaction_service

router = APIRouter(tags=["System Health"])

@router.get("/health", response_model=HealthResponse)
def get_health():
    is_model_loaded = (interaction_service.predictor.model is not None)
    return HealthResponse(
        status="healthy",
        version="v4.2-clinical",
        database_records=192284,
        drugs_catalog_size=len(drug_service.drugs),
        model_loaded=is_model_loaded
    )
