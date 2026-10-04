from fastapi import APIRouter, HTTPException
from app.models.schemas import EducateRequest, EducateResponse
from app.services.rag_engine import RAGEngine
from app.services.llm_service import LLMService
import logging

router = APIRouter(prefix="/educate", tags=["Educate"])
logger = logging.getLogger(__name__)

rag_engine = RAGEngine()
llm_service = LLMService()

@router.post("/", response_model=EducateResponse)
async def get_education(request: EducateRequest):
    try:
        # Simple stock tip blocker
        stock_keywords = ["buy", "sell", "target", "stop loss", "share price", "stock price", "bse", "nse", "nifty", "banknifty", "call", "put"]
        if any(keyword in request.query.lower() for keyword in stock_keywords):
            return EducateResponse(
                response="We do not provide stock tips or recommendations. Please consult a SEBI-registered investment advisor.",
                sources=["SEBI Guardrails"],
                related_topics=["SEBI RIAs"]
            )

        # Try RAG engine first
        rag_result = rag_engine.query(request.query, request.language)
        if rag_result and rag_result.get("found"):
            return EducateResponse(
                response=rag_result["content"],
                sources=["Kavach Knowledge Base"],
                related_topics=[rag_result.get("category", "Awareness")]
            )

        # Fallback to LLM
        llm_result = await llm_service.generate_education_response(request.query, request.language)
        if llm_result:
            return EducateResponse(
                response=llm_result,
                sources=["Gemini AI"],
                related_topics=[]
            )
            
        raise HTTPException(status_code=404, detail="Could not generate educational content.")

    except Exception as e:
        logger.error(f"Education endpoint failed: {e}")
        raise HTTPException(status_code=500, detail="Failed to process education request")
