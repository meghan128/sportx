import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ArrowLeft } from 'lucide-react';
import { ResourcePersonRegistrationForm } from '@/components/auth/ResourcePersonRegistrationForm';

export default function ResourcePersonRegistration() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/select-type')}
            className="text-purple-600"
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
          <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Resource Person Registration
          </h1>
          <p className="text-gray-600">
            Become an expert educator and industry leader on our platform
          </p>
        </div>

        {/* Registration Form */}
        <Card>
          <CardHeader>
            <CardTitle>Create Your Resource Person Account</CardTitle>
            <CardDescription>
              Provide your expert credentials and required affiliations with membership numbers for verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResourcePersonRegistrationForm />
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>
            By registering, you agree to our terms of service and privacy policy.
            All documents and affiliations will be thoroughly verified before approval.
          </p>
        </div>
      </div>
    </div>
  );
}