"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        const status = searchParams.get("status");
        const txRef = searchParams.get("tx_ref");
        const transactionId = searchParams.get("transaction_id");

        console.log("Payment success params:", { status, txRef, transactionId });

        if (status !== "successful") {
          setError("Payment was not successful. Please try again.");
          setIsProcessing(false);
          return;
        }

        if (!txRef || !transactionId) {
          setError("Missing transaction information. Please contact support.");
          setIsProcessing(false);
          return;
        }

        // Call the webhook endpoint to verify and process the payment
        const response = await fetch("/api/webhook/flutterwave", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
            tx_ref: txRef,
            transaction_id: transactionId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to process payment");
        }

        // Show success message
        toast.success("Payment successful! You now have access to the course.");
        
        // Redirect to the course page after a short delay
        setTimeout(() => {
          router.push("/pages/software-devt");
        }, 3000);
      } catch (error) {
        console.error("Payment processing error:", error);
        setError("There was an error processing your payment. Please contact support.");
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Payment Processing</h1>
        
        {isProcessing ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Processing your payment...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="text-red-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-red-600 mb-4">{error}</p>
            <Link 
              href="/pages/software-devt" 
              className="inline-block bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Return to Course
            </Link>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-green-500 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">Your payment was successful! Redirecting you to the course...</p>
            <Link 
              href="/pages/software-devt" 
              className="inline-block bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition-colors"
            >
              Go to Course Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 