"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    DollarSign,
    Star,
    Settings,
    Menu,
    X,
    Store,
    ChevronDown,
} from "lucide-react"
import SellerGuard from "@/components/auth/seller-guard"

const navigation = [
    { name: "Dashboard", href: "/seller", icon: LayoutDashboard },
    {
        name: "Products",
        href: "/seller/products",
        icon: Package,
        submenu: [
            { name: "All Products", href: "/seller/products" },
            { name: "Add Product", href: "/seller/products/add" },
            { name: "Variants", href: "/seller/products/variants" },
        ],
    },
    { name: "Orders", href: "/seller/orders", icon: ShoppingCart },
    { name: "Group Buy", href: "/seller/group-buy", icon: Users },
    { name: "Finance", href: "/seller/finance", icon: DollarSign },
    { name: "Reviews", href: "/seller/reviews", icon: Star },
    { name: "Settings", href: "/seller/settings", icon: Settings },
]

export default function SellerLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [expandedItems, setExpandedItems] = useState<string[]>(["Products"])
    const pathname = usePathname()

    const isRegisterPage = pathname === "/seller/register"
    const isOnboardingPage = pathname === "/seller/onboard"

    if (isRegisterPage || isOnboardingPage) {
        return <div className="min-h-screen bg-background">{children}</div>
    }

    const toggleSubmenu = (itemName: string) => {
        setExpandedItems((prev) =>
            prev.includes(itemName) ? prev.filter((name) => name !== itemName) : [...prev, itemName],
        )
    }

    return (
        <SellerGuard>
            <div className="min-h-screen bg-background">
                {/* Mobile sidebar backdrop */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
                )}

                {/* Sidebar */}
                <aside
                    className={cn(
                        "fixed inset-y-0 left-0 z-50 w-64 transform bg-card border-r border-border transition-transform duration-300 ease-in-out lg:translate-x-0",
                        sidebarOpen ? "translate-x-0" : "-translate-x-full",
                    )}
                >
                    <div className="flex h-16 items-center justify-between px-6 border-b border-border">
                        <Link href="/seller" className="flex items-center gap-2">
                            <Store className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold">Seller Portal</span>
                        </Link>
                        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <nav className="space-y-1 px-3 py-4">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href
                            const hasSubmenu = item.submenu && item.submenu.length > 0
                            const isExpanded = expandedItems.includes(item.name)
                            const isSubmenuActive = hasSubmenu && item.submenu.some((sub) => pathname === sub.href)

                            return (
                                <div key={item.name}>
                                    {hasSubmenu ? (
                                        <>
                                            <button
                                                onClick={() => toggleSubmenu(item.name)}
                                                className={cn(
                                                    "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                                    isSubmenuActive
                                                        ? "bg-primary/10 text-primary"
                                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <item.icon className="h-5 w-5" />
                                                    {item.name}
                                                </div>
                                                <ChevronDown className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")} />
                                            </button>
                                            {isExpanded && (
                                                <div className="ml-9 mt-1 space-y-1">
                                                    {item.submenu.map((subItem) => {
                                                        const isSubActive = pathname === subItem.href
                                                        return (
                                                            <Link
                                                                key={subItem.name}
                                                                href={subItem.href}
                                                                className={cn(
                                                                    "block rounded-lg px-3 py-1.5 text-sm transition-colors",
                                                                    isSubActive
                                                                        ? "bg-primary text-primary-foreground"
                                                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                                                )}
                                                            >
                                                                {subItem.name}
                                                            </Link>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                                isActive
                                                    ? "bg-primary text-primary-foreground"
                                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                            )}
                                        >
                                            <item.icon className="h-5 w-5" />
                                            {item.name}
                                        </Link>
                                    )}
                                </div>
                            )
                        })}
                    </nav>
                </aside>

                {/* Main content */}
                <div className="lg:pl-64">
                    {/* Top bar */}
                    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-card px-6">
                        <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                            <Menu className="h-5 w-5" />
                        </Button>
                        <div className="flex-1" />
                        <Link href="/">
                            <Button variant="outline" size="sm">
                                View Store
                            </Button>
                        </Link>
                    </header>

                    {/* Page content */}
                    <main className="p-6">{children}</main>
                </div>
            </div>
        </SellerGuard>
    )
}
