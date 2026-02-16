'use client';

import { Button } from '@/components/Button';
import styles from './page.module.css';

export default function Home() {
  const handleDocsClick = () => {
    window.open('https://nextjs.org/docs', '_blank', 'noopener,noreferrer');
  };

  const handleAriaDocsClick = () => {
    window.open('https://react-spectrum.adobe.com/react-aria/', '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={styles.pageContainer}>
      <main className={styles.main}>
        <h1 className={styles.title}>
          Something&apos;s Happening
        </h1>
        <p className={styles.description}>
          Welcome to your Next.js React application. This project is ready for development with react-aria and a custom design system!
        </p>
        <div className={styles.buttonGroup}>
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
