"use client&quot;;

import { useEffect, useState } from &quot;react&quot;;
import { useUser } from &quot;@clerk/nextjs&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import Link from &quot;next/link&quot;;
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from &quot;@/components/ui/table&quot;;
import { toast } from &quot;react-hot-toast&quot;;
import axios from &quot;axios&quot;;
import { ScrollArea } from &quot;@/components/ui/scroll-area&quot;;
import { Calendar, Clock, UserCheck } from &quot;lucide-react&quot;;

interface Schedule {
  id: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  liveClass: {
    title: string;
  };
  lecturer: {
    name: string | null;
  };
}

export default function SchedulePage() {
  const { user } = useUser();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      // This endpoint doesn&apos;t exist yet, so we&apos;ll handle the error
      const response = await axios.get<Schedule[]>(&quot;/api/admin/schedules&quot;);
      setSchedules(response.data);
    } catch (error: unknown) {
      console.error(&quot;Error fetching schedules:&quot;, error);
      toast.error(&quot;Schedule system coming soon!&quot;);
      setSchedules([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className=&quot;p-6&quot;>Loading...</div>;
  }

  return (
    <ScrollArea className=&quot;h-full&quot;>
      <div className=&quot;p-6&quot;>
        <div className=&quot;flex justify-between items-center mb-6&quot;>
          <h1 className=&quot;text-2xl font-bold&quot;>Class Schedules</h1>
          <Button asChild>
            <Link href=&quot;/admin/schedule/new&quot;>Create New Schedule</Link>
          </Button>
        </div>

        {schedules.length === 0 ? (
          <div className=&quot;flex flex-col items-center justify-center h-64 gap-4&quot;>
            <Calendar className=&quot;h-12 w-12 text-gray-400&quot; />
            <h3 className=&quot;text-xl font-medium&quot;>No Schedules Found</h3>
            <p className=&quot;text-muted-foreground text-center max-w-md&quot;>
              This feature is coming soon. You'll be able to create and manage class schedules here.
            </p>
            <Button asChild>
              <Link href=&quot;/admin&quot;>Return to Dashboard</Link>
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Lecturer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>{schedule.title}</TableCell>
                  <TableCell>{schedule.liveClass.title}</TableCell>
                  <TableCell>{schedule.lecturer.name}</TableCell>
                  <TableCell>{new Date(schedule.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {schedule.startTime} - {schedule.endTime}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${
                        schedule.isActive
                          ? &quot;bg-green-100 text-green-800&quot;
                          : &quot;bg-red-100 text-red-800&quot;
                      }`}
                    >
                      {schedule.isActive ? &quot;Active&quot; : &quot;Inactive&quot;}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className=&quot;flex gap-2&quot;>
                      <Button variant=&quot;outline&quot; size=&quot;sm" asChild>
                        <Link href={`/admin/schedule/${schedule.id}`}>
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </ScrollArea>
  );
} 