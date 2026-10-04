from fastapi import APIRouter
from pydantic import BaseModel
from app.services.fno_calculator import calculate_fno_reality

router = APIRouter(prefix="/tools", tags=["Tools"])

class FnoRequest(BaseModel):
    capital: float
    source: str
    instrument: str
    expiry_days: int
    loan_apr: float = 0

@router.post("/fno")
async def calculate_fno(request: FnoRequest):
    return calculate_fno_reality(
        capital=request.capital,
        source=request.source,
        instrument=request.instrument,
        expiry_days=request.expiry_days,
        loan_apr=request.loan_apr
    )
