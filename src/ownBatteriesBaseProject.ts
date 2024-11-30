import { Project, ProjectOptions, ProjenrcFile } from "projen";
import { ComponentCdk } from "./components/cdk/componentCdk";
import { ComponentConstructNetwork } from "./components/cdk/network/componentConstructNetwork";
import { ComponentSops } from "./components/sops/componenteSops";
import { ComponentTypescript } from "./components/typescript/componentTypescript";
import { ComponentAspectDeletionPolicySetter } from "./components/cdk/deletionPolicy/ComponentAspectDeletionPolicySetter";
import { OwnBatteriesProjenrc } from "./ownBatteriesProjenrc";
export interface OwnBatteriesProjectBaseOptions extends ProjectOptions {
  readonly isCdkProject?: boolean;
  readonly componentSops?: boolean;
  readonly componentsCdk?: {
    useNetwork?: boolean;
    userNetworkCheck?: boolean;
  };
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

    new OwnBatteriesProjenrc(this);

    this.gitignore.exclude(".env");
    this.gitignore.exclude("cdk.out");

    this.defaultTask?.exec("npx tsx .projenrc.ts");

    new ComponentTypescript(this, {
      isCdkProject: options.isCdkProject,
    });

    if (options.isCdkProject) {
      new ComponentCdk(this);
      new ComponentAspectDeletionPolicySetter(this);
      if (options.componentsCdk?.useNetwork) {
        new ComponentConstructNetwork(this);
      }
    }

    if (options.componentSops) {
      new ComponentSops(this);
    }
  }
}
