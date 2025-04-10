"use client&quot;;

import { useState } from &quot;react&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import { useRouter } from &quot;next/navigation&quot;;
import { toast } from &quot;react-hot-toast&quot;;
import axios from &quot;axios&quot;;
import { Loader2 } from &quot;lucide-react&quot;;

interface PurchaseButtonProps {
  courseType: &quot;project-mgt&quot; | &quot;web-dev&quot; | &quot;ui-ux&quot;;
  buttonText?: string;
  variant?: &quot;default&quot; | &quot;outline&quot; | &quot;destructive&quot; | &quot;ghost&quot; | &quot;link&quot; | &quot;secondary&quot;;
  className?: string;
  onSuccess?: () => void;
}

export const PurchaseButton = ({
  courseType,
  buttonText = &quot;Enroll Now&quot;,
  variant = &quot;default&quot;,
  className = &quot;",
  onSuccess
}: PurchaseButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    try {
      setIsLoading(true);
      
      // Check API endpoint based on course type
      const endpoint = `/api/live-courses/${courseType}/checkout`;
      
      const response = await axios.post(endpoint);
      
      // Handle response based on course type
      if (response.data) {
        toast.success(`Successfully enrolled in ${response.data.classTitle || &apos;the course&apos;}!`);
        
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
        toast.success(&quot;You're already enrolled in this course!&quot;);
        router.push(`/live-courses/${courseType}`);
      } else {
        toast.error(&quot;Failed to enroll in the course. Please try again later.&quot;);
      }
    } finally {
      setIsLoading(false);
    }
  };

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
        buttonText
      )}
    </Button>
  );
}; 