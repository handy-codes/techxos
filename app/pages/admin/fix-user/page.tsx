"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FixUserPage() {
  const [email, setEmail] = useState("princeowo73@gmail.com");
  const [clerkUserId, setClerkUserId] = useState("user_2pJFEDGaiczCxjyKK5zRvlcjCko");
  const [role, setRole] = useState("ADMIN");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.post("/api/admin/fix-user", {
        email,
        clerkUserId,
        role
      });

      setResult(response.data);
      toast.success("User updated successfully!");
    } catch (error: any) {
      console.error("Error fixing user:", error);
      toast.error(error.response?.data?.error || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Fix User Account</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Fix Prince Owo&apos;s Account</CardTitle>
          <CardDescription>
            Connect the correct Clerk ID to the database user record
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="user@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clerkUserId">Clerk User ID</Label>
              <Input 
                id="clerkUserId" 
                value={clerkUserId} 
                onChange={(e) => setClerkUserId(e.target.value)} 
                placeholder="user_..."
                required
              />
            </div>
            
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
            
            <Button type="submit" disabled={loading}>
              {loading ? "Processing..." : "Fix User Account"}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Result</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 