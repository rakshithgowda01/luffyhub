export interface Program {
  id: number;
  title: string;
  shortTitle: string;
  code: string;
  shortCode: string;
  explanation: string;
  output: string;
}

export interface NoteItem {
  id: string;
  title: string;
  fileName: string;
  mimeType: string;
  uploadedAt: string;
}

export interface ImportantItem {
  id: string;
  title: string;
  content: string;
}

export interface SubjectBucket {
  programs: Program[];
  notes: NoteItem[];
  important: ImportantItem[];
}

export type ContentMap = Record<string, SubjectBucket>;

export const BUSY_MESSAGE =
  "luffy's kinda busy and its a draggggg to complete this fully so wait till its done";

export const ADMIN_USERNAME = "luffy";
export const ADMIN_PASSWORD = "luffy";

export type Section = "home" | "notes" | "lab programs" | "important";

export type AdminEditMode = "programs" | "notes" | "important" | "subjects";

export const SEMESTERS = [
  "1st Sem",
  "2nd Sem",
  "3rd Sem",
  "4th Sem",
  "5th Sem",
  "6th Sem",
] as const;

export function contentKey(semester: string, subject: string): string {
  return `${semester}::${subject}`;
}

export function emptyBucket(): SubjectBucket {
  return { programs: [], notes: [], important: [] };
}
