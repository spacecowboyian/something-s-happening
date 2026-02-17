#!/bin/bash

# GitHub Pages Diagnostic Script
# This script checks if GitHub Pages is properly configured for this repository

set -e

REPO_OWNER="spacecowboyian"
REPO_NAME="something-s-happening"
PAGES_URL="https://${REPO_OWNER}.github.io/${REPO_NAME}"

echo "========================================"
echo "GitHub Pages Diagnostic Tool"
echo "========================================"
echo ""

# Check if gh-pages branch exists
echo "1. Checking gh-pages branch..."
if git show-ref --verify --quiet refs/heads/gh-pages || git show-ref --verify --quiet refs/remotes/origin/gh-pages; then
    echo "   ✅ gh-pages branch exists"
    
    # Determine the correct reference
    if git show-ref --verify --quiet refs/heads/gh-pages; then
        GH_PAGES_REF="gh-pages"
    else
        GH_PAGES_REF="origin/gh-pages"
    fi
    
    # Check for pr-18 directory
    if git ls-tree -r --name-only "$GH_PAGES_REF" 2>/dev/null | grep -q "^pr-18/"; then
        echo "   ✅ pr-18 directory exists in gh-pages branch"
        
        # Count files in pr-18
        FILE_COUNT=$(git ls-tree -r --name-only "$GH_PAGES_REF" | grep "^pr-18/" | wc -l)
        echo "   ℹ️  pr-18 contains $FILE_COUNT files"
    else
        echo "   ❌ pr-18 directory NOT found in gh-pages branch"
        echo "      The PR may have been closed or the deployment failed"
        exit 1
    fi
else
    echo "   ❌ gh-pages branch does NOT exist"
    echo "      Deployments have not been run yet"
    exit 1
fi

echo ""
echo "2. Testing if GitHub Pages is serving the site..."

# Try to access the main site
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${PAGES_URL}/" --max-time 10 || echo "000")

if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Main site is accessible at: $PAGES_URL/"
    echo "   ✅ GitHub Pages IS CONFIGURED!"
    echo ""
    echo "   Testing PR-18..."
    PR_HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "${PAGES_URL}/pr-18/" --max-time 10 || echo "000")
    
    if [ "$PR_HTTP_CODE" = "200" ]; then
        echo "   ✅ PR-18 is accessible at: ${PAGES_URL}/pr-18/"
        echo ""
        echo "========================================"
        echo "SUCCESS! Everything is working correctly!"
        echo "========================================"
    elif [ "$PR_HTTP_CODE" = "404" ]; then
        echo "   ⚠️  PR-18 returns 404 but main site works"
        echo "      This might be a cache issue. Wait a few minutes and try again."
        echo "      URL: ${PAGES_URL}/pr-18/"
    else
        echo "   ❌ PR-18 returned HTTP $PR_HTTP_CODE"
        echo "      URL: ${PAGES_URL}/pr-18/"
    fi
elif [ "$HTTP_CODE" = "404" ]; then
    echo "   ❌ Main site returns 404"
    echo "   ❌ GitHub Pages is NOT CONFIGURED!"
    echo ""
    echo "========================================"
    echo "PROBLEM IDENTIFIED"
    echo "========================================"
    echo ""
    echo "The files are deployed to gh-pages branch,"
    echo "but GitHub Pages is not configured to serve them."
    echo ""
    echo "🔧 TO FIX:"
    echo ""
    echo "1. Go to: https://github.com/${REPO_OWNER}/${REPO_NAME}/settings/pages"
    echo ""
    echo "2. Under 'Build and deployment':"
    echo "   - Source: Deploy from a branch"
    echo "   - Branch: gh-pages"
    echo "   - Directory: / (root)"
    echo ""
    echo "3. Click 'Save'"
    echo ""
    echo "4. Wait 2-5 minutes for GitHub to publish"
    echo ""
    echo "5. Check: $PAGES_URL/"
    echo ""
    echo "⚠️  NOTE: If the repository is PRIVATE, you need"
    echo "    a GitHub Pro/Team/Enterprise plan for Pages."
    echo ""
    exit 1
elif [ "$HTTP_CODE" = "000" ]; then
    echo "   ⚠️  Unable to connect (may be network issue)"
    echo "      This diagnostic script needs internet access"
elif [ "$HTTP_CODE" = "403" ]; then
    echo "   ❌ Access forbidden (HTTP 403)"
    echo "   ⚠️  The repository might be PRIVATE"
    echo ""
    echo "GitHub Pages for private repositories requires:"
    echo "- GitHub Pro, Team, or Enterprise plan"
    echo ""
    echo "Alternatives:"
    echo "1. Make the repository public"
    echo "2. Upgrade to a paid GitHub plan"
    echo "3. Use Vercel or Netlify instead (they support private repos)"
else
    echo "   ❌ Unexpected HTTP code: $HTTP_CODE"
    echo "      URL: $PAGES_URL/"
fi

echo ""
echo "========================================"
echo "Diagnostic complete"
echo "========================================"
echo ""
echo "For more help, see: docs/PR_DEPLOYMENT_404_FIX.md"
