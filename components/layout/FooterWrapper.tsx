"use client";

import { usePathname } from "next/navigation";
import FooterPage from "./Footer";

export default function FooterWrapper() {
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');

  if (isAdminPage) {
    return null;
  }

  return <FooterPage />;
} 