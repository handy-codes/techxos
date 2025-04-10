"use client&quot;;

import { useState } from &quot;react&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from &quot;@/components/ui/card&quot;;
import { Input } from &quot;@/components/ui/input&quot;;
import { Label } from &quot;@/components/ui/label&quot;;
import { toast } from &quot;react-hot-toast&quot;;
import { ScrollArea } from &quot;@/components/ui/scroll-area&quot;;
import Link from &quot;next/link&quot;;
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from &quot;@/components/ui/form&quot;;
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from &quot;@/components/ui/select&quot;;
import { Calendar as CalendarIcon } from &quot;lucide-react&quot;;
import { Calendar } from &quot;@/components/ui/calendar&quot;;
import { Popover, PopoverContent, PopoverTrigger } from &quot;@/components/ui/popover&quot;;
import { format } from &quot;date-fns&quot;;
import { cn } from &quot;@/lib/utils&quot;;

export default function NewSchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast.success(&quot;Schedule creation coming soon!&quot;);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <ScrollArea className=&quot;h-full&quot;>
      <div className=&quot;p-6 space-y-6&quot;>
        <div className=&quot;flex items-center justify-between&quot;>
          <h1 className=&quot;text-2xl font-bold&quot;>Create New Schedule</h1>
          <Button variant=&quot;outline&quot; asChild>
            <Link href=&quot;/admin/schedule&quot;>Cancel</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Schedule Details</CardTitle>
            <CardDescription>
              Set up a new class schedule for students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className=&quot;space-y-4&quot;>
              <div className=&quot;grid grid-cols-1 md:grid-cols-2 gap-4&quot;>
                <div className=&quot;space-y-2&quot;>
                  <Label htmlFor=&quot;title&quot;>Schedule Title</Label>
                  <Input id=&quot;title&quot; placeholder=&quot;e.g., Week 1: Introduction&quot; required />
                </div>
                
                <div className=&quot;space-y-2&quot;>
                  <Label htmlFor=&quot;class&quot;>Live Class</Label>
                  <Select>
                    <SelectTrigger id=&quot;class&quot;>
                      <SelectValue placeholder=&quot;Select a class&quot; />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=&quot;pm&quot;>Project Management</SelectItem>
                      <SelectItem value=&quot;webdev&quot;>Web Development</SelectItem>
                      <SelectItem value=&quot;uiux&quot;>UI/UX Design</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className=&quot;space-y-2&quot;>
                  <Label>Date</Label>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant=&quot;outline&quot;
                        className={cn(
                          &quot;w-full justify-start text-left font-normal&quot;,
                          !date && &quot;text-muted-foreground&quot;
                        )}
                      >
                        <CalendarIcon className=&quot;mr-2 h-4 w-4&quot; />
                        {date ? format(date, &quot;PPP&quot;) : &quot;Pick a date&quot;}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className=&quot;w-auto p-0&quot;>
                      <Calendar
                        mode=&quot;single&quot;
                        selected={date}
                        onSelect={(date) => {
                          setDate(date);
                          setCalendarOpen(false);
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className=&quot;space-y-2&quot;>
                  <Label htmlFor=&quot;lecturer&quot;>Lecturer</Label>
                  <Select>
                    <SelectTrigger id=&quot;lecturer&quot;>
                      <SelectValue placeholder=&quot;Select a lecturer&quot; />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=&quot;lecturer1&quot;>John Doe</SelectItem>
                      <SelectItem value=&quot;lecturer2&quot;>Jane Smith</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className=&quot;space-y-2&quot;>
                  <Label htmlFor=&quot;start-time&quot;>Start Time</Label>
                  <Input id=&quot;start-time&quot; type=&quot;time&quot; required />
                </div>
                
                <div className=&quot;space-y-2&quot;>
                  <Label htmlFor=&quot;end-time&quot;>End Time</Label>
                  <Input id=&quot;end-time&quot; type=&quot;time&quot; required />
                </div>
              </div>
              
              <div className=&quot;space-y-2&quot;>
                <Label htmlFor=&quot;notes&quot;>Notes</Label>
                <textarea
                  id=&quot;notes&quot;
                  className=&quot;w-full min-h-[100px] px-3 py-2 border rounded-md&quot;
                  placeholder=&quot;Additional details about this schedule...&quot;
                />
              </div>

              <CardFooter className=&quot;px-0 pt-4&quot;>
                <Button type=&quot;submit&quot; disabled={isSubmitting} className=&quot;ml-auto&quot;>
                  {isSubmitting ? &quot;Creating...&quot; : &quot;Create Schedule"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
} 