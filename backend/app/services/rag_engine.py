import json
from typing import Dict, Any
import os

class RAGEngine:
    def __init__(self):
        self.knowledge_base = []
        self.initialized = False

    def initialize(self):
        """Load education documents into memory."""
        try:
            file_path = os.path.join(os.path.dirname(__dirname__), "data", "education_content.json")
            if os.path.exists(file_path):
                with open(file_path, "r", encoding="utf-8") as f:
                    self.knowledge_base = json.load(f)
                self.initialized = True
            else:
                self.knowledge_base = []
                self.initialized = True
        except Exception as e:
            print(f"Error initializing RAG engine: {e}")

    def query(self, question: str, language: str) -> Dict[str, Any]:
        """Simple keyword matching RAG for hackathon purposes."""
        if not self.initialized:
            self.initialize()
            
        question_lower = question.lower()
        best_match = None
        max_hits = 0
        
        # Super simple token overlap scoring
        query_tokens = set(question_lower.split())
        
        for item in self.knowledge_base:
            title_tokens = set(item.get("title_en", "").lower().split() + item.get("title_hi", "").lower().split())
            hits = len(query_tokens.intersection(title_tokens))
            
            if hits > max_hits:
                max_hits = hits
                best_match = item
                
        if best_match:
            content_key = f"content_{language}" if language in ["hi", "en"] else "content_en"
            title_key = f"title_{language}" if language in ["hi", "en"] else "title_en"
            
            return {
                "found": True,
                "title": best_match.get(title_key, ""),
                "content": best_match.get(content_key, ""),
                "category": best_match.get("category", "")
            }
            
        return {
            "found": False,
            "message": "I couldn't find specific information on that in my database, but remember to always verify investments with SEBI."
        }
