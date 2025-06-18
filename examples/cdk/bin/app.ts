#!/usr/bin/env node
import type { Environment } from "aws-cdk-lib";
import { App, Aspects, PropertyInjectors, RemovalPolicy } from "aws-cdk-lib";
import { DeletionPolicySetter } from "../lib/aspects/DeletionPolicySetter";
import { AwsSolutionsChecks, NagSuppressions } from "cdk-nag";
import { StackMain } from "../lib/stacks/stack";
import { BucketAutoDeletionSetter } from "../lib/propertyInjectors/BucketAutoDeletionSetter";

const app = new App();

const env: Environment = {
  account: process.env.APP_ACCOUNT,
  region: process.env.APP_REGION,
};

const ephemeralStacksCleanup = () => {
  Aspects.of(app).add(new DeletionPolicySetter(RemovalPolicy.DESTROY));
  PropertyInjectors.of(app).add(new BucketAutoDeletionSetter(true));
};

const appMain = (isEphemeral: boolean) => {
  if (isEphemeral) {
    ephemeralStacksCleanup();
  }

  const stack = new StackMain(app, "StackMain", {});
  NagSuppressions.addStackSuppressions(stack, [
    {
      id: "AwsSolutions-IAM4",
      reason: "will checked later",
    },
    {
      id: "AwsSolutions-IAM5",
      reason: "will checked later",
    },
  ]);

  Aspects.of(app).add(new AwsSolutionsChecks());
};

appMain(process.env.EPHEMERAL_STACKS === "true");
