import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export async function parseInputLines(): Promise<string[]> {
  const filename = fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);

  const inputContent = await readFile(
    path.join(dirname, "..", "input.txt"),
    "utf-8",
  );

  return inputContent.trim().split("\n");
}

export async function parseInput(): Promise<string[][]> {
  const lines = await parseInputLines();

  const patterns: string[][] = [[]];

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i];
    if (line.length === 0) {
      patterns.push([]);
    } else {
      patterns[patterns.length - 1].push(line);
    }
  }

  return patterns;
}
