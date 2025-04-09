import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MapPin, Star, MessageSquare, Calendar as CalendarIcon } from "lucide-react";
import { Link } from "wouter";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MentorshipOpportunity } from "@/lib/types";

interface MentorCardProps {
  mentor: MentorshipOpportunity;
  layout?: "grid" | "list";
}

const MentorCard = ({ mentor, layout = "grid" }: MentorCardProps) => {
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  
  const isGrid = layout === "grid";
  
  return (
    <Card className={`h-full transition-all hover:border-primary ${
      isGrid ? "" : "flex flex-col md:flex-row"
    }`}>
      <div className={isGrid ? "" : "md:w-1/3"}>
        <CardHeader className={isGrid ? "text-center" : "md:h-full"}>
          <div className={`flex ${isGrid ? "justify-center" : ""}`}>
            <Avatar className={`${isGrid ? "h-20 w-20" : "h-16 w-16"}`}>
              <AvatarImage src={mentor.profileImage} />
              <AvatarFallback>
                {mentor.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="mt-2">{mentor.name}</CardTitle>
          <p className="text-sm text-muted-foreground">{mentor.position}</p>
          
          {!isGrid && (
            <div className="mt-4 space-y-2 hidden md:block">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>Mumbai, India</span>
              </div>
              {mentor.availability && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{mentor.availability}</span>
                </div>
              )}
              {mentor.rating && (
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>{mentor.rating}/5 ({mentor.reviews} reviews)</span>
                </div>
              )}
            </div>
          )}
        </CardHeader>
      </div>
      
      <div className={isGrid ? "" : "md:w-2/3"}>
        <CardContent className={isGrid ? "" : "md:pt-6"}>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {mentor.specialties.map((specialty, index) => (
              <Badge key={index} variant="secondary">
                {specialty}
              </Badge>
            ))}
          </div>
          
          {isGrid && mentor.availability && (
            <div className="mt-4 flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{mentor.availability}</span>
            </div>
          )}
          
          {isGrid && mentor.rating && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 text-yellow-500" />
              <span>{mentor.rating}/5 ({mentor.reviews} reviews)</span>
            </div>
          )}
          
          {!isGrid && (
            <div className="mt-4">
              <h4 className="font-medium mb-2">About</h4>
              <p className="text-sm text-muted-foreground">
                Experienced {mentor.position} specializing in {mentor.specialties.join(", ")}. 
                Available to provide mentorship and career guidance to sports allied health professionals.
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className={`flex gap-2 ${isGrid ? "justify-center" : "justify-start"}`}>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/messages?userId=${mentor.id}`}>
              <MessageSquare className="h-4 w-4 mr-1" />
              Message
            </Link>
          </Button>
          
          <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <CalendarIcon className="h-4 w-4 mr-1" />
                Request Session
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Request Mentorship Session</DialogTitle>
                <DialogDescription>
                  Schedule a one-on-one session with {mentor.name}
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <h4 className="text-sm font-medium mb-2">Session Format Options:</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <h5 className="font-medium">30 Min Video Call</h5>
                      <p className="text-sm text-muted-foreground">Quick career guidance session</p>
                    </div>
                    <Badge>Free</Badge>
                  </div>
                  <div className="flex items-center justify-between p-2 border rounded-md">
                    <div>
                      <h5 className="font-medium">60 Min Detailed Consultation</h5>
                      <p className="text-sm text-muted-foreground">In-depth discussion and planning</p>
                    </div>
                    <Badge>₹1,500</Badge>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <h4 className="text-sm font-medium mb-2">Available Dates:</h4>
                <div className="grid grid-cols-3 gap-2">
                  {["Mon, May 6", "Wed, May 8", "Fri, May 10"].map((date, i) => (
                    <Button key={i} variant="outline" className="text-xs h-auto py-1.5">
                      {date}
                    </Button>
                  ))}
                </div>
              </div>
              
              <DialogFooter>
                <Button type="submit">Continue Booking</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </div>
    </Card>
  );
};

export default MentorCard;