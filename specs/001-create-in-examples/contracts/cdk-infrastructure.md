# CDK Infrastructure Contract

## Stack Outputs

### CloudFront Distribution
```typescript
export interface CloudFrontOutputs {
  distributionId: string;
  distributionDomainName: string;
  distributionUrl: string;
}
```

### Lambda Functions
```typescript
export interface LambdaOutputs {
  apiFunction: {
    functionName: string;
    functionArn: string;
    functionUrl: string;
  };
  ssrFunction: {
    functionName: string;
    functionArn: string;
    functionUrl: string;
  };
}
```

### S3 Buckets
```typescript
export interface S3Outputs {
  staticAssetsBucket: {
    bucketName: string;
    bucketArn: string;
    bucketUrl: string;
  };
  logsBucket: {
    bucketName: string;
    bucketArn: string;
  };
}
```

### DynamoDB Tables
```typescript
export interface DynamoDBOutputs {
  sessionsTable: {
    tableName: string;
    tableArn: string;
  };
  requestLogsTable: {
    tableName: string;
    tableArn: string;
  };
}
```

## Environment Variables

### Lambda Environment Variables
```typescript
export interface LambdaEnvironment {
  NODE_ENV: 'development' | 'staging' | 'production';
  SESSIONS_TABLE_NAME: string;
  REQUEST_LOGS_TABLE_NAME: string;
  CLOUDFRONT_DOMAIN: string;
  ALLOWED_ORIGINS: string; // JSON array
  SESSION_SECRET: string; // From Parameter Store
  LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
}
```

## Security Configurations

### WAF Rules
```typescript
export interface WAFConfiguration {
  webAclId: string;
  webAclArn: string;
  rules: {
    awsManagedRules: {
      coreRuleSet: boolean;
      knownBadInputs: boolean;
      sqliRuleSet: boolean;
      linuxRuleSet: boolean;
    };
    customRules: {
      rateLimiting: {
        requestsPerMinute: number;
        scope: 'CLOUDFRONT' | 'REGIONAL';
      };
      geoBlocking: {
        allowedCountries: string[];
      };
    };
  };
}
```

### CloudFront Security Headers
```typescript
export interface SecurityHeaders {
  contentSecurityPolicy: string;
  strictTransportSecurity: string;
  contentTypeOptions: string;
  frameOptions: string;
  referrerPolicy: string;
  permissionsPolicy: string;
}
```

## Caching Configuration

### Cache Behaviors
```typescript
export interface CacheBehaviors {
  default: {
    pathPattern: '/';
    cachePolicyId: string; // CACHING_DISABLED for SSR
    originRequestPolicyId: string;
    responseHeadersPolicyId: string;
    viewerProtocolPolicy: 'redirect-to-https';
  };
  staticAssets: {
    pathPattern: '/assets/*';
    cachePolicyId: string; // CACHING_OPTIMIZED with 1 year TTL
    originRequestPolicyId: string;
    compress: true;
  };
  api: {
    pathPattern: '/api/*';
    cachePolicyId: string; // CACHING_DISABLED
    originRequestPolicyId: string;
    allowedMethods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'PATCH', 'POST', 'DELETE'];
  };
}
```

## Monitoring and Logging

### CloudWatch Configuration
```typescript
export interface MonitoringConfiguration {
  lambdaLogs: {
    retentionInDays: 30 | 90 | 365;
    encryption: boolean;
  };
  cloudFrontLogs: {
    enabled: boolean;
    bucket: string;
    prefix: string;
    includeCookies: boolean;
  };
  alarms: {
    lambdaErrors: {
      threshold: number;
      evaluationPeriods: number;
    };
    cloudFrontErrors: {
      threshold: number;
      evaluationPeriods: number;
    };
    latency: {
      threshold: number; // milliseconds
      evaluationPeriods: number;
    };
  };
}
```

## Deployment Configuration

### Stage-specific Settings
```typescript
export interface StageConfiguration {
  stage: 'development' | 'staging' | 'production';
  domainName?: string;
  certificateArn?: string;
  lambda: {
    memory: 128 | 256 | 512 | 1024;
    timeout: number; // seconds
    reservedConcurrency?: number;
  };
  dynamodb: {
    billingMode: 'PAY_PER_REQUEST' | 'PROVISIONED';
    pointInTimeRecovery: boolean;
  };
  waf: {
    enabled: boolean;
    rateLimitRpm: number;
  };
}
```

## API Contract Validation

### Request/Response Validation
- All API endpoints must validate requests against OpenAPI schema
- Response types must match schema definitions
- Error responses must include requestId for tracing
- Authentication must be validated on protected endpoints

### Infrastructure Validation
- CDK deployment must complete without errors
- All outputs must be available after deployment
- Health checks must pass for all Lambda functions
- CloudFront distribution must be accessible
- DynamoDB tables must be created with correct indexes

### Security Validation
- WAF rules must be attached to CloudFront distribution
- Lambda functions must have appropriate IAM permissions
- S3 buckets must block public access
- DynamoDB tables must use encryption at rest
- Security headers must be present in responses