import { javaLabPrograms } from "./preloadedJavaLab";
import { preloadedPrograms } from "./preloadedPrograms";
import {
  contentKey,
  ContentMap,
  emptyBucket,
  ImportantItem,
  NoteItem,
  Program,
  SubjectBucket,
} from "./types";

/** Bump when shared lab programs change — clears old device-only overrides. */
export const CONTENT_VERSION = 3;

const META_KEY = "luffyhub-content-v3";
const SUBJECTS_KEY = "luffyhub-subjects-v3";
const VERSION_KEY = "luffyhub-content-version";
const IDB_NAME = "luffyhub-notes";
const IDB_STORE = "pdfs";

export interface HubMeta {
  content: ContentMap;
  subjects: Record<string, string[]>;
}

/** Programs shipped in the repo — visible on every device after deploy. */
export function getSharedProgramSeeds(): Record<string, Program[]> {
  return {
    [contentKey("2nd Sem", "data structures")]: preloadedPrograms,
    [contentKey("3rd Sem", "java lab")]: javaLabPrograms,
  };
}

function defaultContent(): ContentMap {
  const content: ContentMap = {};
  for (const [key, programs] of Object.entries(getSharedProgramSeeds())) {
    content[key] = {
      programs,
      notes: [],
      important: [],
    };
  }
  return content;
}

/** Always overwrite seeded lab programs from the repo so all users see the same code. */
function applySharedProgramSeeds(content: ContentMap): ContentMap {
  const next: ContentMap = { ...content };
  for (const [key, programs] of Object.entries(getSharedProgramSeeds())) {
    const prev = next[key] ?? emptyBucket();
    next[key] = {
      ...prev,
      programs,
    };
  }
  return next;
}

export function loadMeta(): HubMeta {
  if (typeof window === "undefined") {
    return { content: defaultContent(), subjects: {} };
  }
  try {
    const storedVersion = Number(localStorage.getItem(VERSION_KEY) ?? "0");
    if (storedVersion !== CONTENT_VERSION) {
      localStorage.removeItem("luffyhub-content-v1");
      localStorage.removeItem("luffyhub-subjects-v1");
      localStorage.removeItem(META_KEY);
      localStorage.removeItem(SUBJECTS_KEY);
      localStorage.setItem(VERSION_KEY, String(CONTENT_VERSION));
      const fresh = defaultContent();
      localStorage.setItem(META_KEY, JSON.stringify(fresh));
      return { content: fresh, subjects: {} };
    }

    const raw = localStorage.getItem(META_KEY);
    const subjectsRaw = localStorage.getItem(SUBJECTS_KEY);
    const content = applySharedProgramSeeds(
      raw ? (JSON.parse(raw) as ContentMap) : defaultContent()
    );
    const subjects = subjectsRaw
      ? (JSON.parse(subjectsRaw) as Record<string, string[]>)
      : {};

    return { content, subjects };
  } catch {
    return { content: defaultContent(), subjects: {} };
  }
}

export function saveMeta(meta: HubMeta): void {
  if (typeof window === "undefined") return;
  // Keep shared lab programs locked to the deployed seed.
  const content = applySharedProgramSeeds(meta.content);
  localStorage.setItem(VERSION_KEY, String(CONTENT_VERSION));
  localStorage.setItem(META_KEY, JSON.stringify(content));
  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(meta.subjects));
}

export function isSharedProgramKey(key: string): boolean {
  return Object.prototype.hasOwnProperty.call(getSharedProgramSeeds(), key);
}

export function getBucket(content: ContentMap, key: string): SubjectBucket {
  return content[key] ?? emptyBucket();
}

export function setBucket(
  content: ContentMap,
  key: string,
  bucket: SubjectBucket
): ContentMap {
  return { ...content, [key]: bucket };
}

export function reindexPrograms(list: Program[]): Program[] {
  return list.map((p, i) => ({ ...p, id: i + 1 }));
}

function openNotesDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveNoteFile(id: string, data: ArrayBuffer): Promise<void> {
  const db = await openNotesDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).put(data, id);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function loadNoteFile(id: string): Promise<ArrayBuffer | null> {
  const db = await openNotesDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readonly");
    const req = tx.objectStore(IDB_STORE).get(id);
    req.onsuccess = () => {
      db.close();
      resolve((req.result as ArrayBuffer) ?? null);
    };
    req.onerror = () => {
      db.close();
      reject(req.error);
    };
  });
}

export async function deleteNoteFile(id: string): Promise<void> {
  const db = await openNotesDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, "readwrite");
    tx.objectStore(IDB_STORE).delete(id);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export function newNoteId(): string {
  return `note-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function newImportantId(): string {
  return `imp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export type { NoteItem, ImportantItem };
