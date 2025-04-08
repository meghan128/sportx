import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/lib/types";
import { CalendarDays, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const WelcomeSection = () => {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/users/current'],
  });
  
  const { data: cpdStatus } = useQuery<{ pointsNeeded: number; period: string }>({
    queryKey: ['/api/cpd/status'],
  });

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex flex-col h-full">
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {isLoading ? 'Welcome' : `Welcome back, ${user?.name.split(' ')[0]}`}
            </h1>
            <p className="mt-2 text-gray-600">
              {cpdStatus ? `You have ${cpdStatus.pointsNeeded} CPD points to earn this quarter.` : 'Track your CPD progress and explore opportunities.'}
            </p>
          </div>
          
          <div className="flex flex-col flex-1 space-y-4">
            <div className="bg-gradient-to-r from-primary-light to-primary p-4 rounded-lg flex items-center">
              <div className="bg-white p-2 rounded-full mr-4">
                <CalendarDays className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">Explore Events</h3>
                <p className="text-white text-sm opacity-90">Find workshops, conferences & symposiums</p>
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
                <p className="text-white text-sm opacity-90">Access accredited learning material</p>
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
