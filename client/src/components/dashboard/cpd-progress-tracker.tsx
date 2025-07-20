import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Award, Zap, Clock, AlertTriangle, CalendarDays, TrendingUp, Check, Medal } from "lucide-react";
import { CpdSummary, CpdCategory } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
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
        color: "text-emerald-500 bg-emerald-50",
        icon: <Zap className="h-4 w-4 text-emerald-500" />
      };
    } else if (percentage >= 40) {
      return {
        label: "In Progress",
        color: "text-amber-500 bg-amber-50",
        icon: <Clock className="h-4 w-4 text-amber-500" />
      };
    } else {
      return {
        label: "Needs Attention",
        color: "text-rose-500 bg-rose-50",
        icon: <AlertTriangle className="h-4 w-4 text-rose-500" />
      };
    }
  };

  const status = getStatusInfo(completionPercentage);

  // Time remaining calculation
  const getTimeRemainingText = () => {
    // For demo purposes, show 75 days remaining
    const daysRemaining = 75;
    return `${daysRemaining} days remaining in this period`;
  };

  return (
    <Card id="cpd-tracker" className="h-full border-0 shadow-xl overflow-hidden bg-white">
      <div className="absolute top-0 right-0 w-24 h-24 -mt-6 -mr-6 bg-blue-100 rounded-full opacity-50"></div>
      <CardHeader className="pb-2 relative">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-600" />
                CPD Credit Tracker
              </CardTitle>
              {!isLoading && cpdSummary && (
                <Badge className="bg-blue-100 text-blue-800 border-0 flex items-center gap-1 px-2.5 font-medium">
                  {status.icon}
                  <span className="font-bold">{status.label}</span>
                </Badge>
              )}
            </div>
            <CardDescription className="mt-1 text-gray-600">Track your professional development progress</CardDescription>
          </div>
          <div className="flex items-center text-xs text-gray-500 gap-1 font-medium">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{getTimeRemainingText()}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 relative">
        {!isLoading && cpdSummary && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Overall Progress</span>
              <div className="flex items-center gap-1.5">
                {completionPercentage >= 100 ? (
                  <Badge variant="outline" className="text-emerald-600 border-emerald-200 bg-emerald-50 flex items-center gap-1">
                    <Check className="h-3 w-3" />
                    <span>Completed</span>
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    <span>{completionPercentage}% Complete</span>
                  </Badge>
                )}
              </div>
            </div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  completionPercentage >= 100 
                    ? 'bg-gradient-to-r from-emerald-400 to-green-500' 
                    : completionPercentage >= 75
                      ? 'bg-gradient-to-r from-blue-400 to-primary'
                      : completionPercentage >= 40
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                        : 'bg-gradient-to-r from-rose-400 to-red-500'
                }`}
                style={{ width: `${Math.min(completionPercentage, 100)}%`, transition: 'width 1s ease-in-out' }}
              >
              </div>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span className="font-medium text-gray-700">{cpdSummary.currentPoints} points</span> 
                <span>earned of {cpdSummary.requiredPoints} required</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <Medal className="h-3.5 w-3.5 text-primary" />
                <span className="text-primary font-medium">{cpdSummary.requiredPoints - cpdSummary.currentPoints} points needed</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-gray-50 p-4 rounded-xl">
          {/* Left column with circle progress */}
          <div className="md:col-span-4">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="relative h-36 w-36 drop-shadow-sm">
                {!isLoading && cpdSummary && (
                  <>
                    <svg className="h-full w-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background circle */}
                      <circle cx="50" cy="50" r="40" fill="white" />
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                      
                      {/* Progress circle with gradient */}
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke="url(#cpd-gradient)" 
                        strokeWidth="8" 
                        strokeDasharray="282.7" 
                        strokeDashoffset={282.7 * (1 - cpdSummary.currentPoints / cpdSummary.requiredPoints)}
                        strokeLinecap="round"
                      />
                      
                      {/* Define gradient */}
                      <defs>
                        <linearGradient id="cpd-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#1e40af" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">{cpdSummary.currentPoints}</span>
                        <span className="text-lg text-gray-400 ml-0.5">/{cpdSummary.requiredPoints}</span>
                      </div>
                      <div className="flex items-center mt-1 bg-primary/10 px-2 py-1 rounded-full">
                        <Award className="h-3.5 w-3.5 text-primary mr-1" />
                        <span className="text-xs font-medium text-primary">CPD Points</span>
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
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Credit Distribution</h3>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <span>Tap for details</span>
                </div>
              </div>
              
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
                          <div className="group cursor-pointer bg-white rounded-lg p-3 hover:bg-gray-50 transition-colors border border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${getCategoryDotColor(category.id)}`}></div>
                                <span className="text-sm font-medium">{category.name}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold">{category.earnedPoints}</span>
                                <span className="text-xs text-gray-500">/ {category.requiredPoints}</span>
                              </div>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${getCategoryColorClass(category.id)}`}
                                style={{ width: `${Math.min((category.earnedPoints / category.requiredPoints * 100), 100).toFixed(0)}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-primary">
                                  {Math.round((category.earnedPoints / category.requiredPoints) * 100)}%
                                </span>
                                <span className="text-xs text-gray-500">complete</span>
                              </div>
                              <Badge 
                                variant="outline" 
                                className="text-xs font-normal border-gray-200"
                              >
                                {getCategoryStatusText(category)}
                              </Badge>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="right">
                          <div className="text-xs space-y-1">
                            <p className="font-medium">{category.name} Category</p>
                            <p>{category.earnedPoints} of {category.requiredPoints} points earned</p>
                            <p>{Math.round((category.earnedPoints / category.requiredPoints) * 100)}% complete</p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <Button variant="outline" asChild>
            <Link href="/cpd-credits/log-activity" className="text-sm gap-1">
              <Award className="h-4 w-4" />
              <span>Log Activity</span>
            </Link>
          </Button>
          <Button variant="default" asChild className="ml-auto">
            <Link href="/cpd-credits" className="text-sm gap-1">
              <span>View Full Report</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to get color class based on category ID
const getCategoryColorClass = (id: string | number): string => {
  const colorMap: Record<string, string> = {
    '1': 'bg-gradient-to-r from-blue-600 to-blue-400',
    '2': 'bg-gradient-to-r from-emerald-600 to-emerald-400',
    '3': 'bg-gradient-to-r from-amber-600 to-amber-400',
    'clinical': 'bg-gradient-to-r from-blue-600 to-blue-400',
    'research': 'bg-gradient-to-r from-emerald-600 to-emerald-400',
    'development': 'bg-gradient-to-r from-amber-600 to-amber-400'
  };
  
  return colorMap[id.toString()] || 'bg-gradient-to-r from-blue-600 to-blue-400';
};

// Helper function to get dot color
const getCategoryDotColor = (id: string | number): string => {
  const colorMap: Record<string, string> = {
    '1': 'bg-blue-500',
    '2': 'bg-emerald-500',
    '3': 'bg-amber-500',
    'clinical': 'bg-blue-500',
    'research': 'bg-emerald-500',
    'development': 'bg-amber-500'
  };
  
  return colorMap[id.toString()] || 'bg-blue-500';
};

// Helper function to get category status
const getCategoryStatusText = (category: CpdCategory): string => {
  const percentage = (category.earnedPoints / category.requiredPoints) * 100;
  
  if (percentage >= 100) {
    return 'Completed';
  } else if (percentage >= 75) {
    return 'On Track';
  } else if (percentage >= 40) {
    return 'In Progress';
  } else {
    return 'Attention Needed';
  }
};

export default CpdProgressTracker;