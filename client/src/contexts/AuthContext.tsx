import { createContext, useContext, ReactNode, useState } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  userType: 'student' | 'professional' | 'resource_person';
  authStatus: 'pending' | 'approved' | 'rejected';
  profession?: string;
  specialization?: string;
}

interface AuthContextType {
  user: User | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // Temporarily simplified for testing
  const [user, setUser] = useState<User | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const contextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    login: async (username: string, password: string) => {
      setIsLoading(true);
      try {
        // Simplified login for testing
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
        
        if (!response.ok) {
          throw new Error('Login failed');
        }
        
        const userData = await response.json();
        setUser(userData.user);
      } finally {
        setIsLoading(false);
      }
    },
    logout: async () => {
      setUser(undefined);
      window.location.href = '/auth';
    },
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}