import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Award, 
  TrendingUp,
  Clock,
  Star,
  Target,
  Activity,
  PlusCircle,
  Eye,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Zap,
  GraduationCap,
  FileText,
  BarChart3
} from "lucide-react";
import { Link } from "wouter";
import Sidebar from "@/components/layout/sidebar";
import { format } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";

interface UserStats {
  totalCourses: number;
  completedCourses: number;
  cpdCredits: number;
  upcomingEvents: number;
  cpdTarget: number;
  progressPercentage: number;
  nextDeadline: string;
  activeLearningPaths: number;
}

interface RecentActivity {
  id: number;
  type: 'course_completion' | 'event_attendance' | 'cpd_earned' | 'certificate';
  title: string;
  subtitle: string;
  timestamp: string;
  points?: number;
}

interface UpcomingEvent {
  id: number;
  title: string;
  date: string;
  type: 'workshop' | 'webinar' | 'conference';
  cpdPoints: number;
  status: 'registered' | 'available' | 'full';
}

const Dashboard = () => {
  const { user } = useAuth();

  // Mock data for demonstration
  const mockStats: UserStats = {
    totalCourses: 12,
    completedCourses: 8,
    cpdCredits: 32,
    upcomingEvents: 3,
    cpdTarget: 50,
    progressPercentage: 64,
    nextDeadline: "2024-12-31",
    activeLearningPaths: 2
  };

  const mockRecentActivity: RecentActivity[] = [
    {
      id: 1,
      type: 'course_completion',
      title: 'Course Completed',
      subtitle: 'Advanced Sports Nutrition completed',
      timestamp: '2024-01-20T10:30:00Z',
      points: 5
    },
    {
      id: 2,
      type: 'cpd_earned',
      title: 'CPD Credits Earned',
      subtitle: 'Earned 3 CPD points from workshop attendance',
      timestamp: '2024-01-19T14:15:00Z',
      points: 3
    },
    {
      id: 3,
      type: 'certificate',
      title: 'Certificate Issued',
      subtitle: 'Injury Prevention Specialist certificate earned',
      timestamp: '2024-01-18T16:45:00Z'
    }
  ];

  const mockUpcomingEvents: UpcomingEvent[] = [
    {
      id: 1,
      title: 'Sports Psychology Workshop',
      date: '2024-01-25T09:00:00Z',
      type: 'workshop',
      cpdPoints: 4,
      status: 'registered'
    },
    {
      id: 2,
      title: 'Nutrition in Athletic Performance',
      date: '2024-01-28T14:00:00Z',
      type: 'webinar',
      cpdPoints: 2,
      status: 'available'
    },
    {
      id: 3,
      title: 'Annual Sports Medicine Conference',
      date: '2024-02-15T08:00:00Z',
      type: 'conference',
      cpdPoints: 8,
      status: 'available'
    }
  ];

  const { data: stats = mockStats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ['/api/users/stats'],
    queryFn: () => Promise.resolve(mockStats),
  });

  const { data: recentActivity = mockRecentActivity } = useQuery<RecentActivity[]>({
    queryKey: ['/api/users/activity'],
    queryFn: () => Promise.resolve(mockRecentActivity),
  });

  const { data: upcomingEvents = mockUpcomingEvents } = useQuery<UpcomingEvent[]>({
    queryKey: ['/api/events/upcoming'],
    queryFn: () => Promise.resolve(mockUpcomingEvents),
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'course_completion': return <BookOpen className="h-4 w-4" />;
      case 'event_attendance': return <Calendar className="h-4 w-4" />;
      case 'cpd_earned': return <Award className="h-4 w-4" />;
      case 'certificate': return <GraduationCap className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'workshop': return 'bg-blue-100 text-blue-800';
      case 'webinar': return 'bg-green-100 text-green-800';
      case 'conference': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'registered': return 'bg-green-100 text-green-800';
      case 'available': return 'bg-blue-100 text-blue-800';
      case 'full': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (statsLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar collapsed={false} />
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
      <Sidebar collapsed={false} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
              <p className="text-muted-foreground">
                Continue your professional development journey and track your progress.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/courses">
                <Button>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Courses
                </Button>
              </Link>
              <Link href="/events">
                <Button variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  Upcoming Events
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
                    <p className="text-2xl font-bold">{stats.completedCourses}/{stats.totalCourses}</p>
                    <p className="text-sm text-muted-foreground">Courses Completed</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-600 font-medium">{stats.activeLearningPaths} active paths</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Award className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.cpdCredits}</p>
                    <p className="text-sm text-muted-foreground">CPD Credits Earned</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-green-600 font-medium">{stats.cpdTarget - stats.cpdCredits} to target</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.upcomingEvents}</p>
                    <p className="text-sm text-muted-foreground">Upcoming Events</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href="/events">
                    <Button variant="outline" size="sm">
                      View Events
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Target className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.progressPercentage}%</p>
                    <p className="text-sm text-muted-foreground">CPD Progress</p>
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={stats.progressPercentage} className="mt-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Target: {format(new Date(stats.nextDeadline), 'MMM dd, yyyy')}
                  </p>
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
                  <CardDescription>Your latest learning activities</CardDescription>
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
                      {activity.points && (
                        <Badge className="bg-green-100 text-green-800" variant="secondary">
                          +{activity.points} CPD
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Link href="/cpd-credits">
                    <Button variant="outline" className="w-full">
                      View All Activity
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>Don't miss these learning opportunities</CardDescription>
                </div>
                <Calendar className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center space-x-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{event.title}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getEventTypeColor(event.type)} variant="secondary">
                            {event.type}
                          </Badge>
                          <Badge className={getStatusColor(event.status)} variant="secondary">
                            {event.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(event.date), 'MMM dd, yyyy HH:mm')} • {event.cpdPoints} CPD points
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Link href="/events">
                    <Button variant="outline" className="w-full">
                      View All Events
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
              <CardDescription>Jump into your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Link href="/courses">
                  <Button variant="outline" className="w-full justify-start h-auto p-4">
                    <div className="flex flex-col items-start space-y-1">
                      <div className="flex items-center space-x-2">
                        <BookOpen className="h-4 w-4" />
                        <span className="font-medium">Browse Courses</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Explore new learning paths</span>
                    </div>
                  </Button>
                </Link>
                
                <Link href="/events">
                  <Button variant="outline" className="w-full justify-start h-auto p-4">
                    <div className="flex flex-col items-start space-y-1">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium">Book Event</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Register for workshops</span>
                    </div>
                  </Button>
                </Link>

                <Link href="/cpd-credits">
                  <Button variant="outline" className="w-full justify-start h-auto p-4">
                    <div className="flex flex-col items-start space-y-1">
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4" />
                        <span className="font-medium">CPD Tracker</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Monitor your progress</span>
                    </div>
                  </Button>
                </Link>

                <Link href="/community">
                  <Button variant="outline" className="w-full justify-start h-auto p-4">
                    <div className="flex flex-col items-start space-y-1">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span className="font-medium">Join Community</span>
                      </div>
                      <span className="text-xs text-muted-foreground">Connect with peers</span>
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
};

export default Dashboard;