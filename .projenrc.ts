import { cdk, javascript } from "projen";
import { OwnBatteriesBaseProject } from "./src";
const name = "projen-own-batteries";
const scope = "@jaykingson";
const project = new cdk.JsiiProject({
  author: "Johannes Konings",
  authorAddress: "johannes.konings@outlook.com",
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
  peerDeps: ["projen", "constructs"],
});

// sup projects for quick checks on snyth files
const folderName = "projectTypesFiles";
const typescriptBaseProjectName = "baseTypescriptProject";
const typescriptBaseProject = new OwnBatteriesBaseProject({
  name: typescriptBaseProjectName,
  parent: project,
  outdir: `${folderName}/${typescriptBaseProjectName}`,
  componentSops: true,
});
typescriptBaseProject.synth();

project.synth();
