from typing import List, Optional
from pydantic import BaseModel, Field

class DrugItem(BaseModel):
    id: str = Field(..., description="DrugBank identifier (e.g. DB00682)")
    name: str = Field(..., description="Standard generic drug name (e.g. Warfarin)")
    type: str = Field(default="small molecule")
    groups: str = Field(default="approved")
    categories: List[str] = Field(default_factory=list)

class DrugSearchResponse(BaseModel):
    query: str
    total: int
    results: List[DrugItem]

class InteractionCheckRequest(BaseModel):
    medications: List[str] = Field(..., min_length=1, description="List of drug names or DrugBank IDs")
    conditions: Optional[List[str]] = Field(default_factory=list, description="List of patient conditions (e.g. Hypertension, Diabetes)")

class PairInteractionResult(BaseModel):
    drug_a_id: str
    drug_a_name: str
    drug_b_id: str
    drug_b_name: str
    evidence_status: str = Field(
        ...,
        description="'verified_database' (from gold-standard research corpus), 'model_prediction' (DeepDDI neural classifier), or 'insufficient_evidence'"
    )
    interaction_type: Optional[int] = None
    description: str
    source: str
    confidence: Optional[float] = None
    severity: str = Field(
        default="Unverified / Clinical Severity Assessment Unavailable",
        description="Explicit declaration that calibrated severity tiers are not provided by the research dataset."
    )
    alternatives: List[str] = Field(default_factory=list)

class ConditionAlertItem(BaseModel):
    condition: str
    drug_name: str
    warning: str
    food_constituent: Optional[str] = None
    source: str = "Research Dataset SD06 (KEGG Disease & Dietary Interference)"

class RegimenSummary(BaseModel):
    total_medications: int
    total_pairs_evaluated: int
    verified_interactions_count: int
    predicted_interactions_count: int
    insufficient_evidence_count: int
    has_critical_interaction: bool

class InteractionCheckResponse(BaseModel):
    summary: RegimenSummary
    interactions: List[PairInteractionResult]
    condition_alerts: List[ConditionAlertItem]
    disclaimer: str

class HealthResponse(BaseModel):
    status: str
    version: str
    database_records: int
    drugs_catalog_size: int
    model_loaded: bool
