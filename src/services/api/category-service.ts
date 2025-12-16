import apiClient from "@/lib/api-client";
import { useSuspenseQuery } from "@tanstack/react-query";

export function useGetAllCategory() {
    return useSuspenseQuery({
        queryKey: ["category-data"],
        queryFn: async () => {
            const response = await apiClient.get("/product/categories");
            return response.data.data;
        },
        retry: 1,
    });
}