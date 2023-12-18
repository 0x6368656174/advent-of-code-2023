import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface Command {
  direction: string;
  length: number;
  color: string;
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

const commandRegExt = /(\w)\s([\S]+)\s\(#([^)]+)\)/;

export async function parseInput(): Promise<Command[]> {
  const lines = await parseInputLines();

  return lines.map((line) => {
    const commandMath = line.match(commandRegExt);
    if (commandMath === null) {
      throw new Error(`Invalid command ${line}`);
    }

    return {
      direction: commandMath[1],
      length: Number(commandMath[2]),
      color: commandMath[3],
    };
  });
}
