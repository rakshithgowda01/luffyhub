import { Program } from "./types";

export function exportProgramsToTxt(programs: Program[]): string {
  return programs
    .map((program, index) => {
      const sections = [
        `Program ${index + 1}`,
        `Title: ${program.title}`,
        "Code:",
        program.code,
        "Explanation:",
        program.explanation,
        "Output:",
        program.output,
      ];
      return sections.join("\n");
    })
    .join("\n\n---\n\n");
}

export function downloadTxtFile(content: string, filename = "programs.txt"): void {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
