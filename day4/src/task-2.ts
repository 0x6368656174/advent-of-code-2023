import console from "node:console";
import { parseInput } from "./parse-input.js";

const cards = await parseInput();

const stack: number[] = [];
cards.forEach(() => stack.push(1));

cards.forEach((card, index) => {
  const countOfCurrentCard = stack[index];

  for (
    let i = index + 1;
    i <= index + card.winnersCount && i < stack.length;
    ++i
  ) {
    stack[i] += countOfCurrentCard;
  }
});

const result = stack.reduce((acc, curr) => acc + curr, 0);

console.log(`The result is ${result}`);
