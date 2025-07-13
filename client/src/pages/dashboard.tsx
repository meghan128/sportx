import DashboardLayout from "@/components/layout/dashboard-layout";
import WelcomeSection from "@/components/dashboard/welcome-section";
import CpdProgressTracker from "@/components/dashboard/cpd-progress-tracker";
import UpcomingEvents from "@/components/dashboard/upcoming-events";
import CourseProgress from "@/components/dashboard/course-progress";
import CommunitySection from "@/components/dashboard/community-section";
import CareerPathSuggestion from "@/components/ai/career-path-suggestion";
import QuickActions from "@/components/navigation/quick-actions";

const Dashboard = () => {
  return (
    <DashboardLayout title="Dashboard">
      <div className="animate-bounce-in mb-6">
        <QuickActions />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="animate-bounce-in" style={{ animationDelay: '0.2s' }}>
          <WelcomeSection />
        </div>
        <div className="animate-bounce-in" style={{ animationDelay: '0.3s' }}>
          <CpdProgressTracker />
        </div>
      </div>
      <div className="animate-bounce-in" style={{ animationDelay: '0.4s' }}>
        <UpcomingEvents />
      </div>
      <div className="animate-bounce-in" style={{ animationDelay: '0.6s' }}>
        <CourseProgress />
      </div>
      <div className="animate-bounce-in" style={{ animationDelay: '0.8s' }}>
        <CareerPathSuggestion />
      </div>
      <div className="animate-bounce-in" style={{ animationDelay: '1.0s' }}>
        <CommunitySection />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
