import apiClient from "@/lib/api-client";
import { Address } from "@/types/address";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useGetAllUserAddress() {
    return useQuery({
        queryKey: ["user-address"],
        queryFn: async () => {
            const response = await apiClient.get("/user/address");
            return response.data.data;
        },
        retry: 1,
    });
}

export function useAddUserAddress() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (address: Omit<Address, "address_id" | "user_id" | "created_at" | "updated_at">) => {
            const response = await apiClient.post("/user/address", address);
            console.log(response);
            return response.data.data;
        },
        onSuccess: (response: Address) => {
            console.log(response);
            queryClient.invalidateQueries({ queryKey: ["user-address"] });
            toast.success("Address has been added successfully.");
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to add address.", {
                description: "Please try again.",
            })
        },
    });
}

export function useUpdateUserAddress() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (address: Address) => {
            const response = await apiClient.put(`/user/address/${address.address_id}`, address);
            return response.data.data;
        },
        onSuccess: (response: Address) => {
            console.log(response);
            queryClient.invalidateQueries({ queryKey: ["user-address"] });
            toast.success("Address has been updated successfully.");
        },
        onError: (error) => {
            console.error(error);
            toast.error("Failed to update address.", {
                description: "Please try again.",
            })
        },
    });
}