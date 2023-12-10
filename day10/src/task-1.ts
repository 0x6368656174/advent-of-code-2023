import console from "node:console";
import { moves, parseInput, type Point } from "./parse-input.js";

const input = await parseInput();

const start: Point = {
  x: -1,
  y: -1,
};

input.forEach((line, y) => {
  const x = line.indexOf("S");
  if (x !== -1) {
    start.x = x;
    start.y = y;
  }
});

function routeDistance(startPoint: Point, nextPipePoint: Point): number {
  let distance = 0;
  let currentPoint = startPoint;
  let nextPipe = (input[nextPipePoint.y] ?? [])[nextPipePoint.x];

  while (nextPipe !== undefined && nextPipe !== "S") {
    if (nextPipe === ".") {
      return Number.MIN_SAFE_INTEGER;
    }

    distance++;
    const lastNextPipePoint = nextPipePoint;
    nextPipePoint = moves[nextPipe](currentPoint, nextPipePoint);
    currentPoint = lastNextPipePoint;
    nextPipe = (input[nextPipePoint.y] ?? [])[nextPipePoint.x];
  }

  if (nextPipe === undefined) {
    return Number.MIN_SAFE_INTEGER;
  } else {
    return distance + 1;
  }
}

const leftDistance = routeDistance(start, { x: start.x - 1, y: start.y });
const rightDistance = routeDistance(start, { x: start.x + 1, y: start.y });
const topDistance = routeDistance(start, { x: start.x, y: start.y - 1 });
const bottomDistance = routeDistance(start, { x: start.x, y: start.y + 1 });

const result =
  Math.max(leftDistance, rightDistance, topDistance, bottomDistance) / 2;

console.log(`The result is ${result}`);
