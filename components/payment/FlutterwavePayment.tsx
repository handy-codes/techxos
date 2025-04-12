import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface FlutterwavePaymentProps {
  courseId: string;
  courseName: string;
  amount: number;
  email: string;
  name: string;
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

declare global {
  interface Window {
    FlutterwaveCheckout: any;
  }
}

export default function FlutterwavePayment({
  courseId,
  courseName,
  amount,
  email,
  name,
  onSuccess,
  onError
}: FlutterwavePaymentProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load Flutterwave script
    const script = document.createElement('script');
    script.src = 'https://checkout.flutterwave.com/v3.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      
      // Ensure amount is a valid number
      const formattedAmount = Number(amount);
      
      if (isNaN(formattedAmount) || formattedAmount <= 0) {
        toast.error('Invalid payment amount');
        if (onError) onError(new Error('Invalid payment amount'));
        setIsLoading(false);
        return;
      }

      // Validate email and name
      if (!email || !email.includes('@')) {
        toast.error('Please provide a valid email address');
        setIsLoading(false);
        return;
      }

      if (!name || name.trim() === '') {
        toast.error('Please provide your name');
        setIsLoading(false);
        return;
      }

      console.log('Initiating payment with:', {
        courseId,
        courseName,
        amount: formattedAmount,
        email,
        name
      });

      const response = await fetch(`/api/live-courses/project-mgt/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          courseName,
          amount: formattedAmount,
          email,
          name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Payment initialization failed:', errorData);
        throw new Error(errorData.message || 'Payment initialization failed');
      }

      const data = await response.json();
      console.log('Checkout response:', data);

      // Check if user already has an active purchase
      if (data.message && data.message.includes("already have an active purchase")) {
        toast.success("You already have access to this course!");
        if (onSuccess) onSuccess();
        setIsLoading(false);
        return;
      }

      // Initialize Flutterwave payment
      window.FlutterwaveCheckout({
        public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
        tx_ref: data.tx_ref,
        amount: data.price,
        currency: "NGN",
        payment_options: "card,ussd",
        redirect_url: "/project-mgt/success",
        customer: {
          email: email,
          name: name,
        },
        customizations: {
          title: courseName,
          description: `Payment for ${courseName}`,
          logo: "https://techxos.com/logo.png"
        },
        onClose: () => {
          toast.error('Payment cancelled');
          if (onError) onError(new Error('Payment cancelled'));
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initialize payment');
      if (onError) onError(error);
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className="bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
    >
      {isLoading ? 'Processing...' : `Pay ${amount.toLocaleString()} NGN`}
    </button>
  );
} 