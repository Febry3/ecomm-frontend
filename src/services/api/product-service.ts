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

export interface CreateProductWithImagesParams {
    data: ProductRequest;
    images: File[];
    primaryImageIndex: number;
}

export function useCreateProductWithImages() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ data, images, primaryImageIndex }: CreateProductWithImagesParams) => {
            const formData = new FormData();

            // Append product data as JSON string
            formData.append("data", JSON.stringify(data));
            formData.append("primary_image_index", String(primaryImageIndex));

            // Append each image file
            images.forEach((image) => {
                formData.append("images", image);
            });

            const response = await apiClient.post("/seller/products", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
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

export interface UpdateProductWithImagesParams {
    data: ProductRequest;
    newImages: File[];
    existingImageIds: string[]; // IDs of existing images to keep
    primaryImageIndex: number;
}

export function useUpdateProduct(id: string) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ data, newImages, existingImageIds, primaryImageIndex }: UpdateProductWithImagesParams) => {
            const formData = new FormData();

            // Append product data as JSON string
            formData.append("data", JSON.stringify(data));
            formData.append("primary_image_index", String(primaryImageIndex));

            // Append existing image IDs (images to keep)
            formData.append("existing_image_ids", JSON.stringify(existingImageIds));

            // Only append new image files if there are any
            if (newImages.length > 0) {
                newImages.forEach((image) => {
                    formData.append("images", image);
                });
            }

            const response = await apiClient.put(`/seller/products/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            return response.data.data;
        },
        onSuccess: () => {
            toast.success("Product updated successfully");
            queryClient.invalidateQueries({ queryKey: ["seller-products"] });
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
            return response.data.data;
        },
        retry: 1,
    });
}

// Non-suspending version for use in pages without Suspense boundary
export function useGetSellerProductsQuery() {
    return useQuery({
        queryKey: ["seller-products"],
        queryFn: async () => {
            const response = await apiClient.get<{ data: SellerProductsResponse }>("/seller/products");
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