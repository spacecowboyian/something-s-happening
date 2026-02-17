# GitHub Pages Setup

This repository uses GitHub Pages to deploy both the main site and PR previews.

## Configuration Required

**IMPORTANT**: GitHub Pages must be configured to serve from the `gh-pages` branch.

### How to Configure

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

### Troubleshooting

If you see "404 Not Found" when accessing the site:
1. Verify GitHub Pages is configured to use the `gh-pages` branch (see above)
2. Check that the `gh-pages` branch exists and has content
3. Wait a few minutes for GitHub Pages to build and deploy after configuration
4. Ensure workflows have write permissions to the repository
