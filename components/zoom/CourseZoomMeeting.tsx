"use client&quot;;

import React, { useState, useEffect } from &apos;react&apos;;
import axios from &apos;axios&apos;;
import { toast } from &apos;react-hot-toast&apos;;
import { Loader2, Calendar, Clock, Users, Video, ExternalLink } from &apos;lucide-react&apos;;
import { Button } from &apos;@/components/ui/button&apos;;
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from &apos;@/components/ui/card&apos;;
import { formatDistanceToNow, format } from &apos;date-fns&apos;;
import Link from &apos;next/link&apos;;
import { useAuth } from &apos;@clerk/nextjs&apos;;

interface ZoomMeeting {
  id: string;
  topic: string;
  startTime: string;
  duration: number;
  status: string;
}

interface CourseZoomMeetingProps {
  liveClassId: string;
  className?: string;
}

export default function CourseZoomMeeting({ 
  liveClassId,
  className = &apos;&apos;
}: CourseZoomMeetingProps) {
  const [meetings, setMeetings] = useState<ZoomMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn } = useAuth();

  // Fetch upcoming meetings for this course
  useEffect(() => {
    const fetchMeetings = async () => {
      if (!isSignedIn) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`/api/zoom/meetings?liveClassId=${liveClassId}`);
        
        // Sort meetings by startTime
        const sortedMeetings = response.data.sort((a: ZoomMeeting, b: ZoomMeeting) => 
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
        
        setMeetings(sortedMeetings);
      } catch (err: any) {
        console.error(&apos;Error fetching meetings:&apos;, err);
        setError(err.response?.data || err.message || &apos;Failed to fetch meetings&apos;);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMeetings();
  }, [liveClassId, isSignedIn]);

  const joinMeeting = async (meetingId: string) => {
    try {
      const response = await axios.post(`/api/zoom/meetings/${meetingId}/join`);
      
      if (response.data.joinUrl) {
        window.open(response.data.joinUrl, &apos;_blank&apos;);
      } else {
        // For embedded version, redirect to the join page
        window.location.href = `/courses/live-classroom/${meetingId}`;
      }
    } catch (err: any) {
      console.error(&apos;Error joining meeting:&apos;, err);
      toast.error(err.response?.data || &apos;Failed to join meeting&apos;);
    }
  };
  
  const formatMeetingDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, &apos;PPP&apos;);
    } catch (error) {
      return dateString;
    }
  };
  
  const formatMeetingTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, &apos;p&apos;);
    } catch (error) {
      return dateString;
    }
  };
  
  const isUpcoming = (meeting: ZoomMeeting) => {
    return new Date(meeting.startTime) > new Date();
  };
  
  const isLive = (meeting: ZoomMeeting) => {
    const now = new Date();
    const start = new Date(meeting.startTime);
    const end = new Date(start.getTime() + meeting.duration * 60000);
    return now >= start && now <= end && meeting.status === &apos;STARTED&apos;;
  };
  
  const getStatusText = (meeting: ZoomMeeting) => {
    if (isLive(meeting)) {
      return &apos;LIVE NOW&apos;;
    } else if (isUpcoming(meeting)) {
      return `Starts ${formatDistanceToNow(new Date(meeting.startTime), { addSuffix: true })}`;
    } else {
      return &apos;Ended&apos;;
    }
  };
  
  const getStatusColor = (meeting: ZoomMeeting) => {
    if (isLive(meeting)) {
      return &apos;text-red-500 animate-pulse&apos;;
    } else if (isUpcoming(meeting)) {
      return &apos;text-blue-500&apos;;
    } else {
      return &apos;text-gray-500&apos;;
    }
  };
  
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Live Classes</CardTitle>
        </CardHeader>
        <CardContent className=&quot;flex justify-center py-8&quot;>
          <Loader2 className=&quot;h-8 w-8 animate-spin text-primary&quot; />
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Live Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className=&quot;text-red-500&quot;>Failed to load meetings</p>
        </CardContent>
      </Card>
    );
  }
  
  if (meetings.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Live Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className=&quot;text-muted-foreground&quot;>No upcoming meetings scheduled</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className=&quot;flex items-center&quot;>
          <Video className=&quot;h-5 w-5 mr-2&quot; />
          Live Classes
        </CardTitle>
      </CardHeader>
      <CardContent className=&quot;space-y-4&quot;>
        {meetings.map((meeting) => (
          <Card key={meeting.id} className=&quot;overflow-hidden&quot;>
            <CardHeader className=&quot;bg-muted/50 p-4&quot;>
              <CardTitle className=&quot;text-base flex justify-between items-center&quot;>
                <span>{meeting.topic}</span>
                <span className={`text-sm font-normal ${getStatusColor(meeting)}`}>
                  {getStatusText(meeting)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className=&quot;p-4 pt-3&quot;>
              <div className=&quot;grid grid-cols-2 gap-2 text-sm&quot;>
                <div className=&quot;flex items-center&quot;>
                  <Calendar className=&quot;h-4 w-4 mr-2 text-muted-foreground&quot; />
                  {formatMeetingDate(meeting.startTime)}
                </div>
                <div className=&quot;flex items-center&quot;>
                  <Clock className=&quot;h-4 w-4 mr-2 text-muted-foreground&quot; />
                  {formatMeetingTime(meeting.startTime)}
                </div>
                <div className=&quot;flex items-center col-span-2&quot;>
                  <Users className=&quot;h-4 w-4 mr-2 text-muted-foreground&quot; />
                  Duration: {meeting.duration} minutes
                </div>
              </div>
            </CardContent>
            <CardFooter className=&quot;p-4 pt-0 flex justify-end&quot;>
              {isLive(meeting) ? (
                <Button 
                  onClick={() => joinMeeting(meeting.id)}
                  className=&quot;bg-red-500 hover:bg-red-600 text-white&quot;
                >
                  Join Live Class
                </Button>
              ) : isUpcoming(meeting) ? (
                <Button variant=&quot;outline&quot; disabled>
                  Not Started Yet
                </Button>
              ) : (
                <Button variant=&quot;outline&quot; disabled>
                  Class Ended
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </CardContent>
      <CardFooter className=&quot;flex justify-center&quot;>
        <Link href={meetings.length > 0 && isLive(meetings[0]) 
          ? `/courses/live-classroom/${meetings[0].id}` 
          : &apos;#&apos;}>
          <Button 
            variant=&quot;ghost&quot; 
            className=&quot;text-sm&quot;
            disabled={meetings.length === 0 || !isLive(meetings[0])}
          >
            <ExternalLink className=&quot;h-4 w-4 mr-2" />
            Enter Classroom
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
} 