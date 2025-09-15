# TanStack## 📋 Copilot Checklist for Every Request

Before providing any assistance, verify:
- [ ] This specification document has been read and understood
- [ ] Context7 MCP has been consulted for relevant technologies
- [ ] Security requirements are respected (no hardcoded credentials)
- [ ] Deployment process follows `source .env-prod && nr webapp:build && nr cdk deploy` pattern
- [ ] Suggestions align with TanStack Start + AWS CDK architecture
- [ ] Environment variable patterns use required error throwing
- [ ] IAM authentication requirements are maintained
- [ ] **NO separate documentation files will be created**
- [ ] **Updates will be made to this specification document only**ject Specifications

## 🚨 MANDATORY FOR ALL COPILOT REQUESTS 🚨

**This document MUST be consulted for EVERY GitHub Copilot request related to this project.**

This is the single source of truth containing all relevant information about the TanStack Start project that GitHub Copilot must consider when providing assistance. All recommendations, code suggestions, and guidance must align with the specifications, security requirements, and architectural decisions documented here.

---

## 📋 Copilot Checklist for Every Request

Before providing any assistance, verify:
- [ ] This specification document has been read and understood
- [ ] Context7 MCP has been consulted for relevant technologies
- [ ] Security requirements are respected (no hardcoded credentials)
- [ ] Deployment process follows `source .env && pnpm cdk deploy` pattern
- [ ] Suggestions align with TanStack Start + AWS CDK architecture
- [ ] Environment variable patterns use required error throwing
- [ ] IAM authentication requirements are maintained

---

## Project Overview

This is a full-stack web application built with TanStack Start, deployed on AWS using CDK (Cloud Development Kit). The project combines modern React frontend capabilities with serverless backend infrastructure.

### Key Technologies
- **Frontend Framework**: TanStack Start with React 19
- **Routing**: TanStack React Router
- **State Management**: TanStack React Query
- **Backend**: tRPC with AWS Lambda
- **Authentication**: Better Auth
- **Infrastructure**: AWS CDK
- **Build Tool**: Vite
- **Runtime**: Nitro (for SSR/deployment)
- **Project Management**: Projen with OwnBatteriesAppProject

## Project Structure

```
examples/tanstack/
├── src/
│   ├── lambdas/          # AWS Lambda functions
│   └── webapp/           # Frontend React application
│       └── routes/       # TanStack Router route definitions
├── lib/                  # CDK infrastructure code
│   ├── aspects/         # CDK aspects for cross-cutting concerns
│   ├── constructs/      # Reusable CDK constructs
│   └── stacks/          # CDK stack definitions
├── bin/
│   └── app.ts           # CDK app entry point
├── .projenrc.ts         # Projen configuration
├── vite.config.ts       # Vite configuration
├── nitro.config.ts      # Nitro deployment configuration
└── cdk.json            # CDK configuration
```

## Configuration Details

### Projen Configuration (.projenrc.ts)
- Uses `OwnBatteriesAppProject` custom project type
- CDK project enabled with Application Signals
- Includes comprehensive dependency management for both frontend and backend

### Vite Configuration
- **Development Server**: Port 3000
- **Target**: AWS Lambda deployment
- **TSR Configuration**:
  - Source Directory: `src/webapp`
  - Routes Directory: `src/webapp/routes`
  - Generated Route Tree: `src/webapp/routeTree.gen.ts`

### CDK Configuration
- **Primary Region**: us-east-1 (required for Lambda@Edge)
- **Stack Name**: TanStackStartCDK
- **Security**: AwsSolutionsChecks (cdk-nag) enabled
- **Application Signals**: Enabled for monitoring

## Dependencies

### Frontend Dependencies
- `@tanstack/react-start`: Full-stack React framework
- `@tanstack/react-router`: Type-safe React routing
- `@tanstack/react-query`: Server state management
- `react` & `react-dom`: React 19
- `better-auth`: Authentication library

### Backend Dependencies
- `@trpc/server` & `@trpc/client`: End-to-end typesafe APIs
- `@aws-lambda-powertools/*`: AWS Lambda utilities (logger, metrics, tracer, etc.)
- `@jaykingson/middyfied-lambda-handler`: Custom Lambda middleware

### Infrastructure Dependencies
- `aws-cdk-lib`: AWS CDK v2
- `constructs`: CDK constructs library
- `cdk-nag`: Security and compliance checks

### Development Dependencies
- `esbuild`: Fast bundler
- `tsx`: TypeScript execution
- `vite-tsconfig-paths`: Path mapping support

## Available Scripts

- `webapp:dev`: Start development server
- `BETTER_AUTH_URL`: Authentication service URL

- `.env`: Local development
- `.env-prod`: Production configuration
## Deployment Architecture

