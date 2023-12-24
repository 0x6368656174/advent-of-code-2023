import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface Vector {
  position: [number, number, number];
  velocity: [number, number, number];
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

export async function parseInput(): Promise<Vector[]> {
  const lines = await parseInputLines();

  return lines.map((line) => {
    const [positions, velocities] = line.split("@").map((v) => v.trim());
    const position = positions
      .split(",")
      .map((v) => v.trim())
      .map(Number);
    const velocity = velocities
      .split(",")
      .map((v) => v.trim())
      .map(Number);

    return {
      position: position as [number, number, number],
      velocity: velocity as [number, number, number],
    };
  });
}
