import * as fs from "node:fs";
import * as path from "node:path";
import { Component, TextFile } from "projen";

import type { OwnBatteriesAppProject } from "../../../ownBatteriesAppProject";

export class ComponentConstructServer extends Component {
  readonly fileNameConstructServer = "Server.ts";
  constructor(project: OwnBatteriesAppProject) {
    super(project);

    const contentConstructServer = fs.readFileSync(
      path.join(__dirname, `files/${this.fileNameConstructServer}`),
      "utf8",
    );
    new TextFile(project, `lib/constructs/${this.fileNameConstructServer}`, {
      marker: true,
      readonly: false,
      lines: [contentConstructServer],
    });
  }
}
