"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Loader2, Play } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface CourseActionButtonProps {
  courseType: "project-mgt" | "web-dev" | "ui-ux";
  purchaseButtonText?: string;
  joinButtonText?: string;
  variant?: "default" | "outline" | "destructive" | "ghost" | "link" | "secondary";
  className?: string;
  onSuccess?: () => void;
}

export const CourseActionButton = ({
  courseType,
  purchaseButtonText = "Enroll Now",
  joinButtonText = "Join Live Class",
  variant = "default",
  className = "",
  onSuccess
}: CourseActionButtonProps) => {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isPurchased, setIsPurchased] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Fetch user role and purchase status
  useEffect(() => {
    if (!isSignedIn) {
      setIsChecking(false);
      return;
    }

    const checkUserAccess = async () => {
      try {
        // Try the role API first (normal flow)
        try {
          const roleResponse = await axios.get('/api/user/role');
          const role = roleResponse.data.role;
          setUserRole(role);
          
          // Check if user is admin or lecturer
          const isAdminOrLecturer = 
            role === 'HEAD_ADMIN' || 
            role === 'ADMIN' || 
            role === 'LECTURER';
          
          setIsAdmin(isAdminOrLecturer);
          
          // If admin, we're done
          if (isAdminOrLecturer) {
            setIsChecking(false);
            return;
          }
        } catch (error) {
          console.error("Error fetching user role from API:", error);
          
          // If API fails, check if user email matches HEAD_ADMIN email in sync file
          try {
            // User is signed in but role API failed - try fallback method
            const syncResponse = await fetch('/role-sync.json');
            if (syncResponse.ok) {
              const syncData = await syncResponse.json();
              
              // Check if current user's email matches the admin email
              if (user?.primaryEmailAddress?.emailAddress === syncData.adminEmail) {
                console.log("User email matches admin email in sync file");
                setIsAdmin(true);
                setUserRole('HEAD_ADMIN');
                setIsChecking(false);
                return;
              }
            }
          } catch (syncError) {
            console.error("Error checking role sync file:", syncError);
          }
        }

        // If not admin or can't determine role, check if course is purchased
        try {
          // Try to get lecture info - will throw error if not purchased
          const lectureResponse = await axios.get(`/api/live-courses/${courseType}/lecture`);
          setIsPurchased(true);
        } catch (error) {
          console.log("User has not purchased this course");
          setIsPurchased(false);
        }
      } catch (error) {
        console.error("Error checking user access:", error);
      } finally {
        setIsChecking(false);
      }
    };

    checkUserAccess();
  }, [isSignedIn, courseType, user]);

  const handlePurchase = async () => {
    try {
      setIsLoading(true);
      
      // Check API endpoint based on course type
      const endpoint = `/api/live-courses/${courseType}/checkout`;
      
      const response = await axios.post(endpoint);
      
      // Handle response based on course type
      if (response.data) {
        toast.success(`Successfully enrolled in ${response.data.classTitle || 'the course'}!`);
        setIsPurchased(true);
        
        // Redirect or call success callback
        if (onSuccess) {
          onSuccess();
        } else {
          // Redirect to course page based on type
          router.push(`/live-courses/${courseType}`);
        }
        
        // Refresh the page data
        router.refresh();
      }
    } catch (error: any) {
      console.error("Purchase initialization error:", error);
      
      // Handle different error scenarios
      if (error.response?.status === 401) {
        toast.error("Please sign in to enroll in this course");
        router.push("/sign-in");
      } else if (error.response?.status === 404) {
        toast.error("Please complete your profile first");
        router.push("/profile");
      } else if (error.response?.status === 400 && error.response?.data === "Already purchased") {
        toast.success("You're already enrolled in this course!");
        setIsPurchased(true);
        router.push(`/live-courses/${courseType}`);
      } else {
        toast.error("Failed to enroll in the course. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinClass = () => {
    router.push(`/live-courses/${courseType}/classroom`);
  };

  if (isChecking) {
    return (
      <Button disabled className={className}>
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Checking access...
      </Button>
    );
  }

  // Admin, lecturer or purchased - show Join button
  if (isAdmin || isPurchased) {
    return (
      <Button
        onClick={handleJoinClass}
        variant={variant}
        className={className}
      >
        <Play className="h-4 w-4 mr-2" />
        {joinButtonText}
      </Button>
    );
  }

  // Not purchased - show Purchase button
  return (
    <Button
      onClick={handlePurchase}
      disabled={isLoading}
      variant={variant}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        purchaseButtonText
      )}
    </Button>
  );
}; 