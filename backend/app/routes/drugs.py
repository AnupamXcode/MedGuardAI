from fastapi import APIRouter, Query, HTTPException
from typing import List, Optional
from backend.app.schemas.interaction import DrugSearchResponse, DrugItem
from backend.app.services.drug_service import drug_service

router = APIRouter(prefix="/drugs", tags=["Drug Nomenclature & Search"])

@router.get("/search", response_model=DrugSearchResponse)
def search_drugs(
    q: Optional[str] = Query(default="", description="Search query by generic name, brand, or DrugBank ID"),
    limit: int = Query(default=15, ge=1, le=50)
):
    results = drug_service.search(query=q or "", limit=limit)
    items = [
        DrugItem(
            id=d["id"],
            name=d["name"],
            type=d.get("type", "small molecule"),
            groups=d.get("groups", "approved"),
            categories=d.get("categories", [])
        )
        for d in results
    ]
    return DrugSearchResponse(
        query=q or "",
        total=len(items),
        results=items
    )

@router.get("/{drug_id}", response_model=DrugItem)
def get_drug_details(drug_id: str):
    d = drug_service.get_by_id_or_name(drug_id)
    if not d:
        raise HTTPException(status_code=404, detail=f"Drug '{drug_id}' not found in clinical database.")
    return DrugItem(
        id=d["id"],
        name=d["name"],
        type=d.get("type", "small molecule"),
        groups=d.get("groups", "approved"),
        categories=d.get("categories", [])
    )
