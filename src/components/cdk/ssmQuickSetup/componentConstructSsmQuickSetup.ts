import * as fs from "node:fs";
import * as path from "node:path";
import { Component, TextFile } from "projen";

import type { OwnBatteriesAppProject } from "../../../ownBatteriesAppProject";

export class ComponentConstructSsmQuickSetup extends Component {
  readonly fileNameConstructSsmQuickSetup = "SsmQuickSetup.ts";
  constructor(project: OwnBatteriesAppProject) {
    super(project);

    const contentConstructSsmQuickSetup = fs.readFileSync(
      path.join(__dirname, `files/${this.fileNameConstructSsmQuickSetup}`),
      "utf8",
    );
    new TextFile(
      project,
      `lib/constructs/${this.fileNameConstructSsmQuickSetup}`,
      {
        marker: true,
        readonly: false,
        lines: [contentConstructSsmQuickSetup],
      },
    );
  }
}
