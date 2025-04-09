"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Users, Video, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
      const response = await axios.get("/api/lecturer/classes");
      setClasses(response.data);
    } catch (error) {
      console.error("Error fetching classes:", error);
      toast.error("Could not load your classes");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMMM d, yyyy");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Classes</h1>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">You are not assigned to any classes yet</p>
            <p className="text-muted-foreground mt-1">
              Please contact an administrator to be assigned to a class
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My Classes</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((liveClass) => (
          <Card key={liveClass.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{liveClass.title}</CardTitle>
              <CardDescription>
                Batch #{liveClass.batchNumber} • {liveClass.duration} weeks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Starts: {formatDate(liveClass.startTime)}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Ends: {formatDate(liveClass.endTime)}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Students: {liveClass.purchases.length}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Duration: {liveClass.duration} weeks</span>
                </div>
              </div>
              
              <div className="pt-2 space-y-2">
                <Badge className={liveClass.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                  {liveClass.isActive ? "Active" : "Inactive"}
                </Badge>
                
                <div className="flex space-x-2 mt-4">
                  <Button 
                    variant="default" 
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/lecturer/classes/${liveClass.id}`)}
                  >
                    Manage Class
                  </Button>
                  <Link href={`/lecturer/zoom-meetings/new?classId=${liveClass.id}`}>
                    <Button variant="outline" size="sm">
                      <Video className="h-4 w-4 mr-1" />
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