import DashboardLayout from "@/components/layout/dashboard-layout";
import AccreditationDashboard from "@/components/accreditation/accreditation-dashboard";

const AccreditationPage = () => {
  return (
    <DashboardLayout title="Professional Accreditation">
      <AccreditationDashboard />
    </DashboardLayout>
  );
};

export default AccreditationPage;