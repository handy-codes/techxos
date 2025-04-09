"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ZoomMeeting from "@/components/zoom/ZoomMeeting";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import Link from "next/link";

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
        console.error("Error fetching meeting:", error);
        setError(
          error.response?.data || "Failed to fetch meeting details"
        );
        toast.error("Failed to fetch meeting details");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.meetingId) {
      fetchMeeting();
    }
  }, [params.meetingId]);

  const handleJoinSuccess = () => {
    toast.success("Successfully joined the meeting");
  };

  const handleJoinError = (error: any) => {
    console.error("Error joining meeting:", error);
    toast.error("Failed to join the meeting");
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Loading Meeting...</h1>
        </div>
        <div className="flex justify-center items-center h-[600px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !meeting) {
    return (
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/zoom-meetings">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Meetings
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Error</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Failed to Load Meeting</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{error || "Unable to load the meeting details."}</p>
            <Button onClick={() => router.push("/admin/zoom-meetings")}>
              Return to Meetings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/zoom-meetings">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Meetings
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{meeting.topic}</h1>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Meeting Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Class</p>
              <p className="font-medium">{meeting.liveClass.title}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Host</p>
              <p className="font-medium">
                {meeting.liveClass.lecturer.name || meeting.liveClass.lecturer.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Start Time</p>
              <p className="font-medium">
                {new Date(meeting.startTime).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Duration</p>
              <p className="font-medium">{meeting.duration} minutes</p>
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