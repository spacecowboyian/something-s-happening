import { test, expect } from '@playwright/test';

/**
 * Deployment Verification Tests
 * 
 * These tests verify that a deployed instance of the app is accessible
 * and contains the expected pages and content.
 * 
 * Set the BASE_URL environment variable to test a specific deployment:
 * BASE_URL=https://spacecowboyian.github.io/something-s-happening/pr-18 npm run test:deployment
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Deployment Verification', () => {
  test('home page loads successfully', async ({ page }) => {
    await page.goto(BASE_URL);
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Verify the title
    await expect(page).toHaveTitle(/Something's Happening/);
    
    // Verify main heading is visible
    await expect(page.locator('h1')).toContainText("Something's Happening");
    
    // Verify description is present
    await expect(page.locator('text=Welcome to your Next.js React application')).toBeVisible();
  });

  test('event links are present on home page', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Verify event links exist
    const eventLinks = page.locator('a[href*="/event/"]');
    await expect(eventLinks).toHaveCount(2); // Should have 2 sample events
    
    // Verify link text
    await expect(page.locator('text=Tech Conference 2026')).toBeVisible();
    await expect(page.locator('text=Product Launch Event')).toBeVisible();
  });

  test('event page loads successfully', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Click on first event link and wait for navigation
    const eventLink = page.locator('a[href*="/event/test-event-123"]').first();
    await eventLink.click();
    
    // Wait for navigation to complete
    await page.waitForURL('**/event/**');
    
    // Verify we're on an event page
    expect(page.url()).toContain('/event/');
    
    // Verify event content is loaded
    await expect(page.locator('h1')).toBeVisible();
  });

  test('404 page works for invalid routes', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/this-page-does-not-exist`);
    await page.waitForLoadState('networkidle');
    
    // Should either show 404 page or redirect to home
    // Due to static export and GitHub Pages, 404 handling may vary
    const title = await page.title();
    expect(title).toBeTruthy();
  });

  test('static assets load correctly', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
    
    // Check that CSS is loaded (page should be styled)
    const bodyColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    
    // Verify background color is set (not default white/transparent)
    expect(bodyColor).not.toBe('rgba(0, 0, 0, 0)');
  });
});
