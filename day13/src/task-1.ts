import console from "node:console";
import { parseInput } from "./parse-input.js";

const input = await parseInput();

function findVerticalMirrors(lines: string[]): number {
  const rotatedLines: string[][] = [];
  for (let column = 0; column < lines[0].length; ++column) {
    rotatedLines.push([]);
  }
  lines.forEach((line, row) => {
    for (let column = 0; column < line.length; ++column) {
      rotatedLines[column][row] = line[column];
    }
  });

  return findHorizontalMirrors(rotatedLines.map((line) => line.join("")));
}

function findHorizontalMirrors(lines: string[]): number {
  for (let i = 0; i < lines.length - 1; ++i) {
    let start = i;
    let end = i + 1;

    while (lines[start] === lines[end]) {
      if (start === 0 || end === lines.length - 1) {
        return i + 1;
      }

      start--;
      end++;
    }
  }

  return 0;
}

function findMirrors(lines: string[]): number {
  return findVerticalMirrors(lines) + 100 * findHorizontalMirrors(lines);
}

const result = input.reduce((acc, curr) => acc + findMirrors(curr), 0);

console.log(`The result is ${result}`);
