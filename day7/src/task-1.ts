import console from "node:console";
import { cardsV1, type Hand, parseInput } from "./parse-input.js";

const input = await parseInput();

function compare(left: Hand, right: Hand): number {
  if (left.strengthV1 > right.strengthV1) {
    return 1;
  } else if (left.strengthV1 < right.strengthV1) {
    return -1;
  } else {
    for (let i = 0; i < left.cards.length; ++i) {
      const leftCard = left.cards[i];
      const rightCard = right.cards[i];

      const leftCardStrength = cardsV1[leftCard];
      const rightCardStrength = cardsV1[rightCard];

      if (leftCardStrength > rightCardStrength) {
        return 1;
      } else if (leftCardStrength < rightCardStrength) {
        return -1;
      }
    }
  }

  return 0;
}

const sorted = input.sort(compare);

const result = sorted.reduce(
  (acc, curr, index) => acc + curr.bid * (index + 1),
  0,
);

console.log(`The result is ${result}`);
