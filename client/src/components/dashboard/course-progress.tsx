import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckSquare, Clock, BookOpen, ListChecks, LayoutGrid } from "lucide-react";
import { Course } from "@/lib/types";
import CourseCard from "../courses/course-card";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const CourseProgress = () => {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  
  const { data: inProgressCourses, isLoading: progressLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses/in-progress'],
  });
  
  const { data: recommendedCourses, isLoading: recommendedLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses/recommended'],
  });

  return (
    <div id="course-progress" className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">My Courses</h2>
        <Link href="/courses" className="text-sm text-primary hover:text-primary-dark flex items-center">
          Browse all courses <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">In Progress ({inProgressCourses?.length || 0})</h3>
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className={viewMode === 'list' ? 'bg-gray-100' : ''}
                onClick={() => setViewMode('list')}
              >
                <ListChecks className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className={viewMode === 'grid' ? 'bg-gray-100' : ''}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {progressLoading ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="border border-gray-200 rounded-lg overflow-hidden animate-pulse">
                  <div className="md:flex">
                    <div className="md:w-48 h-32 bg-gray-200"></div>
                    <div className="p-4 md:p-5 flex-1 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-2 bg-gray-200 rounded w-full"></div>
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {inProgressCourses && inProgressCourses.length > 0 ? (
                inProgressCourses.map((course) => (
                  <CourseCard key={course.id} course={course} layout={viewMode} />
                ))
              ) : (
                <div className="text-center py-8">
                  <h4 className="text-gray-500 mb-2">You're not enrolled in any courses yet</h4>
                  <Button asChild>
                    <Link href="/courses">Browse Courses</Link>
                  </Button>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Recommended For You</h3>
            </div>
            
            {recommendedLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map(i => (
                  <div key={i} className="border border-gray-200 rounded-lg animate-pulse p-4 flex">
                    <div className="w-20 h-20 rounded-lg bg-gray-200 mr-3"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recommendedCourses && recommendedCourses.length > 0 ? (
                  recommendedCourses.map((course) => (
                    <div key={course.id} className="border border-gray-200 rounded-lg overflow-hidden hover:border-primary transition-colors p-4 flex">
                      <div className="w-20 h-20 rounded-lg overflow-hidden mr-3 shrink-0">
                        <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center mb-1">
                          <span className="text-xs px-1.5 py-0.5 rounded bg-primary bg-opacity-10 text-primary">
                            CPD: {course.cpdPoints} pts
                          </span>
                        </div>
                        <h4 className="font-medium text-sm mb-1 truncate">{course.title}</h4>
                        <div className="flex items-center text-xs text-gray-500">
                          <span className="flex items-center"><Clock className="mr-1 h-3 w-3" /> {course.duration}</span>
                          <span className="mx-2">•</span>
                          <span className="flex items-center"><BookOpen className="mr-1 h-3 w-3" /> {course.modules} modules</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-6">
                    <p className="text-gray-500">No recommended courses at the moment.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
