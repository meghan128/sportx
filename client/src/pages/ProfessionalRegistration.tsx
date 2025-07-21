import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, ArrowLeft } from 'lucide-react';
import { ProfessionalRegistrationForm } from '@/components/auth/ProfessionalRegistrationForm';

export default function ProfessionalRegistration() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/select-type')}
            className="text-green-600"
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
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Professional Registration
          </h1>
          <p className="text-gray-600">
            Join our network of qualified professionals and access CPD courses and certifications
          </p>
        </div>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create Your Professional Account</CardTitle>
            <CardDescription>
              Provide your professional details and upload your degree certificate for verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfessionalRegistrationForm />
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