"use client&quot;;

import { useEffect, useState } from &quot;react&quot;;
import { useUser } from &quot;@clerk/nextjs&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from &quot;@/components/ui/table&quot;;
import { toast } from &quot;react-hot-toast&quot;;
import axios from &quot;axios&quot;;
import Link from &quot;next/link&quot;;
import { redirect, useRouter } from &quot;next/navigation&quot;;
import { Skeleton } from &quot;@/components/ui/skeleton&quot;;

interface LiveClass {
  id: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  isActive: boolean;
  price: number;
  maxStudents: number | null;
  duration: number;
  batchNumber: number;
  lecturer: {
    name: string | null;
  };
}

export default function LiveClassesPage() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Only fetch data if user is loaded
    if (isUserLoaded) {
      if (!user) {
        // If no user, redirect to sign-in
        router.push(&quot;/sign-in&quot;);
        return;
      }
      
      fetchLiveClasses();
    }
  }, [isUserLoaded, user, router]);

  const fetchLiveClasses = async () => {
    try {
      const response = await axios.get<LiveClass[]>(&quot;/api/admin/live-classes&quot;, {
        headers: {
          &quot;Content-Type&quot;: &quot;application/json&quot;,
          // Clerk will automatically add the auth token in cookies,
          // but we can use withCredentials to ensure cookies are sent
          withCredentials: true
        }
      });
      console.log(&quot;Live classes response:&quot;, response.data);
      setLiveClasses(response.data);
    } catch (error: unknown) {
      console.error(&quot;Error fetching live classes:&quot;, error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error(&quot;You are not authorized to view this page. Please log in as an admin.&quot;);
        router.push(&quot;/sign-in&quot;);
      } else {
        toast.error(&quot;Failed to fetch live classes. Showing empty state.&quot;);
        setLiveClasses([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleClassStatus = async (classId: string, currentStatus: boolean) => {
    try {
      await axios.patch(`/api/admin/live-classes/${classId}`, {
        isActive: !currentStatus,
      });
      toast.success(&quot;Class status updated successfully&quot;);
      fetchLiveClasses();
    } catch (error: unknown) {
      console.error(&quot;Error updating class status:&quot;, error);
      toast.error(&quot;Failed to update class status&quot;);
    }
  };

  // Show loading state while Clerk is initializing
  if (!isUserLoaded) {
    return (
      <div className=&quot;p-6 space-y-6&quot;>
        <div className=&quot;flex justify-between items-center mb-6&quot;>
          <Skeleton className=&quot;h-8 w-48&quot; />
          <Skeleton className=&quot;h-10 w-32&quot; />
        </div>
        <div className=&quot;space-y-4&quot;>
          <Skeleton className=&quot;h-10 w-full&quot; />
          <Skeleton className=&quot;h-40 w-full&quot; />
        </div>
      </div>
    );
  }

  // If user is loaded but not logged in, redirect to sign-in
  if (!user) {
    router.push(&quot;/sign-in&quot;);
    return null;
  }

  if (isLoading) {
    return (
      <div className=&quot;p-6 space-y-6&quot;>
        <div className=&quot;flex justify-between items-center mb-6&quot;>
          <h1 className=&quot;text-2xl font-bold&quot;>Live Classes</h1>
          <Skeleton className=&quot;h-10 w-32&quot; />
        </div>
        <Skeleton className=&quot;h-60 w-full&quot; />
      </div>
    );
  }

  return (
    <div className=&quot;p-6&quot;>
      <div className=&quot;flex justify-between items-center mb-6&quot;>
        <h1 className=&quot;text-2xl font-bold&quot;>Live Classes</h1>
        <Link href=&quot;/admin/live-classes/new&quot;>
          <Button>Create New Class</Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Lecturer</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {liveClasses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className=&quot;text-center py-10 text-muted-foreground&quot;>
                No live classes found
              </TableCell>
            </TableRow>
          ) : (
            liveClasses.map((liveClass: LiveClass) => (
              <TableRow key={liveClass.id}>
                <TableCell>{liveClass.title}</TableCell>
                <TableCell>{liveClass.lecturer.name}</TableCell>
                <TableCell>{liveClass.duration} weeks</TableCell>
                <TableCell>₦{liveClass.price.toLocaleString()}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-sm ${
                      liveClass.isActive
                        ? &quot;bg-green-100 text-green-800&quot;
                        : &quot;bg-red-100 text-red-800&quot;
                    }`}
                  >
                    {liveClass.isActive ? &quot;Active&quot; : &quot;Inactive&quot;}
                  </span>
                </TableCell>
                <TableCell>
                  <div className=&quot;flex gap-2&quot;>
                    <Link href={`/admin/live-classes/${liveClass.id}`}>
                      <Button variant=&quot;outline&quot; size=&quot;sm&quot;>
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant=&quot;outline&quot;
                      size=&quot;sm&quot;
                      onClick={() => toggleClassStatus(liveClass.id, liveClass.isActive)}
                    >
                      {liveClass.isActive ? &quot;Deactivate&quot; : &quot;Activate"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
} 