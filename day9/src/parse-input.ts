import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export async function parseInputLines(): Promise<string[]> {
  const filename = fileURLToPath(import.meta.url);
  const dirname = path.dirname(filename);

  const inputContent = await readFile(
    path.join(dirname, "..", "input.txt"),
    "utf-8",
  );

  return inputContent.trim().split("\n");
}

// export async function parseInput(): Promise<Input> {}
