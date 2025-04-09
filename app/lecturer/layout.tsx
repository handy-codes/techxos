"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { 
  Calendar, 
  BarChart3, 
  Users, 
  Video, 
  Settings, 
  Home,
  Clock
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

export default function LecturerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, isLoaded } = useUser();
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    if (!isLoaded) return;
    
    // Redirect if not logged in or not a lecturer
    if (!user) {
      redirect("/sign-in");
    }
    
    // Get the current hour to determine greeting
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, [user, isLoaded]);

  const routes = [
    {
      label: "Dashboard",
      icon: <Home className="h-4 w-4 mr-2" />,
      href: "/lecturer",
      active: pathname === "/lecturer",
    },
    {
      label: "My Classes",
      icon: <Video className="h-4 w-4 mr-2" />,
      href: "/lecturer/classes",
      active: pathname === "/lecturer/classes" || pathname.startsWith("/lecturer/classes/"),
    },
    {
      label: "Live Sessions",
      icon: <Clock className="h-4 w-4 mr-2" />,
      href: "/lecturer/zoom-meetings",
      active: pathname === "/lecturer/zoom-meetings" || pathname.startsWith("/lecturer/zoom-meetings/"),
    },
    {
      label: "Students",
      icon: <Users className="h-4 w-4 mr-2" />,
      href: "/lecturer/students",
      active: pathname === "/lecturer/students",
    },
    {
      label: "Schedule",
      icon: <Calendar className="h-4 w-4 mr-2" />,
      href: "/lecturer/schedule",
      active: pathname === "/lecturer/schedule",
    },
    {
      label: "Analytics",
      icon: <BarChart3 className="h-4 w-4 mr-2" />,
      href: "/lecturer/analytics",
      active: pathname === "/lecturer/analytics",
    },
    {
      label: "Settings",
      icon: <Settings className="h-4 w-4 mr-2" />,
      href: "/lecturer/settings",
      active: pathname === "/lecturer/settings",
    },
  ];

  if (!isLoaded) {
    return <div className="h-full flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="h-full flex">
      <div className="hidden md:flex h-full w-64 flex-col fixed inset-y-0 z-50 bg-white border-r">
        <div className="p-6">
          <h1 className="text-2xl font-bold">TechXOS</h1>
          <p className="text-sm text-muted-foreground">Lecturer Portal</p>
        </div>
        <ScrollArea className="flex-1 p-6">
          <div className="flex flex-col space-y-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm rounded-md hover:bg-slate-100",
                  route.active ? "bg-slate-100 text-black font-medium" : "text-muted-foreground"
                )}
              >
                {route.icon}
                {route.label}
              </Link>
            ))}
          </div>
        </ScrollArea>
        <div className="p-6 border-t">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
              {user?.imageUrl && (
                <img 
                  src={user.imageUrl} 
                  alt={user.firstName || "User"} 
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div>
              <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-muted-foreground">Lecturer</p>
            </div>
          </div>
        </div>
      </div>
      <main className="md:pl-64 w-full">
        <div className="p-6 h-full">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {greeting}, {user?.firstName || "Lecturer"}
            </h1>
          </div>
          {children}
        </div>
      </main>
    </div>
  );
} 