### Frontend
- Built with Vite and TanStack Start
- Deployed as server-side rendered application
- Uses Nitro for AWS Lambda deployment
- Supports both SSR and client-side routing

### Backend
- Serverless architecture with AWS Lambda
- tRPC for type-safe API communication
- AWS Lambda Powertools for observability
- Custom middleware with middyfied-lambda-handler

### Infrastructure
- Defined using AWS CDK
- Includes proper security checks via cdk-nag
- Monitoring enabled through Application Signals
- Deployed to us-east-1 for Lambda@Edge compatibility

## Deployment Guide & Troubleshooting

### Initial Deployment Setup

1. **Configure Environment Variables**
   ```bash
   # Required for production deployment
   export BETTER_AUTH_SECRET=<generate-secure-random-32-bytes>
   export BETTER_AUTH_URL=https://your-cloudfront-domain.cloudfront.net
   export VITE_BETTER_AUTH_URL=https://your-cloudfront-domain.cloudfront.net
   export GITHUB_CLIENT_ID=<from-github-oauth-app>
   export GITHUB_CLIENT_SECRET=<from-github-oauth-app>
   export NODE_ENV=production
   export APP_ACCOUNT=<your-aws-account-id>
   export APP_REGION=us-east-1
   ```

2. **GitHub OAuth App Configuration**
   - Create GitHub OAuth App in Developer Settings
   - Set Homepage URL: `https://your-cloudfront-domain.cloudfront.net`
   - Set Authorization callback URL: `https://your-cloudfront-domain.cloudfront.net/api/auth/callback/github`
   - Copy Client ID and Client Secret for environment variables

3. **Deploy Application**
   ```bash
   # CRITICAL: Source production environment variables and build before deploying
   source .env-prod && nr webapp:build && nr cdk deploy
   ```

   **⚠️ Security Note**: Always use `source .env-prod && nr webapp:build && nr cdk deploy` to ensure production environment variables are loaded and the application is properly built. Plain `pnpm cdk deploy` will fail because required environment variables won't be available.

### Critical Deployment Requirements (Auth Path)

MANDATORY decisions for this stack:

✅ **Lambda Function URL is required**: The server runtime is exposed via a Lambda Function URL and fronted by CloudFront.

✅ **IAM MUST stay enabled on Function URL**: The Function URL uses `AWS_IAM`. CloudFront signs origin requests with SigV4 using a Lambda@Edge origin-request function. Do NOT switch to `NONE`.

✅ **Protection split**:
- Browser ↔ CloudFront: Better Auth (app-level sessions/cookies)
- CloudFront ↔ Lambda Function URL: AWS_IAM (SigV4 via Lambda@Edge)

✅ **Better Auth Configuration**: baseURL, trustedOrigins, and secure cookies are environment-driven.

✅ **Environment Variables**: Better Auth and GitHub OAuth environment variables are required and injected by CDK.

✅ **tRPC/CORS**: Only as needed for app flows; origin calls are not cross-origin because CloudFront terminates TLS and signs requests to the origin.

### Common Deployment Issues & Solutions

**Problem**: Login or API calls failing (404/403) on deployed site
**Root Cause**: CloudFront not signing origin requests to IAM-protected Function URL or path/headers altered
**Solution**: Keep `authType: FunctionUrlAuthType.AWS_IAM`, attach a Lambda@Edge (origin-request) signer that:
  - Preserves the full URI (e.g., `/api/auth/sign-in/social`)
  - Signs for the Function URL host (custom origin domain)
  - Removes transient headers like `x-forwarded-for` before signing

**Problem**: CORS errors during authentication
**Root Cause**: Missing or incorrect CORS headers
**Solution**: Enable CORS credentials and configure trusted origins in Better Auth

**Problem**: GitHub OAuth callback fails
**Root Cause**: Callback URL mismatch between GitHub app and actual domain
**Solution**: Update GitHub OAuth app callback URL to match CloudFront domain

**Problem**: Environment variables not available in Lambda
**Root Cause**: CDK not passing environment variables to Lambda function
**Solution**: Configure environment variables in CDK stack definition

### Security Implementation

**🔐 Credential Management**:
- **Local Development**: Use `.env` file (gitignored)
- **Production**: Set environment variables in AWS Lambda via CDK
- **CI/CD**: Use secure environment variable storage
- **Never commit**: Real credentials to git repository

**🔒 Security Measures Applied**:
- Generated secure BETTER_AUTH_SECRET using crypto.randomBytes(32)
- Secure cookies in production
- Lambda Function URL protected with AWS_IAM; CloudFront signs with SigV4 at the edge
- Environment-based configuration loading

### Monitoring & Debugging

