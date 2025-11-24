import apiClient from "@/lib/api-client";
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
    return useMutation({
        mutationFn: async (request: UserUpdateRequest) => {
            const response = await apiClient.put("/user", request);
            return response.data.data;
        },
        onSuccess: (response) => {
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

}