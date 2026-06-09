"use client";

import { Section } from "../utils/types";

interface SectionTabsProps {
  sections: Section[];
  active: Section;
  onChange: (section: Section) => void;
}

export default function SectionTabs({
  sections,
  active,
  onChange,
}: SectionTabsProps) {
  if (sections.length === 0) return null;

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-[#27272a] px-3 py-2 sm:px-4">
      {sections.map((section) => (
        <button
          key={section}
          type="button"
          onClick={() => onChange(section)}
          className={`border px-2.5 py-1 text-xs capitalize sm:px-3 ${
            active === section
              ? "border-[#52525b] text-white"
              : "border-[#27272a] text-[#a1a1aa] hover:border-[#52525b] hover:text-white"
          }`}
        >
          {section}
        </button>
      ))}
    </div>
  );
}
