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
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Users, BarChart, Search, XCircle, Check } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";

interface Student {
  id: string;
  name: string | null;
  email: string;
  classId: string;
  className: string;
  joinDate: string;
  purchaseId: string;
  attendanceRate: number;
  isActive: boolean;
}

export default function LecturerStudentsPage() {
  const { user } = useUser();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/lecturer/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Could not load student data");
    } finally {
      setLoading(false);
    }
  };

  const toggleStudentSelection = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const selectAllStudents = (students: Student[]) => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map(student => student.id));
    }
  };

  const sendEmailToSelected = async () => {
    if (selectedStudents.length === 0) {
      toast.error("Please select at least one student");
      return;
    }

    try {
      // This would typically call an API endpoint
      toast.success(`Email would be sent to ${selectedStudents.length} students`);
      // Reset selection after sending
      setSelectedStudents([]);
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email");
    }
  };

  // Extract unique class names for filtering
  const classNames = ["all", ...Array.from(new Set(students.map(student => student.className)))];
  
  // Filter students based on search term and selected class
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = selectedClass === "all" || student.className === selectedClass;
    
    return matchesSearch && matchesClass;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Students</h1>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">You don't have any students yet</p>
            <p className="text-muted-foreground mt-1">
              Students will appear here when they purchase your courses
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Students</h1>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={sendEmailToSelected}
            disabled={selectedStudents.length === 0}
          >
            <Mail className="h-4 w-4 mr-2" />
            Email Selected
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search students..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              className="absolute right-0 top-0 h-9 w-9 p-0"
              onClick={() => setSearchTerm("")}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Class:</span>
          <select
            className="border rounded-md px-2 py-1 text-sm"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {classNames.map((className) => (
              <option key={className} value={className}>
                {className === "all" ? "All Classes" : className}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>
              Student List
              {selectedStudents.length > 0 && (
                <Badge variant="outline" className="ml-2">
                  {selectedStudents.length} selected
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Total: {filteredStudents.length} students
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox 
                    checked={selectedStudents.length === filteredStudents.length && filteredStudents.length > 0}
                    onCheckedChange={() => selectAllStudents(filteredStudents)}
                  />
                </TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={() => toggleStudentSelection(student.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{student.name || "N/A"}</span>
                      <span className="text-xs text-muted-foreground">{student.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{student.className}</TableCell>
                  <TableCell>{format(new Date(student.joinDate), "MMM d, yyyy")}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span 
                        className={`mr-2 ${
                          student.attendanceRate >= 75 ? "text-green-600" : 
                          student.attendanceRate >= 50 ? "text-amber-600" : 
                          "text-red-600"
                        }`}
                      >
                        {student.attendanceRate}%
                      </span>
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            student.attendanceRate >= 75 ? "bg-green-600" : 
                            student.attendanceRate >= 50 ? "bg-amber-600" : 
                            "bg-red-600"
                          }`}
                          style={{ width: `${student.attendanceRate}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={student.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {student.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/lecturer/students/${student.id}`}>
                        <Button variant="outline" size="sm">View Details</Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No students match your search criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}