import console from "node:console";
import { parseInput } from "./parse-input.js";

const input = await parseInput();

let maxX = 0;
let maxY = 0;
let maxZ = 0;

const blockDirections: Record<number, "x" | "y" | "z"> = {};
const blockLengths: Record<number, number> = {};
const blockXY: Record<number, [number, number]> = {};
const horizontalBlockStarts: Record<number, number> = {};
const space: Array<Array<Array<number | undefined>>> = [];

input.forEach(({ start, end }, index) => {
  const isX = start[0] !== end[0];
  const isY = start[1] !== end[1];
  blockDirections[index] = isX ? "x" : isY ? "y" : "z";
  blockXY[index] = [Math.min(start[0], end[0]), Math.min(start[1], end[1])];

  switch (blockDirections[index]) {
    case "x":
      blockLengths[index] = Math.abs(start[0] - end[0]) + 1;
      horizontalBlockStarts[index] = blockXY[index][0];
      break;
    case "y":
      blockLengths[index] = Math.abs(start[1] - end[1]) + 1;
      horizontalBlockStarts[index] = blockXY[index][1];
      break;
    case "z":
      blockLengths[index] = Math.abs(start[2] - end[2]) + 1;
      horizontalBlockStarts[index] = blockXY[index][0];
      break;
  }

  for (let nx = start[0]; nx <= end[0]; ++nx) {
    for (let ny = start[1]; ny <= end[1]; ++ny) {
      for (let nz = start[2]; nz <= end[2]; ++nz) {
        if (space[nz] === undefined) {
          space[nz] = [];
        }

        if (space[nz][nx] === undefined) {
          space[nz][nx] = [];
        }

        space[nz][nx][ny] = index;

        maxX = Math.max(maxX, nx);
        maxY = Math.max(maxY, ny);
        maxZ = Math.max(maxZ, nz);
      }
    }
  }
});

// Fill empty
for (let z = 1; z <= maxZ; ++z) {
  for (let x = 0; x <= maxX; ++x) {
    for (let y = 0; y <= maxY; ++y) {
      if (space[z] === undefined) {
        space[z] = [];
      }
      if (space[z][x] === undefined) {
        space[z][x] = [];
      }
      if (space[z][x][y] === undefined) {
        space[z][x][y] = undefined;
      }
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function printX(): void {
  const result: string[] = [""];

  for (let z = maxZ; z > 0; --z) {
    for (let x = 0; x <= maxX; ++x) {
      if (z === maxZ) {
        result[0] += x;
      }
      const isMany =
        new Set(space[z][x].filter((v) => v !== undefined)).size > 1;
      const first = space[z][x].find((v) => v !== undefined);

      result[maxZ - z + 1] =
        (result[maxZ - z + 1] ?? "") + (isMany ? "?" : first ?? ".");
      if (x === maxX) {
        result[maxZ - z + 1] += ` ${z}`;
      }
    }
  }

  console.log(" x ");
  console.log(result.join("\n"));
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function printY(): void {
  const result: string[] = [""];

  for (let z = maxZ; z > 0; --z) {
    for (let y = 0; y <= maxY; ++y) {
      if (z === maxZ) {
        result[0] += y;
      }
      const isMany = (() => {
        let first: number | undefined;
        for (let x = 0; x <= maxX; ++x) {
          const block = space[z][x][y];
          if (block === undefined) {
            continue;
          }

          if (first === undefined) {
            first = block;
            continue;
          }

          if (first !== block) {
            return true;
          }
        }

        return false;
      })();
      const first = (() => {
        for (let x = 0; x <= maxX; ++x) {
          const block = space[z][x][y];
          if (block !== undefined) {
            return block;
          }
        }

        return undefined;
      })();

      result[maxZ - z + 1] =
        (result[maxZ - z + 1] ?? "") + (isMany ? "?" : first ?? ".");
      if (y === maxY) {
        result[maxZ - z + 1] += ` ${z}`;
      }
    }
  }

  console.log(" y ");
  console.log(result.join("\n"));
}

function findNextLevelBlocks(
  z: number,
  dz: -1 | 1,
  block: number,
): Set<number> {
  const nextLevelBlocks = new Set<number>();

  const [x, y] = blockXY[block];

  switch (blockDirections[block]) {
    case "y": {
      for (
        let ny = horizontalBlockStarts[block];
        ny < horizontalBlockStarts[block] + blockLengths[block];
        ++ny
      ) {
        const nextLevelBlock = space[z + dz][x][ny];
        if (nextLevelBlock !== undefined) {
          nextLevelBlocks.add(nextLevelBlock);
        }
      }

      break;
    }
    case "x": {
      for (
        let nx = horizontalBlockStarts[block];
        nx < horizontalBlockStarts[block] + blockLengths[block];
        ++nx
      ) {
        const nextLevelBlock = space[z + dz][nx][y];
        if (nextLevelBlock !== undefined) {
          nextLevelBlocks.add(nextLevelBlock);
        }
      }

      break;
    }
    case "z": {
      const nextLevelBlock = space[z + dz][x][y];
      if (nextLevelBlock !== undefined) {
        nextLevelBlocks.add(nextLevelBlock);
      }

      break;
    }
  }

  return nextLevelBlocks;
}

for (let startZ = 2; startZ <= maxZ; ++startZ) {
  for (let z = startZ; z > 1; --z) {
    const processed = new Set<number>();

    for (let x = 0; x <= maxX; ++x) {
      for (let y = 0; y <= maxY; ++y) {
        const block = space[z][x][y];
        if (block !== undefined) {
          if (processed.has(block)) {
            continue;
          } else {
            processed.add(block);
          }

          const direction = blockDirections[block];

          switch (direction) {
            case "z": {
              // Just check that a bottom block is empty
              if (space[z - 1][x][y] === undefined) {
                space[z - 1][x][y] = block;
                space[z][x][y] = undefined;
              }
              break;
            }
            case "y": {
              const isEmpty = findNextLevelBlocks(z, -1, block).size === 0;

              if (isEmpty) {
                for (
                  let ny = horizontalBlockStarts[block];
                  ny < horizontalBlockStarts[block] + blockLengths[block];
                  ++ny
                ) {
                  space[z - 1][x][ny] = block;
                  space[z][x][ny] = undefined;
                }
              }

              break;
            }
            case "x": {
              const isEmpty = findNextLevelBlocks(z, -1, block).size === 0;

              if (isEmpty) {
                for (
                  let nx = horizontalBlockStarts[block];
                  nx < horizontalBlockStarts[block] + blockLengths[block];
                  ++nx
                ) {
                  space[z - 1][nx][y] = block;
                  space[z][nx][y] = undefined;
                }
              }

              break;
            }
          }
        }
      }
    }
  }
}

const result = new Set<number>();

for (let z = 1; z <= maxZ; ++z) {
  const processed = new Set<number>();

  for (let x = 0; x <= maxX; ++x) {
    for (let y = 0; y <= maxY; ++y) {
      const block = space[z][x][y];
      if (block === undefined) {
        continue;
      }

      if (processed.has(block)) {
        continue;
      } else {
        processed.add(block);
      }

      const isOk = (() => {
        const topBlocks = findNextLevelBlocks(z, +1, block);
        if (topBlocks.size === 0) {
          return true;
        }

        for (const topBlock of topBlocks) {
          const bottomBlocks = findNextLevelBlocks(z + 1, -1, topBlock);

          bottomBlocks.delete(block);

          if (bottomBlocks.size === 0) {
            return false;
          }
        }

        return true;
      })();

      if (isOk) {
        result.add(block);
      }
    }
  }
}

console.log(`The result is ${result.size}`);
