import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  Heart, 
  LayoutDashboard, 
  CalendarDays, 
  BookOpen, 
  Medal, 
  Users, 
  User, 
  Settings, 
  LogOut,
  HelpCircle,
  Library,
  Award,
  BadgeCheck,
  Menu,
  X
} from "lucide-react";
import { TourButton } from "@/components/dashboard/tour-button";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive?: boolean;
  collapsed?: boolean;
}

const SidebarLink = ({ href, icon, children, isActive, collapsed }: SidebarLinkProps) => {
  const linkContent = (
    <div 
      className={`flex items-center ${!collapsed ? 'space-x-2' : 'justify-center'} px-2 py-2 rounded-lg ${
        isActive 
          ? "bg-blue-600 text-white shadow-lg" 
          : "hover:bg-white/10 text-blue-100 hover:text-white"
      } mt-1 cursor-pointer transition-colors duration-200`}
    >
      <span className={collapsed ? "text-center" : ""}>{icon}</span>
      {!collapsed && <span>{children}</span>}
    </div>
  );

  if (collapsed) {
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href={href}>
              {linkContent}
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">{children}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <Link href={href}>
      {linkContent}
    </Link>
  );
};

interface SidebarProps {
  collapsed?: boolean;
}

const Sidebar = ({ collapsed = false }: SidebarProps) => {
  const [location] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById('sidebar-menu');
      const toggle = document.getElementById('sidebar-toggle');
      
      if (!sidebar || !toggle) return;
      
      const isClickInsideSidebar = sidebar.contains(event.target as Node);
      const isClickOnToggle = toggle.contains(event.target as Node);
      
      if (!isClickInsideSidebar && !isClickOnToggle && window.innerWidth < 768) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);
  
  // Ensure sidebar is visible on desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(true);
      } else {
        setIsMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <aside 
      id="main-sidebar" 
      className={cn(
        "bg-gradient-to-b from-blue-700 to-blue-800 text-white md:fixed md:h-full z-10 transition-all duration-300 shadow-xl",
        collapsed ? "md:w-20" : "md:w-64",
        "w-full"
      )}
    >
      <div className="flex justify-between items-center p-4 md:p-6">
        {!collapsed ? (
          <div className="flex items-center space-x-2">
            <CalendarDays className="h-6 w-6 text-white" />
            <h1 className="text-xl font-bold text-white">
              SportX CPD
            </h1>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <CalendarDays className="h-8 w-8 text-white" />
          </div>
        )}
        
        <button 
          className="md:hidden text-white focus:outline-none" 
          id="sidebar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      <nav 
        className={cn(
          isMenuOpen ? 'block' : 'hidden',
          "md:block px-4 pb-6"
        )} 
        id="sidebar-menu"
      >
        <div className="mt-6">
          {!collapsed && (
            <p className="text-xs uppercase tracking-wider text-blue-200 mb-2 px-2">Main</p>
          )}
          <SidebarLink 
            href="/" 
            icon={<LayoutDashboard className={collapsed ? "h-5 w-5" : "h-4 w-4"} />} 
            isActive={location === "/"} 
            collapsed={collapsed}
          >
            Dashboard
          </SidebarLink>
          <SidebarLink 
            href="/events" 
            icon={<CalendarDays className={collapsed ? "h-5 w-5" : "h-4 w-4"} />} 
            isActive={location.startsWith("/events")} 
            collapsed={collapsed}
          >
            Events
          </SidebarLink>
          <SidebarLink 
            href="/courses" 
            icon={<BookOpen className={collapsed ? "h-5 w-5" : "h-4 w-4"} />} 
            isActive={location.startsWith("/courses")} 
            collapsed={collapsed}
          >
            Courses
          </SidebarLink>
          <SidebarLink 
            href="/cpd-credits" 
            icon={<Medal className={collapsed ? "h-5 w-5" : "h-4 w-4"} />} 
            isActive={location === "/cpd-credits"} 
            collapsed={collapsed}
          >
            CPD Credits
          </SidebarLink>
          <SidebarLink 
            href="/accreditation" 
            icon={<BadgeCheck className={collapsed ? "h-5 w-5" : "h-4 w-4"} />} 
            isActive={location === "/accreditation"} 
            collapsed={collapsed}
          >
            Accreditation
          </SidebarLink>
          <SidebarLink 
            href="/community" 
            icon={<Users className={collapsed ? "h-5 w-5" : "h-4 w-4"} />} 
            isActive={location === "/community"} 
            collapsed={collapsed}
          >
            Community
          </SidebarLink>
          <SidebarLink 
            href="/resources" 
            icon={<Library className={collapsed ? "h-5 w-5" : "h-4 w-4"} />} 
            isActive={location === "/resources"} 
            collapsed={collapsed}
          >
            Resource Library
          </SidebarLink>
        </div>
        
        <div className="mt-8">
          {!collapsed && (
            <p className="text-xs uppercase tracking-wider text-gray-400 mb-2 px-2">Account</p>
          )}
          <SidebarLink 
            href="/profile" 
            icon={<User className={collapsed ? "h-5 w-5" : "h-4 w-4"} />} 
            isActive={location === "/profile"} 
            collapsed={collapsed}
          >
            Profile
          </SidebarLink>
          <SidebarLink 
            href="/settings" 
            icon={<Settings className={collapsed ? "h-5 w-5" : "h-4 w-4"} />} 
            isActive={location === "/settings"} 
            collapsed={collapsed}
          >
            Settings
          </SidebarLink>
          
          {collapsed ? (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div 
                    className="flex items-center justify-center px-2 py-2 rounded-lg hover:bg-primary-light/20 hover:text-primary-dark text-gray-100 mt-1 cursor-pointer transition-colors duration-200"
                    onClick={async () => {
                      try {
                        await fetch("/api/auth/logout", { 
                          method: "POST",
                          headers: { "Content-Type": "application/json" }
                        });
                        window.location.href = "/login";
                      } catch (error) {
                        console.error("Logout failed:", error);
                      }
                    }}
                  >
                    <LogOut className="h-5 w-5" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">Logout</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <div 
              className="flex items-center space-x-2 px-2 py-2 rounded-lg hover:bg-primary-light/20 hover:text-primary-dark text-gray-100 mt-1 cursor-pointer transition-colors duration-200"
              onClick={async () => {
                try {
                  await fetch("/api/auth/logout", { 
                    method: "POST",
                    headers: { "Content-Type": "application/json" }
                  });
                  window.location.href = "/login";
                } catch (error) {
                  console.error("Logout failed:", error);
                }
              }}
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </div>
          )}
        </div>
      </nav>

      {!collapsed ? (
        <div className="hidden md:block px-6 py-4 mt-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 shadow-inner">
            <p className="text-sm font-medium">Need help?</p>
            <div className="flex items-center mt-2 gap-2">
              <button className="text-white text-sm flex items-center bg-transparent border-0 hover:text-blue-200 transition-colors">
                <HelpCircle className="h-4 w-4 mr-1" /> Contact support
              </button>
              <div className="flex-1 text-right">
                <TourButton variant="ghost" size="sm" className="text-white hover:bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden md:flex justify-center px-4 py-4 mt-auto">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="text-white bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-colors">
                  <HelpCircle className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Get Help</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
