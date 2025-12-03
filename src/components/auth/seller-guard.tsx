"use client";

import { useAuthStore } from "@/stores/auth-store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";

export default function SellerGuard({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        if (pathname === "/seller/register" || pathname === "/seller/onboard") {
            setIsChecking(false);
            return;
        }

        if (!isAuthenticated) {
            router.push("/login");
        } else if (user?.role !== "seller") {
            router.push("/");
        } else {
            setIsChecking(false);
        }
    }, [isAuthenticated, user, router, pathname]);

    if (isChecking) {
        return <div className="flex items-center justify-center h-screen gap-3">
            <Spinner className="h-15 w-15 text-primary" />
            <h1 className="text-2xl font-bold">Please wait...</h1>
        </div>
    }

    return <>{children}</>;
}
