import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface Brick {
  start: [number, number, number];
  end: [number, number, number];
}

export async function parseInputLines(): Promise<string[]> {
  const filename = fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);

  const inputContent = await readFile(
    path.join(dirname, "..", "input.txt"),
    "utf-8",
  );

  return inputContent.trim().split("\n");
}

export async function parseInput(): Promise<Brick[]> {
  const lines = await parseInputLines();

  return lines.map((line) => {
    const [start, end] = line.split("~");

    return {
      start: start.split(",").map(Number) as [number, number, number],
      end: end.split(",").map(Number) as [number, number, number],
    };
  });
}
