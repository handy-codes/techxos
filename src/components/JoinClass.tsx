import React from 'react';
import { UserRole } from '../types/roles';

interface JoinClassProps {
  meetingId: string;
  userRole: UserRole;
}

const JoinClass: React.FC<JoinClassProps> = ({ meetingId, userRole }) => {
  const joinMeeting = async () => {
    try {
      // First, get join URL with proper permissions
      const response = await fetch('/api/meetings/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meetingId,
          role: userRole
        })
      });

      const { joinUrl } = await response.json();

      // Initialize Zoom client
      const { ZoomMtg } = await import('@zoomus/websdk');
      
      ZoomMtg.init({
        leaveUrl: window.location.origin,
        success: () => {
          // Join with appropriate permissions
          ZoomMtg.join({
            meetingNumber: meetingId,
            userName: 'Student Name', // Get from user profile
            userEmail: 'student@email.com', // Get from user profile
            password: '', // Meeting password if required
            tk: joinUrl,
            success: () => {
              console.log('Joined successfully');
            },
            error: (error: any) => {
              console.error('Failed to join:', error);
            }
          });
        }
      });
    } catch (error) {
      console.error('Error joining class:', error);
    }
  };

  return (
    <div className="p-4">
      <h2>Join Class</h2>
      <button 
        onClick={joinMeeting}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Join Now
      </button>
    </div>
  );
}; 