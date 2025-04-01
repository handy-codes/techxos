"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LiveClass {
  id: string;
  title: string;
  price: number;
  duration: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  lecturer: {
    name: string;
    email: string;
  };
  purchases: {
    id: string;
    studentId: string;
    status: string;
  }[];
}

export default function AdminLiveClassesPage() {
  const { isSignedIn, userId } = useAuth();
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isSignedIn && userId) {
      fetchLiveClasses();
    }
  }, [isSignedIn, userId]);

  const fetchLiveClasses = async () => {
    try {
      const response = await axios.get("/api/admin/live-classes");
      setLiveClasses(response.data);
    } catch (error) {
      console.error("Error fetching live classes:", error);
      toast.error("Failed to load live classes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleActive = async (classId: string, currentStatus: boolean) => {
    try {
      await axios.patch(`/api/admin/live-classes/${classId}`, {
        isActive: !currentStatus,
      });
      toast.success("Status updated successfully");
      fetchLiveClasses();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Live Classes Management</h1>
        <Button onClick={() => window.location.href = "/admin/live-classes/new"}>
          Create New Class
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Lecturer</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Enrollments</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {liveClasses.map((liveClass) => (
            <TableRow key={liveClass.id}>
              <TableCell>{liveClass.title}</TableCell>
              <TableCell>
                <div>
                  <p>{liveClass.lecturer.name}</p>
                  <p className="text-sm text-gray-600">{liveClass.lecturer.email}</p>
                </div>
              </TableCell>
              <TableCell>₦{liveClass.price.toLocaleString()}</TableCell>
              <TableCell>{liveClass.duration} weeks</TableCell>
              <TableCell>{new Date(liveClass.startTime).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(liveClass.endTime).toLocaleDateString()}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-sm ${
                  liveClass.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {liveClass.isActive ? "Active" : "Inactive"}
                </span>
              </TableCell>
              <TableCell>{liveClass.purchases.length}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleToggleActive(liveClass.id, liveClass.isActive)}
                  >
                    {liveClass.isActive ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = `/admin/live-classes/${liveClass.id}`}
                  >
                    Edit
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 