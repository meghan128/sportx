import { Clock, BookOpen, ArrowRight, CheckSquare } from "lucide-react";
import { Course } from "@/lib/types";
import { Link } from "wouter";

interface CourseCardProps {
  course: Course;
  layout?: 'grid' | 'list';
}

const CourseCard = ({ course, layout = 'list' }: CourseCardProps) => {
  if (layout === 'list') {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-primary transition-colors">
        <div className="md:flex">
          <div className="md:w-48 h-32 md:h-auto overflow-hidden">
            <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
          </div>
          <div className="p-4 md:p-5 flex-1">
            <div className="flex items-center">
              <span className="text-xs font-medium text-gray-500 uppercase">Accredited Course</span>
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-primary bg-opacity-10 text-primary">
                CPD: {course.cpdPoints} pts
              </span>
            </div>
            <h4 className="font-semibold mt-1 mb-2">{course.title}</h4>
            <div className="flex items-center text-xs text-gray-500 mb-3">
              <span className="flex items-center"><Clock className="mr-1 h-3 w-3" /> {course.duration}</span>
              <span className="mx-2">•</span>
              <span className="flex items-center"><BookOpen className="mr-1 h-3 w-3" /> {course.modules} modules</span>
              <span className="mx-2">•</span>
              <span className="text-success flex items-center">
                <CheckSquare className="mr-1 h-3 w-3" /> {course.progress?.status || 'Not started'}
              </span>
            </div>
            {course.progress && (
              <div className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span className="font-medium">{course.progress.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-success h-1.5 rounded-full" 
                    style={{ width: `${course.progress.percentage}%` }}
                  ></div>
                </div>
              </div>
            )}
            <div className="flex justify-between items-center">
              {course.progress ? (
                <span className="text-xs text-gray-500">Last accessed: {course.progress.lastAccessed}</span>
              ) : (
                <span className="text-xs text-gray-500">Enroll to start tracking progress</span>
              )}
              <Link 
                href={course.progress ? `/courses/${course.id}/continue` : `/courses/${course.id}`} 
                className="text-sm font-medium text-primary hover:text-primary-dark flex items-center"
              >
                {course.progress ? 'Continue' : 'Start'} <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-primary transition-colors">
        <div className="relative">
          <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" />
          <div className="absolute top-0 right-0 bg-white rounded-bl-lg py-1 px-2 text-xs font-medium text-primary">
            CPD: {course.cpdPoints} pts
          </div>
        </div>
        <div className="p-4">
          <h4 className="font-medium text-gray-900 mb-1">{course.title}</h4>
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <Clock className="mr-1 h-3 w-3" /> {course.duration}
            <span className="mx-1">•</span>
            <BookOpen className="mr-1 h-3 w-3" /> {course.modules} modules
          </div>
          {course.progress && (
            <div className="mb-3">
              <div className="flex justify-between text-xs mb-1">
                <span>Progress</span>
                <span className="font-medium">{course.progress.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div 
                  className="bg-success h-1.5 rounded-full" 
                  style={{ width: `${course.progress.percentage}%` }}
                ></div>
              </div>
            </div>
          )}
          <Link 
            href={course.progress ? `/courses/${course.id}/continue` : `/courses/${course.id}`} 
            className="mt-2 inline-block text-sm font-medium text-primary hover:text-primary-dark"
          >
            {course.progress ? 'Continue Course' : 'Start Course'}
          </Link>
        </div>
      </div>
    );
  }
};

export default CourseCard;
