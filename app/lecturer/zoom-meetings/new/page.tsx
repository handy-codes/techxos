"use client&quot;;

import { useState, useEffect } from &quot;react&quot;;
import { zodResolver } from &quot;@hookform/resolvers/zod&quot;;
import { useForm } from &quot;react-hook-form&quot;;
import { useRouter } from &quot;next/navigation&quot;;
import axios from &quot;axios&quot;;
import { toast } from &quot;react-hot-toast&quot;;
import { z } from &quot;zod&quot;;
import { Calendar as CalendarIcon, Clock, AlertCircle } from &quot;lucide-react&quot;;
import { format } from &quot;date-fns&quot;;

import { Button } from &quot;@/components/ui/button&quot;;
import { Calendar } from &quot;@/components/ui/calendar&quot;;
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from &quot;@/components/ui/form&quot;;
import { Input } from &quot;@/components/ui/input&quot;;
import { Textarea } from &quot;@/components/ui/textarea&quot;;
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from &quot;@/components/ui/popover&quot;;
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from &quot;@/components/ui/select&quot;;
import { cn } from &quot;@/lib/utils&quot;;
import { Skeleton } from &quot;@/components/ui/skeleton&quot;;
import { Alert, AlertDescription, AlertTitle } from &quot;@/components/ui/alert&quot;;
import Link from &quot;next/link&quot;;

