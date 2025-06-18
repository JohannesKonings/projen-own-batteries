import {
  type InjectionContext,
  type IPropertyInjector,
  RemovalPolicy,
} from "aws-cdk-lib";
import { Bucket, type BucketProps } from "aws-cdk-lib/aws-s3";
export class BucketAutoDeletionSetter implements IPropertyInjector {
  public readonly constructUniqueId: string;

  constructor(private readonly autoDeleteObjects: boolean) {
    this.constructUniqueId = Bucket.PROPERTY_INJECTION_ID;
  }

  public inject(
    originalProps: BucketProps,
    _context: InjectionContext,
  ): BucketProps {
    return {
      ...originalProps,
      autoDeleteObjects: this.autoDeleteObjects,
      removalPolicy: this.autoDeleteObjects
        ? RemovalPolicy.DESTROY
        : originalProps.removalPolicy,
    };
  }
}
