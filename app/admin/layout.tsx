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
  Video
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import AdminCheck from "@/components/admin/AdminCheck";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
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
      label: "Payments",
      icon: CreditCard,
      href: "/admin/pages/purchases",
      active: pathname === "/admin/pages/purchases" || pathname?.startsWith("/admin/pages/purchases/"),
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
        <div className="w-64 border-r bg-background">
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
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    route.active
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
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
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </AdminCheck>
  );
} 