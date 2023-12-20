import console from "node:console";
import { parseInput } from "./parse-input.js";

const input = await parseInput();

interface Impulse {
  source: string;
  isHigh: boolean;
  module: string;
}

interface Module {
  processImpulse: (source: string, isHigh: boolean) => Impulse[];
}

class BroadcastModule implements Module {
  constructor(
    readonly name: string,
    readonly sources: string[],
    readonly destinations: string[],
  ) {}

  processImpulse(source: string, isHigh: boolean): Impulse[] {
    return this.destinations.map((module) => {
      return {
        source: this.name,
        isHigh,
        module,
      };
    });
  }
}

class FlipFlopModule implements Module {
  on: boolean = false;

  constructor(
    readonly name: string,
    readonly sources: string[],
    readonly destinations: string[],
  ) {}

  processImpulse(source: string, isHigh: boolean): Impulse[] {
    if (isHigh) {
      return [];
    }

    const currentOn = this.on;
    this.on = !this.on;

    return this.destinations.map((module) => {
      const isHigh = !currentOn;
      return {
        source: this.name,
        isHigh,
        module,
      };
    });
  }
}

class ConjunctionModule implements Module {
  memory: Record<string, boolean> = {};

  constructor(
    readonly name: string,
    readonly sources: string[],
    readonly destinations: string[],
  ) {
    sources.forEach((source) => (this.memory[source] = false));
  }

  processImpulse(source: string, isHigh: boolean): Impulse[] {
    this.memory[source] = isHigh;

    return this.destinations.map((module) => {
      const isLow = Object.values(this.memory).every((v) => v);

      return {
        source: this.name,
        isHigh: !isLow,
        module,
      };
    });
  }
}

const modules: Record<string, Module> = {};

input.forEach((inputModule) => {
  const sources = input
    .filter((m) => m.destinations.includes(inputModule.name))
    .map((m) => m.name);

  let module: Module;
  switch (inputModule.type) {
    case "broadcaster":
      module = new BroadcastModule(
        inputModule.name,
        sources,
        inputModule.destinations,
      );
      break;
    case "%":
      module = new FlipFlopModule(
        inputModule.name,
        sources,
        inputModule.destinations,
      );
      break;
    case "&":
      module = new ConjunctionModule(
        inputModule.name,
        sources,
        inputModule.destinations,
      );
      break;
  }

  modules[inputModule.name] = module;
});

let buttonPress = 0;

// The modules that connected with module that connected with rx
const qs: number[] = [];
const sv: number[] = [];
const pg: number[] = [];
const sp: number[] = [];

function pushButton(): boolean {
  buttonPress++;

  const impulses: Impulse[] = [
    { source: "button", isHigh: false, module: "broadcaster" },
  ];

  while (impulses.length !== 0) {
    const impulse = impulses.shift();
    if (impulse === undefined) {
      break;
    }

    const module = modules[impulse.module];
    if (module === undefined) {
      continue;
    }
    const newImpulses = module.processImpulse(impulse.source, impulse.isHigh);

    if (newImpulses.length > 0 && newImpulses[0].isHigh) {
      switch (impulse.module) {
        case "qs":
          qs.push(buttonPress);
          break;
        case "sv":
          sv.push(buttonPress);
          break;
        case "pg":
          pg.push(buttonPress);
          break;
        case "sp":
          sp.push(buttonPress);
          break;
      }
    }

    impulses.push(...newImpulses);
  }

  return false;
}

for (let i = 0; i < 10000; ++i) {
  pushButton();
}

function gcd(a: number, b: number): number {
  if (b === 0) return a;
  return gcd(b, a % b);
}

// Function to return LCM of two numbers
function lcm(a: number, b: number): number {
  return (a / gcd(a, b)) * b;
}

let result = lcm(qs[0], sv[0]);
result = lcm(result, pg[0]);
result = lcm(result, sp[0]);

console.log(`The result is ${result}`);
