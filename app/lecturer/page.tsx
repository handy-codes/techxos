"use client&quot;;

import { useEffect, useState } from &quot;react&quot;;
import { useUser } from &quot;@clerk/nextjs&quot;;
import axios from &quot;axios&quot;;
import { toast } from &quot;react-hot-toast&quot;;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from &quot;@/components/ui/card&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import { Skeleton } from &quot;@/components/ui/skeleton&quot;;
import { 
  BarChart,
  Clock,
  Users,
  Calendar,
  Video,
  DollarSign
} from &quot;lucide-react&quot;;
import Link from &quot;next/link&quot;;

interface DashboardStats {
  totalStudents: number;
  totalHours: number;
  totalClasses: number;
  totalEarnings: number;
  upcomingMeetings: number;
  completedMeetings: number;
}

export default function LecturerDashboard() {
  const { user } = useUser();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalHours: 0,
    totalClasses: 0,
    totalEarnings: 0,
    upcomingMeetings: 0,
    completedMeetings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await axios.get(&quot;/api/lecturer/dashboard&quot;);
      setStats(response.data);
    } catch (error) {
      console.error(&quot;Dashboard stats error:&quot;, error);
      toast.error(&quot;Could not load dashboard statistics&quot;);
      // Keep default values
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className=&quot;space-y-6&quot;>
        <div className=&quot;grid gap-4 md:grid-cols-2 lg:grid-cols-3&quot;>
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className=&quot;flex flex-row items-center justify-between space-y-0 pb-2&quot;>
                <Skeleton className=&quot;h-4 w-24&quot; />
                <Skeleton className=&quot;h-4 w-4&quot; />
              </CardHeader>
              <CardContent>
                <Skeleton className=&quot;h-8 w-16&quot; />
                <Skeleton className=&quot;h-4 w-28 mt-2&quot; />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className=&quot;space-y-6&quot;>
      {/* Stats Cards */}
      <div className=&quot;grid gap-4 md:grid-cols-2 lg:grid-cols-3&quot;>
        <Card>
          <CardHeader className=&quot;flex flex-row items-center justify-between space-y-0 pb-2&quot;>
            <CardTitle className=&quot;text-sm font-medium&quot;>Total Students</CardTitle>
            <Users className=&quot;h-4 w-4 text-muted-foreground&quot; />
          </CardHeader>
          <CardContent>
            <div className=&quot;text-2xl font-bold&quot;>{stats.totalStudents}</div>
            <p className=&quot;text-xs text-muted-foreground&quot;>
              Enrolled in your courses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className=&quot;flex flex-row items-center justify-between space-y-0 pb-2&quot;>
            <CardTitle className=&quot;text-sm font-medium&quot;>Teaching Hours</CardTitle>
            <Clock className=&quot;h-4 w-4 text-muted-foreground&quot; />
          </CardHeader>
          <CardContent>
            <div className=&quot;text-2xl font-bold&quot;>{stats.totalHours}</div>
            <p className=&quot;text-xs text-muted-foreground&quot;>
              Total hours YTD
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className=&quot;flex flex-row items-center justify-between space-y-0 pb-2&quot;>
            <CardTitle className=&quot;text-sm font-medium&quot;>Active Classes</CardTitle>
            <Video className=&quot;h-4 w-4 text-muted-foreground&quot; />
          </CardHeader>
          <CardContent>
            <div className=&quot;text-2xl font-bold&quot;>{stats.totalClasses}</div>
            <p className=&quot;text-xs text-muted-foreground&quot;>
              Currently active courses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className=&quot;flex flex-row items-center justify-between space-y-0 pb-2&quot;>
            <CardTitle className=&quot;text-sm font-medium&quot;>Total Earnings</CardTitle>
            <DollarSign className=&quot;h-4 w-4 text-muted-foreground&quot; />
          </CardHeader>
          <CardContent>
            <div className=&quot;text-2xl font-bold&quot;>₦{stats.totalEarnings.toLocaleString()}</div>
            <p className=&quot;text-xs text-muted-foreground&quot;>
              Revenue from your courses (YTD)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className=&quot;flex flex-row items-center justify-between space-y-0 pb-2&quot;>
            <CardTitle className=&quot;text-sm font-medium&quot;>Upcoming Meetings</CardTitle>
            <Calendar className=&quot;h-4 w-4 text-muted-foreground&quot; />
          </CardHeader>
          <CardContent>
            <div className=&quot;text-2xl font-bold&quot;>{stats.upcomingMeetings}</div>
            <p className=&quot;text-xs text-muted-foreground&quot;>
              Scheduled in the next 7 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className=&quot;flex flex-row items-center justify-between space-y-0 pb-2&quot;>
            <CardTitle className=&quot;text-sm font-medium&quot;>Completed Meetings</CardTitle>
            <BarChart className=&quot;h-4 w-4 text-muted-foreground&quot; />
          </CardHeader>
          <CardContent>
            <div className=&quot;text-2xl font-bold&quot;>{stats.completedMeetings}</div>
            <p className=&quot;text-xs text-muted-foreground&quot;>
              Successfully hosted sessions
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <div className=&quot;space-y-4&quot;>
        <h2 className=&quot;text-xl font-semibold&quot;>Quick Actions</h2>
        <div className=&quot;grid gap-4 md:grid-cols-2 lg:grid-cols-3&quot;>
          <Link href=&quot;/lecturer/zoom-meetings/new&quot;>
            <Button
              variant=&quot;outline&quot;
              className=&quot;h-24 w-full flex flex-col items-center justify-center gap-2&quot;
            >
              <Video className=&quot;h-6 w-6&quot; />
              <span>Schedule New Meeting</span>
            </Button>
          </Link>
          
          <Link href=&quot;/lecturer/classes&quot;>
            <Button
              variant=&quot;outline&quot;
              className=&quot;h-24 w-full flex flex-col items-center justify-center gap-2&quot;
            >
              <Users className=&quot;h-6 w-6&quot; />
              <span>View My Classes</span>
            </Button>
          </Link>
          
          <Link href=&quot;/lecturer/analytics&quot;>
            <Button
              variant=&quot;outline&quot;
              className=&quot;h-24 w-full flex flex-col items-center justify-center gap-2&quot;
            >
              <BarChart className=&quot;h-6 w-6&quot; />
              <span>View Analytics</span>
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Chart Placeholder - Would integrate a real chart in a production app */}
      <Card className=&quot;col-span-3&quot;>
        <CardHeader>
          <CardTitle>Teaching Hours by Month (YTD)</CardTitle>
          <CardDescription>
            Monthly breakdown of your teaching activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className=&quot;h-[200px] bg-slate-50 rounded-md flex items-center justify-center&quot;>
            {/* This would be a real chart in production */}
            <p className=&quot;text-muted-foreground">Teaching hours chart will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 