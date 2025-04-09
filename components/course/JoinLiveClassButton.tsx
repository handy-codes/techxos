"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

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
      toast.error("Please sign in to join the class");
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
        window.open(response.data.zoomLink, "_blank");
        toast.success("Joining live class...");
      } else {
        toast.error("No active class link available. Please contact support.");
      }
    } catch (error: any) {
      console.error("Error joining live class:", error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        toast.error("Please sign in to join the class");
      } else if (error.response?.status === 403) {
        toast.error("You need to purchase this course to join the live class");
      } else if (error.response?.status === 404) {
        toast.error("No active class found for this course");
      } else {
        toast.error("Failed to join the class. Please try again.");
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
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Joining...
        </>
      ) : (
        "Join Live Class"
      )}
    </Button>
  );
} 