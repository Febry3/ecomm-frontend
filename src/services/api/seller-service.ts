import apiClient from "@/lib/api-client";
import { useAuthStore } from "@/stores/auth-store";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export interface SellerRequest {
    store_name: string;
    store_slug: string;
    description: string;
    logo_url: string;
    business_email: string;
    business_phone: string;
}

export function useRegisterSeller() {
    const { setUser, user } = useAuthStore();
    return useMutation({
        mutationFn: async (data: SellerRequest) => {
            const response = await apiClient.post("/seller", data);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Seller registration submitted successfully");
            setUser({
                ...user!,
                role: "seller"
            });
            window.location.href = "/seller";
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to register seller");
        },
    });
}

export function useUploadSellerLogo() {
    return useMutation({
        mutationFn: async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);

            const response = await apiClient.post("/seller/logo", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data.data;
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to upload logo");
        },
    });
}
