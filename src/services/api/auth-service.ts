import apiClient from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation } from "@tanstack/react-query";

export function useLogin() {
    const { setUser, setToken } = useAuthStore();

    return useMutation({
        mutationFn: async (credentials: { email: string; password: string }) => {
            const response = await apiClient.post('/auth/login', credentials);
            return response.data.data;
        },
        onSuccess: (data) => {
            console.log(data)
            setUser({ user_id: data.id, username: data.username, email: data.email });
            setToken(data.access_token);
        },
        onError: (error) => {
            console.error('Login failed:', error);
        },
    });
}

// Hook: useLogout
export const useLogout = () => {
    const { clearAuth } = useAuthStore();

    return useMutation({
        mutationFn: async () => {
            await apiClient.post('/auth/logout');
        },
        onSuccess: () => {
            clearAuth();
        },
        onError: (error) => {
            console.error('Logout failed:', error);
            clearAuth();
        },
    });
};