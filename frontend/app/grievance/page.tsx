"use client";

import { useState } from "react";

export default function GrievancePage() {
  const [step, setStep] = useState(1);
  const [issueType, setIssueType] = useState("");
  const [draft, setDraft] = useState("");

  const issueTypes = [
    { id: "broker", title: "Stock Broker Issue", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
    { id: "fraud", title: "Scam / Fraud", icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" },
    { id: "mutual", title: "Mutual Fund Issue", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
    { id: "other", title: "Other Queries", icon: "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }
  ];

  const generateDraft = () => {
    const template = `To,
The Grievance Officer,
[Company Name]

Subject: Complaint regarding [Brief description of issue]

Dear Sir/Madam,
I am writing to file a formal complaint regarding my trading/investment account [Client ID: XXXX]. 
The issue is: [Describe your issue here in detail, e.g., unauthorized trade, non-receipt of funds].

I request you to resolve this at the earliest, failing which I will escalate the matter to SEBI SCORES.

Thanks,
[Your Name]
[Your Phone Number]`;
    setDraft(template);
    setStep(3);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12 md:py-20 animate-fadeIn">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-bold text-secondary mb-4">File a Grievance</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Need help reporting a fraud or complaining against a registered entity? Use our step-by-step guide to take the correct action.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary transition-all duration-500 -z-10" style={{ width: `${((step - 1) / 2) * 100}%` }}></div>
          
          {[1, 2, 3].map((s) => (
            <div key={s} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s ? "bg-primary text-white" : "bg-gray-200 text-gray-500"}`}>
              {s}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-3 text-xs font-semibold text-gray-500 px-1">
          <span>Select Issue</span>
          <span className="text-center">Review Guide</span>
          <span>Draft & Send</span>
        </div>
      </div>

      {/* Wizard Content */}
      <div className="glass p-8 rounded-2xl shadow-xl min-h-[400px]">
        {step === 1 && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-secondary mb-6 text-center">What kind of issue are you facing?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {issueTypes.map(type => (
                <button
                  key={type.id}
                  onClick={() => setIssueType(type.id)}
                  className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-4 ${
                    issueType === type.id 
                      ? "border-primary bg-primary/5 shadow-md" 
                      : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${issueType === type.id ? "bg-primary text-white" : "bg-gray-100 text-gray-500"}`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={type.icon}></path></svg>
                  </div>
                  <span className="font-bold text-secondary">{type.title}</span>
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <button 
                onClick={() => setStep(2)}
                disabled={!issueType}
                className="px-6 py-3 bg-secondary text-white font-bold rounded-lg hover:bg-[#111a2e] disabled:opacity-50 transition-colors"
              >
                Next Step
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fadeIn">
            <h2 className="text-2xl font-bold text-secondary mb-6">Your Action Plan</h2>
            
            {issueType === "fraud" ? (
              <div className="bg-red-50 border border-red-200 p-6 rounded-xl mb-6">
                <h3 className="text-lg font-bold text-red-800 mb-2">Immediate Actions for Scam/Fraud</h3>
                <ul className="list-disc pl-5 space-y-2 text-red-900">
                  <li><strong>Stop Payments:</strong> Do not send any more money, regardless of threats or promises.</li>
                  <li><strong>Preserve Evidence:</strong> Take screenshots of all chats, transaction IDs, and phone numbers.</li>
                  <li><strong>Report to Bank:</strong> Call 1930 immediately to report financial cyber fraud.</li>
                  <li><strong>File Cyber Complaint:</strong> Register the case on the official Cybercrime portal.</li>
                </ul>
                <a href="https://cybercrime.gov.in/" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700">
                  Go to Cybercrime.gov.in
                </a>
              </div>
            ) : (
              <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl mb-6">
                <h3 className="text-lg font-bold text-blue-900 mb-2">Standard Escalation Matrix (SEBI)</h3>
                <ol className="list-decimal pl-5 space-y-3 text-blue-900">
                  <li><strong>Level 1:</strong> Write directly to the broker/entity's Grievance Officer. They must resolve it in 30 days.</li>
                  <li><strong>Level 2:</strong> If unresolved, file a complaint on the SEBI SCORES portal.</li>
                  <li><strong>Level 3:</strong> SmartODR (Online Dispute Resolution) platform.</li>
                </ol>
                <a href="https://scores.gov.in/" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">
                  Go to SCORES Portal
                </a>
              </div>
            )}

            <div className="flex justify-between mt-8">
              <button onClick={() => setStep(1)} className="px-6 py-3 text-gray-500 font-bold hover:text-secondary">Back</button>
              <button onClick={generateDraft} className="px-6 py-3 bg-primary text-white font-bold rounded-lg hover:bg-[#e65a29]">
                Generate Complaint Draft
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fadeIn flex flex-col h-full">
            <h2 className="text-2xl font-bold text-secondary mb-4">Email / Letter Template</h2>
            <p className="text-gray-600 text-sm mb-4">Copy and paste this template. Fill in the bracketed [ ] information before sending.</p>
            
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="w-full flex-grow min-h-[250px] p-4 bg-gray-50 border border-gray-200 rounded-xl font-mono text-sm text-gray-800 focus:outline-none focus:border-primary mb-6"
            />
            
            <div className="flex justify-between items-center mt-auto">
              <button onClick={() => setStep(2)} className="px-6 py-3 text-gray-500 font-bold hover:text-secondary">Back</button>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(draft);
                  alert("Draft copied to clipboard!");
                }} 
                className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                Copy to Clipboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
