import { SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { Construct } from "constructs";

type NetworkProps = {};
export class Network extends Construct {
  readonly vpc: Vpc;
  constructor(scope: Construct, id: string, props: NetworkProps) {
    super(scope, id);

    this.vpc = new Vpc(this, "Vpc", {
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 28,
          name: "private",
          subnetType: SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });
  }
}
