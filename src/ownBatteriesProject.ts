import { Project, ProjectOptions } from "projen";
interface OwnBatteriesProjectOptions extends Partial<ProjectOptions> {}

/**
 * TypeScript library
 *
 * @pjid jaykingson-projen-own-batteries
 */
class OwnBatteriesProject extends Project {
  constructor(options: OwnBatteriesProjectOptions) {
    super({
      ...options,
      name: "projen-own-batteries",
    });
  }
}

export { OwnBatteriesProject, OwnBatteriesProjectOptions };
