import { Project, ProjectOptions } from "projen";
import { Sops } from "./components/sops/componente-sops";
export interface OwnBatteriesProjectBaseOptions extends ProjectOptions {
  readonly componentSops?: boolean;
}

/**
 * TypeScript library
 *
 * @pjid jaykingson-projen-own-batteries-base-project
 */
export class OwnBatteriesBaseProject extends Project {
  constructor(options: OwnBatteriesProjectBaseOptions) {
    super({
      ...options,
    });

    if (options.componentSops) {
      new Sops(this);
    }
  }
}
