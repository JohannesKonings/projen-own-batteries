import * as fs from "node:fs";
import * as path from "node:path";
import {
  Component,
  DependencyType,
  JsonFile,
  SampleFile,
  SampleReadme,
} from "projen";

import type { OwnBatteriesAppProject } from "../../ownBatteriesAppProject";

export class ComponentCdk extends Component {
  readonly fileNameAppTs = "app.ts";
  readonly fileNameCdkJson = "cdk.json";
  constructor(project: OwnBatteriesAppProject) {
    super(project);

    // app.ts
    const contentAppTs = fs.readFileSync(
      path.join(__dirname, "files/app.ts"),
      "utf8",
    );

    new SampleFile(project, `bin/${this.fileNameAppTs}`, {
      contents: contentAppTs,
    });

    // lib
    new SampleReadme(project, {
      filename: "lib/stacks/README.md",
      contents: "# stacks",
    });

    // cdk.json
    const contentCdkJson = fs.readFileSync(
      path.join(__dirname, `files/${this.fileNameCdkJson}`),
      "utf8",
    );

    new JsonFile(project, this.fileNameCdkJson, {
      readonly: false,
      marker: true,
      newline: true,
      obj: JSON.parse(contentCdkJson),
      allowComments: false,
    });

    // tasks
    this.project.packageTask.exec("npm run cdk synth");

    // dependencies
    // cdk
    project.deps.addDependency("aws-cdk-lib", DependencyType.RUNTIME);
    project.deps.addDependency("constructs", DependencyType.RUNTIME);
    project.deps.addDependency("aws-cdk", DependencyType.DEVENV);
    project.deps.addDependency("esbuild", DependencyType.DEVENV);

    project.deps.addDependency("@types/aws-lambda", DependencyType.DEVENV);

    // powertools
    project.deps.addDependency(
      "@aws-lambda-powertools/batch",
      DependencyType.RUNTIME,
    );
    project.deps.addDependency(
      "@aws-lambda-powertools/logger",
      DependencyType.RUNTIME,
    );
    project.deps.addDependency(
      "@aws-lambda-powertools/metrics",
      DependencyType.RUNTIME,
    );
    project.deps.addDependency(
      "@aws-lambda-powertools/parameters",
      DependencyType.RUNTIME,
    );
    project.deps.addDependency(
      "@aws-lambda-powertools/tracer",
      DependencyType.RUNTIME,
    );
  }
}
