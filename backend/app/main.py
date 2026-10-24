import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from backend.app.routes.health import router as health_router
from backend.app.routes.drugs import router as drugs_router
from backend.app.routes.interactions import router as interactions_router
from backend.app.routes.auth import router as auth_router
from backend.app.routes.profile import router as profile_router
from backend.app.services.interaction_service import interaction_service

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("MediGuard AI: Preloading ML prediction models and clinical knowledge base...")
    interaction_service.predictor.load()
    print("MediGuard AI: Backend initialization complete and ready to serve requests.")
    yield

app = FastAPI(
    title="MediGuard AI Precision Pharmacovigilance Engine",
    description=(
        "Intelligent Drug–Drug Interaction Detection and Severity Prediction System. "
        "Provides dual-path evidence retrieval using the PNAS DeepDDI Gold-Standard Research Corpus "
        "and DeepDDI Neural Classification."
    ),
    version="4.2.0",
    lifespan=lifespan
)

# CORS configuration for frontend integration
origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API endpoints
app.include_router(health_router, prefix="/api")
app.include_router(drugs_router, prefix="/api")
app.include_router(interactions_router, prefix="/api")
app.include_router(auth_router, prefix="/api")
app.include_router(profile_router, prefix="/api")

@app.get("/")
def root():
    return {
        "system": "MediGuard AI Precision Pharmacovigilance Engine",
        "version": "v4.2-clinical",
        "status": "online",
        "documentation": "/docs",
        "endpoints": {
            "health": "/api/health",
            "drug_search": "/api/drugs/search?q={query}",
            "interaction_check": "/api/interactions/check [POST]"
        }
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=port, reload=True)
