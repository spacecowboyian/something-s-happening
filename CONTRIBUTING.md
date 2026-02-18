# Contributing to something-s-happening

Thank you for your interest in contributing! This document provides guidelines for contributing to this project.

## Commit Message Guidelines

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification. All commit messages must follow this format:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Type

Must be one of the following:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, etc.)
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files
- **revert**: Reverts a previous commit

### Scope (Optional)

The scope should be the name of the affected component or area (e.g., `api`, `ui`, `database`, `deployment`).

### Description

- Use the imperative, present tense: "change" not "changed" nor "changes"
- Don't capitalize the first letter
- No period (.) at the end
- Maximum 100 characters

### Examples

```
feat(api): add endpoint for event search
fix(ui): correct navigation bar alignment on mobile
docs(readme): update installation instructions
chore(deps): upgrade Next.js to version 16.1.6
ci(workflow): add commit message validation
```

### Breaking Changes

Breaking changes should be indicated by a `!` after the type/scope and explained in the footer:

```
feat(api)!: change event response format

BREAKING CHANGE: The event API now returns data in a different format.
Clients must update to handle the new response structure.
```

## Commit Message Validation

This repository uses:
- **commitlint** to validate commit messages
- **husky** to run validation automatically via git hooks

When you commit, your message will be automatically validated. If it doesn't follow the conventional commits format, the commit will be rejected with an error message.

### Testing Your Commit Message

You can test your commit message format before committing:

```bash
echo "feat: add new feature" | npx commitlint
```

## Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Make your changes
4. Run tests: `npm test`
5. Run linter: `npm run lint`
6. Commit your changes with a conventional commit message
7. Push to the branch (`git push origin feat/amazing-feature`)
8. Open a Pull Request

## Pull Request Guidelines

- Ensure all tests pass
- Update documentation as needed
- Follow the conventional commits format for all commits
- Keep PRs focused on a single feature or fix
- Reference any related issues in the PR description

## Release Process

This project uses [standard-version](https://github.com/conventional-changelog/standard-version) for automated releases:

- Conventional commits are analyzed to determine version bump
- CHANGELOG.md is automatically updated
- Version is bumped in package.json
- Git tag is created

To create a release:

```bash
npm run release
```

## Questions?

If you have questions or need help, please open an issue in the repository.
