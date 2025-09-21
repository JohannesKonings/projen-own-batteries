# Research: tanstack-start

**Date**: September 15, 2025  
**Purpose**: Research and resolve technical decisions for TanStack Start app with CloudFront and Lambda

## CloudFront CDN Configuration

**Decision**: Use CloudFront with Origin Access Control (OAC) for S3 static assets and Lambda Function URLs for API endpoints  
**Rationale**: 
- OAC provides better security than Legacy Origin Access Identity
- Lambda Function URLs simplify API routing compared to API Gateway
- Separate cache behaviors for static vs dynamic content optimization
- Built-in WAF integration for security

**Alternatives considered**: 
- API Gateway + Lambda: More complex, higher cost for simple APIs
- S3 website hosting: No HTTPS, limited control
- CloudFormation: More verbose than CDK for complex infrastructure

## Lambda Server Architecture

**Decision**: Use Nitro preset for AWS Lambda with server-side rendering support  
**Rationale**:
- Nitro provides optimized Lambda builds for TanStack Start
- Built-in support for SSR and static generation
- Automatic bundling and optimization for serverless
- Environment variable handling for secrets

**Alternatives considered**:
- Direct Lambda deployment: Complex build process, no SSR optimization
- Container-based Lambda: Larger cold start times
- EC2 instances: Higher costs, server management overhead

## Caching Strategy

**Decision**: Multi-tier caching with CloudFront behaviors and Lambda response headers  
**Rationale**:
- Static assets: Long-term caching (1 year) with versioned filenames
- API responses: Short-term caching (5 minutes) for non-user-specific data
- SSR pages: Cache disabled or very short TTL to respect dynamic content
- Proper cache invalidation on deployments

**Alternatives considered**:
- Single cache policy: Poor performance for different content types
- No caching: Increased costs and latency
- Application-level caching only: Misses edge location benefits

## Security Implementation

**Decision**: WAF v2 with managed rules, CSP headers, and IAM authentication for Lambda URLs  
**Rationale**:
- WAF managed rules protect against common attacks (OWASP top 10)
- Rate limiting prevents abuse
- CSP headers mitigate XSS attacks
- IAM authentication for internal APIs

**Alternatives considered**:
- Basic security: Insufficient for production use
- Custom WAF rules: More maintenance overhead
- API keys only: Less secure than IAM for service-to-service

## Environment Configuration

**Decision**: AWS Systems Manager Parameter Store for environment-specific configurations  
**Rationale**:
- Secure secret storage with encryption at rest
- Built-in access control via IAM
- Cost-effective for configuration values
- Integration with CDK for automated setup

**Alternatives considered**:
- Environment variables in Lambda: Security risk for secrets
- AWS Secrets Manager: Higher cost for simple configuration
- Hardcoded values: Security and flexibility issues

## Testing Strategy

**Decision**: Multi-layer testing with CDK integration tests, Lambda unit tests, and E2E tests  
**Rationale**:
- CDK deployment tests ensure infrastructure correctness
- Lambda unit tests for business logic validation
- E2E tests through CloudFront for complete user journey
- Synthetic monitoring for production validation

**Alternatives considered**:
- Unit tests only: Insufficient for infrastructure validation
- Manual testing: Not scalable, error-prone
- Mocked AWS services: Doesn't catch real integration issues

## Deployment Process

**Decision**: GitOps workflow with CDK synthesis, diff review, and staged deployment  
**Rationale**:
- Infrastructure as Code ensures consistency
- CDK diff shows changes before deployment
- Staged deployment allows validation before production
- Rollback capabilities for quick recovery

**Alternatives considered**:
- Manual deployment: Error-prone, not repeatable
- Direct AWS CLI: Complex for infrastructure management
- Terraform: Less TypeScript integration than CDK

## Performance Optimization

**Decision**: Bundle optimization with tree-shaking, code splitting, and Lambda warming  
**Rationale**:
- Smaller bundles reduce cold start times
- Code splitting enables better caching strategies
- Lambda warming for critical functions
- CloudFront compression for bandwidth optimization

**Alternatives considered**:
- No optimization: Poor user experience
- Application-level optimization only: Misses infrastructure benefits
- Over-optimization: Increased complexity without proportional benefits