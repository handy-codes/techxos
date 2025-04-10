"use client&quot;;

import { Button } from &quot;@/components/ui/button&quot;;
import axios from &quot;axios&quot;;
import { Loader2 } from &quot;lucide-react&quot;;
import { useRouter } from &quot;next/navigation&quot;;
import { useState } from &quot;react&quot;;
import toast from &quot;react-hot-toast&quot;;
import confetti from &quot;canvas-confetti&quot;;

interface PublishButtonProps {
  disabled: boolean;
  courseId: string;
  sectionId?: string;
  isPublished: boolean;
  page: string;
}

const PublishButton = ({
  disabled,
  courseId,
  sectionId,
  isPublished,
  page,
}: PublishButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    let url = `/api/courses/${courseId}`;
    if (page === &quot;Section&quot;) {
      url += `/sections/${sectionId}`;
    }

    try {
      setIsLoading(true);
      isPublished
        ? await axios.post(`${url}/unpublish`)
        : await axios.post(`${url}/publish`);

      toast.success(`${page} ${isPublished ? &quot;unpublished&quot; : &quot;published&quot;}`);
      router.refresh();
    } catch (err) {
      toast.error(&quot;Something went wrong!&quot;);
      console.log(
        `Failed to ${isPublished ? &quot;unpublish&quot; : &quot;publish&quot;} ${page}`,
        err
      );
    } finally {
      setIsLoading(false);
      // if (!isPublished && page === &quot;Section&quot;) {
      //   // Assuming `pageType` is a variable that determines if the page is a course or chapter
      //   confetti();
      // }
    }
  };

  return (
    <Button
      variant=&quot;outline&quot;
      disabled={disabled || isLoading}
      onClick={onClick}
    >
      {isLoading ? <Loader2 className=&quot;h-4 w-4 bg-[#FBB11C] animate-spin&quot; /> : isPublished ? &quot;Unpublish&quot; : &quot;Publish"}
    </Button>
  );
};

export default PublishButton;
