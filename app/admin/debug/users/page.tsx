"use client&quot;;

import { useState, useEffect } from &quot;react&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import { Card, CardContent, CardHeader, CardTitle } from &quot;@/components/ui/card&quot;;
import { ScrollArea } from &quot;@/components/ui/scroll-area&quot;;
import { Skeleton } from &quot;@/components/ui/skeleton&quot;;
import axios from &quot;axios&quot;;
import { toast } from &quot;react-hot-toast&quot;;
import Link from &quot;next/link&quot;;
import { useAuth } from &quot;@clerk/nextjs&quot;;
import { useUser } from &quot;@clerk/nextjs&quot;;

export default function DebugUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        // Create a debug endpoint if needed, or use an existing one
        const response = await axios.get(&quot;/api/admin/debug/users&quot;);
        setUsers(response.data);
      } catch (error: any) {
        console.error(&quot;Error fetching users:&quot;, error);
        setError(error.response?.data || &quot;Failed to load users&quot;);
        toast.error(&quot;Error fetching users&quot;);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Function to create a lecturer from an existing user
  const convertToLecturer = async (userId: string) => {
    try {
      await axios.post(&quot;/api/admin/debug/convert-to-lecturer&quot;, { userId });
      toast.success(&quot;User converted to lecturer successfully&quot;);
      // Refresh user list
      window.location.reload();
    } catch (error: any) {
      console.error(&quot;Error converting user:&quot;, error);
      toast.error(error.response?.data || &quot;Failed to convert user&quot;);
    }
  };

  if (isLoading) {
    return (
      <div className=&quot;p-6 space-y-6&quot;>
        <div className=&quot;flex justify-between items-center mb-6&quot;>
          <Skeleton className=&quot;h-8 w-48&quot; />
        </div>
        <Skeleton className=&quot;h-60 w-full&quot; />
      </div>
    );
  }

  if (error) {
    return (
      <div className=&quot;p-6&quot;>
        <Card className=&quot;bg-red-50 border-red-200&quot;>
          <CardHeader>
            <CardTitle className=&quot;text-red-700&quot;>Error Loading Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className=&quot;text-red-700&quot;>{error}</p>
            <div className=&quot;mt-4&quot;>
              <Button variant=&quot;outline&quot; asChild>
                <Link href=&quot;/admin&quot;>Back to Dashboard</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <ScrollArea className=&quot;h-full&quot;>
      <div className=&quot;p-6 space-y-6&quot;>
        <div className=&quot;flex items-center justify-between&quot;>
          <h1 className=&quot;text-2xl font-bold&quot;>Debug: User Management</h1>
          <Button variant=&quot;outline&quot; asChild>
            <Link href=&quot;/admin&quot;>Back to Dashboard</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users in Database</CardTitle>
          </CardHeader>
          <CardContent>
            <div className=&quot;space-y-6&quot;>
              {users.length === 0 ? (
                <p className=&quot;text-muted-foreground&quot;>No users found in the database.</p>
              ) : (
                users.map((user) => (
                  <Card key={user.id} className=&quot;p-4 relative&quot;>
                    <div className=&quot;flex flex-col gap-2&quot;>
                      <div className=&quot;flex items-center justify-between&quot;>
                        <h3 className=&quot;text-lg font-medium&quot;>
                          {user.name || &quot;No Name&quot;} ({user.email})
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          user.role === &quot;LECTURER&quot; 
                            ? &quot;bg-green-100 text-green-800&quot; 
                            : &quot;bg-blue-100 text-blue-800&quot;
                        }`}>
                          {user.role}
                        </span>
                      </div>
                      <div className=&quot;grid grid-cols-2 gap-2 text-sm&quot;>
                        <div><strong>ID:</strong> {user.id}</div>
                        <div><strong>Clerk ID:</strong> {user.clerkUserId || &quot;N/A&quot;}</div>
                        <div><strong>Status:</strong> {user.isActive ? &quot;Active&quot; : &quot;Inactive&quot;}</div>
                        <div><strong>Created:</strong> {new Date(user.createdAt).toLocaleString()}</div>
                      </div>
                      {user.role !== &quot;LECTURER&quot; && (
                        <Button 
                          variant=&quot;outline&quot;
                          size=&quot;sm&quot;
                          className=&quot;mt-2"
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