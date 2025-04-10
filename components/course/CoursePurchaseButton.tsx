"use client&quot;;

import { useState } from &quot;react&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import { useAuth } from &quot;@clerk/nextjs&quot;;
import axios from &quot;axios&quot;;
import { toast } from &quot;react-hot-toast&quot;;
import { useFlutterwave, closePaymentModal } from &quot;flutterwave-react-v3&quot;;
import { Loader2 } from &quot;lucide-react&quot;;

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
      toast.error(&quot;Please sign in to purchase this course&quot;);
      return;
    }

    try {
      setIsLoading(true);
      console.log(&quot;Initializing purchase for course:&quot;, courseId);
      
      const response = await axios.post(
        `/api/courses/${courseId}/checkout`,
        {}
      );

      console.log(&quot;Checkout response:&quot;, response.data);

      // Use the data from checkout endpoint
      const { price, studentEmail, studentName, courseTitle } = response.data;

      if (!studentEmail || !studentEmail.includes(&apos;@&apos;)) {
        toast.error(&quot;Valid email is required for payment. Please update your profile.&quot;);
        return;
      }

      if (!price || price <= 0) {
        toast.error(&quot;Invalid course price. Please contact support.&quot;);
        return;
      }

      // Ensure price is a number
      const numericPrice = Number(price);
      
      console.log(&quot;Processing payment with amount:&quot;, numericPrice);

      // Simple payment config - minimal to avoid errors
      const flwConfig = {
        public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
        tx_ref: `${courseId}-${Date.now()}`,
        amount: numericPrice,
        currency: &quot;NGN&quot;,
        payment_options: &quot;card&quot;,
        customer: {
          email: studentEmail,
          name: studentName || &quot;Student&quot;,
          phone_number: &quot;N/A&quot;,
        },
        customizations: {
          title: `Techxos ${courseTitle || courseName}`,
          description: `${courseTitle || courseName} Course`,
          logo: &quot;https://techxos.com/logo.png&quot;,
        }
      };

      console.log(&quot;Payment config:&quot;, JSON.stringify(flwConfig));
      setPaymentConfig(flwConfig);
      
      // Make payment
      makePayment({
        callback: function(response) {
          console.log(&quot;Payment response:&quot;, JSON.stringify(response));
          closePaymentModal();
          
          if (response.status === &quot;successful&quot; || response.status === &quot;completed&quot;) {
            // Process successful payment
            toast.success(&quot;Payment successful!&quot;);
            
            // Submit to server
            axios.post(`/api/courses/${courseId}/payment-success`, {
              transactionId: response.transaction_id || Date.now(),
              status: response.status,
              txRef: response.tx_ref
            })
            .then(() => {
              toast.success(&quot;Course access granted!&quot;);
              window.location.reload();
            })
            .catch((error) => {
              console.error(&quot;Error processing payment success:&quot;, error);
              toast.error(&quot;Error processing payment. Please contact support.&quot;);
            });
          } else {
            toast.error(&quot;Payment failed or was cancelled&quot;);
          }
        },
        onClose: function() {
          console.log(&quot;Payment modal closed&quot;);
        }
      });
    } catch (error) {
      console.error(&quot;Purchase error:&quot;, error);
      toast.error(&quot;Failed to process purchase. Please try again.&quot;);
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
          <Loader2 className=&quot;mr-2 h-4 w-4 animate-spin&quot; />
          Processing...
        </>
      ) : (
        &quot;Purchase Course"
      )}
    </Button>
  );
} 