"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

interface ZoomMeetingProps {
  meetingId: string;
  onJoinSuccess?: () => void;
  onJoinError?: (error: any) => void;
}

declare global {
  interface Window {
    ZoomMtgEmbed: {
      createClient: () => any;
      setZoomJSLib: (lib: any, version: string) => void;
      preLoadWasm: () => void;
      prepareWebSDK: (config: any) => void;
      init: (config: any) => void;
      join: (config: any) => void;
      leaveMeeting: () => void;
      on: (event: string, callback: (data: any) => void) => void;
    };
  }
}

const ZoomMeeting: React.FC<ZoomMeetingProps> = ({ 
  meetingId, 
  onJoinSuccess, 
  onJoinError 
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [meetingDetails, setMeetingDetails] = useState<any>(null);
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
    let isMounted = true;

    const initializeZoom = async () => {
      if (!meetingDetails?.joinUrl) return;

      try {
        await loadZoomSDK();
        if (!isMounted) return;

        const client = await window.ZoomMtgEmbed.createClient();
        await client.init({
          debug: false,
          zoomAppRoot: document.getElementById('zoom-root'),
          language: 'en-US',
          customize: {
            meetingInfo: ['topic', 'host', 'mn', 'pwd', 'telPwd', 'invite', 'participant', 'dc', 'enctype'],
            toolbar: {
              buttons: [
                {
                  text: 'Custom Button',
                  className: 'CustomButton',
                  onClick: () => {
                    console.log('custom button');
                  }
                }
              ]
            }
          }
        });

        client.on('meeting-joined', () => {
          if (onJoinSuccess) onJoinSuccess();
        });

        client.on('meeting-error', (error: any) => {
          console.error('Zoom meeting error:', error);
          if (onJoinError) onJoinError(error);
        });

        await client.join({
          sdkKey: process.env.NEXT_PUBLIC_ZOOM_SDK_KEY,
          signature: '', // This will be generated on the server
          meetingNumber: meetingDetails.zoomMeetingId,
          userName: 'Student',
          userEmail: '',
          passWord: meetingDetails.password || '',
        });
      } catch (error) {
        console.error('Error initializing Zoom:', error);
        if (onJoinError) onJoinError(error);
      }
    };

    initializeZoom();

    return () => {
      isMounted = false;
    };
  }, [meetingDetails, onJoinSuccess, onJoinError, loadZoomSDK]);

  useEffect(() => {
    if (meetingDetails) {
      loadZoomSDK();
    }
  }, [meetingDetails, loadZoomSDK]);

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
  }, [meetingId, fetchMeetingDetails]);

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