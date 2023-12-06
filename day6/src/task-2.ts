import console from "node:console";
import { parseInputV2 } from "./parse-input.js";

const input = await parseInputV2();

function race(holdTime: bigint, raceTime: bigint): bigint {
  return (raceTime - holdTime) * holdTime;
}

let result = 0;

for (let i = 0; i < input.time; ++i) {
  if (race(BigInt(i), input.time) >= input.distance) {
    result++;
  }
}

console.log(`The result is ${result}`);
