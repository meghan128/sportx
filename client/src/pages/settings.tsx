import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { User } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  Lock, 
  CreditCard, 
  Download, 
  Trash, 
  Eye, 
  EyeOff, 
  ShieldAlert, 
  Globe,
  Moon,
  Sun,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";

const Settings = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const { data: user } = useQuery<User>({
    queryKey: ['/api/users/current'],
  });

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSaving(true);
      
      // This would be replaced with an actual API call in production
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Your password has been updated successfully",
      });
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred while updating your password",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout", {});
      window.location.href = "/login";
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to logout",
        variant: "destructive",
      });
    }
  };

  return (
    <DashboardLayout title="Settings">
      <div className="space-y-6">
        <Tabs defaultValue="account">
          <TabsList className="mb-6">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          
          {/* Account Settings */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Email Address</h3>
                    <p className="text-muted-foreground mb-4">Your email is {user?.email}</p>
                    <Button variant="outline">Change Email</Button>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">Account Deactivation</h3>
                    <p className="text-muted-foreground mb-4">
                      Temporarily deactivate your account. You can reactivate at any time.
                    </p>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">Deactivate Account</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will deactivate your account. You will stop receiving emails and your profile will be hidden from other users. You can reactivate your account at any time by logging back in.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction>Deactivate</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-2">Account Deletion</h3>
                    <p className="text-muted-foreground mb-4 text-red-600">
                      Permanently delete your account and all your data. This action cannot be undone.
                    </p>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete Account</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Session Management</CardTitle>
                <CardDescription>Manage your login sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Current Session</h4>
                      <p className="text-sm text-muted-foreground">Current device • Active now</p>
                    </div>
                    <Button variant="outline" onClick={handleLogout}>Logout</Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Mobile App</h4>
                      <p className="text-sm text-muted-foreground">iPhone 13 • Last active 3 days ago</p>
                    </div>
                    <Button variant="outline">Revoke</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Change Password</h3>
                  <p className="text-muted-foreground mb-4">
                    Update your password to maintain account security
                  </p>
                  
                  <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <div className="relative">
                        <Input 
                          id="current-password" 
                          type={showPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <button 
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input 
                        id="new-password" 
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input 
                        id="confirm-password" 
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    
                    <Button onClick={handleChangePassword} disabled={isSaving}>
                      {isSaving ? "Updating..." : "Change Password"}
                    </Button>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-2">Two-Factor Authentication</h3>
                  <p className="text-muted-foreground mb-4">
                    Add an extra layer of security to your account
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="2fa" />
                    <Label htmlFor="2fa">Enable two-factor authentication</Label>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-2">Security Notifications</h3>
                  <p className="text-muted-foreground mb-4">
                    Get notified about important security events
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Switch id="login-alerts" defaultChecked />
                      <Label htmlFor="login-alerts">Login alerts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="password-changes" defaultChecked />
                      <Label htmlFor="password-changes">Password change alerts</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="new-device" defaultChecked />
                      <Label htmlFor="new-device">New device login alerts</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Privacy Settings */}
          <TabsContent value="privacy">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control what information is shared with others</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Profile Visibility</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="profile-public">Public Profile</Label>
                          <p className="text-sm text-muted-foreground">Make your profile visible to other professionals</p>
                        </div>
                        <Switch id="profile-public" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="show-email">Show Email Address</Label>
                          <p className="text-sm text-muted-foreground">Display your email address on your public profile</p>
                        </div>
                        <Switch id="show-email" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="show-phone">Show Phone Number</Label>
                          <p className="text-sm text-muted-foreground">Display your phone number on your public profile</p>
                        </div>
                        <Switch id="show-phone" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-3">Interaction Settings</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="allow-messages">Allow Direct Messages</Label>
                          <p className="text-sm text-muted-foreground">Let other professionals message you directly</p>
                        </div>
                        <Switch id="allow-messages" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="allow-mentorship">Allow Mentorship Requests</Label>
                          <p className="text-sm text-muted-foreground">Let others request you as a mentor</p>
                        </div>
                        <Switch id="allow-mentorship" defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-3">Activity Visibility</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="show-courses">Show Enrolled Courses</Label>
                          <p className="text-sm text-muted-foreground">Display courses you're taking on your profile</p>
                        </div>
                        <Switch id="show-courses" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="show-events">Show Registered Events</Label>
                          <p className="text-sm text-muted-foreground">Display events you're attending on your profile</p>
                        </div>
                        <Switch id="show-events" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="show-cpd">Show CPD Activities</Label>
                          <p className="text-sm text-muted-foreground">Make your CPD activities visible to others</p>
                        </div>
                        <Switch id="show-cpd" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-3">Data Management</h3>
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Download Your Data
                        </Button>
                        <p className="text-sm text-muted-foreground">Get a copy of all your personal data</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notifications Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Control how we contact you</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Email Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-marketing">Marketing emails</Label>
                          <p className="text-sm text-muted-foreground">Receive emails about new features and offers</p>
                        </div>
                        <Switch id="email-marketing" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-courses">Course updates</Label>
                          <p className="text-sm text-muted-foreground">Notifications about courses you're enrolled in</p>
                        </div>
                        <Switch id="email-courses" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-events">Event reminders</Label>
                          <p className="text-sm text-muted-foreground">Reminders about upcoming events you've registered for</p>
                        </div>
                        <Switch id="email-events" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-cpd">CPD deadline reminders</Label>
                          <p className="text-sm text-muted-foreground">Reminders about approaching CPD deadlines</p>
                        </div>
                        <Switch id="email-cpd" defaultChecked />
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-3">Platform Notifications</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="platform-messages">Direct messages</Label>
                          <p className="text-sm text-muted-foreground">Notifications when you receive a new message</p>
                        </div>
                        <Switch id="platform-messages" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="platform-forum">Forum activity</Label>
                          <p className="text-sm text-muted-foreground">Notifications for replies to your discussions</p>
                        </div>
                        <Switch id="platform-forum" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="platform-mentorship">Mentorship requests</Label>
                          <p className="text-sm text-muted-foreground">Notifications about new mentorship opportunities</p>
                        </div>
                        <Switch id="platform-mentorship" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Appearance Settings */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize how Book My Workshop looks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Theme</h3>
                    <div className="flex space-x-4">
                      <div className="border p-4 rounded-lg flex items-center space-x-3 cursor-pointer bg-primary-light">
                        <Sun className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Light</p>
                          <p className="text-sm text-muted-foreground">Use light theme</p>
                        </div>
                      </div>
                      
                      <div className="border p-4 rounded-lg flex items-center space-x-3 cursor-pointer">
                        <Moon className="h-5 w-5" />
                        <div>
                          <p className="font-medium">Dark</p>
                          <p className="text-sm text-muted-foreground">Use dark theme</p>
                        </div>
                      </div>
                      
                      <div className="border p-4 rounded-lg flex items-center space-x-3 cursor-pointer">
                        <div className="h-5 w-5 flex">
                          <div className="h-full w-1/2 bg-primary rounded-l-full"></div>
                          <div className="h-full w-1/2 bg-gray-800 rounded-r-full"></div>
                        </div>
                        <div>
                          <p className="font-medium">System</p>
                          <p className="text-sm text-muted-foreground">Follow system preference</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-3">Language</h3>
                    <div className="max-w-xs">
                      <div className="flex items-center space-x-3 border p-3 rounded-lg">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                        <select className="flex-1 bg-transparent border-0 focus:ring-0">
                          <option value="en">English (UK)</option>
                          <option value="en-us">English (US)</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                          <option value="es">Spanish</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-3">Dashboard Layout</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="compact-view">Compact view</Label>
                          <p className="text-sm text-muted-foreground">Display more content with less spacing</p>
                        </div>
                        <Switch id="compact-view" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="show-tooltips">Show tooltips</Label>
                          <p className="text-sm text-muted-foreground">Display helpful tooltips when hovering elements</p>
                        </div>
                        <Switch id="show-tooltips" defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Billing Settings */}
          <TabsContent value="billing">
            <Card>
              <CardHeader>
                <CardTitle>Billing & Subscription</CardTitle>
                <CardDescription>Manage your payment methods and subscription</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Current Plan</h3>
                    <div className="bg-primary-light p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-lg">Professional Plan</p>
                          <p className="text-muted-foreground">Unlimited access to courses and events</p>
                        </div>
                        <p className="font-semibold">£19.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">Next billing date: June 15, 2023</p>
                        <Button variant="outline" size="sm">Change Plan</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-3">Payment Methods</h3>
                    
                    <div className="space-y-3">
                      <div className="border rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <CreditCard className="h-6 w-6 text-primary" />
                            <div>
                              <p className="font-medium">•••• •••• •••• 4242</p>
                              <p className="text-sm text-muted-foreground">Expires 04/2025</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className="h-5 px-2 bg-primary">Default</Badge>
                            <Button variant="ghost" size="sm">
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Add Payment Method
                      </Button>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-lg font-medium mb-3">Billing History</h3>
                    
                    <div className="space-y-3">
                      <div className="border rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">May 15, 2023</p>
                            <p className="text-sm text-muted-foreground">Professional Plan - Monthly</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <p className="font-medium">£19.99</p>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-3">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">April 15, 2023</p>
                            <p className="text-sm text-muted-foreground">Professional Plan - Monthly</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <p className="font-medium">£19.99</p>
                            <Button variant="ghost" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="link" className="px-0">
                        View All Invoices
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
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
      className={`inline-flex items-center text-xs font-medium text-white rounded ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Settings;