import { CfnResource, Stack } from "aws-cdk-lib";
import {
  InterfaceVpcEndpointAwsService,
  IVpc,
  SubnetType,
} from "aws-cdk-lib/aws-ec2";
import {
  ArnPrincipal,
  ManagedPolicy,
  PolicyDocument,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from "aws-cdk-lib/aws-iam";
import { NagSuppressions } from "cdk-nag";
import { Construct } from "constructs";

type SsmQuickSetupProps = {
  vpc: IVpc;
};
export class SsmQuickSetup extends Construct {
  // readonly instanceProfile: InstanceProfile;
  readonly roleSsm2Ec2: Role;
  constructor(scope: Construct, id: string, props: SsmQuickSetupProps) {
    super(scope, id);

    // ssm vpc endpoint
    // https://github.com/aws-samples/aws-cdk-examples/tree/main/typescript/ec2-ssm-local-zone
    const subnetsPrivateIsolated = props.vpc.selectSubnets({
      subnetType: SubnetType.PRIVATE_ISOLATED,
    });
    props.vpc.addInterfaceEndpoint("VpcEndpointSsm", {
      service: InterfaceVpcEndpointAwsService.SSM,
      privateDnsEnabled: true,
      subnets: subnetsPrivateIsolated,
    });
    props.vpc.addInterfaceEndpoint("VpcEndpointSsmMessages", {
      service: InterfaceVpcEndpointAwsService.SSM_MESSAGES,
      privateDnsEnabled: true,
      subnets: subnetsPrivateIsolated,
    });
    props.vpc.addInterfaceEndpoint("VpcEndpointEc2Message", {
      service: InterfaceVpcEndpointAwsService.EC2_MESSAGES,
      privateDnsEnabled: true,
      subnets: subnetsPrivateIsolated,
    });

    // https://docs.aws.amazon.com/systems-manager/latest/userguide/quick-setup-api.html
    // https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-ssmquicksetup-configurationmanager-configurationdefinition.html
    // https://awscli.amazonaws.com/v2/documentation/api/latest/reference/ssm-quicksetup/get-configuration-manager.html
    // https://awscli.amazonaws.com/v2/documentation/api/latest/reference/ssm-quicksetup/list-configuration-managers.html

    const account = Stack.of(this).account;
    const region = Stack.of(this).region;

    const roleLocalDeploymentAdministrationName =
      "RoleLocalDeploymentAdministration";

    const roleLocalDeploymentAdministration = new Role(
      this,
      "RoleLocalDeploymentAdministration",
      {
        assumedBy: new ServicePrincipal("cloudformation.amazonaws.com"),
        inlinePolicies: {
          assumeDeploymentExecutionRole: new PolicyDocument({
            statements: [
              new PolicyStatement({
                actions: ["sts:AssumeRole"],
                resources: [
                  `arn:aws:iam::${account}:role/${roleLocalDeploymentAdministrationName}`,
                ],
              }),
            ],
          }),
        },
      },
    );

    const roleLocalDeploymentExecution = new Role(
      this,
      "RoleLocalDeploymentExecution",
      {
        roleName: roleLocalDeploymentAdministrationName,
        assumedBy: new ArnPrincipal(roleLocalDeploymentAdministration.roleArn),
      },
    );
    roleLocalDeploymentExecution.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName(
        "AWSQuickSetupDeploymentRolePolicy",
      ),
    );
    NagSuppressions.addResourceSuppressions(roleLocalDeploymentExecution, [
      {
        id: "AwsSolutions-IAM4",
        reason: "use the same policy as the aws console quick setup does",
      },
    ]);

    const quickSetupHostMgmt = new CfnResource(
      this,
      "HostManagementQuickSetup",
      {
        type: "AWS::SSMQuickSetup::ConfigurationManager",
        properties: {
          Name: "QuickSetupForConnectingToInstances",
          Description:
            "Host Management Quick Setup for to connect to instances",
          ConfigurationDefinitions: [
            {
              Type: "AWSQuickSetupType-SSMHostMgmt",
              LocalDeploymentAdministrationRoleArn:
                roleLocalDeploymentAdministration.roleArn,
              LocalDeploymentExecutionRoleName:
                roleLocalDeploymentExecution.roleName,
              Parameters: {
                // CollectInventory: "false",
                // InstallCloudWatchAgent: "false",
                // IsPolicyAttachAllowed: "false",
                // ResourceGroupName: "",
                // ScanInstances: "false",
                // TargetAccounts: account,
                // TargetInstances: "*",
                // TargetRegions: region,
                // TargetTagKey: "",
                // TargetTagValue: "",
                // TargetType: "*",
                // UpdateCloudWatchAgent: "false",
                // UpdateEc2LaunchAgent: "false",
                // UpdateSsmAgent: "false",
                CollectInventory: "false",
                InstallCloudWatchAgent: "false",
                IsPolicyAttachAllowed: "false",
                ResourceGroupName: "",
                ScanInstances: "false",
                TargetAccounts: account,
                TargetInstances: "*",
                TargetRegions: region,
                TargetTagKey: "",
                TargetTagValue: "",
                TargetType: "*",
                UpdateCloudWatchAgent: "false",
                UpdateEc2LaunchAgent: "false",
                UpdateSsmAgent: "true",
              },
            },
          ],
        },
      },
    );
    quickSetupHostMgmt.addDependency(
      roleLocalDeploymentAdministration.node.defaultChild as CfnResource,
    );
    quickSetupHostMgmt.addDependency(
      roleLocalDeploymentExecution.node.defaultChild as CfnResource,
    );

    // create role for instance to use for conecting via ssm
    this.roleSsm2Ec2 = new Role(this, "RoleSsm2Ec2", {
      assumedBy: new ServicePrincipal("ec2.amazonaws.com"),
    });
    this.roleSsm2Ec2.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMManagedInstanceCore"),
    );
    NagSuppressions.addResourceSuppressions(this.roleSsm2Ec2, [
      {
        id: "AwsSolutions-IAM4",
        reason: "use the same policy as the aws console quick setup does",
      },
    ]);
    // this.instanceProfile = new InstanceProfile(this, "InstanceProfile", {
    //   role: roleSsm2Ec2,
    // });
  }
}
