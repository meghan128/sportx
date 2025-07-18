
import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, LogIn, Users, GraduationCap } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, navigate] = useLocation();
  const { loginUser, loginResourcePerson, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("user");

  const userForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const resourceForm = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate("/");
    return null;
  }

  const onUserSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);

    try {
      await loginUser(data);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const onResourceSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setError(null);

    try {
      await loginResourcePerson(data);
      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const LoginForm = ({ 
    form, 
    onSubmit, 
    type 
  }: { 
    form: any; 
    onSubmit: (data: LoginForm) => void; 
    type: "user" | "resource_person" 
  }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Signing In...
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4 mr-2" />
              Sign In as {type === "user" ? "User" : "Resource Person"}
            </>
          )}
        </Button>
      </form>
    </Form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome to SportX</CardTitle>
          <CardDescription>
            Choose your login type to access the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="user" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                User
              </TabsTrigger>
              <TabsTrigger value="resource_person" className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4" />
                Resource Person
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="user" className="mt-6">
              <div className="mb-4">
                <h3 className="font-semibold text-sm text-gray-700">General User Login</h3>
                <p className="text-xs text-gray-500">Access courses, events, and CPD tracking</p>
              </div>
              <LoginForm 
                form={userForm} 
                onSubmit={onUserSubmit} 
                type="user" 
              />
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-1">Demo User Account:</p>
                <p className="text-xs text-blue-600">
                  Email: user@example.com<br />
                  Password: password
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="resource_person" className="mt-6">
              <div className="mb-4">
                <h3 className="font-semibold text-sm text-gray-700">Resource Person Login</h3>
                <p className="text-xs text-gray-500">Manage courses, mentorship, and resources</p>
              </div>
              <LoginForm 
                form={resourceForm} 
                onSubmit={onResourceSubmit} 
                type="resource_person" 
              />
              
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800 font-medium mb-1">Demo Resource Person Account:</p>
                <p className="text-xs text-green-600">
                  Email: resource@example.com<br />
                  Password: password
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
