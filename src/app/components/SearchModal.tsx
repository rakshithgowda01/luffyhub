"use client";

import { useEffect, useRef, useState } from "react";
import { Program } from "../utils/types";

interface SearchModalProps {
  programs: Program[];
  onSelect: (index: number) => void;
  onClose: () => void;
}

export default function SearchModal({ programs, onSelect, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const results = programs.filter((p) =>
    p.shortTitle.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 px-3 pt-[12vh] sm:px-4 sm:pt-[15vh]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search programs"
    >
      <div
        className="w-full max-w-lg border border-[#27272a] bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search program titles..."
          className="w-full border-b border-[#27272a] bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-[#52525b]"
        />
        <ul className="no-scrollbar max-h-64 overflow-y-auto">
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-[#52525b]">No results found</li>
          ) : (
            results.map((program) => {
              const index = programs.findIndex((p) => p.id === program.id);
              return (
                <li key={program.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(index);
                      onClose();
                    }}
                    className="block w-full px-4 py-2 text-left text-sm text-[#a1a1aa] hover:bg-[#27272a] hover:text-white"
                  >
                    {program.shortTitle}
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
