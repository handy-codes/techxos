"use client&quot;;

import { useState, useEffect } from &quot;react&quot;;
import { useParams, useRouter } from &quot;next/navigation&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import { Input } from &quot;@/components/ui/input&quot;;
import { Label } from &quot;@/components/ui/label&quot;;
import { Switch } from &quot;@/components/ui/switch&quot;;
import { toast } from &quot;react-hot-toast&quot;;
import axios from &quot;axios&quot;;
import { Loader2, Plus, Trash2 } from &quot;lucide-react&quot;;
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from &quot;@/components/ui/card&quot;;
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from &quot;@/components/ui/table&quot;;
import { format } from &quot;date-fns&quot;;

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
  const [courseName, setCourseName] = useState(&quot;");
  const [zoomMeetings, setZoomMeetings] = useState<ZoomMeeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newZoomLink, setNewZoomLink] = useState(&quot;&quot;);

  useEffect(() => {
    const fetchCourseAndZoomMeetings = async () => {
      try {
        setIsLoading(true);
        
        // Fetch course details
        const courseResponse = await axios.get(`/api/admin/courses/${courseId}`);
        setCourseName(courseResponse.data.title || &quot;Course&quot;);
        
        // Fetch zoom meetings
        const zoomResponse = await axios.get(`/api/admin/courses/${courseId}/zoom-meetings`);
        setZoomMeetings(zoomResponse.data);
      } catch (error) {
        console.error(&quot;Error fetching data:&quot;, error);
        toast.error(&quot;Failed to load course data&quot;);
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
      toast.error(&quot;Please enter a Zoom meeting link&quot;);
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await axios.post(`/api/admin/courses/${courseId}/zoom-meetings`, {
        zoomLink: newZoomLink,
      });
      
      setZoomMeetings([...zoomMeetings, response.data]);
      setNewZoomLink(&quot;&quot;);
      toast.success(&quot;Zoom meeting link added successfully&quot;);
    } catch (error) {
      console.error(&quot;Error adding zoom meeting:&quot;, error);
      toast.error(&quot;Failed to add zoom meeting link&quot;);
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
      
      toast.success(`Zoom meeting ${!isActive ? &apos;activated&apos; : &apos;deactivated&apos;} successfully`);
    } catch (error) {
      console.error(&quot;Error updating zoom meeting:&quot;, error);
      toast.error(&quot;Failed to update zoom meeting&quot;);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    if (!confirm(&quot;Are you sure you want to delete this zoom meeting link?&quot;)) {
      return;
    }

    try {
      setIsSubmitting(true);
      await axios.delete(`/api/admin/courses/${courseId}/zoom-meetings/${meetingId}`);
      
      setZoomMeetings(zoomMeetings.filter(meeting => meeting.id !== meetingId));
      toast.success(&quot;Zoom meeting link deleted successfully&quot;);
    } catch (error) {
      console.error(&quot;Error deleting zoom meeting:&quot;, error);
      toast.error(&quot;Failed to delete zoom meeting link&quot;);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full&quot;>
        <Loader2 className=&quot;h-8 w-8 animate-spin text-primary&quot; />
      </div>
    );
  }

  return (
    <div className=&quot;p-6 space-y-6&quot;>
      <div className=&quot;flex items-center justify-between&quot;>
        <h1 className=&quot;text-2xl font-bold&quot;>Zoom Meeting Links for {courseName}</h1>
        <Button variant=&quot;outline&quot; onClick={() => router.back()}>
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
          <div className=&quot;grid gap-4&quot;>
            <div className=&quot;grid gap-2&quot;>
              <Label htmlFor=&quot;zoomLink&quot;>Zoom Meeting Link</Label>
              <Input
                id=&quot;zoomLink&quot;
                placeholder=&quot;https://zoom.us/j/123456789&quot;
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
                <Loader2 className=&quot;mr-2 h-4 w-4 animate-spin&quot; />
                Adding...
              </>
            ) : (
              <>
                <Plus className=&quot;mr-2 h-4 w-4&quot; />
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
            <p className=&quot;text-center text-muted-foreground py-4&quot;>
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
                    <TableCell className=&quot;max-w-md truncate&quot;>
                      {meeting.zoomLink}
                    </TableCell>
                    <TableCell>
                      <div className=&quot;flex items-center space-x-2&quot;>
                        <Switch
                          checked={meeting.isActive}
                          onCheckedChange={() => handleToggleActive(meeting.id, meeting.isActive)}
                          disabled={isSubmitting}
                        />
                        <span>{meeting.isActive ? &quot;Active&quot; : &quot;Inactive&quot;}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {format(new Date(meeting.createdAt), &quot;MMM d, yyyy&quot;)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant=&quot;destructive&quot;
                        size=&quot;sm&quot;
                        onClick={() => handleDeleteMeeting(meeting.id)}
                        disabled={isSubmitting}
                      >
                        <Trash2 className=&quot;h-4 w-4" />
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