**CloudWatch Logs**:
- Monitor Lambda function logs for authentication errors
- Check for CORS-related issues in browser developer tools
- Verify environment variables are properly loaded

**Testing Checklist**:
- [ ] Homepage loads correctly
- [ ] GitHub login flow works
- [ ] tRPC API endpoints respond
- [ ] Authentication state persists
- [ ] CORS headers present in responses

## Development Guidelines

### Code Organization
1. **Frontend code** goes in `src/webapp/`
2. **Backend Lambda functions** go in `src/lambdas/`
3. **Infrastructure code** goes in `lib/`
4. **Route definitions** use TanStack Router conventions in `src/webapp/routes/`

### Type Safety
- Full end-to-end type safety with tRPC
- TypeScript strict mode enabled
- Generated route tree for type-safe routing

### Authentication
- Better Auth integrated for user management
- Environment-based configuration
- Client-side auth state management

### State Management
- TanStack React Query for server state
- Built-in caching and synchronization
- DevTools available in development

## Common Development Tasks

### Adding New Routes
1. Create route files in `src/webapp/routes/`
2. Follow TanStack Router file-based routing conventions
3. Route tree auto-generates in `routeTree.gen.ts`

### Adding API Endpoints
1. Define tRPC procedures in backend
2. Types automatically available in frontend
3. Use React Query hooks for data fetching

### Infrastructure Changes
1. Modify CDK constructs in `lib/`
2. Use `cdk diff` to preview changes
3. Security checks run automatically

### Environment Setup
1. Copy `.env.example` to `.env`
2. Fill in required environment variables
3. Use `webapp:dev` for local development

## Security Considerations

### 🚨 CRITICAL SECURITY RULES

#### NEVER PUT CREDENTIALS IN SOURCE CODE
- **NEVER hardcode secrets in `.ts`, `.js`, or any source files**
- **NEVER commit real credentials** to git repository  
- **ALWAYS use environment variables for sensitive data**
- **ALWAYS make deployment fail if required env vars are missing**

#### Deployment Security Process
```bash
# CORRECT deployment process that loads production environment variables:
source .env-prod && nr webapp:build && nr cdk deploy

# WRONG - this will fail because env vars aren't loaded:
pnpm cdk deploy
```

#### CDK Environment Variable Configuration
```typescript
// CORRECT - fails deployment if env var missing:
environment: {
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || (() => { 
    throw new Error("BETTER_AUTH_SECRET required") 
  })(),
}

// WRONG - hardcoded secret in source code:
environment: {
  BETTER_AUTH_SECRET: "some-hardcoded-value", // ❌ NEVER DO THIS
}
```

### Credential Management Checklist
- **⚠️ NEVER commit real credentials** to git repository
- Use `.env` file for local development (already in .gitignore)
- Set environment variables in AWS Lambda via CDK or Systems Manager Parameter Store
- Generate secure secrets using `crypto.randomBytes(32).toString('base64')`
- Rotate credentials regularly

### Security Audit Commands
```bash
# Check for potential credential leaks
git log --all --grep="password\|secret\|key" --oneline
git diff --cached | grep -i "password\|secret\|key\|token"

# Scan for common secret patterns
grep -r "AKIA[0-9A-Z]{16}" . --exclude-dir=node_modules
grep -r "github_pat_" . --exclude-dir=node_modules
```

### Required Security Measures
- CDK NAG checks enabled for infrastructure security
- Better Auth for secure authentication with proper cookie configuration
- AWS Lambda Powertools for security logging and monitoring
- Environment variable management for all sensitive configuration
- GitHub OAuth app configured with exact callback URLs
- CORS properly configured for production domains only
- Secure cookies enabled in production environments
- Function URL authentication set to AWS_IAM (requests from CloudFront are SigV4-signed by Lambda@Edge)

### Local vs Deployed Auth Flow

- Local dev (vite): App runs at http://localhost:3000 and Better Auth endpoints are handled by the dev server/Nitro without IAM. Use `BETTER_AUTH_URL=http://localhost:3000`.
- Deployed: CloudFront proxies all routes to the Lambda Function URL origin. The origin requires AWS_IAM; CloudFront attaches a SigV4 signature via a Lambda@Edge origin-request function. Better Auth manages user sessions; IAM protects the origin.

### If Credentials Are Leaked
1. **Immediately rotate** all affected credentials
2. **Remove from git history** using BFG Repo-Cleaner
3. **Check access logs** for unauthorized usage
4. **Update all deployment environments** with new credentials

## Open Tasks & Known Issues

### Immediate Action Items
- [ ] **Deploy Updated Code**: Run `source .env-prod && nr webapp:build && nr cdk deploy` with latest security fixes
- [ ] **Verify GitHub OAuth**: Ensure callback URL matches CloudFront domain exactly
- [ ] **Test Authentication Flow**: Verify login/logout works on deployed site
- [ ] **Monitor CloudWatch**: Check Lambda logs for any remaining errors
- [ ] **Security Audit**: Run credential scanning commands to ensure no leaks

