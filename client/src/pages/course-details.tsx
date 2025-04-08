import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Course, CourseModule, CourseLesson } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  Clock,
  CheckCircle,
  ArrowLeft,
  Award,
  Star,
  Play,
  FileText,
  Download,
  Users,
  ChevronRight,
  LockOpen,
  Lock,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CourseDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [isEnrolling, setIsEnrolling] = useState(false);

  const { data: course, isLoading } = useQuery<Course>({
    queryKey: [`/api/courses/${id}`],
  });

  const handleEnroll = async () => {
    try {
      setIsEnrolling(true);
      
      await apiRequest("POST", "/api/courses/enroll", {
        courseId: id,
      });

      queryClient.invalidateQueries({ queryKey: [`/api/courses/${id}`] });

      toast({
        title: "Enrollment successful",
        description: "You have successfully enrolled in this course",
      });
    } catch (error: any) {
      toast({
        title: "Enrollment failed",
        description: error.message || "An error occurred during enrollment",
        variant: "destructive",
      });
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Course Details">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout title="Course Not Found">
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Course Not Found</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            The course you are looking for does not exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/courses">Back to Courses</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Course Details">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4 p-0">
          <Link href="/courses">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Link>
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <div className="relative h-56 overflow-hidden rounded-t-lg">
                <img 
                  src={course.thumbnail} 
                  alt={course.title} 
                  className="w-full h-full object-cover"
                />
                {course.progress && (
                  <div className="absolute inset-x-0 bottom-0">
                    <Progress value={course.progress.percentage} className="h-1 rounded-none" />
                  </div>
                )}
              </div>
              
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary bg-opacity-10 text-primary">
                    {course.category}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-secondary bg-opacity-10 text-secondary">
                    CPD: {course.cpdPoints} pts
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                    {course.difficulty}
                  </span>
                </div>
                <CardTitle>{course.title}</CardTitle>
                <CardDescription>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm mt-1">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <BookOpen className="mr-1 h-4 w-4" />
                      {course.modules} modules
                    </div>
                    <div className="flex items-center">
                      <Award className="mr-1 h-4 w-4" />
                      Accredited by {course.accreditedBy}
                    </div>
                    {course.rating && (
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {course.rating} ({course.reviews} reviews)
                      </div>
                    )}
                  </div>
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <Tabs defaultValue="overview">
                  <TabsList className="mb-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                    <TabsTrigger value="instructors">Instructors</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="overview">
                    <div className="prose max-w-none">
                      <p className="text-gray-600">{course.description}</p>
                      
                      <h3 className="text-lg font-semibold mt-6 mb-2">What you'll learn</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {course.learningOutcomes && course.learningOutcomes.map((outcome, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 text-success shrink-0 mt-0.5" />
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <h3 className="text-lg font-semibold mt-6 mb-2">This course is perfect for:</h3>
                      <ul className="space-y-1">
                        {course.targetAudience && course.targetAudience.map((audience, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 text-success shrink-0 mt-0.5" />
                            <span>{audience}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <h3 className="text-lg font-semibold mt-6 mb-2">CPD Information</h3>
                      <p>
                        This course is accredited for <strong>{course.cpdPoints} CPD points</strong> under the {course.accreditedBy} guidelines. Upon completion, you will receive a certificate that can be used for your professional development records.
                      </p>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="curriculum">
                    <div className="space-y-4">
                      <p className="text-sm text-gray-500 mb-4">
                        {course.modules} modules • {course.lessons || 'Multiple'} lessons • {course.duration} total length
                      </p>
                      
                      {course.modules && course.curriculum && course.curriculum.map((module: CourseModule, moduleIndex) => (
                        <Accordion type="single" collapsible key={moduleIndex}>
                          <AccordionItem value={`module-${moduleIndex}`} className="border rounded-lg px-4">
                            <AccordionTrigger className="py-3">
                              <div className="flex items-start">
                                <div className="flex-1 text-left">
                                  <h4 className="font-medium">{module.title}</h4>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {module.lessons.length} lessons • {module.duration}
                                  </p>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="pb-4">
                              <div className="space-y-2">
                                {module.lessons.map((lesson: CourseLesson, lessonIndex) => (
                                  <div 
                                    key={lessonIndex} 
                                    className="flex items-center justify-between p-3 rounded-md hover:bg-muted transition-colors"
                                  >
                                    <div className="flex items-center gap-3">
                                      {getLessonIcon(lesson.type)}
                                      <div>
                                        <p className="font-medium text-sm">{lesson.title}</p>
                                        <p className="text-xs text-gray-500">{lesson.duration}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center">
                                      {!course.progress ? (
                                        <Lock className="h-4 w-4 text-gray-400" />
                                      ) : lesson.completed ? (
                                        <CheckCircle className="h-4 w-4 text-success" />
                                      ) : (
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={!course.progress}>
                                          <Play className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="instructors">
                    {course.instructors && course.instructors.length > 0 ? (
                      <div className="space-y-6">
                        {course.instructors.map((instructor, index) => (
                          <div key={index} className="flex flex-col md:flex-row gap-4">
                            <Avatar className="h-20 w-20">
                              <AvatarImage src={instructor.image} />
                              <AvatarFallback>{instructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-lg">{instructor.name}</h3>
                              <p className="text-sm text-muted-foreground">{instructor.title}</p>
                              <p className="mt-2">{instructor.bio}</p>
                              {instructor.credentials && (
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {instructor.credentials.map((credential, cIndex) => (
                                    <span key={cIndex} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-800">
                                      {credential}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Instructor information will be updated soon.</p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="reviews">
                    <div className="space-y-4">
                      {course.reviews && course.reviews > 0 ? (
                        <>
                          <div className="flex items-center gap-4">
                            <div className="text-4xl font-bold">{course.rating}</div>
                            <div>
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star 
                                    key={star} 
                                    className={`h-5 w-5 ${star <= Math.round(course.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                  />
                                ))}
                              </div>
                              <p className="text-sm text-gray-500">{course.reviews} reviews</p>
                            </div>
                          </div>
                          
                          <p className="text-center text-gray-500 py-6">
                            Course reviews will be displayed here.
                          </p>
                        </>
                      ) : (
                        <p className="text-center text-gray-500 py-6">
                          No reviews yet. Be the first to review this course after completion.
                        </p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Course Enrollment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.progress ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Your progress</span>
                        <span className="font-medium">{course.progress.percentage}%</span>
                      </div>
                      <Progress value={course.progress.percentage} className="h-2" />
                    </div>
                    
                    <div className="rounded-lg bg-muted p-4">
                      <h4 className="font-medium flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2 text-success" />
                        You are enrolled
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Last accessed: {course.progress.lastAccessed}
                      </p>
                    </div>
                    
                    <Button className="w-full" asChild>
                      <Link href={`/courses/${id}/continue`}>Continue Learning</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">CPD Points:</span>
                      <span>{course.cpdPoints} points</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Course Access:</span>
                      <span>Lifetime</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Certificate:</span>
                      <span>Yes, on completion</span>
                    </div>
                    
                    <Button className="w-full" onClick={handleEnroll} disabled={isEnrolling}>
                      {isEnrolling ? "Processing..." : "Enroll Now"}
                    </Button>
                  </div>
                )}
                
                <div className="pt-4 space-y-3">
                  <h4 className="font-medium">This course includes:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Play className="h-4 w-4 text-muted-foreground" />
                      <span>{course.videoHours || 'Multiple'} hours of on-demand video</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span>{course.resources || 'Downloadable'} resources</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Access to discussion forums</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-muted-foreground" />
                      <span>Certificate of completion</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-muted-foreground" />
                      <span>Downloadable materials</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

// Helper function to get the appropriate icon based on lesson type
const getLessonIcon = (type: string) => {
  switch (type) {
    case 'video':
      return <Play className="h-4 w-4 text-primary" />;
    case 'text':
      return <FileText className="h-4 w-4 text-primary" />;
    case 'quiz':
      return <ChevronRight className="h-4 w-4 text-primary" />;
    case 'download':
      return <Download className="h-4 w-4 text-primary" />;
    default:
      return <BookOpen className="h-4 w-4 text-primary" />;
  }
};

export default CourseDetails;
