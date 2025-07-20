import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen,
  Upload,
  Video,
  FileText,
  Image,
  Mic,
  Link,
  Plus,
  Trash2,
  Eye,
  Save,
  Settings,
  CheckCircle2,
  Clock,
  Users,
  Star,
  Play,
  Download,
  MonitorPlay,
  PresentationChart,
  ArrowLeft
} from "lucide-react";
import { Link as RouterLink } from "wouter";
import ResourceSidebar from "@/components/layout/resource-sidebar";
import { useToast } from "@/hooks/use-toast";

// Course creation schema
const courseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  duration: z.string().min(1, "Duration is required"),
  cpdPoints: z.number().min(0).max(50),
  price: z.number().min(0),
  language: z.string().default("English"),
  prerequisites: z.string().optional(),
  learningOutcomes: z.array(z.string()).min(1, "Add at least one learning outcome"),
  tags: z.array(z.string()).optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

interface LessonContent {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment' | 'live_session' | 'download' | 'interactive';
  content?: string;
  videoUrl?: string;
  duration?: number;
  order: number;
}

interface CourseModule {
  id: string;
  title: string;
  description: string;
  lessons: LessonContent[];
  order: number;
}

export default function ResourceCourseCreation() {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [courseModules, setCourseModules] = useState<CourseModule[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewMode, setPreviewMode] = useState(false);

  const form = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      level: "beginner",
      duration: "",
      cpdPoints: 0,
      price: 0,
      language: "English",
      prerequisites: "",
      learningOutcomes: [],
      tags: [],
    },
  });

  const totalSteps = 5;
  const progressPercentage = (currentStep / totalSteps) * 100;

  // Add learning outcome
  const addLearningOutcome = () => {
    const outcomes = form.getValues("learningOutcomes");
    form.setValue("learningOutcomes", [...outcomes, ""]);
  };

  // Remove learning outcome
  const removeLearningOutcome = (index: number) => {
    const outcomes = form.getValues("learningOutcomes");
    form.setValue("learningOutcomes", outcomes.filter((_, i) => i !== index));
  };

  // Add course module
  const addModule = () => {
    const newModule: CourseModule = {
      id: `module-${Date.now()}`,
      title: "",
      description: "",
      lessons: [],
      order: courseModules.length + 1,
    };
    setCourseModules([...courseModules, newModule]);
  };

  // Add lesson to module
  const addLesson = (moduleId: string, type: LessonContent['type']) => {
    setCourseModules(modules => 
      modules.map(module => 
        module.id === moduleId 
          ? {
              ...module,
              lessons: [
                ...module.lessons,
                {
                  id: `lesson-${Date.now()}`,
                  title: "",
                  type,
                  order: module.lessons.length + 1,
                }
              ]
            }
          : module
      )
    );
  };

  // Handle file upload
  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setSelectedFiles(prev => [...prev, ...fileArray]);
    }
  };

  // Submit course
  const onSubmit = (data: CourseFormData) => {
    console.log("Course data:", data);
    console.log("Modules:", courseModules);
    console.log("Files:", selectedFiles);
    
    toast({
      title: "Course created successfully!",
      description: "Your course has been saved and is ready for review.",
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <ResourceSidebar />
      <main className="flex-1 ml-64">
        <div className="container mx-auto p-6 max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <RouterLink href="/resource-dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </RouterLink>
              <div>
                <h1 className="text-3xl font-bold">Create New Course</h1>
                <p className="text-muted-foreground">Build world-class online learning experiences</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? "Edit Mode" : "Preview"}
              </Button>
              <Button variant="outline">
                <Save className="h-4 w-4 mr-2" />
                Save Draft
              </Button>
            </div>
          </div>

          {/* Progress Indicator */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Course Creation Progress</span>
                <span className="text-sm text-muted-foreground">Step {currentStep} of {totalSteps}</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
              <div className="flex justify-between mt-4 text-xs text-muted-foreground">
                <span className={currentStep >= 1 ? "text-primary" : ""}>Basic Info</span>
                <span className={currentStep >= 2 ? "text-primary" : ""}>Content Structure</span>
                <span className={currentStep >= 3 ? "text-primary" : ""}>Lessons & Media</span>
                <span className={currentStep >= 4 ? "text-primary" : ""}>Assessment</span>
                <span className={currentStep >= 5 ? "text-primary" : ""}>Publish Settings</span>
              </div>
            </CardContent>
          </Card>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Tabs value={`step-${currentStep}`} className="w-full">
                <div className="grid gap-6">
                  {/* Step 1: Basic Course Information */}
                  <TabsContent value="step-1" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <BookOpen className="h-5 w-5 mr-2" />
                          Basic Course Information
                        </CardTitle>
                        <CardDescription>
                          Set up the fundamental details of your course
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Course Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Advanced Sports Rehabilitation Techniques" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Create a compelling title that clearly describes your course
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="sports-therapy">Sports Therapy</SelectItem>
                                    <SelectItem value="rehabilitation">Rehabilitation</SelectItem>
                                    <SelectItem value="performance">Performance Enhancement</SelectItem>
                                    <SelectItem value="nutrition">Sports Nutrition</SelectItem>
                                    <SelectItem value="psychology">Sports Psychology</SelectItem>
                                    <SelectItem value="coaching">Coaching & Leadership</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="level"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Difficulty Level</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="beginner">Beginner</SelectItem>
                                    <SelectItem value="intermediate">Intermediate</SelectItem>
                                    <SelectItem value="advanced">Advanced</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Course Duration</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., 8 weeks, 40 hours" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="cpdPoints"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CPD Points</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    placeholder="0" 
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Course Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Provide a detailed description of your course..."
                                  className="min-h-[120px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormDescription>
                                Explain what students will learn and why they should take this course
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="prerequisites"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Prerequisites (Optional)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Any requirements or recommended background knowledge..."
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Learning Outcomes */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <FormLabel>Learning Outcomes</FormLabel>
                            <Button type="button" variant="outline" size="sm" onClick={addLearningOutcome}>
                              <Plus className="h-4 w-4 mr-2" />
                              Add Outcome
                            </Button>
                          </div>
                          {form.watch("learningOutcomes").map((_, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <FormField
                                control={form.control}
                                name={`learningOutcomes.${index}`}
                                render={({ field }) => (
                                  <FormItem className="flex-1">
                                    <FormControl>
                                      <Input 
                                        placeholder={`Learning outcome ${index + 1}`}
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <Button 
                                type="button" 
                                variant="outline" 
                                size="sm"
                                onClick={() => removeLearningOutcome(index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Step 2: Content Structure */}
                  <TabsContent value="step-2" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <PresentationChart className="h-5 w-5 mr-2" />
                          Course Structure & Modules
                        </CardTitle>
                        <CardDescription>
                          Organize your course content into modules and lessons
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {courseModules.map((module, moduleIndex) => (
                            <Card key={module.id} className="border-l-4 border-l-primary">
                              <CardHeader>
                                <div className="flex items-center justify-between">
                                  <div className="flex-1 space-y-2">
                                    <Input 
                                      placeholder={`Module ${moduleIndex + 1} Title`}
                                      value={module.title}
                                      onChange={(e) => {
                                        setCourseModules(modules =>
                                          modules.map(m => 
                                            m.id === module.id 
                                              ? { ...m, title: e.target.value }
                                              : m
                                          )
                                        );
                                      }}
                                    />
                                    <Textarea 
                                      placeholder="Module description..."
                                      value={module.description}
                                      onChange={(e) => {
                                        setCourseModules(modules =>
                                          modules.map(m => 
                                            m.id === module.id 
                                              ? { ...m, description: e.target.value }
                                              : m
                                          )
                                        );
                                      }}
                                    />
                                  </div>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => {
                                      setCourseModules(modules => 
                                        modules.filter(m => m.id !== module.id)
                                      );
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-3">
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">Lessons</span>
                                    <div className="flex space-x-2">
                                      <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => addLesson(module.id, 'video')}
                                      >
                                        <Video className="h-4 w-4 mr-1" />
                                        Video
                                      </Button>
                                      <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => addLesson(module.id, 'text')}
                                      >
                                        <FileText className="h-4 w-4 mr-1" />
                                        Text
                                      </Button>
                                      <Button 
                                        type="button" 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => addLesson(module.id, 'quiz')}
                                      >
                                        <CheckCircle2 className="h-4 w-4 mr-1" />
                                        Quiz
                                      </Button>
                                    </div>
                                  </div>
                                  {module.lessons.map((lesson, lessonIndex) => (
                                    <div key={lesson.id} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                                      <div className="flex-shrink-0">
                                        {lesson.type === 'video' && <Video className="h-4 w-4" />}
                                        {lesson.type === 'text' && <FileText className="h-4 w-4" />}
                                        {lesson.type === 'quiz' && <CheckCircle2 className="h-4 w-4" />}
                                        {lesson.type === 'live_session' && <MonitorPlay className="h-4 w-4" />}
                                      </div>
                                      <Input 
                                        placeholder={`Lesson ${lessonIndex + 1} title`}
                                        value={lesson.title}
                                        className="flex-1"
                                        onChange={(e) => {
                                          setCourseModules(modules =>
                                            modules.map(m => 
                                              m.id === module.id 
                                                ? {
                                                    ...m,
                                                    lessons: m.lessons.map(l =>
                                                      l.id === lesson.id
                                                        ? { ...l, title: e.target.value }
                                                        : l
                                                    )
                                                  }
                                                : m
                                            )
                                          );
                                        }}
                                      />
                                      <Badge variant="outline" className="capitalize">
                                        {lesson.type.replace('_', ' ')}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                          
                          <Button 
                            type="button" 
                            variant="outline" 
                            className="w-full"
                            onClick={addModule}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Module
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Step 3: Media Upload */}
                  <TabsContent value="step-3" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Upload className="h-5 w-5 mr-2" />
                          Upload Course Content
                        </CardTitle>
                        <CardDescription>
                          Add videos, documents, images, and other learning materials
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6">
                          {/* File Upload Area */}
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">Drop files here or click to upload</h3>
                            <p className="text-muted-foreground mb-4">
                              Support for videos (MP4, MOV), documents (PDF, DOC), images (JPG, PNG), and audio files
                            </p>
                            <input
                              type="file"
                              multiple
                              accept="video/*,audio/*,image/*,.pdf,.doc,.docx,.ppt,.pptx"
                              onChange={(e) => handleFileUpload(e.target.files)}
                              className="hidden"
                              id="file-upload"
                            />
                            <label htmlFor="file-upload">
                              <Button variant="outline" className="cursor-pointer">
                                Choose Files
                              </Button>
                            </label>
                          </div>

                          {/* Uploaded Files */}
                          {selectedFiles.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="font-medium">Uploaded Files</h4>
                              {selectedFiles.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                                  <div className="flex items-center space-x-3">
                                    <div className="flex-shrink-0">
                                      {file.type.startsWith('video/') && <Video className="h-5 w-5" />}
                                      {file.type.startsWith('audio/') && <Mic className="h-5 w-5" />}
                                      {file.type.startsWith('image/') && <Image className="h-5 w-5" />}
                                      {file.type.includes('pdf') && <FileText className="h-5 w-5" />}
                                    </div>
                                    <div>
                                      <p className="font-medium">{file.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {(file.size / 1024 / 1024).toFixed(2)} MB
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Button variant="outline" size="sm">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => {
                                        setSelectedFiles(files => files.filter((_, i) => i !== index));
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Content Creation Tools */}
                          <Separator />
                          <div className="space-y-4">
                            <h4 className="font-medium">Content Creation Tools</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                                <CardContent className="p-6 text-center">
                                  <MonitorPlay className="h-8 w-8 text-primary mx-auto mb-2" />
                                  <h5 className="font-medium">Screen Recording</h5>
                                  <p className="text-sm text-muted-foreground">Record your screen for tutorials</p>
                                </CardContent>
                              </Card>
                              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                                <CardContent className="p-6 text-center">
                                  <Mic className="h-8 w-8 text-primary mx-auto mb-2" />
                                  <h5 className="font-medium">Audio Recording</h5>
                                  <p className="text-sm text-muted-foreground">Record narration directly</p>
                                </CardContent>
                              </Card>
                              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                                <CardContent className="p-6 text-center">
                                  <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
                                  <h5 className="font-medium">Rich Text Editor</h5>
                                  <p className="text-sm text-muted-foreground">Create interactive content</p>
                                </CardContent>
                              </Card>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </div>
              </Tabs>

              {/* Navigation */}
              <div className="flex justify-between items-center pt-6 border-t">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>
                
                <div className="flex space-x-2">
                  {currentStep < totalSteps ? (
                    <Button 
                      type="button"
                      onClick={() => setCurrentStep(Math.min(totalSteps, currentStep + 1))}
                    >
                      Next Step
                    </Button>
                  ) : (
                    <Button type="submit">
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Create Course
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}