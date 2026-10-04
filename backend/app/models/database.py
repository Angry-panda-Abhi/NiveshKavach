import datetime
import json
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import settings

# Ensure we use the synchronous driver to prevent greenlet_spawn errors during startup
sync_db_url = settings.DATABASE_URL.replace("sqlite+aiosqlite", "sqlite")

engine = create_engine(
    sync_db_url, 
    connect_args={"check_same_thread": False} if "sqlite" in sync_db_url else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class ScamAnalysis(Base):
    __tablename__ = "scam_analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    input_text = Column(Text, nullable=False)
    input_type = Column(String(50))
    risk_score = Column(Integer)
    flags_json = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ScamPattern(Base):
    __tablename__ = "scam_patterns"
    
    id = Column(Integer, primary_key=True, index=True)
    pattern_type = Column(String(100), index=True)
    pattern_text = Column(Text)
    pattern_regex = Column(Text)
    severity = Column(String(50))
    source = Column(String(100))

class SebiEntity(Base):
    __tablename__ = "sebi_entities"
    
    id = Column(Integer, primary_key=True, index=True)
    registration_number = Column(String(100), unique=True, index=True)
    entity_name = Column(String(200), index=True)
    entity_type = Column(String(100))
    status = Column(String(50))
    valid_until = Column(DateTime, nullable=True)

class EducationContent(Base):
    __tablename__ = "education_contents"
    
    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String(200), index=True)
    content_hi = Column(Text)
    content_en = Column(Text)
    category = Column(String(100))
    difficulty = Column(String(50))

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
