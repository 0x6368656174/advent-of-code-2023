import console from "node:console";
import { type Matrix, type MatrixCell, parseInput } from "./parse-input.js";

const input = await parseInput();

const slopesDir = new Map([
  ["n", "^"],
  ["e", ">"],
  ["s", "v"],
  ["w", "<"],
]);

function isValidRowCol(row: number, col: number): boolean {
  return row >= 0 && row < rows && col >= 0 && col < cols;
}

function getNeighbors(row: number, col: number, matrix: Matrix): MatrixCell[] {
  return [
    { dir: "n", row: row - 1, col },
    { dir: "e", row, col: col + 1 },
    { dir: "s", row: row + 1, col },
    { dir: "w", row, col: col - 1 },
  ]
    .filter((n) => isValidRowCol(n.row, n.col))
    .filter(
      (n) =>
        matrix[n.row][n.col].value === "." ||
        slopesDir.get(n.dir) === matrix[n.row][n.col].value,
    )
    .map((n) => matrix[n.row][n.col]);
}

function findLongPath(
  cell: MatrixCell,
  end: MatrixCell,
  visited: Set<MatrixCell>,
  matrix: Matrix,
): number {
  if (cell === end) {
    return 0;
  }

  let max = Number.MIN_SAFE_INTEGER;

  visited.add(cell);

  const neighbors = getNeighbors(cell.row, cell.col, matrix);
  for (const neighbor of neighbors) {
    if (visited.has(neighbor)) continue;
    max = Math.max(max, findLongPath(neighbor, end, visited, matrix));
  }

  visited.delete(cell);

  return max + 1;
}

const { rows, cols, matrix } = input;
const start = matrix[0][1];
const end = matrix[rows - 1][cols - 2];

const result = findLongPath(start, end, new Set(), matrix);

console.log(`The result is ${result}`);
