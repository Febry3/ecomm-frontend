"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload } from "lucide-react"
import { useGetSeller, useUpdateSellerStore } from "@/services/api/seller-service"
import { toast } from "sonner"
import { useQueryClient } from "@tanstack/react-query"

interface Seller {
    id: number;
    user_id: number;
    store_name: string;
    store_slug: string;
    description: string;
    logo_url: string;
    business_email: string;
    business_phone: string;
    average_rating: number;
    total_sales: number;
    is_verified: boolean;
    status: string;
    created_at: string;
    updated_at: string;
}

export default function SettingsPage() {
    const { data } = useGetSeller() as { data: Seller };
    const { mutate: updateStore, isPending } = useUpdateSellerStore();
    const queryClient = useQueryClient();

    const [storeName, setStoreName] = useState("")
    const [storeDescription, setStoreDescription] = useState("")
    const [businessEmail, setBusinessEmail] = useState("")
    const [businessPhone, setBusinessPhone] = useState("")
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string>("")

    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (data) {
            setStoreName(data.store_name || "")
            setStoreDescription(data.description || "")
            setBusinessEmail(data.business_email || "")
            setBusinessPhone(data.business_phone || "")
            setLogoPreview(data.logo_url || "")
        }
    }, [data])

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    const handleLogoClick = () => {
        fileInputRef.current?.click()
    }

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        console.log("File selected:", file)
        if (file) {
            if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
                toast.error("Only .jpg, .png, and .webp formats are supported")
                return
            }

            if (file.size > 5 * 1024 * 1024) {
                toast.error("Max file size is 5MB")
                return
            }

            setLogoFile(file)
            const previewUrl = URL.createObjectURL(file)
            console.log("Preview URL:", previewUrl)
            setLogoPreview(previewUrl)
        }
    }

    const handleSaveChanges = () => {
        const formData = new FormData()
        formData.append("store_name", storeName)
        formData.append("description", storeDescription)
        formData.append("business_email", businessEmail)
        formData.append("business_phone", businessPhone)

        if (logoFile) {
            formData.append("logo", logoFile)
            console.log("Logo appended to FormData:", logoFile.name, logoFile.type, logoFile.size)
        }

        // Debug: Log FormData contents
        for (const [key, value] of formData.entries()) {
            console.log("FormData entry:", key, value)
        }

        updateStore(formData, {
            onSuccess: () => {
                toast.success("Store settings updated successfully")
                setLogoFile(null) // Reset the file after successful upload
                queryClient.invalidateQueries({ queryKey: ["seller-data"] })
            }
        })
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Store Settings</h1>
                <p className="text-muted-foreground">Manage your store profile and business information</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Store Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24 cursor-pointer" onClick={handleLogoClick}>
                            <AvatarImage key={logoPreview} src={logoPreview || "/placeholder.svg"} />
                            <AvatarFallback>{getInitials(storeName || "ST")}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleLogoChange}
                                className="hidden"
                            />
                            <Button variant="outline" onClick={handleLogoClick}>
                                <Upload className="h-4 w-4 mr-2" />
                                {logoFile ? "Change Logo" : "Upload Logo"}
                            </Button>
                            {logoFile && (
                                <p className="text-xs text-muted-foreground">
                                    Selected: {logoFile.name}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="storeName">Store Name</Label>
                        <Input id="storeName" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="storeDescription">Store Description</Label>
                        <Textarea
                            id="storeDescription"
                            value={storeDescription}
                            onChange={(e) => setStoreDescription(e.target.value)}
                            rows={4}
                        />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="businessEmail">Business Email</Label>
                            <Input
                                id="businessEmail"
                                type="email"
                                value={businessEmail}
                                onChange={(e) => setBusinessEmail(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="businessPhone">Business Phone</Label>
                            <Input
                                id="businessPhone"
                                type="tel"
                                value={businessPhone}
                                onChange={(e) => setBusinessPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button onClick={handleSaveChanges} disabled={isPending}>
                        {isPending ? "Saving..." : "Save Changes"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
