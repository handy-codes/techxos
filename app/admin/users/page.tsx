"use client";

import { useEffect, useState, useCallback } from "react";
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
import { Plus, Search, Filter, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
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
} from "@/components/ui/alert-dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  role: "HEAD_ADMIN" | "ADMIN" | "LECTURER";
  isActive: boolean;
}

export default function UsersPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
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
      console.log("Fetching users with query:", searchQuery);
      setLoading(true);
      const response = await axios.get<User[]>("/api/admin/users");
      console.log("Got response with", response.data.length, "users");
      let filteredUsers = response.data || [];

      // Apply filters - use toLowerCase() for case-insensitive search
      if (searchQuery) {
        console.log("Filtering by search query:", searchQuery);
        const searchLower = searchQuery.toLowerCase();
        filteredUsers = filteredUsers.filter(
          (user: User) =>
            (user.name || "").toLowerCase().includes(searchLower) ||
            (user.email || "").toLowerCase().includes(searchLower) ||
            (user.role || "").toLowerCase().includes(searchLower)
        );
        console.log("After filtering, found", filteredUsers.length, "matching users");
      }

      // Only apply role filter if it's not "all"
      if (roleFilter && roleFilter !== "all") {
        filteredUsers = filteredUsers.filter(
          (user: User) => user.role === roleFilter
        );
      }

      // Only apply status filter if it's not "all"
      if (statusFilter && statusFilter !== "all") {
        filteredUsers = filteredUsers.filter(
          (user: User) => user.isActive === (statusFilter === "active")
        );
      }

      // Calculate pagination
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
      setTotalPages(Math.ceil(filteredUsers.length / itemsPerPage));
      setUsers(paginatedUsers);
      setIsUnauthorized(false);
    } catch (error: any) {
      const err = error as ApiError;
      console.error("Error fetching users:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setIsUnauthorized(true);
        toast.error("You don't have permission to view users");
        router.push("/");
      } else {
        toast.error("Failed to fetch users");
      }
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, roleFilter, statusFilter, page, itemsPerPage, router]);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/");
      return;
    }

    if (user) {
      fetchUsers();
    }
  }, [isLoaded, user, router, fetchUsers]);

  const toggleUserStatus = useCallback(async (userId: string, currentStatus: boolean) => {
    try {
      await axios.patch(`/api/admin/users/${userId}`, {
        isActive: !currentStatus,
      });
      toast.success("User status updated successfully");
      fetchUsers();
    } catch (error: unknown) {
      const err = error as ApiError;
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("You don't have permission to update users");
      } else {
        toast.error("Failed to update user status");
      }
      console.error(err);
    }
  }, [fetchUsers]);

  const deleteUser = useCallback(async (userId: string) => {
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error: unknown) {
      const err = error as ApiError;
      if (err.response?.status === 401 || err.response?.status === 403) {
        toast.error("You don't have permission to delete users");
      } else {
        toast.error("Failed to delete user");
      }
      console.error(err);
    }
  }, [fetchUsers]);

  if (!isLoaded) {
    return null;
  }

  if (!user) {
    return null;
  }

  if (isUnauthorized) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-md border p-4 md:p-6 text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">
            You don&apos;t have permission to access this page. Please contact your administrator if you believe this is a mistake.
          </p>
          <Button onClick={() => router.push("/")}>
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-120px)]">
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-xl md:text-2xl font-bold">Manage Users</h1>
          <Button onClick={() => router.push("/admin/users/new")}>
            <Plus className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          {isMounted && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Users</SheetTitle>
                </SheetHeader>
                <div className="space-y-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    <Select value={roleFilter} onValueChange={setRoleFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="HEAD_ADMIN">Head Admin</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="LECTURER">Lecturer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>

        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden sm:table-cell">Role</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((userData: User) => (
                  <TableRow key={userData.id}>
                    <TableCell className="font-medium">{userData.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{userData.email}</TableCell>
                    <TableCell className="hidden sm:table-cell">{userData.role}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge 
                        variant={userData.isActive ? "default" : "destructive"}
                        className={userData.isActive ? "bg-green-500 hover:bg-green-600" : ""}
                      >
                        {userData.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {isMounted && (
                        <>
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button variant="ghost" size="icon" className="md:hidden">
                                <Menu className="h-4 w-4" />
                              </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                              <div className="flex flex-col gap-2 mt-4">
                                <Button
                                  variant="outline"
                                  className="w-full justify-start"
                                  onClick={() => router.push(`/admin/users/${userData.id}/edit`)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="outline"
                                  className="w-full justify-start"
                                  onClick={() => toggleUserStatus(userData.id, userData.isActive)}
                                >
                                  {userData.isActive ? "Deactivate" : "Activate"}
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" className="w-full justify-start">
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
                          <div className="hidden md:flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => router.push(`/admin/users/${userData.id}/edit`)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleUserStatus(userData.id, userData.isActive)}
                            >
                              {userData.isActive ? "Deactivate" : "Activate"}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
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

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Showing {users.length} of {totalPages * itemsPerPage} users
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
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