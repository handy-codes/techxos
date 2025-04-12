import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
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
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
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
      <div className="text-center p-6 border rounded-lg bg-gray-50">
        <h3 className="text-lg font-medium mb-2">Sign in to purchase this course</h3>
        <p className="text-gray-600 mb-4">You need to be signed in to purchase this course.</p>
        <Button 
          onClick={() => router.push('/sign-in')}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Sign In
        </Button>
      </div>
    );
  }

  if (hasAccess) {
    return (
      <div className="text-center p-6 border rounded-lg bg-green-50">
        <h3 className="text-lg font-medium mb-2 text-green-800">You have access to this course</h3>
        <p className="text-gray-600 mb-4">You can now join the live classroom sessions.</p>
        <Button 
          onClick={handleJoinClass}
          className="bg-green-600 hover:bg-green-700"
        >
          Join Class
        </Button>
      </div>
    );
  }

  return (
    <div className="text-center p-6 border rounded-lg">
      <h3 className="text-lg font-medium mb-2">Purchase this course</h3>
      <p className="text-gray-600 mb-4">
        Get access to all live sessions and course materials.
      </p>
      
      <div className="mb-4">
        <span className="text-2xl font-bold">{amount.toLocaleString()} NGN</span>
      </div>
      
      <FlutterwavePayment
        amount={amount}
        email={userEmail}
        name={userName}
        courseId={courseId}
        courseName={courseName}
        onSuccess={handlePaymentSuccess}
        onError={handlePaymentError}
      />
    </div>
  );
} 