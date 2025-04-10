"use client&quot;;

import axios from &quot;axios&quot;;
import { useRouter } from &quot;next/navigation&quot;;
import { useState } from &quot;react&quot;;
import toast from &quot;react-hot-toast&quot;;

import { Button } from &quot;@/components/ui/button&quot;;
import { CheckCircle, Loader2 } from &quot;lucide-react&quot;;

interface ProgressButtonProps {
  courseId: string;
  sectionId: string;
  isCompleted: boolean;
}

const ProgressButton = ({
  courseId,
  sectionId,
  isCompleted,
}: ProgressButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      await axios.post(`/api/courses/${courseId}/sections/${sectionId}/progress`, {
        isCompleted: !isCompleted,
      });
      toast.success(&quot;Progress updated!&quot;);
      router.refresh();
    } catch (err) {
      console.log(&quot;Failed to update progress&quot;, err);
      toast.error(&quot;Something went wrong!&quot;);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant={isCompleted ? &quot;default&quot; : &quot;outline&quot;} 
      onClick={onClick}
      className={isCompleted ? &quot;bg-green-500 hover:bg-green-600 text-white&quot; : &quot;"}
    >
      {isLoading ? (
        <Loader2 className=&quot;h-4 w-4 animate-spin&quot; />
      ) : isCompleted ? (
        <div className="flex items-center&quot;>
          <CheckCircle className=&quot;h-4 w-4 mr-2&quot; />
          <span>Completed</span>
        </div>
      ) : (
        &quot;Mark as complete"
      )}
    </Button>
  );
};

export default ProgressButton;
