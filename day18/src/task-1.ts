import console from "node:console";
import { type Command, parseInput } from "./parse-input.js";

const input = await parseInput();

// [x, y]
const adds: Record<string, [number, number]> = {
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
      cur[0] + adds[direction][0] * length,
      cur[1] + adds[direction][1] * length,
    ];

    area += (prev[1] + cur[1]) * (prev[0] - cur[0]);
  }
  perimeter += cur[0] + cur[1];
  area += cur[1] * cur[0];
  area /= 2;

  return area + 1 - perimeter / 2 + perimeter;
}

const result = area(input);

console.log(`The result is ${result}`);
