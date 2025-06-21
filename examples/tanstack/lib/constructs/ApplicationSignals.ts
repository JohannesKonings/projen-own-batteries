import { Stack } from "aws-cdk-lib";

import { CfnTransactionSearchConfig } from "aws-cdk-lib/aws-xray";
import { CfnResourcePolicy } from "aws-cdk-lib/aws-logs";
import { Construct } from "constructs";

import { CfnDiscovery } from "aws-cdk-lib/aws-applicationsignals";

type ApplicationsSignalsProps = {
  transactionSearch?: boolean | CfnTransactionSearchConfig; // Enable transaction search
};
export class ApplicationsSignals extends Construct {
  constructor(scope: Construct, id: string, props: ApplicationsSignalsProps) {
    super(scope, id);

    const { account, partition, region } = Stack.of(this);

    new CfnDiscovery(this, "ApplicationSignalsDiscovery");

    if (props.transactionSearch === false) {
      return; // Skip creating the resource if transaction search is explicitly disabled
    }

    const transactionSearchAccess = new CfnResourcePolicy(
      this,
      "XRayLogResourcePolicy",
      {
        policyName: "TransactionSearchAccess",
        policyDocument: JSON.stringify({
          Version: "2012-10-17",
          Statement: [
            {
              Sid: "TransactionSearchXRayAccess",
              Effect: "Allow",
              Principal: {
                Service: "xray.amazonaws.com",
              },
              Action: "logs:PutLogEvents",
              Resource: [
                `arn:${partition}:logs:${region}:${account}:log-group:aws/spans:*`,
                `arn:${partition}:logs:${region}:${account}:log-group:/aws/application-signals/data:*`,
              ],
              Condition: {
                ArnLike: {
                  "aws:SourceArn": `arn:${partition}:xray:${region}:${account}:*`,
                },
                StringEquals: {
                  "aws:SourceAccount": account,
                },
              },
            },
          ],
        }),
      },
    );

    const transactionSearchConfig = new CfnTransactionSearchConfig(
      this,
      "XRayTransactionSearchConfig",
      {
        indexingPercentage:
          typeof props.transactionSearch === "object" &&
          props.transactionSearch !== null
            ? props.transactionSearch.indexingPercentage
            : 100,
      },
    );

    transactionSearchConfig.node.addDependency(transactionSearchAccess);
  }
}
