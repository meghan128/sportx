import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Event, TicketType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
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
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  MapPin,
  Globe,
  Users,
  Info,
  CheckCircle,
  ArrowLeft,
  Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const EventDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [selectedTicket, setSelectedTicket] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isRegistering, setIsRegistering] = useState(false);

  const { data: event, isLoading } = useQuery<Event>({
    queryKey: [`/api/events/${id}`],
  });

  const handleRegister = async () => {
    if (!selectedTicket) {
      toast({
        title: "Select a ticket",
        description: "Please select a ticket type to continue",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsRegistering(true);
      
      await apiRequest("POST", "/api/events/register", {
        eventId: id,
        ticketTypeId: selectedTicket,
        quantity,
      });

      toast({
        title: "Registration successful",
        description: "You have successfully registered for this event",
      });
      
      // Redirect to dashboard or registration confirmation page
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Event Details">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!event) {
    return (
      <DashboardLayout title="Event Not Found">
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 mb-4">
            <Info className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Event Not Found</h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            The event you are looking for does not exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/events">Back to Events</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <DashboardLayout title="Event Details">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4 p-0">
          <Link href="/events">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Events
          </Link>
        </Button>
        
        <div className="relative rounded-xl overflow-hidden h-64 mb-6">
          <img 
            src={event.image} 
            alt={event.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge 
                variant="outline" 
                className={`bg-opacity-80 text-white border-none ${
                  event.type === 'In-person' ? 'bg-primary-dark' :
                  event.type === 'Virtual' ? 'bg-accent' : 'bg-warning'
                }`}
              >
                {event.type}
              </Badge>
              {event.category && (
                <Badge 
                  variant="outline"
                  className="bg-secondary-dark bg-opacity-80 text-white border-none"
                >
                  {event.category}
                </Badge>
              )}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">{event.title}</h1>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>About this event</CardTitle>
                <div className="flex flex-wrap gap-y-3 gap-x-6 text-sm text-muted-foreground mt-2">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {formatDate(event.date)}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </div>
                  <div className="flex items-center">
                    {event.location ? (
                      <>
                        <MapPin className="mr-2 h-4 w-4" />
                        {event.location}
                      </>
                    ) : (
                      <>
                        <Globe className="mr-2 h-4 w-4" />
                        Online
                      </>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    {event.attendees || 0} attending
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details">
                  <TabsList className="mb-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="speakers">Speakers</TabsTrigger>
                    <TabsTrigger value="schedule">Schedule</TabsTrigger>
                  </TabsList>
                  <TabsContent value="details">
                    <div className="prose max-w-none">
                      <p className="text-gray-600">{event.description}</p>
                      
                      <h3 className="text-lg font-semibold mt-6 mb-2">What you'll learn</h3>
                      <ul className="space-y-1">
                        {event.learningOutcomes && event.learningOutcomes.map((outcome, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircle className="mr-2 h-5 w-5 text-success shrink-0 mt-0.5" />
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <h3 className="text-lg font-semibold mt-6 mb-2">CPD Information</h3>
                      <p>
                        This event is accredited for <strong>{event.cpdPoints} CPD points</strong> under the {event.accreditationBody} guidelines.
                      </p>
                      
                      {event.type !== 'In-person' && (
                        <>
                          <h3 className="text-lg font-semibold mt-6 mb-2">Virtual Attendance</h3>
                          <div className="flex items-center gap-2 bg-secondary/10 p-3 rounded-md">
                            <Video className="h-5 w-5 text-secondary" />
                            <p className="text-sm">
                              {event.type === 'Virtual' 
                                ? 'This is a fully virtual event. Access details will be sent after registration.' 
                                : 'This is a hybrid event. You can choose to attend in-person or virtually.'}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="speakers">
                    {event.speakers && event.speakers.length > 0 ? (
                      <div className="space-y-6">
                        {event.speakers.map((speaker, index) => (
                          <div key={index} className="flex items-start gap-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={speaker.image} />
                              <AvatarFallback>{speaker.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-lg">{speaker.name}</h3>
                              <p className="text-sm text-muted-foreground">{speaker.title}</p>
                              <p className="mt-2 text-sm">{speaker.bio}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Speaker information will be updated soon.</p>
                    )}
                  </TabsContent>
                  <TabsContent value="schedule">
                    {event.schedule && event.schedule.length > 0 ? (
                      <div className="space-y-4">
                        {event.schedule.map((item, index) => (
                          <div key={index} className="relative pl-6 pb-4">
                            {index !== event.schedule!.length - 1 && (
                              <div className="absolute left-2 top-3 bottom-0 w-0.5 bg-gray-200"></div>
                            )}
                            <div className="absolute left-0 top-2 h-4 w-4 rounded-full bg-primary"></div>
                            <div className="flex flex-col md:flex-row md:items-center justify-between">
                              <p className="font-medium">{item.title}</p>
                              <p className="text-sm text-muted-foreground">{item.time}</p>
                            </div>
                            {item.description && (
                              <p className="mt-1 text-sm text-gray-600">{item.description}</p>
                            )}
                            {item.speaker && (
                              <p className="mt-1 text-sm font-medium text-primary">Speaker: {item.speaker}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">Schedule details will be updated soon.</p>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Registration</CardTitle>
                <CardDescription>Select your ticket type</CardDescription>
              </CardHeader>
              <CardContent>
                {event.ticketTypes && event.ticketTypes.map((ticket: TicketType) => (
                  <div 
                    key={ticket.id} 
                    className={`border rounded-lg p-4 mb-3 cursor-pointer transition-all ${
                      selectedTicket === ticket.id ? 'border-primary bg-primary/5' : 'hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTicket(ticket.id)}
                  >
                    <div className="flex justify-between">
                      <div>
                        <h4 className="font-medium">{ticket.name}</h4>
                        <p className="text-sm text-gray-500">{ticket.description}</p>
                      </div>
                      <p className="font-semibold">₹{ticket.price.toLocaleString()}</p>
                    </div>
                    {ticket.availableUntil && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Available until {new Date(ticket.availableUntil).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
                
                {selectedTicket && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">Quantity</label>
                    <Select 
                      value={quantity.toString()} 
                      onValueChange={(value) => setQuantity(Number(value))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select quantity" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex-col items-stretch gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>CPD Points:</span>
                    <span className="font-semibold">{event.cpdPoints} points</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold">
                      {selectedTicket && event.ticketTypes ? 
                        `₹${(event.ticketTypes.find(t => t.id === selectedTicket)?.price || 0) * quantity}` : 
                        '₹0'}
                    </span>
                  </div>
                </div>
                
                <Button 
                  className="w-full" 
                  disabled={!selectedTicket || isRegistering}
                  onClick={handleRegister}
                >
                  {isRegistering ? "Processing..." : "Register Now"}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  By registering, you agree to our terms and conditions.
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EventDetails;
