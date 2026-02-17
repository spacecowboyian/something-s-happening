# GitHub Pages Deployment

This repository is configured to automatically deploy to GitHub Pages whenever changes are pushed to the `main` branch.

## What is GitHub Pages?

GitHub Pages (sometimes informally called "GitHub Spaces") is a free static site hosting service provided by GitHub. It allows you to host static websites directly from your GitHub repository.

## How It Works

1. **Automatic Deployment**: When you push to the `main` branch, a GitHub Actions workflow automatically:
   - Builds your Next.js application as a static site
   - Uploads the built files
   - Deploys them to GitHub Pages

2. **Manual Deployment**: You can also trigger a deployment manually from the Actions tab in GitHub.

## Setup Instructions

To enable GitHub Pages for this repository:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Build and deployment", select:
   - **Source**: GitHub Actions
4. The site will be available at: `https://spacecowboyian.github.io/something-s-happening/`

## Configuration Details

### Next.js Configuration

The `next.config.ts` file is configured for static export:
- `output: 'export'` - Enables static HTML export
- `basePath: '/something-s-happening'` - Sets the base path to match the repository name
- `images: { unoptimized: true }` - Disables Next.js image optimization (required for static export)

### GitHub Actions Workflow

The deployment workflow (`.github/workflows/deploy.yml`) includes:
- **Trigger**: Runs on push to `main` branch or manual workflow dispatch
- **Build job**: Installs dependencies, builds the Next.js app, and uploads the static files
- **Deploy job**: Deploys the built files to GitHub Pages

## Viewing Your Site

After the first successful deployment, your site will be live at:
- **Production URL**: `https://spacecowboyian.github.io/something-s-happening/`

## Local Testing

To test the production build locally:

```bash
# Build the site
npm run build

# The static files will be in the 'out' directory
# You can serve them with any static file server, e.g.:
npx serve out
```

## Troubleshooting

### Site Not Loading
- Make sure GitHub Pages is enabled in repository settings
- Check the Actions tab to see if the workflow ran successfully
- Verify the `basePath` in `next.config.ts` matches your repository name

### 404 Errors
- Ensure all internal links use the Next.js `Link` component (it handles the basePath automatically)
- For external resources, make sure they're properly referenced

### Build Failures
- Check the Actions tab for error logs
- Test the build locally with `npm run build`
- Ensure all dependencies are properly installed
