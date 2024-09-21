import { OwnBatteriesAppProject } from "../../src";
const name = "cdk-project";
const project = new OwnBatteriesAppProject({
  name,
  isCdkProject: true,
  componentsCdk: {
    useNetwork: true,
  },
});

project.synth();
