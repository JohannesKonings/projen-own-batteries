import { Stack } from "aws-cdk-lib";

import { CfnInvestigationGroup } from "aws-cdk-lib/aws-aiops";
import { ManagedPolicy, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

type AiOpsProps = {};
export class AiOps extends Construct {
  constructor(scope: Construct, id: string, _props: AiOpsProps) {
    super(scope, id);

    const {
      account: _account,
      partition: _partition,
      region: _region,
    } = Stack.of(this);

    // IAM role assumed by CloudWatch Investigations to gather data during investigations
    const roleAiOpsInvestigationGroup = new Role(
      this,
      "AiOpsInvestigationGroupRole",
      {
        // Trust policy: CloudWatch Investigations service
        assumedBy: new ServicePrincipal("aiops.amazonaws.com"),
        description:
          "Role used by CloudWatch Investigations to access resources during investigations",
      },
    );

    // Attach recommended AWS managed policy for investigations assistant
    roleAiOpsInvestigationGroup.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName("AIOpsAssistantPolicy"),
    );
    // Optionally broaden read-only visibility for newer services (uncomment if desired)
    // roleAiOpsInvestigationGroup.addManagedPolicy(
    //   ManagedPolicy.fromAwsManagedPolicyName("ReadOnlyAccess")
    // );

    new CfnInvestigationGroup(this, "AiOpsInvestigationGroup", {
      name: "default2",
      roleArn: roleAiOpsInvestigationGroup.roleArn,
      // You can also configure retention and encryption here if needed
      // retentionInDays: 30,
      // encryptionConfig: { kmsKeyId: 'arn:aws:kms:...', type: 'CUSTOMER_MANAGED' }
    });
  }
}
