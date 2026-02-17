# PR Deployment 404 - Troubleshooting Guide

## The Problem

PR deployments (like https://spacecowboyian.github.io/something-s-happening/pr-18/) show 404 errors even though the deployment workflow succeeds.

## Why This Happens

The GitHub Actions workflow successfully:
1. ✅ Builds the Next.js application
2. ✅ Deploys files to the `gh-pages` branch
3. ✅ Files are visible in the gh-pages branch

**BUT** GitHub Pages is not serving those files because it hasn't been configured in the repository settings.

## The Solution

You need to **manually enable GitHub Pages** in your repository settings (this only needs to be done once):

### Steps to Fix:

1. **Go to your repository on GitHub**
   - Navigate to: https://github.com/spacecowboyian/something-s-happening

2. **Open Settings → Pages**
   - Click on "Settings" tab
   - Click on "Pages" in the left sidebar

3. **Configure the source**
   - Under "Build and deployment"
   - Set **Source**: "Deploy from a branch"
   - Set **Branch**: `gh-pages`
   - Set **Directory**: `/ (root)`
   - Click **Save**

4. **Wait a few minutes**
   - GitHub Pages will build and publish the site
   - After ~2-5 minutes, your sites will be accessible

5. **Verify it works**
   - Main site: https://spacecowboyian.github.io/something-s-happening/
   - PR-18: https://spacecowboyian.github.io/something-s-happening/pr-18/

## How to Verify Deployments Work

This PR now includes automated deployment verification:

### Automated Verification
- After each PR deployment, a workflow runs Playwright tests
- Tests verify the deployed site is accessible
- Results are posted as a comment on the PR
- If verification fails, you'll see helpful troubleshooting info

### Manual Verification
You can also test deployments manually:

```bash
# Test a specific PR deployment
BASE_URL=https://spacecowboyian.github.io/something-s-happening/pr-18 npm run test:deployment

# Test the main site
BASE_URL=https://spacecowboyian.github.io/something-s-happening npm run test:deployment

# Run with visible browser to see what's happening
BASE_URL=https://example.com npm run test:deployment:headed
```

## Important Notes

### Private Repository Limitation
- ⚠️ **This repository is private**
- GitHub Pages for private repositories requires a **GitHub Pro, Team, or Enterprise plan**
- If you don't have a paid plan, the site won't be publicly accessible even after configuration

### Alternatives for Private Repos
If you need to keep the repo private and don't have a paid plan:
1. **Vercel** (Recommended) - Free for Next.js with full features
2. **Netlify** - Free tier with serverless functions
3. **Make repo public** - If the content isn't sensitive

## What This PR Adds

1. **Playwright deployment tests** - Verify sites are working
2. **Automated verification workflow** - Runs after each deployment
3. **Improved documentation** - Clearer configuration instructions
4. **Better error messages** - Helpful troubleshooting when verification fails

## Next Steps

1. Configure GitHub Pages as described above (or use Vercel/Netlify)
2. Wait for the verification workflow to run on the next PR update
3. Check that the verification passes and the site is accessible

## Questions?

- See `GITHUB_PAGES_SETUP.md` for detailed Pages configuration
- See `__tests__/README.md` for deployment testing documentation
- Check `.github/workflows/verify-pr-deployment.yml` for the verification workflow
