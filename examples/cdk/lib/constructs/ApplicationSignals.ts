import { Stack } from "aws-cdk-lib";
import { Effect, PolicyStatement, Role } from "aws-cdk-lib/aws-iam";
import {
  AwsCustomResource,
  AwsCustomResourcePolicy,
  PhysicalResourceId,
} from "aws-cdk-lib/custom-resources";
import { type NagPackSuppression, NagSuppressions } from "cdk-nag";
import { Construct } from "constructs";

type ApplicationsSignalsProps = {
  enableTransactionSearch?: boolean;
};
export class ApplicationsSignals extends Construct {
  constructor(scope: Construct, id: string, props: ApplicationsSignalsProps) {
    super(scope, id);

    const { account, region, stackName } = Stack.of(this);

    const serviceLinkeRoleArnApplicationSignals = `arn:aws:iam::${account}:role/aws-service-role/application-signals.cloudwatch.amazonaws.com/AWSServiceRoleForCloudWatchApplicationSignals`;
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
        `/${stackName}/${customResourceId}/ServiceRole/Resource`,
        `/${stackName}/${customResourceId}/Resource`,
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

    if (props.enableTransactionSearch) {
      const { account, region, stackName } = Stack.of(this);

      // https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-Transaction-Search-getting-started.html#w24aac24c21c13b9
      const applicationSignalsTransactionSearchLogsResourcePolicy =
        new AwsCustomResource(
          this,
          "ApplicationSignalsTransactionSearchLogsResourcePolicy",
          {
            onCreate: {
              service: "@aws-sdk/client-cloudwatch-logs",
              action: "PutResourcePolicy",
              parameters: {
                policyName:
                  "ApplicationSignalsTransactionSearchLogsResourcePolicy",
                policyDocument: JSON.stringify({
                  Version: "2012-10-17",
                  Statement: [
                    {
                      Sid: "TransactionSearchXRayAccess",
                      Effect: "Allow",
                      Principal: {
                        Service: "xray.amazonaws.com",
                      },
                      Action: ["logs:PutLogEvents", "logs:CreateLogStream"],
                      Resource: [
                        `arn:aws:logs:${region}:${account}:log-group:aws/spans:*`,
                        `arn:aws:logs:${region}:${account}:log-group:/aws/application-signals/data:*`,
                      ],
                      Condition: {
                        ArnLike: {
                          "aws:SourceArn": `arn:aws:xray:${region}:${account}:*`,
                        },
                        StringEquals: {
                          "aws:SourceAccount": account,
                        },
                      },
                    },
                  ],
                }),
              },
              physicalResourceId: PhysicalResourceId.of(
                "ApplicationSignalsTransactionSearchLogsResourcePolicy",
              ),
            },
            policy: AwsCustomResourcePolicy.fromSdkCalls({
              resources: AwsCustomResourcePolicy.ANY_RESOURCE,
            }),
          },
        );
      const applicationSignalsTransactionSearchXraySegmentDestination =
        new AwsCustomResource(
          this,
          "ApplicationSignalsTransactionSearchXraySegmentDestination",
          {
            onCreate: {
              service: "@aws-sdk/client-xray",
              action: "UpdateTraceSegmentDestination",
              parameters: {
                Destination: "CloudWatchLogs",
              },
              physicalResourceId: PhysicalResourceId.of(
                "ApplicationSignalsTransactionSearchXraySegmentDestination",
              ),
            },
            installLatestAwsSdk: true,
            // policy: AwsCustomResourcePolicy.fromSdkCalls({
            //   resources: AwsCustomResourcePolicy.ANY_RESOURCE,
            // }),
            policy: AwsCustomResourcePolicy.fromStatements([
              new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ["logs:PutRetentionPolicy"],
                resources: [
                  `arn:aws:logs:${region}:${account}:log-group:aws/spans:log-stream:`,
                ],
              }),
              new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ["xray:UpdateTraceSegmentDestination"],
                resources: ["*"],
              }),
            ]),
          },
        );
      applicationSignalsTransactionSearchXraySegmentDestination.node.addDependency(
        applicationSignalsTransactionSearchLogsResourcePolicy,
      );
      const applicationSignalsTransactionSearchXrayIndexRule =
        new AwsCustomResource(
          this,
          "ApplicationSignalsTransactionSearchXrayIndexRule",
          {
            onCreate: {
              service: "@aws-sdk/client-xray",
              action: "UpdateIndexingRule",
              parameters: {
                Name: "Default",
                Rule: {
                  Probabilistic: {
                    DesiredSamplingPercentage: 100,
                  },
                },
              },
              physicalResourceId: PhysicalResourceId.of(
                "ApplicationSignalsTransactionSearchXrayIndexRule",
              ),
            },
            policy: AwsCustomResourcePolicy.fromSdkCalls({
              resources: AwsCustomResourcePolicy.ANY_RESOURCE,
            }),
          },
        );
      NagSuppressions.addResourceSuppressions(
        [
          applicationSignalsTransactionSearchXraySegmentDestination,
          applicationSignalsTransactionSearchLogsResourcePolicy,
          applicationSignalsTransactionSearchXrayIndexRule,
        ],
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
}
