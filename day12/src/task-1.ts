import console from "node:console";
import { type InputRow, parseInput } from "./parse-input.js";

const input = await parseInput();

function isValid(line: string[], contiguous: number[]): boolean {
  const lineContiguous = [0];

  line.forEach((v) => {
    if (v === "#") {
      lineContiguous[lineContiguous.length - 1]++;
    } else if (lineContiguous[lineContiguous.length - 1] !== 0) {
      lineContiguous.push(0);
    }
  });

  if (lineContiguous[lineContiguous.length - 1] === 0) {
    lineContiguous.pop();
  }

  if (lineContiguous.length !== contiguous.length) {
    return false;
  }

  for (let i = 0; i < lineContiguous.length; ++i) {
    if (contiguous[i] !== lineContiguous[i]) {
      return false;
    }
  }

  return true;
}

function lineResult(input: InputRow): number {
  const questions: number[] = [];
  input.line.forEach((char, index) => {
    if (char === "?") {
      questions.push(index);
    }
  });

  if (questions.length === 0) {
    return 1;
  }

  let result = 0;

  const questionsPlaceholders = questions.map(() => ".");

  const line = [...input.line];
  questionsPlaceholders.forEach((v, index) => (line[questions[index]] = v));

  if (isValid(line, input.contiguous)) {
    result++;
  }

  while (questionsPlaceholders.some((v) => v === ".")) {
    for (let i = 0; i < questionsPlaceholders.length; ++i) {
      if (questionsPlaceholders[i] === ".") {
        questionsPlaceholders[i] = "#";
        break;
      } else {
        questionsPlaceholders[i] = ".";
      }
    }

    const line = [...input.line];
    questionsPlaceholders.forEach((v, index) => (line[questions[index]] = v));

    if (isValid(line, input.contiguous)) {
      result++;
    }
  }

  return result;
}

const result = input.reduce((acc, curr) => acc + lineResult(curr), 0);

console.log(`The result is ${result}`);
