import { cdk, javascript } from "projen";
const name = "projen-own-batteries";
const scope = "@jaykingson";
const project = new cdk.JsiiProject({
  author: "Johannes Konings",
  authorAddress: "mail@johanneskonings.dev",
  defaultReleaseBranch: "main",
  jsiiVersion: "~5.4.0",
  name,
  packageName: `${scope}/${name}`,
  npmAccess: javascript.NpmAccess.PUBLIC,
  projenrcTs: true,
  repositoryUrl: "git@github.com:JohannesKonings/projen-own-batteries.git",
  packageManager: javascript.NodePackageManager.NPM,
  prettier: true,
  deps: ["projen"],
});
project.synth();
