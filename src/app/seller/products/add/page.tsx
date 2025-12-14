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
import { toast } from "sonner"

export default function AddProductPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        description: "",
        categoryId: "",
        badge: "",
        isActive: true,
    })

    const [images, setImages] = useState<Array<{ id: string; url: string; file?: File; isPrimary: boolean }>>([])
    const [variants, setVariants] = useState([{ id: "1", name: "", sku: "", price: 0, stock: 0 }])

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
        setVariants([...variants, { id: `${Date.now()}`, name: "", sku: "", price: 0, stock: 0 }])
    }

    const removeVariant = (id: string) => {
        if (variants.length > 1) {
            setVariants(variants.filter((v) => v.id !== id))
        }
    }

    const updateVariant = (id: string, field: string, value: any) => {
        setVariants(variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        toast("Product created successfully")

        setLoading(false)
        router.push("/seller/products")
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
                                    value={formData.categoryId}
                                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cat-1">Keyboards</SelectItem>
                                        <SelectItem value="cat-2">Mice</SelectItem>
                                        <SelectItem value="cat-3">Headsets</SelectItem>
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
                                checked={formData.isActive}
                                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
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
                                <CardDescription>Add different variants of your product</CardDescription>
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Variant
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {variants.map((variant, index) => (
                            <div key={variant.id} className="flex gap-4 items-start p-4 rounded-lg border">
                                <div className="flex-1 grid grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <Label>Variant Name</Label>
                                        <Input
                                            value={variant.name}
                                            onChange={(e) => updateVariant(variant.id, "name", e.target.value)}
                                            placeholder="e.g., Standard"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>SKU</Label>
                                        <Input
                                            value={variant.sku}
                                            onChange={(e) => updateVariant(variant.id, "sku", e.target.value)}
                                            placeholder="e.g., KB-001-STD"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Price (Rp)</Label>
                                        <Input
                                            type="number"
                                            value={variant.price}
                                            onChange={(e) => updateVariant(variant.id, "price", Number.parseInt(e.target.value) || 0)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Stock</Label>
                                        <Input
                                            type="number"
                                            value={variant.stock}
                                            onChange={(e) => updateVariant(variant.id, "stock", Number.parseInt(e.target.value) || 0)}
                                            required
                                        />
                                    </div>
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
                        ))}
                    </CardContent>
                </Card>

                <div className="flex gap-4 justify-end">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create Product"}
                    </Button>
                </div>
            </form>
        </div>
    )
}
