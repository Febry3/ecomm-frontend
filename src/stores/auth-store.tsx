import { User } from "@/types/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface authState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<authState, [["zustand/persist", authState]]>(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      setUser: (user: User) => set({ user: user, isAuthenticated: true }),
      setToken: (token: string) => {
        document.cookie = `authToken=${token}; path=/; max-age=86400`;
        set({ accessToken: token });
      },
      clearAuth: () => {
        localStorage.clear();
        document.cookie = "authToken=; path=/; max-age=0";
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-store",
    }
  )
);
