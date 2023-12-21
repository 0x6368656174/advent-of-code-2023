import console from "node:console";
import { parseInput } from "./parse-input.js";

const input = await parseInput();

const grid: boolean[][] = [];

const start: [number, number] = [0, 0];
input.forEach((line, y) => {
  line.forEach((char, x) => {
    if (grid[x] === undefined) {
      grid[x] = [];
    }
    if (char === "S") {
      start[0] = x;
      start[1] = y;
    }

    grid[x][y] = char !== "#";
  });
});

const height = input.length;
const width = input[0].length;

const dirrections = [
  [-1, 0],
  [1, 0],
  [0, -1],
  [0, 1],
];

let todo = new Set<string>([`${start[0]},${start[1]}`]);
const done: number[] = [];
for (let step = 0; step < 2.5 * width + 1; ++step) {
  if (step % width === Math.floor(width / 2)) {
    done.push(todo.size);
  }

  const found = new Set<string>();

  for (const xy of todo) {
    const [x, y] = xy.split(",").map(Number);
    for (const [sx, sy] of dirrections) {
      const nx = x + sx;
      const ny = y + sy;

      const modX = ((nx % width) + width) % width;
      const modY = ((ny % height) + height) % height;

      if (!(grid[modX] ?? [])[modY]) {
        continue;
      }

      found.add(`${nx},${ny}`);
    }
  }

  todo = found;
}

const n = Math.floor(26_501_365 / width);
const [a, b, c] = done;

const result = Math.floor(
  a + n * (b - a) + ((n * (n - 1)) / 2) * (c - b - (b - a)),
);

console.log(`The result is ${result}`);
