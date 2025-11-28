"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, Upload } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

interface Product {
    id: string
    title: string
    slug: string
    description: string
    categoryId: string
    badge?: string
    isActive: boolean
    status: "pending" | "approved" | "rejected"
    images: Array<{ id: string; url: string; isPrimary: boolean }>
    variants: Array<{ id: string; name: string; sku: string; price: number; stock: number }>
}

interface EditProductDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    product: Product
}

interface ProductVariant {
    id?: string
    name: string
    sku: string
    price: string
    stock: string
}

interface ProductImage {
    id?: string
    file: File | null
    preview: string
    isPrimary: boolean
}

export function EditProductDialog({ open, onOpenChange, product }: EditProductDialogProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [title, setTitle] = useState(product.title)
    const [description, setDescription] = useState(product.description)
    const [categoryId, setCategoryId] = useState(product.categoryId)
    const [badge, setBadge] = useState(product.badge || "")
    const [isActive, setIsActive] = useState(product.isActive)

    const [variants, setVariants] = useState<ProductVariant[]>(
        product.variants.map((v) => ({
            id: v.id,
            name: v.name,
            sku: v.sku,
            price: v.price.toString(),
            stock: v.stock.toString(),
        })),
    )

    const [images, setImages] = useState<ProductImage[]>(
        product.images.map((img) => ({
            id: img.id,
            file: null,
            preview: img.url,
            isPrimary: img.isPrimary,
        })),
    )

    // Reset form when product changes
    useEffect(() => {
        setTitle(product.title)
        setDescription(product.description)
        setCategoryId(product.categoryId)
        setBadge(product.badge || "")
        setIsActive(product.isActive)
        setVariants(
            product.variants.map((v) => ({
                id: v.id,
                name: v.name,
                sku: v.sku,
                price: v.price.toString(),
                stock: v.stock.toString(),
            })),
        )
        setImages(
            product.images.map((img) => ({
                id: img.id,
                file: null,
                preview: img.url,
                isPrimary: img.isPrimary,
            })),
        )
    }, [product])

    const handleAddVariant = () => {
        setVariants([...variants, { name: "", sku: "", price: "", stock: "" }])
    }

    const handleRemoveVariant = (index: number) => {
        if (variants.length > 1) {
            setVariants(variants.filter((_, i) => i !== index))
        }
    }

    const handleVariantChange = (index: number, field: keyof ProductVariant, value: string) => {
        const updated = [...variants]
        updated[index][field] = value
        setVariants(updated)
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        const newImages = files.map((file) => ({
            file,
            preview: URL.createObjectURL(file),
            isPrimary: images.length === 0,
        }))
        setImages([...images, ...newImages])
    }

    const handleRemoveImage = (index: number) => {
        const updated = images.filter((_, i) => i !== index)
        if (images[index].isPrimary && updated.length > 0) {
            updated[0].isPrimary = true
        }
        setImages(updated)
    }

    const handleSetPrimaryImage = (index: number) => {
        const updated = images.map((img, i) => ({ ...img, isPrimary: i === index }))
        setImages(updated)
    }

    const handleSubmit = async () => {
        if (!title.trim()) {
            toast.warning("Product title is required")
            return
        }

        if (!categoryId) {
            toast.warning("Please select a category")
            return
        }

        if (variants.some((v) => !v.sku || !v.price || !v.stock)) {
            toast.warning("All variant fields are required")
            return
        }

        setIsSubmitting(true)

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))

            console.log("[v0] Updating product:", {
                id: product.id,
                title,
                description,
                categoryId,
                badge,
                isActive,
                variants,
                images: images.map((img) => ({ id: img.id, isPrimary: img.isPrimary })),
            })

            toast("Product updated successfully")
            onOpenChange(false)
        } catch (error) {
            toast("Failed to update product")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogDescription>Update product details and variants</DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Basic Information</h3>

                        <div className="space-y-2">
                            <Label htmlFor="edit-title">Product Title *</Label>
                            <Input
                                id="edit-title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., Gaming Keyboard RGB"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-description">Description</Label>
                            <Textarea
                                id="edit-description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your product..."
                                rows={4}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-category">Category *</Label>
                                <Select value={categoryId} onValueChange={setCategoryId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="cat-1">Keyboards</SelectItem>
                                        <SelectItem value="cat-2">Mice</SelectItem>
                                        <SelectItem value="cat-3">Headsets</SelectItem>
                                        <SelectItem value="cat-4">Monitors</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-badge">Badge (Optional)</Label>
                                <Input
                                    id="edit-badge"
                                    value={badge}
                                    onChange={(e) => setBadge(e.target.value)}
                                    placeholder="e.g., Best Seller"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="edit-active">Active Product</Label>
                            <Switch checked={isActive} onCheckedChange={setIsActive} />
                        </div>
                    </div>

                    {/* Product Images */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Product Images</h3>

                        <div className="grid grid-cols-4 gap-4">
                            {images.map((img, index) => (
                                <div key={index} className="relative group">
                                    <img
                                        src={img.preview || "/placeholder.svg"}
                                        alt={`Product ${index + 1}`}
                                        className="w-full aspect-square object-cover rounded-lg"
                                    />
                                    {img.isPrimary && <Badge className="absolute top-2 left-2 bg-primary">Primary</Badge>}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                                        {!img.isPrimary && (
                                            <Button size="sm" variant="secondary" onClick={() => handleSetPrimaryImage(index)}>
                                                Set Primary
                                            </Button>
                                        )}
                                        <Button size="sm" variant="destructive" onClick={() => handleRemoveImage(index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            <label className="border-2 border-dashed rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors">
                                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                <span className="text-sm text-muted-foreground">Upload</span>
                                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                        </div>
                    </div>

                    {/* Product Variants */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold">Product Variants</h3>
                            <Button variant="outline" size="sm" onClick={handleAddVariant}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Variant
                            </Button>
                        </div>

                        {variants.map((variant, index) => (
                            <div key={index} className="border rounded-lg p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label>Variant {index + 1}</Label>
                                    {variants.length > 1 && (
                                        <Button variant="ghost" size="sm" onClick={() => handleRemoveVariant(index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Variant Name *</Label>
                                        <Input
                                            value={variant.name}
                                            onChange={(e) => handleVariantChange(index, "name", e.target.value)}
                                            placeholder="e.g., Standard, XL"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>SKU *</Label>
                                        <Input
                                            value={variant.sku}
                                            onChange={(e) => handleVariantChange(index, "sku", e.target.value)}
                                            placeholder="e.g., KB-001-STD"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Price (Rp) *</Label>
                                        <Input
                                            type="number"
                                            value={variant.price}
                                            onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                                            placeholder="0"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Stock *</Label>
                                        <Input
                                            type="number"
                                            value={variant.stock}
                                            onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
