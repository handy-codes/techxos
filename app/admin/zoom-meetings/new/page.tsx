"use client&quot;;

import { useState, useEffect } from &quot;react&quot;;
import { useRouter } from &quot;next/navigation&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from &quot;@/components/ui/card&quot;;
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from &quot;@/components/ui/select&quot;;
import { CalendarIcon, PlusCircle, Clock, AlertCircle } from &quot;lucide-react&quot;;
import { Calendar } from &quot;@/components/ui/calendar&quot;;
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from &quot;@/components/ui/popover&quot;;
import { cn } from &quot;@/lib/utils&quot;;
import { format } from &quot;date-fns&quot;;
import { toast } from &quot;react-hot-toast&quot;;
import axios from &quot;axios&quot;;
import { ScrollArea } from &quot;@/components/ui/scroll-area&quot;;
import { useForm } from &quot;react-hook-form&quot;;
import { zodResolver } from &quot;@hookform/resolvers/zod&quot;;
import * as z from &quot;zod&quot;;
import Link from &quot;next/link&quot;;
import { Alert, AlertDescription, AlertTitle } from &quot;@/components/ui/alert&quot;;
import { Skeleton } from &quot;@/components/ui/skeleton&quot;;

// Form validation schema
const formSchema = z.object({
  topic: z.string().min(3, { message: &quot;Topic must be at least 3 characters&quot; }),
  agenda: z.string().optional(),
  liveClassId: z.string().min(1, { message: &quot;Please select a live class&quot; }),
  date: z.date({ required_error: &quot;Meeting date is required&quot; }),
  time: z.string().min(1, { message: &quot;Start time is required&quot; }).regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: &quot;Time must be in 24-hour format (HH:MM).&quot;,
  }),
  duration: z.coerce.number().min(10, { message: &quot;Duration must be at least 10 minutes&quot; }).max(300, { message: &quot;Meeting cannot exceed 5 hours (300 minutes).&quot; }),
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
      topic: &quot;",
      agenda: &quot;&quot;,
      liveClassId: &quot;&quot;,
      time: &quot;09:00&quot;,
      duration: 60,
      password: &quot;&quot;,
    },
  });

  // Fetch live classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setIsLoadingClasses(true);
        const response = await axios.get<LiveClass[]>(&quot;/api/admin/live-classes&quot;);
        setLiveClasses(response.data);
        
        // Check if there are no classes available
        if (response.data.length === 0) {
          setHasNoClasses(true);
        }
      } catch (error) {
        console.error(&quot;Error fetching live classes:&quot;, error);
        toast.error(&quot;Failed to load live classes&quot;);
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
      const [hours, minutes] = values.time.split(&quot;:&quot;).map(Number);
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
      const response = await axios.post(&quot;/api/zoom/meetings&quot;, meetingData);
      
      toast.success(&quot;Zoom meeting scheduled successfully&quot;);
      router.push(&quot;/admin/zoom-meetings&quot;);
    } catch (error: any) {
      console.error(&quot;Error scheduling meeting:&quot;, error);
      toast.error(error.response?.data || &quot;Failed to schedule meeting&quot;);
    } finally {
      setIsSubmitting(false);
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
    <ScrollArea className=&quot;h-full&quot;>
      <div className=&quot;p-6 space-y-6&quot;>
        <div className=&quot;flex items-center justify-between&quot;>
          <h1 className=&quot;text-2xl font-bold&quot;>Schedule New Zoom Meeting</h1>
          <Button variant=&quot;outline&quot; asChild>
            <Link href=&quot;/admin/zoom-meetings&quot;>Cancel</Link>
          </Button>
        </div>

        {hasNoClasses && (
          <Alert variant=&quot;destructive&quot; className=&quot;bg-red-50 border-red-200 text-red-800&quot;>
            <AlertCircle className=&quot;h-4 w-4 text-red-600&quot; />
            <AlertTitle>No Live Classes Available</AlertTitle>
            <AlertDescription className=&quot;text-red-700&quot;>
              You need to create a live class before scheduling a Zoom meeting. 
              <Link href=&quot;/admin/live-classes/new&quot; className=&quot;ml-2 underline font-medium&quot;>
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
                className=&quot;space-y-6&quot;
              >
                <div className=&quot;grid grid-cols-1 md:grid-cols-2 gap-6&quot;>
                  {/* Topic */}
                  <div className=&quot;md:col-span-2&quot;>
                    <FormField
                      control={form.control}
                      name=&quot;topic&quot;
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Meeting Topic</FormLabel>
                          <FormControl>
                            <Input
                              placeholder=&quot;Enter meeting topic&quot;
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
                                <SelectValue placeholder={hasNoClasses ? &quot;No classes available&quot; : &quot;Select a live class&quot;} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {liveClasses.length === 0 ? (
                                <div className=&quot;p-2 text-sm text-muted-foreground&quot;>
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
                    name=&quot;date&quot;
                    render={({ field }) => (
                      <FormItem className=&quot;flex flex-col&quot;>
                        <FormLabel>Meeting Date</FormLabel>
                        <Popover open={dateCalendarOpen} onOpenChange={setDateCalendarOpen}>
                          <PopoverTrigger asChild>
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
                    name=&quot;time&quot;
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                          <Input type=&quot;time&quot; {...field} disabled={hasNoClasses} />
                        </FormControl>
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
                            min=&quot;10&quot;
                            max=&quot;300&quot;
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
                    name=&quot;password&quot;
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meeting Password (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder=&quot;Enter password&quot;
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
                  <div className=&quot;md:col-span-2&quot;>
                    <FormField
                      control={form.control}
                      name=&quot;agenda&quot;
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Agenda (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder=&quot;Enter meeting agenda or description&quot;
                              className=&quot;min-h-[100px] resize-y&quot;
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

                <CardFooter className=&quot;px-0 pt-4 flex justify-end gap-2&quot;>
                  <Button
                    type=&quot;button&quot;
                    variant=&quot;outline&quot;
                    onClick={() => router.push(&quot;/admin/zoom-meetings&quot;)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type=&quot;submit&quot; 
                    disabled={isSubmitting || hasNoClasses}
                  >
                    {hasNoClasses 
                      ? &quot;Create a class first&quot; 
                      : isSubmitting 
                        ? &quot;Scheduling...&quot; 
                        : &quot;Schedule Meeting"
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