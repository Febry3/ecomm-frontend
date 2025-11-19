import apiClient from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth-store";
import { GoogleLoginResponse } from "@/types/auth";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

interface ErrrorResponse {
    response: any;
}

export function useLogin() {
    const { setUser, setToken } = useAuthStore();
    return useMutation({
        mutationFn: async (credentials: { email: string; password: string }) => {
            const response = await apiClient.post("/auth/login", credentials);
            return response.data.data;
        },
        onSuccess: (data) => {
            setUser({ user_id: data.id, username: data.username, email: data.email });
            setToken(data.access_token);
            toast("Login successfully");
            window.location.href = "/";
        },
        onError: (error) => {
            if (axios.isAxiosError(error)) {
                return error.response;
            }
            toast("Login failed");
            console.error("Login failed:", error);
        },
    });
}

export function useRegister() {
    return useMutation({
        mutationFn: async (credentials: {
            username: string;
            first_name: string;
            last_name: string;
            phone_number: string;
            email: string;
            password: string;
        }) => {
            const response = await apiClient.post("/auth/register", credentials);
            return response.data.data;
        },
        onSuccess: (data) => {
            toast.success("Registered successfully");
            window.location.href = "/login";
        },
        onError: (error) => {
            toast.error("Failed to register");
            console.error(error);
        },
    });
}

export function useLogout() {
    const { clearAuth } = useAuthStore();

    return useMutation({
        mutationFn: async () => {
            await apiClient.post("/auth/logout");
        },
        onSuccess: () => {
            clearAuth();
        },
        onError: (error) => {
            console.error("Logout failed:", error);
            clearAuth();
        },
    });
}

export function useGoogleLoginOrRegister() {
    const { setUser, setToken } = useAuthStore();
    return useMutation({
        mutationFn: async (code: string) => {
            const response = await apiClient.post("auth/google", {
                code: code,
            });
            return response.data.data as GoogleLoginResponse;
        },
        onSuccess: (data) => {
            console.log("login on google", data);
            setUser({
                username: data.first_name,
                email: data.email,
                user_id: data.id,
                profile_url: data.profile_url
            });
            setToken(data.access_token);
            console.log("on success:", data);
            toast.success("Auth Success");
            window.location.href = "/";
        },
        onError: (error) => {
            console.error("Login with google error: ", error.message);
            toast.error(error.message);
        },
    });
}
