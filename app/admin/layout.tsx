"use client&quot;;

import { usePathname } from &quot;next/navigation&quot;;
import Link from &quot;next/link&quot;;
import { cn } from &quot;@/lib/utils&quot;;
import {
  Users,
  BookOpen,
  Calendar,
  Settings,
  LayoutDashboard,
  CreditCard,
  Video
} from &quot;lucide-react&quot;;
import { ScrollArea } from &quot;@/components/ui/scroll-area&quot;;
import { Separator } from &quot;@/components/ui/separator&quot;;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  const routes = [
    {
      label: &quot;Dashboard&quot;,
      icon: LayoutDashboard,
      href: &quot;/admin&quot;,
      active: pathname === &quot;/admin&quot;,
    },
    {
      label: &quot;Users&quot;,
      icon: Users,
      href: &quot;/admin/users&quot;,
      active: pathname === &quot;/admin/users&quot; || pathname?.startsWith(&quot;/admin/users/&quot;),
    },
    {
      label: &quot;Live Classes&quot;,
      icon: BookOpen,
      href: &quot;/admin/live-classes&quot;,
      active: pathname === &quot;/admin/live-classes&quot; || pathname?.startsWith(&quot;/admin/live-classes/&quot;),
    },
    {
      label: &quot;Schedule&quot;,
      icon: Calendar,
      href: &quot;/admin/schedule&quot;,
      active: pathname === &quot;/admin/schedule&quot; || pathname?.startsWith(&quot;/admin/schedule/&quot;),
    },
    {
      label: &quot;Zoom Meetings&quot;,
      icon: Video,
      href: &quot;/admin/zoom-meetings&quot;,
      active: pathname === &quot;/admin/zoom-meetings&quot; || pathname?.startsWith(&quot;/admin/zoom-meetings/&quot;),
    },
    {
      label: &quot;Payments&quot;,
      icon: CreditCard,
      href: &quot;/admin/pages/purchases&quot;,
      active: pathname === &quot;/admin/pages/purchases&quot; || pathname?.startsWith(&quot;/admin/pages/purchases/&quot;),
    },
    {
      label: &quot;Settings&quot;,
      icon: Settings,
      href: &quot;/admin/settings&quot;,
      active: pathname === &quot;/admin/settings&quot; || pathname?.startsWith(&quot;/admin/settings/&quot;),
    },
  ];

  return (
    <div className=&quot;flex h-screen&quot;>
      {/* Sidebar */}
      <div className=&quot;w-64 border-r bg-background&quot;>
        <div className=&quot;p-6&quot;>
          <h1 className=&quot;text-2xl font-bold&quot;>Admin Panel</h1>
        </div>
        <Separator />
        <ScrollArea className=&quot;h-[calc(100vh-5rem)]&quot;>
          <nav className=&quot;space-y-1 p-3&quot;>
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  &quot;flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground&quot;,
                  route.active
                    ? &quot;bg-accent text-accent-foreground&quot;
                    : &quot;text-muted-foreground&quot;
                )}
              >
                <route.icon className=&quot;h-5 w-5&quot; />
                {route.label}
              </Link>
            ))}
          </nav>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className=&quot;flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
} 