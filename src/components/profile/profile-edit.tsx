import { useEffect, useState } from "react"
import { Camera, Save } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useChangeUserData, useGetUserData, useChangeAvatar } from "@/services/api/user-service"
import { useAuthStore } from "@/stores/auth-store"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const profileSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phoneNumber: z.string().min(10, "Phone number must be at least 10 characters"),
})

type ProfileFormValues = z.infer<typeof profileSchema>

export function ProfileEdit() {
    const { data: userData, isLoading, isError, error } = useGetUserData();
    const { mutate: updateUserData, isPending } = useChangeUserData();
    const { mutate: updateAvatar, isPending: isAvatarPending } = useChangeAvatar();
    const { user } = useAuthStore();

    const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>("");

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: "",
            firstName: "",
            lastName: "",
            phoneNumber: "",
        },
    })

    const { register, handleSubmit, reset, formState: { errors } } = form

    // Populate form when user data is fetched
    useEffect(() => {
        if (userData) {
            reset({
                username: userData.username || "",
                firstName: userData.first_name || "",
                lastName: userData.last_name || "",
                phoneNumber: userData.phone_number || "",
            });
            setAvatarPreview(userData.profile_url || "");
        }
    }, [userData, reset]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Store the file for later upload
            setSelectedAvatarFile(file);

            // Create preview
            const reader = new FileReader()
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const onSubmit = (data: ProfileFormValues) => {
        // First, upload avatar if a new one was selected
        if (selectedAvatarFile) {
            updateAvatar(selectedAvatarFile, {
                onSuccess: () => {
                    // After avatar upload succeeds, update user data
                    updateUserData({
                        username: data.username,
                        first_name: data.firstName,
                        last_name: data.lastName,
                        phone_number: data.phoneNumber,
                        user_id: user!.user_id,
                    });
                    // Clear the selected file
                    setSelectedAvatarFile(null);
                },
                onError: () => {
                    // If avatar upload fails, still try to update user data
                    updateUserData({
                        username: data.username,
                        first_name: data.firstName,
                        last_name: data.lastName,
                        phone_number: data.phoneNumber,
                        user_id: user!.user_id,
                    });
                }
            });
        } else {
            // No avatar change, just update user data
            updateUserData({
                username: data.username,
                first_name: data.firstName,
                last_name: data.lastName,
                phone_number: data.phoneNumber,
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

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Profile Picture */}
                <div className="flex items-center gap-4">
                    <Avatar className="w-24 h-24">
                        <AvatarImage src={avatarPreview || "/placeholder.svg"} alt={userData?.username} />
                        <AvatarFallback>
                            {userData?.first_name?.[0] || "U"}
                            {userData?.last_name?.[0] || "U"}
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
                        placeholder="Enter username"
                        {...register("username")}
                    />
                    {errors.username && (
                        <p className="text-xs text-destructive">{errors.username.message}</p>
                    )}
                </div>

                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            placeholder="Enter first name"
                            {...register("firstName")}
                        />
                        {errors.firstName && (
                            <p className="text-xs text-destructive">{errors.firstName.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            placeholder="Enter last name"
                            {...register("lastName")}
                        />
                        {errors.lastName && (
                            <p className="text-xs text-destructive">{errors.lastName.message}</p>
                        )}
                    </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number</Label>
                    <Input
                        id="phoneNumber"
                        placeholder="Enter phone number"
                        {...register("phoneNumber")}
                    />
                    {errors.phoneNumber && (
                        <p className="text-xs text-destructive">{errors.phoneNumber.message}</p>
                    )}
                </div>

                {/* Email (Read-only) */}
                <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" value={userData?.email || ""} disabled className="bg-muted cursor-not-allowed" />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>

                {/* Save Button */}
                <div className="flex justify-end pt-4">
                    <Button type="submit" className="gap-2" disabled={isPending || isAvatarPending}>
                        <Save className="w-4 h-4" />
                        {(isPending || isAvatarPending) ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
