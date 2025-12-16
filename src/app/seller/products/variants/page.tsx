"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Edit, AlertTriangle, TrendingUp, TrendingDown, Package, DollarSign } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useGetSellerProducts } from "@/services/api/product-service"

export default function VariantsPage() {
    const { data } = useGetSellerProducts()
    const products = data.products

    const allVariants = products.flatMap(product =>
        (product.variants || []).map(variant => ({
            ...variant,
            productTitle: product.title,
            productSlug: product.slug
        }))
    )

    const [searchQuery, setSearchQuery] = useState("")
    const [filterProduct, setFilterProduct] = useState("all")
    const [isEditOpen, setIsEditOpen] = useState(false)
    const [editingVariant, setEditingVariant] = useState<any | null>(null)
    const [formData, setFormData] = useState({ sku: "", price: "", stock: "" })
    const [isLoading, setIsLoading] = useState(false)

    const totalVariants = data.count_variant
    const totalStock = data.total_stock
    const stockAlerts = data.total_stock_alert
    const totalValue = data.total_inventory_value

    const filteredVariants = allVariants.filter((variant: any) => {
        const matchesSearch =
            variant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            variant.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
            variant.productTitle.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesFilter =
            filterProduct === "all" ||
            (filterProduct === variant.product_id)

        return matchesSearch && matchesFilter
    })

    const handleEdit = (variant: any) => {
        setEditingVariant(variant)
        setFormData({
            sku: variant.sku,
            price: variant.price.toString(),
            stock: variant.stock.current_stock.toString(),
        })
        setIsEditOpen(true)
    }

    const handleUpdate = async () => {
        if (!editingVariant) return

        if (!formData.sku.trim()) {
            toast("SKU is required")
            return
        }

        const price = Number.parseFloat(formData.price)
        if (Number.isNaN(price) || price <= 0) {
            toast("Please enter a valid price greater than 0")
            return
        }

        const stock = Number.parseInt(formData.stock)
        if (Number.isNaN(stock) || stock < 0) {
            toast("Please enter a valid stock quantity")
            return
        }

        setIsLoading(true)

        await new Promise((resolve) => setTimeout(resolve, 1000))

        toast(`Variant "${editingVariant.name}" has been updated successfully`)

        setIsLoading(false)
        setIsEditOpen(false)
        setEditingVariant(null)
    }

    const getStockStatus = (stock: number) => {
        if (stock === 0) {
            return { icon: AlertTriangle, color: "text-red-500", label: "Out of Stock" }
        }
        if (stock < 10) {
            return { icon: TrendingDown, color: "text-orange-500", label: "Low Stock" }
        }
        return { icon: TrendingUp, color: "text-green-500", label: "In Stock" }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold sm:text-3xl">Product Variants</h1>
                <p className="text-sm text-muted-foreground sm:text-base">Manage inventory and pricing for all variants</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="rounded-full bg-primary/10 p-2 sm:p-3">
                                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground sm:text-sm">Total Variants</p>
                                <p className="text-xl font-bold sm:text-2xl">{totalVariants}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="rounded-full bg-accent/10 p-2 sm:p-3">
                                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-accent" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground sm:text-sm">Total Stock</p>
                                <p className="text-xl font-bold sm:text-2xl">{totalStock}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="rounded-full bg-orange-500/10 p-2 sm:p-3">
                                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-muted-foreground sm:text-sm">Stock Alerts</p>
                                <p className="text-xl font-bold sm:text-2xl">
                                    {stockAlerts}
                                    <span className="ml-1 block text-xs font-normal text-muted-foreground sm:ml-2 sm:inline sm:text-sm">
                                        (Total alerts)
                                    </span>
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="rounded-full bg-green-500/10 p-2 sm:p-3">
                                <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground sm:text-sm">Inventory Value</p>
                                <p className="text-xl font-bold sm:text-2xl">
                                    {totalValue >= 1000000 ? `Rp ${(totalValue / 1000000).toFixed(1)}Jt` : formatCurrency(totalValue)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Variants Table Card */}
            <Card>
                <CardHeader className="p-4 sm:p-6">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Search by product, variant, or SKU..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
                        <Select value={filterProduct} onValueChange={setFilterProduct}>
                            <SelectTrigger className="w-full sm:w-[200px]">
                                <SelectValue placeholder="Filter by product" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Products</SelectItem>
                                {products.map((product) => (
                                    <SelectItem key={product.id} value={product.id}>
                                        {product.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>

                <CardContent className="p-0 sm:p-6">
                    {/* Desktop Table View */}
                    <div className="hidden md:block">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Variant</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Value</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredVariants.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                            No variants found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredVariants.map((variant: any) => {
                                        const status = getStockStatus(variant.stock.current_stock)
                                        const StatusIcon = status.icon
                                        return (
                                            <TableRow key={variant.id}>
                                                <TableCell className="font-medium">{variant.productTitle}</TableCell>
                                                <TableCell>{variant.name}</TableCell>
                                                <TableCell className="font-mono text-sm text-muted-foreground">{variant.sku}</TableCell>
                                                <TableCell>{formatCurrency(variant.price)}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <StatusIcon className={`h-4 w-4 ${status.color}`} />
                                                        <span className={status.color}>{variant.stock.current_stock}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="font-medium">{formatCurrency(variant.price * variant.stock.current_stock)}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(variant)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="space-y-3 p-4 md:hidden">
                        {filteredVariants.length === 0 ? (
                            <div className="py-8 text-center text-muted-foreground">No variants found</div>
                        ) : (
                            filteredVariants.map((variant: any) => {
                                const status = getStockStatus(variant.stock.current_stock)
                                const StatusIcon = status.icon
                                return (
                                    <Card key={variant.id}>
                                        <CardContent className="space-y-3 p-4">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="truncate text-sm font-semibold">{variant.productTitle}</h3>
                                                    <p className="text-xs text-muted-foreground">{variant.name}</p>
                                                </div>
                                                <Button variant="ghost" size="sm" onClick={() => handleEdit(variant)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <p className="text-xs text-muted-foreground">SKU</p>
                                                    <p className="font-mono font-medium">{variant.sku}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Price</p>
                                                    <p className="font-medium">{formatCurrency(variant.price)}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Stock</p>
                                                    <div className="flex items-center gap-1">
                                                        <StatusIcon className={`h-3 w-3 ${status.color}`} />
                                                        <span className={`font-medium ${status.color}`}>{variant.stock.current_stock}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground">Value</p>
                                                    <p className="font-medium">{formatCurrency(variant.price * variant.stock.current_stock)}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="w-[calc(100%-2rem)] max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg sm:text-xl">Edit Variant</DialogTitle>
                        <DialogDescription className="text-sm">
                            Update details for {editingVariant?.productTitle} - {editingVariant?.name}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="sku" className="text-sm">
                                SKU
                            </Label>
                            <Input
                                id="sku"
                                value={formData.sku}
                                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                placeholder="e.g., KB-001-STD"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price" className="text-sm">
                                Price (Rp)
                            </Label>
                            <Input
                                id="price"
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="e.g., 467350"
                                min="0"
                                step="1000"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="stock" className="text-sm">
                                Stock Quantity
                            </Label>
                            <Input
                                id="stock"
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                placeholder="e.g., 45"
                                min="0"
                            />
                        </div>
                    </div>

                    <DialogFooter className="flex-col gap-2 sm:flex-row">
                        <Button
                            variant="outline"
                            onClick={() => setIsEditOpen(false)}
                            disabled={isLoading}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleUpdate} disabled={isLoading} className="w-full sm:w-auto">
                            {isLoading ? "Updating..." : "Update Variant"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
