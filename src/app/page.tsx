export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <main className="flex flex-col items-center gap-8 p-8 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
          Something&apos;s Happening
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
          Welcome to your Next.js React application. This project is ready for development!
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <a
            href="https://nextjs.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Read the Docs
          </a>
          <a
            href="https://github.com/vercel/next.js"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
          >
            View on GitHub
          </a>
        </div>
      </main>
    </div>
  );
}
