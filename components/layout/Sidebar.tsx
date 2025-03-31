"use client";

import { BarChart4, MonitorPlay } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import type { UserResource } from '@/types/user';

const Sidebar = () => {
  const pathname = usePathname();
  const { user } = useUser() as { user: UserResource | null };

  const sidebarRoutes = [
    { icon: <MonitorPlay />, label: "Courses", path: "/instructor/courses" },
    {
      icon: <BarChart4 />,
      label: "Performance",
      path: "/instructor/performance",
    },
  ];

  return (
    <div className="max-sm:hidden flex flex-col w-64 border-r shadow-md px-3 my-4 gap-4 text-sm font-medium">
      {sidebarRoutes.map((route) => (
        <Link
          href={route.path}
          key={route.path}
          className={`flex items-center gap-4 p-3 rounded-lg hover:bg-[#FFF8EB]
          ${pathname?.startsWith(route.path) && "bg-[#FDAB04] hover:bg-[#FDAB04]/80"}
          `}
        >
          {route.icon} {route.label}
        </Link>
      ))}
      {(user?.role === 'ADMIN' || user?.role === 'LECTURER') && (
        <Link 
          href="/classes/create" 
          className="block py-2 px-4 hover:bg-gray-100 rounded"
        >
          Create Class
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
