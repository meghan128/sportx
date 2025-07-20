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
    <div id="course-progress" className="mb-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 px-8 py-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600 rounded-xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
                <p className="text-gray-600">Track your learning progress and continue your professional development</p>
              </div>
            </div>
            <Link href="/courses">
              <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg">
                Browse all courses <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Course Tabs */}
        <div className="px-8 py-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">In Progress ({inProgressCourses?.length || 0})</h3>
            <div className="flex space-x-1">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`${viewMode === 'list' ? 'bg-white shadow-sm' : ''} transition-all`}
                onClick={() => setViewMode('list')}
              >
                <ListChecks className="h-4 w-4 mr-1" />
                List
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className={`${viewMode === 'grid' ? 'bg-white shadow-sm' : ''} transition-all`}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="h-4 w-4 mr-1" />
                Grid
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          
          {progressLoading ? (
            <div className="space-y-6">
              {[1, 2].map(i => (
                <div key={i} className="bg-gray-100 rounded-xl p-6 animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-2 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : inProgressCourses && inProgressCourses.length > 0 ? (
            <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}`}>
              {inProgressCourses.map((course) => (
                <div key={course.id} className="group bg-gray-50 hover:bg-white border-2 border-gray-100 hover:border-green-200 rounded-xl p-6 transition-all duration-200 hover:shadow-lg cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">{course.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{course.instructor}</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{width: `${course.progress}%`}}></div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{course.progress}% complete</span>
                        <span className="font-medium text-green-600">{course.cpdPoints} CPD</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">You're not enrolled in any courses yet</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Start your professional development journey by browsing our extensive course catalog.
              </p>
              <Link href="/courses">
                <Button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg">
                  Browse Courses
                </Button>
              </Link>
            </div>
          )}

          {/* Recommended Courses Section */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recommended For You</h3>
              <Link href="/courses">
                <Button variant="outline" size="sm">
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            {recommendedLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-gray-100 rounded-xl p-6 animate-pulse">
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : recommendedCourses && recommendedCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recommendedCourses.slice(0, 3).map((course) => (
                  <div key={course.id} className="group bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">Recommended</span>
                    </div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">{course.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{course.duration}</span>
                      <span className="font-medium text-blue-600">{course.cpdPoints} CPD</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-600">No recommended courses at the moment.</p>
                <p className="text-sm text-gray-500 mt-1">Complete your profile to get personalized recommendations.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
