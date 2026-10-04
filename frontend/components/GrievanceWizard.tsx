"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, ExternalLink, Copy, Check } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Select Issue Category",
    titleHi: "समस्या की श्रेणी चुनें",
    options: [
      { id: "scam", label: "I was scammed", labelHi: "मुझसे धोखाधड़ी हुई" },
      { id: "broker", label: "Broker complaint", labelHi: "ब्रोकर से शिकायत" },
      { id: "unclaimed", label: "Unclaimed shares", labelHi: "बेदावा शेयर" },
      { id: "nominee", label: "Nominee issues", labelHi: "नॉमिनी समस्या" },
      { id: "other", label: "Other", labelHi: "अन्य" }
    ]
  },
  {
    id: 2,
    title: "Review Action Plan",
    titleHi: "कार्य योजना की समीक्षा करें"
  },
  {
    id: 3,
    title: "Draft Complaint",
    titleHi: "शिकायत का ड्राफ्ट तैयार करें"
  }
];

export default function GrievanceWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [category, setCategory] = useState("");
  const [copied, setCopied] = useState(false);

  const getActionPlan = () => {
    switch(category) {
      case "scam":
        return {
          portal: "Cybercrime.gov.in",
          link: "https://cybercrime.gov.in",
          steps: [
            "Gather all proofs (screenshots, transaction IDs).",
            "Call 1930 immediately to freeze fraudulent transfers.",
            "File a detailed complaint on the National Cyber Crime portal."
          ]
        };
      case "broker":
        return {
          portal: "SCORES (SEBI)",
          link: "https://scores.gov.in",
          steps: [
            "First, raise a ticket with your broker's grievance officer.",
            "Wait for 30 days. If unresolved, proceed to SCORES.",
            "Register on SCORES portal and file complaint against the broker."
          ]
        };
      case "unclaimed":
        return {
          portal: "IEPF Portal",
          link: "http://www.iepf.gov.in",
          steps: [
            "Check IEPF website if shares are transferred there.",
            "Fill e-Form IEPF-5.",
            "Submit physical copy of documents to the company's Nodal Officer."
          ]
        };
      default:
        return {
          portal: "SCORES (SEBI)",
          link: "https://scores.gov.in",
          steps: ["Identify the regulated entity.", "File a complaint on SEBI SCORES portal."]
        };
    }
  };

  const getTemplate = () => {
    return `Subject: Complaint regarding [Brief Issue]

To the Grievance Officer,

I, [Your Name], am writing to file a formal complaint regarding an incident that occurred on [Date]. 

Details of the incident:
[Explain what happened clearly and concisely]

Financial Loss (if any): Rs. [Amount]
Transaction IDs: [List them]

I have attached all relevant screenshots and documents for your reference. I request you to investigate this matter urgently.

Sincerely,
[Your Name]
[Your Phone Number]
[Your Email]`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getTemplate());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-gray-50 p-4 border-b border-gray-100">
        <div className="flex justify-between items-center max-w-2xl mx-auto">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                currentStep >= step.id ? "bg-primary text-white" : "bg-gray-200 text-gray-500"
              }`}>
                {step.id}
              </div>
              <span className={`text-xs mt-2 text-center ${
                currentStep >= step.id ? "text-primary font-medium" : "text-gray-400"
              }`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 md:p-8 min-h-[400px]">
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <h2 className="text-xl font-bold text-secondary text-center mb-8">
                What is your issue? <span className="text-gray-400 font-normal">/ आपकी समस्या क्या है?</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {steps[0].options?.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setCategory(opt.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      category === opt.id 
                        ? "border-primary bg-primary/5 shadow-md" 
                        : "border-gray-200 hover:border-primary/50 hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-bold text-secondary">{opt.label}</div>
                    <div className="text-sm text-gray-500">{opt.labelHi}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
            >
              <h2 className="text-xl font-bold text-secondary mb-6">Action Plan</h2>
              
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mb-6">
                <h3 className="font-semibold text-blue-900 mb-4 text-lg">Recommended Steps</h3>
                <ul className="space-y-3">
                  {getActionPlan().steps.map((step, i) => (
                    <li key={i} className="flex items-start">
                      <div className="bg-blue-200 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center shrink-0 mr-3 mt-0.5 text-sm font-bold">
                        {i + 1}
                      </div>
                      <span className="text-gray-800">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={getActionPlan().link}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-colors group"
              >
                <div>
                  <div className="font-semibold text-secondary">Proceed to Official Portal</div>
                  <div className="text-sm text-gray-500">{getActionPlan().portal}</div>
                </div>
                <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-primary" />
              </a>
            </motion.div>
          )}

          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-2xl mx-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-secondary">Complaint Template</h2>
                <button
                  onClick={copyToClipboard}
                  className="flex items-center space-x-2 text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-secondary transition-colors"
                >
                  {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
                  <span>{copied ? "Copied!" : "Copy Text"}</span>
                </button>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700">
                  {getTemplate()}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-between">
        <button
          onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
          disabled={currentStep === 1}
          className="px-6 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-200 disabled:opacity-50 flex items-center transition-colors"
        >
          <ChevronLeft className="h-5 w-5 mr-1" /> Back
        </button>
        <button
          onClick={() => setCurrentStep(prev => Math.min(3, prev + 1))}
          disabled={currentStep === 3 || (currentStep === 1 && !category)}
          className="px-6 py-2 rounded-lg font-bold text-white bg-primary hover:bg-[#E55A2B] disabled:opacity-50 flex items-center transition-colors"
        >
          Next <ChevronRight className="h-5 w-5 ml-1" />
        </button>
      </div>
    </div>
  );
}
