"use client"

import Footer from "@/components/footer"
import Navbar from "@/components/navbar"
import { AddressManagement } from "@/components/profile/address-management"
import { ChangePassword } from "@/components/profile/change-password"
import { ProfileEdit } from "@/components/profile/profile-edit"
import { ProfileSidebar } from "@/components/profile/profile-sidebar"
import { useState } from "react"


export default function ProfilePage() {
    const [activeSection, setActiveSection] = useState<"profile" | "address" | "password">("profile")

    return (
        <div className="min-h-screen">
            <main className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">My Account</h1>
                <div className="flex flex-col lg:flex-row gap-6">
                    <ProfileSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
                    <div className="flex-1">
                        {activeSection === "profile" && <ProfileEdit />}
                        {activeSection === "address" && <AddressManagement />}
                        {activeSection === "password" && <ChangePassword />}
                    </div>
                </div>
            </main>
        </div>
    )
}
