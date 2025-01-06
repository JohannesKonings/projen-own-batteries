import { Resource, Stack } from "aws-cdk-lib";
import { Effect, PolicyStatement, Role } from "aws-cdk-lib/aws-iam";
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
} from "aws-cdk-lib/custom-resources";
import { NagSuppressions } from "cdk-nag";
import { Construct } from "constructs";

type ApplicationsSignalsProps = {};
export class ApplicationsSignals extends Resource {
  constructor(scope: Construct, id: string, props: ApplicationsSignalsProps) {
    super(scope, id);

    const serviceLinkeRoleArnApplicationSignals = `arn:aws:iam::${Stack.of(this).account}:role/aws-service-role/application-signals.cloudwatch.amazonaws.com/AWSServiceRoleForCloudWatchApplicationSignals`;
    const applicationSignalsStartDiscovery = new AwsCustomResource(
      this,
      "ApplicationSignalsStartDiscovery",
      {
        onCreate: {
          service: "@aws-sdk/client-application-signals",
          action: "StartDiscovery",
          physicalResourceId: PhysicalResourceId.of(
            "ApplicationSignalsStartDiscovery",
          ),
        },
        // policy: AwsCustomResourcePolicy.fromSdkCalls({ resources: AwsCustomResourcePolicy.ANY_RESOURCE }),
        policy: AwsCustomResourcePolicy.fromStatements([
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ["iam:CreateServiceLinkedRole"],
            resources: [serviceLinkeRoleArnApplicationSignals],
          }),
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ["application-signals:StartDiscovery"],
            resources: ["*"],
          }),
        ]),
      },
    );

    const customResourceId = `AWS${AwsCustomResource.PROVIDER_FUNCTION_UUID.replaceAll("-", "")}`;
    NagSuppressions.addResourceSuppressionsByPath(
      Stack.of(this),
      [
        `/${Stack.of(this).stackName}/${customResourceId}/ServiceRole/Resource`,
        `/${Stack.of(this).stackName}/${customResourceId}/Resource`,
      ],
      [
        {
          id: "AwsSolutions-L1",
          reason: "CDK managed lambda function",
        },
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

    NagSuppressions.addResourceSuppressions(
      applicationSignalsStartDiscovery,
      [
        {
          id: "AwsSolutions-IAM5",
          reason: "CDK managed policy",
        },
      ],
      true,
    );
  }
}
