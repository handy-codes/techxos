"use client&quot;;

import { useState, useEffect } from &quot;react&quot;;
import { useUser } from &quot;@clerk/nextjs&quot;;
import axios from &quot;axios&quot;;
import { toast } from &quot;react-hot-toast&quot;;
import { format, subDays, eachDayOfInterval, isSameDay } from &quot;date-fns&quot;;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from &quot;@/components/ui/card&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import { Skeleton } from &quot;@/components/ui/skeleton&quot;;
import { Tabs, TabsContent, TabsList, TabsTrigger } from &quot;@/components/ui/tabs&quot;;
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
} from &quot;recharts&quot;;
import { CalendarIcon, Users, Clock, Activity, Calendar } from &quot;lucide-react&quot;;

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

const COLORS = [&apos;#0088FE&apos;, &apos;#00C49F&apos;, &apos;#FFBB28&apos;, &apos;#FF8042&apos;, &apos;#8884D8&apos;, &apos;#82ca9d&apos;];

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
      const response = await axios.get(&quot;/api/lecturer/analytics&quot;);
      setData(response.data);
    } catch (error) {
      console.error(&quot;Analytics data error:&quot;, error);
      toast.error(&quot;Could not load analytics data&quot;);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className=&quot;space-y-6&quot;>
        <Skeleton className=&quot;h-8 w-48&quot; />
        <div className=&quot;grid gap-4 md:grid-cols-4&quot;>
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className=&quot;h-4 w-32&quot; />
              </CardHeader>
              <CardContent>
                <Skeleton className=&quot;h-8 w-16&quot; />
              </CardContent>
            </Card>
          ))}
        </div>
        <Skeleton className=&quot;h-[300px] w-full&quot; />
      </div>
    );
  }

  // If no data is available yet
  if (!data) {
    return (
      <div className=&quot;space-y-6&quot;>
        <h1 className=&quot;text-2xl font-bold&quot;>Analytics</h1>
        <Card>
          <CardContent className=&quot;pt-6 text-center&quot;>
            <p className=&quot;text-muted-foreground&quot;>No analytics data available yet</p>
            <p className=&quot;text-muted-foreground mt-1&quot;>
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
      name: format(date, &apos;dd MMM&apos;),
      hours: matchingDay ? matchingDay.hours : 0
    };
  });

  return (
    <div className=&quot;space-y-6&quot;>
      <h1 className=&quot;text-2xl font-bold&quot;>Analytics</h1>
      
      {/* Stats Cards */}
      <div className=&quot;grid gap-4 md:grid-cols-2 lg:grid-cols-4&quot;>
        <Card>
          <CardHeader className=&quot;flex flex-row items-center justify-between space-y-0 pb-2&quot;>
            <CardTitle className=&quot;text-sm font-medium&quot;>Total Classes</CardTitle>
            <Calendar className=&quot;h-4 w-4 text-muted-foreground&quot; />
          </CardHeader>
          <CardContent>
            <div className=&quot;text-2xl font-bold&quot;>{data.totalStats.totalClasses}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className=&quot;flex flex-row items-center justify-between space-y-0 pb-2&quot;>
            <CardTitle className=&quot;text-sm font-medium&quot;>Total Students</CardTitle>
            <Users className=&quot;h-4 w-4 text-muted-foreground&quot; />
          </CardHeader>
          <CardContent>
            <div className=&quot;text-2xl font-bold&quot;>{data.totalStats.totalStudents}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className=&quot;flex flex-row items-center justify-between space-y-0 pb-2&quot;>
            <CardTitle className=&quot;text-sm font-medium&quot;>Teaching Hours</CardTitle>
            <Clock className=&quot;h-4 w-4 text-muted-foreground&quot; />
          </CardHeader>
          <CardContent>
            <div className=&quot;text-2xl font-bold&quot;>{data.totalStats.totalHours}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className=&quot;flex flex-row items-center justify-between space-y-0 pb-2&quot;>
            <CardTitle className=&quot;text-sm font-medium&quot;>Avg. Attendance</CardTitle>
            <Activity className=&quot;h-4 w-4 text-muted-foreground&quot; />
          </CardHeader>
          <CardContent>
            <div className=&quot;text-2xl font-bold&quot;>{data.totalStats.avgAttendance}%</div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue=&quot;hours&quot;>
        <TabsList className=&quot;grid w-full grid-cols-3&quot;>
          <TabsTrigger value=&quot;hours&quot;>Teaching Hours</TabsTrigger>
          <TabsTrigger value=&quot;attendance&quot;>Attendance</TabsTrigger>
          <TabsTrigger value=&quot;classes&quot;>Classes</TabsTrigger>
        </TabsList>
        
        <TabsContent value=&quot;hours&quot;>
          <Card>
            <CardHeader>
              <CardTitle>Teaching Hours (Last 7 Days)</CardTitle>
              <CardDescription>
                Hours spent in Zoom meetings per day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className=&quot;h-[300px]&quot;>
                <ResponsiveContainer width=&quot;100%&quot; height=&quot;100%&quot;>
                  <BarChartComponent
                    data={last7Days}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray=&quot;3 3&quot; />
                    <XAxis dataKey=&quot;name&quot; />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey=&quot;hours&quot; fill=&quot;#8884d8&quot; name=&quot;Hours&quot; />
                  </BarChartComponent>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value=&quot;attendance&quot;>
          <Card>
            <CardHeader>
              <CardTitle>Student Attendance by Meeting</CardTitle>
              <CardDescription>
                Percentage of students who attended each meeting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className=&quot;h-[300px]&quot;>
                <ResponsiveContainer width=&quot;100%&quot; height=&quot;100%&quot;>
                  <BarChartComponent
                    data={formatAttendanceData()}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray=&quot;3 3&quot; />
                    <XAxis dataKey=&quot;name&quot; />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey=&quot;attendance&quot; fill=&quot;#82ca9d&quot; name=&quot;Attendance %&quot; />
                  </BarChartComponent>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value=&quot;classes&quot;>
          <Card>
            <CardHeader>
              <CardTitle>Students by Class</CardTitle>
              <CardDescription>
                Distribution of students across your classes
              </CardDescription>
            </CardHeader>
            <CardContent className=&quot;flex justify-center&quot;>
              <div className=&quot;h-[300px] w-[300px]&quot;>
                <ResponsiveContainer width=&quot;100%&quot; height=&quot;100%&quot;>
                  <PieChart>
                    <Pie
                      data={formatClassData()}
                      cx=&quot;50%&quot;
                      cy=&quot;50%&quot;
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill=&quot;#8884d8&quot;
                      dataKey=&quot;count&quot;
                      nameKey=&quot;title&quot;
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
            <div className=&quot;space-y-2&quot;>
              {data.upcomingMeetingDates.map((date, index) => (
                <div key={index} className=&quot;flex items-center p-2 rounded-md hover:bg-slate-50&quot;>
                  <CalendarIcon className=&quot;h-4 w-4 mr-2 text-muted-foreground&quot; />
                  <span>{format(new Date(date), &quot;EEEE, MMMM d, yyyy &apos;at&apos; h:mm a&quot;)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className=&quot;text-muted-foreground">No upcoming meetings scheduled</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 