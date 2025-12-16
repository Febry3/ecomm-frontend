import apiClient from "@/lib/api-client";
import { ProductRequest, SellerProductsResponse } from "@/types/product";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";


export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ProductRequest) => {
            const response = await apiClient.post("/seller/products", data);
            return response.data.data;
        },
        onSuccess: () => {
            toast.success("Product created successfully");
            queryClient.invalidateQueries({ queryKey: ["seller-products"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create product");
        },
    });
}

export function useUpdateProduct(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ProductRequest) => {
            const response = await apiClient.put(`/seller/products/${id}`, data);
            return response.data.data;
        },
        onSuccess: () => {
            toast.success("Product updated successfully");
            queryClient.invalidateQueries({ queryKey: ["seller-product"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update product");
        },
    });
}

export function useGetSellerProducts() {
    return useSuspenseQuery({
        queryKey: ["seller-products"],
        queryFn: async () => {
            const response = await apiClient.get<{ data: SellerProductsResponse }>("/seller/products");
            // API returns { data: SellerProductsResponse, ... }
            return response.data.data;
        },
        retry: 1,
    });
}

export function useGetSellerProduct(id: string) {
    return useSuspenseQuery({
        queryKey: ["seller-product"],
        queryFn: async () => {
            const response = await apiClient.get(`/seller/products/${id}`);
            return response.data.data;
        },
        retry: 1,
    });
}