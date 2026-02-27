import { create } from "zustand";
import { AuthUser, UserState } from "@/types/auth.types";

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true,
  initialize: async () => {
    set({ loading: true });
    try {
      const response = await fetch("/api/auth/session");
      if (response.ok) {
        const data = await response.json();
        set({ user: data.user, loading: false });
      } else {
        set({ user: null, loading: false });
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
      set({ user: null, loading: false });
    }
  },
  login: (user: AuthUser) => set({ user, loading: false }),
  logout: async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Failed to logout on server", error);
    } finally {
      set({ user: null, loading: false });
    }
  },
}));
