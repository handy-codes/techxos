"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AddRolePage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await axios.post("/api/admin/create-role", {
        email,
        name,
        role
      });

      setResult(response.data);
      toast.success(response.data.message || "User role set successfully!");
      
      // Clear form
      setEmail("");
      setName("");
    } catch (error: any) {
      console.error("Error setting user role:", error);
      setError(error.response?.data?.error || "Failed to set user role");
      toast.error(error.response?.data?.error || "Failed to set user role");
    } finally {
      setLoading(false);
    }
  };

  // Quick access buttons
  const quickSetup = [
    { email: "emekaowo@yahoo.com", name: "Emeka Owo", role: "ADMIN" },
    { email: "careers@techxos.com", name: "Techxos Lecturer", role: "LECTURER" }
  ];

  const handleQuickSetup = (preset: { email: string, name: string, role: string }) => {
    setEmail(preset.email);
    setName(preset.name);
    setRole(preset.role);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Add User Role</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-3">Quick Setup</h2>
        <div className="flex flex-wrap gap-2">
          {quickSetup.map((preset, index) => (
            <Button 
              key={index} 
              variant="outline" 
              onClick={() => handleQuickSetup(preset)}
            >
              {preset.email} as {preset.role}
            </Button>
          ))}
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add User Role</CardTitle>
          <CardDescription>
            Pre-register a user with a specified role. When they sign up with this email,
            they'll automatically have the assigned permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address*</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Name (Optional)</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="User's full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role*</Label>
              <Select 
                value={role} 
                onValueChange={setRole}
              >
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
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Set User Role"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
      
      {error && (
        <div className="p-4 border border-red-300 bg-red-50 rounded-md mb-6">
          <h3 className="text-red-700 font-semibold mb-1">Error</h3>
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
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