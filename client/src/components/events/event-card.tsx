import { Calendar, MapPin, Globe, Clock, Users, Award, ChevronRight } from "lucide-react";
import { Event } from "@/lib/types";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

// Helper functions
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (timeString: string): string => {
  // Convert 24-hour time format (HH:MM:SS) to 12-hour format (HH:MM AM/PM)
  const [hours, minutes] = timeString.split(':');
  const hoursNum = parseInt(hours, 10);
  const ampm = hoursNum >= 12 ? 'PM' : 'AM';
  const hours12 = hoursNum % 12 || 12; // Convert 0 to 12 for 12 AM
  return `${hours12}:${minutes} ${ampm}`;
};

const calculateSeatsLeft = (event: Event): number => {
  // This is a simple calculation; real implementation would depend on your enrollment/registration data
  const maxCapacity = 100; // Placeholder value - in a real app, this might come from the event data
  const seatsLeft = event.attendees ? maxCapacity - event.attendees : 0;
  return Math.max(0, seatsLeft); // Ensure we never show negative seats
};

const getEventTypeColor = (type: string): string => {
  const typeMap: Record<string, string> = {
    'In-person': 'bg-primary-dark',
    'Virtual': 'bg-accent',
    'Hybrid': 'bg-warning'
  };
  
  return typeMap[type] || 'bg-primary-dark';
};

const getDiscountBadgeClass = (type: string): string => {
  const typeMap: Record<string, string> = {
    'early-bird': 'bg-green-100 text-green-800',
    'group': 'bg-blue-100 text-blue-800'
  };
  
  return typeMap[type] || 'bg-gray-100 text-gray-800';
};

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="relative">
        <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
        <div className="absolute top-0 right-0 bg-white rounded-bl-lg py-1 px-3 shadow-sm">
          <span className="text-xs font-medium text-primary">CPD: {event.cpdPoints} pts</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex items-center">
            <Badge variant="outline" className={`bg-opacity-80 px-2 py-1 ${getEventTypeColor(event.type)}`}>
              {event.type}
            </Badge>
            {event.category && (
              <Badge variant="outline" className="bg-secondary-dark bg-opacity-80 px-2 py-1 ml-2">
                {event.category}
              </Badge>
            )}
          </div>
        </div>
      </div>
      
      <CardHeader className="p-4 pb-2">
        <h3 className="font-semibold text-gray-800">{event.title}</h3>
      </CardHeader>
      
      <CardContent className="p-4 pt-0 flex-grow">
        <div className="flex flex-col gap-2 mb-2">
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3.5 w-3.5 mr-1.5 text-primary" /> 
            <span>{formatDate(event.date)}</span>
          </div>
          
          <div className="flex items-center text-xs text-gray-500">
            <Clock className="h-3.5 w-3.5 mr-1.5 text-primary" /> 
            <span>{formatTime(event.startTime)} - {formatTime(event.endTime)}</span>
          </div>
          
          <div className="flex items-center text-xs text-gray-500">
            {event.location ? (
              <>
                <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary" /> 
                <span>{event.location}</span>
              </>
            ) : (
              <>
                <Globe className="h-3.5 w-3.5 mr-1.5 text-primary" /> 
                <span>Online</span>
              </>
            )}
          </div>
          
          <div className="flex items-center text-xs text-gray-500">
            <Award className="h-3.5 w-3.5 mr-1.5 text-primary" /> 
            <span>Accredited by {event.accreditationBody}</span>
          </div>
          
          {event.attendees !== undefined && (
            <div className="flex items-center text-xs text-gray-500">
              <Users className="h-3.5 w-3.5 mr-1.5 text-primary" /> 
              <span>{calculateSeatsLeft(event)} seats available</span>
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{event.description}</p>
        
        {event.speakers && event.speakers.length > 0 && (
          <div className="mt-2">
            <h4 className="text-xs font-medium text-gray-700 mb-1">Featured Speakers:</h4>
            <div className="flex flex-wrap gap-1">
              {event.speakers.slice(0, 2).map(speaker => (
                <Badge key={speaker.id} variant="secondary" className="text-xs">
                  {speaker.name}
                </Badge>
              ))}
              {event.speakers.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{event.speakers.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between items-center border-t mt-auto">
        <div className="flex items-center">
          <span className="text-sm font-medium">₹{event.price.toLocaleString()}</span>
          {event.discount && (
            <Badge variant="outline" className={`ml-2 text-xs ${getDiscountBadgeClass(event.discount.type)}`}>
              {event.discount.label}
            </Badge>
          )}
        </div>
        <Button size="sm" asChild className="text-sm">
          <Link href={`/events/${event.id}`}>
            Register <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;