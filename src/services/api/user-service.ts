import apiClient from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

interface UserUpdateRequest {
    username: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    profile_url?: string;
    user_id: number;
}

export function useGetUserData() {
    return useQuery({
        queryKey: ["user-data"],
        queryFn: async () => {
            const response = await apiClient.get("/user");
            return response.data.data;
        },
        retry: 1,
    });
}

export function useChangeUserData() {
    const { user, setUser } = useAuthStore();
    return useMutation({
        mutationFn: async (request: UserUpdateRequest) => {
            const response = await apiClient.put("/user", request);
            return response.data.data;
        },
        onSuccess: (response) => {
            setUser({
                ...user!,
                username: response.username,
                profile_url: response.profile_url,
            });
            console.log(response);
            toast.success("profile data updated successfully");
        },
        onError: (error) => {
            toast.error(error.message);
            console.error(error);
        }
    });
}

export function useChangeAvatar() {
    const { user, setUser } = useAuthStore();
    return useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);

            const response = await apiClient.post("/user/avatar", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data.data;
        },
        onSuccess: (response) => {
            setUser({
                ...user!,
                profile_url: response.profile_url,
            });
            toast.success("Profile picture updated successfully");
        },
        onError: (error) => {
            toast.error(error.message || "Failed to update profile picture");
            console.error(error);
        }
    });
}