import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface MatrixCell {
  row: number;
  col: number;
  value: string;
}

export type Matrix = MatrixCell[][];

export interface Input {
  rows: number;
  cols: number;
  matrix: Matrix;
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

export async function parseInput(): Promise<Input> {
  const lines = await parseInputLines();

  const input = lines.map((line) => line.split(""));

  const rows = input.length;
  const cols = input.length;
  const matrix: Input["matrix"] = Array.from({ length: rows }, () =>
    Array(cols),
  );

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const value = input[row][col];
      matrix[row][col] = { row, col, value };
    }
  }

  return { rows, cols, matrix };
}
