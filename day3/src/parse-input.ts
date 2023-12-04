import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface PartNumber {
  value: number;
  row: number;
  column: number;
  length: number;
}

function isNumeric(value: string): boolean {
  return /^-?\d+$/.test(value);
}

function parseLine(line: string, row: number): PartNumber[] {
  const result: PartNumber[] = [];

  let current = "";
  for (let i = 0; i < line.length; ++i) {
    const char = line[i];

    if (isNumeric(char)) {
      current += char;
    } else if (current !== "") {
      result.push({
        value: Number(current),
        row,
        column: i - current.length,
        length: current.length,
      });
      current = "";
    } else {
      current = "";
    }
  }

  if (current !== "") {
    result.push({
      value: Number(current),
      row,
      column: line.length - current.length,
      length: current.length,
    });
  }

  return result;
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

export async function parseInput(): Promise<PartNumber[]> {
  const input = await parseInputLines();

  return input
    .map(parseLine)
    .reduce<PartNumber[]>((acc, curr) => [...acc, ...curr], []);
}
