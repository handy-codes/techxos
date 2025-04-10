"use client&quot;;

import { useState, useEffect } from &quot;react&quot;;
import { useRouter } from &quot;next/navigation&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from &quot;@/components/ui/card&quot;;
import { Input } from &quot;@/components/ui/input&quot;;
import { Label } from &quot;@/components/ui/label&quot;;
import { toast } from &quot;react-hot-toast&quot;;
import { ScrollArea } from &quot;@/components/ui/scroll-area&quot;;
import Link from &quot;next/link&quot;;
import axios from &quot;axios&quot;;
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from &quot;@/components/ui/select&quot;;
import { Skeleton } from &quot;@/components/ui/skeleton&quot;;
import { format, addWeeks } from &quot;date-fns&quot;;
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from &quot;@/components/ui/popover&quot;;
import { Calendar } from &quot;@/components/ui/calendar&quot;;
import { cn } from &quot;@/lib/utils&quot;;
import { CalendarIcon } from &quot;lucide-react&quot;;
import { Alert, AlertDescription, AlertTitle } from &quot;@/components/ui/alert&quot;;
import { AlertCircle } from &quot;lucide-react&quot;;

interface Lecturer {
  id: string;
  name: string | null;
  email: string;
  role?: string;
  isActive?: boolean;
}

