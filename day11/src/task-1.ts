import console from "node:console";
import { parseInput } from "./parse-input.js";

const input = await parseInput();

const rows = input.map(() => true);
const columns = input[0].map(() => true);

input.forEach((line, row) => {
  line.forEach((char, column) => {
    if (char === "#") {
      rows[row] = false;
      columns[column] = false;
    }
  });
});

const extraRowsCount = rows.filter((value) => value).length;
const emptyRow: string[] = [];
for (let i = 0; i < input[0].length + extraRowsCount + 1; ++i) {
  emptyRow.push(".");
}

const expaned: string[][] = [];

input.forEach((line, row) => {
  if (rows[row]) {
    expaned.push([...emptyRow]);
  }

  const newRow: string[] = [];
  line.forEach((char, column) => {
    newRow.push(char);
    if (columns[column]) {
      newRow.push(".");
    }
  });
  expaned.push(newRow);
});

const galaxies: Array<[number, number]> = [];
expaned.forEach((line, row) => {
  line.forEach((char, column) => {
    if (char === "#") {
      galaxies.push([row, column]);
    }
  });
});

let result = 0;

for (let i = 0; i < galaxies.length - 1; ++i) {
  for (let j = i + 1; j < galaxies.length; ++j) {
    result +=
      Math.abs(galaxies[i][0] - galaxies[j][0]) +
      Math.abs(galaxies[i][1] - galaxies[j][1]);
  }
}

console.log(`The result is ${result}`);
