import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Calendar, 
  BookOpen, 
  Users, 
  Award, 
  MessageSquare,
  Search,
  Filter,
  ArrowRight
} from "lucide-react";
import { Link } from "wouter";

const QuickActions = () => {
  const actions = [
    {
      icon: <BookOpen className="h-4 w-4" />,
      label: "Browse Courses",
      href: "/courses",
      color: "bg-blue-500",
      description: "Explore new learning opportunities"
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      label: "Find Events",
      href: "/events",
      color: "bg-green-500",
      description: "Discover upcoming workshops"
    },
    {
      icon: <Users className="h-4 w-4" />,
      label: "Join Community",
      href: "/community",
      color: "bg-purple-500",
      description: "Connect with professionals"
    },
    {
      icon: <Award className="h-4 w-4" />,
      label: "Track CPD",
      href: "/cpd-credits",
      color: "bg-orange-500",
      description: "Monitor your progress"
    },
    {
      icon: <MessageSquare className="h-4 w-4" />,
      label: "Get Mentorship",
      href: "/mentorship",
      color: "bg-pink-500",
      description: "Find expert guidance"
    }
  ];

  return (
    <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-0">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-800">Quick Actions</h3>
          <Badge variant="secondary" className="text-xs">
            Navigate faster
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {actions.map((action, index) => (
            <Link key={index} href={action.href}>
              <Button
                variant="ghost"
                className="w-full h-auto p-3 flex flex-col items-center gap-2 hover:bg-white hover:shadow-md transition-all duration-200 group"
              >
                <div className={`p-2 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}>
                  {action.icon}
                </div>
                <div className="text-center">
                  <div className="font-medium text-sm text-gray-800">{action.label}</div>
                  <div className="text-xs text-gray-500">{action.description}</div>
                </div>
                <ArrowRight className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;