import { Stack } from "aws-cdk-lib";
import type { Key } from "aws-cdk-lib/aws-kms";
import type { PublicHostedZone } from "aws-cdk-lib/aws-route53";
import type { Construct } from "constructs";
import { SsmQuickSetup } from "../constructs/SsmQuickSetup";
import { Network } from "../constructs/Network";
import { Server } from "../constructs/Server";
import { Lambda } from "../constructs/Lambda";
import { ApplicationsSignals } from "../constructs/ApplicationSignals";
import { LogGroup } from "aws-cdk-lib/aws-logs";
import { Bucket } from "aws-cdk-lib/aws-s3";

export type StackMainProps = {};

export class StackMain extends Stack {
  readonly encryptionKey: Key;
  readonly defaulteHostedZone: PublicHostedZone;

  constructor(scope: Construct, id: string, props: StackMainProps) {
    super(scope, id, props);

    // const network = new Network(this, "Network", {});
    // const ssmQuickSetup = new SsmQuickSetup(this, "SsmQuickSetup", {
    //   vpc: network.vpc,
    // });
    // new Server(this, "Server", {
    //   vpc: network.vpc,
    //   role: ssmQuickSetup.roleSsm2Ec2,
    // });
    new Lambda(this, "Lambda", {
      enableApplicationSignals: true,
      enableSlo: true,
    });
    // new Lambda(this, "Lambda2", {
    //   enableApplicationSignals: true,
    //   enableSlo: true,
    // });
    new ApplicationsSignals(this, "ApplicationsSignals", {
      transactionSearch: true,
    });

    // new LogGroup(this, "LogGroup");

    // new Bucket(this, "Bucket");
  }
}
