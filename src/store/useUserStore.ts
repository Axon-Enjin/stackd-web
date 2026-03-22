import { create } from "zustand";
import { AuthUser, UserState } from "@/types/auth.types";
import { apiFetch } from "@/lib/clientApi";

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true,
  initialize: async () => {
    set({ loading: true });
    try {
      const response = await apiFetch("/api/custom-auth/session");
      
      if (response.ok) {
        const data = await response.json();
        set({ user: data.user, loading: false });
      } else {
        // If session check fails, clear token just in case
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token");
        }
        set({ user: null, loading: false });
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
      set({ user: null, loading: false });
    }
  },
  login: (user: AuthUser, token?: string) => {
    if (token && typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
    set({ user, loading: false });
  },
  logout: async () => {
    try {
      await apiFetch("/api/custom-auth/logout", { 
        method: "POST",
      });
    } catch (error) {
      console.error("Failed to logout on server", error);
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
      }
      set({ user: null, loading: false });
    }
  },
}));
