import { Project, ProjenrcFile } from "projen";

const DEFAULT_FILENAME = ".projenrc.ts";

export class OwnBatteriesProjenrc extends ProjenrcFile {
  public readonly filePath: string;
  constructor(project: Project) {
    super(project);
    this.filePath = DEFAULT_FILENAME;
  }
}
