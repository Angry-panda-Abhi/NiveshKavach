"use client";

import { useState } from "react";



export default function VerifyPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    setSearched(true);
    setResult(null);

    try {
      const res = await fetch(`http://localhost:8000/api/v1/verify/advisor?q=${query}`);
      if (!res.ok) throw new Error("Backend failed");
      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Backend connection failed", error);
      setResult({ found: false, data: null, error: "Could not connect to the SEBI verification server." });
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 md:py-20 animate-fadeIn">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-secondary mb-4">Verify SEBI Registration</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Before taking any financial advice, always verify if the advisor or company is officially registered with SEBI. 
          Enter a Registration Number or Entity Name below.
        </p>
      </div>

      <div className="glass p-6 md:p-10 rounded-2xl shadow-xl mb-12">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 relative">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., INA000011223 or 'HDFC Securities'"
              className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-800 bg-white text-lg shadow-sm"
            />
          </div>
          <button 
            type="submit"
            disabled={loading || !query.trim()}
            className="px-8 py-4 bg-secondary text-white font-bold rounded-xl shadow-md hover:bg-[#111a2e] transition-colors disabled:opacity-70 flex items-center justify-center whitespace-nowrap"
          >
            {loading ? "Searching..." : "Verify Now"}
          </button>
        </form>

        {/* Results Area */}
        {searched && !loading && (
          <div className="mt-8 animate-slideUp">
            {result?.found ? (
              <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 text-green-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div className="flex-grow text-center md:text-left">
                  <h3 className="text-2xl font-bold text-green-900 mb-1">Verified Entity Found</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-left">
                    <div>
                      <p className="text-xs text-green-700 uppercase font-bold">Entity Name</p>
                      <p className="font-semibold text-gray-900">{result.data.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-700 uppercase font-bold">Registration No.</p>
                      <p className="font-mono text-gray-900">{result.data.reg_no}</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-700 uppercase font-bold">Type</p>
                      <p className="text-gray-900">{result.data.type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-700 uppercase font-bold">Status</p>
                      <p className="inline-flex items-center gap-1 text-green-700 font-bold bg-green-100 px-2 py-0.5 rounded">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span> {result.data.status}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border-2 border-red-400 rounded-xl p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 text-red-600">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-red-900 mb-2">No Verified Record Found</h3>
                  <p className="text-red-700 mb-4">We could not find any active SEBI registration matching your query. This entity might be unregistered or fraudulent.</p>
                  <p className="text-sm text-gray-600">
                    <strong>Note:</strong> Always double-check spellings. If you still can't find them, do NOT invest any money and report them to authorities.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-6 rounded-xl border-t-4 border-primary">
          <h4 className="font-bold text-secondary mb-2">Investment Advisor (RIA)</h4>
          <p className="text-sm text-gray-600">Registered to provide investment advice and financial planning. Cannot handle your actual funds directly.</p>
        </div>
        <div className="glass p-6 rounded-xl border-t-4 border-blue-500">
          <h4 className="font-bold text-secondary mb-2">Research Analyst (RA)</h4>
          <p className="text-sm text-gray-600">Registered to publish research reports or recommendations on securities. Not allowed to offer personalized portfolio management.</p>
        </div>
        <div className="glass p-6 rounded-xl border-t-4 border-green-500">
          <h4 className="font-bold text-secondary mb-2">Stock Brokers</h4>
          <p className="text-sm text-gray-600">Registered to execute trades on stock exchanges on behalf of clients. Must be registered with SEBI and exchanges (NSE/BSE).</p>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          For the most up-to-date and authoritative records, always cross-reference with the <a href="https://www.sebi.gov.in/sebiweb/other/OtherAction.do?doRecognisedFpi=yes&intmId=13" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Official SEBI Intermediary Database</a>.
        </p>
      </div>
    </div>
  );
}
