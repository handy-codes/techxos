import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Topbar from "@/components/layout/Topbar";
import FooterWrapper from "@/components/layout/FooterWrapper";
// import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap", // Prevents layout shifts
});

<meta name="viewport" content="width=device-width, initial-scale=1" />

export const metadata: Metadata = {
  title: "TechXOS",
  description: "TechXOS - Your Learning Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className={inter.className}>
        <ClerkProvider>
          <div className="min-h-screen flex flex-col">
            <Topbar />
            <main className="flex-grow mt-[80px] xl:mt-[120px]">
              {children}
            </main>
            <FooterWrapper />
            {/* <Footer /> */}
          </div>
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}