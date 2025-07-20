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
      color: "bg-blue-600",
      description: "Explore new learning opportunities"
    },
    {
      icon: <Calendar className="h-4 w-4" />,
      label: "Find Events",
      href: "/events",
      color: "bg-blue-500",
      description: "Discover upcoming workshops"
    },
    {
      icon: <Users className="h-4 w-4" />,
      label: "Join Community",
      href: "/community",
      color: "bg-blue-700",
      description: "Connect with professionals"
    },
    {
      icon: <Award className="h-4 w-4" />,
      label: "Track CPD",
      href: "/cpd-credits",
      color: "bg-blue-800",
      description: "Monitor your progress"
    },
    {
      icon: <MessageSquare className="h-4 w-4" />,
      label: "Get Mentorship",
      href: "/mentorship",
      color: "bg-indigo-600",
      description: "Find expert guidance"
    }
  ];

  return (
    <Card className="bg-white border shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Quick Actions</h3>
          <Badge variant="outline" className="text-xs text-blue-600">
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