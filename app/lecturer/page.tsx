"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  BarChart,
  Clock,
  Users,
  Calendar,
  Video,
  DollarSign
} from "lucide-react";
import Link from "next/link";

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

  const fetchDashboardStats = useCallback(async () => {
    try {
      const response = await axios.get("/api/lecturer/dashboard");
      setStats(response.data);
    } catch (error) {
      console.error("Dashboard stats error:", error);
      toast.error("Could not load dashboard statistics");
      // Keep default values
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-4 w-28 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">
              Enrolled in your courses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teaching Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours}</div>
            <p className="text-xs text-muted-foreground">
              Total hours YTD
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClasses}</div>
            <p className="text-xs text-muted-foreground">
              Currently active courses
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{stats.totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Revenue from your courses (YTD)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Meetings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingMeetings}</div>
            <p className="text-xs text-muted-foreground">
              Scheduled in the next 7 days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Meetings</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedMeetings}</div>
            <p className="text-xs text-muted-foreground">
              Successfully hosted sessions
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/lecturer/zoom-meetings/new">
            <Button
              variant="outline"
              className="h-24 w-full flex flex-col items-center justify-center gap-2"
            >
              <Video className="h-6 w-6" />
              <span>Schedule New Meeting</span>
            </Button>
          </Link>
          
          <Link href="/lecturer/classes">
            <Button
              variant="outline"
              className="h-24 w-full flex flex-col items-center justify-center gap-2"
            >
              <Users className="h-6 w-6" />
              <span>View My Classes</span>
            </Button>
          </Link>
          
          <Link href="/lecturer/analytics">
            <Button
              variant="outline"
              className="h-24 w-full flex flex-col items-center justify-center gap-2"
            >
              <BarChart className="h-6 w-6" />
              <span>View Analytics</span>
            </Button>
          </Link>
        </div>
      </div>
      
      {/* Chart Placeholder - Would integrate a real chart in a production app */}
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Teaching Hours by Month (YTD)</CardTitle>
          <CardDescription>
            Monthly breakdown of your teaching activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] bg-slate-50 rounded-md flex items-center justify-center">
            {/* This would be a real chart in production */}
            <p className="text-muted-foreground">Teaching hours chart will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 