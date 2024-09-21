import * as fs from "node:fs";
import * as path from "node:path";
import { Component, TextFile } from "projen";

import type { OwnBatteriesAppProject } from "../../../ownBatteriesAppProject";

export class ComponentConstructNetwork extends Component {
  readonly fileNameConstructNetwork = "Network.ts";
  constructor(project: OwnBatteriesAppProject) {
    super(project);

    const contentConstructNetwork = fs.readFileSync(
      path.join(__dirname, `files/${this.fileNameConstructNetwork}`),
      "utf8",
    );
    new TextFile(project, `lib/constructs/${this.fileNameConstructNetwork}`, {
      marker: true,
      readonly: false,
      lines: [contentConstructNetwork],
    });
  }
}
