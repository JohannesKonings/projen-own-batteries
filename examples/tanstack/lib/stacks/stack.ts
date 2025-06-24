import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as path from "path";
import { Stack, StackProps } from "aws-cdk-lib/core";
import { BlockPublicAccess, Bucket } from "aws-cdk-lib/aws-s3";
import { Duration } from "aws-cdk-lib";
import { FunctionUrlAuthType } from "aws-cdk-lib/aws-lambda";
import {
  AllowedMethods,
  CachePolicy,
  Distribution,
  OriginRequestPolicy,
  PriceClass,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";

export interface StackMainProps extends StackProps {}

export class StackMain extends Stack {
  constructor(scope: Construct, id: string, props: StackMainProps) {
    super(scope, id, props);

    // Create S3 bucket for static assets
    const staticAssetsBucket = new Bucket(this, "StaticAssetsBucket", {
      publicReadAccess: false,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      enforceSSL: true,
    });

    // Create Lambda function for server code
    const serverFunction = new lambda.Function(this, "ServerFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(
        path.join(import.meta.dirname, "../../.output/server"),
        {
          followSymlinks: cdk.SymlinkFollowMode.ALWAYS,
        },
      ),
      memorySize: 2048,
      timeout: Duration.seconds(60),
      environment: {
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || "",
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "",
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || "",
        GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || "",
      },
    });

    // Create Lambda function URL
    const serverFunctionUrl = serverFunction.addFunctionUrl({
      authType: FunctionUrlAuthType.NONE,
    });

    const cachePolicy = new CachePolicy(this, "CachePolicy", {
      cachePolicyName: "TanStackStartCachePolicy",
      comment: "Cache policy for TanStack Start application",
      defaultTtl: Duration.days(1),
      maxTtl: Duration.days(7),
      minTtl: Duration.seconds(0),
      enableAcceptEncodingBrotli: true,
      enableAcceptEncodingGzip: true,
      headerBehavior: cloudfront.CacheHeaderBehavior.allowList("Authorization"),
      cookieBehavior: cloudfront.CacheCookieBehavior.all(),
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.all(),
      // enableAcceptEncodingBrotli: true,
      // enableAcceptEncodingGzip: true,
    });

    // Create CloudFront distribution
    const distribution = new Distribution(this, "Distribution", {
      comment: `TanStackStartCDK`,
      defaultBehavior: {
        origin: new origins.FunctionUrlOrigin(serverFunctionUrl),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        // cachePolicy: CachePolicy.CACHING_DISABLED,
        cachePolicy,
        allowedMethods: AllowedMethods.ALLOW_ALL,
        originRequestPolicy: OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
      },
      priceClass: PriceClass.PRICE_CLASS_100, // Use Price Class 100 for lower cost
      additionalBehaviors: {
        "/_build/*": {
          origin:
            origins.S3BucketOrigin.withOriginAccessControl(staticAssetsBucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        },
        "/assets/*": {
          origin:
            origins.S3BucketOrigin.withOriginAccessControl(staticAssetsBucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        },
        "/*.ico": {
          origin:
            origins.S3BucketOrigin.withOriginAccessControl(staticAssetsBucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        },
        "/*.png": {
          origin:
            origins.S3BucketOrigin.withOriginAccessControl(staticAssetsBucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        },
        "/site.webmanifest": {
          origin:
            origins.S3BucketOrigin.withOriginAccessControl(staticAssetsBucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        },
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
      ],
    });

    // Deploy static assets to S3
    new s3deploy.BucketDeployment(this, "DeployStaticAssets", {
      sources: [
        s3deploy.Source.asset(
          path.join(import.meta.dirname, "../../.output/public"),
        ),
      ],
      destinationBucket: staticAssetsBucket,
      distribution,
      distributionPaths: ["/*"],
    });

    // Output the CloudFront distribution URL and Lambda function URL
    new cdk.CfnOutput(this, "CloudFrontUrl", {
      value: `https://${distribution.distributionDomainName}`,
      description: "URL of the CloudFront distribution",
    });
    new cdk.CfnOutput(this, "LambdaFunctionUrl", {
      value: serverFunctionUrl.url,
      description: "URL of the Lambda function",
    });
  }
}
