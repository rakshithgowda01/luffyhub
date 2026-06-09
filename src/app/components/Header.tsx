"use client";

import { useEffect, useRef, useState } from "react";
import { Program } from "../utils/types";
import SemesterDropdown from "./SemesterDropdown";
import SubjectDropdown from "./SubjectDropdown";

interface HeaderProps {
  skull: string;
  semester: string;
  subject: string;
  subjects: string[];
  programs: Program[];
  currentIndex: number | null;
  onSemesterChange: (sem: string) => void;
  onSubjectChange: (sub: string) => void;
  onNavigate: (index: number) => void;
  onSearchOpen: () => void;
  onProfileClick: () => void;
  isAdmin: boolean;
  showProgramControls: boolean;
  canBrowsePrograms: boolean;
  showSubjectDropdown: boolean;
}

export default function Header({
  skull,
  semester,
  subject,
  subjects,
  programs,
  currentIndex,
  onSemesterChange,
  onSubjectChange,
  onNavigate,
  onSearchOpen,
  onProfileClick,
  isAdmin,
  showProgramControls,
  canBrowsePrograms,
  showSubjectDropdown,
}: HeaderProps) {
  const [programsOpen, setProgramsOpen] = useState(false);
  const programsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (programsRef.current && !programsRef.current.contains(e.target as Node)) {
        setProgramsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="shrink-0 border-b border-[#27272a]">
      <div className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5">
        <div className="flex min-w-0 items-center gap-1.5 text-xs text-white sm:text-sm">
          <span className="shrink-0 text-[#a1a1aa]">[—]</span>
          <span className="truncate">luffy&apos;s hub</span>
          <span className="shrink-0" aria-hidden="true">
            {skull}
          </span>
        </div>

        <SemesterDropdown selected={semester} onSelect={onSemesterChange} />

        {isAdmin && (
          <span className="shrink-0 text-xs text-[#a1a1aa] sm:text-sm">admin</span>
        )}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-1.5 border-t border-[#27272a] px-3 py-2 sm:gap-2 sm:px-4">
        {showSubjectDropdown && (
          <SubjectDropdown
            subjects={subjects}
            selected={subject}
            onSelect={onSubjectChange}
          />
        )}

        {showProgramControls && (
          <>
            <button
              type="button"
              onClick={onSearchOpen}
              disabled={!canBrowsePrograms}
              className="flex items-center gap-1 border border-[#27272a] px-2 py-1 text-xs text-[#a1a1aa] hover:border-[#52525b] hover:text-white disabled:opacity-40 sm:px-2.5 sm:text-sm"
              aria-label="Search programs"
            >
              <span>⌕</span>
              <span>search</span>
            </button>

            <div ref={programsRef} className="relative">
              <button
                type="button"
                onClick={() => setProgramsOpen(!programsOpen)}
                disabled={!canBrowsePrograms}
                className="flex items-center gap-1 border border-[#27272a] px-2 py-1 text-xs text-[#a1a1aa] hover:border-[#52525b] hover:text-white disabled:opacity-40 sm:px-2.5 sm:text-sm"
                aria-expanded={programsOpen}
                aria-haspopup="listbox"
              >
                <span>☰</span>
                <span>programs</span>
                <span className="text-xs">⌄</span>
              </button>
              {programsOpen && canBrowsePrograms && (
                <ul
                  role="listbox"
                  className="no-scrollbar absolute right-0 top-full z-50 mt-1 w-[min(18rem,calc(100vw-1.5rem))] border border-[#27272a] bg-black"
                >
                  {programs.map((program, index) => (
                    <li key={program.id} role="option">
                      <button
                        type="button"
                        onClick={() => {
                          onNavigate(index);
                          setProgramsOpen(false);
                        }}
                        className={`block w-full px-3 py-1.5 text-left text-xs hover:bg-[#27272a] ${
                          index === currentIndex ? "text-white" : "text-[#a1a1aa]"
                        }`}
                      >
                        {index + 1}. {program.shortTitle}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}

        <button
          type="button"
          onClick={onProfileClick}
          className="flex h-7 w-7 shrink-0 items-center justify-center border border-[#27272a] text-xs text-[#a1a1aa] hover:border-[#52525b] hover:text-white sm:h-8 sm:w-8 sm:text-sm"
          aria-label="Profile"
        >
          ☺
        </button>
      </div>
    </header>
  );
}
