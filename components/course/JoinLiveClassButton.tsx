"use client&quot;;

import { useState } from &quot;react&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import { useAuth } from &quot;@clerk/nextjs&quot;;
import axios from &quot;axios&quot;;
import { toast } from &quot;react-hot-toast&quot;;
import { Loader2 } from &quot;lucide-react&quot;;

interface JoinLiveClassButtonProps {
  courseId: string;
  courseName: string;
  className?: string;
}

export default function JoinLiveClassButton({
  courseId,
  courseName,
  className,
}: JoinLiveClassButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { isSignedIn } = useAuth();

  const handleJoinClass = async () => {
    if (!isSignedIn) {
      toast.error(&quot;Please sign in to join the class&quot;);
      return;
    }

    try {
      setIsLoading(true);
      
      // Call the API to get the Zoom link and verify access
      const response = await axios.get(`/api/courses/${courseId}/join-live-class`);
      
      if (response.data.error) {
        toast.error(response.data.error);
        return;
      }

      if (response.data.zoomLink) {
        // Open the Zoom link in a new tab
        window.open(response.data.zoomLink, &quot;_blank&quot;);
        toast.success(&quot;Joining live class...&quot;);
      } else {
        toast.error(&quot;No active class link available. Please contact support.&quot;);
      }
    } catch (error: any) {
      console.error(&quot;Error joining live class:&quot;, error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        toast.error(&quot;Please sign in to join the class&quot;);
      } else if (error.response?.status === 403) {
        toast.error(&quot;You need to purchase this course to join the live class&quot;);
      } else if (error.response?.status === 404) {
        toast.error(&quot;No active class found for this course&quot;);
      } else {
        toast.error(&quot;Failed to join the class. Please try again.&quot;);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleJoinClass}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className=&quot;mr-2 h-4 w-4 animate-spin&quot; />
          Joining...
        </>
      ) : (
        &quot;Join Live Class"
      )}
    </Button>
  );
} 