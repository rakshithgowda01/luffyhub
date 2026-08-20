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

const META_KEY = "luffyhub-content-v1";
const SUBJECTS_KEY = "luffyhub-subjects-v1";
const IDB_NAME = "luffyhub-notes";
const IDB_STORE = "pdfs";

export interface HubMeta {
  content: ContentMap;
  subjects: Record<string, string[]>;
}

function defaultContent(): ContentMap {
  const key = contentKey("2nd Sem", "data structures");
  return {
    [key]: {
      programs: preloadedPrograms,
      notes: [],
      important: [],
    },
  };
}

export function loadMeta(): HubMeta {
  if (typeof window === "undefined") {
    return { content: defaultContent(), subjects: {} };
  }
  try {
    const raw = localStorage.getItem(META_KEY);
    const subjectsRaw = localStorage.getItem(SUBJECTS_KEY);
    const content = raw ? (JSON.parse(raw) as ContentMap) : defaultContent();
    const subjects = subjectsRaw
      ? (JSON.parse(subjectsRaw) as Record<string, string[]>)
      : {};

    // Ensure DS seed exists if never customized
    const dsKey = contentKey("2nd Sem", "data structures");
    if (!content[dsKey]) {
      content[dsKey] = {
        programs: preloadedPrograms,
        notes: [],
        important: [],
      };
    }
    return { content, subjects };
  } catch {
    return { content: defaultContent(), subjects: {} };
  }
}

export function saveMeta(meta: HubMeta): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(META_KEY, JSON.stringify(meta.content));
  localStorage.setItem(SUBJECTS_KEY, JSON.stringify(meta.subjects));
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
