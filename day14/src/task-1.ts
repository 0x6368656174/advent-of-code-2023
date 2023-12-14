import console from "node:console";
import { parseInput } from "./parse-input.js";

const input = await parseInput();

function tilt(lines: string[][]): string[][] {
  const result = lines.map((line) => [...line]);

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

  return result;
}

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

const result = load(tilt(input));

console.log(`The result is ${result}`);
