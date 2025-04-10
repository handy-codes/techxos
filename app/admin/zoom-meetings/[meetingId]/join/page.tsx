"use client&quot;;

import { useState, useEffect } from &quot;react&quot;;
import { useRouter } from &quot;next/navigation&quot;;
import ZoomMeeting from &quot;@/components/zoom/ZoomMeeting&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import { Card, CardContent, CardHeader, CardTitle } from &quot;@/components/ui/card&quot;;
import { ArrowLeft, Loader2 } from &quot;lucide-react&quot;;
import { toast } from &quot;react-hot-toast&quot;;
import axios from &quot;axios&quot;;
import Link from &quot;next/link&quot;;

interface ZoomMeetingDetails {
  id: string;
  topic: string;
  zoomMeetingId: string;
  startTime: string;
  status: string;
  duration: number;
  liveClass: {
    title: string;
    lecturer: {
      name: string | null;
      email: string;
    };
  };
}

export default function JoinMeetingPage({
  params,
}: {
  params: { meetingId: string };
}) {
  const router = useRouter();
  const [meeting, setMeeting] = useState<ZoomMeetingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch meeting details
  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<ZoomMeetingDetails>(
          `/api/zoom/meetings/${params.meetingId}`
        );
        setMeeting(response.data);
      } catch (error: any) {
        console.error(&quot;Error fetching meeting:&quot;, error);
        setError(
          error.response?.data || &quot;Failed to fetch meeting details&quot;
        );
        toast.error(&quot;Failed to fetch meeting details&quot;);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.meetingId) {
      fetchMeeting();
    }
  }, [params.meetingId]);

  const handleJoinSuccess = () => {
    toast.success(&quot;Successfully joined the meeting&quot;);
  };

  const handleJoinError = (error: any) => {
    console.error(&quot;Error joining meeting:&quot;, error);
    toast.error(&quot;Failed to join the meeting&quot;);
  };

  if (isLoading) {
    return (
      <div className=&quot;p-6&quot;>
        <div className=&quot;flex items-center space-x-2 mb-6&quot;>
          <Button variant=&quot;outline&quot; size=&quot;sm&quot; onClick={() => router.back()}>
            <ArrowLeft className=&quot;mr-2 h-4 w-4&quot; />
            Back
          </Button>
          <h1 className=&quot;text-2xl font-bold&quot;>Loading Meeting...</h1>
        </div>
        <div className=&quot;flex justify-center items-center h-[600px]&quot;>
          <Loader2 className=&quot;h-8 w-8 animate-spin&quot; />
        </div>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className=&quot;p-6&quot;>
        <div className=&quot;flex items-center space-x-2 mb-6&quot;>
          <Button variant=&quot;outline&quot; size=&quot;sm&quot; asChild>
            <Link href=&quot;/admin/zoom-meetings&quot;>
              <ArrowLeft className=&quot;mr-2 h-4 w-4&quot; />
              Back to Meetings
            </Link>
          </Button>
          <h1 className=&quot;text-2xl font-bold&quot;>Error</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className=&quot;text-red-600&quot;>Failed to Load Meeting</CardTitle>
          </CardHeader>
          <CardContent>
            <p className=&quot;mb-4&quot;>{error || &quot;Unable to load the meeting details.&quot;}</p>
            <Button onClick={() => router.push(&quot;/admin/zoom-meetings&quot;)}>
              Return to Meetings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className=&quot;p-6 space-y-6&quot;>
      <div className=&quot;flex items-center space-x-2 mb-6&quot;>
        <Button variant=&quot;outline&quot; size=&quot;sm&quot; asChild>
          <Link href=&quot;/admin/zoom-meetings&quot;>
            <ArrowLeft className=&quot;mr-2 h-4 w-4&quot; />
            Back to Meetings
          </Link>
        </Button>
        <h1 className=&quot;text-2xl font-bold&quot;>{meeting.topic}</h1>
      </div>

      <Card className=&quot;mb-6&quot;>
        <CardHeader>
          <CardTitle>Meeting Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className=&quot;grid grid-cols-1 md:grid-cols-2 gap-4&quot;>
            <div>
              <p className=&quot;text-sm text-muted-foreground&quot;>Class</p>
              <p className=&quot;font-medium&quot;>{meeting.liveClass.title}</p>
            </div>
            <div>
              <p className=&quot;text-sm text-muted-foreground&quot;>Host</p>
              <p className=&quot;font-medium&quot;>
                {meeting.liveClass.lecturer.name || meeting.liveClass.lecturer.email}
              </p>
            </div>
            <div>
              <p className=&quot;text-sm text-muted-foreground&quot;>Start Time</p>
              <p className=&quot;font-medium&quot;>
                {new Date(meeting.startTime).toLocaleString()}
              </p>
            </div>
            <div>
              <p className=&quot;text-sm text-muted-foreground&quot;>Duration</p>
              <p className=&quot;font-medium">{meeting.duration} minutes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zoom Meeting</CardTitle>
        </CardHeader>
        <CardContent>
          <ZoomMeeting
            meetingId={params.meetingId}
            onJoinSuccess={handleJoinSuccess}
            onJoinError={handleJoinError}
          />
        </CardContent>
      </Card>
    </div>
  );
} 