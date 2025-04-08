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
  Star
} from "lucide-react";

// Helper functions
const getResourceIcon = (type: string) => {
  switch (type) {
    case 'research':
      return <FileBarChart className="h-10 w-10 text-blue-500" />;
    case 'protocol':
      return <FileCheck className="h-10 w-10 text-green-500" />;
    case 'guidelines':
      return <FileText className="h-10 w-10 text-amber-500" />;
    case 'tools':
      return <FilePieChartIcon className="h-10 w-10 text-purple-500" />;
    default:
      return <FileIcon className="h-10 w-10 text-gray-500" />;
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric',
    month: 'short', 
    day: 'numeric' 
  });
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

  const filteredResources = resources.filter(resource => 
    resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <DashboardLayout title="Resource Library">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Professional Resources</CardTitle>
                <CardDescription>
                  Access research papers, treatment protocols, and industry guidelines
                </CardDescription>
              </div>
              <Button>
                Upload Resource
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative w-full mb-6">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search resources, topics, or keywords..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Tabs defaultValue="all">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <TabsList>
                  <TabsTrigger value="all">All Resources</TabsTrigger>
                  <TabsTrigger value="research">Research</TabsTrigger>
                  <TabsTrigger value="protocols">Protocols</TabsTrigger>
                  <TabsTrigger value="guidelines">Guidelines</TabsTrigger>
                  <TabsTrigger value="tools">Tools</TabsTrigger>
                </TabsList>
                
                <div className="mt-4 md:mt-0 flex items-center">
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="ml-2 gap-1">
                    <Star className="h-3.5 w-3.5" />
                    Most Popular
                  </Button>
                </div>
              </div>
              
              <TabsContent value="all">
                <div className="space-y-4">
                  {filteredResources.length > 0 ? (
                    filteredResources.map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))
                  ) : (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                      <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                        <BookOpen className="h-8 w-8 text-gray-500" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No resources found</h3>
                      <p className="text-gray-500 max-w-md mx-auto mb-6">
                        We couldn't find any resources matching your search criteria. Try using different keywords.
                      </p>
                      <Button onClick={() => setSearchQuery("")}>
                        Clear search
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="research">
                <div className="space-y-4">
                  {filteredResources.filter(r => r.type === 'research').map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="protocols">
                <div className="space-y-4">
                  {filteredResources.filter(r => r.type === 'protocol').map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="guidelines">
                <div className="space-y-4">
                  {filteredResources.filter(r => r.type === 'guidelines').map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="tools">
                <div className="space-y-4">
                  {filteredResources.filter(r => r.type === 'tools').map((resource) => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard = ({ resource }: ResourceCardProps) => {
  
  return (
    <Card className="overflow-hidden">
      <div className="md:flex">
        <div className="md:shrink-0 p-6 flex items-center justify-center border-r border-gray-100">
          {getResourceIcon(resource.type)}
        </div>
        <div className="p-6 flex-1">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-xs">
                  {resource.category}
                </Badge>
                <Badge variant="outline" className="text-xs capitalize">
                  {resource.type}
                </Badge>
                {resource.verified && (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-0 text-xs flex items-center gap-0.5">
                    <BadgeCheck className="h-3 w-3" /> Verified
                  </Badge>
                )}
              </div>
              <h3 className="font-semibold text-lg">{resource.title}</h3>
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">{resource.description}</p>
              
              <div className="flex flex-wrap gap-1 mt-3">
                {resource.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="mt-4 md:mt-0 md:ml-4 md:text-right flex flex-col items-start md:items-end">
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDate(resource.uploadedAt)}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <Download className="h-3.5 w-3.5" />
                <span>{resource.downloads} downloads</span>
              </div>
              {resource.rating && (
                <div className="flex items-center mt-1">
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
                  <span className="text-sm ml-1">{resource.rating}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src={resource.uploadedBy.profileImage} />
                <AvatarFallback>{resource.uploadedBy.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="ml-2">
                <p className="text-sm font-medium">{resource.uploadedBy.name}</p>
                <p className="text-xs text-muted-foreground">Uploaded by</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Preview
              </Button>
              <Button size="sm">
                <Download className="mr-1 h-3.5 w-3.5" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Resources;