import { Project, ProjectOptions } from "projen";
interface OwnBatteriesProjectOptions extends Partial<ProjectOptions> {}

class OwnBatteriesProject extends Project {
  constructor(options: OwnBatteriesProjectOptions) {
    super({
      ...options,
      name: "projen-own-batteries",
    });
  }
}

export { OwnBatteriesProject, OwnBatteriesProjectOptions };
