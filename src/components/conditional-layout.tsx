"use client"

import React from "react"
import { usePathname } from "next/navigation"
import TanstackProviders from "@/app/tanstack-provider"
import { ThemeProvider } from "@/components/provider/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "./footer"

export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname() ?? ""
    const isAuthRoute = pathname === "/login" || pathname === "/register" || pathname.startsWith("/auth")
    return (
        <TanstackProviders>
            <ThemeProvider>
                {isAuthRoute ? (
                    <>{children}</>
                ) : (
                    <>
                        <Navbar />
                        <div className="min-h-screen w-full px-12 py-4">
                            {children}
                        </div>
                        <Footer />
                    </>
                )}
            </ThemeProvider>
        </TanstackProviders>
    )
}
