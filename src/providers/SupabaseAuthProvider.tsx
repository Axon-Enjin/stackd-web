"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { configs } from "@/configs/configs";

// 1. Define a strictly typed State Object to prevent invalid combos
type AuthState = {
  supabaseAccessToken: string | null;
  status: "checking" | "unauthenticated" | "authenticated";
  error: string | null;
};

// Default initial state
const initialState: AuthState = {
  supabaseAccessToken: null,
  status: "checking",
  error: null,
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export const useSupabaseAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export const SupabaseAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  // Initialize auth state on mount
  useEffect(() => {
    let isMounted = true;

    const supabase = createBrowserClient(
      configs.supabase.projectUrl || "",
      configs.supabase.publishableKey || "",
    );

    supabase.auth.onAuthStateChange((event, session) => {
      // You can listen specifically for token refreshes
      if (event === "TOKEN_REFRESHED" || event === "SIGNED_IN") {
        setAuthState({
          supabaseAccessToken: session?.access_token || null,
          status: "authenticated",
          error: null,
        });
      }

      if (event === "SIGNED_OUT") {
        setAuthState({
          supabaseAccessToken: null,
          status: "unauthenticated",
          error: null,
        });
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
};
