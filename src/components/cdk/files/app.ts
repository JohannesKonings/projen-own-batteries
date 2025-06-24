#!/usr/bin/env node
import type { Environment } from "aws-cdk-lib";
import { App, Aspects } from "aws-cdk-lib";
import { AwsSolutionsChecks } from "cdk-nag";

const app = new App();

const env: Environment = {
  account: process.env.APP_ACCOUNT,
  region: process.env.APP_REGION,
};

const appMain = () => {
  // add stack(s)
  Aspects.of(app).add(new AwsSolutionsChecks());
};

appMain();
