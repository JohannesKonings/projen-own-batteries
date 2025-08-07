import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
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
  HttpMethod,
  InvokeMode,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import {
  AllowedMethods,
  CachePolicy,
  Distribution,
  HeadersFrameOption,
  HeadersReferrerPolicy,
  LambdaEdgeEventType,
  OriginRequestPolicy,
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
import {
  NodejsFunction,
  OutputFormat,
  SourceMapMode,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Effect, PolicyStatement } from "aws-cdk-lib/aws-iam";

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
    const serverFunction = new NodejsFunction(this, "ServerFunction", {
      runtime: lambda.Runtime.NODEJS_22_X,
      entry: path.join(
        import.meta.dirname,
        "../../src/lambdas/serverFunction.ts",
      ),
      // handler: "index.handler",
      memorySize: 2048,
      timeout: Duration.seconds(60),
      bundling: {
        sourceMap: true,
        sourceMapMode: SourceMapMode.EXTERNAL,
        // ESM important properties:
        mainFields: ["module", "main"],
        format: OutputFormat.ESM,
        banner:
          "const require = (await import('node:module')).createRequire(import.meta.url);",
      },
      // environment: {
      //   BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || "",
      //   BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "",
      //   GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || "",
      //   GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || "",
      // },
    });

    const authFunction = new cloudfront.experimental.EdgeFunction(
      this,
      "AuthFunctionAtEdge",
      {
        handler: "auth.handler",
        runtime: Runtime.NODEJS_22_X,
        code: Code.fromAsset(
          path.join(import.meta.dirname, "../../src/lambdas/"),
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
      authType: FunctionUrlAuthType.AWS_IAM,
      // invokeMode: InvokeMode.RESPONSE_STREAM,
      invokeMode: InvokeMode.BUFFERED,
      cors: {
        allowedOrigins: ["*"],
        allowedMethods: [HttpMethod.ALL],
        allowedHeaders: ["*"],
        allowCredentials: false,
      },
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

    const originRequestPolicy = new OriginRequestPolicy(
      this,
      "OriginRequestPolicy",
      {
        originRequestPolicyName: "TanStackStartOriginRequestPolicy",
        comment: "Origin request policy for TanStack Start application",
        headerBehavior:
          cloudfront.OriginRequestHeaderBehavior.allowList("Set-Cookie"),
        cookieBehavior: cloudfront.OriginRequestCookieBehavior.all(),
        queryStringBehavior: cloudfront.OriginRequestQueryStringBehavior.all(),
      },
    );

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
    const distribution = new Distribution(this, "Distribution", {
      comment: `TanStackStartCDK`,
      defaultBehavior: {
        // origin: new origins.FunctionUrlOrigin(serverFunctionUrl),
        origin:
          origins.FunctionUrlOrigin.withOriginAccessControl(serverFunctionUrl),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        // cachePolicy: CachePolicy.CACHING_DISABLED,
        cachePolicy,
        allowedMethods: AllowedMethods.ALLOW_ALL,
        // originRequestPolicy: OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
        originRequestPolicy,
        responseHeadersPolicy,
        // responseHeadersPolicy:
        //   ResponseHeadersPolicy.CORS_ALLOW_ALL_ORIGINS_WITH_PREFLIGHT,
        // edgeLambdas: [
        //   {
        //     functionVersion: authFunction.currentVersion,
        //     eventType: LambdaEdgeEventType.ORIGIN_REQUEST,
        //     includeBody: true,
        //   },
        // ],
      },
      logIncludesCookies: true,
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
