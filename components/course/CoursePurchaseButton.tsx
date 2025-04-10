"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { Loader2 } from "lucide-react";

interface CoursePurchaseButtonProps {
  courseId: string;
  courseName: string;
  className?: string;
}

export default function CoursePurchaseButton({
  courseId,
  courseName,
  className,
}: CoursePurchaseButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { isSignedIn } = useAuth();
  const [paymentConfig, setPaymentConfig] = useState<any>(null);
  const makePayment = useFlutterwave(paymentConfig || {});

  const handlePurchase = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to purchase this course");
      return;
    }

    try {
      setIsLoading(true);
      console.log("Initializing purchase for course:", courseId);
      
      const response = await axios.post(
        `/api/courses/${courseId}/checkout`,
        {}
      );

      console.log("Checkout response:", response.data);

      // Use the data from checkout endpoint
      const { price, studentEmail, studentName, courseTitle } = response.data;

      if (!studentEmail || !studentEmail.includes('@')) {
        toast.error("Valid email is required for payment. Please update your profile.");
        return;
      }

      if (!price || price <= 0) {
        toast.error("Invalid course price. Please contact support.");
        return;
      }

      // Ensure price is a number
      const numericPrice = Number(price);
      
      console.log("Processing payment with amount:", numericPrice);

      // Simple payment config - minimal to avoid errors
      const flwConfig = {
        public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
        tx_ref: `${courseId}-${Date.now()}`,
        amount: numericPrice,
        currency: "NGN",
        payment_options: "card",
        customer: {
          email: studentEmail,
          name: studentName || "Student",
          phone_number: "N/A",
        },
        customizations: {
          title: `Techxos ${courseTitle || courseName}`,
          description: `${courseTitle || courseName} Course`,
          logo: "https://techxos.com/logo.png",
        }
      };

      console.log("Payment config:", JSON.stringify(flwConfig));
      setPaymentConfig(flwConfig);
      
      // Make payment
      makePayment({
        callback: function(response) {
          console.log("Payment response:", JSON.stringify(response));
          closePaymentModal();
          
          if (response.status === "successful" || response.status === "completed") {
            // Process successful payment
            toast.success("Payment successful!");
            
            // Submit to server
            axios.post(`/api/courses/${courseId}/payment-success`, {
              transactionId: response.transaction_id || Date.now(),
              status: response.status,
              txRef: response.tx_ref
            })
            .then(() => {
              toast.success("Course access granted!");
              window.location.reload();
            })
            .catch((error) => {
              console.error("Error processing payment success:", error);
              toast.error("Error processing payment. Please contact support.");
            });
          } else {
            toast.error("Payment failed or was cancelled");
          }
        },
        onClose: function() {
          console.log("Payment modal closed");
        }
      });
    } catch (error) {
      console.error("Purchase error:", error);
      toast.error("Failed to process purchase. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePurchase}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        "Purchase Course"
      )}
    </Button>
  );
} 