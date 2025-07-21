import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Briefcase, ArrowLeft } from 'lucide-react';
import { ProfessionalRegistrationForm } from '@/components/auth/ProfessionalRegistrationForm';

export default function ProfessionalRegistration() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      </div>

      {/* Professional Icons Background */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5">
        <svg className="w-full h-full" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g fill="white" fillOpacity="0.1">
            <rect x="100" y="50" width="60" height="80" rx="8"/>
            <circle cx="130" cy="30" r="15"/>
            <rect x="600" y="400" width="40" height="60" rx="6"/>
            <circle cx="620" cy="380" r="12"/>
            <path d="M400 200L420 180L400 160L380 180Z"/>
            <rect x="200" y="450" width="50" height="70" rx="7"/>
          </g>
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
                    <Briefcase className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                </div>
              </div>
              <h1 className="text-4xl font-bold mb-4 drop-shadow-lg">
                Professional Registration
              </h1>
              <p className="text-green-100 text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
                Join our network of certified healthcare professionals and elevate your career through continuous learning and expert collaboration.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">As a professional, you'll get:</h3>
              <div className="space-y-3">
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="w-10 h-10 bg-blue-400/80 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">CPD Certification</h4>
                    <p className="text-sm text-green-100">Earn accredited continuing professional development points</p>
                  </div>
                </div>
                
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="w-10 h-10 bg-purple-400/80 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Professional Network</h4>
                    <p className="text-sm text-green-100">Connect with industry leaders and peers</p>
                  </div>
                </div>

                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="w-10 h-10 bg-orange-400/80 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Advanced Learning</h4>
                    <p className="text-sm text-green-100">Access specialized courses and workshops</p>
                  </div>
                </div>

                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <div className="w-10 h-10 bg-pink-400/80 rounded-full flex items-center justify-center mr-4">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Career Analytics</h4>
                    <p className="text-sm text-green-100">Track your professional development progress</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-green-100 to-transparent rounded-br-full"></div>
            <div className="relative z-10">
              <div className="text-center mb-8">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Professional Account</h2>
                <p className="text-gray-600 text-sm">
                  Upload your degree certificate and professional affiliations
                </p>
              </div>

              <ProfessionalRegistrationForm />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-green-100 text-sm bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Professional verification ensures credibility and maintains high standards in our community
          </p>
        </div>
      </div>
    </div>
  );
}