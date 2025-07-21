import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginForm } from '@/components/auth/LoginForm';
import { LogIn, UserPlus } from 'lucide-react';

export default function AuthLanding() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SportX India CPD Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Welcome to our comprehensive platform for sports and allied health professionals. 
            Login to your account or create a new one to start your professional development journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Login Section */}
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <LogIn className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Login to Your Account</CardTitle>
              <CardDescription>
                Access your existing account and continue your professional development
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm onSuccess={() => window.location.reload()} />
            </CardContent>
          </Card>

          {/* Registration Section */}
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <UserPlus className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Create New Account</CardTitle>
              <CardDescription>
                Join our platform as a student, professional, or resource person
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 text-center mb-6">
                Choose your registration type to get started with the appropriate verification process
              </p>
              <Button 
                onClick={() => setLocation('/select-type')}
                size="lg"
                className="w-full"
              >
                Start Registration Process
                <UserPlus className="w-4 h-4 ml-2" />
              </Button>
              
              <div className="text-center pt-4">
                <p className="text-xs text-gray-500">
                  New registrations require document verification
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm text-gray-500">
          <p>
            Secure platform with document verification • Professional development tracking • 
            Expert-led courses and mentorship
          </p>
        </div>
      </div>
    </div>
  );
}