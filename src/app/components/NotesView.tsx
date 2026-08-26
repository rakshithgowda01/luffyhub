"use client";

import { useState } from "react";
import { loadNoteFile } from "../utils/contentStore";
import { NoteItem } from "../utils/types";

interface NotesViewProps {
  notes: NoteItem[];
}

export default function NotesView({ notes }: NotesViewProps) {
  const [error, setError] = useState("");
  const [opening, setOpening] = useState<string | null>(null);

  async function openNote(note: NoteItem) {
    setError("");
    setOpening(note.id);
    try {
      if (note.url) {
        window.open(note.url, "_blank", "noopener,noreferrer");
        return;
      }
      const data = await loadNoteFile(note.id);
      if (!data) {
        setError(`File missing for "${note.title}". Re-upload from admin.`);
        return;
      }
      const blob = new Blob([data], { type: note.mimeType || "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      setError("Could not open file.");
    } finally {
      setOpening(null);
    }
  }

  if (notes.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-1 flex-col items-center justify-center px-4 py-8">
        <p className="text-center text-sm text-[#52525b]">
          no notes yet — admin can upload PDFs
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-3 py-5 sm:px-6 sm:py-8">
      <h2 className="mb-4 text-sm tracking-wider text-[#52525b]">NOTES</h2>
      {error && <p className="mb-3 text-xs text-[#a1a1aa]">{error}</p>}
      <ul className="space-y-2">
        {notes.map((note) => (
          <li key={note.id}>
            <button
              type="button"
              onClick={() => openNote(note)}
              disabled={opening === note.id}
              className="flex w-full items-center justify-between gap-3 border border-[#27272a] px-3 py-3 text-left hover:border-[#52525b] disabled:opacity-50 sm:px-4"
            >
              <div className="min-w-0">
                <p className="truncate text-sm text-white">{note.title}</p>
                <p className="truncate text-xs text-[#52525b]">{note.fileName}</p>
              </div>
              <span className="shrink-0 text-xs text-[#a1a1aa]">
                {opening === note.id ? "…" : "open →"}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
