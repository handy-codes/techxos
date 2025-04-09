"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";

export default function DebugUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        // Create a debug endpoint if needed, or use an existing one
        const response = await axios.get("/api/admin/debug/users");
        setUsers(response.data);
      } catch (error: any) {
        console.error("Error fetching users:", error);
        setError(error.response?.data || "Failed to load users");
        toast.error("Error fetching users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Function to create a lecturer from an existing user
  const convertToLecturer = async (userId: string) => {
    try {
      await axios.post("/api/admin/debug/convert-to-lecturer", { userId });
      toast.success("User converted to lecturer successfully");
      // Refresh user list
      window.location.reload();
    } catch (error: any) {
      console.error("Error converting user:", error);
      toast.error(error.response?.data || "Failed to convert user");
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="bg-red-50 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700">Error Loading Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">{error}</p>
            <div className="mt-4">
              <Button variant="outline" asChild>
                <Link href="/admin">Back to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Debug: User Management</h1>
          <Button variant="outline" asChild>
            <Link href="/admin">Back to Dashboard</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users in Database</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {users.length === 0 ? (
                <p className="text-muted-foreground">No users found in the database.</p>
              ) : (
                users.map((user) => (
                  <Card key={user.id} className="p-4 relative">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">
                          {user.name || "No Name"} ({user.email})
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.role === "LECTURER" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-blue-100 text-blue-800"
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><strong>ID:</strong> {user.id}</div>
                        <div><strong>Clerk ID:</strong> {user.clerkUserId || "N/A"}</div>
                        <div><strong>Status:</strong> {user.isActive ? "Active" : "Inactive"}</div>
                        <div><strong>Created:</strong> {new Date(user.createdAt).toLocaleString()}</div>
                      </div>
                      {user.role !== "LECTURER" && (
                        <Button 
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          onClick={() => convertToLecturer(user.id)}
                        >
                          Convert to Lecturer
                        </Button>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
} 