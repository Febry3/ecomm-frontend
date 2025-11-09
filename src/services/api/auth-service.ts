import apiClient from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

interface ErrrorResponse {
    response: any
}

export function useLogin() {
    const { setUser, setToken } = useAuthStore();

    return useMutation({
        mutationFn: async (credentials: { email: string; password: string }) => {
            const response = await apiClient.post('/auth/login', credentials);
            return response.data.data;
        },
        onSuccess: (data) => {
            setUser({ user_id: data.id, username: data.username, email: data.email });
            setToken(data.access_token);
            toast("Login successfully")
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                return error.response
            }
            toast("Login failed");
            console.error('Login failed:', error);
        },
    });
}

export function useRegister(){
    return useMutation({
        mutationFn: async (credentials: {username: string, first_name:string, last_name:string, phone_number:string, email:string, password: string}) => {
            const response = await apiClient.post('/auth/register', credentials);
            return response.data.data;
        },
        onSuccess: (data) => {
            toast.success("Registered successfully")
        },
        onError: (error) => {
            toast.error("Failed to register")
            console.error(error)
        }
    })
}

// Hook: useLogout
export function useLogout(){
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