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

function getNeighbors(
  row: number,
  col: number,
  matrix: Matrix,
  part2 = false,
): MatrixCell[] {
  let neighbors = [
    { dir: "n", row: row - 1, col },
    { dir: "e", row, col: col + 1 },
    { dir: "s", row: row + 1, col },
    { dir: "w", row, col: col - 1 },
  ].filter((n) => isValidRowCol(n.row, n.col));

  if (part2) {
    neighbors = neighbors.filter((n) => matrix[n.row][n.col].value != "#");
  } else {
    neighbors = neighbors.filter(
      (n) =>
        matrix[n.row][n.col].value === "." ||
        slopesDir.get(n.dir) === matrix[n.row][n.col].value,
    );
  }

  return neighbors.map((n) => matrix[n.row][n.col]);
}

function keyForCell(cell: MatrixCell): string {
  return `${cell.row},${cell.col}`;
}

function keyFotTwoCells(cell1: MatrixCell, cell2: MatrixCell): string {
  return `${keyForCell(cell1)},${keyForCell(cell2)}`;
}

interface DistUntilFirstCrossing {
  dist: number;
  last: MatrixCell;
  crossing: MatrixCell;
}

function getDistUntilFirstCrossing(
  first: MatrixCell,
  second: MatrixCell,
  matrix: Matrix,
): DistUntilFirstCrossing {
  let dist = 1;
  let current = second;
  let last = first;
  while (true) {
    const neighbors = getNeighbors(
      current.row,
      current.col,
      matrix,
      true,
    ).filter((n) => n !== last);

    if (neighbors.length !== 1) {
      break;
    }

    last = current;
    current = neighbors[0];
    dist++;
  }
  return { dist, last, crossing: current };
}

type Graph = Map<string, Array<{ dist: number; dest: string }>>;

function generateGraphFromCrossing(
  first: MatrixCell,
  second: MatrixCell,
  matrix: Matrix,
): Graph {
  const queue: Array<{ first: MatrixCell; second: MatrixCell }> = [
    { first, second },
  ];
  const visited = new Set();
  const graph = new Map();

  while (queue.length > 0) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { first, second } = queue.shift()!;
    const { dist, last, crossing } = getDistUntilFirstCrossing(
      first,
      second,
      matrix,
    );

    if (!visited.has(keyFotTwoCells(first, second))) {
      if (!graph.has(keyForCell(first))) {
        graph.set(keyForCell(first), []);
      }
      if (!graph.has(keyForCell(crossing))) {
        graph.set(keyForCell(crossing), []);
      }
      graph.get(keyForCell(first)).push({ dist, dest: keyForCell(crossing) });
      graph.get(keyForCell(crossing)).push({ dist, dest: keyForCell(first) });
      visited.add(keyFotTwoCells(first, second));
    }

    getNeighbors(crossing.row, crossing.col, matrix)
      .filter((n) => n !== last)
      .forEach((second) => queue.push({ first: crossing, second }));
  }

  return graph;
}

function findLongPath(
  nodeKey: string,
  endKey: string,
  visited: Set<string>,
  graph: Graph,
): number {
  if (nodeKey === endKey) return 0;
  let max = Number.MIN_SAFE_INTEGER;

  visited.add(nodeKey);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const neighborsData = graph.get(nodeKey)!;
  for (const { dist, dest: destKey } of neighborsData) {
    if (visited.has(destKey)) {
      continue;
    }
    max = Math.max(max, findLongPath(destKey, endKey, visited, graph) + dist);
  }
  visited.delete(nodeKey);

  return max;
}

const { rows, cols, matrix } = input;
const start = matrix[0][1];
const end = matrix[rows - 1][cols - 2];

const graph = generateGraphFromCrossing(start, matrix[1][1], matrix);

const result = findLongPath(
  keyForCell(start),
  keyForCell(end),
  new Set(),
  graph,
);

console.log(`The result is ${result}`);
