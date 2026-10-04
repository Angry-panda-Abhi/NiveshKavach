from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class AnalyzeRequest(BaseModel):
    text: str
    image_url: Optional[str] = None
    language: str = 'hi'

class AnalyzeResponse(BaseModel):
    risk_score: int
    risk_level: str
    flags: List[Dict[str, Any]]
    explanation: str
    actions: List[str]
    educational_tip: str

class VerifyAdvisorRequest(BaseModel):
    query: str

class VerifyAdvisorResponse(BaseModel):
    found: bool
    details: Optional[Dict[str, Any]] = None
    warnings: List[str]

class VerifyURLRequest(BaseModel):
    url: str

class VerifyURLResponse(BaseModel):
    is_safe: bool
    domain_age: Optional[str] = None
    risk_factors: List[str]

class EducateRequest(BaseModel):
    query: str
    language: str = 'hi'

class EducateResponse(BaseModel):
    response: str
    sources: List[str]
    related_topics: List[str]

class GrievanceRequest(BaseModel):
    issue_type: str
    language: str = 'hi'

class GrievanceResponse(BaseModel):
    steps: List[str]
    portal_links: List[Dict[str, str]]
    draft_template: Optional[str] = None

class VoiceRequest(BaseModel):
    audio_base64: str
    language: str = 'hi'

class VoiceResponse(BaseModel):
    transcript: str
    response_text: str
    response_audio_base64: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    version: str
