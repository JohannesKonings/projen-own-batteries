import { Duration } from "aws-cdk-lib";
import { ManagedPolicy } from "aws-cdk-lib/aws-iam";
import { LayerVersion, Runtime, Tracing } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { LogGroup, RetentionDays } from "aws-cdk-lib/aws-logs";
import { NagSuppressions } from "cdk-nag";
import { Construct } from "constructs";

type LambdaProps = {
  enableApplicationSignals: boolean;
};

// https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Application-Signals-Enable-Lambda.html
const LAMBDA_APPLICATION_SIGNALS_LAYER_ARN =
  "arn:aws:lambda:us-east-1:615299751070:layer:AWSOpenTelemetryDistroJs:5";
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
      timeout: Duration.seconds(10),
      environment: props.enableApplicationSignals
        ? LAMBDA_APPLICATION_SIGNALS_ENV
        : {},
      logGroup,
      tracing: Tracing.ACTIVE,
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
  }
}
