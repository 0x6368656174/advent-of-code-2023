import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type Card =
  | "A"
  | "K"
  | "Q"
  | "J"
  | "T"
  | "9"
  | "8"
  | "7"
  | "6"
  | "5"
  | "4"
  | "3"
  | "2";

export const cardsV1: Record<Card, number> = {
  A: 13,
  K: 12,
  Q: 11,
  J: 10,
  T: 9,
  "9": 8,
  "8": 7,
  "7": 6,
  "6": 5,
  "5": 4,
  "4": 3,
  "3": 2,
  "2": 1,
};

export const cardsV2: Record<Card, number> = {
  A: 13,
  K: 12,
  Q: 11,
  T: 10,
  "9": 9,
  "8": 8,
  "7": 7,
  "6": 6,
  "5": 5,
  "4": 4,
  "3": 3,
  "2": 2,
  J: 1,
};

export interface Hand {
  cards: Card[];
  bid: number;
  strengthV1: number;
  strengthV2: number;
}

function cardsStrengthV1(cards: Card[]): number {
  const count: Record<string, number> = {};

  cards.forEach((card) => {
    if (count[card] === undefined) {
      count[card] = 0;
    }
    count[card]++;
  });

  // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
  const countArray = Object.values(count).sort().reverse();

  if (countArray[0] === 5) {
    return 6;
  }

  if (countArray[0] === 4) {
    return 5;
  }

  if (countArray[0] === 3 && countArray[1] === 2) {
    return 4;
  }

  if (countArray[0] === 3) {
    return 3;
  }

  if (countArray[0] === 2 && countArray[1] === 2) {
    return 2;
  }

  if (countArray[0] === 2) {
    return 1;
  }

  return 0;
}

function cardsStrengthV2(cards: Card[]): number {
  const jokerCount = cards.filter((c) => c === "J").length;
  const restCards = cards.filter((c) => c !== "J");

  const count: Record<string, number> = {};

  restCards.forEach((card) => {
    if (count[card] === undefined) {
      count[card] = 0;
    }
    count[card]++;
  });

  // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
  const countArray = Object.values(count).sort().reverse();

  if (jokerCount === 5) {
    return 6;
  }

  if (jokerCount === 4) {
    return 6;
  }

  if (jokerCount === 3) {
    if (countArray[0] === 2) {
      return 6;
    } else {
      return 5;
    }
  }

  if (jokerCount === 2) {
    if (countArray[0] === 3) {
      return 6;
    } else if (countArray[0] === 2) {
      return 5;
    } else {
      return 3;
    }
  }

  if (jokerCount === 1) {
    if (countArray[0] === 4) {
      return 6;
    } else if (countArray[0] === 3) {
      return 5;
    } else if (countArray[0] === 2 && countArray[1] === 2) {
      return 4;
    } else if (countArray[0] === 2) {
      return 3;
    } else {
      return 1;
    }
  }

  if (countArray[0] === 5) {
    return 6;
  }

  if (countArray[0] === 4) {
    return 5;
  }

  if (countArray[0] === 3 && countArray[1] === 2) {
    return 4;
  }

  if (countArray[0] === 3) {
    return 3;
  }

  if (countArray[0] === 2 && countArray[1] === 2) {
    return 2;
  }

  if (countArray[0] === 2) {
    return 1;
  }

  return 0;
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

export async function parseInput(): Promise<Hand[]> {
  const input = await parseInputLines();

  return input.map((line) => {
    const [cardsString, bid] = line.split(" ");

    const cards = cardsString.split("") as Card[];

    return {
      cards,
      bid: Number(bid),
      strengthV1: cardsStrengthV1(cards),
      strengthV2: cardsStrengthV2(cards),
    };
  });
}
