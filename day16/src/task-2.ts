import console from "node:console";
import { parseInput } from "./parse-input.js";

const input = await parseInput();

function ascii(char: string): number {
  return char.charCodeAt(0);
}

function hash(line: string): number {
  return line.split("").reduce((acc, curr) => {
    return ((acc + ascii(curr)) * 17) % 256;
  }, 0);
}

interface Lens {
  label: string;
  focus: number;
}

const map: Record<string, Lens[]> = {};

const removeRegExp = /([^-]+)-/;
const addRegExp = /([^=]+)=(\d)/;

input.forEach((command) => {
  const removeMatch = command.match(removeRegExp);

  if (removeMatch !== null) {
    const label = removeMatch[1];
    const box = hash(label);
    if (map[box] !== undefined) {
      const currentIndex = map[box].findIndex((lens) => lens.label === label);
      if (currentIndex !== -1) {
        map[box].splice(currentIndex, 1);
      }
    }
  } else {
    const addMatch = command.match(addRegExp);
    if (addMatch === null) {
      throw new Error(`Unknown command ${command}`);
    }

    const label = addMatch[1];
    const focus = Number(addMatch[2]);
    const box = hash(label);

    if (map[box] === undefined) {
      map[box] = [];
    }

    const currentIndex = map[box].findIndex((lens) => lens.label === label);
    if (currentIndex !== -1) {
      map[box][currentIndex] = {
        label,
        focus,
      };
    } else {
      map[box].push({
        label,
        focus,
      });
    }
  }
});

const result = Object.entries(map).reduce((acc, [box, lens]) => {
  if (lens.length === 0) {
    return acc;
  }

  return (
    acc +
    lens.reduce(
      (acc1, one, index) => acc1 + (Number(box) + 1) * one.focus * (index + 1),
      0,
    )
  );
}, 0);

console.log(`The result is ${result}`);
