import * as fs from "node:fs";
import * as path from "node:path";
import { Component, TextFile } from "projen";

import type { OwnBatteriesAppProject } from "../../../ownBatteriesAppProject";

const __dirname = import.meta.dirname;

export class ComponentApplicationSignals extends Component {
  readonly fileNameApplicationSignals = "ApplicationSignals.ts";
  constructor(project: OwnBatteriesAppProject) {
    super(project);

    const contentApplicationSignals = fs.readFileSync(
      path.join(__dirname, `files/${this.fileNameApplicationSignals}`),
      "utf8",
    );
    new TextFile(project, `lib/constructs/${this.fileNameApplicationSignals}`, {
      marker: true,
      readonly: false,
      lines: [contentApplicationSignals],
    });
  }
}
