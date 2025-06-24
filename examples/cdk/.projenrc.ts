import { DependencyType } from "projen";
import { OwnBatteriesAppProject } from "../../src";
const name = "cdk-project";
const project = new OwnBatteriesAppProject({
  name,
  isCdkProject: true,
  componentsCdk: {
    useSsmQuickSetup: true,
    useNetwork: true,
    useServer: true,
    useApplicationSignals: true,
  },
});

project.deps.addDependency(
  "@jaykingson/middyfied-lambda-handler",
  DependencyType.RUNTIME,
);

project.synth();
