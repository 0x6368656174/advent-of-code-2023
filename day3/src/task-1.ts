import console from "node:console";
import { parseInput, parseInputLines, type PartNumber } from "./parse-input.js";

const lines = await parseInputLines();
const parts = await parseInput();

function isPartValid(part: PartNumber): boolean {
  const partLine = lines[part.row];

  // left
  if (part.column > 0) {
    if (partLine[part.column - 1] !== ".") {
      return true;
    }
  }

  // right
  if (part.column + part.length < partLine.length - 1) {
    if (partLine[part.column + part.length] !== ".") {
      return true;
    }
  }

  // top
  if (part.row > 0) {
    const topLine = lines[part.row - 1];
    const partTop = topLine.slice(
      Math.max(part.column - 1, 0),
      part.column + part.length + 1,
    );
    if (partTop.split("").some((char) => char !== ".")) {
      return true;
    }
  }

  // bottom
  if (part.row < lines.length - 1) {
    const bottomLine = lines[part.row + 1];
    const partBottom = bottomLine.slice(
      Math.max(part.column - 1, 0),
      part.column + part.length + 1,
    );
    if (partBottom.split("").some((char) => char !== ".")) {
      return true;
    }
  }

  return false;
}

const result = parts
  .filter(isPartValid)
  .reduce((acc, part) => acc + part.value, 0);

console.log(`The result is ${result}`);
