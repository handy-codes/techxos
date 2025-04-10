"use client&quot;;

import { useState, useEffect } from &quot;react&quot;;
import { useUser } from &quot;@clerk/nextjs&quot;;
import axios from &quot;axios&quot;;
import { toast } from &quot;react-hot-toast&quot;;
import { format, isToday, isTomorrow, isYesterday, formatDistance } from &quot;date-fns&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from &quot;@/components/ui/card&quot;;
import { Tabs, TabsContent, TabsList, TabsTrigger } from &quot;@/components/ui/tabs&quot;;
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from &quot;@/components/ui/table&quot;;
import { Skeleton } from &quot;@/components/ui/skeleton&quot;;
import { Badge } from &quot;@/components/ui/badge&quot;;
import { Clock, Calendar, Video, Edit, Trash2, Play, Square } from &quot;lucide-react&quot;;
import Link from &quot;next/link&quot;;
import { useRouter } from &quot;next/navigation&quot;;

interface ZoomMeeting {
  id: string;
  zoomMeetingId: string;
  topic: string;
  startTime: string;
  duration: number;
  status: &quot;SCHEDULED&quot; | &quot;STARTED&quot; | &quot;ENDED&quot; | &quot;COMPLETED&quot;;
  liveClass: {
    id: string;
    title: string;
  };
}

