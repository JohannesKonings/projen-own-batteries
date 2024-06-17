import { Component, SampleFile } from "projen";
import { OwnBatteriesBaseProject } from "../../ownBatteriesBaseProject";

export class Sops extends Component {
  constructor(project: OwnBatteriesBaseProject) {
    super(project);

    const sopsVersion = "3.8.1"; // check release page for updates: https://github.com/getsops/sops/releases
    const path = "secrets";
    const filenameSecretsFile = "sops.yaml";
    const filenameSops = "sops";
    const filenameEnvs = ".env-sops";
    const fullPathSecretsFile = `${path}/${filenameSecretsFile}`;
    const fullPathSops = `${path}/${filenameSops}`;
    const fullPathEnvs = `${path}/${filenameEnvs}`;
    const AGE_PUBLIC_KEY_NAME = "AGE_PUBLIC_KEY";

    new SampleFile(project, fullPathSecretsFile, {
      contents: `# add secrets here
      secrets:`,
    });
    new SampleFile(project, fullPathEnvs, {
      contents: `AGE_PUBLIC_KEY=`,
    });

    project.gitignore.addPatterns(`${fullPathSops}`);
    project.gitignore.addPatterns(`${fullPathEnvs}`);

    project.tasks.addTask("sops-install", {
      description: `Install sops version ${sopsVersion}`,

      steps: [
        {
          exec: `curl -LO https://github.com/getsops/sops/releases/download/v${sopsVersion}/sops-v${sopsVersion}.linux.amd64`,
        },
        {
          exec: `mv sops-v${sopsVersion}.linux.amd64 ./${fullPathSops}`,
        },
        {
          exec: `chmod +x ./${fullPathSops}`,
        },
        {
          exec: `${fullPathSops} --version`,
        },
      ],
    });
    const taskSopsencrypt = project.tasks.addTask("sops-encrypt", {
      description: "Encrypt secrets",
      steps: [
        { exec: `. ${fullPathEnvs}` },
        {
          exec: `${fullPathSops} --encrypt --age $${AGE_PUBLIC_KEY_NAME}  -i ./${fullPathSecretsFile}`,
        },
      ],
    });
    taskSopsencrypt.env(
      `${AGE_PUBLIC_KEY_NAME}`,
      `$(. ${fullPathEnvs} && echo $${AGE_PUBLIC_KEY_NAME})`,
    );
    project.tasks.addTask("sops-edit", {
      description: "Edit secrets",
      exec: `${fullPathSops} ./${fullPathSecretsFile}`,
    });
    const taskSopsDecrypt = project.tasks.addTask("sops-decrypt", {
      description: "Decrypt secrets",
      steps: [
        { exec: `. ${fullPathEnvs}` },
        {
          exec: `${fullPathSops} --decrypt --age $${AGE_PUBLIC_KEY_NAME} ./${fullPathSecretsFile}`,
        },
      ],
    });
    taskSopsDecrypt.env(
      `${AGE_PUBLIC_KEY_NAME}`,
      `$(. ${fullPathEnvs} && echo $${AGE_PUBLIC_KEY_NAME})`,
    );
  }
}
