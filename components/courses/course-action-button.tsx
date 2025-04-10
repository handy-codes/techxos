"use client&quot;;

import { useState, useEffect } from &quot;react&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import { useRouter } from &quot;next/navigation&quot;;
import { toast } from &quot;react-hot-toast&quot;;
import axios from &quot;axios&quot;;
import { Loader2, Play } from &quot;lucide-react&quot;;
import { useUser } from &quot;@clerk/nextjs&quot;;

interface CourseActionButtonProps {
  courseType: &quot;project-mgt&quot; | &quot;web-dev&quot; | &quot;ui-ux&quot;;
  purchaseButtonText?: string;
  joinButtonText?: string;
  variant?: &quot;default&quot; | &quot;outline&quot; | &quot;destructive&quot; | &quot;ghost&quot; | &quot;link&quot; | &quot;secondary&quot;;
  className?: string;
  onSuccess?: () => void;
}

export const CourseActionButton = ({
  courseType,
  purchaseButtonText = &quot;Enroll Now&quot;,
  joinButtonText = &quot;Join Live Class&quot;,
  variant = &quot;default&quot;,
  className = &quot;",
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
          const roleResponse = await axios.get(&apos;/api/user/role&apos;);
          const role = roleResponse.data.role;
          setUserRole(role);
          
          // Check if user is admin or lecturer
          const isAdminOrLecturer = 
            role === &apos;HEAD_ADMIN&apos; || 
            role === &apos;ADMIN&apos; || 
            role === &apos;LECTURER&apos;;
          
          setIsAdmin(isAdminOrLecturer);
          
          // If admin, we&apos;re done
          if (isAdminOrLecturer) {
            setIsChecking(false);
            return;
          }
        } catch (error) {
          console.error(&quot;Error fetching user role from API:&quot;, error);
          
          // If API fails, check if user email matches HEAD_ADMIN email in sync file
          try {
            // User is signed in but role API failed - try fallback method
            const syncResponse = await fetch(&apos;/role-sync.json&apos;);
            if (syncResponse.ok) {
              const syncData = await syncResponse.json();
              
              // Check if current user&apos;s email matches the admin email
              if (user?.primaryEmailAddress?.emailAddress === syncData.adminEmail) {
                console.log(&quot;User email matches admin email in sync file&quot;);
                setIsAdmin(true);
                setUserRole(&apos;HEAD_ADMIN&apos;);
                setIsChecking(false);
                return;
              }
            }
          } catch (syncError) {
            console.error(&quot;Error checking role sync file:&quot;, syncError);
          }
        }

        // If not admin or can&apos;t determine role, check if course is purchased
        try {
          // Try to get lecture info - will throw error if not purchased
          const lectureResponse = await axios.get(`/api/live-courses/${courseType}/lecture`);
          setIsPurchased(true);
        } catch (error) {
          console.log(&quot;User has not purchased this course&quot;);
          setIsPurchased(false);
        }
      } catch (error) {
        console.error(&quot;Error checking user access:&quot;, error);
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
        toast.success(`Successfully enrolled in ${response.data.classTitle || &apos;the course&apos;}!`);
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
      console.error(&quot;Purchase initialization error:&quot;, error);
      
      // Handle different error scenarios
      if (error.response?.status === 401) {
        toast.error(&quot;Please sign in to enroll in this course&quot;);
        router.push(&quot;/sign-in&quot;);
      } else if (error.response?.status === 404) {
        toast.error(&quot;Please complete your profile first&quot;);
        router.push(&quot;/profile&quot;);
      } else if (error.response?.status === 400 && error.response?.data === &quot;Already purchased&quot;) {
        toast.success(&quot;You&apos;re already enrolled in this course!&quot;);
        setIsPurchased(true);
        router.push(`/live-courses/${courseType}`);
      } else {
        toast.error(&quot;Failed to enroll in the course. Please try again later.&quot;);
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
        <Loader2 className=&quot;h-4 w-4 mr-2 animate-spin&quot; />
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
        <Play className=&quot;h-4 w-4 mr-2&quot; />
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
          <Loader2 className=&quot;h-4 w-4 mr-2 animate-spin&quot; />
          Processing...
        </>
      ) : (
        purchaseButtonText
      )}
    </Button>
  );
}; 