import console from "node:console";
import { type Command, parseInput } from "./parse-input.js";

const input = await parseInput();

// [x, y]
const cardinal: Record<string, [number, number]> = {
  U: [0, -1],
  R: [1, 0],
  D: [0, 1],
  L: [-1, 0],
};

function area(commands: Command[]): number {
  let area = 0;
  let perimeter = 0;

  let cur = [0, 0];

  for (const { direction, length } of commands) {
    perimeter += length;
    const prev = cur;
    cur = [
      cur[0] + cardinal[direction][0] * length,
      cur[1] + cardinal[direction][1] * length,
    ];

    area += (prev[1] + cur[1]) * (prev[0] - cur[0]);
  }
  perimeter += cur[0] + cur[1];
  area += cur[1] * cur[0];
  area /= 2;
  return area + 1 - perimeter / 2 + perimeter;
}

const DIRECTIONS: Record<string, string> = {
  0: "R",
  1: "D",
  2: "L",
  3: "U",
};

const result = area(
  input.map<Command>(({ color }) => {
    return {
      direction: DIRECTIONS[color[5]],
      length: parseInt(color.slice(0, 5), 16),
      color,
    };
  }),
);

console.log(`The result is ${result}`);
