import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  BarChart3, 
  Users, 
  FileText, 
  CheckSquare, 
  MessageSquare, 
  Award,
  Settings,
  User,
  PlusCircle,
  Zap
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export default function ResourceSidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const navigationItems: NavItem[] = [
    {
      href: "/resource-dashboard",
      label: "Dashboard",
      icon: BarChart3,
    },
    {
      href: "/resource-courses",
      label: "My Courses",
      icon: BookOpen,
      badge: "8"
    },
    {
      href: "/resource-submissions", 
      label: "Submissions",
      icon: FileText,
      badge: "7"
    },
    {
      href: "/resource-approvals",
      label: "Approvals",
      icon: CheckSquare,
      badge: "3"
    },
    {
      href: "/resource-students",
      label: "Students", 
      icon: Users,
    },
    {
      href: "/resource-analytics",
      label: "Analytics",
      icon: BarChart3,
    },
    {
      href: "/messages",
      label: "Messages",
      icon: MessageSquare,
      badge: "12"
    },
    {
      href: "/resource-ai-logs",
      label: "AI Logs",
      icon: Zap,
    },
  ];

  const isActiveRoute = (href: string) => {
    if (href === "/resource-dashboard") {
      return location === "/resource-dashboard";
    }
    return location.startsWith(href);
  };

  return (
    <div className="pb-12 w-64">
      <div className="space-y-4 py-4">
        {/* Header */}
        <div className="px-3 py-2">
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-2">
              <Award className="h-4 w-4 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-semibold">SportX Resource</h1>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 mb-4">
            Resource Personnel
          </Badge>
        </div>

        {/* Quick Actions */}
        <div className="px-3 py-2">
          <div className="space-y-2">
            <Button size="sm" className="w-full justify-start">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Course
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Create Content
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Navigation
          </h2>
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActiveRoute(item.href) ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActiveRoute(item.href) && "bg-secondary"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                  {item.badge && (
                    <Badge 
                      variant="destructive" 
                      className="ml-auto h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        {/* Secondary Actions */}
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Account
          </h2>
          <div className="space-y-1">
            <Link href="/profile">
              <Button variant="ghost" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>
        </div>

        {/* User Info */}
        <div className="px-7 py-2 border-t">
          <div className="flex items-center space-x-2 text-sm">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              {user?.name?.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.profession}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}