import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type Direction = "L" | "R";

export interface Element {
  name: string;
  isV2Start: boolean;
  isV2End: boolean;
  leftElement: Element;
  rightElement: Element;
}

export interface Input {
  instructions: Direction[];
  elements: Element[];
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

const instructionRegExt = /(\w{3})\s=\s\((\w{3}),\s(\w{3})/;

export async function parseInput(): Promise<Input> {
  const input = await parseInputLines();

  const instructions = input[0].split("") as Direction[];

  const elementsMap: Record<string, [string, string]> = {};

  input.splice(2).forEach((line) => {
    const instructionMatch = line.match(instructionRegExt);
    if (instructionMatch === null) {
      throw new Error(`Line ${line} doesn't match reg exp`);
    }

    elementsMap[instructionMatch[1]] = [
      instructionMatch[2],
      instructionMatch[3],
    ];
  });

  const elements: Record<string, any> = {};
  Object.keys(elementsMap).forEach((name) => {
    elements[name] = {
      name,
      isV2Start: name.endsWith("A"),
      isV2End: name.endsWith("Z"),
    };
  });

  Object.entries(elementsMap).forEach(([name, [left, right]]) => {
    elements[name].leftElement = elements[left];
    elements[name].rightElement = elements[right];
  });

  return {
    instructions,
    elements: Object.values(elements),
  };
}
