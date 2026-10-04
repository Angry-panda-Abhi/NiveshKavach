from fastapi import APIRouter, HTTPException
from app.models.schemas import VerifyAdvisorRequest, VerifyAdvisorResponse, VerifyURLRequest, VerifyURLResponse
from app.services.sebi_verifier import SebiVerifier
from app.services.url_checker import URLChecker
import logging

router = APIRouter(prefix="/verify", tags=["Verify"])
logger = logging.getLogger(__name__)

sebi_verifier = SebiVerifier()
url_checker = URLChecker()

@router.post("/advisor", response_model=VerifyAdvisorResponse)
def verify_advisor(request: VerifyAdvisorRequest):
    try:
        result = sebi_verifier.verify_advisor(request.query)
        return VerifyAdvisorResponse(**result)
    except Exception as e:
        logger.error(f"Advisor verification failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to verify advisor")

@router.post("/url", response_model=VerifyURLResponse)
def verify_url(request: VerifyURLRequest):
    try:
        result = url_checker.check_url(request.url)
        return VerifyURLResponse(**result)
    except Exception as e:
        logger.error(f"URL verification failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to verify URL")
