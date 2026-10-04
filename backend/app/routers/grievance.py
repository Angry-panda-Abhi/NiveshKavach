from fastapi import APIRouter
from app.models.schemas import GrievanceRequest, GrievanceResponse
from app.services.llm_service import LLMService
import logging

router = APIRouter(prefix="/grievance", tags=["Grievance"])
logger = logging.getLogger(__name__)
llm_service = LLMService()

GRIEVANCE_GUIDES = {
    "scam": {
        "en": [
            "1. Immediately block the sender and stop all communication.",
            "2. Take screenshots of all chats, transaction IDs, and profiles.",
            "3. Report cyber fraud immediately at Cybercrime Portal (https://cybercrime.gov.in) or call 1930.",
            "4. Contact your bank immediately to freeze the account/transaction.",
            "5. If it involves securities market, file a complaint on SEBI SCORES (https://scores.gov.in)."
        ],
        "hi": [
            "1. तुरंत सेंडर को ब्लॉक करें और सभी बातचीत बंद कर दें।",
            "2. सभी चैट्स, ट्रांजैक्शन आईडी और प्रोफाइल के स्क्रीनशॉट लें।",
            "3. साइबर क्राइम पोर्टल (https://cybercrime.gov.in) पर तुरंत शिकायत दर्ज करें या 1930 पर कॉल करें।",
            "4. अपने बैंक से तुरंत संपर्क करें और खाते/लेनदेन को फ्रीज करवाएं।",
            "5. यदि यह शेयर बाजार से संबंधित है, तो SEBI SCORES (https://scores.gov.in) पर शिकायत दर्ज करें।"
        ]
    },
    "broker_issue": {
        "en": [
            "1. First, raise a complaint directly with your broker's grievance redressal mechanism.",
            "2. If unresolved within 30 days, file a complaint on the respective Exchange Portal (NSE/BSE).",
            "3. You can also file a complaint through SEBI SCORES portal (https://scores.gov.in)."
        ],
        "hi": [
            "1. सबसे पहले अपने ब्रोकर के शिकायत निवारण तंत्र के साथ शिकायत दर्ज करें।",
            "2. यदि 30 दिनों के भीतर समाधान नहीं होता है, तो संबंधित एक्सचेंज पोर्टल (NSE/BSE) पर शिकायत दर्ज करें।",
            "3. आप SEBI SCORES पोर्टल (https://scores.gov.in) के माध्यम से भी शिकायत दर्ज कर सकते हैं।"
        ]
    },
    "unclaimed_shares": {
        "en": [
            "1. Verify the details of unclaimed shares/dividends on the IEPF website.",
            "2. Fill out the IEPF-5 form online at the IEPF portal (http://www.iepf.gov.in).",
            "3. Submit the physical copy of the form along with required documents to the company's Nodal Officer."
        ],
        "hi": [
            "1. IEPF वेबसाइट पर लावारिस शेयरों/लाभांश के विवरण को सत्यापित करें।",
            "2. IEPF पोर्टल (http://www.iepf.gov.in) पर ऑनलाइन IEPF-5 फॉर्म भरें।",
            "3. आवश्यक दस्तावेजों के साथ फॉर्म की भौतिक प्रतिलिपि कंपनी के नोडल अधिकारी को जमा करें।"
        ]
    },
    "nominee": {
        "en": [
            "1. Download the transmission form from your DP (NSDL/CDSL).",
            "2. Gather required documents: Death certificate (notarized), Client Master Report, etc.",
            "3. Submit the completed application to your Depository Participant (Broker)."
        ],
        "hi": [
            "1. अपने डीपी (NSDL/CDSL) से ट्रांसमिशन फॉर्म डाउनलोड करें।",
            "2. आवश्यक दस्तावेज एकत्र करें: मृत्यु प्रमाण पत्र (नोटरीकृत), क्लाइंट मास्टर रिपोर्ट, आदि।",
            "3. अपने डिपॉजिटरी पार्टिसिपेंट (ब्रोकर) को भरा हुआ आवेदन जमा करें।"
        ]
    },
    "mutual_fund": {
        "en": [
            "1. Raise the issue with the Mutual Fund House or AMC first.",
            "2. If unresolved, approach AMFI (Association of Mutual Funds in India).",
            "3. Final escalation can be done via SEBI SCORES (https://scores.gov.in)."
        ],
        "hi": [
            "1. सबसे पहले म्यूचुअल फंड हाउस या एएमसी के साथ समस्या उठाएं।",
            "2. यदि समाधान नहीं होता है, तो AMFI (भारत में म्यूचुअल फंड्स का संघ) से संपर्क करें।",
            "3. अंतिम शिकायत SEBI SCORES (https://scores.gov.in) के माध्यम से की जा सकती है।"
        ]
    },
    "insurance_fraud": {
        "en": [
            "1. File a written complaint with your insurance company's grievance redressal officer.",
            "2. If unresolved in 15 days, approach the Insurance Ombudsman.",
            "3. You can also register a complaint on IRDAI's Bima Bharosa portal (https://bimabharosa.irdai.gov.in/)."
        ],
        "hi": [
            "1. अपनी बीमा कंपनी के शिकायत निवारण अधिकारी के पास लिखित शिकायत दर्ज करें।",
            "2. यदि 15 दिनों में समाधान नहीं होता है, तो बीमा लोकपाल से संपर्क करें।",
            "3. आप IRDAI के बीमा भरोसा पोर्टल (https://bimabharosa.irdai.gov.in/) पर भी शिकायत दर्ज कर सकते हैं।"
        ]
    }
}

@router.post("/", response_model=GrievanceResponse)
async def get_grievance_guide(request: GrievanceRequest):
    issue_type = request.issue_type
    lang = "hi" if request.language.lower() == "hi" else "en"
    
    steps = GRIEVANCE_GUIDES.get(issue_type, GRIEVANCE_GUIDES.get("scam"))[lang]
    
    # Generate draft using LLM (mocked here or actual LLM call if available)
    prompt = f"Draft a formal complaint letter for {issue_type} in {lang} language with placeholders like [Name], [Date]."
    try:
        draft = await llm_service.generate_education_response(prompt, lang)
    except:
        draft = "Dear Sir/Madam,\n\nI wish to report an issue regarding [Issue Type].\nDetails: [Insert Details]\n\nRegards,\n[Name]"
        
    portal_links = []
    if issue_type == "scam":
        portal_links = [{"name": "Cybercrime Portal", "url": "https://cybercrime.gov.in"}, {"name": "SEBI SCORES", "url": "https://scores.gov.in"}]
    elif issue_type == "broker_issue" or issue_type == "mutual_fund":
        portal_links = [{"name": "SEBI SCORES", "url": "https://scores.gov.in"}]
    elif issue_type == "unclaimed_shares":
        portal_links = [{"name": "IEPF Portal", "url": "http://www.iepf.gov.in"}]
    elif issue_type == "insurance_fraud":
        portal_links = [{"name": "Bima Bharosa", "url": "https://bimabharosa.irdai.gov.in/"}]
        
    return GrievanceResponse(
        steps=steps,
        portal_links=portal_links,
        draft_template=draft
    )
