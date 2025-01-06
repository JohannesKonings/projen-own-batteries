import { Stack } from "aws-cdk-lib";
import type { Key } from "aws-cdk-lib/aws-kms";
import type { PublicHostedZone } from "aws-cdk-lib/aws-route53";
import type { Construct } from "constructs";
import { SsmQuickSetup } from "../constructs/SsmQuickSetup";
import { Network } from "../constructs/Network";
import { Server } from "../constructs/Server";
import { Lambda } from "../constructs/Lambda";
import { ApplicationsSignals } from "../constructs/ApplicationSignals";

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
    });
    new ApplicationsSignals(this, "ApplicationsSignals", {
      enableTransactionSearch: true,
    });
  }
}
