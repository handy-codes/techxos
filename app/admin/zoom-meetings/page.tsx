"use client";

import { useState, useEffect } from "react";
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
import { Card } from "@/components/ui/card";
import { 
  Clock, 
  Play, 
  Square, 
  Edit, 
  Trash2, 
  ExternalLink,
  Calendar
} from "lucide-react";
import { toast } from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ZoomMeeting {
  id: string;
  zoomMeetingId: string | null;
  topic: string;
  startTime: string;
  duration: number;
  status: string;
  liveClass: {
    title: string;
    lecturer: {
      name: string | null;
      email: string;
    };
  };
}

export default function ZoomMeetingsPage() {
  const { user } = useUser();
  const [meetings, setMeetings] = useState<ZoomMeeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<ZoomMeeting[]>("/api/zoom/meetings");
      setMeetings(response.data);
    } catch (error: unknown) {
      console.error("Error fetching meetings:", error);
      toast.error("Failed to fetch Zoom meetings");
    } finally {
      setIsLoading(false);
    }
  };

  const startMeeting = async (meetingId: string) => {
    try {
      const response = await axios.post(`/api/zoom/meetings/${meetingId}/start`);
      
      if (response.data.startUrl) {
        // Open the start URL in a new window
        window.open(response.data.startUrl, "_blank");
        toast.success("Starting Zoom meeting...");
        // Refresh the meetings list after a short delay
        setTimeout(fetchMeetings, 2000);
      }
    } catch (error: unknown) {
      console.error("Error starting meeting:", error);
      toast.error("Failed to start the meeting");
    }
  };

  const endMeeting = async (meetingId: string) => {
    try {
      await axios.post(`/api/zoom/meetings/${meetingId}/end`);
      toast.success("Meeting ended successfully");
      fetchMeetings();
    } catch (error: unknown) {
      console.error("Error ending meeting:", error);
      toast.error("Failed to end the meeting");
    }
  };

  const deleteMeeting = async (meetingId: string) => {
    if (!confirm("Are you sure you want to delete this meeting?")) {
      return;
    }
    
    try {
      await axios.delete(`/api/zoom/meetings/${meetingId}`);
      toast.success("Meeting deleted successfully");
      fetchMeetings();
    } catch (error: unknown) {
      console.error("Error deleting meeting:", error);
      toast.error("Failed to delete the meeting");
    }
  };

  const joinMeeting = async (meetingId: string) => {
    try {
      const response = await axios.post(`/api/zoom/meetings/${meetingId}/join`);
      
      if (response.data.joinUrl) {
        window.open(response.data.joinUrl, "_blank");
      } else {
        // Redirect to a classroom page that uses our ZoomMeeting component
        window.location.href = `/admin/zoom-meetings/${meetingId}/join`;
      }
    } catch (error: unknown) {
      console.error("Error joining meeting:", error);
      toast.error("Failed to join the meeting");
    }
  };

  const formatDateRelative = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return dateString;
    }
  };

  const getMeetingStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800";
      case "STARTED":
        return "bg-green-100 text-green-800";
      case "ENDED":
        return "bg-gray-100 text-gray-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Zoom Meetings</h1>
        </div>
        <p>Loading meetings...</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Zoom Meetings</h1>
          <Link href="/admin/zoom-meetings/new">
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule New Meeting
            </Button>
          </Link>
        </div>

        {meetings.length === 0 ? (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-medium mb-2">No meetings scheduled</h3>
            <p className="text-muted-foreground mb-4">
              Schedule your first Zoom meeting to get started
            </p>
            <Link href="/admin/zoom-meetings/new">
              <Button>Schedule Meeting</Button>
            </Link>
          </Card>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Topic</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Host</TableHead>
                <TableHead>Scheduled Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetings.map((meeting) => (
                <TableRow key={meeting.id}>
                  <TableCell className="font-medium">{meeting.topic}</TableCell>
                  <TableCell>{meeting.liveClass.title}</TableCell>
                  <TableCell>{meeting.liveClass.lecturer.name || meeting.liveClass.lecturer.email}</TableCell>
                  <TableCell>{formatDateRelative(meeting.startTime)}</TableCell>
                  <TableCell>{meeting.duration} mins</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getMeetingStatusColor(
                        meeting.status
                      )}`}
                    >
                      {meeting.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* Join button - always available */}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => joinMeeting(meeting.id)}
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        Join
                      </Button>
                      
                      {/* Start button - only for SCHEDULED meetings */}
                      {meeting.status === "SCHEDULED" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => startMeeting(meeting.id)}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                      )}
                      
                      {/* End button - only for STARTED meetings */}
                      {meeting.status === "STARTED" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => endMeeting(meeting.id)}
                        >
                          <Square className="h-4 w-4 mr-1" />
                          End
                        </Button>
                      )}
                      
                      {/* Edit button - for SCHEDULED meetings */}
                      {meeting.status === "SCHEDULED" && (
                        <Link href={`/admin/zoom-meetings/${meeting.id}/edit`}>
                          <Button 
                            variant="outline" 
                            size="sm"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </Link>
                      )}
                      
                      {/* Delete button - for non-STARTED meetings */}
                      {meeting.status !== "STARTED" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => deleteMeeting(meeting.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      )}
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