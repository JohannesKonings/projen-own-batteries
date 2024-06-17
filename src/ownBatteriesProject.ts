import {
  OwnBatteriesBaseProject,
  OwnBatteriesProjectBaseOptions,
} from "./ownBatteriesBaseProject";
export interface OwnBatteriesProjectOptions
  extends OwnBatteriesProjectBaseOptions {}

/**
 * TypeScript library
 *
 * @pjid jaykingson-projen-own-batteries-project
 */
export class OwnBatteriesProject extends OwnBatteriesBaseProject {
  constructor(options: OwnBatteriesProjectOptions) {
    super({
      ...options,
    });
  }
}
