"use client"

import { User, MapPin, Lock } from 'lucide-react'
import { cn } from "@/lib/utils"

interface ProfileSidebarProps {
    activeSection: "profile" | "address" | "password"
    onSectionChange: (section: "profile" | "address" | "password") => void
}

export function ProfileSidebar({ activeSection, onSectionChange }: ProfileSidebarProps) {
    const menuItems = [
        {
            id: "profile" as const,
            label: "Profile",
            icon: User,
            description: "Edit your profile information",
        },
        {
            id: "address" as const,
            label: "Address",
            icon: MapPin,
            description: "Manage your addresses",
        },
        {
            id: "password" as const,
            label: "Security",
            icon: Lock,
            description: "Change your password",
        },
    ]

    return (
        <aside className="lg:w-64 w-full">
            <div className="bg-card border border-border rounded-lg p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeSection === item.id

                    return (
                        <button
                            key={item.id}
                            onClick={() => onSectionChange(item.id)}
                            className={cn(
                                "w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left",
                                isActive
                                    ? "bg-primary/10 text-primary border border-primary/20"
                                    : "hover:bg-muted text-foreground"
                            )}
                        >
                            <Icon className={cn("w-5 h-5 mt-0.5", isActive ? "text-primary" : "text-muted-foreground")} />
                            <div className="flex-1">
                                <div className="font-medium">{item.label}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                            </div>
                        </button>
                    )
                })}
            </div>
        </aside>
    )
}
