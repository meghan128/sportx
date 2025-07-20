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
    <div id="upcoming-events" className="mb-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-8 py-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl">
                <CalendarClock className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
                <p className="text-gray-600">Discover and join professional development events</p>
              </div>
            </div>
            <Link href="/events">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                View all events <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="px-8 py-4 bg-gray-50 border-b border-gray-200">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white rounded-xl shadow-sm">
              <TabsTrigger value="all" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <Calendar className="h-4 w-4" />
                All Events
              </TabsTrigger>
              <TabsTrigger value="In-person" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                <MapPin className="h-4 w-4" />
                In-person
              </TabsTrigger>
              <TabsTrigger value="Virtual" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                💻 Virtual
              </TabsTrigger>
              <TabsTrigger value="Hybrid" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                🔄 Hybrid
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-gray-100 rounded-xl p-6 animate-pulse">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredEvents && filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.slice(0, 6).map((event) => (
                <div key={event.id} className="group bg-gray-50 hover:bg-white border-2 border-gray-100 hover:border-blue-200 rounded-xl p-6 transition-all duration-200 hover:shadow-lg cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant={event.type === 'Virtual' ? 'secondary' : event.type === 'In-person' ? 'default' : 'outline'} className="px-3 py-1">
                      {event.type}
                    </Badge>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">{formatDate(event.date)}</div>
                      <div className="text-xs text-gray-500">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {event.location || 'Online'}
                    </div>
                    <span className="text-sm font-medium text-blue-600">{event.cpdPoints} CPD</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <CalendarClock className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No upcoming events found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Check back soon for new events or explore our courses to continue your professional development.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/courses">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
                    Browse Courses
                  </Button>
                </Link>
                <Link href="/events">
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg">
                    View All Events
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingEvents;
