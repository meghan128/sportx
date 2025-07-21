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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SportX India CPD Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Welcome to our comprehensive platform for sports and allied health professionals. 
            Access your account or create a new one to start your professional development journey.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Login Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <LogIn className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-600">
                  Sign in to access your account and continue your professional development
                </p>
              </div>
              
              <LoginForm onSuccess={() => window.location.reload()} />
            </div>

            {/* Registration Section */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <UserPlus className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Join Our Platform</h2>
                <p className="text-gray-600">
                  Create your account as a student, professional, or resource person
                </p>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">What you'll get:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Access to professional development courses
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Networking with industry experts
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Certification and accreditation tracking
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                      Mentorship opportunities
                    </li>
                  </ul>
                </div>

                <Button 
                  onClick={() => setLocation('/select-type')}
                  size="lg"
                  className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-medium"
                >
                  Start Registration Process
                  <UserPlus className="w-4 h-4 ml-2" />
                </Button>
                
                <div className="text-center">
                  <p className="text-xs text-gray-500">
                    New registrations require document verification for security
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Secure Verification</h3>
              <p className="text-sm text-gray-600">
                Advanced document verification with OCR technology ensures authentic credentials
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast Processing</h3>
              <p className="text-sm text-gray-600">
                Quick account activation with automated verification and admin approval
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Expert Community</h3>
              <p className="text-sm text-gray-600">
                Connect with professionals, students, and industry leaders in your field
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-sm text-gray-500">
          <p>
            Trusted by healthcare professionals • GDPR compliant • 
            Industry-standard security protocols
          </p>
        </div>
      </div>
    </div>
  );
}