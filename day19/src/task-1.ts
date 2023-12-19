import console from "node:console";
import { parseInput, type Part, type Workflow } from "./parse-input.js";

const input = await parseInput();

const workflowMap: Record<string, Workflow> = {};
input.workflows.forEach((workflow) => (workflowMap[workflow.name] = workflow));

function getNextWorkflowName(currentWorkflow: Workflow, part: Part): string {
  for (const rule of currentWorkflow.rules) {
    const partValue = part[rule.property];
    const isMatch =
      rule.condition === "<" ? partValue < rule.value : partValue > rule.value;
    if (isMatch) {
      return rule.destination;
    }
  }

  return currentWorkflow.otherDestination;
}

function isAccepted(part: Part): boolean {
  let currentWorkflow = workflowMap.in;

  while (true) {
    const nextWorkflowName = getNextWorkflowName(currentWorkflow, part);
    if (nextWorkflowName === "A") {
      return true;
    } else if (nextWorkflowName === "R") {
      return false;
    } else {
      currentWorkflow = workflowMap[nextWorkflowName];
    }
  }
}

const result = input.parts
  .filter(isAccepted)
  .reduce((acc, part) => acc + part.x + part.m + part.a + part.s, 0);

console.log(`The result is ${result}`);
