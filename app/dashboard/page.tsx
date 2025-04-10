'use client&apos;;

import { useUser, useClerk } from &quot;@clerk/nextjs&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import { Skeleton } from &quot;@/components/ui/skeleton&quot;;
import { useEffect } from &quot;react&quot;;
import { useRouter } from &quot;next/navigation&quot;;
import { Card, CardContent, CardHeader, CardTitle } from &quot;@/components/ui/card&quot;;
import { ScrollArea } from &quot;@/components/ui/scroll-area&quot;;
import { LogOut } from &quot;lucide-react&quot;;

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !user) {
      router.push(&apos;/');
    }
  }, [isLoaded, user, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push(&apos;/&apos;);
  };

  if (!isLoaded) {
    return (
      <div className="container mx-auto px-4 py-8&quot;>
        <div className=&quot;space-y-8&quot;>
          <div className=&quot;space-y-4&quot;>
            <Skeleton className=&quot;h-8 w-48&quot; />
            <Skeleton className=&quot;h-4 w-96&quot; />
          </div>
          <div className=&quot;grid gap-6 md:grid-cols-2 lg:grid-cols-3&quot;>
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className=&quot;h-6 w-32&quot; />
                </CardHeader>
                <CardContent>
                  <Skeleton className=&quot;h-8 w-full&quot; />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <ScrollArea className=&quot;h-full&quot;>
      <div className=&quot;container mx-auto px-4 py-8&quot;>
        <div className=&quot;space-y-8&quot;>
          <div className=&quot;flex justify-between items-center&quot;>
            <div className=&quot;space-y-4&quot;>
              <h1 className=&quot;text-3xl font-bold&quot;>Welcome back, {user.firstName}!</h1>
              <p className=&quot;text-muted-foreground&quot;>
                Here&apos;s an overview of your learning journey
              </p>
            </div>
            <Button 
              variant=&quot;outline&quot; 
              onClick={handleSignOut}
              className=&quot;flex items-center gap-2&quot;
            >
              <LogOut className=&quot;w-4 h-4&quot; />
              Sign Out
            </Button>
          </div>

          <div className=&quot;grid gap-6 md:grid-cols-2 lg:grid-cols-3&quot;>
            <Card>
              <CardHeader>
                <CardTitle>Enrolled Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className=&quot;text-3xl font-bold&quot;>0</p>
                <p className=&quot;text-sm text-muted-foreground&quot;>
                  You haven&apos;t enrolled in any classes yet
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <p className=&quot;text-3xl font-bold&quot;>0</p>
                <p className=&quot;text-sm text-muted-foreground&quot;>
                  No upcoming sessions scheduled
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Completed Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className=&quot;text-3xl font-bold&quot;>0</p>
                <p className=&quot;text-sm text-muted-foreground&quot;>
                  Start your learning journey today
                </p>
              </CardContent>
            </Card>
          </div>

          <div className=&quot;grid gap-6 md:grid-cols-2&quot;>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className=&quot;text-muted-foreground&quot;>No recent activity</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Classes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className=&quot;text-muted-foreground">No recommendations yet</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
} 