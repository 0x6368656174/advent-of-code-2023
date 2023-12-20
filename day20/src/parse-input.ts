import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

interface Module {
  name: string;
  type: "broadcaster" | "%" | "&";
  destinations: string[];
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

export async function parseInput(): Promise<Module[]> {
  const lines = await parseInputLines();

  return lines.map((line) => {
    const [typeAndName, destString] = line.split("->").map((v) => v.trim());
    const type = typeAndName === "broadcaster" ? "broadcaster" : typeAndName[0];
    const name =
      typeAndName === "broadcaster" ? "broadcaster" : typeAndName.slice(1);
    const destinations = destString.split(",").map((v) => v.trim());

    return {
      name,
      type: type as Module["type"],
      destinations,
    };
  });
}
