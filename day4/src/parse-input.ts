import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface Card {
  id: number;
  numbers: number[];
  winners: number[];
  winnersCount: number;
}

const cardRegExp = /Card\s+(\d+):([^|]+)\|(.+)/;

function parseCard(line: string): Card {
  const cardMatch = line.match(cardRegExp);
  if (cardMatch === null) {
    throw new Error(`Line "${line}" doesn't match card RegExp`);
  }

  const numbers = cardMatch[2]
    .split(" ")
    .filter((s) => s.trim())
    .map((v) => Number(v));
  const winners = cardMatch[3]
    .split(" ")
    .filter((s) => s.trim())
    .map((v) => Number(v));

  const winnersSet = new Set(winners);
  const winnerNumbers = numbers.filter((value) => winnersSet.has(value));

  return {
    id: Number(cardMatch[1]),
    numbers,
    winners,
    winnersCount: winnerNumbers.length,
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

export async function parseInput(): Promise<Card[]> {
  const input = await parseInputLines();

  return input.map(parseCard);
}
