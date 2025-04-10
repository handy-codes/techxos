"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, PlusCircle, Clock, AlertCircle } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import axios from "axios";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

// Form validation schema
const formSchema = z.object({
  topic: z.string().min(3, { message: "Topic must be at least 3 characters" }),
  agenda: z.string().optional(),
  liveClassId: z.string().min(1, { message: "Please select a live class" }),
  date: z.date({ required_error: "Meeting date is required" }),
  time: z.string().min(1, { message: "Start time is required" }).regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Time must be in 24-hour format (HH:MM).",
  }),
  duration: z.coerce.number().min(10, { message: "Duration must be at least 10 minutes" }).max(300, { message: "Meeting cannot exceed 5 hours (300 minutes)." }),
  password: z.string().optional(),
});

interface LiveClass {
  id: string;
  title: string;
  lecturerId: string;
  lecturer: {
    name: string | null;
    email: string;
  };
}

export default function NewZoomMeetingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [hasNoClasses, setHasNoClasses] = useState(false);
  const [dateCalendarOpen, setDateCalendarOpen] = useState(false);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      agenda: "",
      liveClassId: "",
      time: "09:00",
      duration: 60,
      password: "",
    },
  });

  // Fetch live classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsLoadingClasses(true);
        const response = await axios.get<LiveClass[]>("/api/admin/live-classes");
        setLiveClasses(response.data);
        
        // Check if there are no classes available
        if (response.data.length === 0) {
          setHasNoClasses(true);
        }
      } catch (error) {
        console.error("Error fetching live classes:", error);
        toast.error("Failed to load live classes");
        setHasNoClasses(true);
      } finally {
        setIsLoadingClasses(false);
      }
    };

    fetchClasses();
  }, []);

  // Form submission handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      // Combine date and time
      const dateTime = new Date(values.date);
      const [hours, minutes] = values.time.split(":").map(Number);
      dateTime.setHours(hours, minutes);

      // Prepare meeting data
      const meetingData = {
        topic: values.topic,
        agenda: values.agenda,
        startTime: dateTime.toISOString(),
        duration: values.duration,
        password: values.password,
        liveClassId: values.liveClassId,
      };

      // Create meeting
      const response = await axios.post("/api/zoom/meetings", meetingData);
      
      toast.success("Zoom meeting scheduled successfully");
      router.push("/admin/zoom-meetings");
    } catch (error: any) {
      console.error("Error scheduling meeting:", error);
      toast.error(error.response?.data || "Failed to schedule meeting");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingClasses) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-64" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Schedule New Zoom Meeting</h1>
          <Button variant="outline" asChild>
            <Link href="/admin/zoom-meetings">Cancel</Link>
          </Button>
        </div>

        {hasNoClasses && (
          <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertTitle>No Live Classes Available</AlertTitle>
            <AlertDescription className="text-red-700">
              You need to create a live class before scheduling a Zoom meeting. 
              <Link href="/admin/live-classes/new" className="ml-2 underline font-medium">
                Create a class now
              </Link>
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Meeting Details</CardTitle>
            <CardDescription>
              Fill in the details to schedule a new Zoom meeting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Topic */}
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="topic"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meeting Topic</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter meeting topic"
                              {...field}
                              disabled={hasNoClasses}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Live Class */}
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="liveClassId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Live Class</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isLoadingClasses || hasNoClasses}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={hasNoClasses ? "No classes available" : "Select a live class"} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {liveClasses.length === 0 ? (
                                <div className="p-2 text-sm text-muted-foreground">
                                  No classes available. Please create a class first.
                                </div>
                              ) : (
                                liveClasses.map((liveClass) => (
                                  <SelectItem
                                    key={liveClass.id}
                                    value={liveClass.id}
                                  >
                                    {liveClass.title} (Lecturer: {liveClass.lecturer.name || liveClass.lecturer.email})
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            The live class this meeting is associated with
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Meeting Date */}
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Meeting Date</FormLabel>
                        <Popover open={dateCalendarOpen} onOpenChange={setDateCalendarOpen}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                                disabled={hasNoClasses}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                field.onChange(date);
                                setDateCalendarOpen(false);
                              }}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Start Time */}
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} disabled={hasNoClasses} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Duration */}
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duration (minutes)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="10"
                            max="300"
                            {...field}
                            disabled={hasNoClasses}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meeting Password (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter password"
                            {...field}
                            disabled={hasNoClasses}
                          />
                        </FormControl>
                        <FormDescription>
                          If left blank, a password will be generated automatically
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Agenda */}
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="agenda"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Agenda (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter meeting agenda or description"
                              className="min-h-[100px] resize-y"
                              {...field}
                              disabled={hasNoClasses}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <CardFooter className="px-0 pt-4 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/admin/zoom-meetings")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || hasNoClasses}
                  >
                    {hasNoClasses 
                      ? "Create a class first" 
                      : isSubmitting 
                        ? "Scheduling..." 
                        : "Schedule Meeting"
                    }
                  </Button>
                </CardFooter>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
} 