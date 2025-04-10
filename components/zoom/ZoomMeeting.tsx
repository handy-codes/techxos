"use client&quot;;

import React, { useEffect, useState, useRef } from &apos;react&apos;;
import axios from &apos;axios&apos;;
import { toast } from &apos;react-hot-toast&apos;;
import { Loader2 } from &apos;lucide-react&apos;;
import { useUser } from &apos;@clerk/nextjs&apos;;

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

  useEffect(() => {
    let isMounted = true;
    
    const loadZoomSDK = async () => {
      try {
        // Load Zoom Meeting SDK
        const ZoomMtgEmbedded = (await import(&apos;@zoom/meetingsdk/embedded&apos;)).default;
        
        // Initialize Zoom client
        const client = ZoomMtgEmbedded.createClient();
        
        if (zoomContainerRef.current) {
          // Prepare the container for embedding
          client.init({ 
            zoomAppRoot: zoomContainerRef.current,
            language: &apos;en-US&apos;,
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
              tk: &apos;&apos;,
              zak: &apos;&apos;
            });
            
            if (onJoinSuccess && isMounted) {
              onJoinSuccess();
            }
          }
        }
      } catch (err: any) {
        console.error(&apos;Failed to join Zoom meeting:&apos;, err);
        
        if (isMounted) {
          setError(err.message || &apos;Failed to join the meeting&apos;);
          
          if (onJoinError) {
            onJoinError(err);
          }
          
          toast.error(&apos;Failed to join the meeting. Please try again.&apos;);
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

  useEffect(() => {
    const fetchMeetingDetails = async () => {
      try {
        const response = await axios.get(`/api/zoom-meetings/${meetingId}`);
        setMeetingDetails(response.data);
      } catch (err: any) {
        console.error(&apos;Failed to fetch meeting details:&apos;, err);
        setError(err.message || &apos;Failed to fetch meeting details&apos;);
        toast.error(&apos;Failed to fetch meeting details. Please try again.&apos;);
      }
    };

    if (meetingId) {
      fetchMeetingDetails();
    }
  }, [meetingId]);

  const handleJoinViaUrl = () => {
    if (meetingDetails?.joinUrl) {
      window.open(meetingDetails.joinUrl, &apos;_blank&apos;);
    }
  };

  if (loading) {
    return (
      <div className=&quot;flex items-center justify-center min-h-[400px]&quot;>
        <Loader2 className=&quot;w-8 h-8 animate-spin&quot; />
      </div>
    );
  }

  if (error) {
    return (
      <div className=&quot;flex flex-col items-center justify-center min-h-[400px] space-y-4&quot;>
        <p className=&quot;text-red-500&quot;>{error}</p>
        <button
          onClick={handleJoinViaUrl}
          className=&quot;px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
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