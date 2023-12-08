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

const trackCurrentElements: Element[] = input.elements.filter(
  (el) => el.isV2Start,
);

function findResultFromStart(startElement: Element): number {
  let result = 0;
  let currentInstructionIndex = 0;

  let currentElement = startElement;

  while (!currentElement?.isV2End) {
    result++;
    currentElement = move(currentElement, currentInstructionIndex);

    currentInstructionIndex = currentInstructionIndex + 1;
    if (currentInstructionIndex >= input.instructions.length) {
      currentInstructionIndex = 0;
    }
  }

  return result;
}

const results = trackCurrentElements.map((startElement) =>
  findResultFromStart(startElement),
);

function gcd(a: number, b: number): number {
  if (b === 0) return a;
  return gcd(b, a % b);
}

// Function to return LCM of two numbers
function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b;
}

let result = results.pop() as number;

while (results.length !== 0) {
  result = lcm(result, results.pop() as number);
}

console.log(`The result is ${result}`);
