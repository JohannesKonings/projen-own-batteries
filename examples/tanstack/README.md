# TanStack Start Project

A full-stack web application built with TanStack Start, deployed on AWS using CDK.

## 🚨 IMPORTANT FOR DEVELOPERS

**Before working on this project, you MUST read the project specifications:**

👉 **[specs/project-specifications.md](./specs/project-specifications.md)** 👈

This document contains all critical information including:
- Architecture and technology stack
- Security requirements and deployment processes
- Code patterns and conventions
- Environment variable management

## 📋 For GitHub Copilot Users

**MANDATORY**: GitHub Copilot must consult the project specifications document for EVERY request related to this project. The specifications document takes precedence over general knowledge.

### Required Reading Order:
1. **[Project Specifications](./specs/project-specifications.md)** (this document)
2. Context7 MCP for technical documentation
3. General programming knowledge

## Quick Start

### Prerequisites
- Node.js 18+
- AWS CLI configured
- Environment variables set up

### Development
```bash
# Install dependencies
pnpm install

# Start development server
pnpm webapp:dev
```

### Deployment
```bash
# Build application
pnpm webapp:build

# Deploy to production (loads production environment variables)
source .env-prod && nr webapp:build && nr cdk deploy
```

⚠️ **Security Note**: Always use `source .env-prod && nr webapp:build && nr cdk deploy` for production - never deploy without loading environment variables.

## Key Technologies

- **Frontend**: TanStack Start (React 19)
- **Backend**: tRPC + AWS Lambda  
- **Infrastructure**: AWS CDK
- **Authentication**: Better Auth
- **Build**: Vite
- **Deployment**: Nitro

## Documentation

- **[Project Specifications](./specs/project-specifications.md)** - Complete project documentation (MANDATORY for all assistance)

**Note**: All security checklists, deployment guides, and troubleshooting information are consolidated in the project specifications document. Do not create separate documentation files.

## Security Requirements

- Never hardcode credentials in source files
- Always use environment variables with validation
- Use IAM authentication for Lambda Function URLs
- Follow the deployment security process

For complete security guidelines, see the [project specifications](./specs/project-specifications.md).
