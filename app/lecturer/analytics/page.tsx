"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "react-hot-toast";
import { format, subDays, eachDayOfInterval, isSameDay } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart as BarChartComponent,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { CalendarIcon, Users, Clock, Activity, Calendar } from "lucide-react";

interface AnalyticsData {
  teachingHoursByDay: {
    date: string;
    hours: number;
  }[];
  studentAttendance: {
    meetingId: string;
    meetingTopic: string;
    attendeeCount: number;
    totalStudents: number;
  }[];
  classCounts: {
    title: string;
    count: number;
  }[];
  upcomingMeetingDates: string[];
  totalStats: {
    totalClasses: number;
    totalStudents: number;
    totalHours: number;
    avgAttendance: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

export default function LecturerAnalyticsPage() {
  const { user } = useUser();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/lecturer/analytics");
      setData(response.data);
    } catch (error) {
      console.error("Analytics data error:", error);
      toast.error("Could not load analytics data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  // If no data is available yet
  if (!data) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">No analytics data available yet</p>
            <p className="text-muted-foreground mt-1">
              Start hosting meetings to generate analytics
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Format data for charts
  const formatAttendanceData = () => {
    return data.studentAttendance.map(item => ({
      name: item.meetingTopic,
      attendance: Math.round((item.attendeeCount / item.totalStudents) * 100),
      total: 100
    }));
  };

  const formatClassData = () => {
    return data.classCounts;
  };

  // Create an array of the last 7 days for the hours chart
  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date()
  }).map(date => {
    const matchingDay = data.teachingHoursByDay.find(d => 
      isSameDay(new Date(d.date), date)
    );
    
    return {
      name: format(date, 'dd MMM'),
      hours: matchingDay ? matchingDay.hours : 0
    };
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalStats.totalClasses}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalStats.totalStudents}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Teaching Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalStats.totalHours}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalStats.avgAttendance}%</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="hours">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hours">Teaching Hours</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Teaching Hours (Last 7 Days)</CardTitle>
              <CardDescription>
                Hours spent in Zoom meetings per day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChartComponent
                    data={last7Days}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hours" fill="#8884d8" name="Hours" />
                  </BarChartComponent>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Student Attendance by Meeting</CardTitle>
              <CardDescription>
                Percentage of students who attended each meeting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChartComponent
                    data={formatAttendanceData()}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="attendance" fill="#82ca9d" name="Attendance %" />
                  </BarChartComponent>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="classes">
          <Card>
            <CardHeader>
              <CardTitle>Students by Class</CardTitle>
              <CardDescription>
                Distribution of students across your classes
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <div className="h-[300px] w-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={formatClassData()}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      nameKey="title"
                    >
                      {formatClassData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Meetings</CardTitle>
          <CardDescription>
            Your scheduled meetings in the next 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.upcomingMeetingDates.length > 0 ? (
            <div className="space-y-2">
              {data.upcomingMeetingDates.map((date, index) => (
                <div key={index} className="flex items-center p-2 rounded-md hover:bg-slate-50">
                  <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{format(new Date(date), "EEEE, MMMM d, yyyy 'at' h:mm a")}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No upcoming meetings scheduled</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 