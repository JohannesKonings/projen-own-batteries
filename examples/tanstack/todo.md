# CDK Review and TODOs (examples/tanstack)

This document summarizes current CDK findings and actionable fixes. Align all changes with examples/tanstack/specs/project-specifications.md.

## High-impact issues

- SSR caching misconfigured — ✅
  - Where: examples/tanstack/lib/stacks/stack.ts (CloudFront defaultBehavior)
  - Problem: Custom CachePolicy with 1-day TTL caches SSR HTML.
  - Fix: Use CachePolicy.CACHING_DISABLED for defaultBehavior (keep /api/* disabled), or a near-0 TTL policy that respects origin Cache-Control.
  - Status: Updated defaultBehavior to use CachePolicy.CACHING_DISABLED in lib/stacks/stack.ts.

- Overly permissive S3 CORS
  - Where: examples/tanstack/lib/stacks/stack.ts (static assets Bucket)
  - Problem: allowedOrigins: ["*"] and methods include POST/PUT/DELETE; assets are read-only via CloudFront OAC.
  - Fix: Restrict to GET, HEAD and scope origins to the CloudFront domain; or remove CORS if only served via CloudFront.

## Security and best practices

- No WAF on CloudFront
  - Where: examples/tanstack/lib/stacks/stack.ts (Distribution)
  - Problem: No WAFv2 WebACL attached (often flagged by cdk-nag).
  - Fix: Associate a WebACL with managed rules and rate limiting.

- Log retention not set
  - Where: examples/tanstack/lib/stacks/stack.ts (CloudFront access logs; Lambda log groups default)
  - Problem: Defaults to indefinite retention.
  - Fix: Set log retention (e.g., 30–90 days) and enable encryption. For Lambda, add LogRetention.

- S3 access logging disabled
  - Where: examples/tanstack/lib/stacks/stack.ts (static assets Bucket)
  - Problem: No server access logs.
  - Fix: Enable access logging to a dedicated logs bucket.

- Edge signer duplication
  - Where: examples/tanstack/src/lambdas/auth.js and examples/tanstack/src/lambdas/auth.ts
  - Problem: Two implementations; JS hand-rolls SigV4, TS uses AWS SDK v3.
  - Fix: Consolidate on the SDK-based signer (build TS → JS) and point Lambda@Edge handler to it.

- CSP too permissive
  - Where: examples/tanstack/lib/stacks/stack.ts (ResponseHeadersPolicy)
  - Problem: script-src includes 'unsafe-inline', 'unsafe-eval', and wildcard '*'.
  - Fix: Tighten for production; allow only necessary origins.

- Minor consistency: CDK imports
  - Where: examples/tanstack/lib/stacks/stack.ts
  - Problem: Mixed imports from aws-cdk-lib/core and aws-cdk-lib.
  - Fix: Prefer `import { Stack, StackProps } from "aws-cdk-lib"` consistently.

- Cookie logging risk
  - Where: examples/tanstack/lib/stacks/stack.ts (Distribution)
  - Problem: logIncludesCookies: true can record sensitive data.
  - Fix: Consider false, or strictly lock down log access.

## Checks that are good

- Function URL IAM enforced
  - Where: examples/tanstack/lib/stacks/stack.ts (FunctionUrlAuthType.AWS_IAM) + edge signing
  - Status: Correct and aligned with the specifications.

- Env var validation
  - Where: examples/tanstack/lib/stacks/stack.ts (Lambda environment)
  - Status: Required variables validated; follows security requirements.

- Origin policy and signing flow
  - Where: examples/tanstack/lib/stacks/stack.ts (OriginRequestPolicy + edge signing)
  - Status: Appropriate for SigV4 headers injected at the edge.

## Suggested deltas (actionable)

- Disable SSR caching on CloudFront defaultBehavior for HTML responses.
- Tighten S3 CORS to GET/HEAD and restrict origins; add bucket access logging.
- Attach a WAFv2 WebACL to the distribution with managed rules and rate limits.
- Set retention/encryption on CloudFront and Lambda logs; add LogRetention for Lambdas.
- Consolidate to the SDK-based Lambda@Edge signer and update handler reference.
- Harden CSP for production; minimize 'unsafe-*' and wildcards.
- Normalize CDK imports to aws-cdk-lib.
- Reassess CloudFront cookie logging; disable if not required.

## References

- examples/tanstack/lib/stacks/stack.ts
- examples/tanstack/bin/app.ts
- examples/tanstack/src/lambdas/auth.js
- examples/tanstack/src/lambdas/auth.ts
- examples/tanstack/cdk.json
- examples/tanstack/specs/project-specifications.md

## Tools used

- Workspace file reads and grep over examples/tanstack/*
- CDK Nag suppression scan (no suppressions found)
