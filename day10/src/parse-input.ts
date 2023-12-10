import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface Point {
  x: number;
  y: number;
}

export type Move = (point: Point, pipePoint: Point) => Point;

export const moves: Record<string, Move> = {
  "|": (point, pipePoint) => {
    if (point.y < pipePoint.y) {
      return { x: point.x, y: pipePoint.y + 1 };
    } else {
      return { x: point.x, y: pipePoint.y - 1 };
    }
  },
  "-": (point, pipePoint) => {
    if (point.x < pipePoint.x) {
      return { x: pipePoint.x + 1, y: point.y };
    } else {
      return { x: pipePoint.x - 1, y: point.y };
    }
  },
  L: (point, pipePoint) => {
    if (point.x === pipePoint.x) {
      return { x: pipePoint.x + 1, y: pipePoint.y };
    } else {
      return { x: pipePoint.x, y: pipePoint.y - 1 };
    }
  },
  J: (point, pipePoint) => {
    if (point.x === pipePoint.x) {
      return { x: pipePoint.x - 1, y: pipePoint.y };
    } else {
      return { x: pipePoint.x, y: pipePoint.y - 1 };
    }
  },
  "7": (point, pipePoint) => {
    if (point.y === pipePoint.y) {
      return { x: pipePoint.x, y: pipePoint.y + 1 };
    } else {
      return { x: pipePoint.x - 1, y: pipePoint.y };
    }
  },
  F: (point, pipePoint) => {
    if (point.y === pipePoint.y) {
      return { x: pipePoint.x, y: pipePoint.y + 1 };
    } else {
      return { x: pipePoint.x + 1, y: pipePoint.y };
    }
  },
};

export async function parseInputLines(): Promise<string[]> {
  const filename = fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);

  const inputContent = await readFile(
    path.join(dirname, "..", "input.txt"),
    "utf-8",
  );

  return inputContent.trim().split("\n");
}

export async function parseInput(): Promise<string[][]> {
  const lines = await parseInputLines();
  return lines.map((line) => line.split(""));
}
