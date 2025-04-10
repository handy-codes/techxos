"use client&quot;;

import { useState, useEffect } from &quot;react&quot;;
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
import { Card } from &quot;@/components/ui/card&quot;;
import { 
  Clock, 
  Play, 
  Square, 
  Edit, 
  Trash2, 
  ExternalLink,
  Calendar
} from &quot;lucide-react&quot;;
import { toast } from &quot;react-hot-toast&quot;;
import { formatDistanceToNow } from &quot;date-fns&quot;;
import axios from &quot;axios&quot;;
import { ScrollArea } from &quot;@/components/ui/scroll-area&quot;;

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
      const response = await axios.get<ZoomMeeting[]>(&quot;/api/zoom/meetings&quot;);
      setMeetings(response.data);
    } catch (error: unknown) {
      console.error(&quot;Error fetching meetings:&quot;, error);
      toast.error(&quot;Failed to fetch Zoom meetings&quot;);
    } finally {
      setIsLoading(false);
    }
  };

  const startMeeting = async (meetingId: string) => {
    try {
      const response = await axios.post(`/api/zoom/meetings/${meetingId}/start`);
      
      if (response.data.startUrl) {
        // Open the start URL in a new window
        window.open(response.data.startUrl, &quot;_blank&quot;);
        toast.success(&quot;Starting Zoom meeting...&quot;);
        // Refresh the meetings list after a short delay
        setTimeout(fetchMeetings, 2000);
      }
    } catch (error: unknown) {
      console.error(&quot;Error starting meeting:&quot;, error);
      toast.error(&quot;Failed to start the meeting&quot;);
    }
  };

  const endMeeting = async (meetingId: string) => {
    try {
      await axios.post(`/api/zoom/meetings/${meetingId}/end`);
      toast.success(&quot;Meeting ended successfully&quot;);
      fetchMeetings();
    } catch (error: unknown) {
      console.error(&quot;Error ending meeting:&quot;, error);
      toast.error(&quot;Failed to end the meeting&quot;);
    }
  };

  const deleteMeeting = async (meetingId: string) => {
    if (!confirm(&quot;Are you sure you want to delete this meeting?&quot;)) {
      return;
    }
    
    try {
      await axios.delete(`/api/zoom/meetings/${meetingId}`);
      toast.success(&quot;Meeting deleted successfully&quot;);
      fetchMeetings();
    } catch (error: unknown) {
      console.error(&quot;Error deleting meeting:&quot;, error);
      toast.error(&quot;Failed to delete the meeting&quot;);
    }
  };

  const joinMeeting = async (meetingId: string) => {
    try {
      const response = await axios.post(`/api/zoom/meetings/${meetingId}/join`);
      
      if (response.data.joinUrl) {
        window.open(response.data.joinUrl, &quot;_blank&quot;);
      } else {
        // Redirect to a classroom page that uses our ZoomMeeting component
        window.location.href = `/admin/zoom-meetings/${meetingId}/join`;
      }
    } catch (error: unknown) {
      console.error(&quot;Error joining meeting:&quot;, error);
      toast.error(&quot;Failed to join the meeting&quot;);
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
      case &quot;SCHEDULED&quot;:
        return &quot;bg-blue-100 text-blue-800&quot;;
      case &quot;STARTED&quot;:
        return &quot;bg-green-100 text-green-800&quot;;
      case &quot;ENDED&quot;:
        return &quot;bg-gray-100 text-gray-800&quot;;
      case &quot;CANCELLED&quot;:
        return &quot;bg-red-100 text-red-800&quot;;
      default:
        return &quot;bg-gray-100 text-gray-800&quot;;
    }
  };

  if (isLoading) {
    return (
      <div className=&quot;p-6&quot;>
        <div className=&quot;flex justify-between items-center mb-6&quot;>
          <h1 className=&quot;text-2xl font-bold&quot;>Zoom Meetings</h1>
        </div>
        <p>Loading meetings...</p>
      </div>
    );
  }

  return (
    <ScrollArea className=&quot;h-full&quot;>
      <div className=&quot;p-6 space-y-6&quot;>
        <div className=&quot;flex justify-between items-center&quot;>
          <h1 className=&quot;text-2xl font-bold&quot;>Zoom Meetings</h1>
          <Link href=&quot;/admin/zoom-meetings/new&quot;>
            <Button>
              <Calendar className=&quot;h-4 w-4 mr-2&quot; />
              Schedule New Meeting
            </Button>
          </Link>
        </div>

        {meetings.length === 0 ? (
          <Card className=&quot;p-8 text-center&quot;>
            <h3 className=&quot;text-lg font-medium mb-2&quot;>No meetings scheduled</h3>
            <p className=&quot;text-muted-foreground mb-4&quot;>
              Schedule your first Zoom meeting to get started
            </p>
            <Link href=&quot;/admin/zoom-meetings/new&quot;>
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
                <TableHead className=&quot;text-right&quot;>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetings.map((meeting) => (
                <TableRow key={meeting.id}>
                  <TableCell className=&quot;font-medium&quot;>{meeting.topic}</TableCell>
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
                  <TableCell className=&quot;text-right&quot;>
                    <div className=&quot;flex justify-end gap-2&quot;>
                      {/* Join button - always available */}
                      <Button 
                        variant=&quot;outline&quot; 
                        size=&quot;sm&quot;
                        onClick={() => joinMeeting(meeting.id)}
                      >
                        <ExternalLink className=&quot;h-4 w-4 mr-1&quot; />
                        Join
                      </Button>
                      
                      {/* Start button - only for SCHEDULED meetings */}
                      {meeting.status === &quot;SCHEDULED&quot; && (
                        <Button 
                          variant=&quot;outline&quot; 
                          size=&quot;sm&quot;
                          onClick={() => startMeeting(meeting.id)}
                        >
                          <Play className=&quot;h-4 w-4 mr-1&quot; />
                          Start
                        </Button>
                      )}
                      
                      {/* End button - only for STARTED meetings */}
                      {meeting.status === &quot;STARTED&quot; && (
                        <Button 
                          variant=&quot;outline&quot; 
                          size=&quot;sm&quot;
                          onClick={() => endMeeting(meeting.id)}
                        >
                          <Square className=&quot;h-4 w-4 mr-1&quot; />
                          End
                        </Button>
                      )}
                      
                      {/* Edit button - for SCHEDULED meetings */}
                      {meeting.status === &quot;SCHEDULED&quot; && (
                        <Link href={`/admin/zoom-meetings/${meeting.id}/edit`}>
                          <Button 
                            variant=&quot;outline&quot; 
                            size=&quot;sm&quot;
                          >
                            <Edit className=&quot;h-4 w-4 mr-1&quot; />
                            Edit
                          </Button>
                        </Link>
                      )}
                      
                      {/* Delete button - for non-STARTED meetings */}
                      {meeting.status !== &quot;STARTED&quot; && (
                        <Button 
                          variant=&quot;outline&quot; 
                          size=&quot;sm&quot;
                          onClick={() => deleteMeeting(meeting.id)}
                        >
                          <Trash2 className=&quot;h-4 w-4 mr-1" />
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