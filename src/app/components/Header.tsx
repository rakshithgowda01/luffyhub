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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setProgramsOpen(false);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function closeMenus() {
    setProgramsOpen(false);
    setMobileMenuOpen(false);
  }

  const programsList = (
    <ul
      role="listbox"
      className="no-scrollbar border border-[#27272a] bg-black md:absolute md:right-0 md:top-full md:mt-1 md:w-72"
    >
      {programs.map((program, index) => (
        <li key={program.id} role="option">
          <button
            type="button"
            onClick={() => {
              onNavigate(index);
              closeMenus();
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
  );

  const navControls = (inMobileMenu: boolean) => (
    <>
      {showSubjectDropdown && (
        <SubjectDropdown
          subjects={subjects}
          selected={subject}
          onSelect={(sub) => {
            onSubjectChange(sub);
            if (!inMobileMenu) return;
          }}
          fullWidth={inMobileMenu}
        />
      )}

      {showProgramControls && (
        <>
          <button
            type="button"
            onClick={() => {
              onSearchOpen();
              closeMenus();
            }}
            disabled={!canBrowsePrograms}
            className={`flex items-center gap-1.5 border border-[#27272a] px-2.5 py-1 text-xs text-[#a1a1aa] hover:border-[#52525b] hover:text-white disabled:opacity-40 sm:text-sm ${
              inMobileMenu ? "w-full justify-center" : ""
            }`}
            aria-label="Search programs"
          >
            <span>⌕</span>
            <span>search</span>
          </button>

          <div className={`relative ${inMobileMenu ? "w-full" : ""}`}>
            <button
              type="button"
              onClick={() => setProgramsOpen(!programsOpen)}
              disabled={!canBrowsePrograms}
              className={`flex items-center gap-1.5 border border-[#27272a] px-2.5 py-1 text-xs text-[#a1a1aa] hover:border-[#52525b] hover:text-white disabled:opacity-40 sm:text-sm ${
                inMobileMenu ? "w-full justify-center" : ""
              }`}
              aria-expanded={programsOpen}
              aria-haspopup="listbox"
            >
              <span>☰</span>
              <span>programs</span>
              <span className="text-xs">⌄</span>
            </button>
            {programsOpen && canBrowsePrograms && programsList}
          </div>
        </>
      )}

      <button
        type="button"
        onClick={() => {
          onProfileClick();
          closeMenus();
        }}
        className={`flex items-center justify-center border border-[#27272a] text-[#a1a1aa] hover:border-[#52525b] hover:text-white ${
          inMobileMenu
            ? "h-9 w-full gap-1.5 py-1 text-xs"
            : "h-8 w-8 shrink-0 text-sm"
        }`}
        aria-label="Profile"
      >
        ☺
        {inMobileMenu && <span>profile</span>}
      </button>
    </>
  );

  return (
    <header
      ref={navRef}
      className="flex shrink-0 items-center gap-2 border-b border-[#27272a] px-3 py-2 sm:px-4 sm:py-2.5"
    >
      <div className="flex min-w-0 shrink items-center gap-1.5 text-xs text-white sm:text-sm">
        <span className="shrink-0 text-[#a1a1aa]">[—]</span>
        <span className="truncate">luffy&apos;s hub</span>
        <span className="shrink-0" aria-hidden="true">
          {skull}
        </span>
      </div>

      <SemesterDropdown selected={semester} onSelect={onSemesterChange} />

      {isAdmin && (
        <span className="hidden shrink-0 text-xs text-[#a1a1aa] sm:inline sm:text-sm">
          admin
        </span>
      )}

      {/* Desktop nav — single row, right side */}
      <div className="ml-auto hidden items-center gap-2 md:flex">
        {navControls(false)}
      </div>

      {/* Mobile nav — menu button */}
      <div className="relative ml-auto md:hidden">
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="flex h-8 w-8 items-center justify-center border border-[#27272a] text-sm text-[#a1a1aa] hover:border-[#52525b] hover:text-white"
          aria-expanded={mobileMenuOpen}
          aria-label="Open menu"
        >
          ☰
        </button>

        {mobileMenuOpen && (
          <div className="no-scrollbar absolute right-0 top-full z-50 mt-1 flex w-[min(16rem,calc(100vw-1.5rem))] flex-col gap-2 border border-[#27272a] bg-black p-2">
            {isAdmin && (
              <span className="px-1 text-xs text-[#a1a1aa]">admin</span>
            )}
            {navControls(true)}
          </div>
        )}
      </div>
    </header>
  );
}
