import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import SessionWrapper from '@/components/layout/SessionWrapper';
import "./globals.css";
import ToasterProvider from "@/components/providers/ToasterProvider";
import FooterPage from "@/components/layout/Footer";
import Topbar from "@/components/layout/Topbar";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap', // Prevents layout shifts
});

<meta name="viewport" content="width=device-width, initial-scale=1" />

export const metadata: Metadata = {
  title: "Techxos",
  description: "Empowering minds & shaping the future",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <SessionWrapper>
        <html lang="en" className={`${inter.variable}`}>
          <body className={inter.className}>
            <ToasterProvider />
            <Topbar />
            {children}
            <FooterPage />
            {/* <FooterPage className="custom-footer" /> */}
          </body>
        </html>
      </SessionWrapper>
    </ClerkProvider>
  );
}