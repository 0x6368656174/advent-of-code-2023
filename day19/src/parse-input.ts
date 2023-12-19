import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export interface Rule {
  property: string;
  condition: ">" | "<";
  value: number;
  destination: string;
}

export interface Workflow {
  name: string;
  rules: Rule[];
  otherDestination: string;
}

export type Part = Record<string, number>;

export interface Input {
  workflows: Workflow[];
  parts: Part[];
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

const workflowRegExp = /([^{]+)\{([^}]+)}/;
const ruleRegExp = /([^<>]+)([<>])(\d+):(\w+)/;

export async function parseInput(): Promise<Input> {
  const lines = await parseInputLines();

  const partsIndex = lines.indexOf("") + 1;

  const workflows: Workflow[] = lines.slice(0, partsIndex - 1).map((line) => {
    const workflowMatch = line.match(workflowRegExp);
    if (workflowMatch === null) {
      throw new Error(`Unsupported workflow ${line}`);
    }

    const name = workflowMatch[1];
    const ruleLines = workflowMatch[2].split(",");
    const rules = ruleLines.slice(0, ruleLines.length - 1).map((ruleLine) => {
      const ruleMatch = ruleLine.match(ruleRegExp);

      if (ruleMatch === null) {
        throw new Error(`Unsupported rule ${ruleLine}`);
      }

      return {
        property: ruleMatch[1],
        condition: ruleMatch[2] as ">" | "<",
        value: Number(ruleMatch[3]),
        destination: ruleMatch[4],
      };
    });

    return {
      name,
      rules,
      otherDestination: ruleLines[ruleLines.length - 1],
    };
  });

  const parts = lines.splice(partsIndex).map((line) => {
    const values = line.slice(1, line.length - 1).split(",");

    const result: any = {};
    values.forEach((valueLine) => {
      const char = valueLine.slice(0, 1);
      const value = Number(valueLine.slice(2));
      result[char] = value;
    });

    return result;
  });

  return {
    workflows,
    parts,
  };
}
