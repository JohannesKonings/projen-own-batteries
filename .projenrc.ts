import { cdk, javascript } from "projen";
import { OwnBatteriesBaseProject } from "./src";
const name = "projen-own-batteries";
const scope = "@jaykingson";
const project = new cdk.JsiiProject({
  author: "Johannes Konings",
  authorAddress: "johannes.konings@outlook.com",
  defaultReleaseBranch: "main",
  // jsiiVersion: "~5.4.0",
  name,
  packageName: `${scope}/${name}`,
  npmAccess: javascript.NpmAccess.PUBLIC,
  projenrcTs: true,
  repositoryUrl: "git@github.com:JohannesKonings/projen-own-batteries.git",
  packageManager: javascript.NodePackageManager.PNPM,
  prettier: true,
  deps: [
    "projen",
    // compontents
    "aws-cdk-lib",
    "cdk-nag",
  ],
  peerDeps: ["projen", "constructs"],
});

project.eslint?.addIgnorePattern("examples/**/*");

// Global gitignore hardening for environment files (never commit secrets)
project.addGitIgnore("**/.env");
project.addGitIgnore("**/.env.*");
project.addGitIgnore("**/.env-*");
project.addGitIgnore("**/env");
project.addGitIgnore("**/env.*");
project.addGitIgnore("**/env-*");
// Keep sample env files if present
project.addGitIgnore("!**/.env.example");

// use esm
project.defaultTask?.reset();
project.defaultTask?.exec("pnpx tsx --tsconfig tsconfig.dev.json .projenrc.ts");

const packageJson = project.tryFindObjectFile("package.json");
packageJson?.addOverride("type", "module");

const tsconfigJson = project.tryFindObjectFile("tsconfig.dev.json");
if (!tsconfigJson) {
  throw new Error("tsconfig.dev.json not found");
}
tsconfigJson.addOverride("compilerOptions.module", "nodenext");
tsconfigJson.addOverride("compilerOptions.esModuleInterop", true);
tsconfigJson.addOverride("compilerOptions.target", "es2022");
tsconfigJson.addOverride("compilerOptions.lib", ["es2022"]);

// const tsconfigDevJson = project.tryFindObjectFile("tsconfig.dev.json");
// tsconfigDevJson?.addToArray("include", "examples/**/*");

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
