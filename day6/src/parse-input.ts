import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface Race {
  time: bigint;
  distance: bigint;
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

export async function parseInputV1(): Promise<Race[]> {
  const input = await parseInputLines();

  const timeArray = input[0]
    .split(" ")
    .filter((v) => v.trim() !== "")
    .splice(1);
  const distanceArray = input[1]
    .split(" ")
    .filter((v) => v.trim() !== "")
    .splice(1);

  return timeArray.map((time, index) => ({
    time: BigInt(time),
    distance: BigInt(distanceArray[index]),
  }));
}

export async function parseInputV2(): Promise<Race> {
  const races = await parseInputV1();

  const result = {
    time: "",
    distance: "",
  };

  races.forEach((race) => {
    result.time += String(race.time);
    result.distance += String(race.distance);
  });

  return {
    time: BigInt(result.time),
    distance: BigInt(result.distance),
  };
}
