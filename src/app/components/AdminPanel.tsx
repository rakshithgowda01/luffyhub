"use client";

import { useEffect, useRef, useState } from "react";
import {
  deleteNoteFile,
  getBucket,
  isSharedProgramKey,
  newImportantId,
  newNoteId,
  reindexPrograms,
  saveNoteFile,
} from "../utils/contentStore";
import { downloadTxtFile, exportProgramsToTxt } from "../utils/fileExport";
import { parseProgramsFromTxt } from "../utils/parser";
import { getSubjectsForSemester } from "../utils/semesterSubjects";
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  AdminEditMode,
  contentKey,
  ContentMap,
  ImportantItem,
  NoteItem,
  Program,
  SEMESTERS,
} from "../utils/types";

interface AdminPanelProps {
  content: ContentMap;
  customSubjects: Record<string, string[]>;
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onClose: () => void;
  onSave: (content: ContentMap, subjects: Record<string, string[]>) => void;
}

const emptyProgram = (): Program => ({
  id: 0,
  title: "",
  shortTitle: "",
  code: "",
  shortCode: "",
  explanation: "",
  output: "",
});

export default function AdminPanel({
  content,
  customSubjects,
  isLoggedIn,
  onLogin,
  onLogout,
  onClose,
  onSave,
}: AdminPanelProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [semester, setSemester] = useState("3rd Sem");
  const [subject, setSubject] = useState("");
  const [mode, setMode] = useState<AdminEditMode>("programs");
  const [editing, setEditing] = useState<Program | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [editingImportant, setEditingImportant] = useState<ImportantItem | null>(null);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const importRef = useRef<HTMLInputElement>(null);

  const subjects = getSubjectsForSemester(semester, customSubjects);

  const key = subject ? contentKey(semester, subject) : "";
  const bucket = key ? getBucket(content, key) : null;
  const sharedPrograms = key ? isSharedProgramKey(key) : false;

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const list = getSubjectsForSemester(semester, customSubjects);
    if (!list.includes(subject)) {
      setSubject(list[0] ?? "");
    }
  }, [semester, customSubjects, subject]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setError("");
      onLogin();
    } else {
      setError("Invalid credentials");
    }
  }

  function persist(
    nextContent: ContentMap,
    nextSubjects: Record<string, string[]> = customSubjects
  ) {
    onSave(nextContent, nextSubjects);
    setStatus("saved");
    setTimeout(() => setStatus(""), 2000);
  }

  function updatePrograms(programs: Program[]) {
    if (!key) return;
    const prev = getBucket(content, key);
    persist({
      ...content,
      [key]: { ...prev, programs: reindexPrograms(programs) },
    });
  }

  function handleSaveProgram() {
    if (!editing || !bucket) return;
    if (isNew) {
      updatePrograms([...bucket.programs, editing]);
    } else {
      updatePrograms(
        bucket.programs.map((p) => (p.id === editing.id ? editing : p))
      );
    }
    setEditing(null);
    setIsNew(false);
  }

  function handleDeleteProgram(id: number) {
    if (!bucket) return;
    updatePrograms(bucket.programs.filter((p) => p.id !== id));
  }

  function handleMoveProgram(id: number, direction: "up" | "down") {
    if (!bucket) return;
    const list = [...bucket.programs];
    const index = list.findIndex((p) => p.id === id);
    if (index === -1) return;
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;
    [list[index], list[target]] = [list[target], list[index]];
    updatePrograms(list);
  }

  async function handlePdfUpload(file: File) {
    if (!key || !bucket) return;
    if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setError("Only PDF files allowed");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("PDF must be under 8MB");
      return;
    }
    setError("");
    const id = newNoteId();
    const buffer = await file.arrayBuffer();
    await saveNoteFile(id, buffer);
    const note: NoteItem = {
      id,
      title: noteTitle.trim() || file.name.replace(/\.pdf$/i, ""),
      fileName: file.name,
      mimeType: "application/pdf",
      uploadedAt: new Date().toISOString(),
    };
    persist({
      ...content,
      [key]: { ...bucket, notes: [...bucket.notes, note] },
    });
    setNoteTitle("");
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleDeleteNote(note: NoteItem) {
    if (!key || !bucket) return;
    await deleteNoteFile(note.id);
    persist({
      ...content,
      [key]: { ...bucket, notes: bucket.notes.filter((n) => n.id !== note.id) },
    });
  }

  function handleSaveImportant() {
    if (!editingImportant || !key || !bucket) return;
    const exists = bucket.important.some((i) => i.id === editingImportant.id);
    const important = exists
      ? bucket.important.map((i) =>
          i.id === editingImportant.id ? editingImportant : i
        )
      : [...bucket.important, editingImportant];
    persist({ ...content, [key]: { ...bucket, important } });
    setEditingImportant(null);
  }

  function handleDeleteImportant(id: string) {
    if (!key || !bucket) return;
    persist({
      ...content,
      [key]: {
        ...bucket,
        important: bucket.important.filter((i) => i.id !== id),
      },
    });
  }

  function handleAddSubject() {
    const name = newSubjectName.trim();
    if (!name) return;
    const current = getSubjectsForSemester(semester, customSubjects);
    if (current.some((s) => s.toLowerCase() === name.toLowerCase())) {
      setError("Subject already exists");
      return;
    }
    setError("");
    const next = {
      ...customSubjects,
      [semester]: [...current, name],
    };
    persist(content, next);
    setNewSubjectName("");
    setSubject(name);
  }

  function handleRemoveSubject(name: string) {
    const current = getSubjectsForSemester(semester, customSubjects);
    const nextList = current.filter((s) => s !== name);
    const next = { ...customSubjects, [semester]: nextList };
    const removedKey = contentKey(semester, name);
    const { [removedKey]: _, ...rest } = content;
    persist(rest, next);
    if (subject === name) setSubject(nextList[0] ?? "");
  }

  function handleImportTxt(file: File) {
    if (!bucket) return;
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseProgramsFromTxt(String(reader.result ?? ""));
      if (parsed.length === 0) {
        setError("No programs found in file");
        return;
      }
      setError("");
      updatePrograms([...bucket.programs, ...parsed]);
    };
    reader.readAsText(file);
  }

  const modes: { id: AdminEditMode; label: string }[] = [
    { id: "programs", label: "programs" },
    { id: "notes", label: "notes PDF" },
    { id: "important", label: "important" },
    { id: "subjects", label: "subjects" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 px-3 pt-[5vh] sm:px-4 sm:pt-[8vh]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Admin panel"
    >
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-[#27272a] bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        {!isLoggedIn ? (
          <form onSubmit={handleLogin} className="p-6">
            <h2 className="mb-4 text-sm text-white">Admin Login</h2>
            <label className="mb-3 block">
              <span className="text-xs text-[#a1a1aa]">Username</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full border border-[#27272a] bg-black px-3 py-2 text-sm text-white outline-none"
              />
            </label>
            <label className="mb-3 block">
              <span className="text-xs text-[#a1a1aa]">Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full border border-[#27272a] bg-black px-3 py-2 text-sm text-white outline-none"
              />
            </label>
            {error && <p className="mb-3 text-xs text-[#a1a1aa]">{error}</p>}
            <button
              type="submit"
              className="border border-[#27272a] px-4 py-2 text-sm text-white hover:border-[#52525b]"
            >
              Login
            </button>
          </form>
        ) : editing ? (
          <div className="p-6">
            <h2 className="mb-1 text-sm text-white">
              {isNew ? "Add Program" : "Edit Program"}
            </h2>
            <p className="mb-4 text-xs text-[#52525b]">
              {semester} · {subject}
            </p>
            {(
              [
                "title",
                "shortTitle",
                "code",
                "shortCode",
                "explanation",
                "output",
              ] as const
            ).map((field) => (
              <label key={field} className="mb-3 block">
                <span className="text-xs capitalize text-[#a1a1aa]">{field}</span>
                {field === "code" ||
                field === "shortCode" ||
                field === "output" ? (
                  <textarea
                    value={editing[field]}
                    onChange={(e) =>
                      setEditing({ ...editing, [field]: e.target.value })
                    }
                    rows={field === "code" ? 10 : field === "shortCode" ? 8 : 4}
                    className="mt-1 w-full border border-[#27272a] bg-black px-3 py-2 text-sm text-white outline-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={editing[field]}
                    onChange={(e) =>
                      setEditing({ ...editing, [field]: e.target.value })
                    }
                    className="mt-1 w-full border border-[#27272a] bg-black px-3 py-2 text-sm text-white outline-none"
                  />
                )}
              </label>
            ))}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSaveProgram}
                className="border border-[#27272a] px-4 py-2 text-sm text-white hover:border-[#52525b]"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setIsNew(false);
                }}
                className="border border-[#27272a] px-4 py-2 text-sm text-[#a1a1aa] hover:border-[#52525b]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : editingImportant ? (
          <div className="p-6">
            <h2 className="mb-4 text-sm text-white">Important entry</h2>
            <label className="mb-3 block">
              <span className="text-xs text-[#a1a1aa]">title</span>
              <input
                type="text"
                value={editingImportant.title}
                onChange={(e) =>
                  setEditingImportant({
                    ...editingImportant,
                    title: e.target.value,
                  })
                }
                className="mt-1 w-full border border-[#27272a] bg-black px-3 py-2 text-sm text-white outline-none"
              />
            </label>
            <label className="mb-3 block">
              <span className="text-xs text-[#a1a1aa]">content</span>
              <textarea
                value={editingImportant.content}
                onChange={(e) =>
                  setEditingImportant({
                    ...editingImportant,
                    content: e.target.value,
                  })
                }
                rows={8}
                className="mt-1 w-full border border-[#27272a] bg-black px-3 py-2 text-sm text-white outline-none"
              />
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleSaveImportant}
                className="border border-[#27272a] px-4 py-2 text-sm text-white hover:border-[#52525b]"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingImportant(null)}
                className="border border-[#27272a] px-4 py-2 text-sm text-[#a1a1aa] hover:border-[#52525b]"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="text-sm text-white">Admin — full edit</h2>
              <div className="flex items-center gap-3">
                {status && (
                  <span className="text-xs text-[#a1a1aa]">{status}</span>
                )}
                <button
                  type="button"
                  onClick={onLogout}
                  className="text-xs text-[#a1a1aa] hover:text-white"
                >
                  Logout
                </button>
              </div>
            </div>

            <p className="mb-4 text-[10px] leading-relaxed text-[#52525b] sm:text-xs">
              Site-wide lab programs (DS, java lab) ship with the deploy so every
              device sees them. PDF notes stay on this browser unless uploaded to
              the project. Other subjects can be edited here for this device.
            </p>

            <div className="mb-4 grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs text-[#a1a1aa]">semester</span>
                <select
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="mt-1 w-full border border-[#27272a] bg-black px-3 py-2 text-sm text-white outline-none"
                >
                  {SEMESTERS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs text-[#a1a1aa]">subject</span>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={subjects.length === 0}
                  className="mt-1 w-full border border-[#27272a] bg-black px-3 py-2 text-sm text-white outline-none disabled:opacity-40"
                >
                  {subjects.length === 0 ? (
                    <option value="">no subjects — add below</option>
                  ) : (
                    subjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))
                  )}
                </select>
              </label>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
              {modes.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMode(m.id)}
                  className={`border px-3 py-1.5 text-xs ${
                    mode === m.id
                      ? "border-white text-white"
                      : "border-[#27272a] text-[#a1a1aa] hover:border-[#52525b]"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {error && <p className="mb-3 text-xs text-[#a1a1aa]">{error}</p>}

            {mode === "subjects" && (
              <div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <input
                    type="text"
                    value={newSubjectName}
                    onChange={(e) => setNewSubjectName(e.target.value)}
                    placeholder="new subject name"
                    className="min-w-[160px] flex-1 border border-[#27272a] bg-black px-3 py-1.5 text-sm text-white outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubject}
                    className="border border-[#27272a] px-3 py-1.5 text-xs text-white hover:border-[#52525b]"
                  >
                    Add subject
                  </button>
                </div>
                <ul className="space-y-2">
                  {subjects.map((s) => (
                    <li
                      key={s}
                      className="flex items-center justify-between border border-[#27272a] px-3 py-2"
                    >
                      <span className="text-sm text-[#a1a1aa]">{s}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(s)}
                        className="text-xs text-[#a1a1aa] hover:text-white"
                      >
                        remove
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {mode === "programs" && bucket && (
              <div>
                {sharedPrograms ? (
                  <p className="mb-4 text-xs text-[#a1a1aa]">
                    This subject is site-wide (synced from GitHub). Add/edit/delete
                    here won&apos;t show on other devices — send programs to update
                    the deploy.
                  </p>
                ) : null}
                <div className="mb-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={sharedPrograms}
                    onClick={() => {
                      setEditing(emptyProgram());
                      setIsNew(true);
                    }}
                    className="border border-[#27272a] px-3 py-1.5 text-xs text-white hover:border-[#52525b] disabled:opacity-40"
                  >
                    Add Program
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      downloadTxtFile(
                        exportProgramsToTxt(bucket.programs),
                        `${semester}_${subject}_programs.txt`.replace(/\s+/g, "_")
                      )
                    }
                    className="border border-[#27272a] px-3 py-1.5 text-xs text-white hover:border-[#52525b]"
                  >
                    Export .txt
                  </button>
                  <button
                    type="button"
                    disabled={sharedPrograms}
                    onClick={() => importRef.current?.click()}
                    className="border border-[#27272a] px-3 py-1.5 text-xs text-white hover:border-[#52525b] disabled:opacity-40"
                  >
                    Import .txt
                  </button>
                  <input
                    ref={importRef}
                    type="file"
                    accept=".txt,text/plain"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleImportTxt(f);
                      e.target.value = "";
                    }}
                  />
                </div>
                {bucket.programs.length === 0 ? (
                  <p className="text-xs text-[#52525b]">
                    no programs for this subject yet
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {bucket.programs.map((program, index) => (
                      <li
                        key={program.id}
                        className="flex items-center justify-between border border-[#27272a] px-3 py-2"
                      >
                        <span className="truncate text-sm text-[#a1a1aa]">
                          {index + 1}. {program.shortTitle || program.title}
                        </span>
                        <div className="flex shrink-0 gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveProgram(program.id, "up")}
                            disabled={sharedPrograms || index === 0}
                            className="px-2 text-xs text-[#a1a1aa] hover:text-white disabled:text-[#52525b]"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMoveProgram(program.id, "down")}
                            disabled={
                              sharedPrograms ||
                              index === bucket.programs.length - 1
                            }
                            className="px-2 text-xs text-[#a1a1aa] hover:text-white disabled:text-[#52525b]"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            disabled={sharedPrograms}
                            onClick={() => {
                              setEditing({ ...program });
                              setIsNew(false);
                            }}
                            className="px-2 text-xs text-[#a1a1aa] hover:text-white disabled:text-[#52525b]"
                          >
                            edit
                          </button>
                          <button
                            type="button"
                            disabled={sharedPrograms}
                            onClick={() => handleDeleteProgram(program.id)}
                            className="px-2 text-xs text-[#a1a1aa] hover:text-white disabled:text-[#52525b]"
                          >
                            del
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {mode === "notes" && bucket && (
              <div>
                <div className="mb-4 space-y-2 border border-[#27272a] p-3">
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    placeholder="note title (optional)"
                    className="w-full border border-[#27272a] bg-black px-3 py-1.5 text-sm text-white outline-none"
                  />
                  <input
                    ref={fileRef}
                    type="file"
                    accept="application/pdf,.pdf"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) void handlePdfUpload(f);
                    }}
                    className="w-full text-xs text-[#a1a1aa] file:mr-3 file:border file:border-[#27272a] file:bg-black file:px-3 file:py-1.5 file:text-xs file:text-white"
                  />
                  <p className="text-[10px] text-[#52525b]">
                    PDF up to 8MB · stored in this browser
                  </p>
                </div>
                {bucket.notes.length === 0 ? (
                  <p className="text-xs text-[#52525b]">no PDFs uploaded yet</p>
                ) : (
                  <ul className="space-y-2">
                    {bucket.notes.map((note) => (
                      <li
                        key={note.id}
                        className="flex items-center justify-between gap-2 border border-[#27272a] px-3 py-2"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm text-[#a1a1aa]">
                            {note.title}
                          </p>
                          <p className="truncate text-[10px] text-[#52525b]">
                            {note.fileName}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => void handleDeleteNote(note)}
                          className="shrink-0 text-xs text-[#a1a1aa] hover:text-white"
                        >
                          del
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {mode === "important" && bucket && (
              <div>
                <button
                  type="button"
                  onClick={() =>
                    setEditingImportant({
                      id: newImportantId(),
                      title: "",
                      content: "",
                    })
                  }
                  className="mb-4 border border-[#27272a] px-3 py-1.5 text-xs text-white hover:border-[#52525b]"
                >
                  Add important
                </button>
                {bucket.important.length === 0 ? (
                  <p className="text-xs text-[#52525b]">no important entries yet</p>
                ) : (
                  <ul className="space-y-2">
                    {bucket.important.map((item) => (
                      <li
                        key={item.id}
                        className="flex items-center justify-between border border-[#27272a] px-3 py-2"
                      >
                        <span className="truncate text-sm text-[#a1a1aa]">
                          {item.title || "(untitled)"}
                        </span>
                        <div className="flex shrink-0 gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingImportant({ ...item })}
                            className="px-2 text-xs text-[#a1a1aa] hover:text-white"
                          >
                            edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteImportant(item.id)}
                            className="px-2 text-xs text-[#a1a1aa] hover:text-white"
                          >
                            del
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {(mode === "programs" || mode === "notes" || mode === "important") &&
              !bucket && (
                <p className="text-xs text-[#52525b]">
                  pick or create a subject first
                </p>
              )}
          </div>
        )}
      </div>
    </div>
  );
}
