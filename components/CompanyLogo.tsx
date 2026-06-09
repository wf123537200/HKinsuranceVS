"use client";

import { useState } from "react";

interface CompanyLogoProps {
  name: string;
  displayName: string;
  logoUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Brand colors for each company
const BRAND_COLORS: Record<string, { bg: string; text: string }> = {
  "prudential-hk": { bg: "bg-red-600", text: "text-white" },
  "aia-hk": { bg: "bg-red-700", text: "text-white" },
  "manulife-hk": { bg: "bg-green-600", text: "text-white" },
  "axa-hk": { bg: "bg-blue-900", text: "text-white" },
  "fwd-hk": { bg: "bg-purple-700", text: "text-white" },
  "ping-an": { bg: "bg-orange-500", text: "text-white" },
  "china-life": { bg: "bg-red-600", text: "text-white" },
  "taikang-life": { bg: "bg-blue-800", text: "text-white" },
  "cpic-life": { bg: "bg-blue-800", text: "text-white" },
  "new-china-life": { bg: "bg-red-600", text: "text-white" },
};

// Abbreviations for fallback display
const ABBREVIATIONS: Record<string, string> = {
  "prudential-hk": "Pru",
  "aia-hk": "AIA",
  "manulife-hk": "MFC",
  "axa-hk": "AXA",
  "fwd-hk": "FWD",
  "ping-an": "PA",
  "china-life": "CL",
  "taikang-life": "TK",
  "cpic-life": "CPIC",
  "new-china-life": "NCI",
};

const SIZES = {
  sm: "w-10 h-10 text-sm",
  md: "w-14 h-14 text-base",
  lg: "w-20 h-20 text-xl",
};

export default function CompanyLogo({
  name,
  displayName,
  logoUrl,
  size = "md",
  className = "",
}: CompanyLogoProps) {
  const [imgError, setImgError] = useState(false);

  const colors = BRAND_COLORS[name] || { bg: "bg-gray-600", text: "text-white" };
  const abbreviation = ABBREVIATIONS[name] || displayName.charAt(0).toUpperCase();
  const sizeClass = SIZES[size];

  const showFallback = !logoUrl || imgError;

  return (
    <div
      className={`${sizeClass} rounded-lg overflow-hidden flex items-center justify-center shrink-0 ${className}`}
    >
      {showFallback ? (
        <div
          className={`w-full h-full flex items-center justify-center font-bold ${colors.bg} ${colors.text}`}
        >
          {abbreviation}
        </div>
      ) : (
        <img
          src={logoUrl}
          alt={`${displayName} logo`}
          className="w-full h-full object-contain bg-white"
          onError={() => setImgError(true)}
          loading="lazy"
        />
      )}
    </div>
  );
}
