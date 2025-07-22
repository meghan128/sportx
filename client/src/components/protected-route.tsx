import { ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/login");
      return;
    }

    if (!isLoading && isAuthenticated && user) {
      // Role-based dashboard routing
      if (location === "/") {
        if (user.userType === "resource_person") {
          setLocation("/resource-dashboard");
        } else {
          // Default to regular dashboard for other roles
        }
      }
      
      // Check role-based access for specific routes
      if (allowedRoles && !allowedRoles.includes(user.userType)) {
        // Redirect to appropriate dashboard based on role
        if (user.userType === "resource_person") {
          setLocation("/resource-dashboard");
        } else {
          setLocation("/");
        }
      }
    }
  }, [isLoading, isAuthenticated, user, location, setLocation, allowedRoles]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Check if user has permission for this route
  if (allowedRoles && user && !allowedRoles.includes(user.userType)) {
    return null; // Component will be redirected via useEffect
  }

  return <>{children}</>;
}