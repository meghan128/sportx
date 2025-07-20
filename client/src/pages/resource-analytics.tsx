import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  BookOpen, 
  Award,
  Clock,
  Eye,
  Download,
  Calendar,
  Target,
  Activity,
  PieChart,
  LineChart,
  DollarSign
} from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart as RechartsPieChart, Cell, LineChart as RechartsLineChart, Line, AreaChart, Area } from "recharts";
import ResourceSidebar from "@/components/layout/resource-sidebar";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";

interface AnalyticsData {
  coursePerformance: CourseAnalytics[];
  studentEngagement: EngagementMetrics;
  revenueData: RevenueMetrics[];
  completionRates: CompletionData[];
  timeAnalytics: TimeMetrics[];
}

interface CourseAnalytics {
  courseId: number;
  courseName: string;
  enrollments: number;
  completions: number;
  avgRating: number;
  revenue: number;
  avgTimeToComplete: number;
  dropOffPoints: string[];
}

interface EngagementMetrics {
  totalStudents: number;
  activeStudents: number;
  avgSessionDuration: number;
  totalWatchTime: number;
  forumPosts: number;
  assignmentSubmissions: number;
}

interface RevenueMetrics {
  month: string;
  revenue: number;
  enrollments: number;
  refunds: number;
}

interface CompletionData {
  course: string;
  completed: number;
  inProgress: number;
  notStarted: number;
}

interface TimeMetrics {
  date: string;
  activeUsers: number;
  newEnrollments: number;
  completions: number;
}

