import { useState } from 'react';
import { useLocation } from 'wouter';

import { Button } from '@/components/ui/button';
import { GraduationCap, Briefcase, Users, Shield, FileCheck, Clock, ArrowRight } from 'lucide-react';

export default function UserTypeSelection() {
  const [, setLocation] = useLocation();
  const [selectedType, setSelectedType] = useState<'student' | 'professional' | 'resource_person' | null>(null);

  const handleContinue = () => {
    if (selectedType) {
      setLocation(`/register/${selectedType}`);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.133 7-7s-3.134-7-7-7-7 3.133-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.133 7-7s-3.134-7-7-7-7 3.133-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Animated Shapes */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400/20 rounded-full animate-float"></div>
      <div className="absolute top-1/4 right-20 w-16 h-16 bg-purple-400/20 rounded-full animate-float delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-pink-400/20 rounded-full animate-float delay-2000"></div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 bg-white/10 rounded-3xl backdrop-blur-sm border-2 border-white/20 flex items-center justify-center shadow-2xl">
                <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 drop-shadow-lg">
            Choose Your Path
          </h1>
          <p className="text-2xl text-purple-100 max-w-4xl mx-auto leading-relaxed font-medium">
            Select your professional category to access tailored resources and join the right community for your career development journey.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => setLocation('/auth')}
              className="text-blue-600"
            >
              ← Back to Login
            </Button>
          </div>
        </div>

        {/* User Type Selection */}
        <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-6xl mx-auto">
          <UserTypeCard
            icon={<GraduationCap className="w-16 h-16" />}
            title="Student"
            description="Currently pursuing education in any field"
            features={[
              "Upload latest marksheet",
              "Access learning resources",
              "Join webinars and workshops",
              "Connect with professionals"
            ]}
            requirements={[
              "Latest passing marksheet",
              "University enrollment proof",
              "Valid student ID (if available)"
            ]}
            isSelected={selectedType === 'student'}
            onClick={() => setSelectedType('student')}
          />

          <UserTypeCard
            icon={<Briefcase className="w-16 h-16" />}
            title="Professional"
            description="Qualified professional in any field"
            features={[
              "Access CPD courses",
              "Professional networking",
              "Industry certifications",
              "Career development tools"
            ]}
            requirements={[
              "Degree certificate",
              "Professional affiliations",
              "License number (if applicable)"
            ]}
            isSelected={selectedType === 'professional'}
            onClick={() => setSelectedType('professional')}
          />

          <UserTypeCard
            icon={<Users className="w-16 h-16" />}
            title="Resource Person"
            description="Expert educator or industry leader"
            features={[
              "Create and manage courses",
              "Conduct workshops",
              "Mentor professionals",
              "Admin dashboard access"
            ]}
            requirements={[
              "Advanced degree certificate",
              "Mandatory professional affiliations",
              "Membership numbers required",
              "Years of experience validation"
            ]}
            isSelected={selectedType === 'resource_person'}
            onClick={() => setSelectedType('resource_person')}
          />
        </div>

        {/* Authentication Process Info */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
          <div className="flex items-start space-x-3">
            <Shield className="w-10 h-10 text-amber-600 mt-1" />
            <div>
              <h3 className="text-xl font-bold text-amber-800 mb-3">Document Verification Process</h3>
              <div className="grid md:grid-cols-3 gap-4 text-base text-amber-700">
                <div className="flex items-start space-x-2">
                  <FileCheck className="w-6 h-6 mt-0.5" />
                  <div>
                    <p className="font-bold text-lg">1. Upload Documents</p>
                    <p>Submit required certificates and identification</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Clock className="w-6 h-6 mt-0.5" />
                  <div>
                    <p className="font-bold text-lg">2. AI Processing</p>
                    <p>Advanced OCR extracts and verifies information</p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Shield className="w-6 h-6 mt-0.5" />
                  <div>
                    <p className="font-bold text-lg">3. Admin Approval</p>
                    <p>Final verification by our expert team</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <Button 
            onClick={handleContinue}
            disabled={!selectedType}
            size="lg"
            className="px-12 py-6 h-20 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-2xl font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {selectedType ? `Continue as ${selectedType === 'resource_person' ? 'Resource Person' : selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}` : 'Select a role to continue'}
            <ArrowRight className="w-8 h-8 ml-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// UserTypeCard Component
interface UserTypeCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  requirements: string[];
  isSelected: boolean;
  onClick: () => void;
}

function UserTypeCard({ icon, title, description, features, requirements, isSelected, onClick }: UserTypeCardProps) {
  return (
    <div 
      className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${
        isSelected 
          ? 'ring-4 ring-white/50 shadow-2xl' 
          : 'hover:shadow-xl'
      }`}
      onClick={onClick}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 h-full relative overflow-hidden border border-white/20">
        {/* Gradient overlay for selected state */}
        {isSelected && (
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-2xl"></div>
        )}
        
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-3 rounded-xl ${
              isSelected 
                ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
              <p className="text-lg text-gray-600">{description}</p>
            </div>
          </div>

          {/* Features */}
          <div className="mb-4">
            <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
              <svg className="w-6 h-6 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              What you'll get:
            </h4>
            <ul className="space-y-1">
              {features.map((feature, index) => (
                <li key={index} className="text-base text-gray-600 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Requirements */}
          <div className="mb-4">
            <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
              <svg className="w-6 h-6 mr-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Required documents:
            </h4>
            <ul className="space-y-1">
              {requirements.map((requirement, index) => (
                <li key={index} className="text-base text-gray-600 flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3 flex-shrink-0"></div>
                  {requirement}
                </li>
              ))}
            </ul>
          </div>

          {/* Selection indicator */}
          {isSelected && (
            <div className="flex items-center justify-center mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center text-indigo-600 font-medium">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Selected
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}