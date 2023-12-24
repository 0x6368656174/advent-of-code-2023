import console from "node:console";
import { parseInput, type Vector } from "./parse-input.js";

const input = await parseInput();

function findDot(
  vector1: Vector,
  vector2: Vector,
): [bigint, bigint] | undefined {
  const x1 = BigInt(vector1.position[0]);
  const x2 = BigInt(vector1.position[0]) + BigInt(vector1.velocity[0]);
  const x3 = BigInt(vector2.position[0]);
  const x4 = BigInt(vector2.position[0]) + BigInt(vector2.velocity[0]);
  const y1 = BigInt(vector1.position[1]);
  const y2 = BigInt(vector1.position[1]) + BigInt(vector1.velocity[1]);
  const y3 = BigInt(vector2.position[1]);
  const y4 = BigInt(vector2.position[1]) + BigInt(vector2.velocity[1]);

  const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (denominator === BigInt(0)) {
    return undefined;
  }

  const dotX =
    ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
    denominator;

  const dotY =
    ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
    denominator;

  if (vector1.velocity[0] > 0 && dotX < vector1.position[0]) {
    return undefined;
  }
  if (vector1.velocity[0] < 0 && dotX > vector1.position[0]) {
    return undefined;
  }
  if (vector2.velocity[0] > 0 && dotX < vector2.position[0]) {
    return undefined;
  }
  if (vector2.velocity[0] < 0 && dotX > vector2.position[0]) {
    return undefined;
  }
  if (vector1.velocity[1] > 0 && dotY < vector1.position[1]) {
    return undefined;
  }
  if (vector1.velocity[1] < 0 && dotY > vector1.position[1]) {
    return undefined;
  }
  if (vector2.velocity[1] > 0 && dotY < vector2.position[1]) {
    return undefined;
  }
  if (vector2.velocity[1] < 0 && dotY > vector2.position[1]) {
    return undefined;
  }

  return [dotX, dotY];
}

const MIN = BigInt(200000000000000);
const MAX = BigInt(400000000000000);

let result = 0;

for (let i = 0; i < input.length; ++i) {
  for (let j = i + 1; j < input.length; ++j) {
    const dot = findDot(input[i], input[j]);
    // console.log(input[i], input[j], dot);
    if (
      dot !== undefined &&
      dot[0] > MIN &&
      dot[0] < MAX &&
      dot[1] > MIN &&
      dot[1] < MAX
    ) {
      result++;
    }
  }
}

console.log(`The result is ${result}`);
