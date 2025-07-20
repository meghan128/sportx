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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  CalendarIcon,
  Clock,
  Users,
  MapPin,
  Upload,
  Video,
  Link,
  Plus,
  Trash2,
  ArrowLeft,
  Presentation,
  MonitorPlay,
  FileText,
  Settings,
  Globe,
  CheckCircle2
} from "lucide-react";
import { Link as RouterLink } from "wouter";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import ResourceSidebar from "@/components/layout/resource-sidebar";
import { useToast } from "@/hooks/use-toast";

// Workshop creation schema
const workshopSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  type: z.enum(["live", "recorded", "hybrid"]),
  format: z.enum(["workshop", "webinar", "masterclass", "certification"]),
  date: z.date({
    required_error: "Please select a date",
  }),
  startTime: z.string().min(1, "Start time is required"),
  duration: z.number().min(15, "Minimum duration is 15 minutes"),
  maxAttendees: z.number().min(1, "At least 1 attendee required"),
  price: z.number().min(0),
  cpdPoints: z.number().min(0).max(20),
  language: z.string().default("English"),
  prerequisites: z.string().optional(),
  materials: z.array(z.string()).optional(),
  isRecorded: z.boolean().default(false),
  allowReplay: z.boolean().default(false),
  location: z.string().optional(),
  meetingLink: z.string().url().optional().or(z.literal("")),
  requirements: z.string().optional(),
});

type WorkshopFormData = z.infer<typeof workshopSchema>;

interface WorkshopResource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'template';
  url?: string;
  file?: File;
}

