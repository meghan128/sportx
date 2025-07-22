import { Suspense, lazy, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorBoundary from "@/components/error-boundary";
import { useAuth, AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/protected-route";

// Lazy load pages for better performance
const Dashboard = lazy(() => import("@/pages/dashboard"));
const ResourceDashboard = lazy(() => import("@/pages/resource-dashboard"));
const ResourceCourseCreation = lazy(() => import("@/pages/resource-course-creation"));
const ResourceWorkshopCreation = lazy(() => import("@/pages/resource-workshop-creation"));
const Events = lazy(() => import("@/pages/events"));
const EventDetails = lazy(() => import("@/pages/event-details"));
const Courses = lazy(() => import("@/pages/courses"));
const CourseDetails = lazy(() => import("@/pages/course-details"));
const CpdCredits = lazy(() => import("@/pages/cpd-credits"));
const Community = lazy(() => import("@/pages/community"));
const Forums = lazy(() => import("@/pages/forums"));
const Messages = lazy(() => import("@/pages/messages"));
const Mentorship = lazy(() => import("@/pages/mentorship"));
const Profile = lazy(() => import("@/pages/profile"));
const Resources = lazy(() => import("@/pages/resources"));
const Accreditation = lazy(() => import("@/pages/accreditation"));
const Settings = lazy(() => import("@/pages/settings"));
const Login = lazy(() => import("@/pages/login"));
const AuthLanding = lazy(() => import("@/pages/AuthLanding"));
const UserTypeSelection = lazy(() => import("@/pages/UserTypeSelection"));
const StudentRegistration = lazy(() => import("@/pages/StudentRegistration"));
const ProfessionalRegistration = lazy(() => import("@/pages/ProfessionalRegistration"));
const ResourcePersonRegistration = lazy(() => import("@/pages/ResourcePersonRegistration"));
const NotFound = lazy(() => import("@/pages/not-found"));
const ResourceCourses = lazy(() => import("./pages/resource-courses"));
const ResourceSubmissions = lazy(() => import("./pages/resource-submissions"));
const ResourceApprovals = lazy(() => import("./pages/resource-approvals"));
const ResourceStudents = lazy(() => import("./pages/resource-students"));
const ResourceAnalytics = lazy(() => import("./pages/resource-analytics"));



// Route configuration for better maintainability
const routes = [
  { path: "/", component: Dashboard, protected: true, title: "Dashboard", allowedRoles: ["user"] },
  { path: "/resource-dashboard", component: ResourceDashboard, protected: true, title: "Resource Dashboard", allowedRoles: ["resource_person"] },
  { path: "/resource/create-course", component: ResourceCourseCreation, protected: true, title: "Create Course", allowedRoles: ["resource_person"] },
  { path: "/resource/create-workshop", component: ResourceWorkshopCreation, protected: true, title: "Create Workshop", allowedRoles: ["resource_person"] },
  { path: "/resource-courses", component: ResourceCourses, protected: true, title: "My Courses", allowedRoles: ["resource_person"] },
  { path: "/resource-submissions", component: ResourceSubmissions, protected: true, title: "Submissions", allowedRoles: ["resource_person"] },
  { path: "/resource-approvals", component: ResourceApprovals, protected: true, title: "Approvals", allowedRoles: ["resource_person"] },
  { path: "/resource-students", component: ResourceStudents, protected: true, title: "Students", allowedRoles: ["resource_person"] },
  { path: "/resource-analytics", component: ResourceAnalytics, protected: true, title: "Analytics", allowedRoles: ["resource_person"] },
  { path: "/events", component: Events, protected: true, title: "Events" },
  { path: "/events/:id", component: EventDetails, protected: true, title: "Event Details" },
  { path: "/courses", component: Courses, protected: true, title: "Courses" },
  { path: "/courses/:id", component: CourseDetails, protected: true, title: "Course Details" },
  { path: "/cpd-credits", component: CpdCredits, protected: true, title: "CPD Credits" },
  { path: "/accreditation", component: Accreditation, protected: true, title: "Accreditation" },
  { path: "/community", component: Community, protected: true, title: "Community" },
  { path: "/forums", component: Forums, protected: true, title: "Forums" },
  { path: "/messages", component: Messages, protected: true, title: "Messages" },
  { path: "/mentorship", component: Mentorship, protected: true, title: "Mentorship" },
  { path: "/resources", component: Resources, protected: true, title: "Resources" },
  { path: "/profile", component: Profile, protected: true, title: "Profile" },
  { path: "/settings", component: Settings, protected: true, title: "Settings" },
  { path: "/auth", component: AuthLanding, protected: false, title: "Authentication" },
  { path: "/select-type", component: UserTypeSelection, protected: false, title: "Select User Type" },
  { path: "/register/student", component: StudentRegistration, protected: false, title: "Student Registration" },
  { path: "/register/professional", component: ProfessionalRegistration, protected: false, title: "Professional Registration" },
  { path: "/register/resource_person", component: ResourcePersonRegistration, protected: false, title: "Resource Person Registration" },
  { path: "/login", component: Login, protected: false, title: "Login" },
];

// Custom hook for page title management
function usePageTitle(title: string | undefined) {
  useEffect(() => {
    document.title = title ? `${title} - Your App` : "Your App";
  }, [title]);
}

// Loading component with better UX
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner size="lg" />
      <span className="ml-2 text-lg">Loading...</span>
    </div>
  );
}

// Router component with enhanced features
function Router() {
  const [location] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <PageLoader />;
  }

  // Simple routing logic - if not authenticated and trying to access protected route, show login
  if (!isAuthenticated && location !== '/login' && location !== '/auth' && !location.startsWith('/register') && !location.startsWith('/select-type')) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Login />
        </Suspense>
      </ErrorBoundary>
    );
  }

  // If authenticated and trying to access login page, show dashboard
  if (isAuthenticated && (location === '/login' || location === '/')) {
    return (
      <ErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <Dashboard />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Switch>
          {routes.map(({ path, component: Component, protected: isProtected, allowedRoles }) => (
            <Route
              key={path}
              path={path}
              component={() => 
                isProtected ? (
                  <ProtectedRoute allowedRoles={allowedRoles}>
                    <Component />
                  </ProtectedRoute>
                ) : (
                  <Component />
                )
              }
            />
          ))}
          {/* Fallback to 404 */}
          <Route component={NotFound} />
        </Switch>
      </Suspense>
    </ErrorBoundary>
  );
}

// Enhanced App component with additional providers
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ErrorBoundary>
          <div className="min-h-screen bg-background">
            <Router />
            <Toaster />
          </div>
        </ErrorBoundary>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;