export default function ResourceAnalytics() {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedCourse, setSelectedCourse] = useState<string>("all");

  // Mock analytics data
  const mockAnalyticsData: AnalyticsData = {
    coursePerformance: [
      {
        courseId: 1,
        courseName: "Advanced Sports Rehabilitation Techniques",
        enrollments: 245,
        completions: 189,
        avgRating: 4.7,
        revenue: 12250,
        avgTimeToComplete: 28,
        dropOffPoints: ["Module 3: Practical Applications", "Final Assessment"]
      },
      {
        courseId: 2,
        courseName: "Injury Prevention in Team Sports",
        enrollments: 198,
        completions: 167,
        avgRating: 4.5,
        revenue: 9900,
        avgTimeToComplete: 21,
        dropOffPoints: ["Module 2: Risk Assessment", "Module 4: Implementation"]
      },
      {
        courseId: 3,
        courseName: "Performance Analytics for Coaches",
        enrollments: 156,
        completions: 134,
        avgRating: 4.8,
        revenue: 15600,
        avgTimeToComplete: 35,
        dropOffPoints: ["Module 5: Data Interpretation"]
      }
    ],
    studentEngagement: {
      totalStudents: 599,
      activeStudents: 423,
      avgSessionDuration: 42,
      totalWatchTime: 15680,
      forumPosts: 284,
      assignmentSubmissions: 1456
    },
    revenueData: [
      { month: "Jan", revenue: 15750, enrollments: 158, refunds: 2 },
      { month: "Feb", revenue: 18900, enrollments: 189, refunds: 1 },
      { month: "Mar", revenue: 22400, enrollments: 224, refunds: 3 },
      { month: "Apr", revenue: 19800, enrollments: 198, refunds: 2 },
      { month: "May", revenue: 25600, enrollments: 256, refunds: 1 },
      { month: "Jun", revenue: 28900, enrollments: 289, refunds: 4 }
    ],
    completionRates: [
      { course: "Rehabilitation", completed: 189, inProgress: 56, notStarted: 0 },
      { course: "Prevention", completed: 167, inProgress: 31, notStarted: 0 },
      { course: "Analytics", completed: 134, inProgress: 22, notStarted: 0 }
    ],
    timeAnalytics: [
      { date: "2024-01-01", activeUsers: 89, newEnrollments: 23, completions: 12 },
      { date: "2024-01-02", activeUsers: 92, newEnrollments: 28, completions: 15 },
      { date: "2024-01-03", activeUsers: 78, newEnrollments: 19, completions: 8 },
      { date: "2024-01-04", activeUsers: 105, newEnrollments: 34, completions: 18 },
      { date: "2024-01-05", activeUsers: 98, newEnrollments: 31, completions: 14 },
      { date: "2024-01-06", activeUsers: 87, newEnrollments: 22, completions: 11 },
      { date: "2024-01-07", activeUsers: 112, newEnrollments: 39, completions: 21 }
    ]
  };

  const { data: analytics = mockAnalyticsData, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['/api/resource/analytics', timeRange, selectedCourse],
    queryFn: () => Promise.resolve(mockAnalyticsData),
  });

  const pieColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  // Calculate key metrics
  const totalRevenue = analytics.revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const totalEnrollments = analytics.coursePerformance.reduce((sum, course) => sum + course.enrollments, 0);
  const avgCompletionRate = analytics.coursePerformance.reduce((sum, course) => sum + (course.completions / course.enrollments * 100), 0) / analytics.coursePerformance.length;
  const avgRating = analytics.coursePerformance.reduce((sum, course) => sum + course.avgRating, 0) / analytics.coursePerformance.length;

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <ResourceSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading analytics...</p>
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
              <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Comprehensive insights into your course performance</p>
            </div>
            <div className="flex gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">+12.5%</span>
                  <span className="text-muted-foreground">vs last period</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">{totalEnrollments}</p>
                    <p className="text-sm text-muted-foreground">Total Enrollments</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">+8.3%</span>
                  <span className="text-muted-foreground">vs last period</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-2xl font-bold">{Math.round(avgCompletionRate)}%</p>
                    <p className="text-sm text-muted-foreground">Avg Completion Rate</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">+2.1%</span>
                  <span className="text-muted-foreground">vs last period</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold">{avgRating.toFixed(1)}</p>
                    <p className="text-sm text-muted-foreground">Avg Course Rating</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">+0.3</span>
                  <span className="text-muted-foreground">vs last period</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">Course Performance</TabsTrigger>
              <TabsTrigger value="students">Student Analytics</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trend</CardTitle>
                    <CardDescription>Monthly revenue and enrollment data</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={analytics.revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Completion Rates Pie Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Course Completion Status</CardTitle>
                    <CardDescription>Distribution of student progress</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Tooltip />
                        <Legend />
                        {analytics.completionRates.map((entry, index) => (
                          <RechartsPieChart key={entry.course}>
                            <Cell fill={pieColors[index % pieColors.length]} />
                          </RechartsPieChart>
                        ))}
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Activity Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Activity</CardTitle>
                  <CardDescription>User activity and enrollment trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={analytics.timeAnalytics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tickFormatter={(value) => format(new Date(value), 'MMM dd')} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="activeUsers" stroke="#3B82F6" name="Active Users" />
                      <Line type="monotone" dataKey="newEnrollments" stroke="#10B981" name="New Enrollments" />
                      <Line type="monotone" dataKey="completions" stroke="#F59E0B" name="Completions" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Student Engagement */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="h-5 w-5 text-blue-600" />
                      <p className="font-semibold">Active Students</p>
                    </div>
                    <p className="text-2xl font-bold">{analytics.studentEngagement.activeStudents}</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.round(analytics.studentEngagement.activeStudents / analytics.studentEngagement.totalStudents * 100)}% of total students
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-green-600" />
                      <p className="font-semibold">Avg Session Duration</p>
                    </div>
                    <p className="text-2xl font-bold">{analytics.studentEngagement.avgSessionDuration}min</p>
                    <p className="text-sm text-muted-foreground">Per learning session</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="h-5 w-5 text-purple-600" />
                      <p className="font-semibold">Total Watch Time</p>
                    </div>
                    <p className="text-2xl font-bold">{Math.round(analytics.studentEngagement.totalWatchTime / 60)}h</p>
                    <p className="text-sm text-muted-foreground">Across all courses</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Course Performance Tab */}
            <TabsContent value="courses" className="space-y-6">
              <div className="space-y-4">
                {analytics.coursePerformance.map((course) => {
                  const completionRate = (course.completions / course.enrollments * 100);
                  return (
                    <Card key={course.courseId}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{course.courseName}</CardTitle>
                            <CardDescription>Course performance metrics</CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-500 text-white">
                              {completionRate.toFixed(1)}% completion
                            </Badge>
                            <Badge variant="outline">
                              ★ {course.avgRating.toFixed(1)}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{course.enrollments}</p>
                            <p className="text-sm text-muted-foreground">Enrollments</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{course.completions}</p>
                            <p className="text-sm text-muted-foreground">Completions</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-600">{course.avgTimeToComplete}d</p>
                            <p className="text-sm text-muted-foreground">Avg. Completion Time</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">${course.revenue.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Revenue</p>
                          </div>
                        </div>
                        
                        {course.dropOffPoints.length > 0 && (
                          <div className="mt-4">
                            <p className="font-medium mb-2">Common Drop-off Points:</p>
                            <div className="flex flex-wrap gap-2">
                              {course.dropOffPoints.map((point, index) => (
                                <Badge key={index} variant="secondary">{point}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Student Analytics Tab */}
            <TabsContent value="students" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Student Engagement Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted rounded">
                      <span>Forum Posts</span>
                      <span className="font-bold">{analytics.studentEngagement.forumPosts}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded">
                      <span>Assignment Submissions</span>
                      <span className="font-bold">{analytics.studentEngagement.assignmentSubmissions}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded">
                      <span>Active Students</span>
                      <span className="font-bold">{analytics.studentEngagement.activeStudents}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded">
                      <span>Total Students</span>
                      <span className="font-bold">{analytics.studentEngagement.totalStudents}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Course Completion Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.completionRates}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="course" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="completed" stackId="a" fill="#10B981" name="Completed" />
                        <Bar dataKey="inProgress" stackId="a" fill="#3B82F6" name="In Progress" />
                        <Bar dataKey="notStarted" stackId="a" fill="#6B7280" name="Not Started" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Revenue Tab */}
            <TabsContent value="revenue" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Revenue</CardTitle>
                    <CardDescription>Revenue trends over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="revenue" fill="#3B82F6" name="Revenue ($)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue by Course</CardTitle>
                    <CardDescription>Course revenue comparison</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analytics.coursePerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="courseName" angle={-45} textAnchor="end" height={80} />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="revenue" fill="#10B981" name="Revenue ($)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Revenue Summary Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                  <CardDescription>Detailed monthly performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Month</th>
                          <th className="text-right p-2">Revenue</th>
                          <th className="text-right p-2">Enrollments</th>
                          <th className="text-right p-2">Avg Revenue/Student</th>
                          <th className="text-right p-2">Refunds</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics.revenueData.map((row) => (
                          <tr key={row.month} className="border-b">
                            <td className="p-2 font-medium">{row.month}</td>
                            <td className="p-2 text-right">${row.revenue.toLocaleString()}</td>
                            <td className="p-2 text-right">{row.enrollments}</td>
                            <td className="p-2 text-right">${Math.round(row.revenue / row.enrollments)}</td>
                            <td className="p-2 text-right">{row.refunds}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}