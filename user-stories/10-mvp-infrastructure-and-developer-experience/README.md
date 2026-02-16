# Epic 10: MVP Infrastructure & Developer Experience

## Overview
Foundations for AI-driven development, preview environments per PR, automated checks, and agent-first workflows.

## Scope
This epic focuses on developer productivity and infrastructure:
- CI/CD pipeline setup
- Preview deployments for PRs
- Automated testing infrastructure
- Code quality checks (linting, type checking)
- AI-assisted development workflows
- GitHub Copilot integration
- Development environment setup
- Documentation and onboarding

## Key User Flows
1. **PR Preview**: Developer opens PR → automatic preview deployment → review
2. **Automated Checks**: Code pushed → tests run → quality gates enforced
3. **Copilot Integration**: Developer works on story → Copilot assists with context
4. **Local Development**: New developer → quick setup → productive immediately
5. **Documentation**: Developer needs info → finds clear, up-to-date docs

## Technical Considerations
- GitHub Actions workflows
- Preview environment infrastructure (Vercel, Netlify, or custom)
- Test framework and coverage
- ESLint and TypeScript configuration
- Copilot workspace configuration
- Development dependencies and tooling
- Environment variable management
- Database migration strategies

## MVP Priority
🔴 Critical - Enables efficient development of everything else

## Story Naming Convention
Files should be named: `10-[story-number]-[description].md`

Example: `10-001-ci-cd-pipeline-setup.md`
