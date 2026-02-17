# GitHub Pages Setup

This repository uses GitHub Pages to deploy both the main site and PR previews.

## ⚠️ CRITICAL: Manual Configuration Required

**Before deployments will be accessible, you MUST manually enable GitHub Pages in the repository settings.**

Without this configuration:
- ✅ Deployments will succeed and files will be in the `gh-pages` branch
- ❌ But the site will return 404 errors when accessed
- ❌ PR previews will not be accessible

### Required Configuration Steps

### Required Configuration Steps

**You must do this ONCE after the first workflow runs:**

1. Go to your repository settings: `Settings` → `Pages`
2. Under "Build and deployment":
   - **Source**: Select "Deploy from a branch"
   - **Branch**: Select `gh-pages` branch, `/ (root)` directory
3. Click "Save"

### How It Works

- **Main Site**: Deployed to the root of gh-pages branch
  - URL: `https://spacecowboyian.github.io/something-s-happening/`
  - Workflow: `.github/workflows/nextjs.yml`
  - Trigger: Push to `main` branch

- **PR Previews**: Deployed to `pr-{number}/` subdirectories
  - URL: `https://spacecowboyian.github.io/something-s-happening/pr-16/`
  - Workflow: `.github/workflows/pr-preview.yml`
  - Trigger: Push to PR branches
  - Cleanup: Automatic when PR is closed

### Deployment Method

Both workflows use `peaceiris/actions-gh-pages@v3` to deploy to the gh-pages branch:
- Main deployment uses `keep_files: true` to preserve PR preview directories
- PR deployments use `destination_dir: pr-{number}` and `keep_files: true`
- This allows main site at root and PR previews in subdirectories to coexist

### Automated Deployment Verification

After each PR deployment, an automated verification workflow runs that:
1. Waits for GitHub Pages to publish the deployment
2. Uses Playwright to test the deployed site
3. Verifies that pages load correctly
4. Posts a comment on the PR with verification results

If verification fails, check:
- GitHub Pages is enabled (see configuration above)
- The site is not private (GitHub Pages requires a paid plan for private repos)
- Wait a few minutes for GitHub Pages to publish after the first deployment

### Troubleshooting

If you see "404 Not Found" when accessing the site:
1. Verify GitHub Pages is configured to use the `gh-pages` branch (see above)
2. Check that the `gh-pages` branch exists and has content
3. Wait a few minutes for GitHub Pages to build and deploy after configuration
4. Ensure workflows have write permissions to the repository
