import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  MessageSquare, 
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  MoreVertical,
  Download,
  Send,
  UserPlus
} from "lucide-react";
import { Link } from "wouter";
import ResourceSidebar from "@/components/layout/resource-sidebar";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface Student {
  id: number;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  enrolledCourses: CourseEnrollment[];
  totalCourses: number;
  completedCourses: number;
  totalCpdPoints: number;
  avgRating: number;
  joinedAt: string;
  lastActive: string;
  status: 'active' | 'inactive' | 'suspended';
}

interface CourseEnrollment {
  courseId: number;
  courseName: string;
  enrolledAt: string;
  progress: number;
  status: 'in_progress' | 'completed' | 'not_started';
  lastAccessedAt: string;
  grade?: number;
}

export default function ResourceStudents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [courseFilter, setCourseFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [studentDialog, setStudentDialog] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data for demonstration
  const mockStudents: Student[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1 234 567 8901",
      avatar: "",
      enrolledCourses: [
        {
          courseId: 1,
          courseName: "Advanced Sports Rehabilitation Techniques",
          enrolledAt: "2024-01-15T00:00:00Z",
          progress: 85,
          status: "in_progress",
          lastAccessedAt: "2024-01-20T10:30:00Z",
          grade: 88
        },
        {
          courseId: 2,
          courseName: "Injury Prevention in Team Sports",
          enrolledAt: "2024-01-10T00:00:00Z",
          progress: 100,
          status: "completed",
          lastAccessedAt: "2024-01-18T14:20:00Z",
          grade: 92
        }
      ],
      totalCourses: 2,
      completedCourses: 1,
      totalCpdPoints: 15,
      avgRating: 4.8,
      joinedAt: "2024-01-01T00:00:00Z",
      lastActive: "2024-01-20T10:30:00Z",
      status: "active"
    },
    {
      id: 2,
      name: "Mike Chen",
      email: "mike.chen@email.com",
      avatar: "",
      enrolledCourses: [
        {
          courseId: 1,
          courseName: "Advanced Sports Rehabilitation Techniques",
          enrolledAt: "2024-01-12T00:00:00Z",
          progress: 65,
          status: "in_progress",
          lastAccessedAt: "2024-01-19T09:15:00Z",
          grade: 78
        }
      ],
      totalCourses: 1,
      completedCourses: 0,
      totalCpdPoints: 8,
      avgRating: 4.2,
      joinedAt: "2024-01-05T00:00:00Z",
      lastActive: "2024-01-19T09:15:00Z",
      status: "active"
    },
    {
      id: 3,
      name: "Emma Davis",
      email: "emma.davis@email.com",
      avatar: "",
      enrolledCourses: [
        {
          courseId: 3,
          courseName: "Performance Analytics for Coaches",
          enrolledAt: "2024-01-08T00:00:00Z",
          progress: 30,
          status: "in_progress",
          lastAccessedAt: "2024-01-16T11:45:00Z"
        }
      ],
      totalCourses: 1,
      completedCourses: 0,
      totalCpdPoints: 3,
      avgRating: 4.5,
      joinedAt: "2024-01-02T00:00:00Z",
      lastActive: "2024-01-16T11:45:00Z",
      status: "active"
    }
  ];

  // Use mock data instead of API call for demonstration
  const { data: students = mockStudents, isLoading } = useQuery<Student[]>({
    queryKey: ['/api/resource/students'],
    queryFn: () => Promise.resolve(mockStudents),
  });

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: async (data: { studentId: number; message: string }) => {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Message sent",
        description: "Your message has been sent to the student.",
      });
    },
  });

  // Filter and sort students
  const filteredStudents = students
    .filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || student.status === statusFilter;
      const matchesCourse = courseFilter === "all" || 
        student.enrolledCourses.some(course => course.courseName.toLowerCase().includes(courseFilter.toLowerCase()));
      
      return matchesSearch && matchesStatus && matchesCourse;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'progress':
          const avgProgressA = a.enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / a.enrolledCourses.length;
          const avgProgressB = b.enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / b.enrolledCourses.length;
          return avgProgressB - avgProgressA;
        case 'cpd':
          return b.totalCpdPoints - a.totalCpdPoints;
        case 'lastActive':
          return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-yellow-500';
      case 'suspended': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setStudentDialog(true);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <ResourceSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading students...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <ResourceSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold">Student Management</h1>
              <p className="text-muted-foreground">Monitor student progress and engagement</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Student
              </Button>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{students.length}</p>
                    <p className="text-sm text-muted-foreground">Total Students</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">{students.filter(s => s.status === 'active').length}</p>
                    <p className="text-sm text-muted-foreground">Active Students</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {Math.round(students.reduce((sum, s) => sum + (s.enrolledCourses.reduce((courseSum, c) => courseSum + c.progress, 0) / s.enrolledCourses.length), 0) / students.length)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Avg Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {students.reduce((sum, s) => sum + s.totalCpdPoints, 0)}
                    </p>
                    <p className="text-sm text-muted-foreground">Total CPD Points</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                <SelectItem value="rehabilitation">Rehabilitation</SelectItem>
                <SelectItem value="prevention">Prevention</SelectItem>
                <SelectItem value="analytics">Analytics</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="progress">Progress</SelectItem>
                <SelectItem value="cpd">CPD Points</SelectItem>
                <SelectItem value="lastActive">Last Active</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredStudents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStudents.map((student) => {
                const avgProgress = student.enrolledCourses.length > 0 
                  ? student.enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / student.enrolledCourses.length
                  : 0;

                return (
                  <Card key={student.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={student.avatar} />
                            <AvatarFallback>{student.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg">{student.name}</CardTitle>
                            <CardDescription>{student.email}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-white ${getStatusColor(student.status)}`}>
                            {student.status}
                          </Badge>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Student Actions</DialogTitle>
                                <DialogDescription>Actions for {student.name}</DialogDescription>
                              </DialogHeader>
                              <div className="flex flex-col gap-2 pt-4">
                                <Button 
                                  variant="outline" 
                                  className="w-full justify-start"
                                  onClick={() => handleViewStudent(student)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                  <Mail className="h-4 w-4 mr-2" />
                                  Send Email
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Send Message
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                  <Download className="h-4 w-4 mr-2" />
                                  Export Progress
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span>{student.totalCourses} courses</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span>{student.completedCourses} completed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Award className="h-4 w-4 text-yellow-600" />
                            <span>{student.totalCpdPoints} CPD points</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span>{student.avgRating.toFixed(1)} rating</span>
                          </div>
                        </div>

                        {/* Overall Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Overall Progress</span>
                            <span className={getProgressColor(avgProgress)}>
                              {Math.round(avgProgress)}%
                            </span>
                          </div>
                          <Progress value={avgProgress} className="h-2" />
                        </div>

                        {/* Last Active */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          Last active {format(new Date(student.lastActive), 'MMM dd, yyyy')}
                        </div>

                        {/* Action Button */}
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => handleViewStudent(student)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Progress
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No students found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all" || courseFilter !== "all"
                  ? "Try adjusting your filters to see more students"
                  : "No students are currently enrolled in your courses"
                }
              </p>
            </Card>
          )}
        </div>

        {/* Student Details Dialog */}
        <Dialog open={studentDialog} onOpenChange={setStudentDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Student Details</DialogTitle>
              <DialogDescription>
                Comprehensive overview of {selectedStudent?.name}'s progress
              </DialogDescription>
            </DialogHeader>

            {selectedStudent && (
              <div className="space-y-6">
                {/* Student Info */}
                <div className="flex items-start gap-4 p-4 bg-muted rounded-lg">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedStudent.avatar} />
                    <AvatarFallback className="text-lg">
                      {selectedStudent.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{selectedStudent.name}</h3>
                    <p className="text-muted-foreground mb-2">{selectedStudent.email}</p>
                    {selectedStudent.phone && (
                      <p className="text-sm text-muted-foreground">{selectedStudent.phone}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span>Joined {format(new Date(selectedStudent.joinedAt), 'MMM dd, yyyy')}</span>
                      <Badge className={`text-white ${getStatusColor(selectedStudent.status)}`}>
                        {selectedStudent.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Course Progress */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold">Course Progress</h4>
                  {selectedStudent.enrolledCourses.map((enrollment) => (
                    <Card key={enrollment.courseId}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h5 className="font-medium">{enrollment.courseName}</h5>
                            <p className="text-sm text-muted-foreground">
                              Enrolled {format(new Date(enrollment.enrolledAt), 'MMM dd, yyyy')}
                            </p>
                          </div>
                          <Badge 
                            className={enrollment.status === 'completed' ? 'bg-green-500' : 
                                     enrollment.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-500'}
                          >
                            {enrollment.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span className={getProgressColor(enrollment.progress)}>
                              {enrollment.progress}%
                            </span>
                          </div>
                          <Progress value={enrollment.progress} className="h-2" />
                        </div>

                        <div className="flex justify-between text-sm text-muted-foreground mt-3">
                          <span>Last accessed {format(new Date(enrollment.lastAccessedAt), 'MMM dd, yyyy')}</span>
                          {enrollment.grade && (
                            <span>Grade: {enrollment.grade}%</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}