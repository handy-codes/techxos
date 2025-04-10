"use client&quot;;

import { useState, useEffect } from &quot;react&quot;;
import { useUser } from &quot;@clerk/nextjs&quot;;
import { useRouter } from &quot;next/navigation&quot;;
import axios from &quot;axios&quot;;
import { toast } from &quot;react-hot-toast&quot;;
import { format } from &quot;date-fns&quot;;
import { ZoomMeeting } from &quot;@/components/zoom/ZoomMeeting&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from &quot;@/components/ui/card&quot;;
import { Skeleton } from &quot;@/components/ui/skeleton&quot;;
import { Badge } from &quot;@/components/ui/badge&quot;;
import { Tabs, TabsContent, TabsList, TabsTrigger } from &quot;@/components/ui/tabs&quot;;
import { Calendar, Users, Clock, ChevronLeft, Square } from &quot;lucide-react&quot;;
import Link from &quot;next/link&quot;;

interface ZoomMeetingDetails {
  id: string;
  zoomMeetingId: string;
  topic: string;
  startTime: string;
  duration: number;
  status: &quot;SCHEDULED&quot; | &quot;STARTED&quot; | &quot;ENDED&quot; | &quot;COMPLETED&quot;;
  password: string | null;
  agenda: string | null;
  liveClass: {
    id: string;
    title: string;
    lecturer: {
      id: string;
      name: string | null;
      email: string;
    }
  };
  attendance?: {
    id: string;
    userId: string;
    joinTime: string;
    user: {
      name: string | null;
      email: string;
    }
  }[];
}

