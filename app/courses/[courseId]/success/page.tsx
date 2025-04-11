"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function PaymentSuccessPage() {
  const { courseId } = useParams();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!isSignedIn) {
        toast.error("Please sign in to verify your payment");
        router.push("/sign-in");
        return;
      }

      try {
        // Get the transaction reference from URL
        const urlParams = new URLSearchParams(window.location.search);
        const tx_ref = urlParams.get("tx_ref");
        const transaction_id = urlParams.get("transaction_id");

        if (!tx_ref || !transaction_id) {
          toast.error("Invalid payment verification");
          router.push(`/courses/${courseId}`);
          return;
        }

        // Verify payment with our backend
        const response = await axios.post(`/api/live-courses/${courseId}/verify-payment`, {
          tx_ref,
          transaction_id
        });

        if (response.data.success) {
          toast.success("Payment verified successfully!");
          // Redirect to course page after a short delay
          setTimeout(() => {
            router.push(`/courses/${courseId}`);
          }, 2000);
        } else {
          throw new Error("Payment verification failed");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        toast.error("Failed to verify payment. Please contact support.");
        router.push(`/courses/${courseId}`);
      } finally {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [courseId, isSignedIn, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Verifying Payment</h1>
        {isVerifying ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p className="text-gray-600">Please wait while we verify your payment...</p>
          </div>
        ) : (
          <p className="text-gray-600">Redirecting you to the course...</p>
        )}
      </div>
    </div>
  );
} 