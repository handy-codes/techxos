"use client";

import { useState } from "react";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";
import axios from "axios";

export default function SetupZoomPage() {
  const [courseId, setCourseId] = useState("project-mgt");
  const [courseTitle, setCourseTitle] = useState("Project Management");
  const [zoomLink, setZoomLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("/api/admin/setup-course-zoom", {
        courseId,
        courseTitle,
        zoomLink,
      });

      if (response.data.success) {
        toast.success("Zoom meeting setup successful!");
        // Reset form and refresh page after a short delay
        setZoomLink("");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (error) {
      console.error("Error setting up zoom meeting:", error);
      toast.error("Failed to setup zoom meeting. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Heading
          title="Course Zoom Meeting Setup"
          description="Set up Zoom meetings for your courses"
          className="text-black"
        />
        <Separator />
        
        <Card>
          <CardHeader>
            <CardTitle>Course Zoom Meeting Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="courseId" className="text-sm font-medium">
                  Course ID
                </label>
                <Input
                  id="courseId"
                  value={courseId}
                  onChange={(e) => setCourseId(e.target.value)}
                  placeholder="e.g. project-mgt"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="courseTitle" className="text-sm font-medium">
                  Course Title
                </label>
                <Input
                  id="courseTitle"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="e.g. Project Management"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="zoomLink" className="text-sm font-medium">
                  Zoom Link
                </label>
                <Input
                  id="zoomLink"
                  value={zoomLink}
                  onChange={(e) => setZoomLink(e.target.value)}
                  placeholder="e.g. https://zoom.us/j/123456789"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading || !zoomLink.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  "Set Up Zoom Meeting"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 