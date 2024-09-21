#!/usr/bin/env node
import type { Environment } from "aws-cdk-lib";
import { App, Aspects, RemovalPolicy } from "aws-cdk-lib";
import { DeletionPolicySetter } from "../lib/aspects/DeletionPolicySetter";
import { AwsSolutionsChecks } from "cdk-nag";
import { StackMain } from "../lib/stacks/stack";

const app = new App();

const env: Environment = {
  account: process.env.APP_ACCOUNT,
  region: process.env.APP_REGION,
};

const appMain = () => {
  new StackMain(app, "StackMain", {});

  Aspects.of(app).add(new DeletionPolicySetter(RemovalPolicy.DESTROY));
  Aspects.of(app).add(new AwsSolutionsChecks());
};

appMain();
