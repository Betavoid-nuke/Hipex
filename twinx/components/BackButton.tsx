"use client";

import { ArrowLeft } from "lucide-react";

type BackButtonProps = {
  label?: string;
  fallbackUrl?: string;
  className?: string;
};

export default function BackButton({
  label = "Back",
  fallbackUrl = "/",
  className = "",
}: BackButtonProps) {
  const goBack = () => {
    if (typeof window !== "undefined") {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = fallbackUrl;
      }
    }
  };

  return (
    <button
      onClick={goBack}
      className={`flex items-center text-indigo-400 hover:text-indigo-300 transition-colors rounded-lg px-3 py-2 ${className}`}
      style={{ background: "transparent", border: "none" }}
    >
      <ArrowLeft size={18} className="mr-2" />
      {label}
    </button>
  );
}
