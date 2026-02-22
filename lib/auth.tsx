import React from "react";
import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  clerk_id: string;
  email: string;
  name: string;
  is_premium: boolean;
  current_streak: number;
  free_interviews_used: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  getToken: () => Promise<string | null>;
  authenticatedFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser();
  const { getToken } = useClerkAuth();
  const [dbUser, setDbUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);

  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    const token = await getToken();
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  };

  const refreshUser = async () => {
    if (!isSignedIn) {
      setDbUser(null);
      setLoading(false);
      return;
    }
    try {
      const res = await authenticatedFetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setDbUser(data.user);
      }
    } catch (e) {
      console.error("Failed to refresh user", e);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isLoaded) {
      refreshUser();
    }
  }, [isLoaded, isSignedIn]);

  return (
    <AuthContext.Provider value={{ user: dbUser, loading: loading || !isLoaded, refreshUser, getToken, authenticatedFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
