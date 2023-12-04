import console from "node:console";
import { type Game, type GameAttempt, parseInput } from "./parse-input.js";

const games = await parseInput();

function isAttemptMatch(attempt: GameAttempt): boolean {
  return attempt.red <= 12 && attempt.green <= 13 && attempt.blue <= 14;
}

function isGameMatch(game: Game): boolean {
  return game.attempts.every(isAttemptMatch);
}

const result = games
  .filter(isGameMatch)
  .reduce((acc, game) => acc + game.id, 0);

console.log(`The result is ${result}`);
