import console from "node:console";
import { parseInput } from "./parse-input.js";

const input = await parseInput();

const moves: Array<Array<Array<"R" | "L" | "T" | "B">>> = input.map((line) =>
  line.map(() => []),
);
function moveBeam(
  row: number,
  column: number,
  direction: "R" | "L" | "T" | "B",
): void {
  const cell = (input[row] ?? [])[column];
  if (cell === undefined) {
    return;
  }

  if (((moves[row] ?? [])[column] ?? []).includes(direction)) {
    return;
  }

  if (moves[row] === undefined) {
    moves[row] = [];
  }
  if (moves[row][column] === undefined) {
    moves[row][column] = [];
  }
  moves[row][column].push(direction);

  switch (cell) {
    case ".":
      switch (direction) {
        case "R":
          moveBeam(row, column + 1, "R");
          break;
        case "L":
          moveBeam(row, column - 1, "L");
          break;
        case "T":
          moveBeam(row - 1, column, "T");
          break;
        case "B":
          moveBeam(row + 1, column, "B");
          break;
      }
      break;
    case "\\":
      switch (direction) {
        case "R":
          moveBeam(row + 1, column, "B");
          break;
        case "L":
          moveBeam(row - 1, column, "T");
          break;
        case "T":
          moveBeam(row, column - 1, "L");
          break;
        case "B":
          moveBeam(row, column + 1, "R");
          break;
      }
      break;
    case "/":
      switch (direction) {
        case "R":
          moveBeam(row - 1, column, "T");
          break;
        case "L":
          moveBeam(row + 1, column, "B");
          break;
        case "T":
          moveBeam(row, column + 1, "R");
          break;
        case "B":
          moveBeam(row, column - 1, "L");
          break;
      }
      break;
    case "-":
      switch (direction) {
        case "R":
          moveBeam(row, column + 1, "R");
          break;
        case "L":
          moveBeam(row, column - 1, "L");
          break;
        case "T": {
          moveBeam(row, column + 1, "R");
          moveBeam(row, column - 1, "L");
          break;
        }
        case "B": {
          moveBeam(row, column + 1, "R");
          moveBeam(row, column - 1, "L");
          break;
        }
      }
      break;
    case "|":
      switch (direction) {
        case "R": {
          moveBeam(row + 1, column, "B");
          moveBeam(row - 1, column, "T");
          break;
        }
        case "L": {
          moveBeam(row + 1, column, "B");
          moveBeam(row - 1, column, "T");
          break;
        }
        case "T":
          moveBeam(row - 1, column, "T");
          break;
        case "B":
          moveBeam(row + 1, column, "B");
          break;
      }
      break;
  }
}

moveBeam(0, 0, "R");

const visited = moves.map((line) =>
  line.map((cell) => (cell.length > 0 ? 1 : 0)),
);

const result = visited.reduce(
  (acc, curr) => acc + curr.reduce<number>((acc1, curr1) => acc1 + curr1, 0),
  0,
);

console.log(`The result is ${result}`);
