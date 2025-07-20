import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Calendar, 
  Users, 
  MessageSquare, 
  Award, 
  BarChart3, 
  FileText, 
  CheckSquare,
  Clock,
  TrendingUp,
  Star,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ResourceSidebar from "@/components/layout/resource-sidebar";

interface ResourceStats {
  totalCourses: number;
  activeCourses: number;
  totalStudents: number;
  pendingReviews: number;
  avgRating: number;
  thisMonthCompletions: number;
}

interface Course {
  id: number;
  title: string;
  enrolledStudents: number;
  completionRate: number;
  avgRating: number;
  status: 'active' | 'draft' | 'completed';
  lastUpdated: string;
}

interface Submission {
  id: number;
  studentName: string;
  courseName: string;
  submissionType: string;
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'approved' | 'needs_revision';
}

interface PendingApproval {
  id: number;
  type: 'course' | 'badge' | 'accreditation';
  title: string;
  submittedBy: string;
  submittedAt: string;
  priority: 'high' | 'medium' | 'low';
}

export default function ResourceDashboard() {
  const { user } = useAuth();

  // Resource dashboard data queries
  const { data: stats, isLoading: statsLoading } = useQuery<ResourceStats>({
    queryKey: ['/api/resource/stats'],
  });

  const { data: myCourses, isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ['/api/resource/courses'],
  });

  const { data: submissions, isLoading: submissionsLoading } = useQuery<Submission[]>({
    queryKey: ['/api/resource/submissions/pending'],
  });

  const { data: pendingApprovals, isLoading: approvalsLoading } = useQuery<PendingApproval[]>({
    queryKey: ['/api/resource/approvals/pending'],
  });

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <ResourceSidebar />
      <main className="flex-1 ml-64">
        <div className="container mx-auto p-6 space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.profileImage} alt={user?.name} />
            <AvatarFallback>
              {user?.name?.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name}</h1>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Resource Personnel
              </Badge>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{user?.profession}</span>
            </div>
          </div>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Create Content
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalCourses || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.activeCourses || 0} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalStudents || 0}</div>
            <p className="text-xs text-muted-foreground">
              Across all courses
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pendingReviews || 0}</div>
            <p className="text-xs text-muted-foreground">
              Submissions waiting
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.avgRating || 0}</div>
            <p className="text-xs text-muted-foreground">
              Course ratings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.thisMonthCompletions || 0}</div>
            <p className="text-xs text-muted-foreground">
              Completions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              Unread messages
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="ai-logs">AI Logs</TabsTrigger>
        </TabsList>

        {/* My Courses Tab */}
        <TabsContent value="courses">
          <div className="grid gap-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Courses</h2>
              <Button>
                <BookOpen className="h-4 w-4 mr-2" />
                Create New Course
              </Button>
            </div>
            
            <div className="grid gap-4">
              {coursesLoading ? (
                <LoadingSpinner />
              ) : myCourses?.length ? (
                myCourses.map((course) => (
                  <Card key={course.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{course.title}</CardTitle>
                          <CardDescription className="flex items-center space-x-4 mt-2">
                            <span className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              {course.enrolledStudents} students
                            </span>
                            <span className="flex items-center">
                              <Star className="h-4 w-4 mr-1" />
                              {course.avgRating}/5.0
                            </span>
                          </CardDescription>
                        </div>
                        <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                          {course.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Completion Rate</span>
                          <span className="text-sm font-medium">{course.completionRate}%</span>
                        </div>
                        <Progress value={course.completionRate} className="h-2" />
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-xs text-muted-foreground">
                            Last updated: {new Date(course.lastUpdated).toLocaleDateString()}
                          </span>
                          <div className="space-x-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm">View</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No courses created yet</p>
                    <Button className="mt-4">Create Your First Course</Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Submissions Tab */}
        <TabsContent value="submissions">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Student Submissions</h2>
              <Badge variant="outline">
                {submissions?.filter(s => s.status === 'pending').length || 0} pending
              </Badge>
            </div>

            <div className="grid gap-4">
              {submissionsLoading ? (
                <LoadingSpinner />
              ) : submissions?.length ? (
                submissions.map((submission) => (
                  <Card key={submission.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{submission.studentName}</CardTitle>
                          <CardDescription>
                            {submission.courseName} - {submission.submissionType}
                          </CardDescription>
                        </div>
                        <Badge 
                          variant={
                            submission.status === 'pending' ? 'destructive' :
                            submission.status === 'approved' ? 'default' :
                            submission.status === 'needs_revision' ? 'secondary' : 'outline'
                          }
                        >
                          {submission.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                        </span>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">
                            <CheckSquare className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                          <Button variant="outline" size="sm">Download</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No submissions to review</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Approvals Tab */}
        <TabsContent value="approvals">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Pending Approvals</h2>
              <Badge variant="outline">
                {pendingApprovals?.length || 0} items
              </Badge>
            </div>

            <div className="grid gap-4">
              {approvalsLoading ? (
                <LoadingSpinner />
              ) : pendingApprovals?.length ? (
                pendingApprovals.map((approval) => (
                  <Card key={approval.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{approval.title}</CardTitle>
                          <CardDescription>
                            Submitted by {approval.submittedBy} • {approval.type}
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          {approval.priority === 'high' && (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                          <Badge variant={
                            approval.priority === 'high' ? 'destructive' :
                            approval.priority === 'medium' ? 'default' : 'secondary'
                          }>
                            {approval.priority} priority
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Submitted: {new Date(approval.submittedAt).toLocaleDateString()}
                        </span>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm">Review</Button>
                          <Button size="sm">
                            <Award className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-8">
                    <Award className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No pending approvals</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics & Reports</h2>
            <Card>
              <CardContent className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Analytics dashboard coming soon</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Track course engagement, completion rates, and student feedback
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Messages & Communications</h2>
            <Card>
              <CardContent className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Message center coming soon</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Communicate with students and other resource personnel
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* AI Logs Tab */}
        <TabsContent value="ai-logs">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Career AI Logs</h2>
            <Card>
              <CardContent className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">AI interaction logs coming soon</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Review AI-generated career guidance and user interactions
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
        </div>
      </main>
    </div>
  );
}