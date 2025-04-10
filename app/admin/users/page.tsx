"use client&quot;;

import { useEffect, useState, useCallback } from &quot;react&quot;;
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
import { Plus, Search, Filter, Menu } from &quot;lucide-react&quot;;
import { useRouter } from &quot;next/navigation&quot;;
import { Input } from &quot;@/components/ui/input&quot;;
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from &quot;@/components/ui/select&quot;;
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from &quot;@/components/ui/dialog&quot;;
import { Badge } from &quot;@/components/ui/badge&quot;;
import { ScrollArea } from &quot;@/components/ui/scroll-area&quot;;
import { Skeleton } from &quot;@/components/ui/skeleton&quot;;
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from &quot;@/components/ui/sheet&quot;;

interface ApiError {
  response?: {
    status?: number;
    statusText?: string;
    data?: any;
  };
  message?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: &quot;HEAD_ADMIN&quot; | &quot;ADMIN&quot; | &quot;LECTURER&quot;;
  isActive: boolean;
}

export default function UsersPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(&quot;");
  const [roleFilter, setRoleFilter] = useState<string>(&quot;&quot;);
  const [statusFilter, setStatusFilter] = useState<string>(&quot;&quot;);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isUnauthorized, setIsUnauthorized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const itemsPerPage = 10;

  // Fix hydration issues by ensuring components only render on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      console.log(&quot;Fetching users with query:&quot;, searchQuery);
      setLoading(true);
      const response = await axios.get<User[]>(&quot;/api/admin/users&quot;);
      console.log(&quot;Got response with&quot;, response.data.length, &quot;users&quot;);
      let filteredUsers = response.data || [];

      // Apply filters - use toLowerCase() for case-insensitive search
      if (searchQuery) {
        console.log(&quot;Filtering by search query:&quot;, searchQuery);
        const searchLower = searchQuery.toLowerCase();
        filteredUsers = filteredUsers.filter(
          (user: User) =>
            (user.name || &quot;&quot;).toLowerCase().includes(searchLower) ||
            (user.email || &quot;&quot;).toLowerCase().includes(searchLower) ||
            (user.role || &quot;&quot;).toLowerCase().includes(searchLower)
        );
        console.log(&quot;After filtering, found&quot;, filteredUsers.length, &quot;matching users&quot;);
      }

      // Only apply role filter if it&apos;s not &quot;all&quot;
      if (roleFilter && roleFilter !== &quot;all&quot;) {
        filteredUsers = filteredUsers.filter(
          (user: User) => user.role === roleFilter
        );
      }

      // Only apply status filter if it&apos;s not &quot;all&quot;
      if (statusFilter && statusFilter !== &quot;all&quot;) {
        filteredUsers = filteredUsers.filter(
          (user: User) => user.isActive === (statusFilter === &quot;active&quot;)
        );
      }

      // Calculate pagination
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
      setTotalPages(Math.ceil(filteredUsers.length / itemsPerPage));
      setUsers(paginatedUsers);
      setIsUnauthorized(false);
    } catch (error: unknown) {
      const err = error as ApiError;
      console.error(&quot;Error fetching users:&quot;, err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setIsUnauthorized(true);
        toast.error(&quot;You don&apos;t have permission to view users&quot;);
      } else {
        toast.error(&quot;Failed to fetch users&quot;);
      }
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, roleFilter, statusFilter, page, itemsPerPage]);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push(&quot;/&quot;);
      return;
    }

    if (user) {
      fetchUsers();
    }
  }, [isLoaded, user, router, fetchUsers]);

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      await axios.patch(`/api/admin/users/${userId}`, {
        isActive: !currentStatus,
      });
      toast.success(&quot;User status updated successfully&quot;);
      fetchUsers();
    } catch (error: unknown) {
      const err = error as ApiError;
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error(&quot;You don&apos;t have permission to update users&quot;);
      } else {
        toast.error(&quot;Failed to update user status&quot;);
      }
      console.error(err);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      toast.success(&quot;User deleted successfully&quot;);
      fetchUsers();
    } catch (error: unknown) {
      const err = error as ApiError;
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error(&quot;You don&apos;t have permission to delete users&quot;);
      } else {
        toast.error(&quot;Failed to delete user&quot;);
      }
      console.error(err);
    }
  };

  if (!isLoaded) {
    return null;
  }

  if (!user) {
    return null;
  }

  if (isUnauthorized) {
    return (
      <div className="p-4 md:p-6&quot;>
        <div className=&quot;rounded-md border p-4 md:p-6 text-center&quot;>
          <h2 className=&quot;text-xl md:text-2xl font-bold mb-2&quot;>Access Denied</h2>
          <p className=&quot;text-muted-foreground mb-4&quot;>
            You don&apos;t have permission to access this page. Please contact your administrator if you believe this is a mistake.
          </p>
          <Button onClick={() => router.push(&quot;/")}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-120px)]&quot;>
      <div className=&quot;p-4 md:p-6 space-y-4 md:space-y-6&quot;>
        <div className=&quot;flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4&quot;>
          <h1 className=&quot;text-xl md:text-2xl font-bold&quot;>Manage Users</h1>
          <Button onClick={() => router.push(&quot;/admin/users/new&quot;)}>
            <Plus className=&quot;w-4 h-4 mr-2&quot; />
            Add New User
          </Button>
        </div>

        <div className=&quot;flex flex-col sm:flex-row gap-4&quot;>
          <div className=&quot;relative flex-1&quot;>
            <Search className=&quot;absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4&quot; />
            <Input
              placeholder=&quot;Search users...&quot;
              className=&quot;pl-10&quot;
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className=&quot;flex gap-2&quot;>
            {isMounted && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant=&quot;outline&quot; className=&quot;w-full sm:w-auto hidden&quot;>
                    <Filter className=&quot;w-4 h-4 mr-2&quot; />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Users</SheetTitle>
                  </SheetHeader>
                  <div className=&quot;space-y-4 mt-4&quot;>
                    <div className=&quot;space-y-2&quot;>
                      <label className=&quot;text-sm font-medium&quot;>Role</label>
                      <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder=&quot;Select role&quot; />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=&quot;all&quot;>All Roles</SelectItem>
                          <SelectItem value=&quot;HEAD_ADMIN&quot;>Head Admin</SelectItem>
                          <SelectItem value=&quot;ADMIN&quot;>Admin</SelectItem>
                          <SelectItem value=&quot;LECTURER&quot;>Lecturer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className=&quot;space-y-2&quot;>
                      <label className=&quot;text-sm font-medium&quot;>Status</label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder=&quot;Select status&quot; />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value=&quot;all&quot;>All Status</SelectItem>
                          <SelectItem value=&quot;active&quot;>Active</SelectItem>
                          <SelectItem value=&quot;inactive&quot;>Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>

        {loading ? (
          <div className=&quot;rounded-md border&quot;>
            <Table>
              <TableHeader>
                <TableRow>
                  {[...Array(5)].map((_: unknown, i: number) => (
                    <TableHead key={i}>
                      <Skeleton className=&quot;h-4 w-[250px]&quot; />
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_: unknown, i: number) => (
                  <TableRow key={i}>
                    {[...Array(5)].map((_: unknown, j: number) => (
                      <TableCell key={j}>
                        <Skeleton className=&quot;h-4 w-[250px]&quot; />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className=&quot;rounded-md border overflow-x-auto&quot;>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className=&quot;hidden md:table-cell&quot;>Email</TableHead>
                  <TableHead className=&quot;hidden sm:table-cell&quot;>Role</TableHead>
                  <TableHead className=&quot;hidden sm:table-cell&quot;>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((userData: User) => (
                  <TableRow key={userData.id}>
                    <TableCell className=&quot;font-medium&quot;>{userData.name}</TableCell>
                    <TableCell className=&quot;hidden md:table-cell&quot;>{userData.email}</TableCell>
                    <TableCell className=&quot;hidden sm:table-cell&quot;>{userData.role}</TableCell>
                    <TableCell className=&quot;hidden sm:table-cell&quot;>
                      <Badge 
                        variant={userData.isActive ? &quot;default&quot; : &quot;destructive&quot;}
                        className={userData.isActive ? &quot;bg-green-500 hover:bg-green-600&quot; : &quot;"}
                      >
                        {userData.isActive ? &quot;Active&quot; : &quot;Inactive&quot;}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {isMounted && (
                        <>
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button variant=&quot;ghost&quot; size=&quot;icon&quot; className="md:hidden&quot;>
                                <Menu className=&quot;h-4 w-4&quot; />
                              </Button>
                            </SheetTrigger>
                            <SheetContent side=&quot;right&quot;>
                              <div className=&quot;flex flex-col gap-2 mt-4&quot;>
                                <Button
                                  variant=&quot;outline&quot;
                                  className=&quot;w-full justify-start&quot;
                                  onClick={() => router.push(`/admin/users/${userData.id}/edit`)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant=&quot;outline&quot;
                                  className=&quot;w-full justify-start&quot;
                                  onClick={() => toggleUserStatus(userData.id, userData.isActive)}
                                >
                                  {userData.isActive ? &quot;Deactivate&quot; : &quot;Activate&quot;}
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant=&quot;destructive&quot; className=&quot;w-full justify-start&quot;>
                                      Delete
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete the user.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction onClick={() => deleteUser(userData.id)}>
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </SheetContent>
                          </Sheet>
                          <div className=&quot;hidden md:flex gap-2&quot;>
                            <Button
                              variant=&quot;outline&quot;
                              size=&quot;sm&quot;
                              onClick={() => router.push(`/admin/users/${userData.id}/edit`)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant=&quot;outline&quot;
                              size=&quot;sm&quot;
                              onClick={() => toggleUserStatus(userData.id, userData.isActive)}
                            >
                              {userData.isActive ? &quot;Deactivate&quot; : &quot;Activate&quot;}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant=&quot;destructive&quot; size=&quot;sm&quot;>
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the user.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => deleteUser(userData.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <div className=&quot;flex flex-col sm:flex-row justify-between items-center gap-4&quot;>
          <div className=&quot;text-sm text-muted-foreground&quot;>
            Showing {users.length} of {totalPages * itemsPerPage} users
          </div>
          <div className=&quot;flex gap-2&quot;>
            <Button
              variant=&quot;outline&quot;
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant=&quot;outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
} 