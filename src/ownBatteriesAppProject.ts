import { javascript } from "projen";
import {
  OwnBatteriesBaseProject,
  OwnBatteriesProjectBaseOptions,
} from "./ownBatteriesBaseProject";
export interface OwnBatteriesAppProjectOptions
  extends OwnBatteriesProjectBaseOptions {}

/**
 * TypeScript library
 *
 * @pjid jaykingson-projen-own-batteries-project
 */
export class OwnBatteriesAppProject extends OwnBatteriesBaseProject {
  constructor(options: OwnBatteriesAppProjectOptions) {
    super({
      ...options,
    });

    const nodePackage = new javascript.NodePackage(this, {
      packageManager: javascript.NodePackageManager.NPM,
      licensed: false,
      npmProvenance: false,
      entrypoint: "",
    });

    if (options.isCdkProject) {
      nodePackage.setScript("cdk", "cdk");
    }
  }
}
