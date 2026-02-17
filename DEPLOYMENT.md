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
- `output: 'export'` - Enables static HTML export (production only)
- `basePath: '/something-s-happening'` - Sets the base path to match the repository name (can be overridden with `NEXT_PUBLIC_BASE_PATH` env variable)
- `trailingSlash: true` - Generates URLs with trailing slashes for proper GitHub Pages routing (e.g., `/event/123/index.html` instead of `/event/123.html`)
- `images: { unoptimized: true }` - Disables Next.js image optimization (required for static export)

**Custom Base Path**: If you fork this repository or rename it, you can override the base path by setting the `NEXT_PUBLIC_BASE_PATH` environment variable (e.g., `NEXT_PUBLIC_BASE_PATH=/my-repo-name`).

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

The site is configured to handle direct navigation to routes using two mechanisms:

1. **Trailing Slash URLs**: The `trailingSlash: true` setting in `next.config.ts` ensures that routes like `/event/test-event-123` automatically redirect to `/event/test-event-123/` which serves the `index.html` file.

2. **Custom 404 Fallback**: For routes that don't exist or edge cases where the trailing slash redirect doesn't work, a custom `404.html` page redirects users back to the app with the intended path stored in sessionStorage, allowing client-side routing to take over.

If you still experience 404 errors:
- Ensure all internal links use the Next.js `Link` component (it handles the basePath automatically)
- Verify that the `.nojekyll` file exists in the output (prevents GitHub Pages from ignoring `_next` directories)
- Check that the build output includes a `404.html` file with the redirect script

### Build Failures
- Check the Actions tab for error logs
- Test the build locally with `npm run build`
- Ensure all dependencies are properly installed

## Understanding Dynamic Routes on GitHub Pages

### Why Dynamic Routes Work with Static Generation

GitHub Pages serves static files, but that doesn't mean you can't have "dynamic" routes! Here's how it works:

**Static Generation with `generateStaticParams()`**: Next.js pre-generates static HTML files for all dynamic routes at build time. For example:
- `/event/[id]/page.tsx` → generates `/event/test-event-123/index.html` and `/event/sample-event/index.html`
- Each route becomes a static HTML file that GitHub Pages can serve

**Client-Side React Still Works**: Once the static HTML loads, React hydrates the page and takes over navigation:
- Clicking links uses client-side routing (no page reload)
- The JavaScript bundle includes all React components and logic
- GitHub Pages serves the static HTML, then React provides the interactivity

### The Difference Between Dynamic Routes and API Routes

**Dynamic Routes** ✅ Work on GitHub Pages:
- Pre-generated at build time using `generateStaticParams()`
- Result in static HTML files
- Example: `/event/[id]/page.tsx` → `/event/test-event-123/index.html`

**API Routes** ❌ Don't work on GitHub Pages:
- Require a Node.js server to run
- Execute code on each request
- Example: `/api/events/[slug]/route.ts` - requires server-side execution
- Must be disabled for static export (the CI workflow handles this automatically)

### Alternative Hosting Options

If you need server-side features (API routes, server components, dynamic data), consider these alternatives:

1. **Vercel** (Recommended for Next.js):
   - Native Next.js support with all features
   - Free tier available
   - Automatic deployments from GitHub
   - Deploy: `npx vercel` or connect your GitHub repo

2. **Netlify**:
   - Good Next.js support
   - Free tier available
   - Automatic deployments from GitHub
   - Supports serverless functions

3. **Cloudflare Pages**:
   - Free tier with generous limits
   - Edge network for fast global delivery
   - Supports Next.js with some limitations

4. **GitHub Pages** (Current):
   - ✅ Free and simple
   - ✅ Perfect for static sites with client-side React
   - ✅ Works great with `generateStaticParams()` for dynamic routes
   - ❌ No server-side rendering or API routes
   - ❌ No dynamic data fetching at request time

### Why We Use GitHub Pages

For this application, GitHub Pages is a great fit because:
- All events are pre-generated at build time
- No server-side data fetching needed during runtime
- Client-side React provides all the interactivity
- Completely free hosting
- Simple CI/CD with GitHub Actions

If you need to add features that require server-side processing (e.g., user authentication, real-time data updates), consider migrating to Vercel or Netlify.
