import { HubMeta } from "./defaultHubContent";
import {
  contentKey,
  ContentMap,
  emptyBucket,
  ImportantItem,
  NoteItem,
  Program,
  SubjectBucket,
} from "./types";
import { javaLabPrograms } from "./preloadedJavaLab";
import { preloadedPrograms } from "./preloadedPrograms";

const IDB_NAME = "luffyhub-notes";
const IDB_STORE = "pdfs";

export type { HubMeta };

function defaultContent(): ContentMap {
  return {
    [contentKey("2nd Sem", "data structures")]: {
      programs: preloadedPrograms,
      notes: [],
      important: [],
    },
    [contentKey("3rd Sem", "java lab")]: {
      programs: javaLabPrograms,
      notes: [],
      important: [],
    },
  };
}

export function getDefaultMeta(): HubMeta {
  return { content: defaultContent(), subjects: {} };
}

export async function fetchHubMeta(): Promise<HubMeta> {
  try {
    const res = await fetch("/api/hub-content", { cache: "no-store" });
    if (!res.ok) return getDefaultMeta();
    const data = (await res.json()) as HubMeta;
    if (!data?.content) return getDefaultMeta();
    return {
      content: { ...defaultContent(), ...data.content },
      subjects: data.subjects ?? {},
      updatedAt: data.updatedAt,
    };
  } catch {
    return getDefaultMeta();
  }
}

export async function persistHubMeta(
  meta: HubMeta,
  credentials: { username: string; password: string }
): Promise<{ ok: boolean; mode?: string; error?: string }> {
  try {
    const res = await fetch("/api/hub-content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
        meta,
      }),
    });
    const data = (await res.json()) as { ok?: boolean; mode?: string; error?: string };
    if (!res.ok) {
      return { ok: false, error: data.error || `Save failed (${res.status})` };
    }
    return { ok: true, mode: data.mode };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Save failed",
    };
  }
}

export async function uploadSharedNotePdf(
  id: string,
  file: File,
  credentials: { username: string; password: string }
): Promise<{ ok: boolean; url?: string; fileName?: string; error?: string }> {
  try {
    const form = new FormData();
    form.set("username", credentials.username);
    form.set("password", credentials.password);
    form.set("id", id);
    form.set("file", file);
    const res = await fetch("/api/hub-notes", { method: "POST", body: form });
    const data = (await res.json()) as {
      ok?: boolean;
      url?: string;
      fileName?: string;
      error?: string;
    };
    if (!res.ok) {
      return { ok: false, error: data.error || "Upload failed" };
    }
    return { ok: true, url: data.url, fileName: data.fileName };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Upload failed",
    };
  }
}

/** @deprecated local-only — prefer fetchHubMeta */
export function loadMeta(): HubMeta {
  return getDefaultMeta();
}

/** @deprecated local-only — prefer persistHubMeta */
export function saveMeta(_meta: HubMeta): void {
  // no-op: shared saves go through the API
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
