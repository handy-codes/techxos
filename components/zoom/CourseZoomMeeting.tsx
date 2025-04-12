"use client";

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Loader2, Calendar, Clock, Users, Video, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDistanceToNow, format } from 'date-fns';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';

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
  className = ''
}: CourseZoomMeetingProps) {
  const [meetings, setMeetings] = useState<ZoomMeeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isSignedIn } = useAuth();

  const fetchMeetings = useCallback(async () => {
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
      console.error('Error fetching meetings:', err);
      setError(err.response?.data || err.message || 'Failed to fetch meetings');
    } finally {
      setLoading(false);
    }
  }, [liveClassId, isSignedIn]);

  // Fetch upcoming meetings for this course
  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

  const joinMeeting = useCallback(async (meetingId: string) => {
    try {
      const response = await axios.post(`/api/zoom/meetings/${meetingId}/join`);
      window.open(response.data.joinUrl, '_blank');
    } catch (err: any) {
      console.error('Error joining meeting:', err);
      toast.error(err.response?.data || err.message || 'Failed to join meeting');
    }
  }, []);

  const formatMeetingDate = useCallback((date: string) => {
    return format(new Date(date), 'EEEE, MMMM d, yyyy');
  }, []);

  const formatMeetingTime = useCallback((date: string) => {
    return format(new Date(date), 'h:mm a');
  }, []);

  const isUpcoming = useCallback((startTime: string) => {
    return new Date(startTime) > new Date();
  }, []);

  const isLive = useCallback((startTime: string, duration: number) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(start.getTime() + duration * 60000);
    return now >= start && now <= end;
  }, []);

  const getStatusText = useCallback((startTime: string, duration: number) => {
    if (isLive(startTime, duration)) return 'Live Now';
    if (isUpcoming(startTime)) return 'Upcoming';
    return 'Past';
  }, [isLive, isUpcoming]);

  const getStatusColor = useCallback((startTime: string, duration: number) => {
    if (isLive(startTime, duration)) return 'text-green-500';
    if (isUpcoming(startTime)) return 'text-blue-500';
    return 'text-gray-500';
  }, [isLive, isUpcoming]);
  
  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Live Classes</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
          <p className="text-red-500">Failed to load meetings</p>
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
          <p className="text-muted-foreground">No upcoming meetings scheduled</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Video className="h-5 w-5 mr-2" />
          Live Classes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {meetings.map((meeting) => (
          <Card key={meeting.id} className="overflow-hidden">
            <CardHeader className="bg-muted/50 p-4">
              <CardTitle className="text-base flex justify-between items-center">
                <span>{meeting.topic}</span>
                <span className={`text-sm font-normal ${getStatusColor(meeting.startTime, meeting.duration)}`}>
                  {getStatusText(meeting.startTime, meeting.duration)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  {formatMeetingDate(meeting.startTime)}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  {formatMeetingTime(meeting.startTime)}
                </div>
                <div className="flex items-center col-span-2">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  Duration: {meeting.duration} minutes
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-end">
              {isLive(meeting.startTime, meeting.duration) ? (
                <Button 
                  onClick={() => joinMeeting(meeting.id)}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  Join Live Class
                </Button>
              ) : isUpcoming(meeting.startTime) ? (
                <Button variant="outline" disabled>
                  Not Started Yet
                </Button>
              ) : (
                <Button variant="outline" disabled>
                  Class Ended
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </CardContent>
      <CardFooter className="flex justify-center">
        <Link href={meetings.length > 0 && isLive(meetings[0].startTime, meetings[0].duration) 
          ? `/courses/live-classroom/${meetings[0].id}` 
          : '#'}>
          <Button 
            variant="ghost" 
            className="text-sm"
            disabled={meetings.length === 0 || !isLive(meetings[0].startTime, meetings[0].duration)}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Enter Classroom
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
} 