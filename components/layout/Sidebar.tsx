"use client&quot;;

import { BarChart4, MonitorPlay } from &quot;lucide-react&quot;;
import Link from &quot;next/link&quot;;
import { usePathname } from &quot;next/navigation&quot;;

interface SidebarRoute {
  icon: JSX.Element;
  label: string;
  path: string;
}

const Sidebar = () => {
  const pathname = usePathname();

  const sidebarRoutes: SidebarRoute[] = [
    { icon: <MonitorPlay />, label: &quot;Courses&quot;, path: &quot;/instructor/courses&quot; },
    {
      icon: <BarChart4 />,
      label: &quot;Performance&quot;,
      path: &quot;/instructor/performance&quot;,
    },
  ];

  return (
    <div className=&quot;max-sm:hidden flex flex-col w-64 border-r shadow-md px-3 my-4 gap-4 text-sm font-medium&quot;>
      {sidebarRoutes.map((route: SidebarRoute) => (
        <Link
          href={route.path}
          key={route.path}
          className={`flex items-center gap-4 p-3 rounded-lg hover:bg-[#FFF8EB]
          ${pathname?.startsWith(route.path) && &quot;bg-[#FDAB04] hover:bg-[#FDAB04]/80"}
          `}
        >
          {route.icon} {route.label}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
