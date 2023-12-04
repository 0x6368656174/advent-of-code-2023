import console from "node:console";
import { parseInput, parseInputLines, type PartNumber } from "./parse-input.js";

const lineStrings = await parseInputLines();
const lines: Array<Array<string | PartNumber>> = lineStrings.map((line) =>
  line.split(""),
);

const parts = await parseInput();
parts.forEach((part) => {
  for (let i = part.column; i < part.column + part.length; ++i) {
    lines[part.row][i] = part;
  }
});

let result = 0;

lines.forEach((line, row) => {
  line.forEach((item, column) => {
    if (item === "*") {
      const neighbors = [
        lines[row - 1][column - 1],
        lines[row - 1][column],
        lines[row - 1][column + 1],
        lines[row][column - 1],
        lines[row][column + 1],
        lines[row + 1][column - 1],
        lines[row + 1][column],
        lines[row + 1][column + 1],
      ].filter((item: string | PartNumber | undefined): item is PartNumber => {
        return item !== undefined && typeof item !== "string";
      });

      const gearParts = new Set<PartNumber>(neighbors);
      if (gearParts.size === 2) {
        result += [...gearParts.values()].reduce(
          (acc, curr) => acc * curr.value,
          1,
        );
      }
    }
  });
});

console.log(`The result is ${result}`);
