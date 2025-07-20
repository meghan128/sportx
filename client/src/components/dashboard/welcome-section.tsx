import { ArrowRight, CalendarDays, BookOpen, Award, Bell, FileCheck, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const WelcomeSection = () => {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/users/current'],
  });
  
  const { data: cpdStatus } = useQuery<{ pointsNeeded: number; period: string }>({
    queryKey: ['/api/cpd/status'],
  });

  // Get professional title based on profession
  const getProfessionalTitle = (profession?: string) => {
    const titles: Record<string, string> = {
      'Physiotherapist': 'Dr.',
      'Nutritionist': 'Dr.',
      'Sports Psychologist': 'Dr.',
      'Athletic Trainer': 'Coach',
      'Exercise Physiologist': 'Dr.'
    };
    return profession ? titles[profession] || 'Dr.' : 'Dr.';
  };

  // Get recommended actions based on user data
  const getRecommendedAction = () => {
    if (!user) return null;
    
    if (cpdStatus && cpdStatus.pointsNeeded > 15) {
      return {
        icon: <Award className="h-5 w-5 text-amber-500" />,
        text: "Complete your priority CPD tasks",
        badge: "High Priority"
      };
    } else if (new Date().getDay() === 1) { // Monday
      return {
        icon: <Bell className="h-5 w-5 text-indigo-500" />,
        text: "New industry resources available",
        badge: "New"
      };
    } else {
      return {
        icon: <FileCheck className="h-5 w-5 text-emerald-500" />,
        text: "Your quarterly assessment is ready",
        badge: "Action"
      };
    }
  };

  const recommendedAction = getRecommendedAction();

  // Current time of day greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <Card id="welcome-section" className="h-full border-0 shadow-xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <div className="mb-6">
            <div className="flex items-center gap-4 mb-4">
              {!isLoading && user?.profileImage && (
                <Avatar className="h-16 w-16 border-3 border-white shadow-lg animate-pulse-glow">
                  <AvatarImage src={user?.profileImage} />
                  <AvatarFallback className="text-lg font-bold bg-white text-blue-600">{user?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
              )}
              <div>
                <p className="text-sm font-medium text-white/90 mb-1">{getTimeBasedGreeting()},</p>
                <h1 className="text-3xl font-bold text-white neon-glow animate-float">
                  {isLoading ? 'Welcome' : `${getProfessionalTitle(user?.profession)} ${user?.name.split(' ')[0]}`}
                </h1>
                {user?.specialization && (
                  <p className="text-sm text-white/80 mt-1 font-medium">{user.specialization}</p>
                )}
              </div>
            </div>
            <div className="relative">
              <div className="absolute left-0 top-0 h-full w-1 bg-yellow-400 rounded-full animate-pulse"></div>
              <p className="pl-4 text-white/90 text-sm leading-relaxed font-medium">
                {cpdStatus 
                  ? `⚡ You have ${cpdStatus.pointsNeeded} CPD points to earn this ${cpdStatus.period}. Here's what you can do today to advance your professional development.`
                  : '🚀 Track your CPD progress and explore opportunities to grow professionally.'}
              </p>
            </div>
            
            {recommendedAction && (
              <div className="flex items-center mt-4 p-4 bg-gradient-to-r from-primary-light/10 to-primary/5 rounded-lg border border-primary/10">
                <div className="rounded-full bg-white p-2 shadow-sm">
                  {recommendedAction.icon}
                </div>
                <div className="ml-3">
                  <p className="font-medium text-gray-800">{recommendedAction.text}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Take action now to stay on track with your professional goals</p>
                </div>
                <Badge variant="secondary" className="ml-auto bg-primary/10">{recommendedAction.badge}</Badge>
              </div>
            )}
          </div>
          
          <div className="flex flex-col flex-1 space-y-4">
            <div className="group bg-gradient-to-r from-primary to-primary-dark p-5 rounded-xl flex items-center shadow-lg transition-transform hover:translate-y-[-2px]">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg mr-4">
                <CalendarDays className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-lg">Explore Events</h3>
                <p className="text-white/90 text-sm">Sports Medicine Symposium in 3 days</p>
              </div>
              <Button size="sm" variant="outline" asChild className="ml-2 text-white bg-white/10 border-white/20 hover:bg-white/20 transition-colors group-hover:bg-white group-hover:text-primary">
                <Link href="/events" className="flex items-center gap-1">
                  <span>View</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            
            <div className="group bg-gradient-to-r from-blue-500 to-indigo-600 p-5 rounded-xl flex items-center shadow-lg transition-transform hover:translate-y-[-2px]">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg mr-4">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-lg">Browse Courses</h3>
                <p className="text-white/90 text-sm">5 new courses in your field this month</p>
              </div>
              <Button size="sm" variant="outline" asChild className="ml-2 text-white bg-white/10 border-white/20 hover:bg-white/20 transition-colors group-hover:bg-white group-hover:text-blue-600">
                <Link href="/courses" className="flex items-center gap-1">
                  <span>View</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
            
            <div className="group bg-gradient-to-r from-amber-500 to-orange-500 p-5 rounded-xl flex items-center shadow-lg transition-transform hover:translate-y-[-2px]">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg mr-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white text-lg">Trending Topics</h3>
                <p className="text-white/90 text-sm">ACL rehabilitation techniques discussion</p>
              </div>
              <Button size="sm" variant="outline" asChild className="ml-2 text-white bg-white/10 border-white/20 hover:bg-white/20 transition-colors group-hover:bg-white group-hover:text-orange-500">
                <Link href="/community" className="flex items-center gap-1">
                  <span>Join</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeSection;
