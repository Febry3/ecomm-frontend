"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TiptapEditor } from "@/components/tiptap-editor"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, Upload, X } from "lucide-react"
import { useCreateProductWithImages } from "@/services/api/product-service"
import { ProductVariant } from "@/types/product"
import { useGetAllCategory } from "@/services/api/category-service"

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface VariantFormData {
    id: string;
    sku: string;
    name: string;
    price: number;
    is_active: boolean;
    current_stock: number;
    reserved_stock: number;
    low_stock_threshold: number;
}

export default function AddProductPage() {
    const router = useRouter()
    const { mutate: createProductWithImages, isPending } = useCreateProductWithImages()
    const { data: categories } = useGetAllCategory()

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        category_id: 0,
        badge: "",
        is_active: true,
    })

    const [images, setImages] = useState<Array<{ id: string; url: string; file?: File; isPrimary: boolean }>>([])
    const [variants, setVariants] = useState<VariantFormData[]>([
        {
            id: "1",
            sku: "",
            name: "",
            price: 0,
            is_active: true,
            current_stock: 0,
            reserved_stock: 0,
            low_stock_threshold: 5,
        }
    ])

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            const newImages = Array.from(files).map((file, index) => ({
                id: `temp-${Date.now()}-${index}`,
                url: URL.createObjectURL(file),
                file,
                isPrimary: images.length === 0 && index === 0,
            }))
            setImages([...images, ...newImages])
        }
    }

    const removeImage = (id: string) => {
        setImages(images.filter((img) => img.id !== id))
    }

    const setPrimaryImage = (id: string) => {
        setImages(images.map((img) => ({ ...img, isPrimary: img.id === id })))
    }

    const addVariant = () => {
        setVariants([
            ...variants,
            {
                id: `${Date.now()}`,
                sku: "",
                name: "",
                price: 0,
                is_active: true,
                current_stock: 0,
                reserved_stock: 0,
                low_stock_threshold: 5,
            }
        ])
    }

    const removeVariant = (id: string) => {
        if (variants.length > 1) {
            setVariants(variants.filter((v) => v.id !== id))
        }
    }

    const updateVariant = (id: string, field: keyof VariantFormData, value: any) => {
        setVariants(variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Transform variants to match backend structure
        const transformedVariants: ProductVariant[] = variants.map((v) => ({
            sku: v.sku,
            name: v.name,
            price: v.price,
            is_active: v.is_active,
            stock: {
                current_stock: v.current_stock,
                reserved_stock: v.reserved_stock,
                low_stock_threshold: v.low_stock_threshold,
            },
        }))

        // Extract image files from state
        const imageFiles = images
            .filter(img => img.file)
            .map(img => img.file as File)

        // Find primary image index among the files being uploaded
        const primaryIndex = images.findIndex(img => img.isPrimary && img.file)

        createProductWithImages({
            data: {
                title: formData.title,
                slug: formData.slug,
                description: formData.description,
                category_id: formData.category_id,
                badge: formData.badge || undefined,
                is_active: formData.is_active,
                variants: transformedVariants,
            },
            images: imageFiles,
            primaryImageIndex: primaryIndex >= 0 ? primaryIndex : 0,
        }, {
            onSuccess: () => {
                router.push("/seller/products")
            }
        })
    }

    return (
        <div className="max-w-full space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Add New Product</h1>
                <p className="text-muted-foreground">Create a new product listing</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>Enter the basic details of your product</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Product Title</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => {
                                    const title = e.target.value
                                    setFormData({
                                        ...formData,
                                        title,
                                        slug: title
                                            .toLowerCase()
                                            .replace(/\s+/g, "-")
                                            .replace(/[^\w-]/g, ""),
                                    })
                                }}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">URL Slug</Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <TiptapEditor
                                content={formData.description}
                                onChange={(content) => setFormData({ ...formData, description: content })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                    value={formData.category_id.toString()}
                                    onValueChange={(value) => setFormData({ ...formData, category_id: Number(value) })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories?.map((category: Category) => (
                                            <SelectItem key={category.id} value={String(category.id)}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="badge">Badge (Optional)</Label>
                                <Input
                                    id="badge"
                                    value={formData.badge}
                                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                    placeholder="e.g., Best Seller"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Active Status</Label>
                                <p className="text-sm text-muted-foreground">Make this product visible in your store</p>
                            </div>
                            <Switch
                                checked={formData.is_active}
                                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Product Images */}
                <Card>
                    <CardHeader>
                        <CardTitle>Product Images</CardTitle>
                        <CardDescription>Upload images for your product</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-4 gap-4">
                            {images.map((image) => (
                                <div key={image.id} className="relative group">
                                    <img
                                        src={image.url || "/placeholder.svg"}
                                        alt="Product"
                                        className="aspect-square rounded-lg object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                        <Button
                                            type="button"
                                            size="icon"
                                            variant="secondary"
                                            onClick={() => setPrimaryImage(image.id)}
                                            disabled={image.isPrimary}
                                        >
                                            {image.isPrimary ? "★" : "☆"}
                                        </Button>
                                        <Button type="button" size="icon" variant="destructive" onClick={() => removeImage(image.id)}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {image.isPrimary && (
                                        <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                                            Primary
                                        </div>
                                    )}
                                </div>
                            ))}

                            <label className="aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2">
                                <Upload className="h-8 w-8 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">Upload</span>
                                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                            </label>
                        </div>
                    </CardContent>
                </Card>

                {/* Product Variants */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Product Variants</CardTitle>
                                <CardDescription>Add different variants of your product with stock information</CardDescription>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Variant
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {variants.map((variant) => (
                            <div key={variant.id} className="p-4 rounded-lg border space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium">Variant Details</h4>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor={`active-${variant.id}`} className="text-sm">Active</Label>
                                            <Switch
                                                id={`active-${variant.id}`}
                                                checked={variant.is_active}
                                                onCheckedChange={(checked) => updateVariant(variant.id, "is_active", checked)}
                                            />
                                        </div>
                                        {variants.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeVariant(variant.id)}
                                                className="text-destructive"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label>Variant Name</Label>
                                        <Input
                                            value={variant.name}
                                            onChange={(e) => updateVariant(variant.id, "name", e.target.value)}
                                            placeholder="e.g., Red / Large"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>SKU</Label>
                                        <Input
                                            value={variant.sku}
                                            onChange={(e) => updateVariant(variant.id, "sku", e.target.value)}
                                            placeholder="e.g., GHPX-RED-L"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Price</Label>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={variant.price}
                                            onChange={(e) => updateVariant(variant.id, "price", parseFloat(e.target.value) || 0)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <h5 className="text-sm font-medium mb-3">Stock Information</h5>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-2">
                                            <Label>Current Stock</Label>
                                            <Input
                                                type="number"
                                                value={variant.current_stock}
                                                onChange={(e) => updateVariant(variant.id, "current_stock", parseInt(e.target.value) || 0)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Reserved Stock</Label>
                                            <Input
                                                type="number"
                                                value={variant.reserved_stock}
                                                onChange={(e) => updateVariant(variant.id, "reserved_stock", parseInt(e.target.value) || 0)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Low Stock Threshold</Label>
                                            <Input
                                                type="number"
                                                value={variant.low_stock_threshold}
                                                onChange={(e) => updateVariant(variant.id, "low_stock_threshold", parseInt(e.target.value) || 0)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="flex gap-4 justify-end">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Creating..." : "Create Product"}
                    </Button>
                </div>
            </form>
        </div>
    )
}

