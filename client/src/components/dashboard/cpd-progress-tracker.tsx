import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Award, Zap, Clock } from "lucide-react";
import { CpdSummary, CpdCategory } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const CpdProgressTracker = () => {
  const { data: cpdSummary, isLoading } = useQuery<CpdSummary>({
    queryKey: ['/api/cpd/summary'],
  });

  // Calculate completion percentage
  const completionPercentage = cpdSummary 
    ? Math.round((cpdSummary.currentPoints / cpdSummary.requiredPoints) * 100) 
    : 0;

  // Get status based on completion percentage
  const getStatusInfo = (percentage: number) => {
    if (percentage >= 75) {
      return {
        label: "On Track",
        color: "text-emerald-500",
        icon: <Zap className="h-4 w-4 text-emerald-500" />
      };
    } else if (percentage >= 40) {
      return {
        label: "In Progress",
        color: "text-amber-500",
        icon: <Clock className="h-4 w-4 text-amber-500" />
      };
    } else {
      return {
        label: "Needs Attention",
        color: "text-rose-500",
        icon: <Clock className="h-4 w-4 text-rose-500" />
      };
    }
  };

  const status = getStatusInfo(completionPercentage);

  return (
    <Card id="cpd-tracker" className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">CPD Credit Tracker</CardTitle>
            <CardDescription>Your professional development progress</CardDescription>
          </div>
          {!isLoading && cpdSummary && (
            <div className="flex items-center gap-2">
              <span className={`text-sm font-medium flex items-center ${status.color}`}>
                {status.icon}
                <span className="ml-1">{status.label}</span>
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {!isLoading && cpdSummary && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">Overall Progress</span>
              <Badge variant="secondary">{completionPercentage}% Complete</Badge>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            <div className="mt-3 flex justify-between text-xs text-gray-500">
              <span>0 Points</span>
              <span>{cpdSummary.requiredPoints} Points</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left column with circle progress */}
          <div className="md:col-span-4">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="relative h-32 w-32">
                {!isLoading && cpdSummary && (
                  <>
                    <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                      
                      {/* Progress circle with gradient */}
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke="url(#cpd-gradient)" 
                        strokeWidth="10" 
                        strokeDasharray="282.7" 
                        strokeDashoffset={282.7 * (1 - cpdSummary.currentPoints / cpdSummary.requiredPoints)}
                        strokeLinecap="round"
                      />
                      
                      {/* Define gradient */}
                      <defs>
                        <linearGradient id="cpd-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#4F46E5" />
                          <stop offset="100%" stopColor="#06B6D4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="flex items-center">
                        <span className="text-3xl font-bold">{cpdSummary.currentPoints}</span>
                        <span className="text-lg text-gray-400">/{cpdSummary.requiredPoints}</span>
                      </div>
                      <div className="flex items-center mt-1">
                        <Award className="h-4 w-4 text-primary mr-1" />
                        <span className="text-xs text-gray-500">CPD Points</span>
                      </div>
                    </div>
                  </>
                )}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>
              <div className="mt-3 text-center">
                <h3 className="text-sm font-medium">Current Period</h3>
                <p className="text-xs text-gray-500">{cpdSummary?.period || 'Current Quarter'}</p>
              </div>
            </div>
          </div>
          
          {/* Right column with category breakdown */}
          <div className="md:col-span-8">
            <div className="space-y-4">
              <h3 className="text-sm font-medium border-b pb-2">Credit Breakdown</h3>
              
              <div className="space-y-4">
                {isLoading ? (
                  <div className="animate-pulse space-y-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between">
                          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  cpdSummary?.categories.map((category) => (
                    <TooltipProvider key={category.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="group cursor-pointer">
                            <div className="flex justify-between items-center mb-1">
                              <div className="flex items-center">
                                <span className="text-sm font-medium">{category.name}</span>
                                <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary bg-opacity-10 text-primary">
                                  {category.earnedPoints} pts
                                </span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {category.earnedPoints} of {category.requiredPoints}
                              </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${getCategoryColorClass(category.id)}`}
                                style={{ width: `${(category.earnedPoints / category.requiredPoints * 100).toFixed(0)}%` }}
                              ></div>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">
                            {Math.round((category.earnedPoints / category.requiredPoints) * 100)}% complete 
                            in {category.name} category
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))
                )}
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Link href="/cpd-credits" className="text-sm text-primary hover:text-primary-dark flex items-center font-medium">
                View detailed report <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to get color class based on category ID
const getCategoryColorClass = (id: string | number): string => {
  const colorMap: Record<string, string> = {
    '1': 'bg-gradient-to-r from-indigo-500 to-blue-500',
    '2': 'bg-gradient-to-r from-emerald-500 to-teal-500',
    '3': 'bg-gradient-to-r from-orange-500 to-amber-500',
    'clinical': 'bg-gradient-to-r from-indigo-500 to-blue-500',
    'research': 'bg-gradient-to-r from-emerald-500 to-teal-500',
    'development': 'bg-gradient-to-r from-orange-500 to-amber-500'
  };
  
  return colorMap[id.toString()] || 'bg-gradient-to-r from-indigo-500 to-blue-500';
};

export default CpdProgressTracker;