import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  FileText, 
  Download, 
  Search, 
  Filter, 
  BookOpen, 
  FileIcon, 
  FilePieChartIcon, 
  FileBarChart,
  BadgeCheck,
  FileCheck,
  Calendar,
  Star,
  Upload,
  Eye,
  ChevronDown,
  Clock,
  SlidersHorizontal,
  Bookmark,
  BookmarkPlus
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

// Helper functions
const getResourceIcon = (type: string) => {
  switch (type) {
    case 'research':
      return <FileBarChart className="h-12 w-12 text-blue-500" />;
    case 'protocol':
      return <FileCheck className="h-12 w-12 text-emerald-500" />;
    case 'guidelines':
      return <FileText className="h-12 w-12 text-amber-500" />;
    case 'tools':
      return <FilePieChartIcon className="h-12 w-12 text-indigo-600" />;
    default:
      return <FileIcon className="h-12 w-12 text-gray-500" />;
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    return `${Math.floor(diffDays / 7)} weeks ago`;
  } else {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric' 
    });
  }
};

const formatFileSize = (size: string): string => {
  // Already formatted, just return
  return size;
};

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'research' | 'protocol' | 'guidelines' | 'tools';
  category: string;
  uploadedBy: {
    id: string;
    name: string;
    profileImage?: string;
  };
  uploadedAt: string;
  fileSize: string;
  downloadUrl: string;
  verified: boolean;
  rating?: number;
  downloads: number;
  tags: string[];
}

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedResourceTypes, setSelectedResourceTypes] = useState<string[]>([]);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);
  
  // Mocked resources data
  const resources: Resource[] = [
    {
      id: "1",
      title: "ACL Injury Rehabilitation Protocol",
      description: "Evidence-based protocol for anterior cruciate ligament (ACL) rehabilitation with phased approach and return-to-sport criteria.",
      type: "protocol",
      category: "Physiotherapy",
      uploadedBy: {
        id: "2",
        name: "Dr. Rajesh Verma",
      },
      uploadedAt: "2023-11-15",
      fileSize: "2.4 MB",
      downloadUrl: "#",
      verified: true,
      rating: 4.7,
      downloads: 328,
      tags: ["ACL", "Rehabilitation", "Sports Injury", "Evidence-based"]
    },
    {
      id: "2",
      title: "Nutritional Guidelines for Elite Athletes",
      description: "Comprehensive guide for sports nutritionists working with high-performance athletes across various disciplines.",
      type: "guidelines",
      category: "Nutrition",
      uploadedBy: {
        id: "3",
        name: "Anika Sharma",
        profileImage: "https://randomuser.me/api/portraits/women/44.jpg"
      },
      uploadedAt: "2023-10-22",
      fileSize: "4.1 MB",
      downloadUrl: "#",
      verified: true,
      rating: 4.9,
      downloads: 456,
      tags: ["Nutrition", "Elite Athletes", "Performance", "Recovery"]
    },
    {
      id: "3",
      title: "Mental Resilience Building Techniques for Athletes",
      description: "Research paper on practical techniques to enhance mental toughness and performance under pressure.",
      type: "research",
      category: "Psychology",
      uploadedBy: {
        id: "4",
        name: "Dr. Sarah Williams",
        profileImage: "https://randomuser.me/api/portraits/women/22.jpg"
      },
      uploadedAt: "2023-12-05",
      fileSize: "1.8 MB",
      downloadUrl: "#",
      verified: true,
      rating: 4.5,
      downloads: 284,
      tags: ["Mental Health", "Resilience", "Sports Psychology", "Performance"]
    },
    {
      id: "4",
      title: "Biomechanical Analysis Toolkit for Sports Therapists",
      description: "Specialized software tools and templates for conducting comprehensive biomechanical assessments of athletes.",
      type: "tools",
      category: "Biomechanics",
      uploadedBy: {
        id: "5",
        name: "Vikram Singh",
      },
      uploadedAt: "2024-01-18",
      fileSize: "12.6 MB",
      downloadUrl: "#",
      verified: false,
      rating: 4.2,
      downloads: 178,
      tags: ["Biomechanics", "Analysis", "Assessment", "Injury Prevention"]
    },
    {
      id: "5",
      title: "Hydration Strategies for Endurance Athletes",
      description: "Evidence-based research on optimizing hydration before, during, and after endurance events in various environments.",
      type: "research",
      category: "Nutrition",
      uploadedBy: {
        id: "6",
        name: "Dr. Priya Nair",
        profileImage: "https://randomuser.me/api/portraits/women/68.jpg"
      },
      uploadedAt: "2023-09-30",
      fileSize: "3.7 MB",
      downloadUrl: "#",
      verified: true,
      rating: 4.8,
      downloads: 412,
      tags: ["Hydration", "Endurance", "Performance", "Nutrition"]
    },
    {
      id: "6",
      title: "Evidence-Based Kinesiology Taping Methods",
      description: "Illustrated guide to research-validated kinesiology taping techniques for common sports injuries and performance enhancement.",
      type: "guidelines",
      category: "Physiotherapy",
      uploadedBy: {
        id: "7",
        name: "Anand Patel",
      },
      uploadedAt: "2024-02-10",
      fileSize: "8.2 MB",
      downloadUrl: "#",
      verified: true,
      rating: 4.6,
      downloads: 245,
      tags: ["Taping", "Kinesiology", "Physiotherapy", "Treatment"]
    }
  ];

  // Get unique categories
  const categories = [...new Set(resources.map(resource => resource.category))];
  
  // Get unique resource types
  const resourceTypes = [...new Set(resources.map(resource => resource.type))];

  const filteredResources = resources.filter(resource => {
    // Apply search filter
    const matchesSearch = 
      searchQuery === "" || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Apply category filter
    const matchesCategory = 
      selectedCategories.length === 0 || 
      selectedCategories.includes(resource.category);
    
    // Apply resource type filter
    const matchesType = 
      selectedResourceTypes.length === 0 || 
      selectedResourceTypes.includes(resource.type);
    
    // Apply verified filter
    const matchesVerified = 
      !showVerifiedOnly || 
      resource.verified;
    
    return matchesSearch && matchesCategory && matchesType && matchesVerified;
  });

  // Sort resources
  const sortedResources = [...filteredResources].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    } else if (sortBy === "popular") {
      return b.downloads - a.downloads;
    } else if (sortBy === "rating") {
      return (b.rating || 0) - (a.rating || 0);
    } else {
      return 0;
    }
  });

  // Get displayed resources based on tab
  const getTabResources = (tab: string) => {
    if (tab === "all") {
      return sortedResources;
    } else {
      return sortedResources.filter(r => r.type === tab);
    }
  };

  return (
    <DashboardLayout title="Resource Library">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-9 space-y-6">
          <Card className="border-0 shadow-md overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 -mt-10 -mr-10 bg-gradient-to-br from-primary/5 to-primary/10 rounded-full blur-3xl pointer-events-none"></div>
            <CardHeader className="relative">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold">Resource Library</CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    Explore our collection of research papers, protocols, and practical tools
                  </CardDescription>
                </div>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button className="gap-2 bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-600">
                      <Upload className="h-4 w-4" />
                      <span>Upload Resource</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-full md:max-w-md sm:max-w-full">
                    <SheetHeader className="mb-5">
                      <SheetTitle>Upload New Resource</SheetTitle>
                      <SheetDescription>
                        Share your knowledge with the community. All resources are reviewed for quality assurance.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium">Title</label>
                        <Input id="title" placeholder="Enter resource title" />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="description" className="text-sm font-medium">Description</label>
                        <textarea 
                          id="description" 
                          placeholder="Enter resource description" 
                          className="w-full min-h-[100px] p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                        ></textarea>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="category" className="text-sm font-medium">Category</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Physiotherapy">Physiotherapy</SelectItem>
                              <SelectItem value="Nutrition">Nutrition</SelectItem>
                              <SelectItem value="Psychology">Psychology</SelectItem>
                              <SelectItem value="Biomechanics">Biomechanics</SelectItem>
                              <SelectItem value="Strength & Conditioning">Strength & Conditioning</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <label htmlFor="type" className="text-sm font-medium">Resource Type</label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="research">Research Paper</SelectItem>
                              <SelectItem value="protocol">Protocol</SelectItem>
                              <SelectItem value="guidelines">Guidelines</SelectItem>
                              <SelectItem value="tools">Tools</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="tags" className="text-sm font-medium">Tags</label>
                        <Input id="tags" placeholder="Enter tags separated by commas" />
                        <p className="text-xs text-gray-500">Examples: ACL, Rehabilitation, Performance</p>
                      </div>
                      
                      <div className="space-y-2 border-2 border-dashed rounded-lg p-4 text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400" />
                        <p className="text-sm font-medium">Drag and drop your file here</p>
                        <p className="text-xs text-gray-500">Supported formats: PDF, DOCX, XLSX, PPTX (max 50MB)</p>
                        <Button variant="outline" size="sm" className="mt-2">Browse Files</Button>
                      </div>
                      
                      <div className="flex items-start space-x-2 mt-4">
                        <Checkbox id="terms" />
                        <label htmlFor="terms" className="text-xs text-gray-600">
                          I confirm this content does not violate any copyright laws and I have the right to share this resource.
                        </label>
                      </div>
                    </div>
                    <SheetFooter>
                      <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <SheetClose asChild>
                          <Button variant="outline" className="sm:flex-1">Cancel</Button>
                        </SheetClose>
                        <Button className="sm:flex-1">Upload Resource</Button>
                      </div>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-2 relative">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search resources, topics, or keywords..."
                    className="pl-10 w-full bg-gray-50 border-gray-200 focus-visible:bg-white transition-colors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2 md:w-auto w-full">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-1 flex-1 md:flex-none bg-gray-50">
                        <SlidersHorizontal className="h-4 w-4" />
                        <span>Filters</span>
                        {(selectedCategories.length > 0 || selectedResourceTypes.length > 0 || showVerifiedOnly) && (
                          <Badge className="ml-1 h-5 bg-primary text-white">{selectedCategories.length + selectedResourceTypes.length + (showVerifiedOnly ? 1 : 0)}</Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 p-0">
                      <div className="p-3 border-b">
                        <p className="font-medium">Filter Resources</p>
                        <p className="text-xs text-gray-500">Apply multiple filters</p>
                      </div>
                      
                      <div className="p-3 border-b">
                        <p className="text-sm font-medium mb-2">Categories</p>
                        <div className="space-y-2">
                          {categories.map((category) => (
                            <div key={category} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`category-${category}`} 
                                checked={selectedCategories.includes(category)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedCategories([...selectedCategories, category]);
                                  } else {
                                    setSelectedCategories(selectedCategories.filter(c => c !== category));
                                  }
                                }}
                              />
                              <label 
                                htmlFor={`category-${category}`}
                                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {category}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-3 border-b">
                        <p className="text-sm font-medium mb-2">Resource Type</p>
                        <div className="space-y-2">
                          {resourceTypes.map((type) => (
                            <div key={type} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`type-${type}`} 
                                checked={selectedResourceTypes.includes(type)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedResourceTypes([...selectedResourceTypes, type]);
                                  } else {
                                    setSelectedResourceTypes(selectedResourceTypes.filter(t => t !== type));
                                  }
                                }}
                              />
                              <label 
                                htmlFor={`type-${type}`}
                                className="text-sm capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {type}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-3 border-b">
                        <div className="flex items-center space-x-2">
                          <Checkbox 
                            id="verified-only" 
                            checked={showVerifiedOnly}
                            onCheckedChange={(checked) => setShowVerifiedOnly(!!checked)}
                          />
                          <label 
                            htmlFor="verified-only"
                            className="text-sm leading-none flex items-center gap-1"
                          >
                            <span>Verified resources only</span>
                            <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
                          </label>
                        </div>
                      </div>
                      
                      <div className="p-3 flex justify-between">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            setSelectedCategories([]);
                            setSelectedResourceTypes([]);
                            setShowVerifiedOnly(false);
                          }}
                        >
                          Reset all
                        </Button>
                        <Button size="sm">Apply Filters</Button>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[140px] bg-gray-50">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <SelectValue placeholder="Sort by" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Most Recent</SelectItem>
                      <SelectItem value="popular">Most Downloaded</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="w-full justify-start mb-6 bg-gray-50/80 p-1">
                  <TabsTrigger value="all" className="flex-1 sm:flex-none rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">All Resources</TabsTrigger>
                  <TabsTrigger value="research" className="flex-1 sm:flex-none rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Research</TabsTrigger>
                  <TabsTrigger value="protocol" className="flex-1 sm:flex-none rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Protocols</TabsTrigger>
                  <TabsTrigger value="guidelines" className="flex-1 sm:flex-none rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Guidelines</TabsTrigger>
                  <TabsTrigger value="tools" className="flex-1 sm:flex-none rounded-md data-[state=active]:bg-white data-[state=active]:shadow-sm">Tools</TabsTrigger>
                </TabsList>
                
                {["all", "research", "protocol", "guidelines", "tools"].map((tab) => (
                  <TabsContent key={tab} value={tab} className="space-y-6 mt-0">
                    {getTabResources(tab).length > 0 ? (
                      getTabResources(tab).map((resource) => (
                        <ResourceCard key={resource.id} resource={resource} />
                      ))
                    ) : (
                      <div className="text-center py-12 bg-gray-50/50 rounded-xl border border-gray-100">
                        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                          <BookOpen className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-800 mb-2">No resources found</h3>
                        <p className="text-gray-500 max-w-md mx-auto mb-6">
                          {searchQuery 
                            ? "We couldn't find any resources matching your search criteria. Try using different keywords or filters."
                            : `No ${tab !== 'all' ? tab : ''} resources available at the moment.`
                          }
                        </p>
                        {searchQuery && (
                          <Button onClick={() => setSearchQuery("")} variant="outline">
                            Clear search
                          </Button>
                        )}
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-3 space-y-6">
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Quick Access</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1.5">
                <Button variant="ghost" className="w-full justify-start font-normal">
                  <BookmarkPlus className="mr-2 h-4 w-4" />
                  Saved Resources
                </Button>
                <Button variant="ghost" className="w-full justify-start font-normal">
                  <Upload className="mr-2 h-4 w-4" />
                  My Uploads
                </Button>
                <Button variant="ghost" className="w-full justify-start font-normal">
                  <Clock className="mr-2 h-4 w-4" />
                  Recently Viewed
                </Button>
                <Button variant="ghost" className="w-full justify-start font-normal">
                  <Download className="mr-2 h-4 w-4" />
                  Downloaded Items
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Resource Categories</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-1.5">
                {categories.map((category) => (
                  <Button 
                    key={category}
                    variant="ghost" 
                    className="w-full justify-start font-normal"
                    onClick={() => {
                      if (selectedCategories.includes(category)) {
                        setSelectedCategories(selectedCategories.filter(c => c !== category));
                      } else {
                        setSelectedCategories([...selectedCategories, category]);
                      }
                    }}
                  >
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      category === 'Physiotherapy' ? 'bg-blue-500' :
                      category === 'Nutrition' ? 'bg-green-500' :
                      category === 'Psychology' ? 'bg-purple-500' :
                      category === 'Biomechanics' ? 'bg-amber-500' :
                      'bg-gray-500'
                    }`}></div>
                    {category}
                    <span className="ml-auto text-xs text-gray-500">
                      {resources.filter(r => r.category === category).length}
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold">Popular Tags</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {[...new Set(resources.flatMap(r => r.tags))]
                  .sort((a, b) => {
                    // Count occurrences of each tag
                    const countA = resources.filter(r => r.tags.includes(a)).length;
                    const countB = resources.filter(r => r.tags.includes(b)).length;
                    return countB - countA;
                  })
                  .slice(0, 10)
                  .map((tag) => (
                    <Badge 
                      key={tag} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => setSearchQuery(tag)}
                    >
                      {tag}
                    </Badge>
                  ))
                }
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-md bg-gradient-to-br from-primary/5 to-primary/20">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <BookOpen className="h-8 w-8 mx-auto text-primary" />
                <h3 className="font-semibold text-primary">Submit Your Resource</h3>
                <p className="text-sm text-gray-600">
                  Share your knowledge with the community. All contributions are peer-reviewed.
                </p>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button className="mt-2 w-full">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Now
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    {/* Same content as the other upload sheet */}
                  </SheetContent>
                </Sheet>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard = ({ resource }: ResourceCardProps) => {
  return (
    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow duration-200 group">
      <div className="md:flex">
        <div className="md:shrink-0 p-6 flex items-center justify-center border-r border-gray-100 bg-gray-50/50 md:w-[130px]">
          {getResourceIcon(resource.type)}
        </div>
        <div className="p-6 flex-1">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="outline" className="bg-gray-50 text-xs font-normal">
                  {resource.category}
                </Badge>
                <Badge variant="outline" className="bg-gray-50 text-xs capitalize font-normal">
                  {resource.type}
                </Badge>
                {resource.verified && (
                  <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border-0 text-xs flex items-center gap-0.5">
                    <BadgeCheck className="h-3 w-3" /> Verified
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors duration-200">{resource.title}</h3>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{resource.description}</p>
              
              <div className="flex flex-wrap gap-1.5 mt-3">
                {resource.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs font-normal bg-gray-100/80 text-gray-700 hover:bg-gray-200">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="md:ml-4 md:text-right flex md:flex-col flex-row items-center md:items-end gap-3 md:gap-1.5 mt-3 md:mt-0">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(resource.uploadedAt)}</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Download className="h-3.5 w-3.5" />
                <span>{resource.downloads} downloads</span>
              </div>
              {resource.rating && (
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-3.5 w-3.5 ${
                        star <= Math.round(resource.rating!) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-gray-300'
                      }`} 
                    />
                  ))}
                  <span className="text-xs ml-1 text-gray-700">{resource.rating}</span>
                </div>
              )}
              <Badge variant="outline" className="text-xs font-normal border-gray-200 hidden md:flex">
                {formatFileSize(resource.fileSize)}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 border border-gray-100">
                <AvatarImage src={resource.uploadedBy.profileImage} />
                <AvatarFallback className="bg-primary/10 text-primary">{resource.uploadedBy.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="ml-2">
                <p className="text-sm font-medium">{resource.uploadedBy.name}</p>
                <p className="text-xs text-gray-500">Uploaded by</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <BookmarkPlus className="mr-1.5 h-3.5 w-3.5" />
                Save
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Eye className="h-3.5 w-3.5" />
                <span>Preview</span>
              </Button>
              <Button size="sm" className="gap-1 bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-600">
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Resources;