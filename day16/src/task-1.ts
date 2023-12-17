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

const result = input.reduce((acc, line) => acc + hash(line), 0);

console.log(`The result is ${result}`);
