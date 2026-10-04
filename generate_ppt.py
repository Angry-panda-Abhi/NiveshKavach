import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_styled_pitch_deck():
    prs = Presentation()
    
    # Theme Colors
    DARK_BLUE = RGBColor(27, 42, 74)     # #1B2A4A
    ORANGE = RGBColor(255, 107, 53)      # #FF6B35
    OFF_WHITE = RGBColor(255, 248, 240)  # #FFF8F0
    TEXT_GRAY = RGBColor(75, 85, 99)     # #4B5563
    
    slides_data = [
        {
            "title": "NiveshKavach (निवेश कवच)",
            "content": "AI-Powered Financial Shield for Indian Investors\n\nBuilt for the SANGYAN Hackathon (IIT BHU x SEBI x NSDL)",
            "layout": 0 # Title layout
        },
        {
            "title": "1. The Problem",
            "content": "• Millions of retail investors are targeted daily by financial scams.\n• Fraudsters use WhatsApp, Telegram, and SMS to push 'Pump & Dump' schemes and fake stock tips.\n• Investors lack an instant, accessible, vernacular tool to verify claims before losing money.",
            "layout": 1
        },
        {
            "title": "2. The Target User",
            "content": "• Everyday retail investors across Tier-2 and Tier-3 Indian cities.\n• First-time traders entering the market.\n• Retirees and non-tech-savvy individuals who rely heavily on WhatsApp for communication.",
            "layout": 1
        },
        {
            "title": "3. Our Solution: NiveshKavach",
            "content": "• An omni-channel, AI-powered financial shield.\n• Users can paste text, upload screenshots, or forward WhatsApp messages directly to our bot.\n• Instantly analyzes the input against SEBI guidelines and provides a Risk Score (0-100).",
            "layout": 1
        },
        {
            "title": "4. Key Features",
            "content": "• Multimodal AI: Analyzes both text and uploaded images/screenshots.\n• Vernacular Support: Auto-detects Hinglish/Hindi and responds natively.\n• Real-time Red Flags: Highlights false urgency, fake SEBI IDs, and guaranteed return traps.\n• Educational Tips: Context-aware advice instead of generic warnings.",
            "layout": 1
        },
        {
            "title": "5. The WhatsApp Integration",
            "content": "• ZERO App Downloads Required.\n• Meets users where they already are.\n• Fully integrated Twilio webhook allows users to just forward suspicious messages to a designated number for instant AI analysis.",
            "layout": 1
        },
        {
            "title": "6. Technical Architecture",
            "content": "• Frontend: Next.js, React, Tailwind CSS (HTML5 Canvas for image compression).\n• Backend: FastAPI (Python), SQLite for tracking metrics.\n• Core Engine: Custom Rule-Based Engine (Regex, Typosquatting, UPI Validation).\n• AI Engine: OpenRouter API for dynamic model fallback.",
            "layout": 1
        },
        {
            "title": "7. The AI & ML Components",
            "content": "• Primary LLM: Qwen-27B (Highly capable in Hindi/Indic reasoning).\n• Vision AI: Llama-3.2-11B-Vision for deep OCR and context extraction from scam screenshots.\n• Smart Fallback: Ensures 100% uptime even if one AI model fails.",
            "layout": 1
        },
        {
            "title": "8. Impact & Scalability",
            "content": "• Impact: Prevents capital loss, increases investor resilience, and builds trust in Indian capital markets.\n• Scalability: Highly scalable cloud architecture. WhatsApp integration allows immediate reach to 500M+ Indians without friction.",
            "layout": 1
        },
        {
            "title": "9. Future Roadmap",
            "content": "• Integration with official SEBI SCORES portal for one-click grievance filing.\n• Voice-note analysis for deepfake/scam call detection.\n• Support for 10+ regional languages (Tamil, Telugu, Bengali, etc.).",
            "layout": 1
        },
        {
            "title": "10. Thank You!",
            "content": "Protecting Indian investors, one message at a time.\n\nTeam: [Your Team Name]\nProject: NiveshKavach",
            "layout": 0
        }
    ]

    watermark_path = os.path.join(os.getcwd(), "watermark.png")

    for slide_data in slides_data:
        slide_layout = prs.slide_layouts[slide_data["layout"]]
        slide = prs.slides.add_slide(slide_layout)
        
        # 1. Set background color
        background = slide.background
        fill = background.fill
        fill.solid()
        fill.fore_color.rgb = OFF_WHITE
        
        # 2. Add Watermark
        if os.path.exists(watermark_path):
            # Center the watermark
            slide.shapes.add_picture(watermark_path, Inches(3), Inches(2), Inches(4), Inches(4))
            
        # 3. Add Banner for content slides (Layout 1)
        if slide_data["layout"] == 1:
            # Dark Blue Header Bar
            header_bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(10), Inches(1.2))
            header_bar.fill.solid()
            header_bar.fill.fore_color.rgb = DARK_BLUE
            header_bar.line.color.rgb = DARK_BLUE
            
            # Orange Accent Line
            accent_line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(1.2), Inches(10), Inches(0.1))
            accent_line.fill.solid()
            accent_line.fill.fore_color.rgb = ORANGE
            accent_line.line.color.rgb = ORANGE

        # 4. Text Styling
        title_shape = slide.shapes.title
        body_shape = slide.placeholders[1]
        
        title_shape.text = slide_data["title"]
        
        if slide_data["layout"] == 1:
            # Style title for content slides (white text on dark blue banner)
            title_shape.text_frame.paragraphs[0].font.color.rgb = RGBColor(255, 255, 255)
            title_shape.text_frame.paragraphs[0].font.bold = True
            title_shape.text_frame.paragraphs[0].font.size = Pt(36)
            title_shape.text_frame.paragraphs[0].alignment = PP_ALIGN.LEFT
            title_shape.top = Inches(0.2)
            title_shape.left = Inches(0.5)
        else:
            # Style title for Title slide (dark blue text)
            title_shape.text_frame.paragraphs[0].font.color.rgb = DARK_BLUE
            title_shape.text_frame.paragraphs[0].font.bold = True
            title_shape.text_frame.paragraphs[0].font.size = Pt(44)
            title_shape.text_frame.paragraphs[0].alignment = PP_ALIGN.CENTER

        tf = body_shape.text_frame
        tf.text = slide_data["content"]
        
        # Style body text
        for paragraph in tf.paragraphs:
            paragraph.font.color.rgb = DARK_BLUE
            paragraph.font.size = Pt(24)
            paragraph.space_after = Pt(14)
            
            if slide_data["layout"] == 0:
                paragraph.alignment = PP_ALIGN.CENTER
                paragraph.font.color.rgb = ORANGE
                paragraph.font.bold = True
            else:
                paragraph.alignment = PP_ALIGN.LEFT

        # Put text shapes to front (above watermark)
        # Note: python-pptx doesn't have a direct 'bring to front' z-order edit, 
        # but adding shapes earlier (like we did with the watermark) naturally places them behind the placeholders.

    file_path = os.path.join(os.getcwd(), "NiveshKavach_Pitch_Deck_Themed.pptx")
    prs.save(file_path)
    print(f"Themed Presentation saved successfully at: {file_path}")

if __name__ == "__main__":
    create_styled_pitch_deck()
