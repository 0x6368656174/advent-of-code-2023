import console from "node:console";
import { parseInput } from "./parse-input.js";
import { init } from "z3-solver";

const input = await parseInput();

const { Context } = await init();
// eslint-disable-next-line @typescript-eslint/unbound-method
const { Solver, Real, Eq, Sum, Product } = Context("main");

const x = Real.const("x");
const y = Real.const("y");
const z = Real.const("z");

const vx = Real.const("vx");
const vy = Real.const("vy");
const vz = Real.const("vz");

const solver = new Solver();

input.forEach((vector, i) => {
  const time = Real.const(`t_${i}`);

  const { position, velocity } = vector;

  solver.add(
    Eq(
      Sum(x, Product(vx, time)),
      Sum(Real.val(position[0]), Product(Real.val(velocity[0]), time)),
    ),
  );
  solver.add(
    Eq(
      Sum(y, Product(vy, time)),
      Sum(Real.val(position[1]), Product(Real.val(velocity[1]), time)),
    ),
  );
  solver.add(
    Eq(
      Sum(z, Product(vz, time)),
      Sum(Real.val(position[2]), Product(Real.val(velocity[2]), time)),
    ),
  );
});

await solver.check();

const result = solver
  .model()
  .eval(Sum(x, y, z))
  .params()[0] as number;

console.log(`The result is ${result}`);

process.exit(0);
