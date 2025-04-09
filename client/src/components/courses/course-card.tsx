import { 
  Clock, 
  BookOpen, 
  ArrowRight, 
  CheckSquare, 
  Award, 
  Star, 
  Zap, 
  Layers, 
  Medal, 
  Users
} from "lucide-react";
import { Course, ProfessionRole } from "@/lib/types";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
  layout?: 'grid' | 'list';
  userRole?: ProfessionRole;
}

// Helper functions to get role-specific colors
const getRoleBadgeColor = (role: ProfessionRole) => {
  switch (role) {
    case 'Physiotherapist':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'Nutritionist':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'Sports Psychologist':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    case 'Athletic Trainer':
      return 'bg-orange-50 text-orange-700 border-orange-200';
    case 'Exercise Physiologist':
      return 'bg-teal-50 text-teal-700 border-teal-200';
    case 'All':
      return 'bg-gray-50 text-gray-700 border-gray-200';
    default:
      return 'bg-gray-50 text-gray-700 border-gray-200';
  }
};

// Function to convert role to short form for badges when space is limited
const getRoleShortName = (role: ProfessionRole) => {
  switch (role) {
    case 'Physiotherapist':
      return 'PT';
    case 'Nutritionist':
      return 'NUT';
    case 'Sports Psychologist':
      return 'PSY';
    case 'Athletic Trainer':
      return 'AT';
    case 'Exercise Physiologist':
      return 'EP';
    case 'All':
      return 'ALL';
    default:
      return '';
  }
};

