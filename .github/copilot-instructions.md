# Copilot Instructions

## Commit Message Format (REQUIRED)

This repository uses [Conventional Commits](https://www.conventionalcommits.org/). **All commits must follow this format:**

```
<type>(<scope>): <description>
```

### Commit Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style/formatting (no logic change)
- **refactor**: Code restructuring (no feature/fix)
- **perf**: Performance improvement
- **test**: Adding/updating tests
- **build**: Build system/dependencies
- **ci**: CI/CD changes
- **chore**: Other maintenance tasks
- **revert**: Revert previous commit

### Commit Rules

- Use imperative mood: "add" not "added" or "adds"
- Don't capitalize first letter of description
- No period at the end
- Max 100 characters for header
- Scope is optional but recommended (e.g., `api`, `ui`, `db`)

### Commit Examples

✅ **Good:**
```
feat(api): add event search endpoint
fix(ui): resolve mobile navigation alignment
docs(readme): update installation instructions
chore(deps): upgrade Next.js to 16.1.6
```

❌ **Bad:**
```
Added new feature
Fix bug
Updated docs
WIP
```

### Breaking Changes

Use `!` after type/scope for breaking changes:
```
feat(api)!: change event response format

BREAKING CHANGE: The event API now returns ISO 8601 timestamps.
```

**Note:** Commit messages are validated by git hooks and CI. Invalid commits will be rejected. See [CONTRIBUTING.md](../CONTRIBUTING.md) for full guidelines.

## Validation Workflow

- For any UI/UX change, verify behavior in the browser in addition to linting/tests.
- Start the app with `npm run dev` and validate the affected route(s) manually.
- Confirm key interactions, layout behavior, and responsive behavior for the changed feature.
- Include a short note in handoff describing what was browser-verified.

## User Story Update Requirement

- Whenever a commit includes design changes, update the relevant user story with an entry describing what design changed.
- The update should describe how the design shifted during the work; reasoning is not required.
- Keep each design update concise so there is a clear historical record of design evolution over time.

## Tooltip & Style Reuse

- Prefer React Aria tooltip primitives (`TooltipTrigger`, `Tooltip`) over custom CSS-only tooltip behavior.
- Prefer reusable shared styles/components (e.g., in `/src/components`) instead of one-off styles scoped to a single app feature component when the pattern is generic.
