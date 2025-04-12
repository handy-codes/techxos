import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface JoinLiveClassButtonProps {
  courseId: string;
  courseName: string;
}

const JoinLiveClassButton: React.FC<JoinLiveClassButtonProps> = ({
  courseId,
  courseName,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleJoinClass = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/courses/${courseId}/join-live-class`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        if (response.status === 403) {
          toast.error('You need to purchase this course to join the live class');
          return;
        }
        if (response.status === 404) {
          const errorData = await response.json().catch(() => ({}));
          const message = errorData.message || 'No active class found';
          toast.error(message);
          return;
        }
        throw new Error('Failed to join the class');
      }
      
      const data = await response.json();
      
      if (data.zoomLink) {
        // Show meeting details in a toast
        if (data.zoomMeetingId && data.zoomPassword) {
          toast.success(
            `Meeting ID: ${data.zoomMeetingId}\nPassword: ${data.zoomPassword}`, 
            { duration: 10000 } // Show for 10 seconds
          );
        }

        // Open the zoom link in a new tab
        window.open(data.zoomLink, '_blank');
        
        // Show success message
        toast.success(data.message || `Successfully ${data.isHost ? 'started' : 'joined'} ${courseName} live class!`);
      } else {
        toast.error('No zoom link available for this class');
      }
    } catch (error) {
      console.error('Error joining live class:', error);
      toast.error('Failed to join the class. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleJoinClass}
      disabled={isLoading}
      className="inline-block text-white bg-blue-600 px-6 py-3 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
    >
      {isLoading ? 'Joining...' : 'Join Live Class'}
    </button>
  );
};

export default JoinLiveClassButton; 