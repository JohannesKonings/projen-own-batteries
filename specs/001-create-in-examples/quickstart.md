# Quickstart: TanStack Start with CloudFront and Lambda

**Purpose**: Validate the complete implementation through user scenarios  
**Date**: September 15, 2025  
**Prerequisites**: AWS CLI configured, Node.js 18+, pnpm installed

## Test Scenario 1: Infrastructure Deployment

### Setup
```bash
# Clone and setup project
cd examples/tanstack
pnpm install

# Configure environment
cp .env.example .env-development
# Edit .env-development with your AWS account details

# Deploy infrastructure
source .env-development && pnpm cdk deploy
```

### Validation Steps
1. **CDK Deployment Success**
   - [ ] CDK deploy completes without errors
   - [ ] CloudFormation stack shows CREATE_COMPLETE status
   - [ ] All outputs are displayed (CloudFront URL, Lambda URLs)

2. **CloudFront Distribution**
   - [ ] Distribution shows "Deployed" status in AWS console
   - [ ] Origin points to Lambda Function URL
   - [ ] Cache behaviors are configured correctly
   - [ ] WAF is attached to distribution

3. **Lambda Functions**
   - [ ] API function is created and active
   - [ ] SSR function is created and active
   - [ ] Environment variables are set correctly
   - [ ] Function URLs are configured with IAM auth

4. **DynamoDB Tables**
   - [ ] Sessions table exists with TTL attribute
   - [ ] Request logs table exists with proper indexes
   - [ ] Encryption at rest is enabled

**Expected Result**: Infrastructure is deployed and accessible

## Test Scenario 2: Application Access

### Setup
```bash
# Get CloudFront URL from CDK outputs
CLOUDFRONT_URL=$(aws cloudformation describe-stacks \
  --stack-name TanStackStartStack \
  --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontUrl`].OutputValue' \
  --output text)

echo "Application URL: $CLOUDFRONT_URL"
```

### Validation Steps
1. **Homepage Access**
   - [ ] Navigate to CloudFront URL
   - [ ] Page loads within 3 seconds
   - [ ] No console errors
   - [ ] Content is served from CloudFront (check response headers)

2. **Static Assets**
   - [ ] CSS loads from CloudFront
   - [ ] JavaScript bundles load correctly
   - [ ] Images display properly
   - [ ] Assets have cache headers (1 year TTL)

3. **Server-Side Rendering**
   - [ ] Initial page load includes server-rendered HTML
   - [ ] View source shows populated content (not just loading state)
   - [ ] Hydration works correctly (React devtools)

**Expected Result**: Application loads correctly with optimal performance

## Test Scenario 3: API Functionality

### Setup
```bash
# Test API endpoints through CloudFront
API_BASE_URL="$CLOUDFRONT_URL/api"
```

### Validation Steps
1. **Health Check**
   ```bash
   curl -X GET "$API_BASE_URL/health" \
     -H "Accept: application/json"
   ```
   - [ ] Returns 200 status code
   - [ ] Response includes health status, timestamp, version
   - [ ] Response time < 200ms (after cold start)

2. **Authentication Flow**
   ```bash
   # Test login (will fail without user, but should return proper error)
   curl -X POST "$API_BASE_URL/auth/login" \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"testpass"}'
   ```
   - [ ] Returns 401 status for invalid credentials
   - [ ] Error response includes requestId
   - [ ] No sensitive information in error

3. **CORS and Security Headers**
   ```bash
   curl -I "$API_BASE_URL/health"
   ```
   - [ ] CORS headers present for allowed origins
   - [ ] Security headers included (CSP, HSTS, etc.)
   - [ ] No sensitive headers exposed

**Expected Result**: API responds correctly with proper error handling

## Test Scenario 4: Authentication Integration

### Setup
```bash
# Use browser dev tools or Postman for interactive testing
```

### Validation Steps
1. **User Registration/Login**
   - [ ] Navigate to /login page
   - [ ] Enter valid credentials
   - [ ] Successful login redirects to dashboard
   - [ ] Session cookie is set (HTTP-only, Secure)

2. **Session Management**
   - [ ] Authenticated pages require valid session
   - [ ] Session expires after configured timeout
   - [ ] Logout clears session and redirects

3. **User Preferences**
   - [ ] Can access /preferences page when authenticated
   - [ ] Theme changes apply immediately
   - [ ] Language preferences persist across sessions
   - [ ] Settings sync across browser tabs

**Expected Result**: Authentication works securely end-to-end

## Test Scenario 5: Performance and Caching

### Setup
```bash
# Use browser dev tools Network tab
```

### Validation Steps
1. **Cache Behavior Verification**
   - [ ] First visit: Assets load from origin
   - [ ] Subsequent visits: Assets load from cache (CloudFront)
   - [ ] API responses respect cache headers
   - [ ] SSR pages are not cached inappropriately

2. **Global Performance**
   - [ ] Test from multiple geographic regions
   - [ ] Verify edge location usage (CloudFront headers)
   - [ ] Measure Time to First Byte (TTFB) < 200ms
   - [ ] Largest Contentful Paint (LCP) < 2.5s

3. **Lambda Cold Start**
   - [ ] Measure cold start time < 2 seconds
   - [ ] Subsequent requests < 100ms
   - [ ] Concurrent requests handle properly

**Expected Result**: Optimal performance with proper caching

## Test Scenario 6: Security Validation

### Setup
```bash
# Use OWASP ZAP or similar security testing tools
```

### Validation Steps
1. **WAF Protection**
   - [ ] Attempt SQL injection attacks (blocked)
   - [ ] Test rate limiting (requests throttled)
   - [ ] Verify geo-blocking if configured

2. **Content Security Policy**
   - [ ] No inline script violations
   - [ ] External resources from allowed domains only
   - [ ] No XSS attack vectors

3. **HTTPS and Headers**
   - [ ] All traffic redirected to HTTPS
   - [ ] HSTS header present and valid
   - [ ] X-Frame-Options prevents clickjacking

**Expected Result**: Application is secure against common attacks

## Test Scenario 7: Monitoring and Logging

### Setup
```bash
# Access AWS CloudWatch console
```

### Validation Steps
1. **CloudWatch Logs**
   - [ ] Lambda function logs appear in CloudWatch
   - [ ] Log retention set to 30 days
   - [ ] Structured logging format used

2. **CloudWatch Metrics**
   - [ ] Lambda invocation metrics available
   - [ ] CloudFront metrics showing traffic
   - [ ] DynamoDB metrics for table operations

3. **Alarms and Alerts**
   - [ ] Error rate alarms configured
   - [ ] Latency alarms configured
   - [ ] Cost monitoring alerts set up

**Expected Result**: Comprehensive monitoring is in place

## Cleanup (Optional)

```bash
# Remove all resources to avoid costs
source .env-development && pnpm cdk destroy
```

## Success Criteria

- [ ] All test scenarios pass without errors
- [ ] Performance metrics meet requirements
- [ ] Security validations confirm protection
- [ ] Infrastructure deploys reliably
- [ ] Application functions as expected for end users

**Total Estimated Time**: 45-60 minutes for complete validation