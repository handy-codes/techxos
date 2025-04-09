"use client";

import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface ZoomMeetingProps {
  meetingId: string;
  onJoinSuccess?: () => void;
  onJoinError?: (error: any) => void;
}

export default function ZoomMeeting({ 
  meetingId, 
  onJoinSuccess, 
  onJoinError 
}: ZoomMeetingProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meetingDetails, setMeetingDetails] = useState<any>(null);
  const { user } = useUser();
  const zoomContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadZoomSDK = async () => {
      try {
        // Load Zoom Meeting SDK
        const ZoomMtgEmbedded = (await import('@zoomus/websdk/embedded')).default;
        
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
    };
    
    if (meetingDetails) {
      loadZoomSDK();
    }
    
    return () => {
      isMounted = false;
    };
  }, [meetingDetails, onJoinSuccess, onJoinError]);

  // Get meeting details and signature
  useEffect(() => {
    const fetchMeetingDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.post(`/api/zoom/meetings/${meetingId}/join`);
        setMeetingDetails(response.data);
      } catch (err: any) {
        console.error('Error fetching meeting details:', err);
        setError(err.response?.data || err.message || 'Failed to get meeting details');
        toast.error(err.response?.data || 'Failed to get meeting details');
      } finally {
        setLoading(false);
      }
    };
    
    if (meetingId) {
      fetchMeetingDetails();
    }
  }, [meetingId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] w-full bg-gray-50 rounded-lg">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Loading meeting...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[600px] w-full bg-gray-50 rounded-lg">
        <div className="text-center p-6">
          <h3 className="text-xl font-bold text-red-600 mb-2">Failed to join meeting</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Direct URL join option as fallback
  const handleJoinViaUrl = () => {
    if (meetingDetails?.joinUrl) {
      window.open(meetingDetails.joinUrl, '_blank');
    } else {
      toast.error('No join URL available');
    }
  };

  return (
    <div className="w-full">
      {/* Container for Zoom SDK to mount */}
      <div ref={zoomContainerRef} className="zoom-container min-h-[600px] w-full"></div>
      
      {/* Fallback for SDK issues */}
      {meetingDetails && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 mb-2">
            Having trouble with the embedded meeting?
          </p>
          <button
            onClick={handleJoinViaUrl}
            className="text-primary hover:underline text-sm"
          >
            Join via browser instead
          </button>
        </div>
      )}
    </div>
  );
} 