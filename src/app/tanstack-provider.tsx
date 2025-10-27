// app/providers.tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export default function TanstackProviders({ children }: { children: React.ReactNode }) {
    // Use useState to create the queryClient instance,
    // ensuring it's only created once per application lifecycle.
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Best Practice: Set a global staleTime to avoid
                        // excessive refetching
                        staleTime: 1000 * 60 * 5, // 5 minutes
                        refetchOnWindowFocus: false, // Optional
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}