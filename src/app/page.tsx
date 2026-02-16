'use client';

import { Button } from '@/components/Button';

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col items-center gap-8 p-8 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
          Something&apos;s Happening
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
          Welcome to your Next.js React application. This project is ready for development with react-aria and a default dark theme!
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button onPress={() => window.open('https://nextjs.org/docs', '_blank')}>
            Read the Docs
          </Button>
          <Button onPress={() => window.open('https://react-spectrum.adobe.com/react-aria/', '_blank')}>
            React Aria Docs
          </Button>
        </div>
      </main>
    </div>
  );
}
