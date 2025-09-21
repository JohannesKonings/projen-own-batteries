import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as path from "path";
import { Stack, StackProps } from "aws-cdk-lib/core";
import { BlockPublicAccess, Bucket, HttpMethods } from "aws-cdk-lib/aws-s3";
import { Duration } from "aws-cdk-lib";
import {
  Code,
  FunctionUrlAuthType,
  InvokeMode,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import {
  AllowedMethods,
  Distribution,
  HeadersFrameOption,
  HeadersReferrerPolicy,
  LambdaEdgeEventType,
  PriceClass,
  ResponseHeadersPolicy,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import {
  CfnDelivery,
  CfnDeliveryDestination,
  CfnDeliverySource,
  LogGroup,
} from "aws-cdk-lib/aws-logs";
// (removed NodejsFunction bundling; using plain Lambda with Nitro output)
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { AiOps } from "../constructs/AiOps";

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
      cors: [
        {
          allowedMethods: [
            HttpMethods.POST,
            HttpMethods.GET,
            HttpMethods.HEAD,
            HttpMethods.PUT,
            HttpMethods.DELETE,
          ],
          allowedOrigins: ["*"],
          allowedHeaders: ["*"],
          // maxAge: Duration.days(1),
        },
      ],
    });

    // Create Lambda function for server code
    // const serverFunction = new lambda.Function(this, "ServerFunction", {
    //   runtime: lambda.Runtime.NODEJS_22_X,
    //   handler: "index.handler",
    //   code: lambda.Code.fromAsset(
    //     path.join(import.meta.dirname, "../../.output/server"),
    //     {
    //       followSymlinks: cdk.SymlinkFollowMode.ALWAYS,
    //     },
    //   ),
    //   memorySize: 2048,
    //   timeout: Duration.seconds(60),
    //   environment: {
    //     BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || "",
    //     BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "",
    //     GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || "",
    //     GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || "",
    //   },
    // });
    const serverFunction = new lambda.Function(this, "ServerFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      handler: "index.handler",
      code: lambda.Code.fromAsset(
        path.join(
          path.dirname(new URL(import.meta.url).pathname),
          "../../.output/server",
        ),
      ),
      memorySize: 2048,
      timeout: Duration.seconds(60),
      environment: {
        BETTER_AUTH_SECRET:
          process.env.BETTER_AUTH_SECRET ||
          (() => {
            throw new Error(
              "BETTER_AUTH_SECRET environment variable is required",
            );
          })(),
        BETTER_AUTH_URL:
          process.env.BETTER_AUTH_URL ||
          (() => {
            throw new Error("BETTER_AUTH_URL environment variable is required");
          })(),
        VITE_BETTER_AUTH_URL:
          process.env.VITE_BETTER_AUTH_URL ||
          (() => {
            throw new Error(
              "VITE_BETTER_AUTH_URL environment variable is required",
            );
          })(),
        GITHUB_CLIENT_ID:
          process.env.GITHUB_CLIENT_ID ||
          (() => {
            throw new Error(
              "GITHUB_CLIENT_ID environment variable is required",
            );
          })(),
        GITHUB_CLIENT_SECRET:
          process.env.GITHUB_CLIENT_SECRET ||
          (() => {
            throw new Error(
              "GITHUB_CLIENT_SECRET environment variable is required",
            );
          })(),
        NODE_ENV: "production",
      },
    });

    const authFunction = new cloudfront.experimental.EdgeFunction(
      this,
      "AuthFunctionAtEdge",
      {
        handler: "auth.handler", // Use the CommonJS auth.js for Lambda@Edge compatibility
        runtime: Runtime.NODEJS_22_X,
        code: Code.fromAsset(
          path.join(
            path.dirname(new URL(import.meta.url).pathname),
            "../../src/lambdas/",
          ),
        ),
        //    entry: path.join(
        //   import.meta.dirname,
        //   "../../src/lambdas/serverFunction.ts",
        // ),
      },
    );

    authFunction.addToRolePolicy(
      new PolicyStatement({
        sid: "AllowInvokeFunctionUrl",
        effect: Effect.ALLOW,
        actions: ["lambda:InvokeFunctionUrl"],
        resources: [serverFunction.functionArn],
        conditions: {
          StringEquals: { "lambda:FunctionUrlAuthType": "AWS_IAM" },
        },
      }),
    );

    // Create Lambda function URL
    const serverFunctionUrl = serverFunction.addFunctionUrl({
      // Enforce IAM between CloudFront and Lambda Function URL
      authType: FunctionUrlAuthType.AWS_IAM,
      invokeMode: InvokeMode.BUFFERED,
      // CORS config is not relevant for IAM-authenticated Function URLs accessed by CloudFront
    });

    // IMPORTANT: Disable SSR caching to avoid caching authenticated HTML responses
    // Static assets are handled via additionalBehaviors with optimized caching.

    // Use a managed policy to forward all viewer headers (except Host) to the origin.
    // This preserves SigV4 headers added by the Lambda@Edge signer.

    // @see https://securityheaders.com
    // @see https://observatory.mozilla.org
    const cspAllowedSourcesList = "*";
    const responseHeadersPolicy = new ResponseHeadersPolicy(
      this,
      "ResponseHeaderPolicy",
      {
        customHeadersBehavior: {
          customHeaders: [
            {
              header: "Permissions-Policy",
              value:
                "geolocation=(self), microphone=(), camera=(), fullscreen=(self), payment=()",
              override: true,
            },
          ],
        },
        securityHeadersBehavior: {
          contentTypeOptions: { override: true },
          frameOptions: {
            frameOption: HeadersFrameOption.DENY,
            override: true,
          },
          referrerPolicy: {
            referrerPolicy: HeadersReferrerPolicy.NO_REFERRER,
            override: true,
          },
          strictTransportSecurity: {
            override: true,
            accessControlMaxAge: Duration.days(200),
            includeSubdomains: true,
            preload: true,
          },
          xssProtection: { override: true, protection: true, modeBlock: true },
          contentSecurityPolicy: {
            contentSecurityPolicy: `default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' ${cspAllowedSourcesList}; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self' ${cspAllowedSourcesList}; frame-src 'self';`,
            override: true,
          },
        },
      },
    );

    // Create CloudFront distribution
    // Managed origin request policy: forward all viewer headers except Host.
    const managedOriginRequestPolicy =
      cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER;
    const distribution = new Distribution(this, "Distribution", {
      comment: `TanStackStartCDK`,
      defaultBehavior: {
        // origin: new origins.FunctionUrlOrigin(serverFunctionUrl),
        origin:
          origins.FunctionUrlOrigin.withOriginAccessControl(serverFunctionUrl),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        allowedMethods: AllowedMethods.ALLOW_ALL,
        originRequestPolicy: managedOriginRequestPolicy,
        responseHeadersPolicy,
        // Attach signer to sign requests with SigV4 for the Function URL (AWS_IAM)
        edgeLambdas: [
          {
            functionVersion: authFunction.currentVersion,
            // Revert to ORIGIN_REQUEST so origin.custom.domainName is available (Function URL host)
            eventType: LambdaEdgeEventType.ORIGIN_REQUEST,
            includeBody: true,
          },
        ],
      },
      // defaultBehavior: {
      //   origin:
      //     origins.S3BucketOrigin.withOriginAccessControl(staticAssetsBucket),
      //   viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      //   cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      // },
      logIncludesCookies: true,
      priceClass: PriceClass.PRICE_CLASS_100, // Use Price Class 100 for lower cost
      additionalBehaviors: {
        // "/api/*": {
        //   origin: new origins.FunctionUrlOrigin(serverFunctionUrl),
        //   viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        //   cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        //   allowedMethods: AllowedMethods.ALLOW_ALL,
        //   originRequestPolicy: managedOriginRequestPolicy,
        //   responseHeadersPolicy,
        //   edgeLambdas: [
        //     {
        //       functionVersion: authFunction.currentVersion,
        //       // Revert to ORIGIN_REQUEST so origin.custom.domainName is available (Function URL host)
        //       eventType: LambdaEdgeEventType.ORIGIN_REQUEST,
        //       includeBody: true,
        //     },
        //   ],
        // },
        // "/_serverFn/*": {
        //   origin: new origins.FunctionUrlOrigin(serverFunctionUrl),
        //   viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        //   cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        //   allowedMethods: AllowedMethods.ALLOW_ALL,
        //   originRequestPolicy: managedOriginRequestPolicy,
        //   responseHeadersPolicy,
        //   edgeLambdas: [
        //     {
        //       functionVersion: authFunction.currentVersion,
        //       // Revert to ORIGIN_REQUEST so origin.custom.domainName is available (Function URL host)
        //       eventType: LambdaEdgeEventType.ORIGIN_REQUEST,
        //       includeBody: true,
        //     },
        //   ],
        // },
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
          // responsePagePath: "/index.mjs",
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          // responsePagePath: "/index.mjs",
        },
      ],
    });

    // cloudfront logs
    // https://github.com/aws/aws-cdk/issues/32279#issuecomment-2582924897
    const distributionDeliverySource = new CfnDeliverySource(
      this,
      "DistributionDeliverySource",
      {
        name: "distribution-logs-source",
        logType: "ACCESS_LOGS",
        resourceArn: Stack.of(this).formatArn({
          service: "cloudfront",
          region: "",
          resource: "distribution",
          resourceName: distribution.distributionId,
        }),
      },
    );

    const distributionDeliveryDestination = new CfnDeliveryDestination(
      this,
      "DistributionDeliveryDestination",
      {
        name: "distribution-logs-destination",
        destinationResourceArn: new LogGroup(this, "DistributionLogGroup")
          .logGroupArn,
        outputFormat: "json",
      },
    );

    new CfnDelivery(this, "DistributionDelivery", {
      deliverySourceName: distributionDeliverySource.name,
      deliveryDestinationArn: distributionDeliveryDestination.attrArn,
    }).node.addDependency(distributionDeliverySource);

    // Deploy static assets to S3
    new s3deploy.BucketDeployment(this, "DeployStaticAssets", {
      sources: [
        s3deploy.Source.asset(
          path.join(
            path.dirname(new URL(import.meta.url).pathname),
            "../../.output/public",
          ),
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

    new AiOps(this, "AiOps", {});
  }
}
