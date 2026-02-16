/**
 * Alternative Page Component WITHOUT Tailwind
 * 
 * This demonstrates what the home page would look like
 * if we replaced Tailwind with plain CSS.
 * 
 * Compare this to: src/app/page.tsx
 */

'use client';

import { ButtonNoTailwind as Button } from './Button-no-tailwind';
import './page-no-tailwind.css';

export default function PageNoTailwind() {
  const handleDocsClick = () => {
    window.open('https://nextjs.org/docs', '_blank', 'noopener,noreferrer');
  };

  const handleAriaDocsClick = () => {
    window.open('https://react-spectrum.adobe.com/react-aria/', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="page-container">
      <main className="main-content">
        <h1 className="page-title">
          Something&apos;s Happening
        </h1>
        <p className="page-description">
          Welcome to your Next.js React application. This project is ready for development with react-aria and a default dark theme!
        </p>
        <div className="button-group">
          <Button onPress={handleDocsClick} aria-label="Read the Next.js documentation (opens in new tab)">
            Read the Docs
          </Button>
          <Button onPress={handleAriaDocsClick} aria-label="Read the React Aria documentation (opens in new tab)">
            React Aria Docs
          </Button>
        </div>
      </main>
    </div>
  );
}

/**
 * Comparison:
 * 
 * WITH Tailwind (current):
 * - ~20 utility classes inline
 * - 0 separate CSS file
 * - Dark mode: dark:from-gray-900 dark:to-gray-800
 * - Responsive: sm:flex-row
 * 
 * WITHOUT Tailwind (this example):
 * - 5 semantic class names
 * - ~100 lines in separate CSS file
 * - Dark mode: Manual .dark selectors
 * - Responsive: Manual media queries
 */
