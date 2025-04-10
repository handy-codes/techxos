"use client&quot;;

import { useUser } from &quot;@clerk/nextjs&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import { Skeleton } from &quot;@/components/ui/skeleton&quot;;
import Link from &quot;next/link&quot;;
import { usePathname } from &quot;next/navigation&quot;;

export default function Topbar() {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();

  if (!isLoaded) {
    return (
      <header className=&quot;border-b&quot;>
        <div className=&quot;container mx-auto px-4 h-16 flex items-center justify-between&quot;>
          <Skeleton className=&quot;h-8 w-32&quot; />
          <div className=&quot;flex gap-4&quot;>
            <Skeleton className=&quot;h-9 w-20&quot; />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className=&quot;border-b&quot;>
      <div className=&quot;container mx-auto px-4 h-16 flex items-center justify-between&quot;>
        <Link href=&quot;/" className="text-xl font-bold&quot;>
          TechXOS
        </Link>
        <nav className=&quot;flex items-center gap-4&quot;>
          {user ? (
            <>
              <Link href=&quot;/dashboard&quot;>
                <Button variant=&quot;ghost&quot;>Dashboard</Button>
              </Link>
              {user.publicMetadata.role === &quot;HEAD_ADMIN&quot; && (
                <Link href=&quot;/admin&quot;>
                  <Button variant=&quot;ghost&quot;>Admin</Button>
                </Link>
              )}
              <Link href=&quot;/profile&quot;>
                <Button variant=&quot;ghost&quot;>Profile</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href=&quot;/sign-in&quot;>
                <Button variant=&quot;ghost&quot;>Sign In</Button>
              </Link>
              <Link href=&quot;/sign-up">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
