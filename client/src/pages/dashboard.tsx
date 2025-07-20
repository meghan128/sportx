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
      {/* Hero Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Manage Your Professional Development With Ease
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Track your CPD credits, attend courses, connect with peers, and advance your career in sports and allied health.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Start Learning
            </button>
            <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              View Progress
            </button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Fast & Secure</h3>
          <p className="text-gray-600">
            Secure access to your professional development data with enterprise-grade security and fast performance.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy to Use</h3>
          <p className="text-gray-600">
            Intuitive interface designed for healthcare professionals with minimal learning curve.
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Community Driven</h3>
          <p className="text-gray-600">
            Connect with fellow professionals and learn from shared experiences and knowledge.
          </p>
        </div>
      </div>

      {/* Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <WelcomeSection />
        <CpdProgressTracker />
      </div>
      
      <div className="mb-8">
        <UpcomingEvents />
      </div>
      
      <div className="mb-8">
        <CourseProgress />
      </div>
      
      <div className="mb-8">
        <CareerPathSuggestion />
      </div>
      
      <div className="mb-8">
        <CommunitySection />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
