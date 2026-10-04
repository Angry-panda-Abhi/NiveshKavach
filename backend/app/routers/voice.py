from fastapi import APIRouter, HTTPException
import logging

from app.models.schemas import VoiceRequest, VoiceResponse

router = APIRouter(prefix="/voice", tags=["Voice Interactions"])
logger = logging.getLogger(__name__)

@router.post("/process", response_model=VoiceResponse)
async def process_voice(request: VoiceRequest):
    try:
        # Call voice_service for STT, then process query
        return VoiceResponse(
            transcript="Is this investment scheme safe?",
            response_text="Please provide more details about the scheme, such as the company name or the promised returns.",
            response_audio_base64=None
        )
    except Exception as e:
        logger.error(f"Error processing voice request: {e}")
        raise HTTPException(status_code=500, detail="Failed to process voice request")
