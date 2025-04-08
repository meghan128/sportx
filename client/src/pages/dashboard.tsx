import DashboardLayout from "@/components/layout/dashboard-layout";
import WelcomeSection from "@/components/dashboard/welcome-section";
import CpdProgressTracker from "@/components/dashboard/cpd-progress-tracker";
import UpcomingEvents from "@/components/dashboard/upcoming-events";
import CourseProgress from "@/components/dashboard/course-progress";
import CommunitySection from "@/components/dashboard/community-section";

const Dashboard = () => {
  return (
    <DashboardLayout title="Dashboard">
      <WelcomeSection />
      <CpdProgressTracker />
      <UpcomingEvents />
      <CourseProgress />
      <CommunitySection />
    </DashboardLayout>
  );
};

export default Dashboard;
