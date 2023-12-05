import console from "node:console";
import { type MapConfig, parseInput } from "./parse-input.js";

const input = await parseInput();

let result = Number.MAX_SAFE_INTEGER;

function mapFromSource(source: number, maps: MapConfig[]): number {
  for (const map of maps) {
    const result = map.mapSource(source);
    if (result !== undefined) {
      return result;
    }
  }

  return source;
}

function mapSeedToLocation(seed: number): number {
  let source = seed;

  input.maps.forEach((maps) => {
    source = mapFromSource(source, maps);
  });

  return source;
}

input.seedRanges.forEach((seedRange) => {
  console.log(seedRange);
  for (let seed = seedRange.start; seed < seedRange.end; ++seed) {
    const location = mapSeedToLocation(seed);

    result = Math.min(result, location);
  }
});

console.log(`The result is ${result}`);
