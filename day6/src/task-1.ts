import console from "node:console";
import { parseInputV1 } from "./parse-input.js";

const input = await parseInputV1();

function race(holdTime: bigint, raceTime: bigint): bigint {
  return (raceTime - holdTime) * holdTime;
}

const results = input.map((attempt) => {
  let result = 0;

  for (let i = 0; i < attempt.time; ++i) {
    if (race(BigInt(i), attempt.time) >= attempt.distance) {
      result++;
    }
  }

  return result;
});

const result = results.reduce((acc, curr) => acc * curr, 1);

console.log(`The result is ${result}`);
