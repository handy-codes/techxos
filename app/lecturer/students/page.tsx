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
import { Input } from &quot;@/components/ui/input&quot;;
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from &quot;@/components/ui/card&quot;;
import { Button } from &quot;@/components/ui/button&quot;;
import { Skeleton } from &quot;@/components/ui/skeleton&quot;;
import { Badge } from &quot;@/components/ui/badge&quot;;
import { Tabs, TabsContent, TabsList, TabsTrigger } from &quot;@/components/ui/tabs&quot;;
import { Mail, Users, BarChart, Search, XCircle, Check } from &quot;lucide-react&quot;;
import { Checkbox } from &quot;@/components/ui/checkbox&quot;;
import Link from &quot;next/link&quot;;

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
  const [searchTerm, setSearchTerm] = useState(&quot;");
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string>(&quot;all&quot;);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(&quot;/api/lecturer/students&quot;);
      setStudents(response.data);
    } catch (error) {
      console.error(&quot;Error fetching students:&quot;, error);
      toast.error(&quot;Could not load student data&quot;);
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
      toast.error(&quot;Please select at least one student&quot;);
      return;
    }

    try {
      // This would typically call an API endpoint
      toast.success(`Email would be sent to ${selectedStudents.length} students`);
      // Reset selection after sending
      setSelectedStudents([]);
    } catch (error) {
      console.error(&quot;Error sending email:&quot;, error);
      toast.error(&quot;Failed to send email&quot;);
    }
  };

  // Extract unique class names for filtering
  const classNames = [&quot;all&quot;, ...Array.from(new Set(students.map(student => student.className)))];
  
  // Filter students based on search term and selected class
  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = selectedClass === &quot;all&quot; || student.className === selectedClass;
    
    return matchesSearch && matchesClass;
  });

  if (loading) {
    return (
      <div className="space-y-6&quot;>
        <Skeleton className=&quot;h-8 w-48&quot; />
        <Skeleton className=&quot;h-10 w-full&quot; />
        <Skeleton className=&quot;h-[400px] w-full&quot; />
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className=&quot;space-y-6&quot;>
        <h1 className=&quot;text-2xl font-bold&quot;>Students</h1>
        <Card>
          <CardContent className=&quot;pt-6 text-center&quot;>
            <p className=&quot;text-muted-foreground&quot;>You don&apos;t have any students yet</p>
            <p className=&quot;text-muted-foreground mt-1&quot;>
              Students will appear here when they purchase your courses
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className=&quot;space-y-6&quot;>
      <div className=&quot;flex justify-between items-center&quot;>
        <h1 className=&quot;text-2xl font-bold&quot;>Students</h1>
        <div className=&quot;flex items-center space-x-2&quot;>
          <Button 
            variant=&quot;outline&quot; 
            size=&quot;sm&quot;
            onClick={sendEmailToSelected}
            disabled={selectedStudents.length === 0}
          >
            <Mail className=&quot;h-4 w-4 mr-2&quot; />
            Email Selected
          </Button>
        </div>
      </div>
      
      <div className=&quot;flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between&quot;>
        <div className=&quot;relative w-full max-w-md&quot;>
          <Search className=&quot;absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground&quot; />
          <Input
            type=&quot;search&quot;
            placeholder=&quot;Search students...&quot;
            className=&quot;pl-8&quot;
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <Button
              variant=&quot;ghost&quot;
              className=&quot;absolute right-0 top-0 h-9 w-9 p-0&quot;
              onClick={() => setSearchTerm(&quot;")}
            >
              <XCircle className=&quot;h-4 w-4&quot; />
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-2&quot;>
          <span className=&quot;text-sm font-medium&quot;>Class:</span>
          <select
            className=&quot;border rounded-md px-2 py-1 text-sm&quot;
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            {classNames.map((className) => (
              <option key={className} value={className}>
                {className === &quot;all&quot; ? &quot;All Classes&quot; : className}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <Card>
        <CardHeader className=&quot;pb-3&quot;>
          <div className=&quot;flex justify-between items-center&quot;>
            <CardTitle>
              Student List
              {selectedStudents.length > 0 && (
                <Badge variant=&quot;outline&quot; className=&quot;ml-2&quot;>
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
                <TableHead className=&quot;w-10&quot;>
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
                    <div className=&quot;flex flex-col&quot;>
                      <span className=&quot;font-medium&quot;>{student.name || &quot;N/A&quot;}</span>
                      <span className=&quot;text-xs text-muted-foreground&quot;>{student.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{student.className}</TableCell>
                  <TableCell>{format(new Date(student.joinDate), &quot;MMM d, yyyy&quot;)}</TableCell>
                  <TableCell>
                    <div className=&quot;flex items-center&quot;>
                      <span 
                        className={`mr-2 ${
                          student.attendanceRate >= 75 ? &quot;text-green-600&quot; : 
                          student.attendanceRate >= 50 ? &quot;text-amber-600&quot; : 
                          &quot;text-red-600&quot;
                        }`}
                      >
                        {student.attendanceRate}%
                      </span>
                      <div className=&quot;w-20 h-2 bg-gray-200 rounded-full overflow-hidden&quot;>
                        <div 
                          className={`h-full ${
                            student.attendanceRate >= 75 ? &quot;bg-green-600&quot; : 
                            student.attendanceRate >= 50 ? &quot;bg-amber-600&quot; : 
                            &quot;bg-red-600&quot;
                          }`}
                          style={{ width: `${student.attendanceRate}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={student.isActive ? &quot;bg-green-100 text-green-800&quot; : &quot;bg-red-100 text-red-800&quot;}>
                      {student.isActive ? &quot;Active&quot; : &quot;Inactive&quot;}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className=&quot;flex space-x-2&quot;>
                      <Link href={`/lecturer/students/${student.id}`}>
                        <Button variant=&quot;outline&quot; size=&quot;sm&quot;>View Details</Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredStudents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className=&quot;text-center py-6 text-muted-foreground">
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