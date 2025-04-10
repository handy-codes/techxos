"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import axios from "axios";

export default function NewLecturerPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Email is required");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create lecturer data
      const lecturerData = {
        name: name || null, // Allow null name
        email,
      };

      // Create lecturer
      await axios.post("/api/admin/lecturers", lecturerData);
      
      toast.success("Lecturer added successfully!");
      router.push("/admin/live-classes/new");
    } catch (error: any) {
      console.error("Error adding lecturer:", error);
      toast.error(error.response?.data || "Failed to add lecturer");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Add New Lecturer</h1>
          <Button variant="outline" asChild>
            <Link href="/admin/live-classes/new">Cancel</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lecturer Details</CardTitle>
            <CardDescription>
              Add a new lecturer to assign to live classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Lecturer Name (Optional)</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g., John Doe" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="e.g., lecturer@example.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <CardFooter className="px-0 pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="ml-auto"
                >
                  {isSubmitting ? "Adding..." : "Add Lecturer"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
} 