import { DependencyType } from "projen";
import { OwnBatteriesAppProject } from "../../src";
const name = "tanstack-project";
const project = new OwnBatteriesAppProject({
  name,
  isCdkProject: true,
  componentsCdk: {
    useApplicationSignals: true,
  },
  nodePackageOptions: {
    deps: [
      "@jaykingson/middyfied-lambda-handler",
      "@tanstack/react-start",
      "@tanstack/react-router",
      "vite",
      "react",
      "react-dom",
    ],
    devDeps: ["@types/react", "@types/react-dom", "vite-tsconfig-paths"],
  },
});

project.addTask("webapp:dev", {
  exec: "vite dev",
});
project.addTask("webapp:build", {
  exec: "vite build",
});

const packageJson = project.tryFindObjectFile("package.json");
packageJson?.addOverride("type", "module");

const tsconfigJson = project.tryFindObjectFile("tsconfig.json");
tsconfigJson?.addOverride("compilerOptions.jsx", "react-jsx");
tsconfigJson?.addOverride("compilerOptions.module", "ESNext");
tsconfigJson?.addOverride("compilerOptions.skipLibCheck", true);
tsconfigJson?.addOverride("compilerOptions.strictNullChecks", true);
tsconfigJson?.addOverride("compilerOptions.paths", {
  "~/*": ["./src/webappFrontend/*"],
});

project.addGitIgnore(".nitro");
project.addGitIgnore(".output");
project.addGitIgnore(".tanstack");

project.synth();
