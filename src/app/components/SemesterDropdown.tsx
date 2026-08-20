"use client";

import { useEffect, useRef, useState } from "react";
import { SEMESTERS } from "../utils/types";

interface SemesterDropdownProps {
  selected: string;
  onSelect: (semester: string) => void;
}

export default function SemesterDropdown({ selected, onSelect }: SemesterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="border border-[#27272a] px-2 py-1 text-xs text-[#a1a1aa] hover:border-[#52525b] hover:text-white sm:px-2.5 sm:text-sm"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {selected} <span className="text-xs">⌄</span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-50 mt-1 min-w-[120px] border border-[#27272a] bg-black"
        >
          {SEMESTERS.map((sem) => (
            <li key={sem} role="option" aria-selected={sem === selected}>
              <button
                type="button"
                onClick={() => {
                  onSelect(sem);
                  setOpen(false);
                }}
                className={`block w-full px-3 py-1.5 text-left text-sm hover:bg-[#27272a] ${
                  sem === selected ? "text-white" : "text-[#a1a1aa]"
                }`}
              >
                {sem}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
