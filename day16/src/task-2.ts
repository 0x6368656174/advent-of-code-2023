import console from "node:console";
import { parseInput } from "./parse-input.js";

const input = await parseInput();

function calculateEnergized(
  row: number,
  column: number,
  direction: "R" | "L" | "T" | "B",
): number {
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

  moveBeam(row, column, direction);

  return moves.reduce(
    (acc, curr) =>
      acc +
      curr.reduce<number>(
        (acc1, curr1) => acc1 + (curr1.length > 0 ? 1 : 0),
        0,
      ),
    0,
  );
}

let result = 0;

for (let i = 0; i < input[0].length; ++i) {
  result = Math.max(calculateEnergized(0, i, "B"), result);
  result = Math.max(calculateEnergized(input.length - 1, i, "T"), result);
}

for (let i = 0; i < input.length; ++i) {
  result = Math.max(calculateEnergized(i, 0, "R"), result);
  result = Math.max(calculateEnergized(i, input[0].length - 1, "L"), result);
}

console.log(`The result is ${result}`);
