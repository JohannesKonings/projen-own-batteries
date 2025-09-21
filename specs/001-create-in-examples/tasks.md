# Tasks: tanstack-start

**Input**: Design documents from `/specs/001-create-in-examples/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → Found: tanstack-start with TanStack Start + AWS CDK + CloudFront + Lambda
   → Extract: TypeScript, AWS CDK v2, TanStack Start, React 19, DynamoDB, S3
2. Load optional design documents:
   → data-model.md: User Session, Application State, Static Asset Metadata, API Request Log
   → contracts/: api.yaml (5 endpoints), cdk-infrastructure.md (CDK contracts)
   → research.md: CloudFront OAC, Lambda Nitro, multi-tier caching, WAF v2
   → quickstart.md: 7 test scenarios for validation
3. Generate tasks by category:
   → Setup: CDK project, TanStack Start app, dependencies
   → Tests: contract tests for API endpoints, integration tests for infrastructure
   → Core: DynamoDB models, Lambda functions, CDK constructs
   → Integration: CloudFront distribution, WAF, monitoring
   → Polish: performance optimization, security hardening, documentation
4. Apply task rules:
   → CDK constructs and Lambda functions = mark [P] for parallel
   → Same stack files = sequential (no [P])
   → Contract tests before API implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph with infrastructure focus
7. Create parallel execution examples for CDK constructs
8. Validate task completeness:
   → All API endpoints have contract tests ✓
   → All data entities have DynamoDB models ✓
   → All infrastructure components implemented ✓
9. Return: SUCCESS (tasks ready for CloudFront + Lambda CDK execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
**Web app structure** (per plan.md):
- **CDK Infrastructure**: `examples/tanstack/lib/`
- **Lambda Functions**: `examples/tanstack/src/lambdas/`
- **Frontend App**: `examples/tanstack/src/`
- **Tests**: `examples/tanstack/tests/`

## Phase 3.1: Setup
- [ ] T001 Create TanStack Start project structure in `examples/tanstack/`
- [ ] T002 Initialize CDK project with TypeScript in `examples/tanstack/`
- [ ] T003 [P] Configure package.json with TanStack Start and AWS CDK v2 dependencies
- [ ] T004 [P] Setup development environment files (.env.example, .env-development)
- [ ] T005 [P] Configure TypeScript and build tools (tsconfig.json, vite.config.ts)
- [ ] T006 [P] Setup linting and formatting (ESLint, Prettier) for CDK and frontend

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Contract Tests
- [ ] T007 [P] Contract test GET /api/health in `tests/contract/health.test.ts`
- [ ] T008 [P] Contract test POST /api/auth/login in `tests/contract/auth-login.test.ts`
- [ ] T009 [P] Contract test POST /api/auth/logout in `tests/contract/auth-logout.test.ts`
- [ ] T010 [P] Contract test GET /api/auth/me in `tests/contract/auth-me.test.ts`
- [ ] T011 [P] Contract test GET /api/user/preferences in `tests/contract/user-preferences-get.test.ts`
- [ ] T012 [P] Contract test PUT /api/user/preferences in `tests/contract/user-preferences-put.test.ts`

### Infrastructure Tests
- [ ] T013 [P] CDK unit tests for DynamoDB stack in `tests/cdk/dynamodb-stack.test.ts`
- [ ] T014 [P] CDK unit tests for Lambda stack in `tests/cdk/lambda-stack.test.ts`
- [ ] T015 [P] CDK unit tests for CloudFront stack in `tests/cdk/cloudfront-stack.test.ts`
- [ ] T016 [P] CDK unit tests for WAF stack in `tests/cdk/waf-stack.test.ts`

### Integration Tests
- [ ] T017 [P] Integration test CDK deployment in `tests/integration/cdk-deployment.test.ts`
- [ ] T018 [P] Integration test CloudFront distribution in `tests/integration/cloudfront.test.ts`
- [ ] T019 [P] Integration test Lambda function URLs in `tests/integration/lambda-urls.test.ts`
- [ ] T020 [P] Integration test DynamoDB tables in `tests/integration/dynamodb.test.ts`

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Data Models and DynamoDB
- [ ] T021 [P] User Session model in `src/models/user-session.ts`
- [ ] T022 [P] Application State model in `src/models/application-state.ts`
- [ ] T023 [P] Static Asset Metadata model in `src/models/asset-metadata.ts`
- [ ] T024 [P] API Request Log model in `src/models/request-log.ts`
- [ ] T025 [P] DynamoDB construct for Sessions table in `lib/constructs/sessions-table.ts`
- [ ] T026 [P] DynamoDB construct for Request Logs table in `lib/constructs/request-logs-table.ts`

### Lambda Functions
- [ ] T027 [P] API Lambda function handler in `src/lambdas/api/index.ts`
- [ ] T028 [P] SSR Lambda function handler in `src/lambdas/ssr/index.ts`
- [ ] T029 [P] Health check endpoint implementation in `src/lambdas/api/routes/health.ts`
- [ ] T030 Authentication service in `src/lambdas/api/services/auth.ts`
- [ ] T031 User preferences service in `src/lambdas/api/services/user-preferences.ts`
- [ ] T032 Session management middleware in `src/lambdas/api/middleware/session.ts`

### CDK Infrastructure Stacks
- [ ] T033 [P] Main CDK stack in `lib/stacks/main-stack.ts`
- [ ] T034 [P] Lambda stack construct in `lib/constructs/lambda-stack.ts`
- [ ] T035 [P] CloudFront construct in `lib/constructs/cloudfront.ts`
- [ ] T036 [P] S3 buckets construct in `lib/constructs/s3-buckets.ts`
- [ ] T037 [P] WAF construct in `lib/constructs/waf.ts`

### API Endpoints
- [ ] T038 POST /api/auth/login endpoint in `src/lambdas/api/routes/auth/login.ts`
- [ ] T039 POST /api/auth/logout endpoint in `src/lambdas/api/routes/auth/logout.ts`
- [ ] T040 GET /api/auth/me endpoint in `src/lambdas/api/routes/auth/me.ts`
- [ ] T041 GET /api/user/preferences endpoint in `src/lambdas/api/routes/user/preferences-get.ts`
- [ ] T042 PUT /api/user/preferences endpoint in `src/lambdas/api/routes/user/preferences-put.ts`

## Phase 3.4: Integration

### CloudFront and Caching
- [ ] T043 CloudFront cache behaviors configuration in `lib/constructs/cloudfront.ts`
- [ ] T044 Origin Access Control (OAC) setup for S3 in `lib/constructs/cloudfront.ts`
- [ ] T045 Cache policies for static assets vs API vs SSR in `lib/constructs/cache-policies.ts`
- [ ] T046 CloudFront response headers policy in `lib/constructs/response-headers.ts`

### Security Implementation
- [ ] T047 WAF managed rules configuration in `lib/constructs/waf.ts`
- [ ] T048 Rate limiting rules in `lib/constructs/waf.ts`
- [ ] T049 CSP headers implementation in Lambda responses
- [ ] T050 CORS configuration for API endpoints
- [ ] T051 IAM roles and policies for Lambda functions in `lib/constructs/iam.ts`

### Monitoring and Logging
- [ ] T052 [P] CloudWatch log groups for Lambda functions in `lib/constructs/logging.ts`
- [ ] T053 [P] CloudWatch alarms for error rates in `lib/constructs/alarms.ts`
- [ ] T054 [P] CloudWatch alarms for latency in `lib/constructs/alarms.ts`
- [ ] T055 [P] X-Ray tracing configuration for Lambda functions
- [ ] T056 CloudFront access logging to S3 in `lib/constructs/cloudfront.ts`

### Environment Configuration
- [ ] T057 Environment variable management in `lib/constructs/environment.ts`
- [ ] T058 Parameter Store integration for secrets in `lib/constructs/parameters.ts`
- [ ] T059 Stage-specific configuration (dev/staging/prod) in `lib/config/stages.ts`

## Phase 3.5: Polish

### Frontend Integration
- [ ] T060 [P] TanStack Start app initialization in `src/app.tsx`
- [ ] T061 [P] TanStack Router configuration in `src/router.tsx`
- [ ] T062 [P] Authentication provider component in `src/components/auth-provider.tsx`
- [ ] T063 [P] User preferences context in `src/contexts/user-preferences.tsx`
- [ ] T064 [P] API client with tRPC in `src/lib/api-client.ts`

### Performance Optimization
- [ ] T065 [P] Lambda function optimization (memory, timeout) in CDK constructs
- [ ] T066 [P] Bundle size optimization for Lambda functions
- [ ] T067 [P] CloudFront compression settings in `lib/constructs/cloudfront.ts`
- [ ] T068 [P] Static asset optimization and versioning

### Security Hardening
- [ ] T069 [P] Security headers validation in Lambda responses
- [ ] T070 [P] Input validation and sanitization for all endpoints
- [ ] T071 [P] Session security (HTTP-only cookies, secure flags)
- [ ] T072 [P] Secrets rotation strategy documentation

### Documentation and Deployment
- [ ] T073 [P] CDK deployment documentation in `docs/deployment.md`
- [ ] T074 [P] API documentation generation from OpenAPI spec
- [ ] T075 [P] Environment setup guide in `docs/setup.md`
- [ ] T076 [P] Troubleshooting guide in `docs/troubleshooting.md`
- [ ] T077 Execute quickstart validation scenarios from `quickstart.md`

## Dependencies
**Infrastructure Dependencies**:
- DynamoDB tables (T025-T026) before Lambda functions (T027-T028)
- Lambda functions before CloudFront distribution (T035)
- WAF (T037) before CloudFront distribution
- S3 buckets (T036) before CloudFront OAC setup (T044)

**API Dependencies**:
- Models (T021-T024) before services (T030-T031)
- Services before endpoints (T038-T042)
- Session middleware (T032) before protected endpoints

**Testing Dependencies**:
- Contract tests (T007-T012) before endpoint implementation (T038-T042)
- Infrastructure tests (T013-T016) before CDK implementation (T033-T037)
- Integration tests (T017-T020) before deployment validation (T077)

## Parallel Execution Examples

### Phase 3.2 - Contract Tests (All Parallel)
```bash
# Launch T007-T012 together:
Task: "Contract test GET /api/health in tests/contract/health.test.ts"
Task: "Contract test POST /api/auth/login in tests/contract/auth-login.test.ts"
Task: "Contract test POST /api/auth/logout in tests/contract/auth-logout.test.ts"
Task: "Contract test GET /api/auth/me in tests/contract/auth-me.test.ts"
Task: "Contract test GET /api/user/preferences in tests/contract/user-preferences-get.test.ts"
Task: "Contract test PUT /api/user/preferences in tests/contract/user-preferences-put.test.ts"
```

### Phase 3.3 - CDK Constructs (Most Parallel)
```bash
# Launch T025-T026 (DynamoDB) together:
Task: "DynamoDB construct for Sessions table in lib/constructs/sessions-table.ts"
Task: "DynamoDB construct for Request Logs table in lib/constructs/request-logs-table.ts"

