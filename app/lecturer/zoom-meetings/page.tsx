"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "react-hot-toast";
import { format, isToday, isTomorrow, isYesterday, formatDistance } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, Video, Edit, Trash2, Play, Square } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ZoomMeeting {
  id: string;
  zoomMeetingId: string;
  topic: string;
  startTime: string;
  duration: number;
  status: "SCHEDULED" | "STARTED" | "ENDED" | "COMPLETED";
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
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/lecturer/zoom-meetings");
      setMeetings(response.data);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      toast.error("Could not load meetings");
    } finally {
      setLoading(false);
    }
  };

  const startMeeting = async (meetingId: string) => {
    try {
      await axios.post(`/api/zoom/meetings/${meetingId}/start`);
      toast.success("Meeting started");
      router.push(`/lecturer/zoom-meetings/${meetingId}/host`);
    } catch (error) {
      console.error("Error starting meeting:", error);
      toast.error("Failed to start meeting");
    }
  };

  const endMeeting = async (meetingId: string) => {
    try {
      await axios.post(`/api/zoom/meetings/${meetingId}/end`);
      toast.success("Meeting ended");
      fetchMeetings(); // Refresh the list
    } catch (error) {
      console.error("Error ending meeting:", error);
      toast.error("Failed to end meeting");
    }
  };

  const deleteMeeting = async (meetingId: string) => {
    if (!confirm("Are you sure you want to delete this meeting?")) return;
    
    try {
      await axios.delete(`/api/zoom/meetings/${meetingId}`);
      toast.success("Meeting deleted");
      fetchMeetings(); // Refresh the list
    } catch (error) {
      console.error("Error deleting meeting:", error);
      toast.error("Failed to delete meeting");
    }
  };

  const formatMeetingDate = (dateString: string) => {
    const date = new Date(dateString);
    
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else if (isTomorrow(date)) {
      return `Tomorrow at ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, yyyy • h:mm a');
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
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800";
      case "STARTED":
        return "bg-green-100 text-green-800";
      case "ENDED":
      case "COMPLETED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const upcomingMeetings = meetings.filter(meeting => 
    meeting.status === "SCHEDULED"
  );
  
  const liveMeetings = meetings.filter(meeting => 
    meeting.status === "STARTED"
  );
  
  const pastMeetings = meetings.filter(meeting => 
    meeting.status === "ENDED" || meeting.status === "COMPLETED"
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-40" />
        </div>
        
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Zoom Meetings</h1>
        <Link href="/lecturer/zoom-meetings/new">
          <Button>
            <Video className="mr-2 h-4 w-4" />
            Schedule New Meeting
          </Button>
        </Link>
      </div>
      
      <Tabs defaultValue="upcoming" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingMeetings.length})
          </TabsTrigger>
          <TabsTrigger value="live">
            Live Now ({liveMeetings.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastMeetings.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingMeetings.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No upcoming meetings scheduled</p>
                <Link href="/lecturer/zoom-meetings/new">
                  <Button variant="outline" className="mt-4">
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
                    <TableCell className="font-medium">{meeting.topic}</TableCell>
                    <TableCell>{meeting.liveClass.title}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{formatMeetingDate(meeting.startTime)}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatRelativeTime(meeting.startTime)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{meeting.duration} min</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => startMeeting(meeting.id)}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => router.push(`/lecturer/zoom-meetings/${meeting.id}/edit`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteMeeting(meeting.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>
        
        <TabsContent value="live" className="space-y-4">
          {liveMeetings.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No meetings are currently live</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {liveMeetings.map((meeting) => (
                <Card key={meeting.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className={getMeetingStatusColor(meeting.status)}>
                          LIVE NOW
                        </Badge>
                        <CardTitle className="mt-2">{meeting.topic}</CardTitle>
                        <CardDescription>{meeting.liveClass.title}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        {formatMeetingDate(meeting.startTime)}
                      </div>
                      <div className="flex items-center text-sm">
                        <Clock className="h-4 w-4 mr-2" />
                        {meeting.duration} minutes
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        className="flex-1"
                        onClick={() => router.push(`/lecturer/zoom-meetings/${meeting.id}/host`)}
                      >
                        Join Now
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => endMeeting(meeting.id)}
                      >
                        <Square className="h-4 w-4" />
                        End
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          {pastMeetings.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No past meetings found</p>
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
                    <TableCell className="font-medium">{meeting.topic}</TableCell>
                    <TableCell>{meeting.liveClass.title}</TableCell>
                    <TableCell>{formatMeetingDate(meeting.startTime)}</TableCell>
                    <TableCell>
                      <Badge className={getMeetingStatusColor(meeting.status)}>
                        {meeting.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Link href={`/lecturer/zoom-meetings/${meeting.id}/recordings`}>
                          <Button size="sm" variant="outline">
                            Recordings
                          </Button>
                        </Link>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => deleteMeeting(meeting.id)}
                        >
                          <Trash2 className="h-4 w-4" />
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