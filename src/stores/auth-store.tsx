import { create } from "zustand";

interface User {
    user_id: number;
    username: string;
    email: string;
}

interface authState {
    user: User | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    setUser: (user: User) => void;
    setToken: (token: string) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<authState>((set) => ({
    user: null,
    accessToken: null,
    isAuthenticated: false,
    setUser: (user) => set({ user: user, isAuthenticated: true }),
    setToken: (token) => set({ accessToken: token }),
    clearAuth: () => set({ user: null, accessToken: null, isAuthenticated: false }),
}));