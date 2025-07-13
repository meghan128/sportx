import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

// Pages
import Dashboard from "@/pages/dashboard";
import Events from "@/pages/events";
import EventDetails from "@/pages/event-details";
import Courses from "@/pages/courses";
import CourseDetails from "@/pages/course-details";
import CpdCredits from "@/pages/cpd-credits";
import Community from "@/pages/community";
import Forums from "@/pages/forums";
import Messages from "@/pages/messages";
import Mentorship from "@/pages/mentorship";
import Profile from "@/pages/profile";
import Resources from "@/pages/resources";
import Accreditation from "@/pages/accreditation";
import Settings from "@/pages/settings";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/events" component={Events} />
      <Route path="/events/:id" component={EventDetails} />
      <Route path="/courses" component={Courses} />
      <Route path="/courses/:id" component={CourseDetails} />
      <Route path="/cpd-credits" component={CpdCredits} />
      <Route path="/accreditation" component={Accreditation} />
      <Route path="/community" component={Community} />
      <Route path="/forums" component={Forums} />
      <Route path="/messages" component={Messages} />
      <Route path="/mentorship" component={Mentorship} />
      <Route path="/resources" component={Resources} />
      <Route path="/profile" component={Profile} />
      <Route path="/settings" component={Settings} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
