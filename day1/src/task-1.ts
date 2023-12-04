import console from "node:console";
import { parseInputLines } from "./parse-input.js";

const input = await parseInputLines();

function isNumeric(value: string): boolean {
  return /^-?\d+$/.test(value);
}

function lineNumber(line: string): number {
  const lineArray = line.split("");
  const left = lineArray.find(isNumeric);
  const right = lineArray.reverse().find(isNumeric);
  return Number(`${left}${right}`);
}

const result = input.reduce((acc, curr) => acc + lineNumber(curr), 0);

console.log(`The result is ${result}`);
