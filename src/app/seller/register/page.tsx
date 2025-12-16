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
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

const sellerRegisterSchema = z.object({
    storeName: z.string().min(3, "Store name must be at least 3 characters"),
    storeSlug: z.string()
        .min(3, "Store slug must be at least 3 characters")
        .regex(/^[a-z0-9-]+$/, "Only lowercase letters, numbers, and hyphens are allowed"),
    description: z.string().optional(),
    businessEmail: z.string().email("Invalid email address"),
    businessPhone: z.string().min(10, "Phone number must be at least 10 characters"),
    logo: z.any()
        .refine((file) => file instanceof File, "Store logo is required")
        .refine((file) => file?.size <= 5000000, "Max file size is 5MB")
        .refine(
            (file) => ["image/jpeg", "image/png", "image/webp"].includes(file?.type),
            "Only .jpg, .png, and .webp formats are supported"
        ),
    ktp: z.any()
        .refine((file) => file instanceof File, "KTP is required")
        .refine((file) => file?.size <= 5000000, "Max file size is 5MB")
        .refine(
            (file) => ["image/jpeg", "image/png", "image/webp"].includes(file?.type),
            "Only .jpg, .png, and .webp formats are supported"
        ),
})

type SellerRegisterFormValues = z.infer<typeof sellerRegisterSchema>

export default function SellerRegisterPage() {
    const { user } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        if (user?.role === "seller") {
            router.push("/seller")
        }
    }, [user, router])

    const [logoPreview, setLogoPreview] = useState<string>("")
    const [ktpPreview, setKtpPreview] = useState<string>("")

    const { mutate: registerSeller, isPending: isRegistering } = useRegisterSeller()
    const { mutateAsync: uploadLogo, isPending: isUploading } = useUploadSellerLogo()

    const form = useForm<SellerRegisterFormValues>({
        resolver: zodResolver(sellerRegisterSchema),
        defaultValues: {
            storeName: "",
            storeSlug: "",
            description: "",
            businessEmail: "",
            businessPhone: "",
        },
    })

    const { register, handleSubmit, setValue, watch, formState: { errors } } = form

    // Auto-generate slug from store name
    const storeName = watch("storeName")
    useEffect(() => {
        if (storeName) {
            const slug = storeName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)/g, "")
            setValue("storeSlug", slug, { shouldValidate: true })
        }
    }, [storeName, setValue])

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setValue("logo", file, { shouldValidate: true })
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
            setValue("ktp", file, { shouldValidate: true })
            const reader = new FileReader()
            reader.onloadend = () => {
                setKtpPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const onSubmit = async (data: SellerRegisterFormValues) => {
        try {
            const formData = new FormData()
            formData.append("store_name", data.storeName)
            formData.append("store_slug", data.storeSlug)
            formData.append("description", data.description || "")
            formData.append("business_email", data.businessEmail)
            formData.append("business_phone", data.businessPhone)

            if (data.logo) {
                formData.append("logo", data.logo)
            }

            // Assuming backend might also need KTP if it was in the schema, 
            // but strictly following the user request for logo. 
            // Given the schema has KTP, it's safer to include it if potential backend support exists, 
            // but user specifically asked for logo. I'll include KTP as well to be thorough since it's in the form.
            if (data.ktp) {
                formData.append("ktp", data.ktp)
            }
            console.log(formData)
            registerSeller(formData, {
                onSuccess: () => {
                    router.push("/seller")
                }
            })

        } catch (error) {
            console.error("Registration failed:", error)
            toast.error("Failed to register seller. Please try again.")
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

                <form onSubmit={handleSubmit(onSubmit)}>
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
                                            placeholder="Enter your store name"
                                            {...register("storeName")}
                                        />
                                        {errors.storeName && (
                                            <p className="text-xs text-destructive">{errors.storeName.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="storeSlug">
                                            Store URL Slug <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="storeSlug"
                                            placeholder="store-url-slug"
                                            {...register("storeSlug")}
                                        />
                                        {errors.storeSlug && (
                                            <p className="text-xs text-destructive">{errors.storeSlug.message}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Your store will be available at: lootbox.com/store/{watch("storeSlug") || "your-slug"}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Store Description</Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Tell customers about your store..."
                                        rows={4}
                                        {...register("description")}
                                    />
                                    {errors.description && (
                                        <p className="text-xs text-destructive">{errors.description.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="logo">Store Logo <span className="text-destructive">*</span></Label>
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
                                            {errors.logo && (
                                                <p className="text-xs text-destructive mt-1">{errors.logo.message as string}</p>
                                            )}
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
                                            type="email"
                                            placeholder="business@example.com"
                                            {...register("businessEmail")}
                                        />
                                        {errors.businessEmail && (
                                            <p className="text-xs text-destructive">{errors.businessEmail.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="businessPhone">
                                            Business Phone <span className="text-destructive">*</span>
                                        </Label>
                                        <Input
                                            id="businessPhone"
                                            type="tel"
                                            placeholder="+62 812-3456-7890"
                                            {...register("businessPhone")}
                                        />
                                        {errors.businessPhone && (
                                            <p className="text-xs text-destructive">{errors.businessPhone.message}</p>
                                        )}
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
                                                    setValue("ktp", undefined as any, { shouldValidate: true })
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
                                            />
                                            <p className="text-xs text-muted-foreground">PNG, JPG, or JPEG (max 5MB)</p>
                                        </div>
                                    )}
                                    {errors.ktp && (
                                        <p className="text-xs text-destructive">{errors.ktp.message as string}</p>
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

