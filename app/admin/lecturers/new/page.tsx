"use client&quot;;

import { useState } from &quot;react&quot;;
import { useRouter } from &quot;next/navigation&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from &quot;@/components/ui/card&quot;;
import { Input } from &quot;@/components/ui/input&quot;;
import { Label } from &quot;@/components/ui/label&quot;;
import { toast } from &quot;react-hot-toast&quot;;
import { ScrollArea } from &quot;@/components/ui/scroll-area&quot;;
import Link from &quot;next/link&quot;;
import axios from &quot;axios&quot;;

export default function NewLecturerPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState(&quot;");
  const [email, setEmail] = useState(&quot;&quot;);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error(&quot;Email is required&quot;);
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Create lecturer data
      const lecturerData = {
        name: name || null, // Allow null name
        email,
      };

      // Create lecturer
      await axios.post(&quot;/api/admin/lecturers&quot;, lecturerData);
      
      toast.success(&quot;Lecturer added successfully!&quot;);
      router.push(&quot;/admin/live-classes/new&quot;);
    } catch (error: any) {
      console.error(&quot;Error adding lecturer:&quot;, error);
      toast.error(error.response?.data || &quot;Failed to add lecturer&quot;);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollArea className="h-full&quot;>
      <div className=&quot;p-6 space-y-6&quot;>
        <div className=&quot;flex items-center justify-between&quot;>
          <h1 className=&quot;text-2xl font-bold&quot;>Add New Lecturer</h1>
          <Button variant=&quot;outline&quot; asChild>
            <Link href=&quot;/admin/live-classes/new&quot;>Cancel</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lecturer Details</CardTitle>
            <CardDescription>
              Add a new lecturer to assign to live classes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className=&quot;space-y-4&quot;>
              <div className=&quot;space-y-4&quot;>
                <div className=&quot;space-y-2&quot;>
                  <Label htmlFor=&quot;name&quot;>Lecturer Name (Optional)</Label>
                  <Input 
                    id=&quot;name&quot; 
                    placeholder=&quot;e.g., John Doe&quot; 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className=&quot;space-y-2&quot;>
                  <Label htmlFor=&quot;email&quot;>Email Address</Label>
                  <Input 
                    id=&quot;email&quot; 
                    type=&quot;email&quot; 
                    placeholder=&quot;e.g., lecturer@example.com&quot; 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                  />
                </div>
              </div>

              <CardFooter className=&quot;px-0 pt-4&quot;>
                <Button 
                  type=&quot;submit&quot; 
                  disabled={isSubmitting}
                  className=&quot;ml-auto&quot;
                >
                  {isSubmitting ? &quot;Adding...&quot; : &quot;Add Lecturer"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
} 