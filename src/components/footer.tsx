"use client"

import Link from "next/link"
import { Instagram, Twitter, Linkedin } from "lucide-react"
import { randomInt, randomUUID } from "crypto"

const menus = [
    { href: "/categories", label: "Categories" },
    { href: "/deals", label: "Deals" },
    { href: "/forum", label: "Forum" },
    { href: "/about", label: "About us" },
]


export default function Footer() {
    return (
        <footer className="bg-[#1a1b2e] text-foreground border-t border-border/20 px-12">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
                    {/* Brand Section */}
                    <div className="md:col-span-2">
                        <h3 className="text-xl font-semibold mb-4">LootBox</h3>
                        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et lacinia mi.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link
                                href="https://www.instagram.com/"
                                className="w-8 h-8 rounded-full hover:bg-primary transition-colors flex items-center justify-center text-white"
                            >
                                <Instagram className="w-4 h-4 " />
                            </Link>
                            <Link
                                href="#"
                                className="w-8 h-8 rounded-full hover:bg-primary transition-colors flex items-center justify-center text-white"
                            >
                                <Twitter className="w-4 h-4" />
                            </Link>
                            <Link
                                href="#"
                                className="w-8 h-8 rounded-full hover:bg-primary transition-colors flex items-center justify-center text-white"
                            >
                                <Linkedin className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Menu Section */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4">Menu</h4>
                        <ul className="space-y-3">
                            {menus.map((item) =>
                                <li key={item.label}>
                                    <Link href={item.href} className="text-sm text-muted-foreground hover:text-accent transition-colors">
                                        {item.label}
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>

                    {/* Studio Section */}
                    <div>
                        <h4 className="text-sm font-semibold mb-4">Studio</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                                    Team
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-accent transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Copyright Section */}
            <div className="border-t border-accent/50">
                <div className="container mx-auto px-4 py-4">
                    <p className="text-sm text-accent">Copyright © 2025 LootBox</p>
                </div>
            </div>
        </footer>
    )
}
