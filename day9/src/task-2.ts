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

  return rows
    .slice(1)
    .reduce(
      (acc, row, index) => acc + (index % 2 === 0 ? -1 : 1) * row[0],
      rows[0][0],
    );
}

const result = lines.reduce((acc, line) => acc + predict(line), 0);

console.log(`The result is ${result}`);
