"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import axios from "axios";
import { toast } from "react-hot-toast";
import { format, isPast, isAfter, addMinutes } from "date-fns";
import { ZoomMeeting } from "@/components/zoom/ZoomMeeting";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

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
  const { user, isLoaded: isUserLoaded } = useUser();
  const [meeting, setMeeting] = useState<ZoomMeetingDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meetingStatus, setMeetingStatus] = useState<'not_started' | 'live' | 'ended' | null>(null);

  const fetchMeetingDetails = useCallback(async () => {
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
        setMeetingStatus('ended');
      } else if (isAfter(now, startTime)) {
        setMeetingStatus('live');
      } else {
        setMeetingStatus('not_started');
      }
      
    } catch (error) {
      console.error("Error fetching meeting details:", error);
      setError("Failed to load meeting details. The meeting may not exist.");
    } finally {
      setIsLoading(false);
    }
  }, [params.meetingId]);

  useEffect(() => {
    if (!isUserLoaded) return;
    
    if (!user) {
      toast.error("You must be signed in to join meetings");
      router.push("/sign-in");
      return;
    }

    fetchMeetingDetails();
  }, [user, isUserLoaded, fetchMeetingDetails, router]);

  const handleJoinSuccess = () => {
    toast.success("Successfully joined the meeting");
  };

  const handleJoinError = (error: any) => {
    console.error("Error joining meeting:", error);
    toast.error("Failed to join the meeting. Please try again.");
  };

  if (!isUserLoaded || isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-[400px] w-full mt-6" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 space-y-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          onClick={() => router.push("/courses")}
          className="mt-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
        </Button>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="p-6 space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Meeting Not Found</AlertTitle>
          <AlertDescription>
            The meeting you&apos;re looking for could not be found. It may have been deleted or you don&apos;t have permission to access it.
          </AlertDescription>
        </Alert>
        <Button 
          variant="outline" 
          onClick={() => router.push("/courses")}
          className="mt-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{meeting.topic}</h1>
        <p className="text-muted-foreground">
          {meeting.liveClass.title} • {meeting.liveClass.lecturer.name}
        </p>
      </div>

      {meetingStatus === 'not_started' && (
        <Alert className="bg-blue-50 border-blue-200 text-blue-800">
          <Clock className="h-4 w-4 text-blue-600" />
          <AlertTitle>Meeting Not Started Yet</AlertTitle>
          <AlertDescription className="text-blue-700">
            This meeting is scheduled to start at {format(new Date(meeting.startTime), "PPP 'at' p")}. 
            You can wait on this page and it will automatically connect when the meeting begins.
          </AlertDescription>
        </Alert>
      )}

      {meetingStatus === 'ended' && (
        <Alert className="bg-amber-50 border-amber-200 text-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle>Meeting Has Ended</AlertTitle>
          <AlertDescription className="text-amber-700">
            This meeting has already ended. Check your course page for recordings or future meetings.
          </AlertDescription>
        </Alert>
      )}

      {meetingStatus !== 'ended' && (
        <div className="mt-6 border rounded-lg overflow-hidden min-h-[500px] bg-gray-50">
          <ZoomMeeting
            meetingId={meeting.id}
            onJoinSuccess={handleJoinSuccess}
            onJoinError={handleJoinError}
          />
        </div>
      )}

      <div className="flex items-center justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={() => router.push("/courses")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
        </Button>
      </div>
    </div>
  );
} 