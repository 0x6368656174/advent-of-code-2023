import console from "node:console";
import { parseInputLines } from "./parse-input.js";

const lines = await parseInputLines();

function predict(line: string): number {
  const rows: number[][] = [line.split(" ").map((v) => Number(v))];

  let lastRow = rows[rows.length - 1];
  while (lastRow.some((v) => v !== 0)) {
    const nextRow: number[] = [];

    for (let i = 0; i < lastRow.length - 1; ++i) {
      nextRow.push(lastRow[i + 1] - lastRow[i]);
    }

    rows.push(nextRow);
    lastRow = nextRow;
  }

  return rows.reduce((acc, row) => acc + row[row.length - 1], 0);
}

const result = lines.reduce((acc, line) => acc + predict(line), 0);

console.log(`The result is ${result}`);
