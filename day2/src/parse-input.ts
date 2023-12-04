import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface GameAttempt {
  red: number;
  green: number;
  blue: number;
}

export interface Game {
  id: number;
  attempts: GameAttempt[];
}

const redRegExp = /(\d+)\sred/;
const greenRegExp = /(\d+)\sgreen/;
const blueRegExp = /(\d+)\sblue/;

function parseAttempt(attempt: string): GameAttempt {
  const redMatch = attempt.match(redRegExp);
  const greenMatch = attempt.match(greenRegExp);
  const blueMatch = attempt.match(blueRegExp);

  return {
    red: redMatch !== null ? Number(redMatch[1]) : 0,
    green: greenMatch !== null ? Number(greenMatch[1]) : 0,
    blue: blueMatch !== null ? Number(blueMatch[1]) : 0,
  };
}

const gameRegExp = /Game\s(\d+):(.+)/;

function parseGame(line: string): Game {
  const gameMatch = line.match(gameRegExp);
  if (gameMatch === null) {
    throw new Error(`Line "${line}" doesn't match game RegExp`);
  }

  const id = Number(gameMatch[1]);
  const attemptsString = gameMatch[2].trim();

  const attemptsArray = attemptsString.split(";");
  const attempts = attemptsArray.map(parseAttempt);

  return {
    id,
    attempts,
  };
}

export async function parseInputLines(): Promise<string[]> {
  const filename = fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);

  const inputContent = await readFile(
    path.join(dirname, "..", "input.txt"),
    "utf-8",
  );

  return inputContent.trim().split("\n");
}

export async function parseInput(): Promise<Game[]> {
  const input = await parseInputLines();

  return input.map(parseGame);
}
