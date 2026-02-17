# GitHub Actions Authentication Guide

## Overview

This document explains how to configure GitHub Actions workflows to properly authenticate when performing git operations, particularly when pushing changes back to the repository.

## The Problem

When a GitHub Actions workflow attempts to push changes to the repository, it may encounter authentication errors like:

```
fatal: could not read Username for 'https://github.com': No such device or address
```

This happens when the workflow lacks proper authentication credentials.

## Solution

### 1. Using `actions/checkout` with Persisted Credentials (Recommended)

The `actions/checkout` action automatically configures git with authentication when `persist-credentials` is set to `true` (which is the default).

```yaml
- name: Checkout code
  uses: actions/checkout@v4
  with:
    persist-credentials: true  # This is the default
```

With this configuration, the checkout action:
- Sets up git credentials using the `GITHUB_TOKEN`
- Configures the remote URL to use the token for authentication
- Allows subsequent git operations (including push) to work without additional authentication

### 2. Manual Git Authentication Setup

If you need to manually configure git authentication (e.g., for custom workflows), use:

```yaml
- name: Checkout code
  uses: actions/checkout@v4

- name: Configure Git credentials
  run: |
    git config --global user.email "github-actions[bot]@users.noreply.github.com"
    git config --global user.name "github-actions[bot]"
    git remote set-url origin https://x-access-token:${{ secrets.GITHUB_TOKEN }}@github.com/${{ github.repository }}.git
```

### 3. Required Permissions

Ensure your workflow has the necessary permissions. Add this at the workflow level:

```yaml
permissions:
  contents: write  # Required for pushing changes
```

For read-only operations, use:
```yaml
permissions:
  contents: read
```

## Example: Workflow That Pushes Changes

Here's a complete example of a workflow that makes changes and pushes them back:

```yaml
name: Automated Updates

on:
  workflow_dispatch:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday

permissions:
  contents: write

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          persist-credentials: true
          
      - name: Make changes
        run: |
          # Your commands that modify files
          echo "Updated on $(date)" >> UPDATES.md
          
      - name: Commit and push changes
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add .
          git commit -m "Automated update: $(date)" || echo "No changes to commit"
          git push
```

## Current Repository Workflows

### nextjs.yml
- **Purpose**: Deploy Next.js site to GitHub Pages
- **Permissions**: `contents: read`, `pages: write`, `id-token: write`
- **Authentication**: Not needed (doesn't push to repository)

### pr-checks.yml
- **Purpose**: Run linting and build checks on pull requests
- **Permissions**: `contents: read`
- **Authentication**: Not needed (doesn't push to repository)

## Troubleshooting

### Error: "could not read Username"
**Solution**: Ensure `persist-credentials: true` in `actions/checkout` or manually configure git credentials with `GITHUB_TOKEN`.

### Error: "Permission denied"
**Solution**: Add `contents: write` permission to the workflow.

### Error: "refusing to allow a GitHub App to create or update workflow"
**Solution**: Use a Personal Access Token (PAT) instead of `GITHUB_TOKEN` for workflows that modify workflow files:

```yaml
- name: Checkout
  uses: actions/checkout@v4
  with:
    token: ${{ secrets.PAT_TOKEN }}
```

## Best Practices

1. **Use `persist-credentials: true`**: Always use the default persisted credentials for most workflows
2. **Minimal permissions**: Only grant `contents: write` when necessary
3. **Bot identity**: Use `github-actions[bot]` as the committer for automated changes
4. **Conditional pushes**: Always check if there are changes before attempting to push:
   ```bash
   git diff --quiet || git push
   ```

## Security Considerations

- The `GITHUB_TOKEN` is automatically provided by GitHub Actions and has repository-scoped permissions
- Tokens are automatically revoked after the job completes
- Never commit personal access tokens or secrets to the repository
- Use GitHub Secrets for any additional authentication tokens needed

## References

- [GitHub Actions: Automatic token authentication](https://docs.github.com/en/actions/security-guides/automatic-token-authentication)
- [actions/checkout documentation](https://github.com/actions/checkout)
- [Workflow permissions](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#permissions)
