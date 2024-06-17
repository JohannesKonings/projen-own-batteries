import { OwnBatteriesProject } from "../src";

test("OwnBatteriesProject", () => {
  expect(
    new OwnBatteriesProject({
      name: "projen-own-batteries",
    }).name,
  ).toBe("projen-own-batteries");
});
