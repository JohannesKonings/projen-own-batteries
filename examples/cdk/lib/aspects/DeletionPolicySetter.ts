import { CfnResource, type IAspect, type RemovalPolicy } from "aws-cdk-lib";
import type { IConstruct } from "constructs";

export class DeletionPolicySetter implements IAspect {
  constructor(private readonly policy: RemovalPolicy) {}
  visit(node: IConstruct): void {
    if (node instanceof CfnResource) {
      node.applyRemovalPolicy(this.policy);
    }
  }
}
