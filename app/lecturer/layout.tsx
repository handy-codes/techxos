"use client&quot;;

import { useEffect, useState } from &quot;react&quot;;
import { usePathname } from &quot;next/navigation&quot;;
import { useUser } from &quot;@clerk/nextjs&quot;;
import Link from &quot;next/link&quot;;
import { 
  Calendar, 
  BarChart3, 
  Users, 
  Video, 
  Settings, 
  Home,
  Clock
} from &quot;lucide-react&quot;;
import { ScrollArea } from &quot;@/components/ui/scroll-area&quot;;
import { cn } from &quot;@/lib/utils&quot;;
import { redirect } from &quot;next/navigation&quot;;

export default function LecturerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const [greeting, setGreeting] = useState(&quot;");

  useEffect(() => {
    if (!isLoaded) return;
    
    // Redirect if not logged in or not a lecturer
    if (!user) {
      redirect(&quot;/sign-in&quot;);
    }
    
    // Get the current hour to determine greeting
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting(&quot;Good Morning&quot;);
    } else if (hour < 18) {
      setGreeting(&quot;Good Afternoon&quot;);
    } else {
      setGreeting(&quot;Good Evening&quot;);
    }
  }, [user, isLoaded]);

  const routes = [
    {
      label: &quot;Dashboard&quot;,
      icon: <Home className=&quot;h-4 w-4 mr-2&quot; />,
      href: &quot;/lecturer&quot;,
      active: pathname === &quot;/lecturer&quot;,
    },
    {
      label: &quot;My Classes&quot;,
      icon: <Video className=&quot;h-4 w-4 mr-2&quot; />,
      href: &quot;/lecturer/classes&quot;,
      active: pathname === &quot;/lecturer/classes&quot; || pathname.startsWith(&quot;/lecturer/classes/&quot;),
    },
    {
      label: &quot;Live Sessions&quot;,
      icon: <Clock className=&quot;h-4 w-4 mr-2&quot; />,
      href: &quot;/lecturer/zoom-meetings&quot;,
      active: pathname === &quot;/lecturer/zoom-meetings&quot; || pathname.startsWith(&quot;/lecturer/zoom-meetings/&quot;),
    },
    {
      label: &quot;Students&quot;,
      icon: <Users className=&quot;h-4 w-4 mr-2&quot; />,
      href: &quot;/lecturer/students&quot;,
      active: pathname === &quot;/lecturer/students&quot;,
    },
    {
      label: &quot;Schedule&quot;,
      icon: <Calendar className=&quot;h-4 w-4 mr-2&quot; />,
      href: &quot;/lecturer/schedule&quot;,
      active: pathname === &quot;/lecturer/schedule&quot;,
    },
    {
      label: &quot;Analytics&quot;,
      icon: <BarChart3 className=&quot;h-4 w-4 mr-2&quot; />,
      href: &quot;/lecturer/analytics&quot;,
      active: pathname === &quot;/lecturer/analytics&quot;,
    },
    {
      label: &quot;Settings&quot;,
      icon: <Settings className=&quot;h-4 w-4 mr-2&quot; />,
      href: &quot;/lecturer/settings&quot;,
      active: pathname === &quot;/lecturer/settings&quot;,
    },
  ];

  if (!isLoaded) {
    return <div className="h-full flex items-center justify-center&quot;>Loading...</div>;
  }

  return (
    <div className=&quot;h-full flex&quot;>
      <div className=&quot;hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-50 bg-white border-r&quot;>
        <div className=&quot;p-6&quot;>
          <h1 className=&quot;text-2xl font-bold&quot;>TechXOS</h1>
          <p className=&quot;text-sm text-muted-foreground&quot;>Lecturer Portal</p>
        </div>
        <ScrollArea className=&quot;flex-1 p-6&quot;>
          <div className=&quot;flex flex-col space-y-2&quot;>
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  &quot;flex items-center px-3 py-2 text-sm rounded-md hover:bg-slate-100&quot;,
                  route.active ? &quot;bg-slate-100 text-black font-medium&quot; : &quot;text-muted-foreground&quot;
                )}
              >
                {route.icon}
                {route.label}
              </Link>
            ))}
          </div>
        </ScrollArea>
        <div className=&quot;p-6 border-t&quot;>
          <div className=&quot;flex items-center gap-2&quot;>
            <div className=&quot;w-8 h-8 rounded-full bg-slate-200 overflow-hidden&quot;>
              {user?.imageUrl && (
                <img 
                  src={user.imageUrl} 
                  alt={user.firstName || &quot;User&quot;} 
                  className=&quot;w-full h-full object-cover&quot;
                />
              )}
            </div>
            <div>
              <p className=&quot;text-sm font-medium&quot;>{user?.firstName} {user?.lastName}</p>
              <p className=&quot;text-xs text-muted-foreground&quot;>Lecturer</p>
            </div>
          </div>
        </div>
      </div>
      <main className=&quot;md:pl-64 w-full&quot;>
        <div className=&quot;p-6 h-full&quot;>
          <div className=&quot;flex justify-between items-center mb-6&quot;>
            <h1 className=&quot;text-2xl font-bold&quot;>
              {greeting}, {user?.firstName || &quot;Lecturer"}
            </h1>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
} 