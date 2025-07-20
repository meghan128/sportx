import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  Star,
  Clock,
  TrendingUp,
  Plus,
  Download,
  Share2,
  MoreVertical,
  Calendar,
  Target,
  Award,
  PlayCircle,
  FileText,
  Settings
} from "lucide-react";
import { Link } from "wouter";
import ResourceSidebar from "@/components/layout/resource-sidebar";
import { useToast } from "@/hooks/use-toast";

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  enrolledStudents: number;
  completionRate: number;
  avgRating: number;
  status: 'draft' | 'active' | 'completed' | 'archived';
  lastUpdated: string;
  duration: string;
  cpdPoints: number;
  price: number;
  thumbnail?: string;
}

export default function ResourceCourses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("lastUpdated");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch courses
  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['/api/resource/courses'],
  });

  // Delete course mutation
  const deleteCourse = useMutation({
    mutationFn: async (courseId: number) => {
      const response = await fetch(`/api/resource/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer mock-token-resource',
        },
      });
      if (!response.ok) throw new Error('Failed to delete course');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/resource/courses'] });
      toast({
        title: "Course deleted",
        description: "Course has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete course.",
        variant: "destructive",
      });
    },
  });

  // Duplicate course mutation
  const duplicateCourse = useMutation({
    mutationFn: async (course: Course) => {
      const response = await fetch('/api/resource/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer mock-token-resource',
        },
        body: JSON.stringify({
          ...course,
          title: `${course.title} (Copy)`,
          status: 'draft',
        }),
      });
      if (!response.ok) throw new Error('Failed to duplicate course');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/resource/courses'] });
      toast({
        title: "Course duplicated",
        description: "Course has been successfully duplicated.",
      });
    },
  });

  // Filter and sort courses
  const filteredCourses = courses
    .filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           course.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || course.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || course.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'students':
          return b.enrolledStudents - a.enrolledStudents;
        case 'rating':
          return b.avgRating - a.avgRating;
        case 'completion':
          return b.completionRate - a.completionRate;
        default:
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
      }
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'archived': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const CourseCard = ({ course }: { course: Course }) => (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {course.title}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {course.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`text-white ${getStatusColor(course.status)}`}>
              {course.status}
            </Badge>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Course Actions</DialogTitle>
                  <DialogDescription>Choose an action for "{course.title}"</DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2 pt-4">
                  <Link href={`/resource/course/${course.id}/edit`}>
                    <Button variant="outline" className="w-full justify-start">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Course
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => duplicateCourse.mutate(course)}
                    disabled={duplicateCourse.isPending}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Duplicate Course
                  </Button>
                  <Link href={`/resource/course/${course.id}/preview`}>
                    <Button variant="outline" className="w-full justify-start">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview Course
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 hover:text-red-700"
                    onClick={() => deleteCourse.mutate(course.id)}
                    disabled={deleteCourse.isPending}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Course
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Course Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{course.enrolledStudents} students</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm">{course.avgRating.toFixed(1)} rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{course.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{course.cpdPoints} CPD Points</span>
            </div>
          </div>

          {/* Completion Rate */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Completion Rate</span>
              <span>{course.completionRate}%</span>
            </div>
            <Progress value={course.completionRate} className="h-2" />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Link href={`/resource/course/${course.id}/analytics`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </Link>
            <Link href={`/resource/course/${course.id}/students`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Students
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <ResourceSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading courses...</p>
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
              <h1 className="text-2xl font-bold">My Courses</h1>
              <p className="text-muted-foreground">Manage and track your educational content</p>
            </div>
            <div className="flex gap-3">
              <Link href="/resource/create-course">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              </Link>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search courses..."
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
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="sports-therapy">Sports Therapy</SelectItem>
                <SelectItem value="rehabilitation">Rehabilitation</SelectItem>
                <SelectItem value="performance">Performance</SelectItem>
                <SelectItem value="nutrition">Nutrition</SelectItem>
                <SelectItem value="psychology">Psychology</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lastUpdated">Last Updated</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="students">Students</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="completion">Completion</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="grid" className="space-y-6">
            <TabsList>
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="grid" className="space-y-6">
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || statusFilter !== "all" || categoryFilter !== "all" 
                      ? "Try adjusting your filters" 
                      : "Create your first course to get started"
                    }
                  </p>
                  <Link href="/resource/create-course">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Course
                    </Button>
                  </Link>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="list" className="space-y-4">
              {filteredCourses.length > 0 ? (
                <div className="space-y-4">
                  {filteredCourses.map((course) => (
                    <Card key={course.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-4">
                              <div className="flex-1">
                                <h3 className="font-semibold">{course.title}</h3>
                                <p className="text-sm text-muted-foreground">{course.description}</p>
                              </div>
                              <div className="flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  {course.enrolledStudents}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-500" />
                                  {course.avgRating.toFixed(1)}
                                </div>
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="h-4 w-4" />
                                  {course.completionRate}%
                                </div>
                              </div>
                              <Badge className={`text-white ${getStatusColor(course.status)}`}>
                                {course.status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Link href={`/resource/course/${course.id}/edit`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Link href={`/resource/course/${course.id}/analytics`}>
                              <Button variant="outline" size="sm">
                                <TrendingUp className="h-4 w-4" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || statusFilter !== "all" || categoryFilter !== "all" 
                      ? "Try adjusting your filters" 
                      : "Create your first course to get started"
                    }
                  </p>
                  <Link href="/resource/create-course">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Course
                    </Button>
                  </Link>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}