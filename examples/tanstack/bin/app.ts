#!/usr/bin/env node
import type { Environment } from "aws-cdk-lib";
import { App, Aspects } from "aws-cdk-lib";
import { AwsSolutionsChecks } from "cdk-nag";
import { StackMain } from "../lib/stacks/stack";

const app = new App();

const env: Environment = {
  account: process.env.APP_ACCOUNT,
  region: process.env.APP_REGION,
};

const appMain = () => {
  new StackMain(app, "TanStackStartCDK", {
    env: {
      ...env,
      region: "us-east-1", // lambda@edge requires us-east-1
    },
  });

  Aspects.of(app).add(new AwsSolutionsChecks());
};

appMain();
