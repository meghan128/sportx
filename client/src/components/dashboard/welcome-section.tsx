import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { User } from "@/lib/types";

const WelcomeSection = () => {
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/users/current'],
  });
  
  const { data: cpdStatus } = useQuery<{ pointsNeeded: number; period: string }>({
    queryKey: ['/api/cpd/status'],
  });

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
      <div className="md:flex">
        <div className="p-6 md:p-8 flex-1">
          <h1 className="text-2xl font-bold text-gray-800">
            {isLoading ? 'Welcome' : `Welcome back, ${user?.name.split(' ')[0]}`}
          </h1>
          <p className="mt-2 text-gray-600">
            {cpdStatus ? `You have ${cpdStatus.pointsNeeded} CPD points to earn this quarter.` : 'Track your CPD progress and explore opportunities.'}
          </p>
          
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild className="bg-primary hover:bg-primary-dark">
              <Link href="/events">
                <CalendarDays className="mr-2 h-4 w-4" /> Explore Events
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/courses">
                <BookOpen className="mr-2 h-4 w-4" /> Browse Courses
              </Link>
            </Button>
          </div>
        </div>
        <div className="hidden md:block bg-gradient-to-r from-[#57c5b6] to-[#159895] w-1/3 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            {/* Abstract medical symbols pattern */}
          </div>
        </div>
      </div>
    </div>
  );
};

import { CalendarDays, BookOpen } from "lucide-react";

export default WelcomeSection;
