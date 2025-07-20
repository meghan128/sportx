import Sidebar from "./sidebar";
import Header from "./header";
import Breadcrumb from "@/components/navigation/breadcrumb";
import { useEffect, useState } from "react";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white flex flex-col md:flex-row">
      <div 
        className={`transition-all duration-300 ease-in-out ${
          sidebarCollapsed ? 'md:w-20' : 'md:w-64'
        }`}
      >
        <Sidebar collapsed={sidebarCollapsed} />
      </div>
      
      <main className={`flex-1 min-h-screen transition-all duration-300 ease-in-out ${
        sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
      }`}>
        <Header title={title} />
        
        <div className="relative">
          {!isMobile && (
            <button 
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="absolute -left-3 top-6 rounded-full bg-blue-600 hover:bg-blue-700 shadow-lg border-0 p-1 z-10 transition-all duration-200"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <ArrowRightCircle size={20} className="text-white" />
              ) : (
                <ArrowLeftCircle size={20} className="text-white" />
              )}
            </button>
          )}
        
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Breadcrumb />
            {children}
          </div>
        </div>
        
        <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-100 py-6 px-6 text-center text-gray-500 text-sm mt-12">
          <p>© {new Date().getFullYear()} SportX India CPD Platform. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default DashboardLayout;
