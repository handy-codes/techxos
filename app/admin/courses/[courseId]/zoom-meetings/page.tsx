"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Loader2, Plus, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface ZoomMeeting {
  id: string;
  zoomLink: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CourseZoomMeetingsPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const [courseName, setCourseName] = useState("");
  const [zoomMeetings, setZoomMeetings] = useState<ZoomMeeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newZoomLink, setNewZoomLink] = useState("");

  useEffect(() => {
    const fetchCourseAndZoomMeetings = async () => {
      try {
        setIsLoading(true);
        
        // Fetch course details
        const courseResponse = await axios.get(`/api/admin/courses/${courseId}`);
        setCourseName(courseResponse.data.title || "Course");
        
        // Fetch zoom meetings
        const zoomResponse = await axios.get(`/api/admin/courses/${courseId}/zoom-meetings`);
        setZoomMeetings(zoomResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load course data");
      } finally {
        setIsLoading(false);
      }
    };

    if (courseId) {
      fetchCourseAndZoomMeetings();
    }
  }, [courseId]);

  const handleAddZoomMeeting = async () => {
    if (!newZoomLink.trim()) {
      toast.error("Please enter a Zoom meeting link");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post(`/api/admin/courses/${courseId}/zoom-meetings`, {
        zoomLink: newZoomLink,
      });
      
      setZoomMeetings([...zoomMeetings, response.data]);
      setNewZoomLink("");
      toast.success("Zoom meeting link added successfully");
    } catch (error) {
      console.error("Error adding zoom meeting:", error);
      toast.error("Failed to add zoom meeting link");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (meetingId: string, isActive: boolean) => {
    try {
      setIsSubmitting(true);
      await axios.patch(`/api/admin/courses/${courseId}/zoom-meetings/${meetingId}`, {
        isActive: !isActive,
      });
      
      setZoomMeetings(zoomMeetings.map(meeting => 
        meeting.id === meetingId 
          ? { ...meeting, isActive: !isActive } 
          : meeting
      ));
      
      toast.success(`Zoom meeting ${!isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      console.error("Error updating zoom meeting:", error);
      toast.error("Failed to update zoom meeting");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    if (!confirm("Are you sure you want to delete this zoom meeting link?")) {
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.delete(`/api/admin/courses/${courseId}/zoom-meetings/${meetingId}`);
      
      setZoomMeetings(zoomMeetings.filter(meeting => meeting.id !== meetingId));
      toast.success("Zoom meeting link deleted successfully");
    } catch (error) {
      console.error("Error deleting zoom meeting:", error);
      toast.error("Failed to delete zoom meeting link");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Zoom Meeting Links for {courseName}</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Zoom Meeting Link</CardTitle>
          <CardDescription>
            Add a new Zoom meeting link for this course. Only one link can be active at a time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="zoomLink">Zoom Meeting Link</Label>
              <Input
                id="zoomLink"
                placeholder="https://zoom.us/j/123456789"
                value={newZoomLink}
                onChange={(e) => setNewZoomLink(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleAddZoomMeeting} 
            disabled={isSubmitting || !newZoomLink.trim()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Zoom Meeting Link
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Zoom Meeting Links</CardTitle>
          <CardDescription>
            Manage Zoom meeting links for this course. Students who have purchased the course can join using these links.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {zoomMeetings.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              No Zoom meeting links added yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Zoom Link</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {zoomMeetings.map((meeting) => (
                  <TableRow key={meeting.id}>
                    <TableCell className="max-w-md truncate">
                      {meeting.zoomLink}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={meeting.isActive}
                          onCheckedChange={() => handleToggleActive(meeting.id, meeting.isActive)}
                          disabled={isSubmitting}
                        />
                        <span>{meeting.isActive ? "Active" : "Inactive"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(meeting.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteMeeting(meeting.id)}
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 