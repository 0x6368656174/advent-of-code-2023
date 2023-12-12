import console from "node:console";
import { parseInput } from "./parse-input.js";

const input = await parseInput();

const unfoldedInput = input.map((row) => {
  const rowLine = row.line.join("");
  let line: string = rowLine;
  const contiguous: number[] = [...row.contiguous];

  for (let i = 0; i < 4; ++i) {
    line += "?";
    line += rowLine;
    contiguous.push(...row.contiguous);
  }

  return {
    line,
    contiguous,
  };
});

export function memoize<Args extends unknown[], Result>(
  func: (...args: Args) => Result,
): (...args: Args) => Result {
  const stored = new Map<string, Result>();

  return (...args) => {
    const k = JSON.stringify(args);
    if (stored.has(k)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return stored.get(k)!;
    }
    const result = func(...args);
    stored.set(k, result);
    return result;
  };
}

const lineResult = memoize((line: string, contiguous: number[]): number => {
  if (line.length === 0) {
    if (contiguous.length === 0) {
      return 1;
    } else {
      return 0;
    }
  }

  if (contiguous.length === 0) {
    if (line.includes("#")) {
      return 0;
    } else {
      return 1;
    }
  }

  // number of # + number of .
  const minExpectedRecord =
    contiguous.reduce((acc, curr) => acc + curr, 0) + contiguous.length - 1;
  if (line.length < minExpectedRecord) {
    return 0;
  }

  if (line[0] === ".") {
    return lineResult(line.slice(1), contiguous);
  }

  if (line[0] === "#") {
    const [firstContiguous, ...restContiguous] = contiguous;
    // if group of characters have '.', that means that is not solid group
    if (line.slice(0, firstContiguous).includes(".")) {
      return 0;
    }

    // If group of # continued, but should be ended
    if (line[firstContiguous] === "#") {
      return 0;
    }

    return lineResult(line.slice(firstContiguous + 1), restContiguous);
  }

  // We have ? in the first, try 2 variants
  return (
    lineResult("#" + line.slice(1), contiguous) +
    lineResult("." + line.slice(1), contiguous)
  );
});

const result = unfoldedInput.reduce(
  (acc, curr) => acc + lineResult(curr.line, curr.contiguous),
  0,
);

console.log(`The result is ${result}`);
