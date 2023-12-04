import console from "node:console";
import { parseInputLines } from "./parse-input.js";

const input = await parseInputLines();

const normalNumbersValues: Record<string, number> = {
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  "5": 5,
  "6": 6,
  "7": 7,
  "8": 8,
  "9": 9,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};
const normalWholeNumbers = new Set(Object.keys(normalNumbersValues));
const normalNumbersVariants = new Set<string>();
normalWholeNumbers.forEach((number) => {
  const numberArray = number.split("");
  let part = "";
  numberArray.forEach((char) => {
    part += char;
    normalNumbersVariants.add(part);
  });
});

const reversedNumbersValues: Record<string, number> = {};
Object.entries(normalNumbersValues).forEach(([key, value]) => {
  reversedNumbersValues[key.split("").reverse().join("")] = value;
});
const reversedWholeNumbers = new Set(Object.keys(reversedNumbersValues));
const reversedNumbersVariants = new Set<string>();
reversedWholeNumbers.forEach((number) => {
  const numberArray = number.split("");
  let part = "";
  numberArray.forEach((char) => {
    part += char;
    reversedNumbersVariants.add(part);
  });
});

function lineNumber(
  line: string[],
  numbersValues: Record<string, number>,
  wholeNumbers: Set<string>,
  numbersVariants: Set<string>,
): number {
  let matchPart = "";

  for (const char of line) {
    while (matchPart !== "") {
      if (numbersVariants.has(matchPart + char)) {
        matchPart = matchPart + char;
        break;
      } else {
        matchPart = matchPart.slice(1);
      }
    }

    if (matchPart === "" && numbersVariants.has(char)) {
      matchPart = char;
    }

    if (wholeNumbers.has(matchPart)) {
      return numbersValues[matchPart];
    }
  }

  throw new Error(`Not found number in line "${line.join("")}"`);
}

function lineNumbers(line: string): number {
  const lineArray = line.split("");
  const left = lineNumber(
    lineArray,
    normalNumbersValues,
    normalWholeNumbers,
    normalNumbersVariants,
  );
  const right = lineNumber(
    lineArray.reverse(),
    reversedNumbersValues,
    reversedWholeNumbers,
    reversedNumbersVariants,
  );

  return Number(`${left}${right}`);
}

const result = input.reduce((acc, curr) => acc + lineNumbers(curr), 0);

console.log(`The result is ${result}`);
