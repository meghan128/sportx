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
import { Loader2, Briefcase, CheckCircle, AlertCircle, Plus, X } from 'lucide-react';

const professionalRegistrationSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  dateOfBirth: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password'),
  profession: z.string().min(2, 'Profession is required'),
  specialization: z.string().optional(),
  degreeType: z.string().min(2, 'Degree type is required'),
  degreeName: z.string().min(2, 'Degree name is required'),
  university: z.string().min(2, 'University name is required'),
  graduationYear: z.string().min(4, 'Graduation year is required'),
  licenseNumber: z.string().optional(),
  licenseExpiryDate: z.string().optional(),
  yearsOfExperience: z.number().min(0).optional(),
  currentWorkplace: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfessionalFormData = z.infer<typeof professionalRegistrationSchema>;

interface Affiliation {
  name: string;
  membershipNumber: string;
  type: string;
}

export function ProfessionalRegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [degreeFile, setDegreeFile] = useState<File | null>(null);
  const [registrationResult, setRegistrationResult] = useState<any>(null);
  const [alternativeNames, setAlternativeNames] = useState<string>('');
  const [affiliations, setAffiliations] = useState<Affiliation[]>([]);

  const form = useForm<ProfessionalFormData>({
    resolver: zodResolver(professionalRegistrationSchema),
    defaultValues: {
      username: '',
      email: '',
      phone: '',
      name: '',
      password: '',
      confirmPassword: '',
      profession: '',
      specialization: '',
      degreeType: '',
      degreeName: '',
      university: '',
      graduationYear: '',
      licenseNumber: '',
      licenseExpiryDate: '',
      yearsOfExperience: 0,
      currentWorkplace: '',
    },
  });

  const addAffiliation = () => {
    setAffiliations([...affiliations, { name: '', membershipNumber: '', type: 'professional' }]);
  };

  const removeAffiliation = (index: number) => {
    setAffiliations(affiliations.filter((_, i) => i !== index));
  };

  const updateAffiliation = (index: number, field: keyof Affiliation, value: string) => {
    const updated = [...affiliations];
    updated[index][field] = value;
    setAffiliations(updated);
  };

  const onSubmit = async (data: ProfessionalFormData) => {
    if (!degreeFile) {
      setError('Please upload your degree certificate');
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
      
      // Add affiliations as JSON
      formData.append('affiliations', JSON.stringify(affiliations.filter(a => a.name)));
      
      // Add file
      formData.append('degree', degreeFile);

      const response = await fetch('/api/auth/register/professional', {
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
            Your professional account has been created and is being verified
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
        <div className="mx-auto p-3 bg-green-100 rounded-full w-fit">
          <Briefcase className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl">Professional Registration</CardTitle>
        <CardDescription>
          Register as a professional to access CPD courses and career development tools
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
                      <FormLabel>Date of Birth</FormLabel>
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
                  placeholder="e.g., John Smith, J. Smith, Dr. Johnny"
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

            {/* Professional Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="profession"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profession *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Physiotherapist, Nutritionist, Doctor" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specialization</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Sports Medicine, Cardiology" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="yearsOfExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Years of Experience</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={0} 
                          placeholder="0" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currentWorkplace"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Workplace</FormLabel>
                      <FormControl>
                        <Input placeholder="Hospital, Clinic, or Organization name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="licenseNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Professional license number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="licenseExpiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Expiry Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Education Information */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Education Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="degreeType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree Type *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bachelor, Master, Doctorate" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="degreeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Degree Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bachelor of Physiotherapy" {...field} />
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
                  name="graduationYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Graduation Year *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2020" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Professional Affiliations */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Professional Affiliations</h3>
                <Button type="button" onClick={addAffiliation} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Affiliation
                </Button>
              </div>
              
              {affiliations.map((affiliation, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Organization Name</label>
                    <Input
                      placeholder="e.g., Indian Association of Physiotherapists"
                      value={affiliation.name}
                      onChange={(e) => updateAffiliation(index, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Membership Number</label>
                    <Input
                      placeholder="Optional membership number"
                      value={affiliation.membershipNumber}
                      onChange={(e) => updateAffiliation(index, 'membershipNumber', e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      onClick={() => removeAffiliation(index)}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}

              {affiliations.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4 border border-dashed rounded-lg">
                  No affiliations added. Click "Add Affiliation" to add professional memberships.
                </p>
              )}
            </div>

            <Separator />

            {/* Document Upload */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Document Verification</h3>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Degree Certificate * 
                  <span className="text-gray-500 font-normal">(PDF, JPG, PNG - Max 5MB)</span>
                </label>
                <FileUpload
                  onFileChange={setDegreeFile}
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  placeholder="Upload your degree certificate"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Upload your highest degree certificate for verification
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
                'Create Professional Account'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}