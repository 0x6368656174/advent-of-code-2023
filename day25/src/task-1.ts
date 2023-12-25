import console from "node:console";
import { parseInput } from "./parse-input.js";
import graphlib from "graphlib";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import { mincut } from "@graph-algorithm/minimum-cut";

const input = await parseInput();

const catGraph: Array<[string, string]> = [];
input.forEach(({ name: from, destinations }) => {
  destinations.forEach((to) => {
    catGraph.push([from, to]);
  });
});

const cuts: Array<[string, string]> = [];
for (const value of mincut(catGraph)) {
  cuts.push(value);
}

function inCuts(from: string, to: string): boolean {
  return (
    cuts.find(
      (v) => (v[0] === from && v[1] === to) || (v[0] === to && v[1] === from),
    ) !== undefined
  );
}

const componentsGraph = new graphlib.Graph();

input.forEach(({ name: from, destinations }) => {
  destinations.forEach((to) => {
    catGraph.push([from, to]);
    if (!inCuts(from, to)) {
      componentsGraph.setEdge(from, to);
    } else {
      console.log(from, to);
    }
  });
});

const components = graphlib.alg.components(componentsGraph);
console.log(components.length);
const result = components.reduce((acc, curr) => acc * curr.length, 1);

console.log(`The result is ${result}`);
