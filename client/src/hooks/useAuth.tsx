import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";

interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock authentication functions - replace with real implementation
const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));

  if (email === "demo@example.com" && password === "password") {
    const user = {
      id: "1",
      name: "Demo User",
      email: "demo@example.com",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
    };
    localStorage.setItem("auth_user", JSON.stringify(user));
    return user;
  }
  throw new Error("Invalid credentials");
};

const getCurrentUser = async (): Promise<User | null> => {
  const stored = localStorage.getItem("auth_user");
  if (stored) {
    return JSON.parse(stored);
  }
  return null;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ['/api/users/current'],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (user && !error) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user, error]);

  const login = async (credentials: LoginCredentials) => {
    // Implement login logic
    return Promise.resolve();
  };

  const logout = async () => {
    // Implement logout logic
    setIsAuthenticated(false);
    return Promise.resolve();
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}