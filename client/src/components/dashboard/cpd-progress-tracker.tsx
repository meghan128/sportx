import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { CpdSummary, CpdCategory } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

const CpdProgressTracker = () => {
  const { data: cpdSummary, isLoading } = useQuery<CpdSummary>({
    queryKey: ['/api/cpd/summary'],
  });

  return (
    <Card className="h-full">
      <CardHeader className="pb-0">
        <CardTitle>CPD Credit Tracker</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2 lg:col-span-1">
            <div className="flex flex-col items-center justify-center h-full">
              <div className="relative h-36 w-36">
                {!isLoading && cpdSummary && (
                  <>
                    <svg className="h-full w-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke="#57c5b6" 
                        strokeWidth="10" 
                        strokeDasharray="282.7" 
                        strokeDashoffset={282.7 * (1 - cpdSummary.currentPoints / cpdSummary.requiredPoints)}
                        transform="rotate(-90 50 50)" 
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-gray-800">{cpdSummary.currentPoints}</span>
                      <span className="text-sm text-gray-500">of {cpdSummary.requiredPoints} points</span>
                    </div>
                  </>
                )}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-medium">Current Period</h3>
                <p className="text-sm text-gray-500">{cpdSummary?.period || 'Current Quarter'}</p>
              </div>
            </div>
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <h3 className="font-medium mb-4">Credit Breakdown</h3>
            <div className="space-y-3">
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
                  <div className="group" key={category.id}>
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
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${getCategoryColorClass(category.id)}`}
                        style={{ width: `${(category.earnedPoints / category.requiredPoints * 100).toFixed(0)}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <Link href="/cpd-credits" className="text-sm text-primary hover:text-primary-dark flex items-center">
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
    '1': 'bg-primary',
    '2': 'bg-secondary',
    '3': 'bg-accent',
    'clinical': 'bg-primary',
    'research': 'bg-secondary',
    'development': 'bg-accent'
  };
  
  return colorMap[id.toString()] || 'bg-primary';
};

export default CpdProgressTracker;