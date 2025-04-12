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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to join the class');
      }
      
      const data = await response.json();
      
      // Open the zoom link in a new tab
      if (data.zoomLink) {
        window.open(data.zoomLink, '_blank');
        toast.success(`Successfully joined ${courseName} live class!`);
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