
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, ArrowRight, CheckCircle, Users, GraduationCap, Sparkles } from "lucide-react";

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
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

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
    onSubmit
  }: { 
    form: any; 
    onSubmit: (data: LoginForm) => void; 
  }) => (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <Alert variant="destructive" className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Email Address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
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
              <FormLabel className="text-gray-700 font-medium">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg pr-12"
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-12 px-3 hover:bg-transparent text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Signing you in...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-5 w-5 ml-2" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Hero Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-white relative overflow-hidden border-r border-gray-200">
        <div className="relative z-10 flex flex-col justify-center px-12">
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">SportX CPD</h1>
            </div>
            <h2 className="text-4xl font-bold mb-6 leading-tight text-gray-900">
              Free Professional Development & Training Platform
            </h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Track your CPD credits, attend courses, and advance your career with our comprehensive platform.
            </p>
          </div>
          
          <div className="space-y-4 mb-12">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
              <span className="text-gray-700">4.5 CUSTOMER RATING</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
              <span className="text-gray-700">COMPLETELY FREE</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
              <span className="text-gray-700">START SELLING INSTANTLY</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
              <span className="text-gray-700">90% INCREASE IN SALES</span>
            </div>
          </div>

          <div>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Start Today
            </button>
          </div>
        </div>
        
        {/* Simple geometric decoration */}
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-50 rounded-full"></div>
        <div className="absolute top-20 right-32 w-20 h-20 bg-blue-100 rounded-full"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-600">Sign in to continue your professional journey</p>
          </div>

          {/* Login Type Selector */}
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setActiveTab("user")}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  activeTab === "user"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <Users className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium text-sm">User</div>
                <div className="text-xs opacity-75">Student/Professional</div>
              </button>
              <button
                onClick={() => setActiveTab("resource_person")}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  activeTab === "resource_person"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <GraduationCap className="h-6 w-6 mx-auto mb-2" />
                <div className="font-medium text-sm">Educator</div>
                <div className="text-xs opacity-75">Resource Person</div>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            {activeTab === "user" ? (
              <>
                <div className="mb-6">
                  <h3 className="font-semibold text-lg text-gray-900">User Login</h3>
                  <p className="text-sm text-gray-600">Access courses, events, and track your CPD progress</p>
                </div>
                <LoginForm 
                  form={userForm} 
                  onSubmit={onUserSubmit} 
                  type="user" 
                />
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-sm font-medium text-blue-900 mb-1">Demo Account</p>
                  <p className="text-xs text-blue-700">
                    Email: user@example.com<br />
                    Password: password
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="font-semibold text-lg text-gray-900">Educator Login</h3>
                  <p className="text-sm text-gray-600">Manage courses, mentor students, and share resources</p>
                </div>
                <LoginForm 
                  form={resourceForm} 
                  onSubmit={onResourceSubmit} 
                  type="resource_person" 
                />
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-100">
                  <p className="text-sm font-medium text-green-900 mb-1">Demo Account</p>
                  <p className="text-xs text-green-700">
                    Email: resource@example.com<br />
                    Password: password
                  </p>
                </div>
              </>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Don't have an account? Contact your administrator
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
