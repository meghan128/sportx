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
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/ui/file-upload';
import { Loader2, Users, CheckCircle, AlertCircle, Plus, X } from 'lucide-react';

const resourcePersonRegistrationSchema = z.object({
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
  yearsOfExperience: z.number().min(0),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResourcePersonFormData = z.infer<typeof resourcePersonRegistrationSchema>;

interface MandatoryAffiliation {
  name: string;
  membershipNumber: string;
  type: string;
}

interface AdditionalCertification {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  certificateUrl: string;
}

interface Publication {
  title: string;
  journal: string;
  year: string;
  url: string;
}

export function ResourcePersonRegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [degreeFile, setDegreeFile] = useState<File | null>(null);
  const [registrationResult, setRegistrationResult] = useState<any>(null);
  const [alternativeNames, setAlternativeNames] = useState<string>('');
  const [mandatoryAffiliations, setMandatoryAffiliations] = useState<MandatoryAffiliation[]>([
    { name: '', membershipNumber: '', type: 'professional' }
  ]);
  const [additionalCertifications, setAdditionalCertifications] = useState<AdditionalCertification[]>([]);
  const [publications, setPublications] = useState<Publication[]>([]);
  const [expertiseAreas, setExpertiseAreas] = useState<string>('');

  const form = useForm<ResourcePersonFormData>({
    resolver: zodResolver(resourcePersonRegistrationSchema),
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
      yearsOfExperience: 0,
    },
  });

  const addMandatoryAffiliation = () => {
    setMandatoryAffiliations([...mandatoryAffiliations, { name: '', membershipNumber: '', type: 'professional' }]);
  };

  const removeMandatoryAffiliation = (index: number) => {
    if (mandatoryAffiliations.length > 1) {
      setMandatoryAffiliations(mandatoryAffiliations.filter((_, i) => i !== index));
    }
  };

  const updateMandatoryAffiliation = (index: number, field: keyof MandatoryAffiliation, value: string) => {
    const updated = [...mandatoryAffiliations];
    updated[index][field] = value;
    setMandatoryAffiliations(updated);
  };

  const addCertification = () => {
    setAdditionalCertifications([...additionalCertifications, {
      name: '', issuer: '', issueDate: '', expiryDate: '', certificateUrl: ''
    }]);
  };

  const removeCertification = (index: number) => {
    setAdditionalCertifications(additionalCertifications.filter((_, i) => i !== index));
  };

  const updateCertification = (index: number, field: keyof AdditionalCertification, value: string) => {
    const updated = [...additionalCertifications];
    updated[index][field] = value;
    setAdditionalCertifications(updated);
  };

  const addPublication = () => {
    setPublications([...publications, { title: '', journal: '', year: '', url: '' }]);
  };

  const removePublication = (index: number) => {
    setPublications(publications.filter((_, i) => i !== index));
  };

  const updatePublication = (index: number, field: keyof Publication, value: string) => {
    const updated = [...publications];
    updated[index][field] = value;
    setPublications(updated);
  };

  const onSubmit = async (data: ResourcePersonFormData) => {
    if (!degreeFile) {
      setError('Please upload your degree certificate');
      return;
    }

    // Validate mandatory affiliations
    const validAffiliations = mandatoryAffiliations.filter(a => a.name && a.membershipNumber);
    if (validAffiliations.length === 0) {
      setError('At least one mandatory affiliation with membership number is required');
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
      
      // Add mandatory affiliations as JSON
      formData.append('mandatoryAffiliations', JSON.stringify(validAffiliations));
      
      // Add additional certifications as JSON
      const validCertifications = additionalCertifications.filter(c => c.name && c.issuer);
      formData.append('additionalCertifications', JSON.stringify(validCertifications));
      
      // Add publications as JSON
      const validPublications = publications.filter(p => p.title && p.journal);
      formData.append('publications', JSON.stringify(validPublications));
      
      // Add expertise areas as JSON
      const expertise = expertiseAreas.split(',').map(e => e.trim()).filter(e => e);
      formData.append('expertiseAreas', JSON.stringify(expertise));
      
      // Add file
      formData.append('degree', degreeFile);

      const response = await fetch('/api/auth/register/resource-person', {
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
            Your resource person account has been created and is being verified
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
                ? 'You can now access the platform with admin privileges!'
                : 'Your documents and affiliations are being verified. You will receive access once approved.'
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
        <div className="mx-auto p-3 bg-purple-100 rounded-full w-fit">
          <Users className="w-8 h-8 text-purple-600" />
        </div>
        <CardTitle className="text-2xl">Resource Person Registration</CardTitle>
        <CardDescription>
          Register as a resource person to create courses, conduct workshops, and mentor professionals
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
                  placeholder="e.g., Dr. John Smith, Prof. J. Smith, John S."
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
                        <Input placeholder="e.g., Senior Physiotherapist, Sports Medicine Doctor" {...field} />
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
                        <Input placeholder="e.g., Sports Rehabilitation, Orthopedics" {...field} />
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
                      <FormLabel>Years of Experience *</FormLabel>
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

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Areas of Expertise (comma-separated)
                  </label>
                  <Input
                    placeholder="e.g., Sports Injury, Rehabilitation, Biomechanics"
                    value={expertiseAreas}
                    onChange={(e) => setExpertiseAreas(e.target.value)}
                  />
                </div>
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
                      <FormLabel>Highest Degree Type *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Master, Doctorate, PhD" {...field} />
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
                        <Input placeholder="e.g., PhD in Sports Science" {...field} />
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
                        <Input placeholder="e.g., 2015" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Separator />

            {/* Mandatory Affiliations */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold">Mandatory Professional Affiliations *</h3>
                  <p className="text-sm text-gray-600">At least one affiliation with membership number is required</p>
                </div>
                <Button type="button" onClick={addMandatoryAffiliation} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Affiliation
                </Button>
              </div>
              
              {mandatoryAffiliations.map((affiliation, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg mb-4 bg-red-50">
                  <div>
                    <label className="block text-sm font-medium mb-2">Organization Name *</label>
                    <Input
                      placeholder="e.g., Indian Association of Physiotherapists"
                      value={affiliation.name}
                      onChange={(e) => updateMandatoryAffiliation(index, 'name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Membership Number *</label>
                    <Input
                      placeholder="Required membership number"
                      value={affiliation.membershipNumber}
                      onChange={(e) => updateMandatoryAffiliation(index, 'membershipNumber', e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      onClick={() => removeMandatoryAffiliation(index)}
                      size="sm"
                      variant="outline"
                      className="w-full"
                      disabled={mandatoryAffiliations.length === 1}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Additional Certifications */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Additional Certifications</h3>
                <Button type="button" onClick={addCertification} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Certification
                </Button>
              </div>
              
              {additionalCertifications.map((cert, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Certification Name</label>
                    <Input
                      placeholder="e.g., Advanced Sports Medicine Certificate"
                      value={cert.name}
                      onChange={(e) => updateCertification(index, 'name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Issuing Authority</label>
                    <Input
                      placeholder="e.g., International Sports Medicine Federation"
                      value={cert.issuer}
                      onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Issue Date</label>
                    <Input
                      type="date"
                      value={cert.issueDate}
                      onChange={(e) => updateCertification(index, 'issueDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Expiry Date</label>
                    <Input
                      type="date"
                      value={cert.expiryDate}
                      onChange={(e) => updateCertification(index, 'expiryDate', e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-between items-end">
                    <div className="flex-1 mr-4">
                      <label className="block text-sm font-medium mb-2">Certificate URL</label>
                      <Input
                        placeholder="https://example.com/certificate"
                        value={cert.certificateUrl}
                        onChange={(e) => updateCertification(index, 'certificateUrl', e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={() => removeCertification(index)}
                      size="sm"
                      variant="outline"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}

              {additionalCertifications.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4 border border-dashed rounded-lg">
                  No additional certifications added. Click "Add Certification" to add professional certifications.
                </p>
              )}
            </div>

            <Separator />

            {/* Publications */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Publications</h3>
                <Button type="button" onClick={addPublication} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Publication
                </Button>
              </div>
              
              {publications.map((pub, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Publication Title</label>
                    <Input
                      placeholder="Title of your publication"
                      value={pub.title}
                      onChange={(e) => updatePublication(index, 'title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Journal/Conference</label>
                    <Input
                      placeholder="Name of journal or conference"
                      value={pub.journal}
                      onChange={(e) => updatePublication(index, 'journal', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Year</label>
                    <Input
                      placeholder="2023"
                      value={pub.year}
                      onChange={(e) => updatePublication(index, 'year', e.target.value)}
                    />
                  </div>
                  <div className="flex justify-between items-end">
                    <div className="flex-1 mr-4">
                      <label className="block text-sm font-medium mb-2">URL (optional)</label>
                      <Input
                        placeholder="https://example.com/publication"
                        value={pub.url}
                        onChange={(e) => updatePublication(index, 'url', e.target.value)}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={() => removePublication(index)}
                      size="sm"
                      variant="outline"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              ))}

              {publications.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4 border border-dashed rounded-lg">
                  No publications added. Click "Add Publication" to add your research publications.
                </p>
              )}
            </div>

            <Separator />

            {/* Document Upload */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Document Verification</h3>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Highest Degree Certificate * 
                  <span className="text-gray-500 font-normal">(PDF, JPG, PNG - Max 5MB)</span>
                </label>
                <FileUpload
                  onFileChange={setDegreeFile}
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  placeholder="Upload your highest degree certificate"
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
                'Create Resource Person Account'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}