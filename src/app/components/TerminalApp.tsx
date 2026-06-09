"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { preloadedPrograms } from "../utils/preloadedPrograms";
import {
  canShowLabPrograms,
  canShowProgramControls,
  getDefaultSection,
  getSectionsForSubject,
  getSubjectsForSemester,
  isNotesOnlySubject,
  isPendingSemester,
  LAB_PROGRAMS_SUBJECT,
} from "../utils/semesterSubjects";
import { BUSY_MESSAGE, Program, Section } from "../utils/types";
import AdminPanel from "./AdminPanel";
import BusyView from "./BusyView";
import Header from "./Header";
import ProgramView from "./ProgramView";
import SearchModal from "./SearchModal";
import SectionTabs from "./SectionTabs";

const SKULLS = ["💀", "☠️"];

export default function TerminalApp() {
  const [programs, setPrograms] = useState<Program[]>(preloadedPrograms);
  const [currentIndex, setCurrentIndex] = useState<number | null>(0);
  const [semester, setSemester] = useState("2nd Sem");
  const [subject, setSubject] = useState(LAB_PROGRAMS_SUBJECT);
  const [activeSection, setActiveSection] = useState<Section>("lab programs");
  const [skullIndex, setSkullIndex] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const pendingSemester = isPendingSemester(semester);
  const subjects = useMemo(
    () => getSubjectsForSemester(semester),
    [semester]
  );
  const availableSections = useMemo(
    () => (pendingSemester ? [] : getSectionsForSubject(subject)),
    [pendingSemester, subject]
  );

  const showProgramControls = canShowProgramControls(
    semester,
    subject,
    activeSection
  );

  const canBrowsePrograms = canShowLabPrograms(
    semester,
    subject,
    activeSection
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSkullIndex((prev) => (prev + 1) % SKULLS.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (availableSections.length > 0 && !availableSections.includes(activeSection)) {
      setActiveSection(availableSections[0]);
    }
  }, [availableSections, activeSection]);

  const navigate = useCallback(
    (index: number) => {
      if (!canBrowsePrograms) return;
      if (index >= 0 && index < programs.length) {
        setCurrentIndex(index);
      }
    },
    [canBrowsePrograms, programs.length]
  );

  const goPrev = useCallback(() => {
    if (currentIndex !== null && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const goNext = useCallback(() => {
    if (currentIndex !== null && currentIndex < programs.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, programs.length]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (!canBrowsePrograms || showSearch || showAdmin) return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [canBrowsePrograms, showSearch, showAdmin, goPrev, goNext]);

  function applyProgramState(
    sem: string,
    sub: string,
    section: Section
  ) {
    if (canShowLabPrograms(sem, sub, section)) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(null);
    }
  }

  function handleSemesterChange(sem: string) {
    setSemester(sem);

    if (isPendingSemester(sem)) {
      setSubject("");
      setCurrentIndex(null);
      return;
    }

    const semSubjects = getSubjectsForSemester(sem);
    const newSubject = semSubjects[0];
    const newSection = getDefaultSection(newSubject);

    setSubject(newSubject);
    setActiveSection(newSection);
    applyProgramState(sem, newSubject, newSection);
  }

  function handleSubjectChange(sub: string) {
    setSubject(sub);

    if (isNotesOnlySubject(sub)) {
      setActiveSection("notes");
      setCurrentIndex(null);
      return;
    }

    const sections = getSectionsForSubject(sub);
    const section = sections.includes(activeSection)
      ? activeSection
      : getDefaultSection(sub);

    setActiveSection(section);
    applyProgramState(semester, sub, section);
  }

  function handleSectionChange(section: Section) {
    setActiveSection(section);
    applyProgramState(semester, subject, section);
  }

  function renderContent() {
    if (pendingSemester || !canBrowsePrograms) {
      return <BusyView />;
    }

    if (currentIndex === null) {
      return null;
    }

    return (
      <ProgramView
        program={programs[currentIndex]}
        programIndex={currentIndex}
      />
    );
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-black font-mono text-white">
      <Header
        skull={SKULLS[skullIndex]}
        semester={semester}
        subject={subject}
        subjects={subjects}
        programs={programs}
        currentIndex={currentIndex}
        onSemesterChange={handleSemesterChange}
        onSubjectChange={handleSubjectChange}
        onNavigate={navigate}
        onSearchOpen={() => setShowSearch(true)}
        onProfileClick={() => setShowAdmin(true)}
        isAdmin={isAdmin}
        showProgramControls={showProgramControls}
        canBrowsePrograms={canBrowsePrograms}
        showSubjectDropdown={!pendingSemester}
      />

      {!pendingSemester && (
        <SectionTabs
          sections={availableSections}
          active={activeSection}
          onChange={handleSectionChange}
        />
      )}

      <main className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden">
        {renderContent()}
      </main>

      {canBrowsePrograms && currentIndex !== null && (
        <footer className="flex shrink-0 items-center justify-between gap-2 border-t border-[#27272a] bg-black px-3 py-2.5 sm:px-6 sm:py-3">
          <button
            type="button"
            onClick={goPrev}
            disabled={currentIndex <= 0}
            className="shrink-0 border border-[#27272a] px-2 py-1.5 text-xs text-[#a1a1aa] hover:border-[#52525b] hover:text-white disabled:opacity-40 sm:px-3"
          >
            ← prev
          </button>
          <span className="truncate text-center text-xs text-[#52525b]">
            <span className="hidden sm:inline">← → to navigate | </span>
            {currentIndex + 1} of {programs.length}
          </span>
          <button
            type="button"
            onClick={goNext}
            disabled={currentIndex >= programs.length - 1}
            className="shrink-0 border border-[#27272a] px-2 py-1.5 text-xs text-[#a1a1aa] hover:border-[#52525b] hover:text-white disabled:opacity-40 sm:px-3"
          >
            next →
          </button>
        </footer>
      )}

      {showSearch && canBrowsePrograms && (
        <SearchModal
          programs={programs}
          onSelect={navigate}
          onClose={() => setShowSearch(false)}
        />
      )}

      {showAdmin && (
        <AdminPanel
          programs={programs}
          isLoggedIn={isAdmin}
          onLogin={() => setIsAdmin(true)}
          onLogout={() => setIsAdmin(false)}
          onClose={() => setShowAdmin(false)}
          onUpdatePrograms={setPrograms}
        />
      )}
    </div>
  );
}