export default function LecturerZoomMeetingsPage() {
  const { user } = useUser();
  const router = useRouter();
  const [meetings, setMeetings] = useState<ZoomMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(&quot;upcoming&quot;);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const response = await axios.get(&quot;/api/lecturer/zoom-meetings&quot;);
      setMeetings(response.data);
    } catch (error) {
      console.error(&quot;Error fetching meetings:&quot;, error);
      toast.error(&quot;Could not load meetings&quot;);
    } finally {
      setLoading(false);
    }
  };

  const startMeeting = async (meetingId: string) => {
    try {
      await axios.post(`/api/zoom/meetings/${meetingId}/start`);
      toast.success(&quot;Meeting started&quot;);
      router.push(`/lecturer/zoom-meetings/${meetingId}/host`);
    } catch (error) {
      console.error(&quot;Error starting meeting:&quot;, error);
      toast.error(&quot;Failed to start meeting&quot;);
    }
  };

  const endMeeting = async (meetingId: string) => {
    try {
      await axios.post(`/api/zoom/meetings/${meetingId}/end`);
      toast.success(&quot;Meeting ended&quot;);
      fetchMeetings(); // Refresh the list
    } catch (error) {
      console.error(&quot;Error ending meeting:&quot;, error);
      toast.error(&quot;Failed to end meeting&quot;);
    }
  };

  const deleteMeeting = async (meetingId: string) => {
    if (!confirm(&quot;Are you sure you want to delete this meeting?&quot;)) return;
    
    try {
      await axios.delete(`/api/zoom/meetings/${meetingId}`);
      toast.success(&quot;Meeting deleted&quot;);
      fetchMeetings(); // Refresh the list
    } catch (error) {
      console.error(&quot;Error deleting meeting:&quot;, error);
      toast.error(&quot;Failed to delete meeting&quot;);
    }
  };

  const formatMeetingDate = (dateString: string) => {
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return `Today at ${format(date, &apos;h:mm a&apos;)}`;
    } else if (isTomorrow(date)) {
      return `Tomorrow at ${format(date, &apos;h:mm a&apos;)}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, &apos;h:mm a&apos;)}`;
    } else {
      return format(date, &apos;MMM d, yyyy • h:mm a&apos;);
    }
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    if (date > now) {
      return `Starts ${formatDistance(date, now, { addSuffix: true })}`;
    } else {
      return `Started ${formatDistance(date, now, { addSuffix: true })}`;
    }
  };

  const getMeetingStatusColor = (status: string) => {
    switch (status) {
      case &quot;SCHEDULED&quot;:
        return &quot;bg-blue-100 text-blue-800&quot;;
      case &quot;STARTED&quot;:
        return &quot;bg-green-100 text-green-800&quot;;
      case &quot;ENDED&quot;:
      case &quot;COMPLETED&quot;:
        return &quot;bg-gray-100 text-gray-800&quot;;
      default:
        return &quot;bg-gray-100 text-gray-800&quot;;
    }
  };

  const upcomingMeetings = meetings.filter(meeting => 
    meeting.status === &quot;SCHEDULED&quot;
  );
  
  const liveMeetings = meetings.filter(meeting => 
    meeting.status === &quot;STARTED&quot;
  );
  
  const pastMeetings = meetings.filter(meeting => 
    meeting.status === &quot;ENDED&quot; || meeting.status === &quot;COMPLETED&quot;
  );

  if (loading) {
    return (
      <div className=&quot;space-y-6&quot;>
        <div className=&quot;flex justify-between items-center&quot;>
          <Skeleton className=&quot;h-8 w-64&quot; />
          <Skeleton className=&quot;h-10 w-40&quot; />
        </div>
        
        <div className=&quot;space-y-4&quot;>
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className=&quot;h-6 w-64&quot; />
                <Skeleton className=&quot;h-4 w-32&quot; />
              </CardHeader>
              <CardContent>
                <Skeleton className=&quot;h-20 w-full&quot; />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className=&quot;space-y-6&quot;>
      <div className=&quot;flex justify-between items-center&quot;>
        <h1 className=&quot;text-2xl font-bold&quot;>Zoom Meetings</h1>
        <Link href=&quot;/lecturer/zoom-meetings/new&quot;>
          <Button>
            <Video className=&quot;mr-2 h-4 w-4&quot; />
            Schedule New Meeting
          </Button>
        </Link>
      </div>
      
      <Tabs defaultValue=&quot;upcoming&quot; value={activeTab} onValueChange={setActiveTab}>
        <TabsList className=&quot;grid w-full grid-cols-3&quot;>
          <TabsTrigger value=&quot;upcoming&quot;>
            Upcoming ({upcomingMeetings.length})
          </TabsTrigger>
          <TabsTrigger value=&quot;live&quot;>
            Live Now ({liveMeetings.length})
          </TabsTrigger>
          <TabsTrigger value=&quot;past&quot;>
            Past ({pastMeetings.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value=&quot;upcoming&quot; className=&quot;space-y-4&quot;>
          {upcomingMeetings.length === 0 ? (
            <Card>
              <CardContent className=&quot;pt-6 text-center&quot;>
                <p className=&quot;text-muted-foreground&quot;>No upcoming meetings scheduled</p>
                <Link href=&quot;/lecturer/zoom-meetings/new&quot;>
                  <Button variant=&quot;outline&quot; className=&quot;mt-4&quot;>
                    Schedule a Meeting
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Topic</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {upcomingMeetings.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell className=&quot;font-medium&quot;>{meeting.topic}</TableCell>
                    <TableCell>{meeting.liveClass.title}</TableCell>
                    <TableCell>
                      <div className=&quot;flex flex-col&quot;>
                        <span>{formatMeetingDate(meeting.startTime)}</span>
                        <span className=&quot;text-xs text-muted-foreground&quot;>
                          {formatRelativeTime(meeting.startTime)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{meeting.duration} min</TableCell>
                    <TableCell>
                      <div className=&quot;flex space-x-2&quot;>
                        <Button 
                          size=&quot;sm&quot; 
                          variant=&quot;default&quot;
                          onClick={() => startMeeting(meeting.id)}
                        >
                          <Play className=&quot;h-4 w-4 mr-1&quot; />
                          Start
                        </Button>
                        <Button 
                          size=&quot;sm&quot; 
                          variant=&quot;outline&quot;
                          onClick={() => router.push(`/lecturer/zoom-meetings/${meeting.id}/edit`)}
                        >
                          <Edit className=&quot;h-4 w-4&quot; />
                        </Button>
                        <Button 
                          size=&quot;sm&quot; 
                          variant=&quot;outline&quot;
                          onClick={() => deleteMeeting(meeting.id)}
                        >
                          <Trash2 className=&quot;h-4 w-4&quot; />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
        
        <TabsContent value=&quot;live&quot; className=&quot;space-y-4&quot;>
          {liveMeetings.length === 0 ? (
            <Card>
              <CardContent className=&quot;pt-6 text-center&quot;>
                <p className=&quot;text-muted-foreground&quot;>No meetings are currently live</p>
              </CardContent>
            </Card>
          ) : (
            <div className=&quot;grid gap-4 md:grid-cols-2&quot;>
              {liveMeetings.map((meeting) => (
                <Card key={meeting.id}>
                  <CardHeader>
                    <div className=&quot;flex justify-between items-start&quot;>
                      <div>
                        <Badge className={getMeetingStatusColor(meeting.status)}>
                          LIVE NOW
                        </Badge>
                        <CardTitle className=&quot;mt-2&quot;>{meeting.topic}</CardTitle>
                        <CardDescription>{meeting.liveClass.title}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className=&quot;flex justify-between items-center mb-4&quot;>
                      <div className=&quot;flex items-center text-sm&quot;>
                        <Calendar className=&quot;h-4 w-4 mr-2&quot; />
                        {formatMeetingDate(meeting.startTime)}
                      </div>
                      <div className=&quot;flex items-center text-sm&quot;>
                        <Clock className=&quot;h-4 w-4 mr-2&quot; />
                        {meeting.duration} minutes
                      </div>
                    </div>
                    <div className=&quot;flex space-x-2&quot;>
                      <Button 
                        className=&quot;flex-1&quot;
                        onClick={() => router.push(`/lecturer/zoom-meetings/${meeting.id}/host`)}
                      >
                        Join Now
                      </Button>
                      <Button 
                        variant=&quot;outline&quot;
                        onClick={() => endMeeting(meeting.id)}
                      >
                        <Square className=&quot;h-4 w-4&quot; />
                        End
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value=&quot;past&quot; className=&quot;space-y-4&quot;>
          {pastMeetings.length === 0 ? (
            <Card>
              <CardContent className=&quot;pt-6 text-center&quot;>
                <p className=&quot;text-muted-foreground&quot;>No past meetings found</p>
              </CardContent>
            </Card>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Topic</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pastMeetings.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell className=&quot;font-medium&quot;>{meeting.topic}</TableCell>
                    <TableCell>{meeting.liveClass.title}</TableCell>
                    <TableCell>{formatMeetingDate(meeting.startTime)}</TableCell>
                    <TableCell>
                      <Badge className={getMeetingStatusColor(meeting.status)}>
                        {meeting.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className=&quot;flex space-x-2&quot;>
                        <Link href={`/lecturer/zoom-meetings/${meeting.id}/recordings`}>
                          <Button size=&quot;sm&quot; variant=&quot;outline&quot;>
                            Recordings
                          </Button>
                        </Link>
                        <Button 
                          size=&quot;sm&quot; 
                          variant=&quot;outline&quot;
                          onClick={() => deleteMeeting(meeting.id)}
                        >
                          <Trash2 className=&quot;h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 