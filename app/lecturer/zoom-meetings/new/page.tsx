"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { Calendar as CalendarIcon, Clock, AlertCircle } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

const formSchema = z.object({
  topic: z.string().min(3, {
    message: "Meeting topic must be at least 3 characters.",
  }),
  liveClassId: z.string({
    required_error: "Please select a live class.",
  }),
  date: z.date({
    required_error: "Meeting date is required.",
  }),
  time: z.string({
    required_error: "Meeting time is required.",
  }).regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Time must be in 24-hour format (HH:MM).",
  }),
  duration: z.number({
    required_error: "Duration is required.",
    invalid_type_error: "Duration must be a number.",
  }).min(10, {
    message: "Meeting must be at least 10 minutes.",
  }).max(300, {
    message: "Meeting cannot exceed 5 hours (300 minutes).",
  }),
  password: z.string().optional(),
  agenda: z.string().optional(),
});

interface LiveClass {
  id: string;
  title: string;
  lecturer: {
    name: string | null;
    email: string;
  }
}

export default function NewZoomMeetingPage() {
  const router = useRouter();
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [hasNoClasses, setHasNoClasses] = useState(false);
  const [dateCalendarOpen, setDateCalendarOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      duration: 60,
      password: "",
      agenda: ""
    },
  });
  
  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    fetchLiveClasses();
  }, []);

  const fetchLiveClasses = async () => {
    try {
      setIsLoadingClasses(true);
      const response = await axios.get("/api/lecturer/classes");
      setLiveClasses(response.data);
      
      // Check if there are no classes available
      if (response.data.length === 0) {
        setHasNoClasses(true);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Could not load your classes");
      setHasNoClasses(true);
    } finally {
      setIsLoadingClasses(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Combine date and time into a single timestamp
      const dateTime = new Date(values.date);
      const [hours, minutes] = values.time.split(':').map(Number);
      dateTime.setHours(hours, minutes, 0, 0);

      const meetingData = {
        topic: values.topic,
        liveClassId: values.liveClassId,
        startTime: dateTime.toISOString(),
        duration: values.duration,
        password: values.password || undefined,
        agenda: values.agenda || undefined,
      };

      await axios.post("/api/lecturer/zoom-meetings", meetingData);
      
      toast.success("Meeting scheduled successfully");
      router.push("/lecturer/zoom-meetings");
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      toast.error("Failed to schedule meeting");
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Schedule New Zoom Meeting</h1>
        <p className="text-muted-foreground">
          Create a new live meeting session for your class
        </p>
      </div>

      {hasNoClasses && (
        <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-800">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertTitle>No classes assigned</AlertTitle>
          <AlertDescription className="text-red-700">
            You haven't been assigned to any classes yet. Please contact an administrator to be assigned as a lecturer to a class before you can schedule meetings.
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Meeting Topic */}
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="topic"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting Topic</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter meeting topic" {...field} disabled={hasNoClasses} />
                      </FormControl>
                      <FormDescription>
                        A descriptive name for your meeting
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Live Class Selection */}
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
                            <SelectValue placeholder={hasNoClasses ? "No classes assigned" : "Select a live class"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {liveClasses.length === 0 ? (
                            <div className="p-2 text-sm text-muted-foreground">
                              You haven't been assigned to any classes yet.
                            </div>
                          ) : (
                            liveClasses.map((liveClass) => (
                              <SelectItem
                                key={liveClass.id}
                                value={liveClass.id}
                              >
                                {liveClass.title}
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
                    <FormLabel>Date</FormLabel>
                    <Popover open={dateCalendarOpen} onOpenChange={setDateCalendarOpen}>
                      <PopoverTrigger asChild disabled={hasNoClasses}>
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
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      The date when the meeting will take place
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Meeting Time */}
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <div className="flex items-center">
                      <FormControl>
                        <Input
                          placeholder="HH:MM"
                          {...field}
                          disabled={hasNoClasses}
                        />
                      </FormControl>
                      <Clock className="ml-2 h-4 w-4 opacity-50" />
                    </div>
                    <FormDescription>
                      The start time in 24-hour format (e.g., 14:30)
                    </FormDescription>
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
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        disabled={hasNoClasses}
                      />
                    </FormControl>
                    <FormDescription>
                      How long the meeting will last
                    </FormDescription>
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
                    <FormLabel>Password (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Meeting password" 
                        {...field} 
                        disabled={hasNoClasses}
                      />
                    </FormControl>
                    <FormDescription>
                      Set a password for additional security
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
                          placeholder="Meeting agenda and details"
                          className="min-h-[100px]"
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
          </div>

          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/lecturer/zoom-meetings")}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || hasNoClasses}
            >
              {hasNoClasses 
                ? "No classes available" 
                : isSubmitting 
                  ? "Scheduling..." 
                  : "Schedule Meeting"
              }
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}