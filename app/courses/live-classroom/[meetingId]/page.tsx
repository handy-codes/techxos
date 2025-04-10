"use client&quot;;

import { useState, useEffect } from &quot;react&quot;;
import { useRouter } from &quot;next/navigation&quot;;
import { useUser } from &quot;@/hooks/use-user&quot;;
import axios from &quot;axios&quot;;
import { toast } from &quot;react-hot-toast&quot;;
import { format, isPast, isAfter, addMinutes } from &quot;date-fns&quot;;
import { ZoomMeeting } from &quot;@/components/zoom/ZoomMeeting&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import { AlertCircle, ArrowLeft, Clock } from &quot;lucide-react&quot;;
import { Skeleton } from &quot;@/components/ui/skeleton&quot;;
import { Alert, AlertDescription, AlertTitle } from &quot;@/components/ui/alert&quot;;

interface ZoomMeetingDetails {
  id: string;
  topic: string;
  zoomMeetingId: string;
  startTime: string;
  status: string;
  duration: number;
  liveClass: {
    id: string;
    title: string;
    lecturer: {
      name: string;
      email: string;
    };
  };
}

export default function ClassroomPage({ params }: { params: { meetingId: string } }) {
  const router = useRouter();
  const { user, isLoading: isUserLoading } = useUser();
  const [meeting, setMeeting] = useState<ZoomMeetingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meetingStatus, setMeetingStatus] = useState<&apos;not_started&apos; | &apos;live&apos; | &apos;ended&apos; | null>(null);

  useEffect(() => {
    if (isUserLoading) return;
    
    if (!user) {
      toast.error(&quot;You must be signed in to join meetings&quot;);
      router.push(&quot;/sign-in&quot;);
      return;
    }

    fetchMeetingDetails();
  }, [user, isUserLoading, params.meetingId, router]);

  const fetchMeetingDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/zoom/meetings/${params.meetingId}`);
      const meetingData = response.data;
      setMeeting(meetingData);
      
      // Determine meeting status
      const now = new Date();
      const startTime = new Date(meetingData.startTime);
      const endTime = addMinutes(startTime, meetingData.duration);
      
      if (isAfter(now, endTime)) {
        setMeetingStatus(&apos;ended&apos;);
      } else if (isAfter(now, startTime)) {
        setMeetingStatus(&apos;live&apos;);
      } else {
        setMeetingStatus(&apos;not_started&apos;);
      }
      
    } catch (error) {
      console.error(&quot;Error fetching meeting details:&quot;, error);
      setError(&quot;Failed to load meeting details. The meeting may not exist.&quot;);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinSuccess = () => {
    toast.success(&quot;Successfully joined the meeting&quot;);
  };

  const handleJoinError = (error: any) => {
    console.error(&quot;Error joining meeting:&quot;, error);
    toast.error(&quot;Failed to join the meeting. Please try again.&quot;);
  };

  if (isUserLoading || isLoading) {
    return (
      <div className=&quot;space-y-6 p-6&quot;>
        <Skeleton className=&quot;h-10 w-1/2&quot; />
        <Skeleton className=&quot;h-4 w-1/3&quot; />
        <Skeleton className=&quot;h-[400px] w-full mt-6&quot; />
      </div>
    );
  }

  if (error) {
    return (
      <div className=&quot;p-6 space-y-6&quot;>
        <Alert variant=&quot;destructive&quot;>
          <AlertCircle className=&quot;h-4 w-4&quot; />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          variant=&quot;outline&quot; 
          onClick={() => router.push(&quot;/courses&quot;)}
          className=&quot;mt-4&quot;
        >
          <ArrowLeft className=&quot;mr-2 h-4 w-4&quot; /> Back to Courses
        </Button>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className=&quot;p-6 space-y-6&quot;>
        <Alert>
          <AlertCircle className=&quot;h-4 w-4&quot; />
          <AlertTitle>Meeting Not Found</AlertTitle>
          <AlertDescription>
            The meeting you&apos;re looking for could not be found. It may have been deleted or you don&apos;t have permission to access it.
          </AlertDescription>
        </Alert>
        <Button 
          variant=&quot;outline&quot; 
          onClick={() => router.push(&quot;/courses&quot;)}
          className=&quot;mt-4&quot;
        >
          <ArrowLeft className=&quot;mr-2 h-4 w-4&quot; /> Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <div className=&quot;p-6 space-y-6&quot;>
      <div>
        <h1 className=&quot;text-2xl font-bold&quot;>{meeting.topic}</h1>
        <p className=&quot;text-muted-foreground&quot;>
          {meeting.liveClass.title} • {meeting.liveClass.lecturer.name}
        </p>
      </div>

      {meetingStatus === &apos;not_started&apos; && (
        <Alert className=&quot;bg-blue-50 border-blue-200 text-blue-800&quot;>
          <Clock className=&quot;h-4 w-4 text-blue-600&quot; />
          <AlertTitle>Meeting Not Started Yet</AlertTitle>
          <AlertDescription className=&quot;text-blue-700&quot;>
            This meeting is scheduled to start at {format(new Date(meeting.startTime), &quot;PPP &apos;at&apos; p&quot;)}. 
            You can wait on this page and it will automatically connect when the meeting begins.
          </AlertDescription>
        </Alert>
      )}

      {meetingStatus === &apos;ended&apos; && (
        <Alert className=&quot;bg-amber-50 border-amber-200 text-amber-800&quot;>
          <AlertCircle className=&quot;h-4 w-4 text-amber-600&quot; />
          <AlertTitle>Meeting Has Ended</AlertTitle>
          <AlertDescription className=&quot;text-amber-700&quot;>
            This meeting has already ended. Check your course page for recordings or future meetings.
          </AlertDescription>
        </Alert>
      )}

      {meetingStatus !== &apos;ended&apos; && (
        <div className=&quot;mt-6 border rounded-lg overflow-hidden min-h-[500px] bg-gray-50&quot;>
          <ZoomMeeting
            meetingId={meeting.id}
            onJoinSuccess={handleJoinSuccess}
            onJoinError={handleJoinError}
          />
        </div>
      )}

      <div className=&quot;flex items-center justify-between mt-6&quot;>
        <Button 
          variant=&quot;outline&quot; 
          onClick={() => router.push(&quot;/courses&quot;)}
        >
          <ArrowLeft className=&quot;mr-2 h-4 w-4" /> Back to Courses
        </Button>
      </div>
    </div>
  );
} 