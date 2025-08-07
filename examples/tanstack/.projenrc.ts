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
      "@tanstack/react-router-devtools",

      "vite",
      "react",
      "react-dom",

      "better-auth",

      "@tanstack/react-router-with-query",
      "@tanstack/react-query",
      "@tanstack/react-query-devtools",
      "@trpc/client",
      "@trpc/server",
      "@trpc/tanstack-react-query",
      "superjson",

      // lambda@edge
      "@aws-sdk/signature-v4",
      "@aws-sdk/credential-providers",
      "@aws-sdk/protocol-http",

      "nitropack",
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
  "~/*": ["./src/webapp/*"],
});
tsconfigJson?.addOverride("include", [".projenrc.ts", "src/**/*"]);

project.addGitIgnore(".nitro");
project.addGitIgnore(".output");
project.addGitIgnore(".tanstack");
project.addGitIgnore(".env-prod");

project.synth();
