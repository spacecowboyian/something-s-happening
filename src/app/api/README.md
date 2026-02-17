# API Routes

**Note:** These API routes cannot be used with static export (GitHub Pages deployment).

When building for production (GitHub Pages), the API routes must be disabled. The event pages use mock data from `src/lib/mockEventData.ts` instead.

For local development with database support, these routes work fine in development mode where `output: 'export'` is not set.

## Deployment

For GitHub Pages deployment, the `/api` directory should be renamed to `/_api_disabled` or similar during the build process to prevent build failures.