export default function HostMeetingPage({ params }: { params: { meetingId: string } }) {
  const [meeting, setMeeting] = useState<ZoomMeetingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    fetchMeetingDetails();
  }, []);

  const fetchMeetingDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/zoom/meetings/${params.meetingId}`);
      setMeeting(response.data);
    } catch (error) {
      console.error(&quot;Error fetching meeting:&quot;, error);
      setError(&quot;Could not load meeting details&quot;);
      toast.error(&quot;Failed to load meeting details&quot;);
    } finally {
      setLoading(false);
    }
  };

  const endMeeting = async () => {
    try {
      await axios.post(`/api/zoom/meetings/${params.meetingId}/end`);
      toast.success(&quot;Meeting ended&quot;);
      router.push(&quot;/lecturer/zoom-meetings&quot;);
    } catch (error) {
      console.error(&quot;Error ending meeting:&quot;, error);
      toast.error(&quot;Failed to end meeting&quot;);
    }
  };

  const handleJoinSuccess = () => {
    toast.success(&quot;Successfully joined the meeting&quot;);
  };

  const handleJoinError = (error: any) => {
    console.error(&quot;Join error:&quot;, error);
    toast.error(&quot;Failed to join the meeting&quot;);
  };

  if (loading) {
    return (
      <div className=&quot;space-y-6&quot;>
        <div className=&quot;flex items-center space-x-4&quot;>
          <Skeleton className=&quot;h-10 w-10 rounded-full&quot; />
          <div className=&quot;space-y-2&quot;>
            <Skeleton className=&quot;h-4 w-[250px]&quot; />
            <Skeleton className=&quot;h-4 w-[200px]&quot; />
          </div>
        </div>
        <Skeleton className=&quot;h-[400px] w-full rounded-xl&quot; />
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className=&quot;space-y-6&quot;>
        <Link href=&quot;/lecturer/zoom-meetings&quot;>
          <Button variant=&quot;ghost&quot; size=&quot;sm&quot;>
            <ChevronLeft className=&quot;mr-2 h-4 w-4&quot; /> Back to meetings
          </Button>
        </Link>
        <Card>
          <CardContent className=&quot;pt-6 text-center&quot;>
            <p className=&quot;text-muted-foreground&quot;>{error || &quot;Meeting not found&quot;}</p>
            <Button 
              variant=&quot;outline&quot; 
              className=&quot;mt-4&quot;
              onClick={() => router.push(&quot;/lecturer/zoom-meetings&quot;)}
            >
              Return to Meetings List
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className=&quot;space-y-6&quot;>
      <div className=&quot;flex justify-between items-center&quot;>
        <Link href=&quot;/lecturer/zoom-meetings&quot;>
          <Button variant=&quot;ghost&quot; size=&quot;sm&quot;>
            <ChevronLeft className=&quot;mr-2 h-4 w-4&quot; /> Back to meetings
          </Button>
        </Link>
        <Button 
          variant=&quot;destructive&quot; 
          size=&quot;sm&quot;
          onClick={endMeeting}
        >
          <Square className=&quot;mr-2 h-4 w-4&quot; /> End Meeting
        </Button>
      </div>

      <div className=&quot;grid gap-6 md:grid-cols-3&quot;>
        <div className=&quot;md:col-span-2&quot;>
          <Card className=&quot;overflow-hidden&quot;>
            <CardHeader>
              <div className=&quot;flex items-center justify-between&quot;>
                <div>
                  <Badge className=&quot;bg-green-100 text-green-800 mb-2&quot;>LIVE</Badge>
                  <CardTitle>{meeting.topic}</CardTitle>
                  <CardDescription>{meeting.liveClass.title}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className=&quot;p-0&quot;>
              <div className=&quot;h-[500px] bg-black relative&quot;>
                <ZoomMeeting 
                  meetingId={meeting.id} 
                  onJoinSuccess={handleJoinSuccess}
                  onJoinError={handleJoinError}
                />
              </div>
            </CardContent>
            <CardFooter className=&quot;bg-slate-50 flex justify-between items-center p-4&quot;>
              <div className=&quot;flex items-center space-x-4&quot;>
                <div className=&quot;flex items-center&quot;>
                  <Calendar className=&quot;h-4 w-4 mr-2 text-muted-foreground&quot; />
                  <span className=&quot;text-sm&quot;>{format(new Date(meeting.startTime), &quot;MMM d, yyyy • h:mm a&quot;)}</span>
                </div>
                <div className=&quot;flex items-center&quot;>
                  <Clock className=&quot;h-4 w-4 mr-2 text-muted-foreground&quot; />
                  <span className=&quot;text-sm&quot;>{meeting.duration} minutes</span>
                </div>
              </div>
              <Button
                variant=&quot;outline&quot;
                size=&quot;sm&quot;
                onClick={endMeeting}
              >
                End Meeting
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Meeting Information</CardTitle>
            </CardHeader>
            <CardContent className=&quot;space-y-4&quot;>
              <div>
                <h3 className=&quot;text-sm font-medium mb-1&quot;>Zoom Meeting ID</h3>
                <p className=&quot;text-sm&quot;>{meeting.zoomMeetingId || &quot;Not available&quot;}</p>
              </div>

              <div>
                <h3 className=&quot;text-sm font-medium mb-1&quot;>Password</h3>
                <p className=&quot;text-sm&quot;>{meeting.password || &quot;No password set&quot;}</p>
              </div>

              {meeting.agenda && (
                <div>
                  <h3 className=&quot;text-sm font-medium mb-1&quot;>Agenda</h3>
                  <p className=&quot;text-sm whitespace-pre-line&quot;>{meeting.agenda}</p>
                </div>
              )}

              <div>
                <h3 className=&quot;text-sm font-medium mb-1&quot;>Host</h3>
                <p className=&quot;text-sm&quot;>{meeting.liveClass.lecturer.name || meeting.liveClass.lecturer.email}</p>
              </div>
            </CardContent>
          </Card>

          <Card className=&quot;mt-4&quot;>
            <CardHeader>
              <CardTitle className=&quot;flex items-center&quot;>
                <Users className=&quot;h-4 w-4 mr-2&quot; />
                Participants
              </CardTitle>
            </CardHeader>
            <CardContent>
              {meeting.attendance && meeting.attendance.length > 0 ? (
                <ul className=&quot;space-y-2&quot;>
                  {meeting.attendance.map((attendee) => (
                    <li key={attendee.id} className=&quot;flex justify-between items-center text-sm&quot;>
                      <span>{attendee.user.name || attendee.user.email}</span>
                      <span className=&quot;text-xs text-muted-foreground&quot;>
                        {format(new Date(attendee.joinTime), &quot;h:mm a&quot;)}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className=&quot;text-sm text-muted-foreground">No participants have joined yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 