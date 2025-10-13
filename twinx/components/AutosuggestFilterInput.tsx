"use client";

import React, { FC, JSX, useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";

interface AutosuggestFilterInputProps {
  icon: JSX.Element;
  label: string;
  suggestions: string[];
  value: string;
  onChange: (value: string) => void;
}

const AutosuggestFilterInput: FC<AutosuggestFilterInputProps> = ({
  icon,
  label,
  suggestions,
  value,
  onChange,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter suggestions based on input
  const filteredSuggestions = useMemo(() => {
    if (!value) return suggestions.slice(0, 10);
    const lowerValue = value.toLowerCase();
    return suggestions
      .filter((s) => s.toLowerCase().includes(lowerValue))
      .slice(0, 10);
  }, [value, suggestions]);

  // Handle selection from suggestion list
  const handleSelectSuggestion = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mb-4 relative autosuggest-container" ref={containerRef}>
      {/* Label with icon */}
      <label className="text-sm font-semibold text-[#A0A0A5] flex items-center gap-2 mb-2">
        {icon} {label}
      </label>

      {/* Input box */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder={`Type a ${label.toLowerCase()}...`}
          className="w-full bg-[#1C1C1E] border border-[#3A3A3C] text-white p-2 focus:outline-none focus:ring-1 focus:ring-[#6366F1] rounded-none placeholder:text-[#6B7280]"
        />

        {/* Clear input button */}
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A0A0A5] hover:text-white transition"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute left-0 right-0 mt-1 z-10 bg-[#2C2C2E] border border-[#3A3A3C] rounded-none shadow-lg max-h-40 overflow-y-auto" style={{backgroundColor:'#171718'}}>
          {filteredSuggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSelectSuggestion(suggestion)}
              className="px-3 py-2 text-sm text-white hover:bg-[#6366F1] cursor-pointer transition"
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutosuggestFilterInput;
