import { ArrowRight, CalendarDays, BookOpen, Award, Bell, FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  return (
    <Card id="welcome-section" className="h-full">
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <div className="mb-6">
            <div className="mb-1">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-dark">
                {isLoading ? 'Welcome' : `Welcome back, ${getProfessionalTitle(user?.profession)} ${user?.name.split(' ')[0]}`}
              </h1>
            </div>
            <p className="mt-2 text-gray-600">
              {cpdStatus 
                ? `You have ${cpdStatus.pointsNeeded} CPD points to earn this ${cpdStatus.period}. Here's what you can do today:`
                : 'Track your CPD progress and explore opportunities to grow professionally.'}
            </p>
            
            {recommendedAction && (
              <div className="flex items-center mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                {recommendedAction.icon}
                <span className="ml-2 text-gray-700">{recommendedAction.text}</span>
                <Badge variant="outline" className="ml-auto">{recommendedAction.badge}</Badge>
              </div>
            )}
          </div>
          
          <div className="flex flex-col flex-1 space-y-4">
            <div className="bg-gradient-to-r from-primary-light to-primary p-4 rounded-lg flex items-center">
              <div className="bg-white p-2 rounded-full mr-4">
                <CalendarDays className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">Explore Events</h3>
                <p className="text-white text-sm opacity-90">Sports Medicine Symposium in 3 days</p>
              </div>
              <Button size="sm" variant="secondary" asChild className="ml-2">
                <Link href="/events">
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="bg-gradient-to-r from-secondary-light to-secondary p-4 rounded-lg flex items-center">
              <div className="bg-white p-2 rounded-full mr-4">
                <BookOpen className="h-6 w-6 text-secondary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">Browse Courses</h3>
                <p className="text-white text-sm opacity-90">5 new courses in your field this month</p>
              </div>
              <Button size="sm" variant="secondary" asChild className="ml-2">
                <Link href="/courses">
                  <ArrowRight className="h-4 w-4" />
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
