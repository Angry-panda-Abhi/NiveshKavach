import re
import json
import os
from typing import Dict, Any, Optional, List

class SebiVerifier:
    def __init__(self):
        # Mock database of registered entities for the hackathon
        self.registered_entities = {
            "INA000000001": {"name": "Zerodha Broking Ltd", "type": "Stock Broker", "status": "Active"},
            "INB000000002": {"name": "Groww Invest Tech Pvt Ltd", "type": "Stock Broker", "status": "Active"},
            "INZ000000003": {"name": "Upstox Securities Pvt Ltd", "type": "Stock Broker", "status": "Active"},
            "INA100000004": {"name": "Angel One Limited", "type": "Stock Broker", "status": "Active"},
            "INA200000005": {"name": "HDFC Securities", "type": "Stock Broker", "status": "Active"},
            "INA300000006": {"name": "ICICI Securities", "type": "Stock Broker", "status": "Active"},
            "INP000000007": {"name": "Kotak Securities", "type": "Portfolio Manager", "status": "Active"},
            "INH000000008": {"name": "Motilal Oswal", "type": "Research Analyst", "status": "Active"},
        }
        
        # Regex patterns for various SEBI registrations
        self.patterns = [
            r"INA\d{9}",  # Investment Adviser
            r"INB\d{9}",  # Stock Broker
            r"INZ\d{9}",  # Stock Broker (New format)
            r"INP\d{9}",  # Portfolio Manager
            r"INH\d{9}",  # Research Analyst
        ]

    def extract_registration_number(self, text: str) -> Optional[str]:
        """Extract SEBI registration number from text."""
        for pattern in self.patterns:
            match = re.search(pattern, text.upper())
            if match:
                return match.group(0)
        return None

    def verify_advisor(self, query: str) -> Dict[str, Any]:
        """Check if an entity is registered by ID or Name."""
        query = query.strip().upper()
        
        # Check if it's a format match
        is_id = self.extract_registration_number(query)
        
        if is_id:
            if query in self.registered_entities:
                entity = self.registered_entities[query]
                return {
                    "is_registered": True,
                    "entity": entity,
                    "message": f"Verified: {entity['name']} is a registered {entity['type']}."
                }
            return {
                "is_registered": False,
                "entity": None,
                "message": "Warning: Registration number looks like a SEBI format, but is NOT in our active registry. Proceed with extreme caution."
            }
            
        # Check by name loosely
        for reg_no, entity in self.registered_entities.items():
            if query in entity["name"].upper():
                return {
                    "is_registered": True,
                    "entity": entity,
                    "registration_no": reg_no,
                    "message": f"Verified: Found registered entity matching {entity['name']}."
                }
                
        return {
            "is_registered": False,
            "entity": None,
            "message": "Entity not found in SEBI registry. Do not invest without verifying their credentials."
        }