export default function ResourceWorkshopCreation() {
  const { toast } = useToast();
  const [resources, setResources] = useState<WorkshopResource[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();

  const form = useForm<WorkshopFormData>({
    resolver: zodResolver(workshopSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      type: "live",
      format: "workshop",
      startTime: "",
      duration: 60,
      maxAttendees: 50,
      price: 0,
      cpdPoints: 2,
      language: "English",
      prerequisites: "",
      materials: [],
      isRecorded: false,
      allowReplay: false,
      location: "",
      meetingLink: "",
      requirements: "",
    },
  });

  const workshopType = form.watch("type");
  const format = form.watch("format");

  // Add resource
  const addResource = (type: WorkshopResource['type']) => {
    const newResource: WorkshopResource = {
      id: `resource-${Date.now()}`,
      title: "",
      type,
    };
    setResources([...resources, newResource]);
  };

  // Remove resource
  const removeResource = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
  };

  // Handle file upload for resources
  const handleResourceFileUpload = (resourceId: string, file: File) => {
    setResources(resources.map(r => 
      r.id === resourceId ? { ...r, file, title: file.name } : r
    ));
  };

  const onSubmit = (data: WorkshopFormData) => {
    console.log("Workshop data:", data);
    console.log("Resources:", resources);
    
    toast({
      title: "Workshop created successfully!",
      description: "Your workshop has been scheduled and is ready for attendees.",
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <ResourceSidebar />
      <main className="flex-1 ml-64">
        <div className="container mx-auto p-6 max-w-4xl">
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
                <h1 className="text-3xl font-bold">Create Workshop</h1>
                <p className="text-muted-foreground">Design engaging live learning experiences</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">
                Save Draft
              </Button>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Presentation className="h-5 w-5 mr-2" />
                    Workshop Details
                  </CardTitle>
                  <CardDescription>
                    Set up the basic information for your workshop
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workshop Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Advanced Injury Assessment Techniques" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe what participants will learn in this workshop..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Workshop Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="live">Live Workshop</SelectItem>
                              <SelectItem value="recorded">Pre-recorded</SelectItem>
                              <SelectItem value="hybrid">Hybrid (Live + Recording)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="format"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Format</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select format" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="workshop">Interactive Workshop</SelectItem>
                              <SelectItem value="webinar">Educational Webinar</SelectItem>
                              <SelectItem value="masterclass">Expert Masterclass</SelectItem>
                              <SelectItem value="certification">Certification Training</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Schedule & Logistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    Schedule & Logistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Workshop Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date() || date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Start Time</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (minutes)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="15"
                              step="15"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="maxAttendees"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximum Attendees</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
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
                              min="0"
                              max="20"
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {workshopType === "live" && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="meetingLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Meeting Link</FormLabel>
                            <FormControl>
                              <Input placeholder="https://zoom.us/j/..." {...field} />
                            </FormControl>
                            <FormDescription>
                              Add your Zoom, Teams, or other meeting platform link
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex items-center space-x-2">
                        <FormField
                          control={form.control}
                          name="isRecorded"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Record Workshop</FormLabel>
                                <FormDescription>
                                  Allow this workshop to be recorded for later viewing
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {form.watch("isRecorded") && (
                        <FormField
                          control={form.control}
                          name="allowReplay"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                              <div className="space-y-0.5">
                                <FormLabel>Allow Replay Access</FormLabel>
                                <FormDescription>
                                  Let attendees access the recording afterward
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Resources & Materials */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Upload className="h-5 w-5 mr-2" />
                    Workshop Resources
                  </CardTitle>
                  <CardDescription>
                    Add materials that participants will receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => addResource('pdf')}
                      className="h-20 flex-col"
                    >
                      <FileText className="h-6 w-6 mb-2" />
                      Add PDF
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => addResource('video')}
                      className="h-20 flex-col"
                    >
                      <Video className="h-6 w-6 mb-2" />
                      Add Video
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => addResource('link')}
                      className="h-20 flex-col"
                    >
                      <Link className="h-6 w-6 mb-2" />
                      Add Link
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => addResource('template')}
                      className="h-20 flex-col"
                    >
                      <Settings className="h-6 w-6 mb-2" />
                      Template
                    </Button>
                  </div>

                  {resources.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Added Resources</h4>
                      {resources.map((resource) => (
                        <div key={resource.id} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                          <div className="flex-shrink-0">
                            {resource.type === 'pdf' && <FileText className="h-5 w-5" />}
                            {resource.type === 'video' && <Video className="h-5 w-5" />}
                            {resource.type === 'link' && <Link className="h-5 w-5" />}
                            {resource.type === 'template' && <Settings className="h-5 w-5" />}
                          </div>
                          <Input 
                            placeholder={`${resource.type.charAt(0).toUpperCase()}${resource.type.slice(1)} title`}
                            value={resource.title}
                            onChange={(e) => {
                              setResources(resources.map(r => 
                                r.id === resource.id ? { ...r, title: e.target.value } : r
                              ));
                            }}
                            className="flex-1"
                          />
                          {resource.type === 'link' && (
                            <Input 
                              placeholder="https://"
                              value={resource.url || ""}
                              onChange={(e) => {
                                setResources(resources.map(r => 
                                  r.id === resource.id ? { ...r, url: e.target.value } : r
                                ));
                              }}
                              className="flex-1"
                            />
                          )}
                          {resource.type !== 'link' && (
                            <div>
                              <input
                                type="file"
                                accept={resource.type === 'video' ? 'video/*' : resource.type === 'pdf' ? '.pdf' : '*'}
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    handleResourceFileUpload(resource.id, file);
                                  }
                                }}
                                className="hidden"
                                id={`file-${resource.id}`}
                              />
                              <label htmlFor={`file-${resource.id}`}>
                                <Button variant="outline" size="sm" className="cursor-pointer">
                                  <Upload className="h-4 w-4 mr-1" />
                                  Upload
                                </Button>
                              </label>
                            </div>
                          )}
                          <Badge variant="outline" className="capitalize">
                            {resource.type}
                          </Badge>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            onClick={() => removeResource(resource.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Technical Requirements</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="What do participants need? (e.g., laptop, specific software, materials)"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle>Pricing & Registration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workshop Price (£)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            step="0.01"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>
                          Set to 0 for free workshops
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Submit */}
              <div className="flex justify-end space-x-4">
                <Button variant="outline" type="button">
                  Save as Draft
                </Button>
                <Button type="submit">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Create Workshop
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}