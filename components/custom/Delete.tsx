import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from &quot;@/components/ui/alert-dialog&quot;;
import axios from &quot;axios&quot;;
import { Loader2, Trash } from &quot;lucide-react&quot;;
import { useRouter } from &quot;next/navigation&quot;;
import { useState } from &quot;react&quot;;
import toast from &quot;react-hot-toast&quot;;
import { Button } from &quot;../ui/button&quot;;

interface DeleteProps {
  item: string;
  courseId: string;
  sectionId?: string;
}

const Delete = ({ item, courseId, sectionId }: DeleteProps) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const onDelete = async () => {
    try {
      setIsDeleting(true);
      const url =
        item === &quot;course&quot;
          ? `/api/courses/${courseId}`
          : `/api/courses/${courseId}/sections/${sectionId}`;
      await axios.delete(url);

      setIsDeleting(false);
      const pushedUrl =
        item === &quot;course&quot;
          ? &quot;/instructor/courses&quot;
          : `/instructor/courses/${courseId}/sections`;
      router.push(pushedUrl);
      router.refresh();
      toast.success(`${item} deleted`);
    } catch (err) {
      toast.error(`Something went wrong!`);
      console.log(`Failed to delete the ${item}`, err);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button>
          {isDeleting ? (
            <Loader2 className=&quot;h-4 w-4 animate-spin&quot; />
          ) : (
            <Trash className=&quot;h-4 w-4&quot; />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-500&quot;>
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your {item}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction className=&quot;bg-[#FDAB04]" onClick={onDelete}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Delete;
