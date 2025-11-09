"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ShoppingCart, User, ChevronDown, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuthStore } from "@/stores/auth-store"
import { ThemeToggle } from "./provider/theme-toggle"
import Image from 'next/image';

export default function Navbar() {
    const { isAuthenticated } = useAuthStore();
    const pathname = usePathname()
    const [cartCount] = useState(4)
    const [isOpen, setIsOpen] = useState(false)

    const navLinks = [
        { href: "/categories", label: "Categories", hasDropdown: false },
        { href: "/deals", label: "Deals" },
        { href: "/forum", label: "Forum" },
        { href: "/about", label: "About us" },
    ]

    const isActive = (href: string) => pathname === href

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0a0a1f]/95 backdrop-blur-md">
            <div className="relative">
                {/* Gradient glow at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent" />

                <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:gap-6 md:px-6">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="text-xl font-bold md:text-2xl">
                            <Image
                                src="/loot-box.svg"
                                alt="My Company Logo"
                                width={130}
                                height={40}
                                priority
                            />

                        </div>
                    </Link>

                    <div className="hidden items-center gap-1 lg:flex">
                        {navLinks.map((link) => {
                            const active = isActive(link.href)

                            if (link.hasDropdown) {
                                return (
                                    <DropdownMenu key={link.href}>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className={`gap-1 text-sm transition-colors hover:bg-white/5 ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                                    }`}
                                            >
                                                {link.label}
                                                <ChevronDown className="h-3 w-3" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start" className="border-white/10 bg-[#0a0a1f]/95 backdrop-blur-md">
                                            <DropdownMenuItem className="focus:bg-white/5 focus:text-primary">Electronics</DropdownMenuItem>
                                            <DropdownMenuItem className="focus:bg-white/5 focus:text-primary">Gaming</DropdownMenuItem>
                                            <DropdownMenuItem className="focus:bg-white/5 focus:text-primary">Fashion</DropdownMenuItem>
                                            <DropdownMenuItem className="focus:bg-white/5 focus:text-primary">Accessories</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )
                            }

                            return (
                                <Link key={link.href} href={link.href}>
                                    <Button
                                        variant="ghost"
                                        className={`text-sm transition-colors hover:bg-white/5 ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        {link.label}
                                    </Button>
                                </Link>
                            )
                        })}
                    </div>

                    <div className="relative hidden flex-1 max-w-md md:block">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search products..."
                            className="w-full border-white/10 bg-white/5 pl-10 text-sm placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20"
                        />
                    </div>

                    <div className="hidden items-center gap-2 md:flex">
                        {!isAuthenticated ? (
                            <>
                                <Link href="/cart">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`relative gap-2 text-sm transition-colors hover:bg-white/5 ${isActive("/cart")
                                            ? "text-primary"
                                            : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        <ShoppingCart className="h-4 w-4" />
                                        Cart
                                        {cartCount > 0 && (
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                                                {cartCount}
                                            </span>
                                        )}
                                    </Button>
                                </Link>
                                <Link href="/account">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`gap-2 text-sm transition-colors hover:bg-white/5 ${isActive("/account")
                                            ? "text-primary"
                                            : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        <User className="h-4 w-4" />
                                        Account
                                    </Button>
                                </Link>


                            </>
                        ) : (
                            <Link href="/login">
                                <Button type="button">Login</Button>
                            </Link>
                        )}
                        <ThemeToggle />
                    </div>

                    <div className="flex items-center gap-2 md:hidden">
                        <Link href="/cart">
                            <Button variant="ghost" size="icon" className="relative">
                                <ShoppingCart className="h-5 w-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                                        {cartCount}
                                    </span>
                                )}
                            </Button>
                        </Link>

                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] border-white/10 bg-[#0a0a1f]/98 backdrop-blur-md">
                                {/* Mobile Search */}
                                <div className="relative mb-6 mt-6">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search products..."
                                        className="w-full border-white/10 bg-white/5 pl-10 text-sm placeholder:text-muted-foreground focus-visible:border-primary/50 focus-visible:ring-primary/20"
                                    />
                                </div>

                                {/* Mobile Navigation */}
                                <div className="flex flex-col gap-2">
                                    {navLinks.map((link) => {
                                        const active = isActive(link.href)

                                        if (link.hasDropdown) {
                                            return (
                                                <div key={link.href} className="flex flex-col gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        className={`justify-start gap-2 text-base transition-colors hover:bg-white/5 ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                                            }`}
                                                    >
                                                        {link.label}
                                                        <ChevronDown className="h-4 w-4" />
                                                    </Button>
                                                    <div className="ml-4 flex flex-col gap-1">
                                                        <Button
                                                            variant="ghost"
                                                            className="justify-start text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                                        >
                                                            Electronics
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            className="justify-start text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                                        >
                                                            Gaming
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            className="justify-start text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                                        >
                                                            Fashion
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            className="justify-start text-sm text-muted-foreground hover:bg-white/5 hover:text-foreground"
                                                        >
                                                            Accessories
                                                        </Button>
                                                    </div>
                                                </div>
                                            )
                                        }

                                        return (
                                            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                                                <Button
                                                    variant="ghost"
                                                    className={`w-full justify-start text-base transition-colors hover:bg-white/5 ${active ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                                        }`}
                                                >
                                                    {link.label}
                                                </Button>
                                            </Link>
                                        )
                                    })}

                                    <div className="my-4 h-px bg-white/10" />

                                    <Link href="/account" onClick={() => setIsOpen(false)}>
                                        <Button
                                            variant="ghost"
                                            className={`w-full justify-start gap-2 text-base transition-colors hover:bg-white/5 ${isActive("/account") ? "text-primary" : "text-muted-foreground hover:text-foreground"
                                                }`}
                                        >
                                            <User className="h-4 w-4" />
                                            Account
                                        </Button>
                                    </Link>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    )
}
