"use client";

import { useState } from "react";
import { Program } from "../utils/types";

interface ProgramViewProps {
  program: Program;
  programIndex: number;
}

const C_KEYWORDS = new Set([
  "int", "char", "void", "float", "struct", "return", "if", "else",
  "for", "while", "do", "switch", "case", "break", "continue",
  "printf", "scanf", "fprintf", "fclose", "fopen", "malloc", "free",
  "define", "const", "static", "sizeof",
]);

function sanitizeFilename(title: string): string {
  return title.replace(/[^a-zA-Z0-9_-]/g, "_").toLowerCase() + ".c";
}

function highlightLine(line: string, lineKey: number): React.ReactNode {
  if (line.startsWith("#include")) {
    return <span className="text-[#c586c0]">{line}</span>;
  }
  if (line.trim().startsWith("//")) {
    return <span className="text-[#6a9955]">{line}</span>;
  }

  const parts = line.split(/("[^"]*"|\d+)/g);
  return parts.map((part, i) => {
    if (part.startsWith('"')) {
      return (
        <span key={`${lineKey}-${i}`} className="text-[#ce9178]">
          {part}
        </span>
      );
    }
    if (/^\d+$/.test(part)) {
      return (
        <span key={`${lineKey}-${i}`} className="text-[#b5cea8]">
          {part}
        </span>
      );
    }
    return part.split(/(\b\w+\b)/g).map((seg, j) =>
      C_KEYWORDS.has(seg) ? (
        <span key={`${lineKey}-${i}-${j}`} className="text-[#569cd6]">
          {seg}
        </span>
      ) : (
        <span key={`${lineKey}-${i}-${j}`}>{seg}</span>
      )
    );
  });
}

function CodeBlock({
  code,
  label,
  onCopy,
  copied,
}: {
  code: string;
  label: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="border border-[#27272a]">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#27272a] px-3 py-2 sm:px-4">
        <span className="text-xs text-[#a1a1aa]">{label}</span>
        <button
          type="button"
          onClick={onCopy}
          className="text-xs text-[#a1a1aa] hover:text-white"
        >
          {copied ? "copied" : "⎘ copy"}
        </button>
      </div>
      <pre className="no-scrollbar overflow-x-auto p-3 text-xs leading-relaxed text-white sm:p-4 sm:text-sm">
        <code>
          {code.split("\n").map((line, i) => (
            <div key={i}>{highlightLine(line, i)}</div>
          ))}
        </code>
      </pre>
    </div>
  );
}

export default function ProgramView({ program, programIndex }: ProgramViewProps) {
  const [copied, setCopied] = useState(false);
  const [shortCopied, setShortCopied] = useState(false);
  const filename = `program_${String(programIndex + 1).padStart(2, "0")}.c`;
  const shortFilename = `program_${String(programIndex + 1).padStart(2, "0")}_short.c`;

  function handleCopy() {
    navigator.clipboard.writeText(program.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleShortCopy() {
    navigator.clipboard.writeText(program.shortCode);
    setShortCopied(true);
    setTimeout(() => setShortCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([program.code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = sanitizeFilename(program.shortTitle);
    anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-3 py-5 sm:px-6 sm:py-8">
      <p className="text-xs text-[#a1a1aa] sm:text-sm">$ {filename}</p>
      <h2 className="mt-2 text-lg text-white sm:mt-3 sm:text-xl">
        {program.shortTitle}
      </h2>

      <section className="mt-6 sm:mt-8">
        <h3 className="mb-2 text-xs tracking-wider text-[#52525b] sm:mb-3">
          SOURCE CODE
        </h3>
        <div className="border border-[#27272a]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#27272a] px-3 py-2 sm:px-4">
            <span className="text-xs text-[#a1a1aa]">{filename}</span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs text-[#a1a1aa] hover:text-white"
              >
                {copied ? "copied" : "⎘ copy"}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="text-xs text-[#a1a1aa] hover:text-white"
              >
                ↓ download
              </button>
            </div>
          </div>
          <pre className="no-scrollbar overflow-x-auto p-3 text-xs leading-relaxed text-white sm:p-4 sm:text-sm">
            <code>
              {program.code.split("\n").map((line, i) => (
                <div key={i}>{highlightLine(line, i)}</div>
              ))}
            </code>
          </pre>
        </div>
      </section>

      <section className="mt-6 sm:mt-8">
        <h3 className="mb-2 text-xs tracking-wider text-[#52525b] sm:mb-3">
          EXPLANATION
        </h3>
        <div className="border border-[#27272a] p-3 sm:p-4">
          <p className="text-xs leading-relaxed text-[#a1a1aa] sm:text-sm">
            {program.explanation}
          </p>
        </div>
      </section>

      <section className="mt-6 sm:mt-8">
        <h3 className="mb-2 text-xs tracking-wider text-[#52525b] sm:mb-3">
          OUTPUT
        </h3>
        <div className="border border-[#27272a] p-3 sm:p-4">
          <pre className="text-xs text-[#a1a1aa] sm:text-sm">{program.output}</pre>
        </div>
      </section>

      {program.shortCode && (
        <section className="mt-6 pb-4 sm:mt-8">
          <h3 className="mb-2 text-xs tracking-wider text-[#52525b] sm:mb-3">
            SHORT VERSION
          </h3>
          <p className="mb-2 text-[10px] text-[#52525b] sm:text-xs">
            condensed cheat — same output as above
          </p>
          <CodeBlock
            code={program.shortCode}
            label={shortFilename}
            onCopy={handleShortCopy}
            copied={shortCopied}
          />
        </section>
      )}
    </div>
  );
}
