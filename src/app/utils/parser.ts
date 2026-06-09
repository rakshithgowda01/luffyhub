import { Program } from "./types";

/**
 * Parses exported .txt format back into Program objects.
 * Intended for future admin upload workflows.
 */
export function parseProgramsFromTxt(content: string): Program[] {
  const blocks = content.split(/\n---\n/);
  const programs: Program[] = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    const titleMatch = trimmed.match(/^Program \d+\s*\nTitle:\s*(.+)$/m);
    const codeMatch = trimmed.match(/Code:\s*\n([\s\S]*?)\nExplanation:/);
    const explanationMatch = trimmed.match(
      /Explanation:\s*\n([\s\S]*?)\nOutput:/
    );
    const outputMatch = trimmed.match(/Output:\s*\n([\s\S]*)$/);

    if (!titleMatch || !codeMatch || !explanationMatch || !outputMatch) {
      continue;
    }

    programs.push({
      id: programs.length + 1,
      title: titleMatch[1].trim(),
      shortTitle: titleMatch[1].trim(),
      code: codeMatch[1].trimEnd(),
      explanation: explanationMatch[1].trim(),
      output: outputMatch[1].trim(),
    });
  }

  return programs;
}
