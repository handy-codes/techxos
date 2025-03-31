import React, { useEffect } from 'react';
import { UserRole, ZoomPermissions } from '../types/roles';
import { defaultZoomPermissions } from '../utils/permissions';

interface ZoomMeetingProps {
  meetingId: string;
  userRole: UserRole;
}

export const ZoomMeeting: React.FC<ZoomMeetingProps> = ({ meetingId, userRole }) => {
  const permissions = defaultZoomPermissions[userRole];

  useEffect(() => {
    const initializeZoom = async () => {
      try {
        // Initialize Zoom client
        const { ZoomMtg } = await import('@zoomus/websdk');
        
        ZoomMtg.init({
          leaveUrl: window.location.origin,
          success: (success: any) => {
            console.log('Zoom initialized:', success);
            joinMeeting();
          },
          error: (error: any) => {
            console.error('Failed to initialize Zoom:', error);
          }
        });
      } catch (error) {
        console.error('Error loading Zoom:', error);
      }
    };

    const joinMeeting = async () => {
      try {
        const response = await fetch('/api/meetings/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ meetingId }),
        });
        
        const { joinUrl } = await response.json();
        
        // Join the meeting with appropriate permissions
        ZoomMtg.join({
          meetingNumber: meetingId,
          userName: 'Your Name',
          userEmail: 'your.email@example.com',
          passWord: 'meeting_password',
          tk: joinUrl,
          success: (success: any) => {
            console.log('Joined meeting:', success);
          },
          error: (error: any) => {
            console.error('Failed to join meeting:', error);
          }
        });
      } catch (error) {
        console.error('Error joining meeting:', error);
      }
    };

    initializeZoom();
  }, [meetingId, userRole]);

  return (
    <div className="zoom-meeting-container">
      <div id="zmmtg-root"></div>
    </div>
  );
}; 