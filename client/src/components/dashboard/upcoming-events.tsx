import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarClock, Filter, Calendar, MapPin } from "lucide-react";
import { Event } from "@/lib/types";
import EventCard from "../events/event-card";
import { Link } from "wouter";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UpcomingEvents = () => {
  const { data: events, isLoading } = useQuery<Event[]>({
    queryKey: ['/api/events/upcoming'],
  });
  
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique categories from events
  const categories: string[] = events 
    ? events.reduce((uniqueCategories: string[], event) => {
        if (event.category && !uniqueCategories.includes(event.category)) {
          uniqueCategories.push(event.category);
        }
        return uniqueCategories;
      }, [])
    : [];

  const filteredEvents = events
    ? events.filter(event => {
        if (activeTab !== "all" && event.type !== activeTab) return false;
        if (selectedCategory && event.category !== selectedCategory) return false;
        return true;
      })
    : [];

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div id="upcoming-events" className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
        </div>
        <Link href="/events" className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
          View all events <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="mb-4">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-2">
            <TabsTrigger value="all">All Events</TabsTrigger>
            <TabsTrigger value="In-person">In-person</TabsTrigger>
            <TabsTrigger value="Virtual">Virtual</TabsTrigger>
            <TabsTrigger value="Hybrid">Hybrid</TabsTrigger>
          </TabsList>
          
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center gap-1 h-7"
                onClick={() => setSelectedCategory(null)}
              >
                <Filter className="h-3.5 w-3.5" />
                <span className="text-xs">Categories:</span>
              </Button>
              
              {categories.map(category => (
                <Badge 
                  key={category} 
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(prev => prev === category ? null : category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          )}
        </Tabs>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
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
          {filteredEvents && filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.slice(0, 3).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="col-span-full text-center py-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full p-3 bg-gray-100 mb-2">
                      <Calendar className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No upcoming events found</h3>
                    <p className="text-gray-500 mb-4">
                      {selectedCategory 
                        ? `No ${activeTab !== 'all' ? activeTab.toLowerCase() : ''} events in the "${selectedCategory}" category.`
                        : activeTab !== 'all' 
                          ? `No ${activeTab.toLowerCase()} events scheduled.` 
                          : 'Check back soon for new events or explore our courses.'}
                    </p>
                    <div className="flex gap-3">
                      {selectedCategory && (
                        <Button variant="outline" size="sm" onClick={() => setSelectedCategory(null)}>
                          Reset filters
                        </Button>
                      )}
                      <Button asChild size="sm">
                        <Link href="/courses">Browse Courses</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Event Calendar Preview */}
          {events && events.length > 0 && (
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium">Event Calendar</h3>
                <Link href="/events" className="text-xs text-primary hover:text-primary-dark">
                  View full calendar
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {events.slice(0, 3).map((event) => (
                  <Link key={event.id} href={`/events/${event.id}`}>
                    <Card className="hover:bg-gray-50 cursor-pointer transition-colors">
                      <CardContent className="p-3 flex items-center space-x-3">
                        <div className="flex-shrink-0 w-12 h-12 rounded bg-primary/10 flex flex-col items-center justify-center text-primary">
                          <span className="text-xs font-medium">{formatDate(event.date).split(' ')[0]}</span>
                          <span className="text-sm font-bold">{formatDate(event.date).split(' ')[1]}</span>
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="text-sm font-medium text-gray-800 truncate">{event.title}</h4>
                          <div className="flex items-center text-xs text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" /> 
                            {event.location || 'Online'}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UpcomingEvents;
