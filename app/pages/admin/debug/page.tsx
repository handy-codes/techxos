"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Loader2, Search, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DebugUserPage() {
  const [email, setEmail] = useState("careers@techxos.com");
  const [role, setRole] = useState("ADMIN");
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [clerkUserId, setClerkUserId] = useState("");
  
  // Handle search by email
  const handleSearch = async () => {
    if (!email) {
      toast.error("Please enter an email to search");
      return;
    }
    
    setSearchLoading(true);
    setUsers([]);
    setMessage("");
    
    try {
      const response = await axios.get(`/api/admin/debug-user?email=${encodeURIComponent(email)}`);
      if (response.data.users) {
        setUsers(response.data.users);
        setMessage(response.data.message);
        
        // If there's a single user found, pre-fill their Clerk ID
        if (response.data.users.length === 1 && response.data.users[0].clerkUserId) {
          setClerkUserId(response.data.users[0].clerkUserId);
        }
      } else {
        setMessage(response.data.message || "No users found");
      }
    } catch (error) {
      console.error("Error searching for user:", error);
      toast.error("Error searching for user");
    } finally {
      setSearchLoading(false);
    }
  };
  
  // Handle fix user role
  const handleFixRole = async () => {
    if (!email) {
      toast.error("Please enter an email");
      return;
    }
    
    if (!role) {
      toast.error("Please select a role");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post("/api/admin/debug-user", {
        email,
        role,
        clerkUserId: clerkUserId || undefined
      });
      
      toast.success(response.data.message || "User updated successfully");
      
      // Search again to refresh user data
      await handleSearch();
    } catch (error) {
      console.error("Error fixing user role:", error);
      toast.error("Error fixing user role");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Debug User Role</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search User</CardTitle>
          <CardDescription>
            Search for a user by email to check their current role and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex space-x-2">
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                />
                <Button 
                  onClick={handleSearch} 
                  disabled={searchLoading}
                  variant="outline"
                >
                  {searchLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            
            {message && (
              <div className="p-4 bg-blue-50 rounded-md text-blue-800">
                {message}
              </div>
            )}
            
            {users.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Users Found:</h3>
                {users.map((user, index) => (
                  <Card key={index} className="p-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="font-semibold">ID:</div>
                      <div>{user.id}</div>
                      
                      <div className="font-semibold">Name:</div>
                      <div>{user.name || 'N/A'}</div>
                      
                      <div className="font-semibold">Email:</div>
                      <div>{user.email}</div>
                      
                      <div className="font-semibold">Role:</div>
                      <div>
                        <Badge
                          variant={
                            user.role === "HEAD_ADMIN" ? "destructive" : 
                            user.role === "ADMIN" ? "default" : 
                            user.role === "LECTURER" ? "secondary" : 
                            "outline"
                          }
                        >
                          {user.role}
                        </Badge>
                      </div>
                      
                      <div className="font-semibold">Clerk User ID:</div>
                      <div className="font-mono text-xs">{user.clerkUserId || 'None'}</div>
                      
                      <div className="font-semibold">Active:</div>
                      <div>{user.isActive ? 'Yes' : 'No'}</div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Fix User Role</CardTitle>
          <CardDescription>
            Update the user&apos;s role or create a new user with the specified email and role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LEARNER">LEARNER</SelectItem>
                  <SelectItem value="LECTURER">LECTURER</SelectItem>
                  <SelectItem value="ADMIN">ADMIN</SelectItem>
                  <SelectItem value="HEAD_ADMIN">HEAD_ADMIN</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clerkUserId">Clerk User ID (Optional)</Label>
              <Input
                id="clerkUserId"
                value={clerkUserId}
                onChange={(e) => setClerkUserId(e.target.value)}
                placeholder="user_..."
              />
              <p className="text-xs text-gray-500">
                Leave empty to keep the existing Clerk ID or generate a new one
              </p>
            </div>
            
            <Button 
              onClick={handleFixRole} 
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Set User Role
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 