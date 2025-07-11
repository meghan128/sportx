import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import CourseCard from "@/components/courses/course-card";
import { Course, CourseFilter } from "@/lib/types";
import { useState } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, BookOpen, LayoutGrid, ListFilter } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<CourseFilter>({
    category: [],
    duration: "all",
    cpdPoints: "all",
    difficulty: "all"
  });
  
  const { data: courses, isLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses', searchQuery, filters],
  });
  
  const { data: categories } = useQuery<string[]>({
    queryKey: ['/api/courses/categories'],
  });
  
  const handleFilterChange = (key: keyof CourseFilter, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleCategoryFilterChange = (category: string) => {
    setFilters(prev => {
      const categories = [...prev.category];
      if (categories.includes(category)) {
        return { ...prev, category: categories.filter(c => c !== category) };
      } else {
        return { ...prev, category: [...categories, category] };
      }
    });
  };

  return (
    <DashboardLayout title="Courses">
      <div className="mb-6">
        <Card className="bg-gradient-to-br from-orange-400 via-red-500 to-purple-600 text-white border-0 shadow-xl animate-gradient-wave">
          <CardHeader className="pb-3 relative">
            <div className="absolute top-0 right-0 w-32 h-32 -mt-10 -mr-10 bg-gradient-to-br from-yellow-400/30 to-pink-400/40 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 relative">
              <div className="animate-float">
                <CardTitle className="text-2xl font-bold text-white neon-glow">🚀 Accredited Courses</CardTitle>
                <CardDescription className="text-white/90 font-medium">
                  ⚡ Browse and enroll in CPD accredited courses - Power up your career!
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={`bg-white/10 text-white border-white/20 hover:bg-white hover:text-orange-600 transition-all ${viewMode === 'grid' ? 'bg-white text-orange-600' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className={`bg-white/10 text-white border-white/20 hover:bg-white hover:text-orange-600 transition-all ${viewMode === 'list' ? 'bg-white text-orange-600' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <ListFilter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-orange-500" />
                <Input
                  type="search"
                  placeholder="🔍 Search courses..."
                  className="pl-8 bg-white/10 text-white placeholder:text-white/70 border-white/20 focus:border-yellow-400 focus:ring-yellow-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button className="bg-yellow-400 text-black hover:bg-yellow-500 font-bold animate-pulse-glow">
                <Filter className="mr-2 h-4 w-4" /> ⚡ Filter
              </Button>
            </div>
            
            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="filters">
                <AccordionTrigger>Course Filters</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                    <div>
                      <h4 className="font-medium mb-2">Category</h4>
                      <div className="space-y-2">
                        {categories && categories.map(category => (
                          <div className="flex items-center" key={category}>
                            <Checkbox 
                              id={`category-${category}`}
                              checked={filters.category.includes(category)}
                              onCheckedChange={() => handleCategoryFilterChange(category)}
                            />
                            <Label htmlFor={`category-${category}`} className="ml-2">{category}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Duration</h4>
                      <Select 
                        value={filters.duration} 
                        onValueChange={(value) => handleFilterChange('duration', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All durations</SelectItem>
                          <SelectItem value="short">Short (&lt; 2 hours)</SelectItem>
                          <SelectItem value="medium">Medium (2-5 hours)</SelectItem>
                          <SelectItem value="long">Long (&gt; 5 hours)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">CPD Points</h4>
                      <Select 
                        value={filters.cpdPoints} 
                        onValueChange={(value) => handleFilterChange('cpdPoints', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by points" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All points</SelectItem>
                          <SelectItem value="1-2">1-2 points</SelectItem>
                          <SelectItem value="3-5">3-5 points</SelectItem>
                          <SelectItem value="6-plus">6+ points</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Difficulty</h4>
                      <Select 
                        value={filters.difficulty} 
                        onValueChange={(value) => handleFilterChange('difficulty', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All levels</SelectItem>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {isLoading ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
                    <div className="h-40 bg-gray-200"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="border border-gray-200 rounded-lg overflow-hidden animate-pulse">
                    <div className="md:flex">
                      <div className="md:w-48 h-32 bg-gray-200"></div>
                      <div className="p-4 md:p-5 flex-1 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <>
              {courses && courses.length > 0 ? (
                viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {courses.map((course) => (
                      <CourseCard key={course.id} course={course} layout="grid" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <CourseCard key={course.id} course={course} layout="list" />
                    ))}
                  </div>
                )
              ) : (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                  <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                    <BookOpen className="h-8 w-8 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    We couldn't find any courses matching your criteria. Try adjusting your filters.
                  </p>
                  <Button onClick={() => {
                    setSearchQuery("");
                    setFilters({
                      category: [],
                      duration: "all",
                      cpdPoints: "all",
                      difficulty: "all"
                    });
                  }}>
                    Clear filters
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="in-progress">
          {/* In Progress courses content - similar structure to the "all" tab */}
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500">Display in-progress courses here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="completed">
          {/* Completed courses content */}
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500">Display completed courses here</p>
          </div>
        </TabsContent>
        
        <TabsContent value="saved">
          {/* Saved courses content */}
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500">Display saved courses here</p>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Courses;
