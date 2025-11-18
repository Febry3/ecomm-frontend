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
                set({ accessToken: token });
            },
            clearAuth: () => {
                localStorage.removeItem('authToken');
                set({ user: null, accessToken: null, isAuthenticated: false });
            },
        }),
        {
            name: "auth-store",
        }
    )
);