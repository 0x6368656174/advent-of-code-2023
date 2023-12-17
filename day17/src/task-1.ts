import console from "node:console";
import { parseInput } from "./parse-input.js";

const input = await parseInput();

// HeatLoss[0] : from i-direction; need to turn into j-direction
// HeatLoss[1] : from j-direction; need to turn into i-direction
type HeatLoss = [number, number];
const minimumHeatLoss: HeatLoss[][] = input.map((line) =>
  line.map(() => [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]),
);

interface BfsInfo {
  i: number;
  j: number;
  // 0: from i direction
  // 1: from j direction
  fromDirection: 0 | 1;
}

minimumHeatLoss[0][0] = [0, 0];

let bfs: BfsInfo[] = [];
let pong: BfsInfo[] = [];

// Starting at (0,0), to i-direction
bfs.push({ i: 0, j: 0, fromDirection: 0 });
// Starting at (0,0), to j-direction
bfs.push({ i: 0, j: 0, fromDirection: 1 });

while (bfs.length !== 0) {
  pong = [];

  for (const b of bfs) {
    // Turning direction
    const di = b.fromDirection === 1 ? 1 : 0;
    const dj = b.fromDirection === 0 ? 1 : 0;
    const newDirection = (1 - b.fromDirection) as 0 | 1;

    for (const sign of [-1, 1]) {
      for (let k = 1; k <= 3; ++k) {
        const newI = b.i + di * sign * k;
        const newJ = b.j + dj * sign * k;

        // Out-of-range check
        if (
          newI < 0 ||
          newI >= input.length ||
          newJ < 0 ||
          newJ >= input[0].length
        ) {
          continue;
        }

        // Heat-loss calculate
        let newLoss = minimumHeatLoss[b.i][b.j][b.fromDirection];
        for (let j = 1; j <= k; ++j) {
          newLoss += input[b.i + sign * j * di][b.j + sign * j * dj];
        }

        if (newLoss >= minimumHeatLoss[newI][newJ][newDirection]) {
          continue;
        }

        minimumHeatLoss[newI][newJ][newDirection] = newLoss;
        pong.push({ i: newI, j: newJ, fromDirection: newDirection });
      }
    }
  }

  const oldBfs = bfs;
  bfs = pong;
  pong = oldBfs;
}

const variants = minimumHeatLoss.pop()?.pop() as HeatLoss;
const result = Math.min(variants[0], variants[1]);

console.log(`The result is ${result}`);
