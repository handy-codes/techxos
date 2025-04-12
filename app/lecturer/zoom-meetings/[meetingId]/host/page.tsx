"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { ZoomMeeting } from "@/components/zoom/ZoomMeeting";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Users, Clock, ChevronLeft, Square } from "lucide-react";
import Link from "next/link";

interface ZoomMeetingDetails {
  id: string;
  zoomMeetingId: string;
  topic: string;
  startTime: string;
  duration: number;
  status: "SCHEDULED" | "STARTED" | "ENDED" | "COMPLETED";
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
  const router = useRouter();
  const { user } = useUser();

  const fetchMeetingDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/zoom/meetings/${params.meetingId}`);
      setMeeting(response.data);
    } catch (error) {
      console.error("Error fetching meeting:", error);
      toast.error("Could not load meeting details");
    } finally {
      setLoading(false);
    }
  }, [params.meetingId]);

  useEffect(() => {
    fetchMeetingDetails();
  }, [fetchMeetingDetails]);

  const endMeeting = async () => {
    try {
      await axios.post(`/api/zoom/meetings/${params.meetingId}/end`);
      toast.success("Meeting ended");
      router.push("/lecturer/zoom-meetings");
    } catch (error) {
      console.error("Error ending meeting:", error);
      toast.error("Failed to end meeting");
    }
  };

  const handleJoinSuccess = () => {
    toast.success("Successfully joined the meeting");
  };

  const handleJoinError = (error: any) => {
    console.error("Join error:", error);
    toast.error("Failed to join the meeting");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="space-y-6">
        <Link href="/lecturer/zoom-meetings">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to meetings
          </Button>
        </Link>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Meeting not found</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => router.push("/lecturer/zoom-meetings")}
            >
              Return to Meetings List
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Link href="/lecturer/zoom-meetings">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to meetings
          </Button>
        </Link>
        <Button 
          variant="destructive" 
          size="sm"
          onClick={endMeeting}
        >
          <Square className="mr-2 h-4 w-4" /> End Meeting
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card className="overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <Badge className="bg-green-100 text-green-800 mb-2">LIVE</Badge>
                  <CardTitle>{meeting.topic}</CardTitle>
                  <CardDescription>{meeting.liveClass.title}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[500px] bg-black relative">
                <ZoomMeeting 
                  meetingId={meeting.id} 
                  onJoinSuccess={handleJoinSuccess}
                  onJoinError={handleJoinError}
                />
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 flex justify-between items-center p-4">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{format(new Date(meeting.startTime), "MMM d, yyyy • h:mm a")}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span className="text-sm">{meeting.duration} minutes</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
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
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-1">Zoom Meeting ID</h3>
                <p className="text-sm">{meeting.zoomMeetingId || "Not available"}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-1">Password</h3>
                <p className="text-sm">{meeting.password || "No password set"}</p>
              </div>

              {meeting.agenda && (
                <div>
                  <h3 className="text-sm font-medium mb-1">Agenda</h3>
                  <p className="text-sm whitespace-pre-line">{meeting.agenda}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium mb-1">Host</h3>
                <p className="text-sm">{meeting.liveClass.lecturer.name || meeting.liveClass.lecturer.email}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Participants
              </CardTitle>
            </CardHeader>
            <CardContent>
              {meeting.attendance && meeting.attendance.length > 0 ? (
                <ul className="space-y-2">
                  {meeting.attendance.map((attendee) => (
                    <li key={attendee.id} className="flex justify-between items-center text-sm">
                      <span>{attendee.user.name || attendee.user.email}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(attendee.joinTime), "h:mm a")}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No participants have joined yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 