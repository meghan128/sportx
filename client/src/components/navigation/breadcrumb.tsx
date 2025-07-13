import { Link, useLocation } from "wouter";
import { ChevronRight, Home } from "lucide-react";
import { Fragment } from "react";

interface BreadcrumbItem {
  label: string;
  href: string;
  isActive?: boolean;
}

const getBreadcrumbItems = (pathname: string): BreadcrumbItem[] => {
  const items: BreadcrumbItem[] = [
    { label: "Dashboard", href: "/dashboard" }
  ];

  if (pathname.startsWith("/courses")) {
    items.push({ label: "Courses", href: "/courses" });
    if (pathname.includes("/details/")) {
      items.push({ label: "Course Details", href: pathname, isActive: true });
    }
  } else if (pathname.startsWith("/events")) {
    items.push({ label: "Events", href: "/events" });
    if (pathname.includes("/details/")) {
      items.push({ label: "Event Details", href: pathname, isActive: true });
    }
  } else if (pathname === "/cpd-credits") {
    items.push({ label: "CPD Credits", href: "/cpd-credits", isActive: true });
  } else if (pathname === "/community") {
    items.push({ label: "Community", href: "/community", isActive: true });
  } else if (pathname === "/forums") {
    items.push({ label: "Forums", href: "/forums", isActive: true });
  } else if (pathname === "/mentorship") {
    items.push({ label: "Mentorship", href: "/mentorship", isActive: true });
  } else if (pathname === "/accreditation") {
    items.push({ label: "Accreditation", href: "/accreditation", isActive: true });
  } else if (pathname === "/resources") {
    items.push({ label: "Resources", href: "/resources", isActive: true });
  } else if (pathname === "/profile") {
    items.push({ label: "Profile", href: "/profile", isActive: true });
  } else if (pathname === "/settings") {
    items.push({ label: "Settings", href: "/settings", isActive: true });
  } else if (pathname === "/messages") {
    items.push({ label: "Messages", href: "/messages", isActive: true });
  }

  return items;
};

const Breadcrumb = () => {
  const [location] = useLocation();
  const items = getBreadcrumbItems(location);

  if (items.length <= 1) return null;

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
      <Link href="/dashboard" className="flex items-center hover:text-primary transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      
      {items.map((item, index) => (
        <div key={item.href} className="flex items-center space-x-2">
          <ChevronRight className="h-4 w-4 text-gray-400" />
          {item.isActive ? (
            <span className="text-gray-900 font-medium">{item.label}</span>
          ) : (
            <Link 
              href={item.href} 
              className="hover:text-primary transition-colors"
            >
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;