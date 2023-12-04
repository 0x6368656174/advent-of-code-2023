import console from "node:console";
import { type Game, parseInput } from "./parse-input.js";

const games = await parseInput();

function gameResult(game: Game): number {
  let maxRed = 0;
  let maxGreen = 0;
  let maxBlue = 0;

  game.attempts.forEach((attempt) => {
    maxRed = Math.max(maxRed, attempt.red);
    maxGreen = Math.max(maxGreen, attempt.green);
    maxBlue = Math.max(maxBlue, attempt.blue);
  });

  return maxRed * maxGreen * maxBlue;
}

const result = games.reduce((acc, game) => acc + gameResult(game), 0);

console.log(`The result is ${result}`);
