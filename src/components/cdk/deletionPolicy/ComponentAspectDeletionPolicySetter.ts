import * as fs from "node:fs";
import * as path from "node:path";
import { Component, TextFile } from "projen";

import type { OwnBatteriesAppProject } from "../../../ownBatteriesAppProject";

export class ComponentAspectDeletionPolicySetter extends Component {
  readonly fileNameAspectDeletionPolicySetter = "DeletionPolicySetter.ts";
  constructor(project: OwnBatteriesAppProject) {
    super(project);

    const contentAspectDeletionPolicySetter = fs.readFileSync(
      path.join(__dirname, `files/${this.fileNameAspectDeletionPolicySetter}`),
      "utf8",
    );
    new TextFile(
      project,
      `lib/aspects/${this.fileNameAspectDeletionPolicySetter}`,
      {
        marker: true,
        readonly: false,
        lines: [contentAspectDeletionPolicySetter],
      },
    );
  }
}
