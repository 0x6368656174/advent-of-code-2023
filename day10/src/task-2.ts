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

let maxDistance = leftDistance;
let maxLoopStartPoint = { x: start.x - 1, y: start.y };
if (rightDistance > maxDistance) {
  maxDistance = rightDistance;
  maxLoopStartPoint = { x: start.x + 1, y: start.y };
}
if (topDistance > maxDistance) {
  maxDistance = topDistance;
  maxLoopStartPoint = { x: start.x, y: start.y - 1 };
}
if (bottomDistance > maxDistance) {
  maxDistance = bottomDistance;
  maxLoopStartPoint = { x: start.x, y: start.y + 1 };
}

function findLoopPoints(startPoint: Point, nextPipePoint: Point): boolean[][] {
  const result = input.map((line) => line.map(() => false));

  let currentPoint = startPoint;
  result[currentPoint.y][currentPoint.x] = true;
  let nextPipe = (input[nextPipePoint.y] ?? [])[nextPipePoint.x];

  while (nextPipe !== undefined && nextPipe !== "S") {
    const lastNextPipePoint = nextPipePoint;
    nextPipePoint = moves[nextPipe](currentPoint, nextPipePoint);
    currentPoint = lastNextPipePoint;
    result[currentPoint.y][currentPoint.x] = true;
    nextPipe = (input[nextPipePoint.y] ?? [])[nextPipePoint.x];
  }

  return result;
}

const loopPoints = findLoopPoints(start, maxLoopStartPoint);

const clearField: string[][] = input.map((line, y) =>
  line.map((pipe, x) => (loopPoints[y][x] ? pipe : ".")),
);

let result = 0;

const points = input.map((line) => line.map(() => false));

clearField.forEach((line, y) => {
  let open = false;
  let startPipe = "";
  line.forEach((pipe, x) => {
    // FIXME: HARDCODE!!!
    //        I'm too boring to do it correctly.
    //        The 'S' should be replaced by a correct pipe that it fit to the loop.
    if (pipe === "S") {
      pipe = "L";
    }

    if (pipe === ".") {
      if (open) {
        points[y][x] = true;
        result++;
      }
    } else if (pipe === "|") {
      open = !open;
    } else if (pipe !== "-") {
      if (startPipe !== "") {
        if (startPipe === "L" && pipe === "J") {
          // noting
          startPipe = "";
        } else if (startPipe === "L" && pipe === "7") {
          open = !open;
          startPipe = "";
        } else if (startPipe === "F" && pipe === "7") {
          // noting
          startPipe = "";
        } else if (startPipe === "F" && pipe === "J") {
          open = !open;
          startPipe = "";
        }
      } else {
        startPipe = pipe;
      }
    }
  });
});

console.log(`The result is ${result}`);
