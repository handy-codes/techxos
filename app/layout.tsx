import type { Metadata } from &quot;next&quot;;
import { Inter } from &quot;next/font/google&quot;;
import { ClerkProvider } from &quot;@clerk/nextjs&quot;;
import &quot;./globals.css&quot;;
import { Toaster } from &quot;react-hot-toast&quot;;
import Topbar from &quot;@/components/layout/Topbar&quot;;
import FooterPage from &quot;@/components/layout/Footer&quot;;

const inter = Inter({
  subsets: [&apos;latin&apos;],
  variable: &apos;--font-inter&apos;,
  display: &apos;swap&apos;, // Prevents layout shifts
});

<meta name=&quot;viewport&quot; content=&quot;width=device-width, initial-scale=1&quot; />

export const metadata: Metadata = {
  title: &quot;TechXOS&quot;,
  description: &quot;TechXOS - Your Learning Platform&quot;,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang=&quot;en&quot; className={`${inter.variable}`}>
      <body className={inter.className}>
        <ClerkProvider>
          <div className="min-h-screen flex flex-col&quot;>
            <Topbar />
            <main className=&quot;flex-grow mt-[120px]">
              {children}
            </main>
            <FooterPage />
          </div>
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}