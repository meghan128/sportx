import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Briefcase, Users, Shield, FileCheck, Clock } from 'lucide-react';
import { StudentRegistrationForm } from '@/components/auth/StudentRegistrationForm';
import { ProfessionalRegistrationForm } from '@/components/auth/ProfessionalRegistrationForm';
import { ResourcePersonRegistrationForm } from '@/components/auth/ResourcePersonRegistrationForm';
import { LoginForm } from '@/components/auth/LoginForm';

export default function AuthLanding() {
  const [mode, setMode] = useState<'login' | 'register'>('register');
  const [userType, setUserType] = useState<'student' | 'professional' | 'resource_person'>('student');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SportX India CPD Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join our comprehensive platform for sports and allied health professionals. 
            Choose your role and start your professional development journey today.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border">
            <Button
              variant={mode === 'register' ? 'default' : 'ghost'}
              onClick={() => setMode('register')}
              className="px-6"
            >
              Register
            </Button>
            <Button
              variant={mode === 'login' ? 'default' : 'ghost'}
              onClick={() => setMode('login')}
              className="px-6"
            >
              Login
            </Button>
          </div>
        </div>

        {mode === 'login' ? (
          <LoginForm onSuccess={() => window.location.reload()} />
        ) : (
          <>
            {/* User Type Selection */}
            <div className="grid md:grid-cols-3 gap-6 mb-8 max-w-6xl mx-auto">
              <UserTypeCard
                icon={<GraduationCap className="w-8 h-8" />}
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
                isSelected={userType === 'student'}
                onClick={() => setUserType('student')}
              />

              <UserTypeCard
                icon={<Briefcase className="w-8 h-8" />}
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
                isSelected={userType === 'professional'}
                onClick={() => setUserType('professional')}
              />

              <UserTypeCard
                icon={<Users className="w-8 h-8" />}
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
                isSelected={userType === 'resource_person'}
                onClick={() => setUserType('resource_person')}
              />
            </div>

            {/* Authentication Process Info */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8 max-w-4xl mx-auto">
              <div className="flex items-start space-x-3">
                <Shield className="w-6 h-6 text-amber-600 mt-1" />
                <div>
                  <h3 className="font-semibold text-amber-800 mb-2">Document Verification Process</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm text-amber-700">
                    <div className="flex items-start space-x-2">
                      <FileCheck className="w-4 h-4 mt-0.5" />
                      <div>
                        <p className="font-medium">1. Upload Documents</p>
                        <p>Submit required certificates and identification</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Clock className="w-4 h-4 mt-0.5" />
                      <div>
                        <p className="font-medium">2. OCR Verification</p>
                        <p>Automatic text extraction and name matching</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Shield className="w-4 h-4 mt-0.5" />
                      <div>
                        <p className="font-medium">3. Approval Process</p>
                        <p>Account activation after verification</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Registration Form */}
            <div className="max-w-2xl mx-auto">
              {userType === 'student' && <StudentRegistrationForm />}
              {userType === 'professional' && <ProfessionalRegistrationForm />}
              {userType === 'resource_person' && <ResourcePersonRegistrationForm />}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface UserTypeCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  requirements: string[];
  isSelected: boolean;
  onClick: () => void;
}

function UserTypeCard({ 
  icon, 
  title, 
  description, 
  features, 
  requirements, 
  isSelected, 
  onClick 
}: UserTypeCardProps) {
  return (
    <Card 
      className={`cursor-pointer transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-primary border-primary shadow-lg scale-105' 
          : 'hover:shadow-md border-gray-200'
      }`}
      onClick={onClick}
    >
      <CardHeader className="text-center">
        <div className={`mx-auto p-3 rounded-full ${
          isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
        }`}>
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
        {isSelected && <Badge variant="default" className="w-fit mx-auto">Selected</Badge>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-sm text-green-700 mb-2">✓ What you get:</h4>
            <ul className="space-y-1">
              {features.map((feature, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-sm text-orange-700 mb-2">📋 Requirements:</h4>
            <ul className="space-y-1">
              {requirements.map((requirement, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  {requirement}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}