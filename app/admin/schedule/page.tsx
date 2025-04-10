"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "react-hot-toast";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, Clock, UserCheck } from "lucide-react";

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
      // This endpoint doesn't exist yet, so we'll handle the error
      const response = await axios.get<Schedule[]>("/api/admin/schedules");
      setSchedules(response.data);
    } catch (error: unknown) {
      console.error("Error fetching schedules:", error);
      toast.error("Schedule system coming soon!");
      setSchedules([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Class Schedules</h1>
          <Button asChild>
            <Link href="/admin/schedule/new">Create New Schedule</Link>
          </Button>
        </div>

        {schedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <Calendar className="h-12 w-12 text-gray-400" />
            <h3 className="text-xl font-medium">No Schedules Found</h3>
            <p className="text-muted-foreground text-center max-w-md">
              This feature is coming soon. You&apos;ll be able to create and manage class schedules here.
            </p>
            <Button asChild>
              <Link href="/admin">Return to Dashboard</Link>
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
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {schedule.isActive ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
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