import { OwnBatteriesProject } from "../src";

test("OwnBatteriesProject", () => {
  expect(new OwnBatteriesProject({}).name).toBe("projen-own-batteries");
});
