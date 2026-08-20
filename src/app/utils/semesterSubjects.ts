import { Section } from "./types";

export const SEMESTER_SUBJECTS: Record<string, string[]> = {
  "1st Sem": [
    "c programming",
    "FOC",
    "math",
    "EVS",
    "english",
    "kannada",
    "hindi",
  ],
  "2nd Sem": [
    "r programming",
    "data structures",
    "operating systems",
    "CMV",
    "english",
    "kannada",
    "hindi",
  ],
  "3rd Sem": [
    "DAA",
    "Java",
    "java lab",
    "shell lab",
    "DBMS",
    "cloud computing",
    "kannada",
    "english",
  ],
};

/** Semesters with no default subjects — unlock when admin adds subjects. */
export const EMPTY_SEMESTERS = ["4th Sem", "5th Sem", "6th Sem"];

export const LAB_PROGRAMS_SUBJECT = "data structures";

const NOTES_ONLY = new Set([
  "english",
  "kannada",
  "hindi",
  "cmv",
  "evs",
  "math",
  "operating systems",
  "dbms",
  "cloud computing",
  "daa",
]);

const PROGRAM_SUBJECTS = new Set([
  "c programming",
  "foc",
  "r programming",
  "data structures",
  "java",
  "java lab",
  "shell lab",
]);

export function isPendingSemester(
  semester: string,
  customSubjects?: Record<string, string[]>
): boolean {
  const subjects = getSubjectsForSemester(semester, {
    ...SEMESTER_SUBJECTS,
    ...customSubjects,
  });
  return subjects.length === 0;
}

export function getSubjectsForSemester(
  semester: string,
  customSubjects?: Record<string, string[]>
): string[] {
  if (customSubjects && Object.prototype.hasOwnProperty.call(customSubjects, semester)) {
    return customSubjects[semester];
  }
  return SEMESTER_SUBJECTS[semester] ?? [];
}

export function isNotesOnlySubject(subject: string): boolean {
  return NOTES_ONLY.has(subject.toLowerCase());
}

export function hasProgramSubject(subject: string): boolean {
  return PROGRAM_SUBJECTS.has(subject.toLowerCase());
}

export function getSectionsForSubject(
  subject: string,
  pendingSemester = false
): Section[] {
  if (pendingSemester || !subject) {
    return ["home"];
  }
  if (isNotesOnlySubject(subject)) {
    return ["home", "notes", "important"];
  }
  if (hasProgramSubject(subject)) {
    return ["home", "notes", "lab programs", "important"];
  }
  return ["home", "notes", "lab programs", "important"];
}

export function canShowProgramControls(
  _semester: string,
  subject: string,
  section: Section
): boolean {
  return Boolean(subject) && section === "lab programs";
}

/** Browse labs when this subject has at least one program. */
export function canBrowseLabPrograms(
  section: Section,
  programCount: number
): boolean {
  return section === "lab programs" && programCount > 0;
}

export function getDefaultSection(): Section {
  return "home";
}
