import console from "node:console";
import { parseInput } from "./parse-input.js";

const input = await parseInput();

function rotateArray(lines: string[]): string[] {
  const rotatedLines: string[][] = [];
  for (let column = 0; column < lines[0].length; ++column) {
    rotatedLines.push([]);
  }
  lines.forEach((line, row) => {
    for (let column = 0; column < line.length; ++column) {
      rotatedLines[column][row] = line[column];
    }
  });

  return rotatedLines.map((line) => line.join(""));
}

function findHorizontalMirrors(
  lines: string[],
  skippedValue: number = -1,
): number {
  for (let i = 0; i < lines.length - 1; ++i) {
    let start = i;
    let end = i + 1;

    while (lines[start] === lines[end]) {
      if ((start === 0 || end === lines.length - 1) && i + 1 !== skippedValue) {
        return i + 1;
      }

      start--;
      end++;
    }
  }

  return 0;
}

function replaceAt(str: string, index: number, replacement: string): string {
  return (
    str.substring(0, index) +
    replacement +
    str.substring(index + replacement.length)
  );
}

function findDifferentMirror(lines: string[]): number {
  const oldValue = findHorizontalMirrors(lines);

  for (let i = 0; i < lines.length; ++i) {
    for (let j = 0; j < lines[0].length; ++j) {
      lines[i] = replaceAt(lines[i], j, lines[i][j] === "." ? "#" : ".");
      const newValue = findHorizontalMirrors(
        lines,
        oldValue === 0 ? -1 : oldValue,
      );
      lines[i] = replaceAt(lines[i], j, lines[i][j] === "." ? "#" : ".");

      if (newValue !== 0 && oldValue !== newValue) {
        return newValue;
      }
    }
  }

  return 0;
}

function findMirrors(lines: string[]): number {
  return (
    findDifferentMirror(lines) * 100 + findDifferentMirror(rotateArray(lines))
  );
}

const result = input.reduce((acc, curr) => acc + findMirrors(curr), 0);

console.log(`The result is ${result}`);
