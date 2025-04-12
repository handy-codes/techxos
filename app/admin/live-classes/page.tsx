"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "react-hot-toast";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

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
        router.push("/sign-in");
        return;
      }
      
      fetchLiveClasses();
    }
  }, [isUserLoaded, user, router]);

  const fetchLiveClasses = async () => {
    try {
      const response = await axios.get<LiveClass[]>("/api/admin/live-classes", {
        headers: {
          "Content-Type": "application/json",
          // Clerk will automatically add the auth token in cookies,
          // but we can use withCredentials to ensure cookies are sent
          withCredentials: true
        }
      });
      console.log("Live classes response:", response.data);
      setLiveClasses(response.data);
    } catch (error: unknown) {
      console.error("Error fetching live classes:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("You are not authorized to view this page. Please log in as an admin.");
        router.push("/sign-in");
      } else {
        toast.error("Failed to fetch live classes. Showing empty state.");
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
      toast.success("Class status updated successfully");
      fetchLiveClasses();
    } catch (error: unknown) {
      console.error("Error updating class status:", error);
      toast.error("Failed to update class status");
    }
  };

  // Show loading state while Clerk is initializing
  if (!isUserLoaded) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  // If user is loaded but not logged in, redirect to sign-in
  if (!user) {
    router.push("/sign-in");
    return null;
  }

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Live Classes</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Live Classes</h1>
        <Link href="/admin/live-classes/new">
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
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
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
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {liveClass.isActive ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Link href={`/admin/live-classes/${liveClass.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleClassStatus(liveClass.id, liveClass.isActive)}
                    >
                      {liveClass.isActive ? "Deactivate" : "Activate"}
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