"use client";

import { useEffect, useRef, useState } from "react";

interface SubjectDropdownProps {
  subjects: string[];
  selected: string;
  onSelect: (subject: string) => void;
  disabled?: boolean;
}

export default function SubjectDropdown({
  subjects,
  selected,
  onSelect,
  disabled = false,
}: SubjectDropdownProps) {
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

  if (subjects.length === 0) return null;

  return (
    <div ref={ref} className="relative max-w-[160px] sm:max-w-none">
      <button
        type="button"
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        className="flex max-w-full items-center gap-1 border border-[#27272a] px-2.5 py-1 text-xs text-[#a1a1aa] hover:border-[#52525b] hover:text-white disabled:opacity-40 sm:text-sm"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="truncate">{selected}</span>
        <span className="shrink-0 text-xs">⌄</span>
      </button>
      {open && !disabled && (
        <ul
          role="listbox"
          className="no-scrollbar absolute right-0 top-full z-50 mt-1 max-h-[60vh] min-w-[180px] border border-[#27272a] bg-black sm:min-w-[200px]"
        >
          {subjects.map((sub) => (
            <li key={sub} role="option" aria-selected={sub === selected}>
              <button
                type="button"
                onClick={() => {
                  onSelect(sub);
                  setOpen(false);
                }}
                className={`block w-full px-3 py-1.5 text-left text-xs hover:bg-[#27272a] sm:text-sm ${
                  sub === selected ? "text-white" : "text-[#a1a1aa]"
                }`}
              >
                {sub}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
