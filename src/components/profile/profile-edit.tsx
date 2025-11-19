"use client"

import { useState } from "react"
import { Camera, Save } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"

export function ProfileEdit() {
    const [profileData, setProfileData] = useState({
        username: "johndoe",
        firstName: "John",
        lastName: "Doe",
        phoneNumber: "+1234567890",
        email: "john.doe@example.com",
        profilePicture: "/placeholder.svg?height=100&width=100",
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfileData({ ...profileData, profilePicture: reader.result as string })
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSave = () => {
        // Save logic here
        toast("Your profile has been successfully updated.")
    }

    return (
        <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

            <div className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-4">
                    <Avatar className="w-24 h-24">
                        <AvatarImage src={profileData.profilePicture || "/placeholder.svg"} alt={profileData.username} />
                        <AvatarFallback>
                            {profileData.firstName[0]}
                            {profileData.lastName[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <Label htmlFor="profile-picture" className="cursor-pointer">
                            <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                                <Camera className="w-4 h-4" />
                                <span>Change Picture</span>
                            </div>
                            <Input
                                id="profile-picture"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </Label>
                        <p className="text-xs text-muted-foreground mt-2">JPG, PNG or GIF. Max size 2MB.</p>
                    </div>
                </div>

                {/* Username */}
                <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        value={profileData.username}
                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                        placeholder="Enter username"
                    />
                </div>

                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            value={profileData.firstName}
                            onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                            placeholder="Enter first name"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            value={profileData.lastName}
                            onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                            placeholder="Enter last name"
                        />
                    </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                        id="phoneNumber"
                        value={profileData.phoneNumber}
                        onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                        placeholder="Enter phone number"
                    />
                </div>

                {/* Email (Read-only) */}
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" value={profileData.email} disabled className="bg-muted cursor-not-allowed" />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                    <Button onClick={handleSave} className="gap-2">
                        <Save className="w-4 h-4" />
                        Save Changes
                    </Button>
                </div>
            </div>
        </div>
    )
}
