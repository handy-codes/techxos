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
  const { user } = useUser();
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLiveClasses();
  }, []);

  const fetchLiveClasses = async () => {
    try {
      const response = await axios.get("/api/admin/live-classes");
      setLiveClasses(response.data);
    } catch (error) {
      toast.error("Failed to fetch live classes");
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
    } catch (error) {
      toast.error("Failed to update class status");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
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
          {liveClasses.map((liveClass) => (
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
} 