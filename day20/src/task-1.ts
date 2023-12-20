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

function pushButton(): { low: number; high: number } {
  let low = 0;
  let high = 0;
  const impulses: Impulse[] = [
    { source: "button", isHigh: false, module: "broadcaster" },
  ];

  while (impulses.length !== 0) {
    const impulse = impulses.shift();
    if (impulse === undefined) {
      break;
    }

    if (impulse.isHigh) {
      high++;
    } else {
      low++;
    }

    const module = modules[impulse.module];
    if (module === undefined) {
      continue;
    }
    const newImpulses = module.processImpulse(impulse.source, impulse.isHigh);

    impulses.push(...newImpulses);
  }

  return { low, high };
}

let lows = 0;
let highs = 0;

for (let i = 0; i < 1000; ++i) {
  const { low, high } = pushButton();
  lows += low;
  highs += high;
}

const result = lows * highs;

console.log(`The result is ${result}`);
