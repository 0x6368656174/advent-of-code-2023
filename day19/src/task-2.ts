import console from "node:console";
import { parseInput, type Workflow } from "./parse-input.js";

const input = await parseInput();

const workflowMap: Record<string, Workflow> = {};
input.workflows.forEach((workflow) => (workflowMap[workflow.name] = workflow));

interface IntRange {
  first: number;
  last: number;
}

function compute(
  currentWorkflow: string,
  rangesMap: Record<string, IntRange>,
): bigint {
  if (currentWorkflow === "R") {
    return BigInt(0);
  }

  let result = BigInt(0);

  if (currentWorkflow === "A") {
    result = BigInt(1);
    for (const r of Object.values(rangesMap)) {
      result *= BigInt(r.last - r.first + 1);
    }
    return result;
  }

  const workflow = workflowMap[currentWorkflow];
  const currentRangeMap = { ...rangesMap };

  for (let i = 0; i < workflow.rules.length + 1; ++i) {
    const rule = workflow.rules[i];
    if (rule === undefined) {
      result += compute(workflow.otherDestination, currentRangeMap);
      break;
    } else {
      const currentRange = currentRangeMap[rule.property];
      const { rt, rf } = (() => {
        switch (rule.condition) {
          case "<":
            return {
              rt: [
                currentRange.first,
                Math.min(currentRange.last, rule.value - 1),
              ] as [number, number],
              rf: [
                Math.max(currentRange.first, rule.value),
                currentRange.last,
              ] as [number, number],
            };
          case ">":
            return {
              rt: [
                Math.max(currentRange.first, rule.value + 1),
                currentRange.last,
              ] as [number, number],
              rf: [
                currentRange.first,
                Math.min(currentRange.last, rule.value),
              ] as [number, number],
            };
        }
      })();

      if (rt[0] !== rt[1]) {
        const newRangeMap = { ...currentRangeMap };
        newRangeMap[rule.property] = {
          first: rt[0],
          last: rt[1],
        };
        result += compute(rule.destination, newRangeMap);
      }
      if (rf[0] === rf[1]) {
        break;
      }
      currentRangeMap[rule.property] = {
        first: rf[0],
        last: rf[1],
      };
    }
  }

  return result;
}

const rangeMap: Record<string, IntRange> = {};
for (const property of ["x", "m", "a", "s"]) {
  rangeMap[property] = {
    first: 1,
    last: 4000,
  };
}

const result = compute("in", rangeMap);

console.log(`The result is ${result}`);
