import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import EventCard from "@/components/events/event-card";
import { Event, EventFilter } from "@/lib/types";
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
import { Search, Filter } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const Events = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<EventFilter>({
    type: [],
    category: [],
    dateRange: "all",
    cpdPoints: "all"
  });
  
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ['/api/events', searchQuery, filters],
  });
  
  const { data: categories } = useQuery<string[]>({
    queryKey: ['/api/events/categories'],
  });
  
  const handleFilterChange = (key: keyof EventFilter, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleTypeFilterChange = (type: string) => {
    setFilters(prev => {
      const types = [...prev.type];
      if (types.includes(type)) {
        return { ...prev, type: types.filter(t => t !== type) };
      } else {
        return { ...prev, type: [...types, type] };
      }
    });
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
    <DashboardLayout title="Events">
      <div className="mb-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Discover Events</CardTitle>
            <CardDescription>
              Find and register for upcoming events to earn CPD credits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search events..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button>
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
            </div>
            
            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="filters">
                <AccordionTrigger>Advanced Filters</AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
                    <div>
                      <h4 className="font-medium mb-2">Event Type</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Checkbox 
                            id="in-person"
                            checked={filters.type.includes('In-person')}
                            onCheckedChange={() => handleTypeFilterChange('In-person')}
                          />
                          <Label htmlFor="in-person" className="ml-2">In-person</Label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox 
                            id="virtual"
                            checked={filters.type.includes('Virtual')}
                            onCheckedChange={() => handleTypeFilterChange('Virtual')}
                          />
                          <Label htmlFor="virtual" className="ml-2">Virtual</Label>
                        </div>
                        <div className="flex items-center">
                          <Checkbox 
                            id="hybrid"
                            checked={filters.type.includes('Hybrid')}
                            onCheckedChange={() => handleTypeFilterChange('Hybrid')}
                          />
                          <Label htmlFor="hybrid" className="ml-2">Hybrid</Label>
                        </div>
                      </div>
                    </div>
                    
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
                      <h4 className="font-medium mb-2">Date Range</h4>
                      <Select 
                        value={filters.dateRange} 
                        onValueChange={(value) => handleFilterChange('dateRange', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select date range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All dates</SelectItem>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="this-week">This week</SelectItem>
                          <SelectItem value="this-month">This month</SelectItem>
                          <SelectItem value="next-month">Next month</SelectItem>
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
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm">
              <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
                <Calendar className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                We couldn't find any events matching your criteria. Try adjusting your filters or check back soon for new events.
              </p>
              <Button onClick={() => {
                setSearchQuery("");
                setFilters({
                  type: [],
                  category: [],
                  dateRange: "all",
                  cpdPoints: "all"
                });
              }}>
                Clear filters
              </Button>
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

import { Calendar } from "lucide-react";

export default Events;
