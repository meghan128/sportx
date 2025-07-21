import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';

import { GraduationCap, ArrowLeft } from 'lucide-react';
import { StudentRegistrationForm } from '@/components/auth/StudentRegistrationForm';

export default function StudentRegistration() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-600 to-indigo-700">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Hero Image Section */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
        <svg className="w-full h-full" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M200 100C250 100 290 140 290 190V350C290 400 250 440 200 440C150 440 110 400 110 350V190C110 140 150 100 200 100Z" fill="white" fillOpacity="0.1"/>
          <circle cx="200" cy="150" r="30" fill="white" fillOpacity="0.2"/>
          <rect x="160" y="200" width="80" height="60" rx="10" fill="white" fillOpacity="0.15"/>
          <rect x="170" y="280" width="60" height="40" rx="5" fill="white" fillOpacity="0.1"/>
        </svg>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-4xl">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={() => setLocation('/select-type')}
            className="text-white hover:bg-white/10 hover:text-white border border-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Selection
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setLocation('/auth')}
            className="text-white border-white/30 hover:bg-white/10 hover:text-white"
          >
            Already have an account? Login
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Information */}
          <div className="text-white space-y-8">
            <div className="text-center lg:text-left">
              <div className="mb-6 flex justify-center lg:justify-start">
                <div className="relative">
                  <div className="w-24 h-24 bg-white/20 rounded-3xl backdrop-blur-sm border-2 border-white/30 flex items-center justify-center shadow-2xl">
                    <GraduationCap className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">
                Student Registration
              </h1>
              <p className="text-blue-100 text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
                Join thousands of students advancing their careers through professional development and expert mentorship.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">As a student, you'll get:</h3>
              <div className="space-y-3">
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="w-10 h-10 bg-green-400/80 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Learning Resources</h4>
                    <p className="text-sm text-blue-100">Access comprehensive study materials and courses</p>
                  </div>
                </div>
                
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="w-10 h-10 bg-blue-400/80 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Student Community</h4>
                    <p className="text-sm text-blue-100">Connect with peers and study groups</p>
                  </div>
                </div>

                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="w-10 h-10 bg-purple-400/80 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Career Preparation</h4>
                    <p className="text-sm text-blue-100">Professional development workshops and webinars</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100 to-transparent rounded-bl-full"></div>
            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <GraduationCap className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Student Account</h2>
                <p className="text-gray-600 text-sm">
                  Upload your latest marksheet for quick verification
                </p>
              </div>

              <StudentRegistrationForm />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-blue-100 text-sm bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Your documents are securely processed using advanced OCR technology for fast verification
          </p>
        </div>
      </div>
    </div>
  );
}