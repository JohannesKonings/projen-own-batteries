import { javascript } from "projen";
import type { OwnBatteriesProjectBaseOptions } from "./ownBatteriesBaseProject";
import { OwnBatteriesBaseProject } from "./ownBatteriesBaseProject";
import type { NodePackageOptions } from "projen/lib/javascript";
export interface OwnBatteriesAppProjectOptions
  extends OwnBatteriesProjectBaseOptions {
  readonly nodePackageOptions?: Partial<NodePackageOptions>;
}

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
      packageManager: javascript.NodePackageManager.PNPM,
      licensed: false,
      npmProvenance: false,
      entrypoint: "",
      ...options.nodePackageOptions,
    });

    if (options.isCdkProject) {
      nodePackage.setScript("cdk", "cdk");
    }
  }
}
