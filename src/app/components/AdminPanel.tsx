"use client";

import { useEffect, useState } from "react";
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  Program,
} from "../utils/types";
import { downloadTxtFile, exportProgramsToTxt } from "../utils/fileExport";

interface AdminPanelProps {
  programs: Program[];
  isLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onClose: () => void;
  onUpdatePrograms: (programs: Program[]) => void;
}

const emptyProgram = (): Program => ({
  id: 0,
  title: "",
  shortTitle: "",
  code: "",
  explanation: "",
  output: "",
});

export default function AdminPanel({
  programs,
  isLoggedIn,
  onLogin,
  onLogout,
  onClose,
  onUpdatePrograms,
}: AdminPanelProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [editing, setEditing] = useState<Program | null>(null);
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setError("");
      onLogin();
    } else {
      setError("Invalid credentials");
    }
  }

  function reindex(list: Program[]): Program[] {
    return list.map((p, i) => ({ ...p, id: i + 1 }));
  }

  function handleSave() {
    if (!editing) return;
    if (isNew) {
      onUpdatePrograms(reindex([...programs, editing]));
    } else {
      onUpdatePrograms(
        reindex(programs.map((p) => (p.id === editing.id ? editing : p)))
      );
    }
    setEditing(null);
    setIsNew(false);
  }

  function handleDelete(id: number) {
    onUpdatePrograms(reindex(programs.filter((p) => p.id !== id)));
  }

  function handleMove(id: number, direction: "up" | "down") {
    const index = programs.findIndex((p) => p.id === id);
    if (index === -1) return;
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= programs.length) return;
    const updated = [...programs];
    [updated[index], updated[target]] = [updated[target], updated[index]];
    onUpdatePrograms(reindex(updated));
  }

  function handleExport() {
    downloadTxtFile(exportProgramsToTxt(programs));
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 px-3 pt-[8vh] sm:px-4 sm:pt-[10vh]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Admin panel"
    >
      <div
        className="max-h-[85vh] w-full max-w-2xl overflow-y-auto border border-[#27272a] bg-black"
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
            <h2 className="mb-4 text-sm text-white">
              {isNew ? "Add Program" : "Edit Program"}
            </h2>
            {(["title", "shortTitle", "code", "explanation", "output"] as const).map((field) => (
              <label key={field} className="mb-3 block">
                <span className="text-xs capitalize text-[#a1a1aa]">{field}</span>
                {field === "code" || field === "output" ? (
                  <textarea
                    value={editing[field]}
                    onChange={(e) =>
                      setEditing({ ...editing, [field]: e.target.value })
                    }
                    rows={field === "code" ? 10 : 4}
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
                onClick={handleSave}
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
        ) : (
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm text-white">Admin Panel</h2>
              <button
                type="button"
                onClick={onLogout}
                className="text-xs text-[#a1a1aa] hover:text-white"
              >
                Logout
              </button>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditing(emptyProgram());
                  setIsNew(true);
                }}
                className="border border-[#27272a] px-3 py-1.5 text-xs text-white hover:border-[#52525b]"
              >
                Add Program
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="border border-[#27272a] px-3 py-1.5 text-xs text-white hover:border-[#52525b]"
              >
                Export .txt
              </button>
            </div>
            <ul className="space-y-2">
              {programs.map((program, index) => (
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
                      onClick={() => handleMove(program.id, "up")}
                      disabled={index === 0}
                      className="px-2 text-xs text-[#a1a1aa] hover:text-white disabled:text-[#52525b]"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMove(program.id, "down")}
                      disabled={index === programs.length - 1}
                      className="px-2 text-xs text-[#a1a1aa] hover:text-white disabled:text-[#52525b]"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing({ ...program });
                        setIsNew(false);
                      }}
                      className="px-2 text-xs text-[#a1a1aa] hover:text-white"
                    >
                      edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(program.id)}
                      className="px-2 text-xs text-[#a1a1aa] hover:text-white"
                    >
                      del
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