const formSchema = z.object({
  topic: z.string().min(3, {
    message: &quot;Meeting topic must be at least 3 characters.&quot;,
  }),
  liveClassId: z.string({
    required_error: &quot;Please select a live class.&quot;,
  }),
  date: z.date({
    required_error: &quot;Meeting date is required.&quot;,
  }),
  time: z.string({
    required_error: &quot;Meeting time is required.&quot;,
  }).regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: &quot;Time must be in 24-hour format (HH:MM).&quot;,
  }),
  duration: z.number({
    required_error: &quot;Duration is required.&quot;,
    invalid_type_error: &quot;Duration must be a number.&quot;,
  }).min(10, {
    message: &quot;Meeting must be at least 10 minutes.&quot;,
  }).max(300, {
    message: &quot;Meeting cannot exceed 5 hours (300 minutes).&quot;,
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
      topic: &quot;",
      duration: 60,
      password: &quot;&quot;,
      agenda: &quot;&quot;
    },
  });
  
  const isSubmitting = form.formState.isSubmitting;

  useEffect(() => {
    fetchLiveClasses();
  }, []);

  const fetchLiveClasses = async () => {
    try {
      setIsLoadingClasses(true);
      const response = await axios.get(&quot;/api/lecturer/classes&quot;);
      setLiveClasses(response.data);
      
      // Check if there are no classes available
      if (response.data.length === 0) {
        setHasNoClasses(true);
      }
    } catch (error) {
      console.error(&quot;Error fetching classes:&quot;, error);
      toast.error(&quot;Could not load your classes&quot;);
      setHasNoClasses(true);
    } finally {
      setIsLoadingClasses(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Combine date and time into a single timestamp
      const dateTime = new Date(values.date);
      const [hours, minutes] = values.time.split(&apos;:&apos;).map(Number);
      dateTime.setHours(hours, minutes, 0, 0);

      const meetingData = {
        topic: values.topic,
        liveClassId: values.liveClassId,
        startTime: dateTime.toISOString(),
        duration: values.duration,
        password: values.password || undefined,
        agenda: values.agenda || undefined,
      };

      await axios.post(&quot;/api/lecturer/zoom-meetings&quot;, meetingData);
      
      toast.success(&quot;Meeting scheduled successfully&quot;);
      router.push(&quot;/lecturer/zoom-meetings&quot;);
    } catch (error) {
      console.error(&quot;Error scheduling meeting:&quot;, error);
      toast.error(&quot;Failed to schedule meeting&quot;);
    }
  };

  if (isLoadingClasses) {
    return (
      <div className="space-y-8&quot;>
        <Skeleton className=&quot;h-8 w-64&quot; />
        <div className=&quot;space-y-4&quot;>
          <Skeleton className=&quot;h-4 w-32&quot; />
          <Skeleton className=&quot;h-10 w-full&quot; />
          <Skeleton className=&quot;h-4 w-32&quot; />
          <Skeleton className=&quot;h-10 w-full&quot; />
          <Skeleton className=&quot;h-4 w-32&quot; />
          <Skeleton className=&quot;h-10 w-full&quot; />
        </div>
      </div>
    );
  }

  return (
    <div className=&quot;space-y-6&quot;>
      <div>
        <h1 className=&quot;text-2xl font-bold&quot;>Schedule New Zoom Meeting</h1>
        <p className=&quot;text-muted-foreground&quot;>
          Create a new live meeting session for your class
        </p>
      </div>

      {hasNoClasses && (
        <Alert variant=&quot;destructive&quot; className=&quot;bg-red-50 border-red-200 text-red-800&quot;>
          <AlertCircle className=&quot;h-4 w-4 text-red-600&quot; />
          <AlertTitle>No classes assigned</AlertTitle>
          <AlertDescription className=&quot;text-red-700&quot;>
            You haven&apos;t been assigned to any classes yet. Please contact an administrator to be assigned as a lecturer to a class before you can schedule meetings.
          </AlertDescription>
        </Alert>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className=&quot;space-y-8&quot;>
          <div className=&quot;space-y-4&quot;>
            <div className=&quot;grid gap-4 md:grid-cols-2&quot;>
              {/* Meeting Topic */}
              <div className=&quot;md:col-span-2&quot;>
                <FormField
                  control={form.control}
                  name=&quot;topic&quot;
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meeting Topic</FormLabel>
                      <FormControl>
                        <Input placeholder=&quot;Enter meeting topic&quot; {...field} disabled={hasNoClasses} />
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
              <div className=&quot;md:col-span-2&quot;>
                <FormField
                  control={form.control}
                  name=&quot;liveClassId&quot;
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
                            <SelectValue placeholder={hasNoClasses ? &quot;No classes assigned&quot; : &quot;Select a live class&quot;} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {liveClasses.length === 0 ? (
                            <div className=&quot;p-2 text-sm text-muted-foreground&quot;>
                              You haven&apos;t been assigned to any classes yet.
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
                name=&quot;date&quot;
                render={({ field }) => (
                  <FormItem className=&quot;flex flex-col&quot;>
                    <FormLabel>Date</FormLabel>
                    <Popover open={dateCalendarOpen} onOpenChange={setDateCalendarOpen}>
                      <PopoverTrigger asChild disabled={hasNoClasses}>
                        <FormControl>
                          <Button
                            variant={&quot;outline&quot;}
                            className={cn(
                              &quot;w-full pl-3 text-left font-normal&quot;,
                              !field.value && &quot;text-muted-foreground&quot;
                            )}
                            disabled={hasNoClasses}
                          >
                            {field.value ? (
                              format(field.value, &quot;PPP&quot;)
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className=&quot;ml-auto h-4 w-4 opacity-50&quot; />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className=&quot;w-auto p-0&quot; align=&quot;start&quot;>
                        <Calendar
                          mode=&quot;single&quot;
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
                name=&quot;time&quot;
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <div className=&quot;flex items-center&quot;>
                      <FormControl>
                        <Input
                          placeholder=&quot;HH:MM&quot;
                          {...field}
                          disabled={hasNoClasses}
                        />
                      </FormControl>
                      <Clock className=&quot;ml-2 h-4 w-4 opacity-50&quot; />
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
                name=&quot;duration&quot;
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <FormControl>
                      <Input
                        type=&quot;number&quot;
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
                name=&quot;password&quot;
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder=&quot;Meeting password&quot; 
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
              <div className=&quot;md:col-span-2&quot;>
                <FormField
                  control={form.control}
                  name=&quot;agenda&quot;
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Agenda (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder=&quot;Meeting agenda and details&quot;
                          className=&quot;min-h-[100px]&quot;
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

          <div className=&quot;flex items-center gap-4&quot;>
            <Button
              type=&quot;button&quot;
              variant=&quot;outline&quot;
              onClick={() => router.push(&quot;/lecturer/zoom-meetings&quot;)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type=&quot;submit&quot; 
              disabled={isSubmitting || hasNoClasses}
            >
              {hasNoClasses 
                ? &quot;No classes available&quot; 
                : isSubmitting 
                  ? &quot;Scheduling...&quot; 
                  : &quot;Schedule Meeting"
              }
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}