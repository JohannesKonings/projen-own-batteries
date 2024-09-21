import { Stack } from "aws-cdk-lib";
import type { Key } from "aws-cdk-lib/aws-kms";
import type { PublicHostedZone } from "aws-cdk-lib/aws-route53";
import type { Construct } from "constructs";
import { Network } from "../constructs/Network";

export type StackMainProps = {};

export class StackMain extends Stack {
  readonly encryptionKey: Key;
  readonly defaulteHostedZone: PublicHostedZone;

  constructor(scope: Construct, id: string, props: StackMainProps) {
    super(scope, id, props);

    new Network(this, "Network", {});
  }
}
