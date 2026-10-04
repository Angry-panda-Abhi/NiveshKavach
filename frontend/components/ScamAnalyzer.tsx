"use client";

import { useState } from "react";
import axios from "axios";
import { AlertTriangle, CheckCircle, Info, UploadCloud, Loader2 } from "lucide-react";
import LanguageSelector from "./LanguageSelector";
import VoiceInput from "./VoiceInput";
import RiskMeter from "./RiskMeter";

export default function ScamAnalyzer() {
  const [text, setText] = useState("");
  const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    setResult(null);

    try {
      // Call the real backend API
      const response = await axios.post("http://localhost:8000/api/v1/analyze", { 
        text: text, 
        language: lang 
      });
      
      const data = response.data;
      
      setResult({
        score: data.risk_score,
        redFlags: data.flags || [],
        explanation: data.explanation,
        actions: data.actions || [],
        tip: data.educational_tip || "Rule of thumb: If it sounds too good to be true, it almost certainly is."
      });
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="p-6 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-secondary">Analyzer</h2>
          <LanguageSelector onSelect={setLang} />
        </div>

        <div className="relative">
          <textarea
            className="w-full h-40 p-4 border-2 border-gray-200 rounded-xl focus:ring-0 focus:border-primary resize-none text-gray-700 bg-gray-50"
            placeholder="Paste suspicious message here / संदिग्ध संदेश यहाँ पेस्ट करें..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button className="p-3 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300 transition-colors" title="Upload Image">
              <UploadCloud className="h-5 w-5" />
            </button>
            <VoiceInput onTranscript={(t) => setText(prev => prev + " " + t)} language={lang} />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button 
            onClick={() => setText("Guaranteed 200% returns in 3 days! Join our premium VIP telegram group for multibagger stocks. Limited slots!")}
            className="text-xs bg-red-50 text-danger border border-red-200 px-3 py-1.5 rounded-full hover:bg-red-100"
          >
            Try Example Scam Message
          </button>
          <button 
            onClick={() => setText("Hi, attaching the quarterly earnings report for Reliance Industries as discussed.")}
            className="text-xs bg-green-50 text-accent border border-green-200 px-3 py-1.5 rounded-full hover:bg-green-100"
          >
            Try Safe Message
          </button>
        </div>

        <div className="mt-8">
          <button
            onClick={handleAnalyze}
            disabled={!text.trim() || loading}
            className="w-full bg-primary hover:bg-[#E55A2B] text-white font-bold py-4 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center text-lg shadow-lg shadow-primary/30"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-6 w-6 mr-2" />
                Analyzing / जाँच हो रही है...
              </>
            ) : (
              "Analyze / जाँच करें"
            )}
          </button>
        </div>

        {/* Results Area */}
        {result && (
          <div className="mt-12 pt-8 border-t border-gray-100 grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-2xl">
              <RiskMeter score={result.score} />
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-secondary mb-3">Analysis Summary</h3>
                <p className="text-gray-700 bg-orange-50 p-4 rounded-lg border border-orange-100">
                  {result.explanation}
                </p>
              </div>

              {result.redFlags.length > 0 && (
                <div>
                  <h4 className="font-semibold text-danger flex items-center mb-2">
                    <AlertTriangle className="h-5 w-5 mr-2" /> Detected Red Flags
                  </h4>
                  <ul className="space-y-2">
                    {result.redFlags.map((flag: string, i: number) => (
                      <li key={i} className="flex items-start text-sm text-gray-700">
                        <span className="text-danger mr-2">•</span> {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-accent flex items-center mb-2">
                  <CheckCircle className="h-5 w-5 mr-2" /> Recommended Actions
                </h4>
                <ul className="space-y-2">
                  {result.actions.map((action: string, i: number) => (
                    <li key={i} className="flex items-start text-sm text-gray-700">
                      <span className="text-accent mr-2">✓</span> {action}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start">
                <Info className="h-5 w-5 text-blue-500 mr-3 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">{result.tip}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