const CourseCard = ({ course, layout = 'list', userRole }: CourseCardProps) => {
  // Check if course has content specific to the user's role
  const hasRoleSpecificContent = userRole && 
    course.roleSpecificContent?.some(content => content.role === userRole || content.role === 'All');
  
  // Check if course has interactive elements
  const hasInteractiveElements = course.interactiveElements && course.interactiveElements.length > 0;
  
  // Filter interactive elements relevant to user's role if specified
  const relevantInteractiveElements = userRole && course.interactiveElements
    ? course.interactiveElements.filter(
        element => !element.forRoles || element.forRoles.includes(userRole) || element.forRoles.includes('All')
      )
    : course.interactiveElements;
    
  // Calculate total role-specific interactive elements
  const interactiveElementsCount = relevantInteractiveElements?.length || 0;
  
  // Check if this course is recommended for the user's role
  const isRecommendedForRole = userRole && 
    (course.forRoles?.includes(userRole) || course.forRoles?.includes('All'));
    
  if (layout === 'list') {
    return (
      <div className={cn(
        "border border-gray-200 rounded-lg overflow-hidden hover:border-primary hover:shadow-md transition-all",
        isRecommendedForRole && "ring-1 ring-primary/20"
      )}>
        <div className="md:flex">
          <div className="md:w-48 h-32 md:h-auto overflow-hidden relative">
            <img src={course.thumbnail} alt={course.title} className="h-full w-full object-cover" />
            {course.isFeatured && (
              <div className="absolute top-0 left-0 bg-gradient-to-r from-primary to-blue-600 text-white px-2 py-0.5 text-xs font-medium">
                Featured
              </div>
            )}
            {course.isPopular && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white px-2 py-1 text-xs font-medium text-center">
                <Star className="inline-block h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                Popular Course
              </div>
            )}
            {course.certificationExam && (
              <div className="absolute top-1 right-1 bg-amber-600 text-white rounded-full p-1">
                <Medal className="h-3 w-3" />
              </div>
            )}
          </div>
          <div className="p-4 md:p-5 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-medium text-gray-500 uppercase">Accredited Course</span>
              <Badge className="bg-primary/10 text-primary border-0">
                {course.cpdPoints} CPD Points
              </Badge>
              {course.difficulty && (
                <Badge variant="outline" className="text-xs">
                  {course.difficulty}
                </Badge>
              )}
              {hasRoleSpecificContent && (
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 gap-1 flex items-center" variant="outline">
                  <Users className="h-3 w-3" />
                  Role-Specific
                </Badge>
              )}
              {hasInteractiveElements && (
                <Badge className="bg-purple-50 text-purple-700 border-purple-200 gap-1 flex items-center" variant="outline">
                  <Zap className="h-3 w-3" />
                  Interactive
                </Badge>
              )}
            </div>
            
            <h4 className="font-semibold mt-1 mb-2 line-clamp-1">{course.title}</h4>
            
            {/* Course roles badges */}
            {course.forRoles && course.forRoles.length > 0 && course.forRoles[0] !== 'All' && (
              <div className="flex flex-wrap gap-1 mb-2">
                {course.forRoles.map(role => (
                  <Badge 
                    key={role}
                    variant="outline" 
                    className={cn(
                      "text-xs font-normal", 
                      getRoleBadgeColor(role),
                      userRole === role && "ring-1 ring-offset-1"
                    )}
                  >
                    {getRoleShortName(role)}
                  </Badge>
                ))}
              </div>
            )}
            
            <div className="flex flex-wrap items-center text-xs text-gray-500 mb-3 gap-x-2 gap-y-1">
              <span className="flex items-center"><Clock className="mr-1 h-3 w-3" /> {course.duration}</span>
              <span className="hidden md:inline-block">•</span>
              <span className="flex items-center"><BookOpen className="mr-1 h-3 w-3" /> {course.modules} modules</span>
              {course.lessons && (
                <>
                  <span className="hidden md:inline-block">•</span>
                  <span className="flex items-center"><Layers className="mr-1 h-3 w-3" /> {course.lessons} lessons</span>
                </>
              )}
              {interactiveElementsCount > 0 && (
                <>
                  <span className="hidden md:inline-block">•</span>
                  <span className="flex items-center text-purple-600"><Zap className="mr-1 h-3 w-3" /> {interactiveElementsCount} interactive</span>
                </>
              )}
              {course.progress && (
                <>
                  <span className="hidden md:inline-block">•</span>
                  <span className="text-success flex items-center">
                    <CheckSquare className="mr-1 h-3 w-3" /> {course.progress.status}
                  </span>
                </>
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
            
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
              <div className="flex items-center">
                <Award className="h-4 w-4 text-primary mr-1" />
                <span className="text-xs">By {course.accreditedBy}</span>
              </div>
              <div className="flex items-center gap-3">
                {course.updatedDate && (
                  <span className="text-xs text-gray-500">Updated: {course.updatedDate}</span>
                )}
                <Link 
                  href={course.progress ? `/courses/${course.id}/continue` : `/courses/${course.id}`} 
                  className="text-sm font-medium bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent hover:from-primary-dark hover:to-primary flex items-center"
                >
                  {course.progress ? 'Continue' : 'Start'} <ArrowRight className="ml-1 h-4 w-4 stroke-primary" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className={cn(
        "border border-gray-200 rounded-lg overflow-hidden hover:border-primary hover:shadow-md transition-all h-full flex flex-col",
        isRecommendedForRole && "ring-1 ring-primary/20"
      )}>
        <div className="relative">
          <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" />
          <div className="absolute top-0 right-0 bg-white/90 backdrop-blur-sm rounded-bl-lg py-1 px-2 text-xs font-medium text-primary flex items-center gap-1">
            <Award className="h-3 w-3" />
            {course.cpdPoints} CPD
          </div>
          
          {course.isFeatured && (
            <div className="absolute top-0 left-0 bg-gradient-to-r from-primary to-blue-600 text-white px-2 py-0.5 text-xs font-medium">
              Featured
            </div>
          )}
          
          {course.certificationExam && (
            <div className="absolute bottom-2 right-2 bg-amber-600 text-white rounded-full p-1.5 shadow-md">
              <Medal className="h-3.5 w-3.5" />
            </div>
          )}
          
          {/* Role badges - mini version for grid layout */}
          {course.forRoles && course.forRoles.length > 0 && course.forRoles[0] !== 'All' && (
            <div className="absolute bottom-2 left-2 flex flex-wrap gap-1">
              {course.forRoles.slice(0, 3).map(role => (
                <Badge 
                  key={role}
                  variant="outline" 
                  className={cn(
                    "text-[0.65rem] font-normal py-0 px-1.5 h-5 bg-white/90 backdrop-blur-sm", 
                    userRole === role && "ring-1 ring-offset-1"
                  )}
                >
                  {getRoleShortName(role)}
                </Badge>
              ))}
              {course.forRoles.length > 3 && (
                <Badge variant="outline" className="text-[0.65rem] font-normal py-0 px-1.5 h-5 bg-white/90 backdrop-blur-sm">
                  +{course.forRoles.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
        
        <div className="p-4 flex-1 flex flex-col">
          <div className="mb-auto">
            <div className="flex items-center gap-1 mb-1">
              {hasRoleSpecificContent && (
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 h-5 px-1.5 text-[0.65rem]" variant="outline">
                  Role-Specific
                </Badge>
              )}
              {hasInteractiveElements && (
                <Badge className="bg-purple-50 text-purple-700 border-purple-200 h-5 px-1.5 text-[0.65rem]" variant="outline">
                  Interactive
                </Badge>
              )}
              {course.isPopular && (
                <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 h-5 px-1.5 text-[0.65rem] gap-0.5" variant="outline">
                  <Star className="h-2.5 w-2.5 fill-yellow-500" /> Popular
                </Badge>
              )}
            </div>
            
            <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">{course.title}</h4>
            
            <div className="flex flex-wrap items-center text-xs text-gray-500 mb-2 gap-x-2 gap-y-1">
              <span className="flex items-center"><Clock className="mr-1 h-3 w-3" /> {course.duration}</span>
              <span className="hidden md:inline-block">•</span>
              <span className="flex items-center"><BookOpen className="mr-1 h-3 w-3" /> {course.modules} modules</span>
            </div>
            
            {interactiveElementsCount > 0 && (
              <div className="flex items-center text-xs text-purple-600 mb-2">
                <Zap className="mr-1 h-3 w-3" /> {interactiveElementsCount} interactive elements
              </div>
            )}
          </div>
          
          {course.progress && (
            <div className="mb-3 mt-2">
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
            className="mt-3 w-full py-1.5 text-center text-sm font-medium bg-gradient-to-r from-gray-50 to-gray-100 text-primary hover:from-primary hover:to-primary-dark hover:text-white rounded-md border border-gray-200 hover:border-transparent transition-colors"
          >
            {course.progress ? 'Continue Course' : 'Start Course'}
          </Link>
        </div>
      </div>
    );
  }
};

export default CourseCard;
