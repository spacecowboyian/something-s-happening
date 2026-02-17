#!/usr/bin/env node
/**
 * Post-build script to copy custom 404.html for GitHub Pages SPA routing
 * 
 * This script runs after 'next build' and copies a custom 404.html that handles
 * client-side routing redirects for GitHub Pages.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const custom404Path = path.join(__dirname, '..', 'public', '404.html');
const outputPath = path.join(__dirname, '..', 'out', '404.html');

try {
  if (fs.existsSync(custom404Path)) {
    fs.copyFileSync(custom404Path, outputPath);
    console.log('✓ Copied custom 404.html for GitHub Pages routing');
  } else {
    console.log('ℹ No custom 404.html found, using default');
  }
} catch (error) {
  console.error('Error copying 404.html:', error);
  process.exit(1);
}