# Then launch T034-T037 (Infrastructure) together:
Task: "Lambda stack construct in lib/constructs/lambda-stack.ts"
Task: "CloudFront construct in lib/constructs/cloudfront.ts"
Task: "S3 buckets construct in lib/constructs/s3-buckets.ts"
Task: "WAF construct in lib/constructs/waf.ts"
```

### Phase 3.5 - Frontend Components (All Parallel)
```bash
# Launch T060-T064 together:
Task: "TanStack Start app initialization in src/app.tsx"
Task: "TanStack Router configuration in src/router.tsx"
Task: "Authentication provider component in src/components/auth-provider.tsx"
Task: "User preferences context in src/contexts/user-preferences.tsx"
Task: "API client with tRPC in src/lib/api-client.ts"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify CDK tests fail before implementing constructs
- Verify contract tests fail before implementing endpoints
- Deploy and test after each infrastructure phase
- Focus on CloudFront and Lambda optimization throughout

## CloudFront & Lambda Focus Areas
1. **CloudFront Distribution**: Origin configuration, cache behaviors, security headers
2. **Lambda Functions**: Nitro preset, environment variables, IAM permissions
3. **CDK Integration**: Type-safe constructs, proper dependencies, outputs
4. **Security**: WAF rules, OAC, CSP headers, IAM least privilege
5. **Performance**: Caching strategy, bundle optimization, cold start reduction

## Validation Checklist
*GATE: Checked before task execution*

- [x] All contracts have corresponding tests (T007-T012 cover all 6 API endpoints)
- [x] All entities have model tasks (T021-T024 cover all 4 data entities)
- [x] All tests come before implementation (Phase 3.2 before 3.3)
- [x] Parallel tasks truly independent (different files, no shared dependencies)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] CloudFront and Lambda CDK implementation prioritized
- [x] Infrastructure deployment workflow included