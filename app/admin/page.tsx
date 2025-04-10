"use client&quot;;

import { useEffect, useState } from &quot;react&quot;;
import { useUser } from &quot;@clerk/nextjs&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import { Card, CardContent, CardHeader, CardTitle } from &quot;@/components/ui/card&quot;;
import { Users, BookOpen, Calendar, DollarSign } from &quot;lucide-react&quot;;
import axios from &quot;axios&quot;;
import { toast } from &quot;react-hot-toast&quot;;
import { Skeleton } from &quot;@/components/ui/skeleton&quot;;
import { ScrollArea } from &quot;@/components/ui/scroll-area&quot;;

interface DashboardStats {
  totalUsers: number;
  totalClasses: number;
  totalSchedules: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalClasses: 0,
    totalSchedules: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(&quot;/api/admin/dashboard&quot;);
      console.log(&quot;Dashboard stats response:&quot;, response.data);
      setStats(response.data);
    } catch (error) {
      console.error(&quot;Dashboard error:&quot;, error);
      toast.error(&quot;Failed to fetch dashboard stats. Using default values.&quot;);
      // Keep the default values
      setStats({
        totalUsers: 0,
        totalClasses: 0,
        totalSchedules: 0,
        totalRevenue: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className=&quot;p-6 space-y-6&quot;>
        <div className=&quot;flex justify-between items-center&quot;>
          <Skeleton className=&quot;h-8 w-48&quot; />
          <Skeleton className=&quot;h-4 w-32&quot; />
        </div>
        <div className=&quot;grid gap-4 md:grid-cols-2 lg:grid-cols-4&quot;>
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className=&quot;flex flex-row items-center justify-between space-y-0 pb-2&quot;>
                <Skeleton className=&quot;h-4 w-24&quot; />
              </CardHeader>
              <CardContent>
                <Skeleton className=&quot;h-8 w-16&quot; />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className=&quot;h-full&quot;>
      <div className=&quot;p-6 space-y-6&quot;>
        <div className=&quot;flex justify-between items-center&quot;>
          <h1 className=&quot;text-2xl font-bold&quot;>Dashboard</h1>
          <div className=&quot;text-sm text-muted-foreground&quot;>
            Welcome back, {user?.firstName}
          </div>
        </div>

        <div className=&quot;grid gap-4 md:grid-cols-2 lg:grid-cols-4&quot;>
          <Card>
            <CardHeader className=&quot;flex flex-row items-center justify-between space-y-0 pb-2&quot;>
              <CardTitle className=&quot;text-sm font-medium&quot;>Total Users</CardTitle>
              <Users className=&quot;h-4 w-4 text-muted-foreground&quot; />
            </CardHeader>
            <CardContent>
              <div className=&quot;text-2xl font-bold&quot;>{stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className=&quot;flex flex-row items-center justify-between space-y-0 pb-2&quot;>
              <CardTitle className=&quot;text-sm font-medium&quot;>Live Classes</CardTitle>
              <BookOpen className=&quot;h-4 w-4 text-muted-foreground&quot; />
            </CardHeader>
            <CardContent>
              <div className=&quot;text-2xl font-bold&quot;>{stats.totalClasses}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className=&quot;flex flex-row items-center justify-between space-y-0 pb-2&quot;>
              <CardTitle className=&quot;text-sm font-medium&quot;>Schedules</CardTitle>
              <Calendar className=&quot;h-4 w-4 text-muted-foreground&quot; />
            </CardHeader>
            <CardContent>
              <div className=&quot;text-2xl font-bold&quot;>{stats.totalSchedules}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className=&quot;flex flex-row items-center justify-between space-y-0 pb-2&quot;>
              <CardTitle className=&quot;text-sm font-medium&quot;>Total Revenue</CardTitle>
              <DollarSign className=&quot;h-4 w-4 text-muted-foreground&quot; />
            </CardHeader>
            <CardContent>
              <div className=&quot;text-2xl font-bold&quot;>
                ₦{stats.totalRevenue.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className=&quot;space-y-4&quot;>
          <h2 className=&quot;text-xl font-semibold&quot;>Quick Actions</h2>
          <div className=&quot;grid gap-4 md:grid-cols-2 lg:grid-cols-3&quot;>
            <Button
              variant=&quot;outline&quot;
              className=&quot;h-24 flex flex-col items-center justify-center gap-2&quot;
              onClick={() => window.location.href = &quot;/admin/users/new&quot;}
            >
              <Users className=&quot;h-6 w-6&quot; />
              <span>Add New User</span>
            </Button>
            <Button
              variant=&quot;outline&quot;
              className=&quot;h-24 flex flex-col items-center justify-center gap-2&quot;
              onClick={() => window.location.href = &quot;/admin/live-classes/new&quot;}
            >
              <BookOpen className=&quot;h-6 w-6&quot; />
              <span>Create Live Class</span>
            </Button>
            <Button
              variant=&quot;outline&quot;
              className=&quot;h-24 flex flex-col items-center justify-center gap-2&quot;
              onClick={() => window.location.href = &quot;/admin/schedule/new&quot;}
            >
              <Calendar className=&quot;h-6 w-6" />
              <span>Add Schedule</span>
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
} 