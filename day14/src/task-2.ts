import console from "node:console";
import { parseInput } from "./parse-input.js";

const input = await parseInput();

function tilt(lines: string[][]): string[][] {
  const result = lines.map((line) => [...line]);

  // North
  for (let column = 0; column < result[0].length; ++column) {
    for (let row = 0; row < result.length; ++row) {
      if (result[row][column] === ".") {
        let nextRow = row + 1;
        while (nextRow < result.length) {
          if (result[nextRow][column] === "#") {
            break;
          } else if (result[nextRow][column] === "O") {
            result[row][column] = "O";
            result[nextRow][column] = ".";
            break;
          }

          nextRow++;
        }
      }
    }
  }

  // West
  for (let row = 0; row < result.length; ++row) {
    for (let column = 0; column < result[0].length; ++column) {
      if (result[row][column] === ".") {
        let nextColumn = column + 1;
        while (nextColumn < result[0].length) {
          if (result[row][nextColumn] === "#") {
            break;
          } else if (result[row][nextColumn] === "O") {
            result[row][column] = "O";
            result[row][nextColumn] = ".";
            break;
          }

          nextColumn++;
        }
      }
    }
  }

  // South
  for (let column = 0; column < result[0].length; ++column) {
    for (let row = result.length - 1; row > -1; --row) {
      if (result[row][column] === ".") {
        let nextRow = row - 1;
        while (nextRow > -1) {
          if (result[nextRow][column] === "#") {
            break;
          } else if (result[nextRow][column] === "O") {
            result[row][column] = "O";
            result[nextRow][column] = ".";
            break;
          }

          nextRow--;
        }
      }
    }
  }

  // East
  for (let row = 0; row < result.length; ++row) {
    for (let column = result[0].length - 1; column > -1; --column) {
      if (result[row][column] === ".") {
        let nextColumn = column - 1;
        while (nextColumn > -1) {
          if (result[row][nextColumn] === "#") {
            break;
          } else if (result[row][nextColumn] === "O") {
            result[row][column] = "O";
            result[row][nextColumn] = ".";
            break;
          }

          nextColumn--;
        }
      }
    }
  }

  return result;
}

const TOTAL_ROTATION = 1000000000;

let skipped = 0;
let repeats: Array<{ key: string; result: string[][] }> = [];

let rotated = input;
for (let i = 0; i < TOTAL_ROTATION; ++i) {
  const key = JSON.stringify(rotated);
  const currentResultIndex = repeats.findIndex((r) => r.key === key);
  if (currentResultIndex !== -1) {
    repeats = repeats.splice(currentResultIndex);
    skipped = currentResultIndex;
    break;
  } else {
    rotated = tilt(rotated);
    repeats.push({
      key,
      result: rotated,
    });
  }
}

const finalNumber = (TOTAL_ROTATION - skipped - 1) % repeats.length;
const final = repeats[finalNumber].result;

function load(lines: string[][]): number {
  let result = 0;
  for (let row = 0; row < lines.length; ++row) {
    for (let column = 0; column < lines[0].length; ++column) {
      if (lines[row][column] === "O") {
        result += lines.length - row;
      }
    }
  }

  return result;
}

const result = load(final);

console.log(`The result is ${result}`);
