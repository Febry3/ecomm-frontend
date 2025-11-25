"use client"

import { useEffect, useState } from "react"
import { Camera, Save } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { useChangeUserData, useGetUserData, useChangeAvatar } from "@/services/api/user-service"
import { useAuthStore } from "@/stores/auth-store"

export function ProfileEdit() {
    const { data: userData, isLoading, isError, error } = useGetUserData();
    const { mutate: updateUserData, isPending } = useChangeUserData();
    const { mutate: updateAvatar, isPending: isAvatarPending } = useChangeAvatar();
    const { user } = useAuthStore();

    const [profileData, setProfileData] = useState({
        username: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        profilePicture: "",
    })

    // Store the selected file separately
    const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);

    // Populate form when user data is fetched
    useEffect(() => {
        if (userData) {
            setProfileData({
                username: userData.username || "",
                firstName: userData.first_name || "",
                lastName: userData.last_name || "",
                phoneNumber: userData.phone_number || "",
                email: userData.email || "",
                profilePicture: userData.profile_url || "",
            });
        }
    }, [userData]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Store the file for later upload
            setSelectedAvatarFile(file);

            // Create preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setProfileData({ ...profileData, profilePicture: reader.result as string })
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSave = async () => {
        // First, upload avatar if a new one was selected
        if (selectedAvatarFile) {
            updateAvatar(selectedAvatarFile, {
                onSuccess: () => {
                    // After avatar upload succeeds, update user data
                    updateUserData({
                        username: profileData.username,
                        first_name: profileData.firstName,
                        last_name: profileData.lastName,
                        phone_number: profileData.phoneNumber,
                        user_id: user!.user_id,
                    });
                    // Clear the selected file
                    setSelectedAvatarFile(null);
                },
                onError: () => {
                    // If avatar upload fails, still try to update user data
                    updateUserData({
                        username: profileData.username,
                        first_name: profileData.firstName,
                        last_name: profileData.lastName,
                        phone_number: profileData.phoneNumber,
                        user_id: user!.user_id,
                    });
                }
            });
        } else {
            // No avatar change, just update user data
            updateUserData({
                username: profileData.username,
                first_name: profileData.firstName,
                last_name: profileData.lastName,
                phone_number: profileData.phoneNumber,
                user_id: user!.user_id,
            });
        }
    }


    if (isLoading) {
        return (
            <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-center h-64">
                    <p className="text-destructive">Error loading profile: {error?.message}</p>
                </div>
            </div>
        );
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
                            {profileData.firstName[0] || "U"}
                            {profileData.lastName[0] || "U"}
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
                    <Button onClick={handleSave} className="gap-2" disabled={isPending || isAvatarPending}>
                        <Save className="w-4 h-4" />
                        {(isPending || isAvatarPending) ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>
        </div>
    )
}
