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

const size = 1000000 - 1;

const extraRows: number[] = [];
let extraRowCount = 0;
rows.forEach((value, index) => {
  if (value) {
    extraRowCount += size;
  }
  extraRows[index] = extraRowCount;
});
const extraColumns: number[] = [];
let extraColumnCount = 0;
columns.forEach((value, index) => {
  if (value) {
    extraColumnCount += size;
  }
  extraColumns[index] = extraColumnCount;
});

const galaxies: Array<[number, number]> = [];
input.forEach((line, row) => {
  line.forEach((char, column) => {
    if (char === "#") {
      galaxies.push([row + extraRows[row], column + extraColumns[column]]);
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
