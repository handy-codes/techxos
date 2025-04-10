"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Loader2 } from "lucide-react";

interface PurchaseButtonProps {
  courseType: "project-mgt" | "web-dev" | "ui-ux";
  buttonText?: string;
  variant?: "default" | "outline" | "destructive" | "ghost" | "link" | "secondary";
  className?: string;
  onSuccess?: () => void;
}

export const PurchaseButton = ({
  courseType,
  buttonText = "Enroll Now",
  variant = "default",
  className = "",
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
        toast.success(`Successfully enrolled in ${response.data.classTitle || 'the course'}!`);
        
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
        router.push(`/live-courses/${courseType}`);
      } else {
        toast.error("Failed to enroll in the course. Please try again later.");
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
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        buttonText
      )}
    </Button>
  );
}; 