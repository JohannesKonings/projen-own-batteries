import {
  Vpc,
  Instance,
  InstanceType,
  MachineImage,
  InstanceClass,
  InstanceSize,
} from "aws-cdk-lib/aws-ec2";
import { Role } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

type ServerProps = {
  vpc: Vpc;
  role: Role;
};
export class Server extends Construct {
  readonly instance: Instance;
  constructor(scope: Construct, id: string, props: ServerProps) {
    super(scope, id);

    this.instance = new Instance(this, "Instance", {
      vpc: props.vpc,
      instanceType: InstanceType.of(InstanceClass.T2, InstanceSize.MICRO),
      machineImage: MachineImage.latestAmazonLinux2023(),
      role: props.role,
    });
  }
}
