"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Users,
  BookOpen,
  Calendar,
  Settings,
  LayoutDashboard,
  CreditCard,
  Video,
  ClipboardList
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import AdminCheck from "@/components/admin/AdminCheck";
import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const [userName, setUserName] = useState<string>("Admin");
  
  useEffect(() => {
    if (isLoaded && user) {
      setUserName(user.firstName || "Admin");
    }
  }, [isLoaded, user]);
  
  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/admin",
      active: pathname === "/admin",
    },
    {
      label: "Users",
      icon: Users,
      href: "/admin/users",
      active: pathname === "/admin/users" || pathname?.startsWith("/admin/users/"),
    },
    {
      label: "Live Classes",
      icon: BookOpen,
      href: "/admin/live-classes",
      active: pathname === "/admin/live-classes" || pathname?.startsWith("/admin/live-classes/"),
    },
    {
      label: "Schedule",
      icon: Calendar,
      href: "/admin/schedule",
      active: pathname === "/admin/schedule" || pathname?.startsWith("/admin/schedule/"),
    },
    {
      label: "Zoom Meetings",
      icon: Video,
      href: "/admin/zoom-meetings",
      active: pathname === "/admin/zoom-meetings" || pathname?.startsWith("/admin/zoom-meetings/"),
    },
    {
      label: "Setup Zoom",
      icon: Video,
      href: "/admin/pages/setup-zoom",
      active: pathname === "/admin/pages/setup-zoom" || pathname?.startsWith("/admin/pages/setup-zoom/"),
    },
    {
      label: "Payments",
      icon: CreditCard,
      href: "/admin/pages/purchases",
      active: pathname === "/admin/pages/purchases" || pathname?.startsWith("/admin/pages/purchases/"),
    },
    {
      label: "Maths Demo",
      icon: ClipboardList,
      href: "/admin/maths-demo",
      active: pathname === "/admin/maths-demo" || pathname?.startsWith("/admin/maths-demo/"),
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/admin/settings",
      active: pathname === "/admin/settings" || pathname?.startsWith("/admin/settings/"),
    },
  ];

  return (
    <AdminCheck>
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-64 border-r-2 border-gray-300 bg-background fixed h-full">
          <div className="p-6">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>
          <Separator />
          <ScrollArea className="h-[calc(100vh-5rem)]">
            <nav className="space-y-1 p-3">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground w-fit",
                    route.active
                      ? "bg-[#FFA500] text-white font-bold"
                      : "text-black"
                  )}
                >
                  <route.icon className="h-5 w-5" />
                  {route.label}
                </Link>
              ))}
            </nav>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto ml-64">
          {/* Welcome Message */}
          <div className="bg-white border-b p-4 flex justify-end">
            <div className="text-right">
              <p className="font-medium text-black">
                Welcome back, <span className="font-bold">{userName}</span>
              </p>
            </div>
          </div>
          {children}
        </div>
      </div>
    </AdminCheck>
  );
} 