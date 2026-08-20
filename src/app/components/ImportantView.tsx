"use client";

import { ImportantItem } from "../utils/types";

interface ImportantViewProps {
  items: ImportantItem[];
}

export default function ImportantView({ items }: ImportantViewProps) {
  if (items.length === 0) {
    return (
      <div className="flex min-h-[40vh] flex-1 flex-col items-center justify-center px-4 py-8">
        <p className="text-center text-sm text-[#52525b]">
          nothing important yet — admin can add entries
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-3 py-5 sm:px-6 sm:py-8">
      <h2 className="mb-4 text-sm tracking-wider text-[#52525b]">IMPORTANT</h2>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="border border-[#27272a] p-3 sm:p-4">
            <h3 className="mb-2 text-sm text-white">{item.title}</h3>
            <pre className="whitespace-pre-wrap text-xs leading-relaxed text-[#a1a1aa] sm:text-sm">
              {item.content}
            </pre>
          </li>
        ))}
      </ul>
    </div>
  );
}