export default function NewLiveClassPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasNoLecturers, setHasNoLecturers] = useState(false);
  
  // Form state
  const [title, setTitle] = useState(&quot;");
  const [description, setDescription] = useState(&quot;&quot;);
  const [price, setPrice] = useState(&quot;&quot;);
  const [duration, setDuration] = useState(&quot;12&quot;);
  const [maxStudents, setMaxStudents] = useState(&quot;&quot;);
  const [batchNumber, setBatchNumber] = useState(&quot;1&quot;);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [lecturerId, setLecturerId] = useState(&quot;&quot;);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Fetch lecturers
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<Lecturer[]>(&quot;/api/admin/lecturers&quot;);
        console.log(&quot;Fetched lecturers:&quot;, response.data);
        
        // If we have lecturers, use them
        if (response.data.length > 0) {
          setLecturers(response.data);
          setHasNoLecturers(false);
        } else {
          console.error(&quot;No lecturers found in response&quot;);
          setHasNoLecturers(true);
        }
      } catch (error) {
        console.error(&quot;Error fetching lecturers:&quot;, error);
        toast.error(&quot;Failed to load lecturers. Please check the console for details.&quot;);
        setHasNoLecturers(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLecturers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate) {
      toast.error(&quot;Please select a start date&quot;);
      return;
    }

    if (!lecturerId) {
      toast.error(&quot;Please select a lecturer&quot;);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Calculate end date based on duration (in weeks)
      const endDate = addWeeks(startDate, parseInt(duration));

      // Create class data
      const classData = {
        title,
        description,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        price: parseFloat(price),
        duration: parseInt(duration),
        maxStudents: maxStudents ? parseInt(maxStudents) : null,
        batchNumber: parseInt(batchNumber),
        lecturerId
      };

      // Create live class
      await axios.post(&quot;/api/admin/live-classes&quot;, classData);
      
      toast.success(&quot;Live class created successfully!&quot;);
      router.push(&quot;/admin/live-classes&quot;);
    } catch (error: any) {
      console.error(&quot;Error creating live class:&quot;, error);
      toast.error(error.response?.data?.message || &quot;Failed to create live class&quot;);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ScrollArea className="h-full&quot;>
        <div className=&quot;p-6 space-y-6&quot;>
          <div className=&quot;flex items-center justify-between&quot;>
            <Skeleton className=&quot;h-8 w-64&quot; />
            <Skeleton className=&quot;h-10 w-24&quot; />
          </div>
          <Skeleton className=&quot;h-[500px] w-full&quot; />
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className=&quot;h-full&quot;>
      <div className=&quot;p-6 space-y-6&quot;>
        <div className=&quot;flex items-center justify-between&quot;>
          <h1 className=&quot;text-2xl font-bold&quot;>Create New Live Class</h1>
          <Button variant=&quot;outline&quot; asChild>
            <Link href=&quot;/admin/live-classes&quot;>Cancel</Link>
          </Button>
        </div>

        {hasNoLecturers && (
          <Alert variant=&quot;destructive&quot; className=&quot;bg-red-50 border-red-200 text-red-800&quot;>
            <AlertCircle className=&quot;h-4 w-4 text-red-600&quot; />
            <AlertTitle>No Lecturers Available</AlertTitle>
            <AlertDescription className=&quot;text-red-700&quot;>
              You need to add a lecturer before creating a live class.
              <Link href=&quot;/admin/lecturers/new&quot; className=&quot;ml-2 underline font-medium&quot;>
                Add a lecturer now
              </Link>
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Class Details</CardTitle>
            <CardDescription>
              Set up a new live class for students to enroll in
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className=&quot;space-y-4&quot;>
              <div className=&quot;grid grid-cols-1 md:grid-cols-2 gap-4&quot;>
                <div className=&quot;space-y-2&quot;>
                  <Label htmlFor=&quot;title&quot;>Class Title</Label>
                  <Input 
                    id=&quot;title&quot; 
                    placeholder=&quot;e.g., Project Management&quot; 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required 
                  />
                </div>
                
                <div className=&quot;space-y-2&quot;>
                  <Label htmlFor=&quot;price&quot;>Price (₦)</Label>
                  <Input 
                    id=&quot;price&quot; 
                    type=&quot;number&quot; 
                    placeholder=&quot;e.g., 250000&quot; 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required 
                  />
                </div>

                <div className=&quot;space-y-2&quot;>
                  <Label htmlFor=&quot;duration&quot;>Duration (weeks)</Label>
                  <Input 
                    id=&quot;duration&quot; 
                    type=&quot;number&quot; 
                    placeholder=&quot;e.g., 12&quot; 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required 
                  />
                </div>

                <div className=&quot;space-y-2&quot;>
                  <Label htmlFor=&quot;maxStudents&quot;>Max Students (Optional)</Label>
                  <Input 
                    id=&quot;maxStudents&quot; 
                    type=&quot;number&quot; 
                    placeholder=&quot;e.g., 30&quot; 
                    value={maxStudents}
                    onChange={(e) => setMaxStudents(e.target.value)}
                  />
                </div>

                <div className=&quot;space-y-2&quot;>
                  <Label htmlFor=&quot;batchNumber&quot;>Batch Number</Label>
                  <Input 
                    id=&quot;batchNumber&quot; 
                    type=&quot;number&quot; 
                    placeholder=&quot;e.g., 1&quot; 
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    required 
                  />
                </div>

                <div className=&quot;space-y-2&quot;>
                  <Label>Start Date</Label>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={&quot;outline&quot;}
                        className={cn(
                          &quot;w-full justify-start text-left font-normal&quot;,
                          !startDate && &quot;text-muted-foreground&quot;
                        )}
                      >
                        <CalendarIcon className=&quot;mr-2 h-4 w-4&quot; />
                        {startDate ? format(startDate, &quot;PPP&quot;) : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className=&quot;w-auto p-0&quot;>
                      <Calendar
                        mode=&quot;single&quot;
                        selected={startDate}
                        onSelect={(date) => {
                          setStartDate(date);
                          setCalendarOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className=&quot;space-y-2&quot;>
                  <Label htmlFor=&quot;lecturer&quot;>Lecturer</Label>
                  <Select 
                    value={lecturerId} 
                    onValueChange={setLecturerId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder=&quot;Select a lecturer&quot; />
                    </SelectTrigger>
                    <SelectContent>
                      {lecturers.length === 0 ? (
                        <div className=&quot;p-2 text-sm text-muted-foreground&quot;>
                          No lecturers available
                        </div>
                      ) : (
                        lecturers.map((lecturer) => (
                          <SelectItem key={lecturer.id} value={lecturer.id}>
                            {lecturer.name || lecturer.email}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className=&quot;space-y-2&quot;>
                <Label htmlFor=&quot;description&quot;>Description</Label>
                <textarea
                  id=&quot;description&quot;
                  className=&quot;w-full min-h-[100px] px-3 py-2 border rounded-md&quot;
                  placeholder=&quot;Describe the class content and objectives...&quot;
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <CardFooter className=&quot;px-0 pt-4&quot;>
                <Button 
                  type=&quot;submit&quot; 
                  disabled={isSubmitting || lecturers.length === 0}
                  className=&quot;ml-auto&quot;
                >
                  {isSubmitting ? &quot;Creating...&quot; : &quot;Create Live Class"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
} 