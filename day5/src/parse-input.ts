import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface SeedRange {
  start: number;
  length: number;
  end: number;
}

export interface MapConfig {
  sourceStart: number;
  sourceEnd: number;
  destinationStart: number;
  destinationEnd: number;

  mapSource: (source: number) => number | undefined;
}

export interface Input {
  seeds: number[];
  seedRanges: SeedRange[];
  maps: MapConfig[][];
}

export async function parseInputLines(): Promise<string[]> {
  const filename = fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);

  const inputContent = await readFile(
    path.join(dirname, "..", "input.txt"),
    "utf-8",
  );

  return inputContent.trim().split("\n");
}

export async function parseInput(): Promise<Input> {
  const input = await parseInputLines();

  const seeds = input[0]
    .slice("seeds: ".length)
    .split(" ")
    .map((value) => Number(value));

  const seedRanges: SeedRange[] = [];
  for (let i = 0; i < seeds.length; i = i + 2) {
    const start = seeds[i];
    const length = seeds[i + 1];
    seedRanges.push({
      start: Number(start),
      length: Number(length),
      end: Number(start) + Number(length),
    });
  }

  const mapLines = input.splice(3);
  const maps: MapConfig[][] = [];
  let lastMap: MapConfig[] = [];
  maps.push(lastMap);

  for (let i = 0; i < mapLines.length; ++i) {
    const line = mapLines[i];
    if (line.trim() === "") {
      lastMap = [];
      maps.push(lastMap);
      i++;
      continue;
    }

    const [destinationRangeStart, sourceRangeStart, rangeLength] =
      line.split(" ");

    lastMap.push({
      sourceStart: Number(sourceRangeStart),
      sourceEnd: Number(sourceRangeStart) + Number(rangeLength),
      destinationStart: Number(destinationRangeStart),
      destinationEnd: Number(destinationRangeStart) + Number(rangeLength),
      mapSource(source) {
        if (source >= this.sourceStart && source < this.sourceEnd) {
          return this.destinationStart + source - this.sourceStart;
        }

        return undefined;
      },
    });
  }

  return {
    seeds,
    seedRanges,
    maps,
  };
}
