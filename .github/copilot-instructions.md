# GitHub Copilot Instructions

## Repository-Wide Guidelines

### For examples/tanstack Project

**🚨 MANDATORY: When working in `examples/tanstack/`**

1. **ALWAYS read the project specifications FIRST**:
   - 📖 **[examples/tanstack/specs/project-specifications.md](./examples/tanstack/specs/project-specifications.md)**
   - This document is the single source of truth for the project
   - All suggestions must align with the documented architecture and security requirements

2. **NEVER create separate documentation files**:
   - ❌ **DO NOT create** `SECURITY_CHECKLIST.md`
   - ❌ **DO NOT create** `DEPLOYMENT_FIX.md` 
   - ❌ **DO NOT create** separate troubleshooting guides
   - ✅ **DO update** the main specifications document instead

3. **Security Requirements**:
   - Never hardcode credentials in source files
   - Always use environment variables with required validation
   - Use production deployment command: `source .env-prod && nr webapp:build && nr cdk deploy`
   - Maintain IAM authentication for Lambda Function URLs

4. **Consultation Order**:
   - **First**: Read project specifications document
   - **Second**: Consult Context7 MCP for technical documentation
   - **Third**: Apply general programming knowledge
   - **Always**: Ensure alignment with project requirements

### Technology Stack (examples/tanstack)
- **Frontend**: TanStack Start with React 19
- **Backend**: tRPC with AWS Lambda
- **Infrastructure**: AWS CDK
- **Authentication**: Better Auth
- **Deployment**: Nitro to AWS Lambda

### Required Tools Integration
- **Context7 MCP**: For up-to-date technical documentation
- **CloudWatch MCP**: For log analysis and debugging

## General Repository Guidelines

### Projen Projects
- This repository uses Projen for project management
- Respect existing `.projenrc.ts` configurations
- Use Projen patterns and conventions

### Security Best Practices
- Never commit credentials to git
- Use environment variables for sensitive data
- Follow AWS security best practices
- Enable CDK NAG checks for infrastructure

## Copilot Behavior Rules

1. **Always check project context** before providing suggestions
2. **Reference existing documentation** rather than creating new files
3. **Maintain consistency** with established patterns
4. **Prioritize security** in all recommendations
5. **Use specified tools** (Context7 MCP, CloudWatch MCP) when available
6. **env variables** never update env files like .env or .env-prod
