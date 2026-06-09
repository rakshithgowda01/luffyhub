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
};

export const PENDING_SEMESTERS = ["3rd Sem", "4th Sem", "5th Sem", "6th Sem"];

export const LAB_PROGRAMS_SUBJECT = "data structures";

const NOTES_ONLY = new Set([
  "english",
  "kannada",
  "hindi",
  "cmv",
  "evs",
  "math",
  "operating systems",
]);

const PROGRAM_SUBJECTS = new Set([
  "c programming",
  "foc",
  "r programming",
  "data structures",
]);

export function isPendingSemester(semester: string): boolean {
  return PENDING_SEMESTERS.includes(semester);
}

export function getSubjectsForSemester(semester: string): string[] {
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
  if (pendingSemester) {
    return ["home"];
  }
  if (isNotesOnlySubject(subject)) {
    return ["home", "notes"];
  }
  if (hasProgramSubject(subject)) {
    return ["home", "notes", "lab programs", "important"];
  }
  return ["home", "notes", "important"];
}

export function canShowProgramControls(
  semester: string,
  subject: string,
  section: Section
): boolean {
  return (
    !isPendingSemester(semester) &&
    hasProgramSubject(subject) &&
    section === "lab programs"
  );
}

export function canShowLabPrograms(
  semester: string,
  subject: string,
  section: Section
): boolean {
  return (
    semester === "2nd Sem" &&
    subject.toLowerCase() === LAB_PROGRAMS_SUBJECT &&
    section === "lab programs"
  );
}

export function getDefaultSection(): Section {
  return "home";
}
