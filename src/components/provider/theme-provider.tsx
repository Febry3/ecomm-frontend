"use client"

import type React from "react"

import { useEffect, useState } from "react"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        // Check for saved theme preference or default to dark
        const savedTheme = localStorage.getItem("theme") || "dark"
        if (savedTheme === "dark") {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }
    }, [])

    if (!mounted) return null

    return <>{children}</>
}
