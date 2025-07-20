import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAsyncToast } from "./use-async-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "resource_person";
  profileImage?: string;
  bio?: string;
  profession?: string;
  username?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginUser: (credentials: LoginCredentials) => Promise<void>;
  loginResourcePerson: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Authentication API calls
const loginUserApi = async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
  const response = await fetch('/api/auth/login/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  return response.json();
};

const loginResourcePersonApi = async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
  const response = await fetch('/api/auth/login/resource-person', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  return response.json();
};

const getCurrentUser = async (): Promise<User | null> => {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    return null;
  }

  const response = await fetch('/api/users/current', {
    headers: { 'Authorization': `Bearer ${token}` },
  });

  if (!response.ok) {
    localStorage.removeItem("auth_token");
    return null;
  }

  return response.json();
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { executeWithToast, showSuccess, showError } = useAsyncToast();

  const { data: user, isLoading, error, refetch } = useQuery<User>({
    queryKey: ['/api/users/current'],
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: !!localStorage.getItem("auth_token"),
  });

  useEffect(() => {
    if (user && !error) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user, error]);

  const loginUser = async (credentials: LoginCredentials) => {
    const loginAction = async () => {
      const { user, token } = await loginUserApi(credentials);
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));
      setIsAuthenticated(true);
      refetch();
      return { success: true, user: user }; // Return success status
    };

    await executeWithToast(loginAction, {
      loadingMessage: "Signing in...",
      successMessage: `Welcome back, ${credentials.email}!`,
      errorMessage: "Failed to sign in. Please check your credentials.",
    });
  };

  const loginResourcePerson = async (credentials: LoginCredentials) => {
    const loginAction = async () => {
      const { user, token } = await loginResourcePersonApi(credentials);
      localStorage.setItem("auth_token", token);
      localStorage.setItem("auth_user", JSON.stringify(user));
      setIsAuthenticated(true);
      refetch();
       return { success: true, user: user }; // Return success status
    };

    await executeWithToast(loginAction, {
      loadingMessage: "Signing in...",
      successMessage: `Welcome back, ${credentials.email}!`,
      errorMessage: "Failed to sign in. Please check your credentials.",
    });
  };

  const logout = async () => {
    const logoutAction = async () => {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
      setIsAuthenticated(false);
      refetch();
      return { success: true };
    };

    await executeWithToast(logoutAction, {
      loadingMessage: "Logging out...",
      successMessage: "Logged out successfully.",
      errorMessage: "Failed to logout.",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      loginUser,
      loginResourcePerson,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { useAuth };