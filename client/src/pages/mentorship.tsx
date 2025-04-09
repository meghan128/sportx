import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { 
  Card, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Search, Filter, Users, Calendar, GraduationCap, Clock } from "lucide-react";
import MentorCard from "@/components/community/mentorship/mentor-card";
import { Badge } from "@/components/ui/badge";
import { MentorshipOpportunity } from "@/lib/types";

const specialties = [
  "Physiotherapy", 
  "Sports Nutrition", 
  "Strength & Conditioning", 
  "Sport Psychology", 
  "Biomechanics", 
  "Rehabilitation",
  "Performance Analysis"
];

const MentorshipPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  
  const { data: mentors, isLoading } = useQuery<MentorshipOpportunity[]>({
    queryKey: ['/api/community/mentorships'],
  });
  
  const toggleSpecialty = (specialty: string) => {
    if (selectedSpecialties.includes(specialty)) {
      setSelectedSpecialties(selectedSpecialties.filter(s => s !== specialty));
    } else {
      setSelectedSpecialties([...selectedSpecialties, specialty]);
    }
  };
  
  // Filter mentors based on search and filters
  const filteredMentors = mentors?.filter(mentor => {
    // Search filter
    const matchesSearch = 
      searchTerm === "" || 
      mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mentor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Specialty filter
    const matchesSpecialty = 
      selectedSpecialties.length === 0 || 
      mentor.specialties.some(s => selectedSpecialties.includes(s));
    
    return matchesSearch && matchesSpecialty;
  });
  
  return (
    <DashboardLayout title="Mentorship">
      <div className="space-y-6">
        {/* Header Banner */}
        <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-background border-none shadow-sm">
          <CardContent className="p-6 md:p-8">
            <div className="max-w-3xl">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Find Your Perfect Mentor</h1>
              <p className="text-muted-foreground mb-6">
                Connect with experienced professionals in your field for guidance, career advice, and skill development.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search by name, specialty, or position..." 
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Availability" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any Availability</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="weekends">Weekends Only</SelectItem>
                    <SelectItem value="evenings">Evenings Only</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="sm:w-auto flex gap-2">
                  <Filter className="h-4 w-4" />
                  <span>More Filters</span>
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {specialties.map(specialty => (
                  <Badge 
                    key={specialty}
                    variant={selectedSpecialties.includes(specialty) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleSpecialty(specialty)}
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Mentorship Features */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <Users className="h-6 w-6 text-primary mb-2" />
              <CardTitle className="text-base">1-on-1 Guidance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Personalized career advice and direct guidance from industry experts.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <Calendar className="h-6 w-6 text-primary mb-2" />
              <CardTitle className="text-base">Flexible Scheduling</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Book sessions that work with your schedule, including evenings and weekends.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <GraduationCap className="h-6 w-6 text-primary mb-2" />
              <CardTitle className="text-base">CPD Recognition</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Mentorship sessions count toward your continuing professional development credits.
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs for different views */}
        <Tabs defaultValue="browse">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="browse">Browse Mentors</TabsTrigger>
              <TabsTrigger value="sessions">My Sessions</TabsTrigger>
              <TabsTrigger value="become">Become a Mentor</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant={viewType === "grid" ? "default" : "outline"}
                className="h-8 px-2"
                onClick={() => setViewType("grid")}
              >
                Grid
              </Button>
              <Button 
                size="sm" 
                variant={viewType === "list" ? "default" : "outline"}
                className="h-8 px-2"
                onClick={() => setViewType("list")}
              >
                List
              </Button>
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <TabsContent value="browse" className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="flex justify-center">
                        <div className="h-20 w-20 rounded-full bg-gray-200" />
                      </div>
                      <div className="h-5 bg-gray-200 rounded w-1/3 mx-auto mt-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mt-2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-1.5">
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                        <div className="h-6 bg-gray-200 rounded w-24"></div>
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-center gap-2">
                      <div className="h-8 bg-gray-200 rounded w-24"></div>
                      <div className="h-8 bg-gray-200 rounded w-36"></div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : filteredMentors && filteredMentors.length > 0 ? (
              <div className={`grid gap-6 ${
                viewType === "grid" 
                  ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                  : "grid-cols-1"
              }`}>
                {filteredMentors.map((mentor) => (
                  <MentorCard key={mentor.id} mentor={mentor} layout={viewType} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No mentors found matching your criteria</p>
                <Button onClick={() => {
                  setSearchTerm("");
                  setSelectedSpecialties([]);
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="sessions" className="mt-0">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No Upcoming Sessions</h3>
              <p className="text-muted-foreground mb-6">
                You don't have any mentorship sessions scheduled. Browse our mentors to find someone who can help with your career goals.
              </p>
              <Button>Find a Mentor</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="become" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Share Your Expertise</CardTitle>
                <CardDescription>
                  Become a mentor and help shape the next generation of sports and allied health professionals.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">Flexible Scheduling</h3>
                    <p className="text-sm text-muted-foreground">Choose your own availability and session format.</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Additional Income</h3>
                    <p className="text-sm text-muted-foreground">Set your own rates for premium consultation sessions.</p>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">Professional Growth</h3>
                    <p className="text-sm text-muted-foreground">Build your reputation and expand your professional network.</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-center">
                  <Button size="lg">Apply to Become a Mentor</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default MentorshipPage;