from fastapi import APIRouter, Request, Response, HTTPException
import logging
from app.services.scam_detector import ScamDetector
from app.services.llm_service import LLMService

router = APIRouter(prefix="/webhook", tags=["WhatsApp"])
logger = logging.getLogger(__name__)

scam_detector = ScamDetector()
llm_service = LLMService()

import re

def detect_language(text: str) -> str:
    # Check for Devanagari script (Hindi)
    if re.search(r'[\u0900-\u097F]', text):
        return "hi"
    
    # Check for common Hinglish words
    hinglish_words = {'hai', 'kya', 'paisa', 'chahiye', 'karo', 'mujhe', 'nahi', 'aur', 'ko', 'se', 'mein', 'yeh'}
    words = set(re.findall(r'\b\w+\b', text.lower()))
    if len(words.intersection(hinglish_words)) >= 1:
        return "hi"
        
    return "en"

@router.post("/whatsapp")
async def whatsapp_webhook(request: Request):
    try:
        form_data = await request.form()
        incoming_msg = form_data.get('Body', '').strip()
        from_number = form_data.get('From', '')
        
        logger.info(f"Received WhatsApp msg: {incoming_msg}")
        
        # Auto-detect language
        lang = detect_language(incoming_msg)
        
        # Analyze the message
        analysis = await scam_detector.analyze(incoming_msg, lang)
        risk = analysis.get("risk_level", "UNKNOWN").upper()
        
        # Format a quick WhatsApp response dynamically based on language
        if lang == "hi":
            reply = f"🛡️ *निवेश कवच (NiveshKavach)*\n\n*Risk Level:* {risk}\n"
            tip_label = "सुझाव (Tip)"
        else:
            reply = f"🛡️ *NiveshKavach*\n\n*Risk Level:* {risk}\n"
            tip_label = "Tip"
            
        for flag in analysis.get("flags", [])[:2]:
            # Extract description if the LLM returned a raw dictionary instead of a string
            if isinstance(flag, dict):
                flag_text = flag.get("description", flag.get("type", str(flag)))
            else:
                flag_text = str(flag)
            reply += f"🚨 {flag_text}\n"
            
        reply += f"\n💡 *{tip_label}:* {analysis.get('educational_tip', '')}"
        
        response_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Message>{reply}</Message>
</Response>"""
        
        return Response(content=response_xml, media_type="application/xml")
    except Exception as e:
        logger.error(f"Error handling WhatsApp webhook: {e}")
        raise HTTPException(status_code=500, detail="Failed to process message")

@router.get("/whatsapp")
async def verify_whatsapp_webhook():
    return {"status": "Webhook endpoint is active"}
