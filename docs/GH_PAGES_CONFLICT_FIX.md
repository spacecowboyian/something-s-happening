# GitHub Pages Deployment Conflict Resolution

## Problem

GitHub Pages deployments were failing with this error:

```
error: failed to push some refs to 'https://github.com/spacecowboyian/something-s-happening.git'
hint: Updates were rejected because the remote contains work that you do not have locally.
hint: This is usually caused by another repository pushing to the same ref.
```

This occurred when multiple workflows tried to push to the `gh-pages` branch simultaneously.

## Root Cause

Two workflows deploy to gh-pages:
1. **Main Deployment** (`nextjs.yml`) - deploys on push to main branch
2. **PR Preview** (`pr-preview.yml`) - deploys on PR updates

When both run at the same time, they create a race condition:
- Both checkout the current gh-pages state
- Both make changes
- First one to push succeeds
- Second one fails with non-fast-forward error

## Solution

### 1. Unified Concurrency Control

Both workflows now use the same concurrency group:

```yaml
concurrency:
  group: github-pages-deploy
  cancel-in-progress: false
```

This ensures:
- Only one deployment to gh-pages runs at a time
- Queued deployments wait for the current one to complete
- No deployments are cancelled (important for reliability)

### 2. Pull Before Push in Cleanup Job

The PR cleanup job uses manual git commands and now pulls before pushing:

```yaml
# Pull latest changes to avoid non-fast-forward push rejection
git pull origin gh-pages --rebase || {
  echo "Warning: Pull failed, attempting merge strategy"
  git pull origin gh-pages --no-rebase || {
    echo "Error: Unable to pull latest changes"
    exit 1
  }
}
```

This handles:
- Concurrent cleanup operations
- Changes made by other workflows
- Fallback strategies if rebase fails

## How It Works

### Deployment Flow

```
┌─────────────────┐
│ Main Push       │
└────────┬────────┘
         │
         ↓
┌─────────────────┐     ┌──────────────────┐
│ PR Update       │ ──▶ │ Concurrency      │
└─────────────────┘     │ Group:           │
                        │ github-pages-    │
         ↓              │ deploy           │
┌─────────────────┐     │                  │
│ Another PR      │ ──▶ │ Queue: [Job1,    │
└─────────────────┘     │         Job2,    │
                        │         Job3]    │
                        └────────┬─────────┘
                                 │
                                 ↓ (one at a time)
                        ┌────────────────┐
                        │ gh-pages       │
                        │ branch         │
                        └────────────────┘
```

### Benefits

✅ **No more push conflicts** - Deployments are serialized
✅ **Reliable deployments** - Jobs complete instead of being cancelled
✅ **Handles concurrent PRs** - Multiple PRs can be built; pushes are queued
✅ **Cleanup safety** - Manual cleanup pulls latest changes first

## Testing

To verify the fix works:

1. **Create multiple PRs and push to main simultaneously**
   - All deployments should succeed
   - Check Actions tab for queued workflows

2. **Close multiple PRs at once**
   - Cleanup jobs should succeed
   - No push rejection errors

3. **Check gh-pages branch**
   - Should contain all deployments
   - No lost updates

## Alternative Solutions Considered

### Force Push (Not Recommended)
```yaml
force_orphan: true  # Don't do this!
```
❌ Would overwrite concurrent changes
❌ Could lose PR preview directories

### Retry Logic
```yaml
# Complex retry wrapper
```
⚠️ Adds complexity
⚠️ Doesn't prevent the root cause

### Separate Branches
❌ Complicates Pages setup
❌ Doesn't match standard gh-pages workflow

## Best Practices

1. **Always use concurrency control** for gh-pages deployments
2. **Use the same concurrency group** across all workflows that deploy to gh-pages
3. **Pull before manual git push** operations
4. **Set `cancel-in-progress: false`** to complete all deployments
5. **Let peaceiris/actions-gh-pages handle the push** (it's atomic)

## References

- [GitHub Actions Concurrency](https://docs.github.com/en/actions/using-jobs/using-concurrency)
- [peaceiris/actions-gh-pages](https://github.com/peaceiris/actions-gh-pages)
- [Git Non-Fast-Forward Updates](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)
