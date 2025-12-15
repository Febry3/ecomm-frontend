import apiClient from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export interface ProductVariantStock {
    current_stock: number;
    reserved_stock: number;
    low_stock_threshold: number;
}

export interface ProductVariant {
    sku: string;
    name: string;
    price: number;
    is_active: boolean;
    stock: ProductVariantStock;
}

export interface CreateProductRequest {
    title: string;
    slug: string;
    description: string;
    category_id: string;
    badge?: string;
    is_active: boolean;
    variants: ProductVariant[];
}

export function useCreateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: CreateProductRequest) => {
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

export function useGetSellerProducts() {
    return useSuspenseQuery({
        queryKey: ["seller-products"],
        queryFn: async () => {
            const response = await apiClient.get("/seller/products");
            console.log(response.data);
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