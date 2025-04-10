"use client&quot;;

import { useState, useEffect } from &quot;react&quot;;
import { useUser } from &quot;@clerk/nextjs&quot;;
import axios from &quot;axios&quot;;
import { toast } from &quot;react-hot-toast&quot;;
import { format } from &quot;date-fns&quot;;
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from &quot;@/components/ui/table&quot;;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from &quot;@/components/ui/card&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import { Skeleton } from &quot;@/components/ui/skeleton&quot;;
import { Badge } from &quot;@/components/ui/badge&quot;;
import { Users, Video, Calendar, Clock } from &quot;lucide-react&quot;;
import Link from &quot;next/link&quot;;
import { useRouter } from &quot;next/navigation&quot;;

interface LiveClass {
  id: string;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  price: number;
  duration: number;
  batchNumber: number;
  isActive: boolean;
  lecturer: {
    id: string;
    name: string | null;
    email: string;
  };
  purchases: {
    id: string;
    studentId: string;
  }[];
}

export default function LecturerClassesPage() {
  const { user } = useUser();
  const router = useRouter();
  const [classes, setClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(&quot;/api/lecturer/classes&quot;);
      setClasses(response.data);
    } catch (error) {
      console.error(&quot;Error fetching classes:&quot;, error);
      toast.error(&quot;Could not load your classes&quot;);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), &quot;MMMM d, yyyy&quot;);
  };

  if (loading) {
    return (
      <div className=&quot;space-y-6&quot;>
        <Skeleton className=&quot;h-8 w-48&quot; />
        <div className=&quot;space-y-4&quot;>
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className=&quot;h-6 w-64&quot; />
                <Skeleton className=&quot;h-4 w-32&quot; />
              </CardHeader>
              <CardContent>
                <Skeleton className=&quot;h-20 w-full&quot; />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className=&quot;space-y-6&quot;>
        <h1 className=&quot;text-2xl font-bold&quot;>My Classes</h1>
        <Card>
          <CardContent className=&quot;pt-6 text-center&quot;>
            <p className=&quot;text-muted-foreground&quot;>You are not assigned to any classes yet</p>
            <p className=&quot;text-muted-foreground mt-1&quot;>
              Please contact an administrator to be assigned to a class
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className=&quot;space-y-6&quot;>
      <h1 className=&quot;text-2xl font-bold&quot;>My Classes</h1>
      
      <div className=&quot;grid gap-6 md:grid-cols-2 lg:grid-cols-3&quot;>
        {classes.map((liveClass) => (
          <Card key={liveClass.id} className=&quot;overflow-hidden&quot;>
            <CardHeader className=&quot;pb-3&quot;>
              <CardTitle className=&quot;text-lg&quot;>{liveClass.title}</CardTitle>
              <CardDescription>
                Batch #{liveClass.batchNumber} • {liveClass.duration} weeks
              </CardDescription>
            </CardHeader>
            <CardContent className=&quot;space-y-4&quot;>
              <div className=&quot;grid grid-cols-2 gap-2 text-sm&quot;>
                <div className=&quot;flex items-center&quot;>
                  <Calendar className=&quot;h-4 w-4 mr-2 text-muted-foreground&quot; />
                  <span>Starts: {formatDate(liveClass.startTime)}</span>
                </div>
                <div className=&quot;flex items-center&quot;>
                  <Calendar className=&quot;h-4 w-4 mr-2 text-muted-foreground&quot; />
                  <span>Ends: {formatDate(liveClass.endTime)}</span>
                </div>
                <div className=&quot;flex items-center&quot;>
                  <Users className=&quot;h-4 w-4 mr-2 text-muted-foreground&quot; />
                  <span>Students: {liveClass.purchases.length}</span>
                </div>
                <div className=&quot;flex items-center&quot;>
                  <Clock className=&quot;h-4 w-4 mr-2 text-muted-foreground&quot; />
                  <span>Duration: {liveClass.duration} weeks</span>
                </div>
              </div>
              
              <div className=&quot;pt-2 space-y-2&quot;>
                <Badge className={liveClass.isActive ? &quot;bg-green-100 text-green-800&quot; : &quot;bg-red-100 text-red-800&quot;}>
                  {liveClass.isActive ? &quot;Active&quot; : &quot;Inactive&quot;}
                </Badge>
                
                <div className=&quot;flex space-x-2 mt-4&quot;>
                  <Button 
                    variant=&quot;default&quot; 
                    size=&quot;sm&quot;
                    className=&quot;flex-1&quot;
                    onClick={() => router.push(`/lecturer/classes/${liveClass.id}`)}
                  >
                    Manage Class
                  </Button>
                  <Link href={`/lecturer/zoom-meetings/new?classId=${liveClass.id}`}>
                    <Button variant=&quot;outline&quot; size=&quot;sm&quot;>
                      <Video className=&quot;h-4 w-4 mr-1" />
                      Schedule Meeting
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 