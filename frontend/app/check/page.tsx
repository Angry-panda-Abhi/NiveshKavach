"use client";

import { useState } from "react";



export default function CheckPage() {
  const [text, setText] = useState("");
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!text.trim() && !imageBase64) return;
    
    setLoading(true);
    setResult(null);

    try {
      // Try hitting the backend API
      const res = await fetch("http://localhost:8000/api/v1/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, image_url: imageBase64 }),
      });
      
      if (!res.ok) throw new Error("Backend failed");
      
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Backend connection failed", error);
      setResult({
        risk_score: 0,
        risk_level: "ERROR",
        flags: [{ reason: "Could not connect to the NiveshKavach AI Backend." }],
        recommendations: ["Ensure the FastAPI server is running on port 8000.", "Check your internet connection."],
        educational_tip: "Connection to the AI server timed out."
      });
    }
    
    setLoading(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Compress image using Canvas to prevent 'Payload Too Large' API errors
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Max width/height of 512px for the free vision API
          const MAX_SIZE = 512;
          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Convert to jpeg with 0.7 quality to keep it tiny
          setImageBase64(canvas.toDataURL('image/jpeg', 0.7));
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const loadExample = (type: string) => {
    const examples: Record<string, string> = {
      hindi: "Sir 100% Guaranteed returns chahiye? Humara premium telegram group join karein. Daily 2-3 multibagger calls milenge. Rs 5000 fee monthly. No risk only profit! Payment link niche hai.",
      english: "URGENT: Insiders buying massive quantities of XYZ corp. Target price 500% in next 3 days. Buy now before market opens tomorrow! Risk-free investment.",
      safe: "As per our analysis of Q3 earnings, HDFC Bank shows stable growth. However, market risks remain. Please review your risk appetite before investing. - SEBI Reg No: INA000011223",
    };
    setText(examples[type] || "");
    setImageBase64(null);
    setResult(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12 md:py-20 animate-fadeIn">
      
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-bold text-secondary mb-4">Analyze Suspicious Messages</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Paste any SMS, WhatsApp forward, or upload a screenshot. Our AI will instantly check it against SEBI guidelines and known scam patterns.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Input Section */}
        <div className="w-full lg:w-1/2 glass p-6 md:p-8 rounded-2xl shadow-xl flex flex-col">
          
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-secondary">Message Content</h2>
            <select className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary">
              <option>English / Hindi</option>
              <option>Tamil</option>
              <option>Telugu</option>
            </select>
          </div>

          <div className="relative mb-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste message here... / यहाँ संदेश पेस्ट करें..."
              className="w-full h-48 p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-gray-800 bg-white"
            />
            {imageBase64 && (
              <div className="absolute top-4 right-4 w-20 h-20 rounded border border-gray-200 overflow-hidden shadow-sm">
                <img src={imageBase64} alt="Uploaded" className="w-full h-full object-cover" />
                <button onClick={() => setImageBase64(null)} className="absolute top-0 right-0 bg-red-500 text-white rounded-bl p-1 shadow">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  // @ts-ignore
                  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                  if (SpeechRecognition) {
                    const recognition = new SpeechRecognition();
                    recognition.lang = 'hi-IN';
                    recognition.onstart = () => alert("Listening... Speak now!");
                    recognition.onresult = (event: any) => {
                      const transcript = event.results[0][0].transcript;
                      setText((prev) => prev ? prev + ' ' + transcript : transcript);
                    };
                    recognition.start();
                  } else {
                    alert("Voice input is not supported in this browser. Please use Chrome.");
                  }
                }}
                className="text-sm text-gray-500 flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                Voice
              </button>
              
              <label className="text-sm text-gray-500 flex items-center gap-1 hover:text-primary transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                Screenshot
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>
            <span className="text-xs text-gray-400">{text.length} chars</span>
          </div>

          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Try an example:</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => loadExample('english')} className="px-3 py-1 bg-gray-100 hover:bg-red-50 text-red-700 text-xs rounded-full border border-gray-200 hover:border-red-200 transition-colors">Telegram Pump & Dump</button>
              <button onClick={() => loadExample('hindi')} className="px-3 py-1 bg-gray-100 hover:bg-orange-50 text-orange-700 text-xs rounded-full border border-gray-200 hover:border-orange-200 transition-colors">WhatsApp Fake Advisor (Hindi)</button>
              <button onClick={() => loadExample('safe')} className="px-3 py-1 bg-gray-100 hover:bg-green-50 text-green-700 text-xs rounded-full border border-gray-200 hover:border-green-200 transition-colors">Safe SEBI Message</button>
            </div>
          </div>

          <button 
            onClick={handleAnalyze}
            disabled={loading || (!text.trim() && !imageBase64)}
            className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg hover:bg-[#e65a29] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-auto"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                Analyze Risk
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        <div className="w-full lg:w-1/2">
          {result ? (
            <div className="glass p-6 md:p-8 rounded-2xl shadow-xl h-full flex flex-col animate-slideUp">
              
              {/* Risk Meter Header */}
              <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-gray-200">
                <div className="relative w-32 h-32 flex-shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full drop-shadow-md">
                    <path
                      className="text-gray-200"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                    <path
                      className={result.risk_score > 70 ? "text-danger" : result.risk_score > 30 ? "text-orange-500" : "text-green-500"}
                      strokeDasharray={`${result.risk_score}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      style={{ transition: "stroke-dasharray 1s ease-out" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-secondary">{result.risk_score}</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Score</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-500 mb-1">Risk Assessment</h3>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-lg text-white ${
                    result.risk_level === "CRITICAL" || result.risk_level === "HIGH" ? "bg-danger animate-pulse" : 
                    result.risk_level === "MEDIUM" ? "bg-orange-500" : "bg-green-500"
                  }`}>
                    {result.risk_level === "CRITICAL" && <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>}
                    {result.risk_level} RISK
                  </div>
                </div>
              </div>

              {/* Flags */}
              {result.flags && result.flags.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-bold text-secondary mb-3 flex items-center gap-2">
                    <svg className="w-5 h-5 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"></path></svg>
                    Red Flags Detected
                  </h4>
                  <ul className="space-y-3">
                    {result.flags.map((flag: any, i: number) => (
                      <li key={i} className="flex items-start gap-3 bg-red-50 p-3 rounded-lg border border-red-100">
                        <span className="text-red-500 mt-0.5">•</span>
                        <span className="text-sm text-red-900">{flag.description || flag.reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              <div className="mb-6">
                <h4 className="font-bold text-secondary mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Recommended Actions
                </h4>
                <ul className="space-y-2">
                  {(result.actions || result.recommendations)?.map((rec: string, i: number) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Educational Tip */}
              <div className="mt-auto bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p className="text-sm text-blue-900 font-medium">
                  {result.educational_tip}
                </p>
              </div>

            </div>
          ) : (
            <div className="glass p-8 rounded-2xl h-full flex flex-col items-center justify-center text-center border-dashed border-2 border-gray-300">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-500 mb-2">Awaiting Input</h3>
              <p className="text-gray-400 max-w-xs text-sm">Paste a message and click analyze to see the AI breakdown here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
