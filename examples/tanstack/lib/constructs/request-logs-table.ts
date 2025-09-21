import { RemovalPolicy } from "aws-cdk-lib";
import {
  Table,
  AttributeType,
  BillingMode,
  TableEncryption,
} from "aws-cdk-lib/aws-dynamodb";
import { IGrantable } from "aws-cdk-lib/aws-iam";
import { Construct } from "constructs";

export interface RequestLogsTableProps {
  /**
   * Environment name (dev, staging, prod)
   */
  environment: string;

  /**
   * Whether to enable point-in-time recovery
   * @default true
   */
  pointInTimeRecovery?: boolean;

  /**
   * Removal policy for the table
   * @default RemovalPolicy.DESTROY for dev, RemovalPolicy.RETAIN for prod
   */
  removalPolicy?: RemovalPolicy;
}

/**
 * CDK Construct for the Request Logs DynamoDB table
 *
 * This table stores API request logs for monitoring, debugging, and analytics.
 * It follows the data model specifications with proper indexing for efficient queries.
 */
export class RequestLogsTable extends Construct {
  public readonly table: Table;
  public readonly tableName: string;

  constructor(scope: Construct, id: string, props: RequestLogsTableProps) {
    super(scope, id);

    const { environment, removalPolicy } = props;

    // Determine removal policy based on environment
    const effectiveRemovalPolicy =
      removalPolicy ??
      (environment === "prod" ? RemovalPolicy.RETAIN : RemovalPolicy.DESTROY);

    this.table = new Table(this, "RequestLogsTable", {
      tableName: `tanstack-request-logs-${environment}`,
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "timestamp",
        type: AttributeType.STRING,
      },
      billingMode: BillingMode.PAY_PER_REQUEST,
      encryption: TableEncryption.AWS_MANAGED,
      pointInTimeRecovery: true,
      removalPolicy: effectiveRemovalPolicy,

      // TTL configuration - logs expire after 30 days
      timeToLiveAttribute: "ttl",
    });

    // GSI for querying by path and timestamp
    this.table.addGlobalSecondaryIndex({
      indexName: "PathTimestampIndex",
      partitionKey: {
        name: "path",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "timestamp",
        type: AttributeType.STRING,
      },
    });

    // GSI for querying by status code and timestamp
    this.table.addGlobalSecondaryIndex({
      indexName: "StatusTimestampIndex",
      partitionKey: {
        name: "statusCode",
        type: AttributeType.NUMBER,
      },
      sortKey: {
        name: "timestamp",
        type: AttributeType.STRING,
      },
    });

    // GSI for querying by user ID and timestamp (for authenticated requests)
    this.table.addGlobalSecondaryIndex({
      indexName: "UserTimestampIndex",
      partitionKey: {
        name: "userId",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "timestamp",
        type: AttributeType.STRING,
      },
    });

    this.tableName = this.table.tableName;
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
  }

  /**
   * Grant stream read permissions to a principal
   */
  public grantStreamRead(grantee: IGrantable) {
    return this.table.grantStreamRead(grantee);
  }
}
