"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchHubMeta,
  getBucket,
  persistHubMeta,
} from "../utils/contentStore";
import {
  canBrowseLabPrograms,
  canShowProgramControls,
  getDefaultSection,
  getSectionsForSubject,
  getSubjectsForSemester,
  isNotesOnlySubject,
  isPendingSemester,
} from "../utils/semesterSubjects";
import {
  contentKey,
  ContentMap,
  Program,
  Section,
} from "../utils/types";
import AdminPanel from "./AdminPanel";
import BusyView from "./BusyView";
import Header from "./Header";
import HomePage from "./HomePage";
import ImportantView from "./ImportantView";
import NotesView from "./NotesView";
import ProgramView from "./ProgramView";
import SearchModal from "./SearchModal";
import SectionTabs from "./SectionTabs";

const SKULLS = ["💀", "☠️"];

export default function TerminalApp() {
  const [content, setContent] = useState<ContentMap>({});
  const [customSubjects, setCustomSubjects] = useState<
    Record<string, string[]>
  >({});
  const [hydrated, setHydrated] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [semester, setSemester] = useState("3rd Sem");
  const [subject, setSubject] = useState("java lab");
  const [activeSection, setActiveSection] = useState<Section>("home");
  const [skullIndex, setSkullIndex] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const meta = await fetchHubMeta();
      if (cancelled) return;
      setContent(meta.content);
      setCustomSubjects(meta.subjects);
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const pendingSemester = isPendingSemester(semester, customSubjects);
  const subjects = useMemo(
    () => getSubjectsForSemester(semester, customSubjects),
    [semester, customSubjects]
  );

  const availableSections = useMemo(
    () => getSectionsForSubject(subject, pendingSemester),
    [pendingSemester, subject]
  );

  const bucketKey = subject ? contentKey(semester, subject) : "";
  const bucket = useMemo(
    () => (bucketKey ? getBucket(content, bucketKey) : null),
    [content, bucketKey]
  );

  const programs: Program[] = bucket?.programs ?? [];

  const showProgramControls = canShowProgramControls(
    semester,
    subject,
    activeSection
  );

  const canBrowsePrograms = canBrowseLabPrograms(
    activeSection,
    programs.length
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSkullIndex((prev) => (prev + 1) % SKULLS.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (
      availableSections.length > 0 &&
      !availableSections.includes(activeSection)
    ) {
      setActiveSection(availableSections[0]);
    }
  }, [availableSections, activeSection]);

  useEffect(() => {
    if (!hydrated) return;
    if (activeSection === "lab programs" && programs.length > 0) {
      setCurrentIndex((prev) =>
        prev !== null && prev < programs.length ? prev : 0
      );
    } else if (activeSection === "lab programs" && programs.length === 0) {
      setCurrentIndex(null);
    }
  }, [hydrated, activeSection, programs.length, semester, subject]);

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

  function applyProgramState(section: Section, programCount: number) {
    if (section === "home") {
      setCurrentIndex(null);
      return;
    }
    if (section === "lab programs" && programCount > 0) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(null);
    }
  }

  function handleSemesterChange(sem: string) {
    setSemester(sem);

    const semSubjects = getSubjectsForSemester(sem, customSubjects);

    if (semSubjects.length === 0) {
      setSubject("");
      setActiveSection("home");
      setCurrentIndex(null);
      return;
    }

    const newSubject = semSubjects[0];
    const newSection = getDefaultSection();
    const nextPrograms = getBucket(
      content,
      contentKey(sem, newSubject)
    ).programs.length;

    setSubject(newSubject);
    setActiveSection(newSection);
    applyProgramState(newSection, nextPrograms);
  }

  function handleSubjectChange(sub: string) {
    setSubject(sub);

    if (isNotesOnlySubject(sub)) {
      const sections = getSectionsForSubject(sub);
      const section = sections.includes(activeSection)
        ? activeSection
        : getDefaultSection();
      setActiveSection(section);
      applyProgramState(
        section,
        getBucket(content, contentKey(semester, sub)).programs.length
      );
      return;
    }

    const sections = getSectionsForSubject(sub);
    const section = sections.includes(activeSection)
      ? activeSection
      : getDefaultSection();

    setActiveSection(section);
    applyProgramState(
      section,
      getBucket(content, contentKey(semester, sub)).programs.length
    );
  }

  function handleSectionChange(section: Section) {
    setActiveSection(section);
    applyProgramState(section, programs.length);
  }

  function goHome() {
    setActiveSection("home");
    setCurrentIndex(null);
  }

  async function handleAdminSave(
    nextContent: ContentMap,
    nextSubjects: Record<string, string[]>,
    credentials: { username: string; password: string }
  ) {
    const result = await persistHubMeta(
      { content: nextContent, subjects: nextSubjects },
      credentials
    );
    if (result.ok) {
      setContent(nextContent);
      setCustomSubjects(nextSubjects);
    }
    return result;
  }

  function renderContent() {
    if (!hydrated) {
      return (
        <div className="flex flex-1 items-center justify-center text-xs text-[#52525b]">
          loading…
        </div>
      );
    }

    if (activeSection === "home") {
      return <HomePage />;
    }

    if (pendingSemester && subjects.length === 0) {
      return <BusyView />;
    }

    if (activeSection === "notes") {
      return <NotesView notes={bucket?.notes ?? []} />;
    }

    if (activeSection === "important") {
      return <ImportantView items={bucket?.important ?? []} />;
    }

    if (activeSection === "lab programs") {
      if (programs.length === 0) {
        return (
          <div className="flex min-h-[40vh] flex-1 flex-col items-center justify-center px-4 py-8">
            <p className="text-center text-sm text-[#52525b]">
              no programs yet — admin can add them for this subject
            </p>
          </div>
        );
      }
      if (currentIndex === null) return null;
      return (
        <ProgramView
          program={programs[currentIndex]}
          programIndex={currentIndex}
        />
      );
    }

    return <BusyView />;
  }

  const showSubjectDropdown =
    !pendingSemester || subjects.length > 0;

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
        onLogoClick={goHome}
        isAdmin={isAdmin}
        showProgramControls={showProgramControls}
        canBrowsePrograms={canBrowsePrograms}
        showSubjectDropdown={showSubjectDropdown}
      />

      <SectionTabs
        sections={availableSections}
        active={activeSection}
        onChange={handleSectionChange}
      />

      <main className="no-scrollbar flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
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
          content={content}
          customSubjects={customSubjects}
          isLoggedIn={isAdmin}
          onLogin={() => setIsAdmin(true)}
          onLogout={() => setIsAdmin(false)}
          onClose={() => setShowAdmin(false)}
          onSave={handleAdminSave}
        />
      )}
    </div>
  );
}
