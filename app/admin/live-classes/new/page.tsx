"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { format, addWeeks } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("12");
  const [maxStudents, setMaxStudents] = useState("");
  const [batchNumber, setBatchNumber] = useState("1");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [lecturerId, setLecturerId] = useState("");
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Fetch lecturers
  useEffect(() => {
    const fetchLecturers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<Lecturer[]>("/api/admin/lecturers");
        console.log("Fetched lecturers:", response.data);
        
        // If we have lecturers, use them
        if (response.data.length > 0) {
          setLecturers(response.data);
          setHasNoLecturers(false);
        } else {
          console.error("No lecturers found in response");
          setHasNoLecturers(true);
        }
      } catch (error) {
        console.error("Error fetching lecturers:", error);
        toast.error("Failed to load lecturers. Please check the console for details.");
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
      toast.error("Please select a start date");
      return;
    }

    if (!lecturerId) {
      toast.error("Please select a lecturer");
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
      await axios.post("/api/admin/live-classes", classData);
      
      toast.success("Live class created successfully!");
      router.push("/admin/live-classes");
    } catch (error: any) {
      console.error("Error creating live class:", error);
      toast.error(error.response?.data?.message || "Failed to create live class");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <ScrollArea className="h-full">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-10 w-24" />
          </div>
          <Skeleton className="h-[500px] w-full" />
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create New Live Class</h1>
          <Button variant="outline" asChild>
            <Link href="/admin/live-classes">Cancel</Link>
          </Button>
        </div>

        {hasNoLecturers && (
          <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle>No Lecturers Available</AlertTitle>
            <AlertDescription className="text-red-700">
              You need to add a lecturer before creating a live class.
              <Link href="/admin/lecturers/new" className="ml-2 underline font-medium">
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Class Title</Label>
                  <Input 
                    id="title" 
                    placeholder="e.g., Project Management" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₦)</Label>
                  <Input 
                    id="price" 
                    type="number" 
                    placeholder="e.g., 250000" 
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (weeks)</Label>
                  <Input 
                    id="duration" 
                    type="number" 
                    placeholder="e.g., 12" 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxStudents">Max Students (Optional)</Label>
                  <Input 
                    id="maxStudents" 
                    type="number" 
                    placeholder="e.g., 30" 
                    value={maxStudents}
                    onChange={(e) => setMaxStudents(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="batchNumber">Batch Number</Label>
                  <Input 
                    id="batchNumber" 
                    type="number" 
                    placeholder="e.g., 1" 
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
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

                <div className="space-y-2">
                  <Label htmlFor="lecturer">Lecturer</Label>
                  <Select 
                    value={lecturerId} 
                    onValueChange={setLecturerId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a lecturer" />
                    </SelectTrigger>
                    <SelectContent>
                      {lecturers.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">
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
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                  placeholder="Describe the class content and objectives..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <CardFooter className="px-0 pt-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || lecturers.length === 0}
                  className="ml-auto"
                >
                  {isSubmitting ? "Creating..." : "Create Live Class"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
} 