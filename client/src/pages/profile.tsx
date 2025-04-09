import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { User } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Award,
  BadgeCheck, 
  Building2, 
  Calendar, 
  Edit, 
  Eye,
  Globe, 
  MapPin,
  MoreVertical, 
  Phone, 
  Trash,
  UserCircle,
  Mail,
  Link as LinkIcon,
  Linkedin,
  Twitter
} from "lucide-react";

const Profile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/users/current'],
  });

  const [formData, setFormData] = useState<Partial<User>>({});

  // Initialize form data when user data is loaded
  React.useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNestedChange = (e: React.ChangeEvent<HTMLInputElement>, parent: string) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [name]: value
      }
    }));
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      
      await apiRequest("PATCH", "/api/users/profile", formData);
      
      queryClient.invalidateQueries({ queryKey: ['/api/users/current'] });
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully",
      });
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message || "An error occurred while updating your profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <DashboardLayout title="My Profile">
      <div className="space-y-6">
        {isLoading ? (
          <Card className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="h-32 w-32 rounded-full bg-gray-200 mx-auto md:mx-0"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Manage your profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={user?.profileImage} />
                    <AvatarFallback className="text-xl">{user?.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button variant="outline" size="sm">
                      Change Photo
                    </Button>
                  )}
                </div>
                
                <div className="flex-1 space-y-4">
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input 
                            id="name" 
                            name="name"
                            value={formData.name || ''} 
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input 
                            id="email" 
                            name="email"
                            value={formData.email || ''} 
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="profession">Profession</Label>
                          <Input 
                            id="profession" 
                            name="profession"
                            value={formData.profession || ''} 
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="specialization">Specialization</Label>
                          <Input 
                            id="specialization" 
                            name="specialization"
                            value={formData.specialization || ''} 
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Professional Bio</Label>
                        <Textarea 
                          id="bio" 
                          name="bio"
                          value={formData.bio || ''} 
                          onChange={handleChange}
                          rows={4}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="organization">Organization</Label>
                          <Input 
                            id="organization" 
                            name="organization"
                            value={formData.organization || ''} 
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Input 
                            id="location" 
                            name="location"
                            value={formData.location || ''} 
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <h2 className="text-2xl font-bold">{user?.name}</h2>
                        <p className="text-muted-foreground">
                          {user?.profession}
                          {user?.specialization && ` · ${user.specialization}`}
                        </p>
                      </div>
                      
                      {user?.bio && (
                        <p>{user.bio}</p>
                      )}
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
                        {user?.organization && (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span>{user.organization}</span>
                          </div>
                        )}
                        {user?.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{user.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </>
              ) : (
                <Button className="ml-auto" onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              )}
            </CardFooter>
          </Card>
        )}
        
        <Tabs defaultValue="contact">
          <TabsList className="mb-6">
            <TabsTrigger value="contact">Contact Information</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="privacy">Privacy Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How others can reach you</CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          name="phone"
                          value={formData.contactInfo?.phone || ''} 
                          onChange={(e) => handleNestedChange(e, 'contactInfo')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Contact Email</Label>
                        <Input 
                          id="contactEmail" 
                          name="email"
                          value={formData.contactInfo?.email || ''} 
                          onChange={(e) => handleNestedChange(e, 'contactInfo')}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input 
                        id="website" 
                        name="website"
                        value={formData.contactInfo?.website || ''} 
                        onChange={(e) => handleNestedChange(e, 'contactInfo')}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input 
                          id="linkedin" 
                          name="linkedin"
                          value={formData.socialLinks?.linkedin || ''} 
                          onChange={(e) => handleNestedChange(e, 'socialLinks')}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter</Label>
                        <Input 
                          id="twitter" 
                          name="twitter"
                          value={formData.socialLinks?.twitter || ''} 
                          onChange={(e) => handleNestedChange(e, 'socialLinks')}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
                      {user?.contactInfo?.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p>{user.contactInfo.phone}</p>
                          </div>
                        </div>
                      )}
                      
                      {user?.contactInfo?.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p>{user.contactInfo.email}</p>
                          </div>
                        </div>
                      )}
                      
                      {user?.contactInfo?.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">Website</p>
                            <a 
                              href={user.contactInfo.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {user.contactInfo.website}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h4 className="text-sm font-medium mb-3">Social Media</h4>
                      <div className="flex gap-3">
                        {user?.socialLinks?.linkedin && (
                          <a 
                            href={user.socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <Linkedin className="h-5 w-5" />
                          </a>
                        )}
                        
                        {user?.socialLinks?.twitter && (
                          <a 
                            href={user.socialLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                          >
                            <Twitter className="h-5 w-5" />
                          </a>
                        )}
                        
                        {(!user?.socialLinks?.linkedin && !user?.socialLinks?.twitter) && (
                          <p className="text-sm text-muted-foreground">No social links added</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
              {!isEditing && (
                <CardFooter>
                  <Button className="ml-auto" onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Contact Info
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          
          <TabsContent value="credentials">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Professional Credentials</CardTitle>
                  <CardDescription>Your certifications and qualifications</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <BadgeCheck className="mr-2 h-4 w-4" />
                      Add Credential
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Professional Credential</DialogTitle>
                      <DialogDescription>
                        Add your professional certifications, licenses, and educational qualifications to showcase your expertise.
                      </DialogDescription>
                    </DialogHeader>
                    <form className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="credential-type">Credential Type</Label>
                        <Select defaultValue="certification">
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="certification">Certification</SelectItem>
                            <SelectItem value="license">License</SelectItem>
                            <SelectItem value="degree">Degree</SelectItem>
                            <SelectItem value="course">Course Certificate</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="credential-name">Credential Name</Label>
                        <Input id="credential-name" placeholder="E.g., Certified Strength and Conditioning Specialist" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="issuing-organization">Issuing Organization</Label>
                        <Input id="issuing-organization" placeholder="E.g., National Strength and Conditioning Association" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="issue-date">Issue Date</Label>
                          <Input id="issue-date" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="expiry-date">Expiry Date (Optional)</Label>
                          <Input id="expiry-date" type="date" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="credential-id">Credential ID (Optional)</Label>
                        <Input id="credential-id" placeholder="E.g., CSC-123456" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="credential-url">Credential URL (Optional)</Label>
                        </div>
                        <Input id="credential-url" placeholder="Link to digital certificate or verification page" />
                      </div>
                    </form>
                    <DialogFooter>
                      <Button variant="outline" type="button">Cancel</Button>
                      <Button type="submit">Add Credential</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-40 flex items-center justify-center">
                    <p className="text-muted-foreground">Loading credentials...</p>
                  </div>
                ) : (
                  <div>
                    {/* Sample credentials - in a real app, these would come from the API */}
                    <div className="space-y-4">
                      <div className="flex flex-col md:flex-row border rounded-lg overflow-hidden">
                        <div className="bg-primary p-4 text-white md:w-1/4 flex items-center justify-center">
                          <BadgeCheck className="h-8 w-8" />
                        </div>
                        <div className="p-4 flex-1">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-lg">Certified Sports Physiotherapist</h3>
                              <p className="text-muted-foreground">Chartered Society of Physiotherapy</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-green-600">Active</Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Certificate
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <div className="mt-2 text-sm">
                            <div className="flex items-center gap-6 mt-2">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Issued: May 2021</span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Expires: May 2024</span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <BadgeCheck className="h-4 w-4" />
                                <span>ID: CSP-12345</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row border rounded-lg overflow-hidden">
                        <div className="bg-primary p-4 text-white md:w-1/4 flex items-center justify-center">
                          <Award className="h-8 w-8" />
                        </div>
                        <div className="p-4 flex-1">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-lg">MSc Sports Science</h3>
                              <p className="text-muted-foreground">University of Manchester</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-primary">Degree</Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Certificate
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          <div className="mt-2 text-sm">
                            <div className="flex items-center gap-6 mt-2">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>Issued: June 2019</span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Award className="h-4 w-4" />
                                <span>First Class Honors</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control who can see your information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Profile Visibility</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="profile-public">Public Profile</Label>
                          <p className="text-sm text-muted-foreground">Make your profile visible to all platform users</p>
                        </div>
                        <Switch id="profile-public" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="show-email">Show Email Address</Label>
                          <p className="text-sm text-muted-foreground">Display your email to other users</p>
                        </div>
                        <Switch id="show-email" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="show-phone">Show Phone Number</Label>
                          <p className="text-sm text-muted-foreground">Display your phone number to other users</p>
                        </div>
                        <Switch id="show-phone" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-3">Connection Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="allow-messages">Allow Direct Messages</Label>
                          <p className="text-sm text-muted-foreground">Allow other professionals to send you messages</p>
                        </div>
                        <Switch id="allow-messages" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="allow-mentorship">Allow Mentorship Requests</Label>
                          <p className="text-sm text-muted-foreground">Allow others to request mentorship connections</p>
                        </div>
                        <Switch id="allow-mentorship" defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-3">Activity Privacy</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="show-courses">Show Enrolled Courses</Label>
                          <p className="text-sm text-muted-foreground">Display your enrolled courses on your public profile</p>
                        </div>
                        <Switch id="show-courses" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="show-events">Show Event Registrations</Label>
                          <p className="text-sm text-muted-foreground">Display your upcoming events on your public profile</p>
                        </div>
                        <Switch id="show-events" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="show-cpd">Show CPD Activities</Label>
                          <p className="text-sm text-muted-foreground">Display your CPD activities on your public profile</p>
                        </div>
                        <Switch id="show-cpd" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto">Save Privacy Settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

// Badge component for the card
const Badge = ({ children, className = "", ...props }: any) => {
  return (
    <span 
      className={`inline-flex items-center text-xs font-medium text-white rounded px-2 py-1 ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Profile;
