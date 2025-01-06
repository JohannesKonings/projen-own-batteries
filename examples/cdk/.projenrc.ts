import { OwnBatteriesAppProject } from "../../src";
const name = "cdk-project";
const project = new OwnBatteriesAppProject({
  name,
  isCdkProject: true,
  componentsCdk: {
    useSsmQuickSetup: true,
    useNetwork: true,
    useServer: true,
  },
});

project.synth();
