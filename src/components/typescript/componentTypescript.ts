import { Component, DependencyType, JsonFile } from "projen";
import {
  type TypescriptConfigOptions,
  TypeScriptModuleDetection,
  TypeScriptModuleResolution,
} from "projen/lib/javascript/index.js";

import type { OwnBatteriesBaseProject } from "../../ownBatteriesBaseProject";

type ComponentTypescriptOptions = {
  /**
   * Is this a cdk project?
   */
  isCdkProject?: boolean;
};

/**
 * Typescript Component
 */
export class ComponentTypescript extends Component {
  readonly fileNameTsconfigJson = "tsconfig.json";

  /**
   * Constructor
   * @param project
   * @param options
   */
  constructor(
    project: OwnBatteriesBaseProject,
    options?: ComponentTypescriptOptions,
  ) {
    super(project);

    const exclude = ["node_modules", "*.mjs"];
    if (options?.isCdkProject) {
      exclude.push("cdk.out");
    }

    let tsconfigJson: TypescriptConfigOptions = {
      compilerOptions: {
        allowJs: true,
        allowSyntheticDefaultImports: true,
        alwaysStrict: true,
        declaration: true,
        esModuleInterop: true,
        experimentalDecorators: true,
        isolatedModules: true,
        lib: ["es2022", "dom"],
        module: "preserve",
        moduleResolution: TypeScriptModuleResolution.BUNDLER,
        moduleDetection: TypeScriptModuleDetection.FORCE,
        noEmit: true,
        noImplicitOverride: true,
        noImplicitReturns: true,
        noUncheckedIndexedAccess: true,
        resolveJsonModule: true,
        skipLibCheck: true,
        sourceMap: true,
        strict: true,
        target: "ES2022",
        typeRoots: ["./node_modules/@types"],
        verbatimModuleSyntax: true,
      },
      include: [".projenrc.ts"],
      exclude,
    };

    new JsonFile(project, this.fileNameTsconfigJson, {
      readonly: false,
      obj: tsconfigJson,
      marker: true,
      newline: true,
      allowComments: true,
    });

    // this.project.defaultTask?.exec(
    //   `npx eslint ${this.fileNameTsconfigJson} --fix`,
    // );

    // dependencies
    this.project.deps.addDependency("zod", DependencyType.RUNTIME);
    this.project.deps.addDependency("typescript", DependencyType.DEVENV);
    this.project.deps.addDependency("tsx", DependencyType.DEVENV);
    this.project.deps.addDependency("@types/node", DependencyType.DEVENV);
  }
}