### Environment Configuration Tasks
- [ ] **Generate Production Secrets**: Create new BETTER_AUTH_SECRET for production
- [ ] **AWS Parameter Store**: Consider migrating to Parameter Store for enhanced security
- [ ] **CI/CD Integration**: Set up secure environment variable injection in deployment pipeline
- [ ] **Credential Rotation**: Implement regular rotation schedule for OAuth credentials

### Performance & Monitoring Tasks
- [ ] **CloudWatch Dashboards**: Set up monitoring for authentication metrics
- [ ] **Error Alerting**: Configure alerts for authentication failures
- [ ] **Performance Testing**: Load test authentication flows
- [ ] **Cache Optimization**: Review and optimize tRPC query caching strategies

### Development Workflow Tasks
- [ ] **Developer Documentation**: Create onboarding guide for new team members
- [ ] **Testing Suite**: Expand test coverage for authentication flows
- [ ] **Type Safety**: Ensure full end-to-end type safety across all endpoints
- [ ] **Code Quality**: Set up additional linting rules for security patterns

### Infrastructure Improvements
- [ ] **Multi-Region**: Consider multi-region deployment for better availability
- [ ] **Backup Strategy**: Implement proper backup for user data
- [ ] **Disaster Recovery**: Document and test disaster recovery procedures
- [ ] **Cost Optimization**: Review and optimize AWS resource usage

### Security Enhancements
- [ ] **Rate Limiting**: Implement rate limiting for authentication endpoints
- [ ] **Session Management**: Review session timeout and refresh token policies
- [ ] **Audit Logging**: Enhanced audit trail for all authentication events
- [ ] **Penetration Testing**: Schedule regular security assessments

## Performance Optimizations

- Vite for fast development builds
- TanStack Query for intelligent caching
- Server-side rendering with TanStack Start
- AWS Lambda for serverless scaling

## Monitoring and Observability

- AWS Application Signals enabled
- Lambda Powertools for structured logging
- Metrics and tracing built-in
- CDK deployment monitoring

## Notes for Copilot

### 🚨 MANDATORY: Always Reference This Specification Document

**BEFORE providing ANY assistance, GitHub Copilot MUST:**
1. **Read and understand** this entire project specification document
2. **Verify compatibility** with the documented architecture and technology stack
3. **Ensure compliance** with all security requirements and deployment processes
4. **Follow** the established patterns and conventions outlined here
5. **Never suggest** anything that contradicts the specifications
6. **NEVER create separate documentation files** - update this document instead

**This document takes PRECEDENCE over general knowledge or external documentation.**

### 🚫 DO NOT CREATE SEPARATE FILES

**GitHub Copilot must NEVER create:**
- ❌ `SECURITY_CHECKLIST.md`
- ❌ `DEPLOYMENT_FIX.md`
- ❌ Separate troubleshooting guides
- ❌ Standalone security documentation
- ❌ Individual deployment guides

**Instead, ALWAYS:**
- ✅ Update this specifications document
- ✅ Add new sections to this document
- ✅ Consolidate information here
- ✅ Reference this single source of truth

### Critical Requirement: Context7 MCP Integration
**ALWAYS consult Context7 MCP for every Copilot request** - This is mandatory for all assistance requests related to this project. Context7 provides up-to-date documentation and best practices for all the technologies used in this stack. Before providing any code suggestions, implementation guidance, or troubleshooting help, you must:

1. **Query Context7 MCP** for relevant documentation on the specific technology being discussed
2. **Cross-reference** the provided guidance with the latest documentation from this specification
3. **Ensure recommendations** align with current best practices from both sources
4. **Verify compatibility** between different library versions using Context7 data
5. **Prioritize this specification** when there are conflicts between sources

### Required Consultation Order
For every Copilot request:
1. **First**: Review this project specification document
2. **Second**: Consult Context7 MCP for technical documentation
3. **Third**: Apply general programming knowledge
4. **Always**: Ensure alignment with project security and architecture requirements

### General Development Guidelines
1. **Always consider the full-stack nature** - changes may affect both frontend and backend
2. **Respect the file-based routing** - follow TanStack Router conventions
3. **Maintain type safety** - leverage tRPC for API changes
4. **Consider AWS deployment** - code runs in Lambda environment
5. **Use Projen patterns** - leverage the OwnBatteriesAppProject configuration
6. **Follow security best practices** - CDK NAG checks must pass
7. **Environment configuration** - respect the different deployment environments
8. **Development workflow** - use provided scripts for consistency
