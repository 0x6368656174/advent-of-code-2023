import console from "node:console";
import { type Element, parseInput } from "./parse-input.js";

const input = await parseInput();

function move(
  currentElement: Element,
  currentInstructionIndex: number,
): Element {
  const instruction = input.instructions[currentInstructionIndex];

  return instruction === "L"
    ? currentElement.leftElement
    : currentElement.rightElement;
}

let result = 0;
let currentInstructionIndex = 0;

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
let currentElement = input.elements.find((el) => el.name === "AAA")!;

while (currentElement?.name !== "ZZZ") {
  result++;
  currentElement = move(currentElement, currentInstructionIndex);

  currentInstructionIndex = currentInstructionIndex + 1;
  if (currentInstructionIndex >= input.instructions.length) {
    currentInstructionIndex = 0;
  }
}

console.log(`The result is ${result}`);
