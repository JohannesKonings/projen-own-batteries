# Project Specifications Directory

## 📖 Project Documentation

This directory contains the complete project specifications for the TanStack Start project.

### Required Reading

- **[project-specifications.md](./project-specifications.md)** - **MANDATORY resource for ALL GitHub Copilot requests**

## For GitHub Copilot Users

**⚠️ IMPORTANT**: Before asking for any assistance on this project, GitHub Copilot must read and understand the `project-specifications.md` file. This document contains:

- Architecture decisions and technology stack
- Security requirements and deployment processes  
- Code patterns and conventions
- Environment variable management
- Integration requirements (Context7 MCP)

## Quick Reference

### Deployment Command
```bash
# Production deployment
source .env-prod && nr webapp:build && nr cdk deploy
```

### Security Rules
- Never hardcode credentials in source files
- Always use environment variables with required validation
- Always use IAM authentication for Lambda Function URLs

### Required Tools
- Context7 MCP for technical documentation
- CloudWatch MCP for log analysis
- This specification document for project guidelines

## File Structure

```
specs/
├── README.md                    # This file
├── project-specifications.md    # Main specification document (REQUIRED)
└── ...                         # Additional specification files
```
