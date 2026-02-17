import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Something's Happening",
  description: "A Next.js React application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts loaded at runtime for static export compatibility */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        {/* GitHub Pages SPA redirect handler */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var redirect = sessionStorage.getItem('redirect');
                if (redirect) {
                  sessionStorage.removeItem('redirect');
                  history.replaceState(null, '', redirect);
                }
              })();
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
