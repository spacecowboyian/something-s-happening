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

## PR Title and Description Management

**IMPORTANT:** When using the `report_progress` tool:

- **DO NOT** change the PR title and description to match only the last commit or change
- **DO** ensure both the PR title and description serve to summarize **ALL** changes in the branch
- **DO** update the description to add new items to the checklist or summary, but maintain the overall context
- **DO** keep the PR title broad enough to encompass all work in the branch

### PR Title Guidelines

The PR title should describe the overall goal or theme of the branch, not just the most recent change.

✅ **Good PR Titles (Comprehensive):**
```
Integrate social media data with event timeline view
Add event playback controls and timeline improvements
Implement user authentication and profile management
```

❌ **Bad PR Titles (Too Specific to Last Change):**
```
Fix typo in comment
Update documentation
Add logging statement
```

### PR Description Guidelines

The PR description should:
- Maintain a checklist of all major changes/features in the branch
- Add new items as work progresses
- Keep completed items marked with `[x]`
- Provide a summary section that describes the full scope of changes
- Include context about why the changes were made

✅ **Good PR Description (Cumulative):**
```markdown
- [x] Create database schema for events
- [x] Add social media API integrations
- [x] Build event timeline component
- [x] Add playback controls
- [ ] Write integration tests
- [ ] Update documentation

## Summary
This PR adds the complete event timeline feature, including social media
integration, playback controls, and the UI components needed to display
events chronologically.
```

❌ **Bad PR Description (Only Last Change):**
```markdown
- [x] Add logging statement

## Summary
Added a logging statement for debugging.
```

### When to Update vs Preserve

- **Update:** Add new checklist items, mark items complete, add details about new changes
- **Preserve:** The overall PR title, the main summary, previously completed work items
- **Never:** Replace the entire description with only the latest change

## Tooltip & Style Reuse

- Prefer React Aria tooltip primitives (`TooltipTrigger`, `Tooltip`) over custom CSS-only tooltip behavior.
- Prefer reusable shared styles/components (e.g., in `/src/components`) instead of one-off styles scoped to a single app feature component when the pattern is generic.
