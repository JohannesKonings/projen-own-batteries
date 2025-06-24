import type { ProjectOptions } from "projen";
import { Project } from "projen";
import { ComponentCdk } from "./components/cdk/componentCdk";
import { ComponentAspectDeletionPolicySetter } from "./components/cdk/deletionPolicy/ComponentAspectDeletionPolicySetter";
import { ComponentConstructNetwork } from "./components/cdk/network/componentConstructNetwork";
import { ComponentConstructServer } from "./components/cdk/server/componentConstructServer";
import { ComponentSops } from "./components/sops/componenteSops";
import { ComponentTypescript } from "./components/typescript/componentTypescript";
import { OwnBatteriesProjenrc } from "./ownBatteriesProjenrc";
import { ComponentConstructSsmQuickSetup } from "./components/cdk/ssmQuickSetup/componentConstructSsmQuickSetup";
import { ComponentApplicationSignals } from "./components/cdk/cloudwatch/componentApplicationSignals";
import type { NodePackageOptions } from "projen/lib/javascript";
export interface OwnBatteriesProjectBaseOptions extends ProjectOptions {
  readonly isCdkProject?: boolean;
  readonly componentSops?: boolean;
  readonly componentsCdk?: {
    useNetwork?: boolean;
    userNetworkCheck?: boolean;
    useServer?: boolean;
    useSsmQuickSetup?: boolean;
    useApplicationSignals?: boolean;
  };
  readonly projenOptions?: Partial<ProjectOptions>;
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
      if (options.componentsCdk?.useSsmQuickSetup) {
        new ComponentConstructSsmQuickSetup(this);
      }
      if (options.componentsCdk?.useNetwork) {
        new ComponentConstructNetwork(this);
      }
      if (options.componentsCdk?.useServer) {
        new ComponentConstructServer(this);
      }
      if (options.componentsCdk?.useApplicationSignals) {
        new ComponentApplicationSignals(this);
      }
    }

    if (options.componentSops) {
      new ComponentSops(this);
    }
  }
}
