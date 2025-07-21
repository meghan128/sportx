import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { StudentRegistrationForm } from '@/components/auth/StudentRegistrationForm';

export default function StudentRegistration() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/select-type')}
            className="text-blue-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Selection
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setLocation('/auth')}
            className="text-gray-600"
          >
            Already have an account? Login
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Student Registration
          </h1>
          <p className="text-gray-600">
            Complete your registration to access learning resources and professional development opportunities
          </p>
        </div>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create Your Student Account</CardTitle>
            <CardDescription>
              Please provide your information and upload your latest marksheet for verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StudentRegistrationForm />
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            By registering, you agree to our terms of service and privacy policy.
            Your documents will be securely processed for verification.
          </p>
        </div>
      </div>
    </div>
  );
}