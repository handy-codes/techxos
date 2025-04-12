"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface ZoomMeetingProps {
  meetingId: string;
  onJoinSuccess?: () => void;
  onJoinError?: (error: any) => void;
}

const ZoomMeeting: React.FC<ZoomMeetingProps> = ({ 
  meetingId, 
  onJoinSuccess, 
  onJoinError 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meetingDetails, setMeetingDetails] = useState<any>(null);
  const { user } = useUser();
  const zoomContainerRef = useRef<HTMLDivElement>(null);

  const loadZoomSDK = useCallback(async () => {
    let isMounted = true;
    
    try {
      // Load Zoom Meeting SDK
      const ZoomMtgEmbedded = (await import('@zoom/meetingsdk/embedded')).default;
      
      // Initialize Zoom client
      const client = ZoomMtgEmbedded.createClient();
      
      if (zoomContainerRef.current) {
        // Prepare the container for embedding
        client.init({ 
          zoomAppRoot: zoomContainerRef.current,
          language: 'en-US',
          customize: {
            video: {
              isResizable: true,
              viewSizes: {
                default: {
                  width: 1000,
                  height: 600
                },
                ribbon: {
                  width: 300,
                  height: 700
                }
              }
            }
          }
        });
        
        // Join the meeting
        if (meetingDetails) {
          await client.join({
            sdkKey: process.env.NEXT_PUBLIC_ZOOM_SDK_KEY,
            signature: meetingDetails.signature,
            meetingNumber: meetingDetails.meetingNumber,
            password: meetingDetails.password,
            userName: meetingDetails.userName,
            userEmail: meetingDetails.userEmail,
            tk: '',
            zak: ''
          });
          
          if (onJoinSuccess && isMounted) {
            onJoinSuccess();
          }
        }
      }
    } catch (err: any) {
      console.error('Failed to join Zoom meeting:', err);
      
      if (isMounted) {
        setError(err.message || 'Failed to join the meeting');
        
        if (onJoinError) {
          onJoinError(err);
        }
        
        toast.error('Failed to join the meeting. Please try again.');
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
    
    return () => {
      isMounted = false;
    };
  }, [meetingDetails, onJoinSuccess, onJoinError]);

  useEffect(() => {
    if (meetingDetails) {
      loadZoomSDK();
    }
  }, [loadZoomSDK]);

  const fetchMeetingDetails = useCallback(async () => {
    try {
      const response = await axios.get(`/api/zoom-meetings/${meetingId}`);
      setMeetingDetails(response.data);
    } catch (err: any) {
      console.error('Failed to fetch meeting details:', err);
      setError(err.message || 'Failed to fetch meeting details');
      toast.error('Failed to fetch meeting details. Please try again.');
    }
  }, [meetingId]);

  useEffect(() => {
    if (meetingId) {
      fetchMeetingDetails();
    }
  }, [fetchMeetingDetails]);

  const handleJoinViaUrl = useCallback(() => {
    if (meetingDetails?.joinUrl) {
      window.open(meetingDetails.joinUrl, '_blank');
    }
  }, [meetingDetails]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={handleJoinViaUrl}
          className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Join via Browser
        </button>
      </div>
    );
  }

  return (
    <div>
      <div ref={zoomContainerRef} />
    </div>
  );
};

export { ZoomMeeting }; 