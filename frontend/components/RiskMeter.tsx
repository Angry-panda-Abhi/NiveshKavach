"use client";

import { motion } from "framer-motion";

interface RiskMeterProps {
  score: number; // 0 to 100
}

export default function RiskMeter({ score }: RiskMeterProps) {
  // Determine colors based on score
  // 0-30: Green, 31-60: Yellow, 61-100: Red
  let color = "#2E7D32"; // accent/green
  let label = "SAFE";
  
  if (score > 30 && score <= 60) {
    color = "#F59E0B"; // yellow
    label = "CAUTION";
  } else if (score > 60) {
    color = "#D32F2F"; // danger/red
    label = "DANGER";
  }

  // SVG dimensions and calculations
  const size = 200;
  const strokeWidth = 16;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * Math.PI; // Semi-circle
  const dashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size / 2 + 20 }}>
        {/* Background Arc */}
        <svg
          width={size}
          height={size / 2}
          viewBox={`0 0 ${size} ${size / 2}`}
          className="overflow-visible"
        >
          <path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${
              size - strokeWidth / 2
            } ${size / 2}`}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />
          {/* Foreground Arc */}
          <motion.path
            d={`M ${strokeWidth / 2} ${size / 2} A ${radius} ${radius} 0 0 1 ${
              size - strokeWidth / 2
            } ${size / 2}`}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: dashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>

        {/* Score Display */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center">
          <motion.span
            className="text-4xl font-bold"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {score}
          </motion.span>
        </div>
      </div>

      <motion.div
        className="mt-4 px-6 py-2 rounded-full font-bold tracking-wider text-white"
        style={{ backgroundColor: color }}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.5, type: "spring" }}
      >
        {label}
      </motion.div>
    </div>
  );
}
