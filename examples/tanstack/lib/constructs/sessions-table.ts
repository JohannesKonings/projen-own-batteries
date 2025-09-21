import { RemovalPolicy } from "aws-cdk-lib";
import {
  Table,
  AttributeType,
  BillingMode,
  TableEncryption,
} from "aws-cdk-lib/aws-dynamodb";
import { IGrantable } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export interface SessionsTableProps {
  /**
   * Environment name for resource naming
   */
  environment: string;

  /**
   * Whether to enable point-in-time recovery
   * @default true
   */
  pointInTimeRecovery?: boolean;

  /**
   * Removal policy for the table
   * @default RemovalPolicy.RETAIN for production, DESTROY for dev
   */
  removalPolicy?: RemovalPolicy;
}

/**
 * DynamoDB table construct for user session management
 * Implements the UserSession data model with TTL and encryption
 */
export class SessionsTable extends Construct {
  public readonly table: Table;

  constructor(scope: Construct, id: string, props: SessionsTableProps) {
    super(scope, id);

    const { environment, pointInTimeRecovery = true, removalPolicy } = props;

    // Determine removal policy based on environment
    const finalRemovalPolicy =
      removalPolicy ??
      (environment === "production"
        ? RemovalPolicy.RETAIN
        : RemovalPolicy.DESTROY);

    this.table = new Table(this, "SessionsTable", {
      tableName: `${environment}-tanstack-sessions`,

      // Primary key: sessionId (UUID)
      partitionKey: {
        name: "sessionId",
        type: AttributeType.STRING,
      },

      // Billing and performance
      billingMode: BillingMode.PAY_PER_REQUEST,

      // Security
      encryption: TableEncryption.AWS_MANAGED,
      pointInTimeRecovery: true,

      // Cleanup
      removalPolicy: finalRemovalPolicy,

      // TTL for automatic session cleanup
      timeToLiveAttribute: "expiresAt",

      // Enable deletion protection for production
      deletionProtection: environment === "production",
    });

    // Add Global Secondary Index for userId queries
    this.table.addGlobalSecondaryIndex({
      indexName: "UserIdIndex",
      partitionKey: {
        name: "userId",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "createdAt",
        type: AttributeType.STRING,
      },
    });

    // Add GSI for active session queries
    this.table.addGlobalSecondaryIndex({
      indexName: "ActiveSessionsIndex",
      partitionKey: {
        name: "isActive",
        type: AttributeType.STRING, // 'true' or 'false'
      },
      sortKey: {
        name: "expiresAt",
        type: AttributeType.STRING,
      },
    });
  }

  /**
   * Grant read permissions to a principal
   */
  public grantRead(grantee: IGrantable) {
    return this.table.grantReadData(grantee);
  }

  /**
   * Grant write permissions to a principal
   */
  public grantWrite(grantee: IGrantable) {
    return this.table.grantWriteData(grantee);
  }

  /**
   * Grant read and write permissions to a principal
   */
  public grantReadWrite(grantee: IGrantable) {
    return this.table.grantReadWriteData(grantee);
  } /**
   * Get table name for environment variables
   */
  public get tableName(): string {
    return this.table.tableName;
  }

  /**
   * Get table ARN for IAM policies
   */
  public get tableArn(): string {
    return this.table.tableArn;
  }
}
