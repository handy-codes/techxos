import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface FlutterwavePaymentProps {
  amount: number;
  email: string;
  name: string;
  courseId: string;
  courseName: string;
  onSuccess: () => void;
  onError: (error: any) => void;
}

const FlutterwavePayment: React.FC<FlutterwavePaymentProps> = ({
  amount,
  email,
  name,
  courseId,
  courseName,
  onSuccess,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      
      // Create a payment session
      const response = await fetch('/api/payment/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          email,
          name,
          courseId,
          courseName,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create payment session');
      }
      
      const data = await response.json();
      
      // Redirect to the payment page
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        toast.error('No payment URL available');
      }
    } catch (error) {
      console.error('Payment error:', error);
      onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className="inline-block text-white bg-green-600 px-6 py-3 rounded-md hover:bg-green-700 transition-colors disabled:bg-green-400"
    >
      {isLoading ? 'Processing...' : `Enroll Now - ₦${amount.toLocaleString()}`}
    </button>
  );
};

export default FlutterwavePayment; 