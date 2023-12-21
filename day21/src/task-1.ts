import console from "node:console";
import { parseInput } from "./parse-input.js";

const input = await parseInput();

const steps: Array<Array<Set<number>>> = input.map((line) =>
  line.map((v) => (v === "S" ? new Set([-1]) : new Set())),
);

const STEPS = 64;
for (let day = 0; day < STEPS; ++day) {
  for (let i = 0; i < steps.length; ++i) {
    for (let j = 0; j < steps[0].length; ++j) {
      if (steps[i][j].has(day - 1)) {
        // Try to move
        if ((input[i - 1] ?? [])[j] === ".") {
          steps[i - 1][j].add(day);
        }
        if ((input[i + 1] ?? [])[j] === ".") {
          steps[i + 1][j].add(day);
        }
        if (input[i][j - 1] === ".") {
          steps[i][j - 1].add(day);
        }
        if (input[i][j + 1] === ".") {
          steps[i][j + 1].add(day);
        }
      }
    }
  }

  // console.log(`Day ${day + 1}`);
  // console.log(
  //   steps
  //     .map((line, i) =>
  //       line.map((v, j) => (v.has(day) ? "O" : input[i][j])).join(""),
  //     )
  //     .join("\n"),
  // );
  // console.log("\n\n");
}

let result = 1; // S is 1
steps.forEach((line) => {
  line.forEach((step) => {
    if (step.has(STEPS - 1)) {
      result++;
    }
  });
});

console.log(`The result is ${result}`);
