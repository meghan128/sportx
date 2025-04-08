import { Calendar, MapPin, Globe } from "lucide-react";
import { Event } from "@/lib/types";
import { Link } from "wouter";

interface EventCardProps {
  event: Event;
}

const EventCard = ({ event }: EventCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
      <div className="relative">
        <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
        <div className="absolute top-0 right-0 bg-white rounded-bl-lg py-1 px-3 shadow-sm">
          <span className="text-xs font-medium text-primary">CPD: {event.cpdPoints} pts</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex items-center">
            <span className={`text-xs text-white ${getEventTypeColor(event.type)} bg-opacity-80 px-2 py-1 rounded`}>
              {event.type}
            </span>
            {event.category && (
              <span className="text-xs text-white bg-secondary-dark bg-opacity-80 px-2 py-1 rounded ml-2">
                {event.category}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <Calendar className="h-3 w-3 mr-1" /> {formatDate(event.date)}
          <span className="mx-2">•</span>
          {event.location ? (
            <span className="flex items-center">
              <MapPin className="h-3 w-3 mr-1" /> {event.location}
            </span>
          ) : (
            <span className="flex items-center">
              <Globe className="h-3 w-3 mr-1" /> Online
            </span>
          )}
        </div>
        <h3 className="font-semibold text-gray-800 mb-2">{event.title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="text-sm font-medium">₹{event.price.toLocaleString()}</span>
            {event.discount && (
              <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${getDiscountBadgeClass(event.discount.type)}`}>
                {event.discount.label}
              </span>
            )}
          </div>
          <Link href={`/events/${event.id}`} className="text-sm font-medium text-primary hover:text-primary-dark flex items-center transition">
            Register <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

import { ArrowRight } from "lucide-react";

// Helper functions
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

export default EventCard;
