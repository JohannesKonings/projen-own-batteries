import { Duration } from "aws-cdk-lib";
import { CfnServiceLevelObjective } from "aws-cdk-lib/aws-applicationsignals";
import { ManagedPolicy } from "aws-cdk-lib/aws-iam";
import {
  LayerVersion,
  LoggingFormat,
  Runtime,
  Tracing,
} from "aws-cdk-lib/aws-lambda";
import { NodejsFunction, OutputFormat } from "aws-cdk-lib/aws-lambda-nodejs";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { NagSuppressions } from "cdk-nag";
import { Construct } from "constructs";

type LambdaProps = {
  enableApplicationSignals: boolean;
  enableSlo: boolean; // Service Level Objective
};

// https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-Lambda.html
const LAMBDA_APPLICATION_SIGNALS_LAYER_ARN =
  "arn:aws:lambda:us-east-1:615299751070:layer:AWSOpenTelemetryDistroJs:8";
const LAMBDA_APPLICATION_SIGNALS_ENV = {
  AWS_LAMBDA_EXEC_WRAPPER: "/opt/otel-instrument",
};

export class Lambda extends Construct {
  constructor(scope: Construct, id: string, props: LambdaProps) {
    super(scope, id);

    const logGroup = new LogGroup(scope, `LogGroup${id}`, {
      retention: RetentionDays.THREE_MONTHS,
    });

    const lambda = new NodejsFunction(this, id, {
      runtime: Runtime.NODEJS_22_X,
      entry: "lib/constructs/Lambda.Lambda.ts",
      handler: "handler",
      loggingFormat: LoggingFormat.JSON,
      timeout: Duration.seconds(10),
      environment: props.enableApplicationSignals
        ? LAMBDA_APPLICATION_SIGNALS_ENV
        : {},
      logGroup,
      tracing: Tracing.ACTIVE,
      bundling: {
        format: OutputFormat.ESM,
        sourceMap: true,
        // prefer ECMAScript versions of dependencies
        mainFields: ["module", "main"],
        target: "esnext",
        // see https://github.com/evanw/esbuild/issues/3637 for details
        banner: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
        metafile: true,
      },
    });
    lambda.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        "CloudWatchLambdaApplicationSignalsExecutionRolePolicy",
      ),
    );

    NagSuppressions.addResourceSuppressions(
      lambda,
      [
        {
          id: "AwsSolutions-IAM4",
          reason: "CDK managed policy",
        },
        {
          id: "AwsSolutions-IAM5",
          reason: "CDK managed policy",
        },
      ],
      true,
    );
    const layerApplicationSignals = LayerVersion.fromLayerVersionArn(
      this,
      "LambdaApplicationSignalsLayer",
      LAMBDA_APPLICATION_SIGNALS_LAYER_ARN,
    );

    lambda.addLayers(layerApplicationSignals);

    if (props.enableSlo) {
      const slo = new CfnServiceLevelObjective(this, `Slo${id}`, {
        name: `SLO-${id}`,
        requestBasedSli: {
          requestBasedSliMetric: {
            metricType: "LATENCY",
            operationName: `${lambda.functionName}/FunctionHandler`,
            keyAttributes: {
              Type: "Service",
              Name: lambda.functionName,
              Environment: "lambda:default",
            },
          },
          comparisonOperator: "LessThanOrEqualTo",
          metricThreshold: 200,
        },
      });
      slo.node.addDependency(lambda);
    }
  }
}
