import logging
import json
from typing import Dict, Any
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.models.schemas import AnalyzeRequest, AnalyzeResponse
from app.models.database import ScamAnalysis, get_db, SessionLocal
from app.services.scam_detector import ScamDetector

router = APIRouter(prefix="/analyze", tags=["Analyze"])
logger = logging.getLogger(__name__)

# Reusable service instance
scam_detector = ScamDetector()

import sqlite3
import datetime

def save_analysis_to_db(text: str, image_url: str, risk_score: int, flags: list):
    """Save to DB synchronously using pure sqlite3 to bypass SQLAlchemy async/greenlet threading issues."""
    try:
        conn = sqlite3.connect("./niveshkavach.db")
        cursor = conn.cursor()
        
        # Ensure table exists just in case
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS scam_analyses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                input_text TEXT NOT NULL,
                input_type VARCHAR(50),
                risk_score INTEGER,
                flags_json TEXT,
                created_at DATETIME
            )
        ''')
        
        input_type = "text_with_image" if image_url else "text"
        flags_json = json.dumps(flags)
        timestamp = datetime.datetime.utcnow().isoformat()
        
        cursor.execute('''
            INSERT INTO scam_analyses (input_text, input_type, risk_score, flags_json, created_at)
            VALUES (?, ?, ?, ?, ?)
        ''', (text, input_type, risk_score, flags_json, timestamp))
        
        conn.commit()
        conn.close()
    except Exception as e:
        logger.error(f"DB Logging Error (sqlite3): {e}")

@router.get("/stats")
async def get_real_stats():
    """Fetch live statistics from the SQLite database."""
    try:
        conn = sqlite3.connect("./niveshkavach.db")
        cursor = conn.cursor()
        
        # Check if table exists
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='scam_analyses'")
        if not cursor.fetchone():
            return {"scams_identified": 0, "investors_protected": 0, "losses_prevented": 0}

        # Get total analyses (Investors Protected)
        cursor.execute("SELECT COUNT(*) FROM scam_analyses")
        total_analyses = cursor.fetchone()[0]
        
        # Get high-risk scams (Scams Identified)
        cursor.execute("SELECT COUNT(*) FROM scam_analyses WHERE risk_score > 50")
        total_scams = cursor.fetchone()[0]
        
        conn.close()
        
        # Estimate: average retail scam targets ₹50,000
        losses_prevented = total_scams * 50000 
        
        return {
            "scams_identified": total_scams,
            "investors_protected": total_analyses,
            "losses_prevented": losses_prevented
        }
    except Exception as e:
        logger.error(f"Error fetching stats: {e}")
        return {"scams_identified": 0, "investors_protected": 0, "losses_prevented": 0}

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

@router.post("/", response_model=AnalyzeResponse)
async def analyze_message(request: AnalyzeRequest, background_tasks: BackgroundTasks):
    try:
        # Auto-detect language if the user is typing English vs Hindi
        detected_lang = detect_language(request.text)
        
        # Call the actual service using the auto-detected language
        result = await scam_detector.analyze(request.text, detected_lang, request.image_url)
        
        # Ensure result has default fields if missing
        risk_score = result.get("risk_score", 0)
        risk_level = result.get("risk_level", "low")
        flags = result.get("flags", [])
        explanation = result.get("explanation", "No suspicious patterns detected.")
        actions = result.get("actions", [])
        educational_tip = result.get("educational_tip", "Always verify financial advice from registered SEBI advisors.")
        
        # Format flags as dict to match AnalyzeResponse schema
        formatted_flags = [{"reason": f} if isinstance(f, str) else f for f in flags]
        
        response_data = AnalyzeResponse(
            risk_score=risk_score,
            risk_level=risk_level.upper(),
            flags=formatted_flags,
            explanation=explanation,
            actions=actions,
            educational_tip=educational_tip
        )
        
        # Run DB save safely in background to avoid greenlet/asyncio thread blocking
        background_tasks.add_task(
            save_analysis_to_db, 
            request.text, 
            request.image_url, 
            risk_score, 
            flags
        )
        
        return response_data
        
    except Exception as e:
        logger.error(f"Error analyzing message: {str(e)}")
        # Graceful fallback response
        return AnalyzeResponse(
            risk_score=0,
            risk_level="UNKNOWN",
            flags=[],
            explanation="We encountered an error analyzing this message. Please proceed with caution.",
            actions=["Do not share personal information.", "Do not send money."],
            educational_tip="Scammers often create a false sense of urgency. Take your time to verify."
        )
