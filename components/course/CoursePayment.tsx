import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';
import FlutterwavePayment from '@/components/payment/FlutterwavePayment';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface CoursePaymentProps {
  courseId: string;
  courseName: string;
  amount: number;
  hasAccess: boolean;
  onAccessChange?: (hasAccess: boolean) => void;
}

export default function CoursePayment({
  courseId,
  courseName,
  amount,
  hasAccess,
  onAccessChange
}: CoursePaymentProps) {
  const { isSignedIn, user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Get user email and name from Clerk
  const userEmail = user?.emailAddresses?.[0]?.emailAddress || '';
  const userName = user?.fullName || '';

  const handlePaymentSuccess = () => {
    toast.success("Payment successful! Redirecting to course...");
    if (onAccessChange) {
      onAccessChange(true);
    }
    router.push(`/courses/${courseId}/success`);
  };

  const handlePaymentError = (error: any) => {
    console.error("Payment error:", error);
    toast.error("Payment failed. Please try again.");
  };

  const handleJoinClass = () => {
    router.push(`/courses/${courseId}/classroom`);
  };

  if (!isSignedIn) {
    return (
      <Button 
        onClick={() => router.push('/sign-in')}
        className="w-full bg-green-600 text-white py-3 px-6 rounded-md hover:bg-green-700 transition-colors"
      >
        Sign in to Enroll
      </Button>
    );
  }

  if (isLoading) {
    return (
      <Button disabled className="w-full bg-gray-400 text-white py-3 px-6 rounded-md">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Processing...
      </Button>
    );
  }

  if (hasAccess) {
    return (
      <Button 
        onClick={handleJoinClass}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors"
      >
        Join Live Class
      </Button>
    );
  }

  return (
    <FlutterwavePayment 
      courseId={courseId}
      courseName={courseName}
      amount={amount}
      email={userEmail}
      name={userName}
      onSuccess={handlePaymentSuccess}
      onError={handlePaymentError}
    />
  );
} 