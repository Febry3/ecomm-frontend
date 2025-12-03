"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Store, Mail, Award as IdCard } from "lucide-react"
import { toast } from "sonner"
import { useAuthStore } from "@/stores/auth-store"
import { useRegisterSeller, useUploadSellerLogo } from "@/services/api/seller-service"

export default function SellerRegisterPage() {
    const { user } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        if (user?.role === "seller") {
            router.push("/seller")
        }
    }, [user, router])

    const [formData, setFormData] = useState({
        storeName: "",
        storeSlug: "",
        description: "",
        businessEmail: "",
        businessPhone: "",
    })

    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string>("")
    const [ktpFile, setKtpFile] = useState<File | null>(null)
    const [ktpPreview, setKtpPreview] = useState<string>("")

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        // Auto-generate slug from store name
        if (name === "storeName") {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "")
            setFormData((prev) => ({
                ...prev,
                storeSlug: slug,
            }))
        }
    }

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setLogoFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setLogoPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleKtpUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setKtpFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setKtpPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const { mutate: registerSeller, isPending: isRegistering } = useRegisterSeller()
    const { mutateAsync: uploadLogo, isPending: isUploading } = useUploadSellerLogo()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Validation
        if (!formData.storeName || !formData.storeSlug || !formData.businessEmail || !formData.businessPhone) {
            toast.error("Please fill in all required fields")
            return
        }

        if (!logoFile) {
            toast.error("Please upload your store logo")
            return
        }

        // if (!ktpFile) {
        //     toast.error("Please upload your KTP (ID Card)")
        //     return
        // }

        try {
            // 1. Upload Logo
            // const logoResponse = await uploadLogo(logoFile)
            // const logoUrl = logoResponse.url

            // 2. Register Seller
            registerSeller({
                store_name: formData.storeName,
                store_slug: formData.storeSlug,
                description: formData.description,
                logo_url: "test",
                business_email: formData.businessEmail,
                business_phone: formData.businessPhone,
            }, {
                onSuccess: () => {
                    router.push("/seller")
                }
            })

        } catch (error) {
            console.error("Registration failed:", error)
        }
    }


    return (
        <div className="min-h-screen bg-background py-12 px-4">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8 text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                            <Store className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <h1 className="mb-2 text-3xl font-bold">Become a Seller</h1>
                    <p className="text-muted-foreground">Fill in the information below to start selling on LootBox</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Store Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Store className="h-5 w-5" />
                                    Store Information
                                </CardTitle>
                                <CardDescription>Basic information about your store</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="storeName">
                                            Store Name <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="storeName"
                                            name="storeName"
                                            placeholder="Enter your store name"
                                            value={formData.storeName}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="storeSlug">
                                            Store URL Slug <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="storeSlug"
                                            name="storeSlug"
                                            placeholder="store-url-slug"
                                            value={formData.storeSlug}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Your store will be available at: lootbox.com/store/{formData.storeSlug || "your-slug"}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Store Description</Label>
                                    <Textarea
                                        id="description"
                                        name="description"
                                        placeholder="Tell customers about your store..."
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows={4}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="logo">Store Logo</Label>
                                    <div className="flex items-center gap-4">
                                        {logoPreview && (
                                            <div className="h-20 w-20 overflow-hidden rounded-lg border-2 border-border">
                                                <img
                                                    src={logoPreview || "/placeholder.svg"}
                                                    alt="Logo preview"
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <Input
                                                id="logo"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleLogoUpload}
                                                className="cursor-pointer"
                                            />
                                            <p className="mt-1 text-xs text-muted-foreground">
                                                Upload a square image (recommended: 500x500px)
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Business Contact */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="h-5 w-5" />
                                    Business Contact
                                </CardTitle>
                                <CardDescription>How customers can reach you</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="businessEmail">
                                            Business Email <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="businessEmail"
                                            name="businessEmail"
                                            type="email"
                                            placeholder="business@example.com"
                                            value={formData.businessEmail}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="businessPhone">
                                            Business Phone <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="businessPhone"
                                            name="businessPhone"
                                            type="tel"
                                            placeholder="+62 812-3456-7890"
                                            value={formData.businessPhone}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* KTP Verification */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <IdCard className="h-5 w-5" />
                                    Identity Verification
                                </CardTitle>
                                <CardDescription>
                                    Upload your KTP (Indonesian ID Card) for verification <span className="text-destructive">*</span>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="ktp">
                                        KTP (ID Card) <span className="text-destructive">*</span>
                                    </Label>
                                    {ktpPreview ? (
                                        <div className="space-y-4">
                                            <div className="overflow-hidden rounded-lg border-2 border-border">
                                                <img
                                                    src={ktpPreview || "/placeholder.svg"}
                                                    alt="KTP preview"
                                                    className="w-full object-contain"
                                                />
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => {
                                                    setKtpFile(null)
                                                    setKtpPreview("")
                                                }}
                                                className="w-full"
                                            >
                                                Change KTP
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-accent/50 p-8 text-center">
                                            <Upload className="mb-4 h-12 w-12 text-muted-foreground" />
                                            <Label
                                                htmlFor="ktp"
                                                className="mb-2 cursor-pointer text-sm font-medium text-primary hover:underline"
                                            >
                                                Click to upload your KTP
                                            </Label>
                                            <Input
                                                id="ktp"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleKtpUpload}
                                                className="hidden"
                                                required
                                            />
                                            <p className="text-xs text-muted-foreground">PNG, JPG, or JPEG (max 5MB)</p>
                                        </div>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                        Your KTP information will be kept confidential and used only for verification purposes.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submit Button */}
                        <div className="flex justify-end gap-4">
                            <Button type="button" variant="outline" onClick={() => router.push("/")}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isRegistering || isUploading} className="min-w-[150px]">
                                {isRegistering || isUploading ? "Submitting..." : "Submit Application"}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
function useAuth(): { user: any } {
    throw new Error("Function not implemented.")
}

