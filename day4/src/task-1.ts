import console from "node:console";
import { parseInput } from "./parse-input.js";

const cards = await parseInput();

const result = cards
  .map((card) => {
    if (card.winnersCount === 0) {
      return 0;
    }

    let score = 1;
    for (let i = 1; i < card.winnersCount; ++i) {
      score *= 2;
    }

    return score;
  })
  .reduce((acc, curr) => acc + curr, 0);

console.log(`The result is ${result}`);
