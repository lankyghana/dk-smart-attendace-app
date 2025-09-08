import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

export type UserRole = "admin" | "teacher" | "student";

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
  isApproved?: boolean; // Tracks whether teacher accounts have been approved by admin
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role?: UserRole) => Promise<{ error: Error | null; needsConfirmation?: boolean }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const fetchUserProfile = async (supabaseUser: SupabaseUser): Promise<User> => {
  const { data } = await supabase
    .from("profiles")
    .select("name, role")
    .eq("user_id", supabaseUser.id)
    .maybeSingle();
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? "",
    name: data?.name ?? supabaseUser.email,
    role: data?.role as UserRole | undefined,
    isApproved: true, // All new accounts are approved by default for now - we'll add proper admin approval workflow later
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const updateUser = async (supabaseUser: SupabaseUser | null) => {
      if (supabaseUser) {
        const profile = await fetchUserProfile(supabaseUser);
        setUser(profile);
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      await updateUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      await updateUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return !error;
    } catch (err) {
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string, role: UserRole = "teacher") => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: { name, role },
        },
      });

      if (error) {
        return { error, needsConfirmation: false };
      }

      return { error: null, needsConfirmation: !!(data.user && !data.user.email_confirmed_at) };
    } catch (err) {
      return { error: err as Error, needsConfirmation: false };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};