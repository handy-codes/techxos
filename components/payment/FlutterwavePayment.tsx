import { useEffect } from 'react';
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
      const response = await fetch(`/api/live-courses/${courseId}/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
          courseName,
          amount,
          email,
          name,
        }),
      });

      if (!response.ok) {
        throw new Error('Payment initialization failed');
      }

      const data = await response.json();

      // Initialize Flutterwave payment
      window.FlutterwaveCheckout({
        public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
        tx_ref: data.tx_ref,
        amount: data.amount,
        currency: "NGN",
        payment_options: "card,ussd",
        redirect_url: data.redirect_url,
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
        },
      });
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initialize payment');
      if (onError) onError(error);
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors"
    >
      Pay with Flutterwave
    </button>
  );
} 