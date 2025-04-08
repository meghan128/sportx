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
  Library
} from "lucide-react";

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isActive?: boolean;
}

const SidebarLink = ({ href, icon, children, isActive }: SidebarLinkProps) => {
  return (
    <Link href={href}>
      <div 
        className={`flex items-center space-x-2 px-2 py-2 rounded-lg ${
          isActive ? "bg-primary-light" : "hover:bg-primary-light"
        } mt-1 cursor-pointer`}
      >
        {icon}
        <span>{children}</span>
      </div>
    </Link>
  );
};

const Sidebar = () => {
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
    <aside className="bg-primary text-white w-full md:w-64 md:fixed md:h-full z-10">
      <div className="flex justify-between items-center p-4 md:p-6">
        <div className="flex items-center space-x-2">
          <Heart className="h-6 w-6 text-secondary" />
          <h1 className="text-xl font-bold">SportX India</h1>
        </div>
        <button 
          className="md:hidden text-white focus:outline-none" 
          id="sidebar-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <nav className={`${isMenuOpen ? 'block' : 'hidden'} md:block px-4 pb-6`} id="sidebar-menu">
        <div className="mt-6">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-2 px-2">Main</p>
          <SidebarLink href="/" icon={<LayoutDashboard className="h-4 w-4" />} isActive={location === "/"}>
            Dashboard
          </SidebarLink>
          <SidebarLink href="/events" icon={<CalendarDays className="h-4 w-4" />} isActive={location.startsWith("/events")}>
            Events
          </SidebarLink>
          <SidebarLink href="/courses" icon={<BookOpen className="h-4 w-4" />} isActive={location.startsWith("/courses")}>
            Courses
          </SidebarLink>
          <SidebarLink href="/cpd-credits" icon={<Medal className="h-4 w-4" />} isActive={location === "/cpd-credits"}>
            CPD Credits
          </SidebarLink>
          <SidebarLink href="/community" icon={<Users className="h-4 w-4" />} isActive={location === "/community"}>
            Community
          </SidebarLink>
          <SidebarLink href="/resources" icon={<Library className="h-4 w-4" />} isActive={location === "/resources"}>
            Resource Library
          </SidebarLink>
        </div>
        
        <div className="mt-6">
          <p className="text-xs uppercase tracking-wider text-gray-400 mb-2 px-2">Account</p>
          <SidebarLink href="/profile" icon={<User className="h-4 w-4" />} isActive={location === "/profile"}>
            Profile
          </SidebarLink>
          <SidebarLink href="/settings" icon={<Settings className="h-4 w-4" />} isActive={location === "/settings"}>
            Settings
          </SidebarLink>
          <Link href="#">
            <div className="flex items-center space-x-2 px-2 py-2 rounded-lg hover:bg-primary-light mt-1 cursor-pointer">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </div>
          </Link>
        </div>
      </nav>

      <div className="hidden md:block px-6 py-4 mt-auto">
        <div className="bg-primary-light rounded-lg p-3">
          <p className="text-sm">Need help?</p>
          <button className="text-secondary text-sm flex items-center mt-1 bg-transparent border-0">
            <HelpCircle className="h-4 w-4 mr-1" /> Contact support
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
