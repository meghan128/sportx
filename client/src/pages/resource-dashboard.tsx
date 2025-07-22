import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

import { 
  BookOpen, 
  Users, 
  FileText, 
  CheckSquare, 
  TrendingUp,
  Clock,
  Star,
  Award,
  Target,
  Activity,
  PlusCircle,
  DollarSign,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Calendar,
  Zap
} from "lucide-react";
import { Link } from "wouter";
import ResourceSidebar from "@/components/layout/resource-sidebar";
import { format } from "date-fns";

interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  pendingSubmissions: number;
  pendingApprovals: number;
  totalRevenue: number;
  avgRating: number;
  completionRate: number;
  activeCourses: number;
}

interface RecentActivity {
  id: number;
  type: 'submission' | 'enrollment' | 'completion' | 'review';
  title: string;
  subtitle: string;
  timestamp: string;
  status?: 'pending' | 'completed' | 'approved';
}

interface TopCourse {
  id: number;
  name: string;
  students: number;
  rating: number;
  revenue: number;
  completionRate: number;
}

export default function ResourceDashboard() {
  // Mock data for demonstration
  const mockStats: DashboardStats = {
    totalCourses: 8,
    totalStudents: 245,
    pendingSubmissions: 7,
    pendingApprovals: 3,
    totalRevenue: 37750,
    avgRating: 4.7,
    completionRate: 85,
    activeCourses: 6
  };

  const mockRecentActivity: RecentActivity[] = [
    {
      id: 1,
      type: 'submission',
      title: 'New Assignment Submission',
      subtitle: 'Sarah Johnson submitted Module 3 Assignment',
      timestamp: '2024-01-20T10:30:00Z',
      status: 'pending'
    },
    {
      id: 2,
      type: 'enrollment',
      title: 'New Course Enrollment',
      subtitle: 'Mike Chen enrolled in Advanced Rehabilitation',
      timestamp: '2024-01-20T09:15:00Z',
      status: 'completed'
    },
    {
      id: 3,
      type: 'completion',
      title: 'Course Completed',
      subtitle: 'Emma Davis completed Injury Prevention course',
      timestamp: '2024-01-20T08:45:00Z',
      status: 'completed'
    },
    {
      id: 4,
      type: 'review',
      title: 'Course Review',
      subtitle: 'New 5-star review for Performance Analytics',
      timestamp: '2024-01-19T16:20:00Z',
      status: 'approved'
    }
  ];

  const mockTopCourses: TopCourse[] = [
    {
      id: 1,
      name: 'Advanced Sports Rehabilitation Techniques',
      students: 89,
      rating: 4.8,
      revenue: 12250,
      completionRate: 87
    },
    {
      id: 2,
      name: 'Injury Prevention in Team Sports',
      students: 76,
      rating: 4.6,
      revenue: 9900,
      completionRate: 92
    },
    {
      id: 3,
      name: 'Performance Analytics for Coaches',
      students: 65,
      rating: 4.9,
      revenue: 15600,
      completionRate: 78
    }
  ];

  const { data: stats = mockStats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/resource/stats'],
    queryFn: () => Promise.resolve(mockStats),
  });

  const { data: recentActivity = mockRecentActivity } = useQuery<RecentActivity[]>({
    queryKey: ['/api/resource/activity'],
    queryFn: () => Promise.resolve(mockRecentActivity),
  });

  const { data: topCourses = mockTopCourses } = useQuery<TopCourse[]>({
    queryKey: ['/api/resource/top-courses'],
    queryFn: () => Promise.resolve(mockTopCourses),
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'submission': return <FileText className="h-4 w-4" />;
      case 'enrollment': return <Users className="h-4 w-4" />;
      case 'completion': return <CheckCircle className="h-4 w-4" />;
      case 'review': return <Star className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (statsLoading) {
    return (
      <div className="flex h-screen bg-background">
        <ResourceSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading dashboard...</p>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Resource Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here's what's happening with your courses and students.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/resource/create-course">
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create Course
                </Button>
              </Link>
              <Link href="/resource-analytics">
                <Button variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats Overview */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalCourses}</p>
                    <p className="text-sm text-muted-foreground">Total Courses</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-600 font-medium">{stats.activeCourses} active</span>
                  <span className="text-muted-foreground ml-1">• {stats.totalCourses - stats.activeCourses} archived</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.totalStudents}</p>
                    <p className="text-sm text-muted-foreground">Total Students</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+12% this month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.pendingSubmissions}</p>
                    <p className="text-sm text-muted-foreground">Pending Reviews</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/resource-submissions">
                    <Button variant="outline" size="sm">
                      Review Now
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">+8.2% vs last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Average Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="text-2xl font-bold">{stats.avgRating}</span>
                  <span className="text-sm text-muted-foreground">/ 5.0</span>
                </div>
                <Progress value={(stats.avgRating / 5) * 100} className="mt-3" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Completion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-green-500" />
                  <span className="text-2xl font-bold">{stats.completionRate}%</span>
                </div>
                <Progress value={stats.completionRate} className="mt-3" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Pending Approvals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <CheckSquare className="h-5 w-5 text-blue-500" />
                  <span className="text-2xl font-bold">{stats.pendingApprovals}</span>
                </div>
                <div className="mt-3">
                  <Link href="/resource-approvals">
                    <Button variant="outline" size="sm">
                      Review Approvals
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Activity */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates from your courses</CardDescription>
                </div>
                <Activity className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4">
                      <div className="p-2 bg-muted rounded-lg">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{activity.title}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {activity.subtitle}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(activity.timestamp), 'MMM dd, yyyy HH:mm')}
                        </p>
                      </div>
                      {activity.status && (
                        <Badge className={getStatusColor(activity.status)} variant="secondary">
                          {activity.status}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    View All Activity
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Top Performing Courses */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Top Performing Courses</CardTitle>
                  <CardDescription>Your most successful courses</CardDescription>
                </div>
                <Award className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCourses.map((course, index) => (
                    <div key={course.id} className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{course.name}</p>
                        <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{course.students} students</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3" />
                            <span>{course.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Target className="h-3 w-3" />
                            <span>{course.completionRate}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">${course.revenue.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Link href="/resource-courses">
                    <Button variant="outline" className="w-full">
                      View All Courses
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks to help you manage your courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Link href="/resource/create-course">
                  <Button variant="outline" className="w-full justify-start h-auto p-4">
                    <div className="flex flex-col items-start space-y-1">
                      <div className="flex items-center space-x-2">
                        <PlusCircle className="h-4 w-4" />
                        <span className="font-medium">Create Course</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Start a new course</span>
                    </div>
                  </Button>
                </Link>
                
                <Link href="/resource/create-workshop">
                  <Button variant="outline" className="w-full justify-start h-auto p-4">
                    <div className="flex flex-col items-start space-y-1">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">Create Workshop</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Schedule new workshop</span>
                    </div>
                  </Button>
                </Link>

                <Link href="/resource-submissions">
                  <Button variant="outline" className="w-full justify-start h-auto p-4">
                    <div className="flex flex-col items-start space-y-1">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span className="font-medium">Review Submissions</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{stats.pendingSubmissions} pending</span>
                    </div>
                  </Button>
                </Link>

                <Link href="/resource-analytics">
                  <Button variant="outline" className="w-full justify-start h-auto p-4">
                    <div className="flex flex-col items-start space-y-1">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4" />
                        <span className="font-medium">View Analytics</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Performance insights</span>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}