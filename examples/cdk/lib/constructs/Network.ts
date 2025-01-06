import { SubnetType, Vpc, NatGatewayProvider } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

type NetworkProps = {};
export class Network extends Construct {
  readonly vpc: Vpc;
  constructor(scope: Construct, id: string, props: NetworkProps) {
    super(scope, id);

    this.vpc = new Vpc(this, "Vpc", {
      maxAzs: 1,
      natGateways: 1,
      subnetConfiguration: [
        {
          cidrMask: 28,
          name: "public",
          subnetType: SubnetType.PUBLIC,
        },
        {
          cidrMask: 28,
          name: "private-with-egress",
          subnetType: SubnetType.PRIVATE_WITH_EGRESS,
        },
        {
          cidrMask: 28,
          name: "private-isolated",
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });
  }
}
