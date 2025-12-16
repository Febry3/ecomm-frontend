"use client";

import { useAuthStore } from "@/stores/auth-store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "../ui/spinner";
import Loader from "../loader";

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
            router.push("/seller/onboard");
        } else {
            setIsChecking(false);
        }
    }, [isAuthenticated, user, router, pathname]);

    if (isChecking) {
        return <Loader />
    }

    return <>{children}</>;
}
