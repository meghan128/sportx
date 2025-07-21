import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileUpload } from '@/components/ui/file-upload';
import { Loader2, GraduationCap, CheckCircle, AlertCircle } from 'lucide-react';

const studentRegistrationSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  alternativeNames: z.array(z.string()).optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
  degreeProgram: z.string().min(2, 'Degree program is required'),
  currentYear: z.number().min(1).max(10),
  expectedGraduation: z.string().optional(),
  university: z.string().min(2, 'University name is required'),
  studentId: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type StudentFormData = z.infer<typeof studentRegistrationSchema>;

export function StudentRegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [marksheetFile, setMarksheetFile] = useState<File | null>(null);
  const [registrationResult, setRegistrationResult] = useState<any>(null);
  const [alternativeNames, setAlternativeNames] = useState<string>('');

  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentRegistrationSchema),
    defaultValues: {
      username: '',
      email: '',
      phone: '',
      name: '',
      dateOfBirth: '',
      password: '',
      confirmPassword: '',
      degreeProgram: '',
      currentYear: 1,
      expectedGraduation: '',
      university: '',
      studentId: '',
    },
  });

  const onSubmit = async (data: StudentFormData) => {
    if (!marksheetFile) {
      setError('Please upload your marksheet');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      
      // Add all form fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'confirmPassword' && value !== undefined) {
          formData.append(key, value.toString());
        }
      });

      // Add alternative names as JSON
      const altNames = alternativeNames.split(',').map(n => n.trim()).filter(n => n);
      formData.append('alternativeNames', JSON.stringify(altNames));
      
      // Add file
      formData.append('marksheet', marksheetFile);

      const response = await fetch('/api/auth/register/student', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Registration failed');
      }

      setRegistrationResult(result);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (registrationResult) {
    return (
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto p-3 bg-green-100 rounded-full w-fit">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-800">Registration Successful!</CardTitle>
          <CardDescription>
            Your student account has been created and is being verified
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Account Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-600">Username:</span>
              <span className="font-medium">{registrationResult.user.username}</span>
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{registrationResult.user.email}</span>
              <span className="text-gray-600">User Type:</span>
              <Badge variant="secondary">{registrationResult.user.userType}</Badge>
              <span className="text-gray-600">Status:</span>
              <Badge variant={registrationResult.user.authStatus === 'approved' ? 'default' : 'secondary'}>
                {registrationResult.user.authStatus}
              </Badge>
            </div>
          </div>

          <div className="bg-amber-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center">
              <AlertCircle className="w-5 h-5 text-amber-600 mr-2" />
              Document Verification Status
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Verification Status:</span>
                <Badge variant={registrationResult.verification.isValid ? 'default' : 'secondary'}>
                  {registrationResult.verification.isValid ? 'Valid' : 'Under Review'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Confidence:</span>
                <span className="font-medium">{Math.round(registrationResult.verification.confidence * 100)}%</span>
              </div>
              {registrationResult.verification.issues.length > 0 && (
                <div>
                  <span className="font-medium">Issues to Review:</span>
                  <ul className="mt-1 ml-4">
                    {registrationResult.verification.issues.map((issue: string, index: number) => (
                      <li key={index} className="text-amber-700">• {issue}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              {registrationResult.user.authStatus === 'approved' 
                ? 'You can now access the platform!'
                : 'Your documents are being verified. You will receive access once approved.'
              }
            </p>
            <Button onClick={() => window.location.reload()}>
              {registrationResult.user.authStatus === 'approved' ? 'Enter Platform' : 'Continue to Login'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto p-3 bg-blue-100 rounded-full w-fit">
          <GraduationCap className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl">Student Registration</CardTitle>
        <CardDescription>
          Register as a student to access learning resources and connect with professionals
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your full name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input placeholder="+91 98765 43210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">
                  Alternative Names (comma-separated)
                </label>
                <Input
                  placeholder="e.g., John Smith, J. Smith, Johnny"
                  value={alternativeNames}
                  onChange={(e) => setAlternativeNames(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Add alternative names that might appear on your documents
                </p>
              </div>
            </div>

            <Separator />

            {/* Account Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username *</FormLabel>
                      <FormControl>
                        <Input placeholder="Choose a username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div></div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password *</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Create a password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password *</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Confirm your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Academic Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Academic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="degreeProgram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree Program *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bachelor of Science in Biology" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="university"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>University *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your university name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Year *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1} 
                          max={10} 
                          placeholder="1" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expectedGraduation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Graduation</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., May 2025" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="studentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student ID (if available)</FormLabel>
                      <FormControl>
                        <Input placeholder="Your student ID number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Document Upload */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Document Verification</h3>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Latest Marksheet * 
                  <span className="text-gray-500 font-normal">(PDF, JPG, PNG - Max 5MB)</span>
                </label>
                <FileUpload
                  onFileChange={setMarksheetFile}
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  placeholder="Upload your latest passing marksheet"
                />
                <p className="text-xs text-gray-500 mt-2">
                  This document will be used to verify your enrollment and academic progress
                </p>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Student Account'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}